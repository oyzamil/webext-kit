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

function makeHost(name: string, tag: string): HTMLElement {
	const host = document.createElement(tag);
	host.setAttribute("data-webext-content-ui", name);
	host.style.display = "contents";
	return host;
}

const DEFAULT_ISOLATED_EVENTS = ["keyup", "keydown", "keypress"];

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

/**
 * Tracks which (document, styleKey) pairs already got their <style>/adopted
 * sheet applied, so light-DOM modes that reuse the real page document don't
 * re-append the same styles once per anchor.
 */
const docStyleApplied = new WeakMap<Document, Set<string>>();

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

function observeAutoSize(
	iframe: HTMLIFrameElement,
	container: HTMLElement,
): () => void {
	const ro = new ResizeObserver(() => {
		// container size drive iframe box — read from inside frame's own layout
		const { width, height } = container.getBoundingClientRect();
		iframe.style.width = `${Math.ceil(width)}px`;
		iframe.style.height = `${Math.ceil(height)}px`;
	});
	ro.observe(container);
	return () => ro.disconnect();
}

/**
 * Backend = only bit that differs between shadow/integrated/iframe modes:
 * how host element made, how its style scope + first container set up, and
 * (for shadow/iframe) extra MountContext field to expose.
 */
interface Backend {
	makeHost(name: string): HTMLElement;
	setup(
		host: HTMLElement,
		containerTag: string,
		css: string,
		styleKey: string,
		sharedStyle: boolean,
		autoSize?: boolean,
	): { container: HTMLElement; cleanup?: () => void }; // <- was just HTMLElement
	extraCtx?(host: HTMLElement): Partial<MountContext>;
	isolate?(
		host: HTMLElement,
		isolateEvents: boolean | string[] | undefined,
	): (() => void) | null;
}

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
		return { container }; // <- wrapped, no cleanup needed
	},
	extraCtx: (host) => (host.shadowRoot ? { shadowRoot: host.shadowRoot } : {}),
	isolate: (host, isolateEvents) =>
		host.shadowRoot
			? isolateShadowEvents(host.shadowRoot, isolateEvents)
			: null,
});

const integratedBackend = (hostTag: string): Backend => ({
	makeHost: (name) => makeHost(name, hostTag),
	setup(host, containerTag, css, styleKey, sharedStyle) {
		const container = document.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		host.appendChild(container);
		applyDocStyleOnce(document, css, styleKey, sharedStyle);
		return { container }; // <- wrapped
	},
});

/**
 * `hostTag` ignored here — host always `<iframe>`; `containerTag` still
 * controls element made inside it. Iframe never navigated (no src/srcdoc):
 * kept on its initial same-origin doc, forced into stable html/head/body
 * via synchronous `document.write` right after insertion (some browsers
 * don't finish populating that doc's `<body>` synchronously on own) — no
 * load event to wait for, contentDocument ready right after mount.
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

/** Generic core — shared by all three public factories below. */
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

	// Each anchor sharing a root still gets own slot, so per-anchor content
	// doesn't collide. Slot made in container's own document — matters for
	// iframe, where container lives in contentDocument, not main doc.
	function makeSlot(container: HTMLElement): HTMLElement {
		const slot = container.ownerDocument.createElement(containerTag);
		slot.className = `${TAG_PREFIX}-slot`;
		container.appendChild(slot);
		return slot;
	}

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

	function mountAll(): void {
		const anchors = resolveAnchors(anchor);
		anchors.forEach((el, i) => mountOne(el, i));

		if (autoDetect && typeof anchor === "string") {
			// Separate set: watchForAnchors marks elements "known" soon as it
			// sees them (before onNew runs) — sharing one set with mountOne's
			// dedup guard would make it skip the mount entirely.
			const watchKnown = new Set(known);
			stopWatching = watchForAnchors(anchor, watchKnown, (el) =>
				mountOne(el, mounted.length),
			);
		}
	}

	function unmountInstance(instance: MountedInstance): void {
		const ctx: MountContext = {
			host: instance.host,
			wrapper: instance.host,
			container: instance.container,
			anchor: instance.anchor,
			index: mounted.indexOf(instance),
			...(instance.shadowRoot ? { shadowRoot: instance.shadowRoot } : {}),
			...(instance.iframe ? { iframe: instance.iframe } : {}),
		};
		onRemove?.(instance.result, ctx);
		instance.isolateCleanup?.();
		instance.sizeCleanup?.();

		if (sharedRoot) instance.container.remove();
	}

	return {
		mount: mountAll,
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
				sharedSizeCleanup?.(); // <- call
				sharedSizeCleanup = null;
			} else {
				for (const instance of mounted) instance.host.remove();
			}

			mounted = [];
			known.clear();
		},
		instances: () => [...mounted],
	};
}

export function createShadowRootUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, shadowBackend(options.hostTag ?? "div"));
}

export function createIntegratedUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, integratedBackend(options.hostTag ?? "div"));
}

export function createIframeUi(options: ContentUiOptions): ContentUi {
	return createInjector(options, iframeBackend);
}
