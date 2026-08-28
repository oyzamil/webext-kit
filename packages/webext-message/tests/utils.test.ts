import { beforeEach, describe, expect, test } from "vitest";

import {
	getActiveTab,
	getExtRuntime,
	getExtTabs,
	getRuntimeContext,
	isSameOrigin,
} from "../src/utils";

describe("getExtRuntime", () => {
	beforeEach(() => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).browser;
	});

	test("returns chrome.runtime", () => {
		(globalThis as any).chrome = {
			runtime: { sendMessage: () => {} },
		};

		const runtime = getExtRuntime();
		expect(runtime).toBeDefined();
	});

	test("returns browser.runtime as fallback", () => {
		(globalThis as any).browser = {
			runtime: { sendMessage: () => {} },
		};

		const runtime = getExtRuntime();
		expect(runtime).toBeDefined();
	});

	test("throws error when runtime not available", () => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).browser;

		expect(() => getExtRuntime()).toThrow("Extension runtime is not available");
	});
});

describe("getExtTabs", () => {
	beforeEach(() => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).browser;
	});

	test("returns chrome.tabs", () => {
		(globalThis as any).chrome = {
			tabs: { query: () => {} },
		};

		const tabs = getExtTabs();
		expect(tabs).toBeDefined();
	});

	test("throws error when tabs not available", () => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).browser;

		expect(() => getExtTabs()).toThrow("Extension tabs API is not available");
	});
});

describe("getActiveTab", () => {
	beforeEach(() => {
		(globalThis as any).chrome = {
			tabs: {
				query: async () => [{ id: 1, url: "https://example.com" }],
			},
		};
	});

	test("queries active tab in current window", async () => {
		const tab = await getActiveTab();

		expect(tab?.id).toBe(1);
	});

	test("returns undefined when no active tab", async () => {
		(globalThis as any).chrome.tabs.query = async () => [];

		const tab = await getActiveTab();

		expect(tab).toBeUndefined();
	});
});

describe("isSameOrigin", () => {
	test("returns true for same origin request", () => {
		const event = {
			source: globalThis.window,
			data: { name: "test", relayId: "1" },
		} as unknown as MessageEvent;

		const req = {
			name: "test",
			relayId: "1",
			__internal: undefined,
		};

		const result = isSameOrigin(event, req);

		expect(result).toBe(true);
	});

	test("returns false for different source", () => {
		const event = {
			source: {},
			data: { name: "test" },
		} as MessageEvent;

		const req = { name: "test" };

		const result = isSameOrigin(event, req);

		expect(result).toBe(false);
	});

	test("returns false for different message name", () => {
		const event = {
			source: globalThis.window,
			data: { name: "test-1" },
		} as unknown as MessageEvent;

		const req = { name: "test-2" };

		const result = isSameOrigin(event, req);

		expect(result).toBe(false);
	});

	test("returns false for different relayId", () => {
		const event = {
			source: globalThis.window,
			data: { name: "test", relayId: "1" },
		} as unknown as MessageEvent;

		const req = { name: "test", relayId: "2" };

		const result = isSameOrigin(event, req);

		expect(result).toBe(false);
	});

	test("returns false for internal requests", () => {
		const event = {
			source: globalThis.window,
			data: { name: "test" },
		} as unknown as MessageEvent;

		const req = { name: "test", __internal: true };

		const result = isSameOrigin(event, req);

		expect(result).toBe(false);
	});
});

describe("getRuntimeContext", () => {
	beforeEach(() => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).window;
	});

	test("detects background context", () => {
		(globalThis as any).chrome = {
			runtime: {},
			tabs: {},
		};

		const context = getRuntimeContext();
		expect(context).toBe("background");
	});

	test("detects content-script context", () => {
		(globalThis as any).chrome = {
			runtime: {},
		};
		const mockWindow: any = {};
		mockWindow.parent = mockWindow;
		(globalThis as any).window = mockWindow;

		const context = getRuntimeContext();
		expect(context).toBe("content-script");
	});

	test("returns undefined when no runtime available", () => {
		delete (globalThis as any).chrome;
		delete (globalThis as any).window;

		const context = getRuntimeContext();
		expect(context).toBeUndefined();
	});
});
