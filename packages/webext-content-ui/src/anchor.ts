import { type AnchorInput, type AnchorValue } from "./types";

function addValue(found: Set<Element>, value: AnchorValue): void {
	if (!value) return;
	if (value instanceof Element) {
		found.add(value);
		return;
	}
	for (const el of value) found.add(el);
}

/** Resolve an AnchorInput into a de-duplicated array of live elements, in document order. */
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
 * Start observing `root` for new elements matching `selector` that are not
 * already in `known`. Calls `onNew` once per newly-appeared match, in the
 * order encountered. Returns a disconnect function.
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
