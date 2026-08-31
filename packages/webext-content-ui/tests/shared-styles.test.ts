import { beforeEach, describe, expect, it } from "vitest";

import {
	applyStyles,
	clearSharedStyleRegistry,
	sharedStyleRegistrySize,
	supportsConstructibleStylesheets,
} from "../src/shared-styles";

function makeShadowRoot(): ShadowRoot {
	const host = document.createElement("div");
	document.body.appendChild(host);
	return host.attachShadow({ mode: "open" });
}

// Some runtimes (e.g. happy-dom) leave a fresh shadow root's
// `adoptedStyleSheets` as `undefined` rather than `[]` until something is
// assigned to it. Tests read through this helper rather than the raw
// property so they work across jsdom, happy-dom, and real browsers alike.
function getAdopted(root: ShadowRoot): CSSStyleSheet[] {
	return root.adoptedStyleSheets ?? [];
}

describe("shared-styles", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		clearSharedStyleRegistry();
	});

	it("reports whether the runtime supports constructible stylesheets", () => {
		expect(typeof supportsConstructibleStylesheets()).toBe("boolean");
	});

	it("does nothing for empty CSS", () => {
		const root = makeShadowRoot();
		applyStyles(root, "", "key", true);
		expect(getAdopted(root).length).toBe(0);
		expect(root.querySelector("style")).toBeNull();
	});

	it("applies CSS to a single shadow root", () => {
		const root = makeShadowRoot();
		applyStyles(root, ".a { color: red; }", "my-key", true);

		if (supportsConstructibleStylesheets()) {
			expect(getAdopted(root).length).toBe(1);
		} else {
			expect(root.querySelector("style")?.textContent).toContain("color: red");
		}
	});

	it("reuses one sheet across multiple shadow roots with shared=true and same key/css", () => {
		const rootA = makeShadowRoot();
		const rootB = makeShadowRoot();
		const rootC = makeShadowRoot();
		const css = ".shared { color: blue; }";

		applyStyles(rootA, css, "shared-key", true);
		applyStyles(rootB, css, "shared-key", true);
		applyStyles(rootC, css, "shared-key", true);

		if (supportsConstructibleStylesheets()) {
			expect(sharedStyleRegistrySize()).toBe(1);
			expect(getAdopted(rootA)[0]).toBe(getAdopted(rootB)[0]);
			expect(getAdopted(rootB)[0]).toBe(getAdopted(rootC)[0]);
		}
	});

	it("creates separate sheets for different styleKeys even with identical css", () => {
		const rootA = makeShadowRoot();
		const rootB = makeShadowRoot();
		const css = ".x { color: green; }";

		applyStyles(rootA, css, "key-a", true);
		applyStyles(rootB, css, "key-b", true);

		if (supportsConstructibleStylesheets()) {
			expect(sharedStyleRegistrySize()).toBe(2);
			expect(getAdopted(rootA)[0]).not.toBe(getAdopted(rootB)[0]);
		}
	});

	it("creates separate sheets for the same key when css text differs", () => {
		const rootA = makeShadowRoot();
		const rootB = makeShadowRoot();

		applyStyles(rootA, ".x { color: red; }", "same-key", true);
		applyStyles(rootB, ".x { color: blue; }", "same-key", true);

		if (supportsConstructibleStylesheets()) {
			expect(sharedStyleRegistrySize()).toBe(2);
		}
	});

	it("does not dedupe when shared is false, falling back to per-root <style> tags", () => {
		const rootA = makeShadowRoot();
		const rootB = makeShadowRoot();
		const css = ".not-shared { color: purple; }";

		applyStyles(rootA, css, "key", false);
		applyStyles(rootB, css, "key", false);

		expect(rootA.querySelector("style")?.textContent).toContain("not-shared");
		expect(rootB.querySelector("style")?.textContent).toContain("not-shared");
		expect(sharedStyleRegistrySize()).toBe(0);
	});

	it("appends additional adopted sheets rather than overwriting existing ones", () => {
		const root = makeShadowRoot();
		applyStyles(root, ".one {}", "k1", true);
		applyStyles(root, ".two {}", "k2", true);

		if (supportsConstructibleStylesheets()) {
			expect(getAdopted(root).length).toBe(2);
		}
	});

	it("regression: handles a shadow root whose adoptedStyleSheets starts undefined (happy-dom quirk)", () => {
		// Force the constructible-stylesheets code path even on runtimes (like
		// jsdom) that don't support it natively, so this regression is caught
		// everywhere rather than only on runtimes that happen to reproduce it.
		const proto = CSSStyleSheet.prototype as {
			replaceSync?: ((css: string) => void) | undefined;
		};
		const hadReplaceSync = typeof proto.replaceSync === "function";
		if (!hadReplaceSync) {
			proto.replaceSync = function (this: { _css?: string }, css: string) {
				this._css = css;
			};
		}

		try {
			const root = makeShadowRoot();
			// The exact quirk seen in some runtimes: constructible stylesheets
			// are supported, but a fresh shadow root's `adoptedStyleSheets` is
			// `undefined` rather than `[]` until something is assigned to it.
			Object.defineProperty(root, "adoptedStyleSheets", {
				value: undefined,
				writable: true,
				configurable: true,
			});

			expect(() =>
				applyStyles(root, ".q { color: pink; }", "quirk-key", true),
			).not.toThrow();
			expect(getAdopted(root).length).toBe(1);
		} finally {
			if (!hadReplaceSync) {
				(
					proto as { replaceSync?: ((css: string) => void) | undefined }
				).replaceSync = undefined;
			}
		}
	});

	it("falls back to a <style> tag when the CSS has @import (replaceSync rejects it)", () => {
		if (!supportsConstructibleStylesheets()) return; // nothing to fall back from

		const proto = CSSStyleSheet.prototype as {
			replaceSync?: (css: string) => void;
		};
		const original = proto.replaceSync;
		proto.replaceSync = function (css: string) {
			if (css.includes("@import")) {
				throw new DOMException("@import rules are not allowed here.");
			}
			original?.call(this, css);
		};

		try {
			const root = makeShadowRoot();
			const css = '@import "foo.css"; .a { color: red; }';

			expect(() => applyStyles(root, css, "import-key", true)).not.toThrow();
			expect(getAdopted(root).length).toBe(0); // no sheet adopted
			expect(root.querySelector("style")?.textContent).toContain("@import");

			// Cached failure — a second call with the same key/css shouldn't
			// retry replaceSync, just append another <style> tag.
			const rootB = makeShadowRoot();
			applyStyles(rootB, css, "import-key", true);
			expect(rootB.querySelector("style")).not.toBeNull();
		} finally {
			proto.replaceSync = original;
		}
	});
});
