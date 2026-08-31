import { beforeEach, describe, expect, it, vi } from "vitest";

import { createIframeUi, createShadowRootUi } from "../src/injector";
import {
	clearSharedStyleRegistry,
	sharedStyleRegistrySize,
	supportsConstructibleStylesheets,
} from "../src/shared-styles";

class MockResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
beforeEach(() => {
	vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

describe("createShadowRootUi — single anchor", () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="target"></div>';
		clearSharedStyleRegistry();
	});

	it("mounts once into a single element anchor", () => {
		const onMount = vi.fn();
		const target = document.getElementById("target") as Element;

		const injector = createShadowRootUi({
			name: "test",
			anchor: target,
			onMount,
		});
		injector.mount();

		expect(onMount).toHaveBeenCalledTimes(1);
		expect(injector.instances()).toHaveLength(1);
	});

	it("creates a shadow root and passes it in the mount context", () => {
		let capturedShadowRoot: ShadowRoot | undefined;
		const injector = createShadowRootUi({
			name: "test",
			anchor: "#target",
			onMount: (ctx) => {
				capturedShadowRoot = ctx.shadowRoot;
			},
		});
		injector.mount();

		expect(capturedShadowRoot).toBeInstanceOf(ShadowRoot);
	});

	it("appends the host next to the anchor by default (position: append)", () => {
		const injector = createShadowRootUi({
			name: "test",
			anchor: "#target",
			onMount: (ctx) => {
				ctx.container.textContent = "hello";
			},
		});
		injector.mount();

		const target = document.getElementById("target") as Element;
		const host = target.querySelector('[data-webext-content-ui="test"]');
		expect(host).not.toBeNull();
	});

	it('respects the "before" position', () => {
		const injector = createShadowRootUi({
			name: "pos",
			anchor: "#target",
			position: "before",
			onMount: () => {},
		});
		injector.mount();

		const host = document.querySelector('[data-webext-content-ui="pos"]');
		expect(host?.nextElementSibling?.id).toBe("target");
	});

	it("removes the host and calls onRemove on remove()", () => {
		const onRemove = vi.fn();
		const injector = createShadowRootUi({
			name: "test",
			anchor: "#target",
			onMount: () => ({ cleanup: true }),
			onRemove,
		});
		injector.mount();
		expect(
			document.querySelector('[data-webext-content-ui="test"]'),
		).not.toBeNull();

		injector.remove();

		expect(onRemove).toHaveBeenCalledWith(
			{ cleanup: true },
			expect.objectContaining({ index: 0 }),
		);
		expect(
			document.querySelector('[data-webext-content-ui="test"]'),
		).toBeNull();
		expect(injector.instances()).toHaveLength(0);
	});
});

describe("createShadowRootUi — batch anchors, separate shadow roots", () => {
	beforeEach(() => {
		document.body.innerHTML = `
      <button class="btn">1</button>
      <button class="btn">2</button>
      <button class="btn">3</button>
    `;
		clearSharedStyleRegistry();
	});

	it("mounts once per matched anchor", () => {
		const onMount = vi.fn();
		const injector = createShadowRootUi({
			name: "batch",
			anchor: ".btn",
			onMount,
		});
		injector.mount();

		expect(onMount).toHaveBeenCalledTimes(3);
		expect(injector.instances()).toHaveLength(3);
	});

	it("gives each anchor its own shadow root when sharedRoot is false", () => {
		const roots = new Set<ShadowRoot>();
		const injector = createShadowRootUi({
			name: "batch",
			anchor: ".btn",
			sharedRoot: false,
			onMount: (ctx) => {
				if (ctx.shadowRoot) roots.add(ctx.shadowRoot);
			},
		});
		injector.mount();

		expect(roots.size).toBe(3);
	});

	it("passes an incrementing index per anchor", () => {
		const indices: number[] = [];
		const injector = createShadowRootUi({
			name: "batch",
			anchor: ".btn",
			onMount: (ctx) => indices.push(ctx.index),
		});
		injector.mount();

		expect(indices).toEqual([0, 1, 2]);
	});

	it("dedupes shared CSS across all per-anchor shadow roots (one sheet, not three)", () => {
		const injector = createShadowRootUi({
			name: "batch",
			anchor: ".btn",
			css: ".btn-ui { color: hotpink; }",
			sharedStyle: true,
			onMount: () => {},
		});
		injector.mount();

		expect(sharedStyleRegistrySize()).toBeLessThanOrEqual(1);
	});

	it("removes every instance and host on remove()", () => {
		const injector = createShadowRootUi({
			name: "batch",
			anchor: ".btn",
			onMount: () => {},
		});
		injector.mount();
		injector.remove();

		expect(
			document.querySelectorAll('[data-webext-content-ui="batch"]'),
		).toHaveLength(0);
		expect(injector.instances()).toHaveLength(0);
	});
});

