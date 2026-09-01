import { type AnchorInput, type AnchorValue } from "./types";

/**
 * Add AnchorValue (element or collection) to deduplication set.
 * @param found - Set to accumulate elements into
 * @param value - Element, collection, or null/undefined to add
 */
function addValue(found: Set<Element>, value: AnchorValue): void {
	if (!value) return;
	if (value instanceof Element) {
		found.add(value);
		return;
	}
	for (const el of value) found.add(el);
}

/**
 * Resolve an AnchorInput into a de-duplicated array of live elements, in document order.
 * Handles selector strings (queried fresh), Elements, and resolver functions.
 *
 * @param input - CSS selector, Element, resolver function, or array mix
 * @param root - Search root (default: document)
 * @returns Array of unique Elements in document order
 */
export function resolveAnchors(
	input: AnchorInput,
	root: ParentNode = document,
): Element[] {
	const found = new Set<Element>();

	const items = Array.isArray(input) ? input : [input];
	for (const item of items) {
		if (typeof item === "string") {
			for (const el of root.querySelectorAll(item)) found.add(el);
		} else if (typeof item === "function") {
			addValue(found, item(root));
		} else if (item instanceof Element) {
			found.add(item);
		}
	}

	return [...found];
}

/**
 * Start observing root for new elements matching selector, triggering onNew for each.
 * Elements already in known set are skipped. Returns disconnect function to stop watching.
 *
 * @param selector - CSS selector to match new elements
 * @param known - Set tracking already-seen elements (mutated on each new match)
 * @param onNew - Callback invoked per newly-matched element
 * @param root - Root element to observe (default: document.body)
 * @returns Function to stop watching
 */
export function watchForAnchors(
	selector: string,
	known: Set<Element>,
	onNew: (el: Element) => void,
	root: Node = document.body,
): () => void {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue;

				const candidates = node.matches(selector)
					? [node]
					: [...node.querySelectorAll(selector)];

				for (const el of candidates) {
					if (!known.has(el)) {
						known.add(el);
						onNew(el);
					}
				}
			}
		}
	});

	observer.observe(root, { childList: true, subtree: true });
	return () => observer.disconnect();
}
