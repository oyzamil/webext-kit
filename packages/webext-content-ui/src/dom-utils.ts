/**
 * Internal helpers shared between shared-styles.ts and dom-style.ts. Not exported from
 * index.ts — both style-injection paths need to tell a Document from a ShadowRoot and
 * find where a `<style>` element belongs, and duplicating that in two files invites them
 * to drift.
 */

/**
 * Realm-safe Document check (via nodeType, not `instanceof` — an `instanceof` check can
 * give a false negative across iframe/document realms where constructors differ).
 * @param node - Node to check
 * @returns True if node is a Document
 */
export function isDocument(node: ShadowRoot | Document): node is Document {
	return node.nodeType === 9; // Node.DOCUMENT_NODE
}

/**
 * Resolve the element a `<style>` tag should be appended to for a given root.
 * @param root - ShadowRoot or Document to inject into
 * @returns `root.head` (or `documentElement` as a fallback) for a Document, or `root` itself for a ShadowRoot
 */
export function styleParent(root: ShadowRoot | Document): ParentNode {
	return isDocument(root) ? (root.head ?? root.documentElement) : root;
}

/**
 * Resolve the owner Document for a root, used to create elements with `createElement`.
 * @param root - ShadowRoot or Document
 * @returns The Document itself, or the ShadowRoot's owner document
 */
export function ownerDocumentOf(root: ShadowRoot | Document): Document {
	return isDocument(root) ? root : (root.ownerDocument ?? document);
}