describe("createShadowRootUi — sharedRoot (Plasmo-overlay style)", () => {
	beforeEach(() => {
		document.body.innerHTML = `
      <div class="anchor">a</div>
      <div class="anchor">b</div>
      <div class="anchor">c</div>
    `;
		clearSharedStyleRegistry();
	});

	it("mounts all anchors into a single shared shadow root", () => {
		const roots = new Set<ShadowRoot>();
		const injector = createShadowRootUi({
			name: "overlay",
			anchor: ".anchor",
			sharedRoot: true,
			onMount: (ctx) => {
				if (ctx.shadowRoot) roots.add(ctx.shadowRoot);
			},
		});
		injector.mount();

		expect(roots.size).toBe(1);
		expect(injector.instances()).toHaveLength(3);
	});

	it("creates only a single host element in the DOM", () => {
		const injector = createShadowRootUi({
			name: "overlay",
			anchor: ".anchor",
			sharedRoot: true,
			onMount: () => {},
		});
		injector.mount();

		expect(
			document.querySelectorAll('[data-webext-content-ui="overlay"]'),
		).toHaveLength(1);
	});

	it("gives each anchor its own slot container inside the shared root", () => {
		const containers = new Set<HTMLElement>();
		const injector = createShadowRootUi({
			name: "overlay",
			anchor: ".anchor",
			sharedRoot: true,
			onMount: (ctx) => containers.add(ctx.container),
		});
		injector.mount();

		expect(containers.size).toBe(3);
	});

	it("injects styles into the shared root only once", () => {
		const injector = createShadowRootUi({
			name: "overlay",
			anchor: ".anchor",
			sharedRoot: true,
			css: ".x { color: teal; }",
			onMount: () => {},
		});
		injector.mount();

		const host = document.querySelector(
			'[data-webext-content-ui="overlay"]',
		) as HTMLElement;
		const shadowRoot = host.shadowRoot as ShadowRoot;
		// Either one adopted sheet, or (fallback) exactly one <style> tag.
		const styleTags = shadowRoot.querySelectorAll("style").length;
		const adoptedCount = supportsConstructibleStylesheets()
			? shadowRoot.adoptedStyleSheets.length
			: 0;
		expect(adoptedCount + styleTags).toBeLessThanOrEqual(1);
	});

	it("removes the single shared host and all slots on remove()", () => {
		const onRemove = vi.fn();
		const injector = createShadowRootUi({
			name: "overlay",
			anchor: ".anchor",
			sharedRoot: true,
			onMount: () => {},
			onRemove,
		});
		injector.mount();
		injector.remove();

		expect(onRemove).toHaveBeenCalledTimes(3);
		expect(
			document.querySelectorAll('[data-webext-content-ui="overlay"]'),
		).toHaveLength(0);
	});
});

describe("createShadowRootUi — autoDetect", () => {
	beforeEach(() => {
		document.body.innerHTML = '<div class="dyn">existing</div>';
		clearSharedStyleRegistry();
	});

	it("mounts into elements matching the selector added after mount()", async () => {
		const onMount = vi.fn();
		const injector = createShadowRootUi({
			name: "auto",
			anchor: ".dyn",
			autoDetect: true,
			onMount,
		});
		injector.mount();
		expect(onMount).toHaveBeenCalledTimes(1);

		const el = document.createElement("div");
		el.className = "dyn";
		document.body.appendChild(el);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onMount).toHaveBeenCalledTimes(2);
	});

	it("stops mounting new elements after remove()", async () => {
		const onMount = vi.fn();
		const injector = createShadowRootUi({
			name: "auto",
			anchor: ".dyn",
			autoDetect: true,
			onMount,
		});
		injector.mount();
		injector.remove();

		const el = document.createElement("div");
		el.className = "dyn";
		document.body.appendChild(el);
		await new Promise((resolve) => setTimeout(resolve, 0));

		// Only the original pre-remove mount call counted.
		expect(onMount).toHaveBeenCalledTimes(1);
	});
});

describe("createIframeUi", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		clearSharedStyleRegistry();
	});

	it("mounts into an iframe with a usable contentDocument container", () => {
		document.body.innerHTML = '<div id="target"></div>';
		let capturedIframe: HTMLIFrameElement | undefined;
		const injector = createIframeUi({
			name: "test",
			anchor: "#target",
			onMount: ({ container, iframe }) => {
				capturedIframe = iframe;
				container.textContent = "hi";
			},
		});
		injector.mount();

		expect(capturedIframe).toBeInstanceOf(HTMLIFrameElement);
		expect(capturedIframe?.contentDocument?.body.textContent).toContain("hi");
	});

	it(
		"mounts into multiple anchors without throwing (regression: each anchor's iframe" +
			" doc needs a stable body before use)",
		() => {
			document.body.innerHTML =
				"<h2>one</h2><h2>two</h2><h2>three</h2><h2>four</h2>";
			const onMount = vi.fn();

			expect(() => {
				const injector = createIframeUi({
					name: "multi",
					anchor: "h2",
					onMount,
				});
				injector.mount();
			}).not.toThrow();

			expect(onMount).toHaveBeenCalledTimes(4);
		},
	);

	it("sharedRoot: true mounts every anchor into one iframe", () => {
		document.body.innerHTML = "<h2>one</h2><h2>two</h2>";
		const seenIframes = new Set<HTMLIFrameElement>();
		const injector = createIframeUi({
			name: "shared",
			anchor: "h2",
			sharedRoot: true,
			onMount: ({ iframe }) => {
				if (iframe) seenIframes.add(iframe);
			},
		});
		injector.mount();

		expect(seenIframes.size).toBe(1);
	});

	it("removes iframes on remove()", () => {
		document.body.innerHTML = '<div id="target"></div>';
		const injector = createIframeUi({
			name: "test",
			anchor: "#target",
			onMount: () => {},
		});
		injector.mount();
		expect(document.querySelectorAll("iframe").length).toBe(1);

		injector.remove();
		expect(document.querySelectorAll("iframe").length).toBe(0);
	});
});
