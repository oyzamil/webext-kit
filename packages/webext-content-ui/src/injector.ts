import { resolveAnchors, watchForAnchors } from "./anchor";
import { applyStyles } from "./shared-styles";
import {
	type ContentUi,
	type ContentUiOptions,
	type MountContext,
	type MountedInstance,
	type MountResult,
} from "./types";

const TAG_PREFIX = "webext-content-ui";

/**
 * Create host element with display: contents for DOM passthrough.
 * @param name - Unique name for data-webext-content-ui attribute
 * @param tag - HTML tag name (default: div)
 * @returns Configured host element
 */
function makeHost(name: string, tag: string): HTMLElement {
	const host = document.createElement(tag);
	host.setAttribute("data-webext-content-ui", name);
	host.style.display = "contents";
	return host;
}

/** Default keyboard events to isolate from bubbling out shadow root. */
const DEFAULT_ISOLATED_EVENTS = ["keyup", "keydown", "keypress"];

/**
 * Attach event stopPropagation listeners to shadow root.
 * Prevents keyboard/custom events from bubbling to light DOM.
 *
 * @param shadowRoot - Shadow root to isolate
 * @param isolateEvents - true (default events), array (custom), or false (disabled)
 * @returns Cleanup function or null if isolation disabled
 */
function isolateShadowEvents(
	shadowRoot: ShadowRoot,
	isolateEvents: boolean | string[] | undefined,
): (() => void) | null {
	if (isolateEvents === false) return null;
	const events = Array.isArray(isolateEvents)
		? isolateEvents
		: DEFAULT_ISOLATED_EVENTS;
	const stop = (e: Event) => e.stopPropagation();
	events.forEach((evt) => shadowRoot.addEventListener(evt, stop));
	return () =>
		events.forEach((evt) => shadowRoot.removeEventListener(evt, stop));
}

/**
 * Place host element relative to anchor using DOM API.
 * @param host - Element to place
 * @param anchor - Reference element
 * @param position - Placement relative to anchor (before/after/prepend/append/replace)
 */
function place(
	host: HTMLElement,
	anchor: Element,
	position: NonNullable<ContentUiOptions["position"]>,
): void {
	switch (position) {
		case "before":
			anchor.before(host);
			break;
		case "after":
			anchor.after(host);
			break;
		case "prepend":
			anchor.prepend(host);
			break;
		case "replace":
			anchor.replaceWith(host);
			break;
		default:
			anchor.append(host);
	}
}

/** Track which documents already received styles for a styleKey to avoid duplication. */
const docStyleApplied = new WeakMap<Document, Set<string>>();

/**
 * Apply CSS to document once per styleKey (dedup across anchors in light-DOM modes).
 * @param doc - Document to apply styles to
 * @param css - Raw CSS text
 * @param styleKey - Dedup key
 * @param shared - Enable stylesheet dedup
 */
function applyDocStyleOnce(
	doc: Document,
	css: string,
	styleKey: string,
	shared: boolean,
): void {
	if (!css) return;
	let keys = docStyleApplied.get(doc);
	if (!keys) {
		keys = new Set();
		docStyleApplied.set(doc, keys);
	}
	if (keys.has(styleKey)) return;
	keys.add(styleKey);
	applyStyles(doc, css, styleKey, shared);
}

/**
 * Observe container size and resize iframe to match.
 * @param iframe - Iframe element to resize
 * @param container - Container inside iframe to measure
 * @returns Cleanup function to stop observing
 */
function observeAutoSize(
	iframe: HTMLIFrameElement,
	container: HTMLElement,
): () => void {
	const ro = new ResizeObserver(() => {
		const { width, height } = container.getBoundingClientRect();
		iframe.style.width = `${Math.ceil(width)}px`;
		iframe.style.height = `${Math.ceil(height)}px`;
	});
	ro.observe(container);
	return () => ro.disconnect();
}

/**
 * Backend interface: abstraction for shadow/integrated/iframe injection modes.
 * Each backend defines how host is created, styles scoped, and containers set up.
 */
interface Backend {
	/** Create host element with mode-specific setup. */
	makeHost(name: string): HTMLElement;
	/**
	 * Set up style scope and container within/for host.
	 * @returns container element and optional cleanup (for autoSize)
	 */
	setup(
		host: HTMLElement,
		containerTag: string,
		css: string,
		styleKey: string,
		sharedStyle: boolean,
		autoSize?: boolean,
	): { container: HTMLElement; cleanup?: () => void };
	/** Return extra MountContext fields specific to this backend (shadowRoot/iframe). */
	extraCtx?(host: HTMLElement): Partial<MountContext>;
	/** Set up event isolation if supported by backend. */
	isolate?(
		host: HTMLElement,
		isolateEvents: boolean | string[] | undefined,
	): (() => void) | null;
}

