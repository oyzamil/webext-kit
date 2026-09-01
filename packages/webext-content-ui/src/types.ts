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
export type ContentUiPosition =
	| "before"
	| "after"
	| "append"
	| "prepend"
	| "replace";

/** Result handed back from onMount; passed through to onRemove for cleanup. */
export type MountResult = unknown;

/**
 * Context passed to onMount and onRemove callbacks.
 * Contains host, container, and mode-specific fields (shadowRoot/iframe).
 */
export interface MountContext {
	/** Host element (display: contents) containing injected content. */
	host: HTMLElement;
	/** Alias for host (for compatibility). */
	wrapper: HTMLElement;
	/** The content container you render into. */
	container: HTMLElement;
	/** The shadow root, when this injector uses one (createShadowRootUi only). */
	shadowRoot?: ShadowRoot;
	/** The iframe element, when this injector uses one (createIframeUi only). */
	iframe?: HTMLIFrameElement;
	/** The DOM node this injection was anchored to. */
	anchor: Element;
	/** Index of this anchor within the batch (0 for single-element injections). */
	index: number;
}

/**
 * Options for creating content UI injections.
 * Controls placement, styling, lifecycle, and behavior.
 */
export interface ContentUiOptions {
	/** Unique name for this injection; used as the host element tag/id prefix. */
	name: string;

	/** Selector, element, or list of elements to inject next to/into. */
	anchor: AnchorInput;

	/** Placement of the shadow host relative to each matched anchor. Default: 'append'. */
	position?: ContentUiPosition;

	/**
	 * When true, all matched anchors share ONE shadow root + one style injection
	 * (Plasmo-overlay style). When false (default), each anchor gets its own
	 * shadow root, but CSS text is still deduplicated via a shared
	 * CSSStyleSheet (adoptedStyleSheets) rather than re-injected per root.
	 * @default false
	 */
	sharedRoot?: boolean;

	/**
	 * When enabled, `event.stopPropagation` called on events trying to bubble out
	 * of shadow root.
	 *
	 * - `true` (default) — stop propagation of default set,
	 *   `["keyup", "keydown", "keypress"]`
	 * - array of event names — stop propagation of custom list
	 * - `false` — disable
	 *
	 * @default true
	 */
	isolateEvents?: boolean | string[];

	/**
	 * When true (default), CSS text passed via `css` is shared across all
	 * shadow roots created by ALL injectors using the same styleKey, via
	 * adoptedStyleSheets. When false, styles are not deduplicated.
	 * @default true
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
	 * @default false
	 */
	autoDetect?: boolean;

	/**
	 * Auto-resize iframe host to match injected content's measured size.
	 * Ignored by shadow/integrated modes (no iframe box to size).
	 *
	 * @default true
	 */
	autoSize?: boolean;

	/**
	 * Tag name for the shadow host element. Default: 'div'. Host has
	 * `display: contents` applied, so pick a tag valid in the anchor's
	 * context (e.g. 'tr' inside a `<table>`, 'li' inside a list).
	 * @default "div"
	 */
	hostTag?: keyof HTMLElementTagNameMap;

	/** Tag name for the inner container/slot element(s). Default: 'div'.
	 * @default "div"
	 */
	containerTag?: keyof HTMLElementTagNameMap;

	/** Called once per matched anchor after its shadow root/container exist. */
	onMount: (ctx: MountContext) => MountResult;

	/** Called once per anchor when its injection is removed/unmounted. */
	onRemove?: (result: MountResult, ctx: MountContext) => void;
}

/**
 * Internal representation of a mounted injection instance.
 * Tracks all state needed for cleanup.
 */
export interface MountedInstance {
	/** The anchor this instance was mounted to. */
	anchor: Element;
	/** Host element (display: contents). */
	host: HTMLElement;
	/** Shadow root if applicable (shadow mode only). */
	shadowRoot?: ShadowRoot;
	/** Iframe element if applicable (iframe mode only). */
	iframe?: HTMLIFrameElement;
	/** Container for user content. */
	container: HTMLElement;
	/** Result from onMount callback (passed to onRemove). */
	result: MountResult;
	/** Cleanup function for event isolation. */
	isolateCleanup?: (() => void) | null;
	/** Cleanup function for auto-size observer. */
	sizeCleanup?: (() => void) | null;
}

/**
 * Public interface returned by createShadowRootUi/createIntegratedUi/createIframeUi.
 * Provides mount/remove lifecycle and instance introspection.
 */
export interface ContentUi {
	/** Mount into every anchor currently matching, and start auto-detect if enabled. */
	mount: () => void;
	/** Unmount all instances and stop observing. */
	remove: () => void;
	/** Currently mounted instances, in mount order. */
	instances: () => MountedInstance[];
}
