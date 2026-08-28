import { beforeEach, describe, expect, test, vi } from "vitest";

let mockRuntime: any;

vi.mock("../src/utils", () => ({
	getExtRuntime: vi.fn(() => mockRuntime),
	getExtTabs: vi.fn(),
	getActiveTab: vi.fn(),
	isSameOrigin: vi.fn(),
	getRuntimeContext: vi.fn(),
}));

const { listen } = await import("../src/message");

describe("message.listen", () => {
	beforeEach(() => {
		mockRuntime = {
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};
	});

	test("registers message listener", () => {
		const handler = vi.fn();
		listen(handler);

		expect(mockRuntime.onMessage.addListener).toHaveBeenCalled();
	});

	test("returns cleanup function", () => {
		const handler = vi.fn();
		const cleanup = listen(handler);

		expect(typeof cleanup).toBe("function");
		cleanup();
		expect(mockRuntime.onMessage.removeListener).toHaveBeenCalled();
	});

	test("calls handler with request and response objects", async () => {
		const handler = vi.fn();
		listen(handler);

		const listener = mockRuntime.onMessage.addListener.mock.calls[0][0];
		const request = { name: "test", body: { data: "test" } };
		const sender = { tab: { id: 1 } };
		const sendResponse = vi.fn();

		listener(request, sender, sendResponse);
		await Promise.resolve();

		expect(handler).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "test",
				body: { data: "test" },
				sender,
			}),
			expect.objectContaining({
				send: expect.any(Function),
			}),
		);
	});

	test("sends response via sendResponse callback", async () => {
		const sendResponse = vi.fn();
		const handler = vi.fn((req, res) => {
			res.send({ result: "success" });
		});

		listen(handler);

		const listener = mockRuntime.onMessage.addListener.mock.calls[0][0];
		listener({ name: "test" }, {}, sendResponse);

		await Promise.resolve();

		expect(sendResponse).toHaveBeenCalledWith({ result: "success" });
	});

	test("returns true to indicate async response", () => {
		const handler = vi.fn();
		listen(handler);

		const listener = mockRuntime.onMessage.addListener.mock.calls[0][0];
		const result = listener({ name: "test" }, {}, vi.fn());

		expect(result).toBe(true);
	});

	test("handles handler errors gracefully", async () => {
		const error = new Error("Handler failed");
		const handler = vi.fn(() => {
			throw error;
		});
		const sendResponse = vi.fn();

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		listen(handler);

		const listener = mockRuntime.onMessage.addListener.mock.calls[0][0];
		listener({ name: "test" }, {}, sendResponse);

		await Promise.resolve();

		expect(consoleSpy).toHaveBeenCalledWith("Message handler error:", error);
		expect(sendResponse).toHaveBeenCalledWith(undefined);

		consoleSpy.mockRestore();
	});
});
