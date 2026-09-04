import { ownerDocumentOf, styleParent } from "./dom-utils";

/**
 * Registry of shared CSSStyleSheet objects, keyed by styleKey + css text hash.
 *
 * Backed by `globalThis` (not a module-local Map) so it's shared across
 * separate content-script bundles. Each `defineContentScript` entry is
 * built and executed as its own file/module graph, so a plain module-level
 * `const` here would give every content script its own copy — no dedup
 * across scripts even though they run in the same isolated-world global
 * object for a given frame. Keying off `globalThis` fixes that.
 */
const REGISTRY_KEY = "__webext_content_ui_sheet_registry__";
function getSheetRegistry(): Map<string, CSSStyleSheet | null> {
	const g = globalThis as typeof globalThis & {
		[REGISTRY_KEY]?: Map<string, CSSStyleSheet | null>;
	};
	if (!g[REGISTRY_KEY]) g[REGISTRY_KEY] = new Map();
	return g[REGISTRY_KEY];
}

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
	const sheetRegistry = getSheetRegistry();
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

	const style = ownerDocumentOf(root).createElement("style");
	style.textContent = css;
	style.dataset.styleKey = styleKey;
	styleParent(root).appendChild(style);
}

/**
 * Clear all registered shared stylesheets. Use for test isolation.
 */
export function clearSharedStyleRegistry(): void {
	getSheetRegistry().clear();
}

/**
 * Get count of distinct (styleKey, css) pairs in registry.
 * Includes failed constructions and @import fallbacks.
 *
 * @returns Number of cached styles
 */
export function sharedStyleRegistrySize(): number {
	return getSheetRegistry().size;
}

/**
 * Fetch CSS text once and cache the in-flight/settled promise on `globalThis`,
 * keyed by URL. Use this in `main()` before calling createShadowRootUi when
 * cssInjectionMode is "manual" and multiple content scripts share the same
 * built CSS file (e.g. a shared Tailwind bundle) — the first content script
 * to run does the fetch, every later one (same page, same frame) reuses it.
 *
 * @param url - browser.runtime.getURL(...) result for the built CSS file
 * @returns Promise resolving to the CSS text
 */
const FETCH_CACHE_KEY = "__webext_content_ui_css_fetch_cache__";
export function getSharedCssText(url: string): Promise<string> {
	const g = globalThis as typeof globalThis & {
		[FETCH_CACHE_KEY]?: Map<string, Promise<string>>;
	};
	if (!g[FETCH_CACHE_KEY]) g[FETCH_CACHE_KEY] = new Map();
	const cache = g[FETCH_CACHE_KEY];
	let pending = cache.get(url);
	if (!pending) {
		pending = fetch(url).then((r) => r.text());
		cache.set(url, pending);
	}
	return pending;
}
