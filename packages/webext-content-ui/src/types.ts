/** A resolved anchor value: a live Element, or a static/live collection of them. */
export type AnchorValue =
	| Element
	| NodeListOf<Element>
	| HTMLCollectionOf<Element>
	| Element[]
	| null
	| undefined;

/** A function that resolves anchor(s) against a root at mount/re-check time. */
export type AnchorResolver = (root: ParentNode) => AnchorValue;

/**
 * A CSS selector string, a live Element, a resolver function, or a list
 * mixing any of those. Strings are re-queried fresh on every call (safest
 * default). A direct Element/NodeList is a snapshot taken at config time —
 * fine when the anchor is already known to exist, but won't pick up
 * elements that appear later. A resolver function is called lazily each
 * time anchors are resolved, so it can express arbitrary lookups
 * (`(root) => root.querySelector('h2')`, `getElementById`, nth-match, etc.)
 * without going stale.
 */
export type AnchorInput =
	| string
	| Element
	| AnchorResolver
	| Array<string | Element | AnchorResolver>;

/** Where the shadow host is placed relative to its matched anchor element. */
export type InjectPosition =
	| "before"
	| "after"
	| "append"
	| "prepend"
	| "replace";

/** Result handed back from onMount; passed through to onRemove for cleanup. */
export type MountResult = unknown;

export interface MountContext {
	/** The shadow root's content container (the element you render into). */
	container: HTMLElement;
	/** The shadow root itself. */
	shadowRoot: ShadowRoot;
	/** The DOM node this injection was anchored to. */
	anchor: Element;
	/** Index of this anchor within the batch (0 for single-element injections). */
	index: number;
}

export interface InjectOptions {
	/** Unique name for this injection; used as the host element tag/id prefix. */
	name: string;

	/** Selector, element, or list of elements to inject next to/into. */
	anchor: AnchorInput;

	/** Placement of the shadow host relative to each matched anchor. Default: 'append'. */
	position?: InjectPosition;

	/**
	 * When true, all matched anchors share ONE shadow root + one style injection
	 * (Plasmo-overlay style). When false (default), each anchor gets its own
	 * shadow root, but CSS text is still deduplicated via a shared
	 * CSSStyleSheet (adoptedStyleSheets) rather than re-injected per root.
	 */
	sharedRoot?: boolean;

	/**
	 * When true (default), CSS text passed via `css` is shared across all
	 * shadow roots created by ALL injectors using the same styleKey, via
	 * adoptedStyleSheets. When false, styles are not deduplicated.
	 */
	sharedStyle?: boolean;

	/**
	 * Key used to dedupe shared stylesheets across separate injector
	 * instances/files. Defaults to `name` when omitted.
	 */
	styleKey?: string;

	/** Raw CSS text to inject into the shadow root(s). */
	css?: string;

	/**
	 * Observe the DOM for anchors matching a selector added after initial
	 * mount, and auto-mount into them. Only meaningful when `anchor` is a
	 * selector string. Default: false.
	 */
	autoDetect?: boolean;

	/**
	 * Tag name for the shadow host element. Default: 'div'. Host has
	 * `display: contents` applied, so pick a tag valid in the anchor's
	 * context (e.g. 'tr' inside a `<table>`, 'li' inside a list).
	 */
	hostTag?: keyof HTMLElementTagNameMap;

	/** Tag name for the inner container/slot element(s). Default: 'div'. */
	containerTag?: keyof HTMLElementTagNameMap;

	/** Called once per matched anchor after its shadow root/container exist. */
	onMount: (ctx: MountContext) => MountResult;

	/** Called once per anchor when its injection is removed/unmounted. */
	onRemove?: (result: MountResult, ctx: MountContext) => void;
}

export interface MountedInstance {
	anchor: Element;
	host: HTMLElement;
	shadowRoot: ShadowRoot;
	container: HTMLElement;
	result: MountResult;
}

export interface Injector {
	/** Mount into every anchor currently matching, and start auto-detect if enabled. */
	mount: () => void;
	/** Unmount all instances and stop observing. */
	remove: () => void;
	/** Currently mounted instances, in mount order. */
	instances: () => MountedInstance[];
}