/**
 * Shadow DOM backend: each anchor gets isolated shadow root.
 * @param hostTag - Tag name for shadow host
 * @returns Backend implementation
 */
const shadowBackend = (hostTag: string): Backend => ({
	makeHost: (name) => makeHost(name, hostTag),
	setup(host, containerTag, css, styleKey, sharedStyle) {
		const shadowRoot = host.attachShadow({ mode: "open" });
		const container = document.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		shadowRoot.appendChild(container);
		applyStyles(
			shadowRoot,
			css.replaceAll(":root", ":host"),
			styleKey,
			sharedStyle,
		);
		return { container };
	},
	extraCtx: (host) => (host.shadowRoot ? { shadowRoot: host.shadowRoot } : {}),
	isolate: (host, isolateEvents) =>
		host.shadowRoot
			? isolateShadowEvents(host.shadowRoot, isolateEvents)
			: null,
});

/**
 * Integrated backend: content injected into light DOM, styles into page document.
 * @param hostTag - Tag name for host
 * @returns Backend implementation
 */
const integratedBackend = (hostTag: string): Backend => ({
	makeHost: (name) => makeHost(name, hostTag),
	setup(host, containerTag, css, styleKey, sharedStyle) {
		const container = document.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		host.appendChild(container);
		applyDocStyleOnce(document, css, styleKey, sharedStyle);
		return { container };
	},
});

/**
 * Iframe backend: content in isolated iframe document.
 * Iframe navigated to empty document at mount time via document.write.
 */
const iframeBackend: Backend = {
	makeHost: (name) => {
		const iframe = document.createElement("iframe");
		iframe.setAttribute("data-webext-content-ui", name);
		iframe.style.border = "none";
		iframe.style.height = "0";
		iframe.style.display = "block";
		return iframe;
	},
	setup(host, containerTag, css, styleKey, sharedStyle, autoSize) {
		const iframe = host as HTMLIFrameElement;
		const doc = iframe.contentDocument;
		if (!doc) {
			throw new Error(
				`webext-content-ui: iframe for "${iframe.getAttribute("data-webext-content-ui")}" has no contentDocument — was it placed in DOM before mounting?`,
			);
		}
		doc.open();
		doc.write("<!doctype html><html><head></head><body></body></html>");
		doc.close();

		const container = doc.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		doc.body.appendChild(container);
		applyStyles(doc, css, styleKey, sharedStyle);

		if (autoSize !== false) {
			return { container, cleanup: observeAutoSize(iframe, container) };
		}

		return { container };
	},
	extraCtx: (host) => ({ iframe: host as HTMLIFrameElement }),
};

/**
 * Build MountContext from instance and index.
 * Reuses shadowRoot/iframe from instance to avoid reconstruction.
 *
 * @param instance - Mounted instance with all state
 * @param index - Index in mounted array
 * @returns MountContext for callbacks
 */
function buildMountContext(
	instance: MountedInstance,
	index: number,
): MountContext {
	const ctx: MountContext = {
		host: instance.host,
		wrapper: instance.host,
		container: instance.container,
		anchor: instance.anchor,
		index,
	};
	if (instance.shadowRoot) ctx.shadowRoot = instance.shadowRoot;
	if (instance.iframe) ctx.iframe = instance.iframe;
	return ctx;
}

/**
 * Core injector factory: shared by all three public injection modes.
 * Handles anchor resolution, mounting, auto-detection, and cleanup.
 *
 * @param options - ContentUiOptions from user
 * @param backend - Backend implementation (shadow/integrated/iframe)
 * @returns ContentUi interface (mount/remove/instances)
 */
