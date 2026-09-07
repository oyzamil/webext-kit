// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { fakeBrowser } from "@webext-core/fake-browser";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useStorage, useStorageWatch } from "../src/hook";
import { storage } from "../src/index";

describe("useStorage", () => {
	beforeEach(() => {
		fakeBrowser.reset();
		storage.unwatch();
	});

	it("starts in a loading state with the fallback value", () => {
		const { result } = renderHook(() =>
			useStorage("local:count", { fallback: 0 }),
		);

		expect(result.current.loading).toBe(true);
		expect(result.current.value).toBe(0);
	});

	it("loads the existing value from storage", async () => {
		await fakeBrowser.storage.local.set({ count: 5 });

		const { result } = renderHook(() =>
			useStorage("local:count", { fallback: 0 }),
		);

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.value).toBe(5);
		expect(result.current.error).toBeNull();
	});

	it("returns null with no fallback and nothing in storage", async () => {
		const { result } = renderHook(() => useStorage("local:count"));

		await waitFor(() => expect(result.current.loading).toBe(false));
		expect(result.current.value).toBeNull();
	});

	it("setValue writes to storage and updates the returned value", async () => {
		const { result } = renderHook(() =>
			useStorage("local:count", { fallback: 0 }),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.setValue(42);
		});

		expect(result.current.value).toBe(42);
		expect(await fakeBrowser.storage.local.get("count")).toEqual({
			count: 42,
		});
	});

	it("removeValue resets the value back to the fallback", async () => {
		await fakeBrowser.storage.local.set({ count: 10 });
		const { result } = renderHook(() =>
			useStorage("local:count", { fallback: 0 }),
		);
		await waitFor(() => expect(result.current.value).toBe(10));

		await act(async () => {
			await result.current.removeValue();
		});

		expect(result.current.value).toBe(0);
	});

	it("re-renders and calls onChange when the value changes externally", async () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useStorage("local:count", { fallback: 0, onChange }),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			// Simulate a write from another tab/context, bypassing the hook.
			await storage.setItem("local:count", 7);
		});

		await waitFor(() => expect(result.current.value).toBe(7));
		expect(onChange).toHaveBeenCalledWith(7, null);
	});

	it("unsubscribes from storage.watch on unmount", async () => {
		const { result, unmount } = renderHook(() =>
			useStorage("local:count", { fallback: 0 }),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		unmount();
		await act(async () => {
			await storage.setItem("local:count", 99);
		});

		// Nothing to assert on `result` post-unmount; this just verifies no
		// "update on unmounted component" warning/error is thrown.
	});

	it("works with a defineItem() storage item, sharing its fallback", async () => {
		const countItem = storage.defineItem<number>("local:count", {
			fallback: 0,
		});

		const { result } = renderHook(() => useStorage(countItem));
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.setValue(3);
		});

		expect(result.current.value).toBe(3);
		expect(await countItem.getValue()).toBe(3);
	});

	it("re-subscribes when the key changes", async () => {
		await fakeBrowser.storage.local.set({ a: 1, b: 2 });

		const { result, rerender } = renderHook(
			({ key }: { key: "local:a" | "local:b" }) =>
				useStorage(key, { fallback: 0 }),
			{ initialProps: { key: "local:a" } },
		);
		await waitFor(() => expect(result.current.value).toBe(1));

		rerender({ key: "local:b" });
		await waitFor(() => expect(result.current.value).toBe(2));
	});
});

describe("useStorageWatch", () => {
	beforeEach(() => {
		fakeBrowser.reset();
		storage.unwatch();
	});

	it("calls back with new and old values on change, without holding state", async () => {
		const callback = vi.fn();
		renderHook(() => useStorageWatch("local:theme", callback));

		await act(async () => {
			await storage.setItem("local:theme", "dark");
		});

		await waitFor(() => expect(callback).toHaveBeenCalledWith("dark", null));
	});

	it("stops calling back after unmount", async () => {
		const callback = vi.fn();
		const { unmount } = renderHook(() =>
			useStorageWatch("local:theme", callback),
		);
		unmount();

		await act(async () => {
			await storage.setItem("local:theme", "dark");
		});

		expect(callback).not.toHaveBeenCalled();
	});
});
