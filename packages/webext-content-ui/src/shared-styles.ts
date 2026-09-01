/** Registry of shared CSSStyleSheet objects, keyed by styleKey + css text hash. */
const sheetRegistry = new Map<string, CSSStyleSheet | null>();

/** Regex to detect @import rules in CSS (cheap heuristic). */
const HAS_IMPORT = /@import\b/i;

/**
 * Check if runtime supports constructible stylesheets via adoptedStyleSheets API.
 * @returns True when CSSStyleSheet.prototype.replaceSync is available
 */
export function supportsConstructibleStylesheets(): boolean {
	return (
		typeof CSSStyleSheet !== "undefined" &&
		typeof (CSSStyleSheet.prototype as { replaceSync?: unknown })
			.replaceSync === "function"
	);
}

/**
 * Generate unique registry key from styleKey + css content.
 * Includes css length and hash to invalidate on content changes (e.g. hot reload).
 *
 * @param styleKey - Dedup key from ContentUiOptions
 * @param css - Raw CSS text
 * @returns Unique cache key
 */
function registryKey(styleKey: string, css: string): string {
	let hash = 0;
	for (let i = 0; i < css.length; i++) {
		hash = (hash * 31 + css.charCodeAt(i)) | 0;
	}
	return `${styleKey}::${css.length}::${hash}`;
}

/**
 * Get or create shared CSSStyleSheet for (styleKey, css).
 * Returns null if css contains @import or replaceSync fails; caller should fall back to <style> tag.
 *
 * @param styleKey - Dedup key
 * @param css - Raw CSS text
 * @returns CSSStyleSheet or null (for @import or failed construction)
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

/**
 * Check if node is a Document (realm-safe via nodeType, not instanceof).
 * @param node - Node to check
 * @returns True if node is Document
 */
function isDocument(node: ShadowRoot | Document): node is Document {
	return node.nodeType === 9; // Node.DOCUMENT_NODE
}

/**
 * Apply CSS to root (ShadowRoot or Document), deduplicating via adoptedStyleSheets when supported.
 * Falls back to <style> tag when constructible sheets unsupported or css contains @import.
 *
 * @param root - ShadowRoot or Document to apply styles to
 * @param css - Raw CSS text
 * @param styleKey - Dedup key for shared stylesheet
 * @param shared - Enable dedup across injectors (requires supportsConstructibleStylesheets)
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

/**
 * Clear all registered shared stylesheets. Use for test isolation.
 */
export function clearSharedStyleRegistry(): void {
	sheetRegistry.clear();
}

/**
 * Get count of distinct (styleKey, css) pairs in registry.
 * Includes failed constructions and @import fallbacks.
 *
 * @returns Number of cached styles
 */
export function sharedStyleRegistrySize(): number {
	return sheetRegistry.size;
}
