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
			shadowRoot: instance.shadowRoot,
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
