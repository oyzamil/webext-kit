/**
 * Registry of shared CSSStyleSheet objects, keyed by styleKey + css text.
 * One CSSStyleSheet is constructed per unique (key, css) pair and reused
 * (adopted) across every shadow root that asks for it — this is what
 * avoids re-shipping/re-parsing the same Tailwind bundle per shadow host.
 * A `null` entry means construction was skipped/failed for this css (e.g.
 * it contains `@import`) — cached so we don't recheck every call.
 */
const sheetRegistry = new Map<string, CSSStyleSheet | null>();

/**
 * Cheap heuristic for "this css has an @import rule". Constructible
 * stylesheets don't allow it: some browsers throw on `replaceSync`, but
 * Chrome (recent versions) just drops the rule and logs a console warning
 * WITHOUT throwing — so we can't rely on try/catch to detect it, and have
 * to keep @import css off the replaceSync path entirely to avoid the
 * warning. May false-positive on "@import" appearing in a comment/string,
 * which just means an unnecessary (but harmless) fallback to <style>.
 */
const HAS_IMPORT = /@import\b/i;

/** True when the runtime supports constructible stylesheets + adoptedStyleSheets. */
export function supportsConstructibleStylesheets(): boolean {
	return (
		typeof CSSStyleSheet !== "undefined" &&
		typeof (CSSStyleSheet.prototype as { replaceSync?: unknown })
			.replaceSync === "function"
	);
}

function registryKey(styleKey: string, css: string): string {
	// Include css length + a cheap hash so the same key with different CSS
	// (e.g. hot-reloaded content) doesn't silently reuse a stale sheet.
	let hash = 0;
	for (let i = 0; i < css.length; i++) {
		hash = (hash * 31 + css.charCodeAt(i)) | 0;
	}
	return `${styleKey}::${css.length}::${hash}`;
}

/**
 * Returns a shared CSSStyleSheet for (styleKey, css), or `null` when it
 * should NOT go through the constructible-sheet path — either because
 * `css` contains `@import` (see HAS_IMPORT above), or the runtime rejected
 * `replaceSync` outright:
 * https://github.com/WICG/construct-stylesheets/issues/119#issuecomment-588352418
 * Callers should fall back to a plain <style> tag in that case (@import
 * works fine there, no warning).
 */
function getOrCreateSheet(styleKey: string, css: string): CSSStyleSheet | null {
	const key = registryKey(styleKey, css);
	if (sheetRegistry.has(key)) return sheetRegistry.get(key)!;

	if (HAS_IMPORT.test(css)) {
		sheetRegistry.set(key, null);
		return null;
	}

	const sheet = new CSSStyleSheet();
	try {
		sheet.replaceSync(css);
	} catch {
		sheetRegistry.set(key, null);
		return null;
	}
	sheetRegistry.set(key, sheet);
	return sheet;
}

function isDocument(node: ShadowRoot | Document): node is Document {
	return node.nodeType === 9; // Node.DOCUMENT_NODE — realm-safe, instanceof Document ain't (fails cross-frame)
}

/**
 * Apply `css` to `root` (a ShadowRoot, or a Document for shadow-less
 * injection modes), deduplicating across calls that share the same
 * styleKey + css text when `shared` is true and the runtime supports
 * adoptedStyleSheets. Falls back to a plain injected <style> tag when
 * that's unsupported, OR when `css` can't be built into a constructible
 * sheet (e.g. it has `@import` — see getOrCreateSheet above). The <style>
 * tag fallback is per-root, so `@import` CSS is never deduped across
 * multiple hosts — only the sheet-based path shares.
 */
export function applyStyles(
	root: ShadowRoot | Document,
	css: string,
	styleKey: string,
	shared: boolean,
): void {
	if (!css) return;

	if (shared && supportsConstructibleStylesheets()) {
		const sheet = getOrCreateSheet(styleKey, css);
		if (sheet) {
			root.adoptedStyleSheets = [...(root.adoptedStyleSheets ?? []), sheet];
			return;
		}
	}

	const doc = isDocument(root) ? root : (root.ownerDocument ?? document);
	const style = doc.createElement("style");
	style.textContent = css;
	style.dataset.styleKey = styleKey;
	(isDocument(root) ? (root.head ?? root.documentElement) : root).appendChild(
		style,
	);
}

/** Remove every registered shared sheet. Mainly for test isolation. */
export function clearSharedStyleRegistry(): void {
	sheetRegistry.clear();
}

/** Number of distinct (styleKey, css) pairs registered — including entries
 * that failed sheet construction (e.g. @import) and fell back to <style>.
 * Useful for tests/debugging. */
export function sharedStyleRegistrySize(): number {
	return sheetRegistry.size;
}
