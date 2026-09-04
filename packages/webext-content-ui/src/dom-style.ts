/**
 * Simple id-keyed style injection: `addStyleToDom(id, css)` / `removeStyleFromDom(id)`.
 *
 * Distinct from `applyStyles`/`getSharedCssText` in shared-styles.ts, which dedupe by
 * CONTENT (hash of styleKey+css, used internally by the injectors for the `css` option).
 * This one dedupes by ID — call it twice with the same id and different CSS and it
 * REPLACES the previous stylesheet, which is what you want for e.g. a UI panel that
 * swaps its own override styles at runtime (theme toggle, per-page tweak, etc).
 */

import { ownerDocumentOf, styleParent } from "./dom-utils";

/** Handle returned by addStyleToDom. */
export interface StyleHandle {
	/** The id this style was registered under. */
	id: string;
	/** Remove this stylesheet from the DOM. Safe to call multiple times. */
	remove: () => void;
}

/**
 * Build the CSS attribute-selector fragment used to find the `<style>` for a given id.
 * @param id - Style id (as passed to addStyleToDom/removeStyleFromDom)
 * @returns Attribute selector, e.g. `[data-webext-style-id="foo"]`
 */
function attr(id: string): string {
	return `[data-webext-style-id="${CSS.escape(id)}"]`;
}

/**
 * Add (or replace) a `<style>` element identified by `id`. Calling this again with the
 * same `id` removes the previous element first — no duplicate/stacked stylesheets.
 *
 * @param id - Unique key for this stylesheet. Scoped to `root` (same id in a document
 *   and in a shadow root are independent — they don't collide).
 * @param css - Raw CSS text.
 * @param root - Where to inject: `document` (default) or a `ShadowRoot`.
 * @returns Handle with `.remove()` to take the stylesheet back out.
 */
export function addStyleToDom(
	id: string,
	css: string,
	root: Document | ShadowRoot = document,
): StyleHandle {
	removeStyleFromDom(id, root);

	const style = ownerDocumentOf(root).createElement("style");
	style.textContent = css;
	style.dataset.webextStyleId = id;
	styleParent(root).appendChild(style);

	return {
		id,
		remove: () => removeStyleFromDom(id, root),
	};
}

/**
 * Remove a stylesheet previously added via `addStyleToDom` (or a no-op if none exists
 * under that id). Prefer calling `.remove()` on the handle `addStyleToDom` returns —
 * this standalone function is for removing by id when you don't have the handle around
 * (e.g. cleanup in a different scope/callback than where it was added).
 *
 * @param id - The id passed to `addStyleToDom`.
 * @param root - Same root it was added to (`document` by default).
 */
export function removeStyleFromDom(
	id: string,
	root: Document | ShadowRoot = document,
): void {
	root.querySelector(`style${attr(id)}`)?.remove();
}
