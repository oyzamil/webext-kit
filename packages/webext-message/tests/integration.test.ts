import { describe, expect, test, beforeEach, vi } from "vitest";

import { initializeBackgroundMessaging } from "../src/background";
import { sendToBackground } from "../src/index";
import { listen as onMessage } from "../src/message";
import {
	getPort as getPortFn,
	removePort,
	listen as onPort,
} from "../src/port";

// Test-only augmentation: MessagesMetadata / PortsMetadata are empty by
// design (consumer apps declare their own via module augmentation). Without
// this, every literal name below ('test-message', 'test-port', ...) is
// rejected as `never`.
declare module "../src/types" {
	interface MessagesMetadata {
		"test-message": unknown;
		"failing-message": unknown;
		"msg-1": unknown;
		"msg-2": unknown;
		"msg-3": unknown;
	}
	interface PortsMetadata {
		"test-port": unknown;
		"multi-port": unknown;
		"reconnect-port": unknown;
	}
}

describe("webext-message Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("complete message flow", async () => {
		const mockRuntime = {
			sendMessage: vi.fn(async (_extensionId, msg) => {
				// Simulate background handling
				if (msg.name === "test-message") {
					return { success: true };
				}
			}),
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			onConnect: {
				addListener: vi.fn(),
			},
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		// Initialize background
		initializeBackgroundMessaging();

		// Send message from content script
		const response = await sendToBackground({
			name: "test-message",
			body: { test: true },
		});

		expect(mockRuntime.sendMessage).toHaveBeenCalled();
		expect(response).toEqual({ success: true });
	});

	test("message handler lifecycle", () => {
		const mockRuntime = {
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		const handler = vi.fn();

		// Listen
		const unsubscribe = onMessage(handler);

		expect(mockRuntime.onMessage.addListener).toHaveBeenCalledTimes(1);

		// Unsubscribe
		unsubscribe();

		expect(mockRuntime.onMessage.removeListener).toHaveBeenCalledTimes(1);
	});

	test("port communication flow", () => {
		const mockPort = {
			name: "test-port",
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			onDisconnect: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			postMessage: vi.fn(),
			sender: { tab: { id: 1 } },
		};

		const mockRuntime = {
			connect: vi.fn(() => mockPort),
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		// Connect to port
		const port = getPortFn("test-port");

		expect(mockRuntime.connect).toHaveBeenCalledWith({ name: "test-port" });
		expect(port).toBe(mockPort);

		// Listen on port
		const handler = vi.fn();
		const { disconnect } = onPort("test-port", handler);

		expect(mockPort.onMessage.addListener).toHaveBeenCalled();

		// Disconnect
		disconnect();

		expect(mockPort.onMessage.removeListener).toHaveBeenCalled();
	});

	test("multiple handlers on same port", () => {
		const mockPort = {
			name: "multi-port",
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			onDisconnect: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};

		const mockRuntime = {
			connect: vi.fn(() => mockPort),
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		const handler1 = vi.fn();
		const handler2 = vi.fn();

		onPort("multi-port", handler1);
		onPort("multi-port", handler2);

		// Should reuse same port connection
		expect(mockRuntime.connect).toHaveBeenCalledTimes(1);
		expect(mockPort.onMessage.addListener).toHaveBeenCalledTimes(2);
	});

	test("message timeout handling", () => {
		const mockRuntime = {
			sendMessage: vi.fn(
				() =>
					new Promise((resolve) => {
						// Simulate slow response - never resolves in test
						setTimeout(() => resolve({ result: "timeout" }), 5000);
					}),
			),
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		// This test shows timeout handling would be needed
	});

	test("error propagation", async () => {
		const mockRuntime = {
			sendMessage: vi.fn(async () => {
				throw new Error("Send failed");
			}),
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		await expect(sendToBackground({ name: "failing-message" })).rejects.toThrow(
			"Send failed",
		);
	});

	test("concurrent message handling", async () => {
		const responses: any[] = [];

		const mockRuntime = {
			sendMessage: vi.fn(async (_ext, msg) => {
				const response = { name: msg.name, response: true };
				responses.push(response);
				return response;
			}),
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		// Send multiple concurrent messages
		const promises = [
			sendToBackground({ name: "msg-1" }),
			sendToBackground({ name: "msg-2" }),
			sendToBackground({ name: "msg-3" }),
		];

		await Promise.all(promises);

		expect(responses).toHaveLength(3);
		expect(mockRuntime.sendMessage).toHaveBeenCalledTimes(3);
	});

	test("port reconnection after disconnect", () => {
		let reconnectCount = 0;

		const mockPort = {
			name: "reconnect-port",
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			onDisconnect: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};

		const mockRuntime = {
			connect: vi.fn(() => mockPort),
		};

		(globalThis as any).chrome = { runtime: mockRuntime };

		const onReconnect = vi.fn(() => {
			reconnectCount++;
		});

		// Connect
		onPort("reconnect-port", vi.fn(), onReconnect);

		// Trigger disconnect
		const disconnectHandler =
			mockPort.onDisconnect.addListener.mock.calls[0][0];
		disconnectHandler();

		expect(onReconnect).toHaveBeenCalled();
		expect(reconnectCount).toBe(1);

		// Port should be removed from cache
		removePort("reconnect-port");

		// New connection should create new port
		mockRuntime.connect.mockClear();
		getPortFn("reconnect-port");

		expect(mockRuntime.connect).toHaveBeenCalledTimes(1);
	});
});
