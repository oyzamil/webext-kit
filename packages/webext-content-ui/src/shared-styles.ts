/**
 * Registry of shared CSSStyleSheet objects, keyed by styleKey + css text.
 * One CSSStyleSheet is constructed per unique (key, css) pair and reused
 * (adopted) across every shadow root that asks for it — this is what
 * avoids re-shipping/re-parsing the same Tailwind bundle per shadow host.
 */
const sheetRegistry = new Map<string, CSSStyleSheet>();

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

function getOrCreateSheet(styleKey: string, css: string): CSSStyleSheet {
	const key = registryKey(styleKey, css);
	const existing = sheetRegistry.get(key);
	if (existing) return existing;

	const sheet = new CSSStyleSheet();
	sheet.replaceSync(css);
	sheetRegistry.set(key, sheet);
	return sheet;
}

/**
 * Apply `css` to `shadowRoot`, deduplicating across calls that share the
 * same styleKey + css text when `shared` is true and the runtime supports
 * adoptedStyleSheets. Falls back to a plain injected <style> tag otherwise
 * (still isolated by the shadow boundary, just not deduplicated).
 */
export function applyStyles(
	shadowRoot: ShadowRoot,
	css: string,
	styleKey: string,
	shared: boolean,
): void {
	if (!css) return;

	if (shared && supportsConstructibleStylesheets()) {
		const sheet = getOrCreateSheet(styleKey, css);
		shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
		return;
	}

	const style = document.createElement("style");
	style.textContent = css;
	style.dataset.styleKey = styleKey;
	shadowRoot.appendChild(style);
}

/** Remove every registered shared sheet. Mainly for test isolation. */
export function clearSharedStyleRegistry(): void {
	sheetRegistry.clear();
}

/** Number of distinct shared sheets currently registered. Useful for tests/debugging. */
export function sharedStyleRegistrySize(): number {
	return sheetRegistry.size;
}
