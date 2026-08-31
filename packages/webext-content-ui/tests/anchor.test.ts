import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolveAnchors, watchForAnchors } from "../src/anchor";

describe("resolveAnchors", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	it("resolves a selector string to matching elements", () => {
		document.body.innerHTML =
			'<button class="a"></button><button class="a"></button><div></div>';
		const result = resolveAnchors(".a");
		expect(result).toHaveLength(2);
		expect(result.every((el) => el.classList.contains("a"))).toBe(true);
	});

	it("resolves a single Element to a one-item array", () => {
		const el = document.createElement("span");
		document.body.appendChild(el);
		expect(resolveAnchors(el)).toEqual([el]);
	});

	it("resolves an array of mixed selectors and elements, de-duplicated", () => {
		document.body.innerHTML =
			'<button id="x"></button><button class="a"></button>';
		const x = document.getElementById("x") as Element;
		const result = resolveAnchors(["#x", x, ".a"]);
		// #x and the direct element reference are the same node -> deduped
		expect(result).toHaveLength(2);
		expect(result).toContain(x);
	});

	it("returns an empty array when nothing matches", () => {
		expect(resolveAnchors(".does-not-exist")).toEqual([]);
	});

	it("preserves document order for selector matches", () => {
		document.body.innerHTML =
			'<div id="first" class="m"></div><div id="second" class="m"></div>';
		const [a, b] = resolveAnchors(".m");
		expect(a?.id).toBe("first");
		expect(b?.id).toBe("second");
	});
});

describe("watchForAnchors", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	it("calls onNew when a matching element is added later", async () => {
		const known = new Set<Element>();
		const onNew = vi.fn();
		const stop = watchForAnchors(".watched", known, onNew);

		const el = document.createElement("div");
		el.className = "watched";
		document.body.appendChild(el);

		// MutationObserver callbacks are microtask-scheduled.
		await Promise.resolve();
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onNew).toHaveBeenCalledTimes(1);
		expect(onNew).toHaveBeenCalledWith(el);
		expect(known.has(el)).toBe(true);

		stop();
	});

	it("detects matching descendants of an added subtree", async () => {
		const known = new Set<Element>();
		const onNew = vi.fn();
		const stop = watchForAnchors(".deep", known, onNew);

		const wrapper = document.createElement("div");
		wrapper.innerHTML = '<span><em class="deep"></em></span>';
		document.body.appendChild(wrapper);

		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onNew).toHaveBeenCalledTimes(1);
		stop();
	});

	it("does not call onNew again for already-known elements", async () => {
		const el = document.createElement("div");
		el.className = "watched";
		const known = new Set<Element>([el]);
		const onNew = vi.fn();
		const stop = watchForAnchors(".watched", known, onNew);

		document.body.appendChild(el);
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onNew).not.toHaveBeenCalled();
		stop();
	});

	it("stops observing after disconnect is called", async () => {
		const known = new Set<Element>();
		const onNew = vi.fn();
		const stop = watchForAnchors(".watched", known, onNew);
		stop();

		const el = document.createElement("div");
		el.className = "watched";
		document.body.appendChild(el);
		await new Promise((resolve) => setTimeout(resolve, 0));

		expect(onNew).not.toHaveBeenCalled();
	});
});
