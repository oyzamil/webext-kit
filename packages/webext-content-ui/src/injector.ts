import { resolveAnchors, watchForAnchors } from "./anchor";
import { applyStyles } from "./shared-styles";
import {
	type InjectOptions,
	type Injector,
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

function place(
	host: HTMLElement,
	anchor: Element,
	position: NonNullable<InjectOptions["position"]>,
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
 * Create a shadow-DOM injector.
 *
 * - Single anchor or array/selector of anchors ("batch").
 * - `sharedRoot: true` mounts every matched anchor's content into ONE shared
 *   shadow root (Plasmo overlay-anchor style) — use when the anchors should
 *   render as a single logical UI.
 * - `sharedRoot: false` (default) gives each anchor its own shadow root, but
 *   `sharedStyle` (default true) still dedupes the CSS text across all of
 *   them (and across other injectors using the same styleKey) via
 *   adoptedStyleSheets instead of re-injecting a <style> per root.
 */
export function createShadowUi(options: InjectOptions): Injector {
	const {
		name,
		anchor,
		position = "append",
		sharedRoot = false,
		sharedStyle = true,
		styleKey = name,
		css = "",
		autoDetect = false,
		hostTag = "div",
		containerTag = "div",
		onMount,
		onRemove,
	} = options;

	let mounted: MountedInstance[] = [];
	let sharedHost: HTMLElement | null = null;
	let sharedShadow: ShadowRoot | null = null;
	let sharedContainer: HTMLElement | null = null;
	let stopWatching: (() => void) | null = null;
	const known = new Set<Element>();

	function ensureSharedRoot(firstAnchor: Element): {
		shadowRoot: ShadowRoot;
		container: HTMLElement;
	} {
		if (sharedShadow && sharedContainer) {
			return { shadowRoot: sharedShadow, container: sharedContainer };
		}

		const host = makeHost(name, hostTag);
		host.setAttribute("data-webext-content-ui-shared", "true");
		place(host, firstAnchor, position);

		const shadowRoot = host.attachShadow({ mode: "open" });
		const container = document.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		shadowRoot.appendChild(container);

		applyStyles(shadowRoot, css, styleKey, sharedStyle);

		sharedHost = host;
		sharedShadow = shadowRoot;
		sharedContainer = container;

		return { shadowRoot, container };
	}

	function mountOne(el: Element, index: number): void {
		if (known.has(el) && !sharedRoot) {
			// already mounted individually
			return;
		}
		known.add(el);

		let shadowRoot: ShadowRoot;
		let container: HTMLElement;
		let host: HTMLElement;

		if (sharedRoot) {
			const shared = ensureSharedRoot(el);
			shadowRoot = shared.shadowRoot;
			host = sharedHost!;
			// Each anchor still gets its own slot inside the shared container so
			// per-anchor content doesn't collide.
			container = document.createElement(containerTag);
			container.className = `${TAG_PREFIX}-slot`;
			shadowRoot
				.querySelector(`.${TAG_PREFIX}-container`)
				?.appendChild(container);
		} else {
			host = makeHost(name, hostTag);
			place(host, el, position);
			shadowRoot = host.attachShadow({ mode: "open" });
			container = document.createElement(containerTag);
			container.className = `${TAG_PREFIX}-container`;
			shadowRoot.appendChild(container);
			applyStyles(shadowRoot, css, styleKey, sharedStyle);
		}

		const ctx: MountContext = { container, shadowRoot, anchor: el, index };
		const result: MountResult = onMount(ctx);

		mounted.push({ anchor: el, host, shadowRoot, container, result });
	}

	function mountAll(): void {
		const anchors = resolveAnchors(anchor);
		anchors.forEach((el, i) => mountOne(el, i));

		if (autoDetect && typeof anchor === "string") {
			// A separate set: watchForAnchors marks elements "known" as soon as it
			// sees them (before onNew runs), which would make mountOne's own
			// dedup guard below skip the mount entirely if they shared one set.
			const watchKnown = new Set(known);
			stopWatching = watchForAnchors(anchor, watchKnown, (el) =>
				mountOne(el, mounted.length),
			);
		}
	}

	function unmountInstance(instance: MountedInstance): void {
		const ctx: MountContext = {
			container: instance.container,
			...(instance.shadowRoot ? { shadowRoot: instance.shadowRoot } : {}),
			anchor: instance.anchor,
			index: mounted.indexOf(instance),
		};
		onRemove?.(instance.result, ctx);

		if (sharedRoot) {
			instance.container.remove();
		}
	}

	return {
		mount: mountAll,
		remove: () => {
			stopWatching?.();
			stopWatching = null;

			for (const instance of mounted) {
				unmountInstance(instance);
			}

			if (sharedRoot) {
				sharedHost?.remove();
				sharedHost = null;
				sharedShadow = null;
				sharedContainer = null;
			} else {
				for (const instance of mounted) {
					instance.host.remove();
				}
			}

			mounted = [];
			known.clear();
		},
		instances: () => [...mounted],
	};
}

/**
 * Tracks which (document, styleKey) pairs already got their <style>/adopted
 * sheet applied, so shadow-less modes (integrated/iframe with sharedRoot:
 * false) don't re-append the same styles once per anchor when they all
 * land in the same document.
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

/**
 * Create a light-DOM injector — no shadow root. Content is appended
 * directly into the page's own DOM, so page CSS can affect it (and vice
 * versa). Use when you WANT to inherit page styles, or need the injected
 * markup to participate in the page's own layout/selectors. Otherwise
 * prefer `createShadowUi` for style isolation.
 *
 * Same anchor/batch/sharedRoot/autoDetect semantics as `createShadowUi`.
 * `css`, when given, is injected once into the page's own `<head>` (deduped
 * by `styleKey`, not per-anchor).
 */
export function createIntegratedUi(options: InjectOptions): Injector {
	const {
		name,
		anchor,
		position = "append",
		sharedRoot = false,
		sharedStyle = true,
		styleKey = name,
		css = "",
		autoDetect = false,
		hostTag = "div",
		containerTag = "div",
		onMount,
		onRemove,
	} = options;

	let mounted: MountedInstance[] = [];
	let sharedHost: HTMLElement | null = null;
	let sharedContainer: HTMLElement | null = null;
	let stopWatching: (() => void) | null = null;
	const known = new Set<Element>();

	function ensureSharedContainer(firstAnchor: Element): HTMLElement {
		if (sharedHost && sharedContainer) return sharedContainer;

		const host = makeHost(name, hostTag);
		host.setAttribute("data-webext-content-ui-shared", "true");
		place(host, firstAnchor, position);

		const container = document.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		host.appendChild(container);
		applyDocStyleOnce(document, css, styleKey, sharedStyle);

		sharedHost = host;
		sharedContainer = container;
		return container;
	}

	function mountOne(el: Element, index: number): void {
		if (known.has(el) && !sharedRoot) return;
		known.add(el);

		let host: HTMLElement;
		let container: HTMLElement;

		if (sharedRoot) {
			const shared = ensureSharedContainer(el);
			host = sharedHost!;
			container = document.createElement(containerTag);
			container.className = `${TAG_PREFIX}-slot`;
			shared.appendChild(container);
		} else {
			host = makeHost(name, hostTag);
			place(host, el, position);
			container = document.createElement(containerTag);
			container.className = `${TAG_PREFIX}-container`;
			host.appendChild(container);
			applyDocStyleOnce(document, css, styleKey, sharedStyle);
		}

		const ctx: MountContext = { container, anchor: el, index };
		const result: MountResult = onMount(ctx);

		mounted.push({ anchor: el, host, container, result });
	}

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

	function unmountInstance(instance: MountedInstance): void {
		const ctx: MountContext = {
			container: instance.container,
			anchor: instance.anchor,
			index: mounted.indexOf(instance),
		};
		onRemove?.(instance.result, ctx);

		if (sharedRoot) {
			instance.container.remove();
		}
	}

	return {
		mount: mountAll,
		remove: () => {
			stopWatching?.();
			stopWatching = null;

			for (const instance of mounted) {
				unmountInstance(instance);
			}

			if (sharedRoot) {
				sharedHost?.remove();
				sharedHost = null;
				sharedContainer = null;
			} else {
				for (const instance of mounted) {
					instance.host.remove();
				}
			}

			mounted = [];
			known.clear();
		},
		instances: () => [...mounted],
	};
}

/**
 * Create an iframe injector. Each matched anchor (or all of them, with
 * `sharedRoot: true`) gets an `<iframe>` whose content document is your
 * container — full isolation (separate `window`/`document`, no page CSS
 * leaks either direction), heavier than a shadow root. The iframe is never
 * navigated (no `src`/`srcdoc`): it keeps its initial same-origin document,
 * synchronously forced into a stable html/head/body via `document.write`
 * right after insertion (some browsers don't finish populating that
 * document's `<body>` synchronously on their own) — no load event to wait
 * for, `contentDocument` is ready to use immediately after mount.
 *
 * `hostTag` is ignored (the host is always an `<iframe>`); `containerTag`
 * still controls the element created inside it.
 */
export function createIframeUi(options: InjectOptions): Injector {
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
		onMount,
		onRemove,
	} = options;

	let mounted: MountedInstance[] = [];
	let sharedHost: HTMLIFrameElement | null = null;
	let sharedContainer: HTMLElement | null = null;
	let stopWatching: (() => void) | null = null;
	const known = new Set<Element>();

	function makeIframeHost(): HTMLIFrameElement {
		const iframe = document.createElement("iframe");
		iframe.setAttribute("data-webext-content-ui", name);
		iframe.style.border = "none";
		return iframe;
	}

	function containerFor(iframe: HTMLIFrameElement): HTMLElement {
		const doc = iframe.contentDocument;
		if (!doc) {
			throw new Error(
				`webext-content-ui: iframe for "${name}" has no contentDocument — was it placed in the DOM before mounting?`,
			);
		}

		// The initial about:blank document isn't reliably populated with a
		// <body> synchronously right after insertion in every browser/context
		// (seen in Chrome content scripts) — touching doc.body too early can
		// race with the browser's own setup and throw "HierarchyRequestError:
		// Only one element on document allowed". A synchronous document.write
		// forces a stable html/head/body structure immediately; it doesn't
		// navigate or fire a load event, so this stays fully synchronous.
		doc.open();
		doc.write("<!doctype html><html><head></head><body></body></html>");
		doc.close();

		const container = doc.createElement(containerTag);
		container.className = `${TAG_PREFIX}-container`;
		doc.body.appendChild(container);
		applyStyles(doc, css, styleKey, sharedStyle);
		return container;
	}

	function ensureSharedHost(firstAnchor: Element): {
		iframe: HTMLIFrameElement;
		container: HTMLElement;
	} {
		if (sharedHost && sharedContainer) {
			return { iframe: sharedHost, container: sharedContainer };
		}

		const iframe = makeIframeHost();
		iframe.setAttribute("data-webext-content-ui-shared", "true");
		place(iframe, firstAnchor, position); // must attach before contentDocument exists
		const container = containerFor(iframe);

		sharedHost = iframe;
		sharedContainer = container;
		return { iframe, container };
	}

	function mountOne(el: Element, index: number): void {
		if (known.has(el) && !sharedRoot) return;
		known.add(el);

		let iframe: HTMLIFrameElement;
		let container: HTMLElement;

		if (sharedRoot) {
			const shared = ensureSharedHost(el);
			iframe = shared.iframe;
			container = shared.container.ownerDocument.createElement(containerTag);
			container.className = `${TAG_PREFIX}-slot`;
			shared.container.appendChild(container);
		} else {
			iframe = makeIframeHost();
			place(iframe, el, position); // must attach before contentDocument exists
			container = containerFor(iframe);
		}

		const ctx: MountContext = { container, anchor: el, index, iframe };
		const result: MountResult = onMount(ctx);

		mounted.push({ anchor: el, host: iframe, iframe, container, result });
	}

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

	function unmountInstance(instance: MountedInstance): void {
		const ctx: MountContext = {
			container: instance.container,
			anchor: instance.anchor,
			index: mounted.indexOf(instance),
			...(instance.iframe ? { iframe: instance.iframe } : {}),
		};
		onRemove?.(instance.result, ctx);

		if (sharedRoot) {
			instance.container.remove();
		}
	}

	return {
		mount: mountAll,
		remove: () => {
			stopWatching?.();
			stopWatching = null;

			for (const instance of mounted) {
				unmountInstance(instance);
			}

			if (sharedRoot) {
				sharedHost?.remove();
				sharedHost = null;
				sharedContainer = null;
			} else {
				for (const instance of mounted) {
					instance.host.remove();
				}
			}

			mounted = [];
			known.clear();
		},
		instances: () => [...mounted],
	};
}