function createInjector(
	options: ContentUiOptions,
	backend: Backend,
): ContentUi {
	const {
		name,
		anchor,
		position = "append",
		sharedRoot = false,
		sharedStyle = true,
		styleKey = name,
		css = "",
		autoDetect = false,
		containerTag = "div",
		isolateEvents = true,
		autoSize = true,
		onMount,
		onRemove,
	} = options;

	let mounted: MountedInstance[] = [];
	let sharedHost: HTMLElement | null = null;
	let sharedContainer: HTMLElement | null = null;
	let sharedSizeCleanup: (() => void) | null = null;
	let sharedIsolateCleanup: (() => void) | null = null;
	let stopWatching: (() => void) | null = null;
	const known = new Set<Element>();

	/**
	 * Ensure shared host exists (lazy-create on first anchor).
	 * All anchors in sharedRoot mode share one host + container.
	 *
	 * @param firstAnchor - Anchor to place shared host next to
	 * @returns Shared host and container
	 */
	function ensureShared(firstAnchor: Element) {
		if (sharedHost && sharedContainer) {
			return { host: sharedHost, container: sharedContainer };
		}
		const host = backend.makeHost(name);
		host.setAttribute("data-webext-content-ui-shared", "true");
		place(host, firstAnchor, position);
		const { container, cleanup } = backend.setup(
			host,
			containerTag,
			css,
			styleKey,
			sharedStyle,
			autoSize,
		);
		sharedIsolateCleanup = backend.isolate?.(host, isolateEvents) ?? null;
		sharedSizeCleanup = cleanup ?? null;
		sharedHost = host;
		sharedContainer = container;
		return { host, container };
	}

	/**
	 * Create slot (container) within shared container for per-anchor content.
	 * Each anchor gets own slot to prevent content collision.
	 *
	 * @param container - Shared container to append slot into
	 * @returns New slot element
	 */
	function makeSlot(container: HTMLElement): HTMLElement {
		const slot = container.ownerDocument.createElement(containerTag);
		slot.className = `${TAG_PREFIX}-slot`;
		container.appendChild(slot);
		return slot;
	}

	/**
	 * Mount content into single anchor.
	 * Creates host + container, calls onMount, tracks instance.
	 *
	 * @param el - Anchor element to mount into
	 * @param index - Index in mounted array
	 */
	function mountOne(el: Element, index: number): void {
		if (known.has(el) && !sharedRoot) return;
		known.add(el);

		let host: HTMLElement;
		let container: HTMLElement;
		let isolateCleanup: (() => void) | null = null;
		let sizeCleanup: (() => void) | null = null;

		if (sharedRoot) {
			const shared = ensureShared(el);
			host = shared.host;
			container = makeSlot(shared.container);
		} else {
			host = backend.makeHost(name);
			place(host, el, position);
			const setupResult = backend.setup(
				host,
				containerTag,
				css,
				styleKey,
				sharedStyle,
				autoSize,
			);
			container = setupResult.container;
			sizeCleanup = setupResult.cleanup ?? null;
			isolateCleanup = backend.isolate?.(host, isolateEvents) ?? null;
		}

		const extra = backend.extraCtx?.(host) ?? {};
		const ctx: MountContext = {
			host,
			wrapper: host,
			container,
			anchor: el,
			index,
			...extra,
		};
		const result: MountResult = onMount(ctx);

		mounted.push({
			anchor: el,
			host,
			container,
			result,
			isolateCleanup,
			sizeCleanup,
			...extra,
		} as MountedInstance);
	}

	/**
	 * Mount into all currently matching anchors, start auto-detect if enabled.
	 */
	function mountAll(): void {
		const anchors = resolveAnchors(anchor);
		anchors.forEach((el, i) => mountOne(el, i));

		if (autoDetect && typeof anchor === "string") {
			const watchKnown = new Set(known);
			stopWatching = watchForAnchors(anchor, watchKnown, (el) =>
				mountOne(el, mounted.length),
			);
		}
	}

	/**
	 * Unmount single instance, call onRemove, clean up listeners/observers.
	 * @param instance - Mounted instance to remove
	 */
	function unmountInstance(instance: MountedInstance): void {
		const index = mounted.indexOf(instance);
		const ctx = buildMountContext(instance, index);
		onRemove?.(instance.result, ctx);
		instance.isolateCleanup?.();
		instance.sizeCleanup?.();

		if (sharedRoot) instance.container.remove();
	}

	return {
		mount: mountAll,
		/**
		 * Unmount all instances, stop auto-detect, clean up all resources.
		 */
		remove: () => {
			stopWatching?.();
			stopWatching = null;
			for (const instance of mounted) unmountInstance(instance);

			if (sharedRoot) {
				sharedHost?.remove();
				sharedHost = null;
				sharedContainer = null;
				sharedIsolateCleanup?.();
				sharedIsolateCleanup = null;
				sharedSizeCleanup?.();
				sharedSizeCleanup = null;
			} else {
				for (const instance of mounted) instance.host.remove();
			}

			mounted = [];
			known.clear();
		},
		/** Return copy of current mounted instances in mount order. */
		instances: () => [...mounted],
	};
}

/**
 * Create shadow DOM injector: each anchor gets isolated shadow root.
 * @param options - ContentUiOptions with name, anchor, onMount, etc.
 * @returns ContentUi interface
 */
export function createShadowRootUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, shadowBackend(options.hostTag ?? "div"));
}

/**
 * Create integrated DOM injector: content in light DOM, styles in page document.
 * Use when shadow DOM isolation not needed or desired.
 * @param options - ContentUiOptions
 * @returns ContentUi interface
 */
export function createIntegratedUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, integratedBackend(options.hostTag ?? "div"));
}

/**
 * Create iframe injector: content in isolated same-origin iframe.
 * Fullest isolation; no CSS bleeding or event bubbling.
 * @param options - ContentUiOptions (hostTag ignored, always iframe)
 * @returns ContentUi interface
 */
export function createIframeUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, iframeBackend);
}
