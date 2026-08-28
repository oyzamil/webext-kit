import { beforeEach, describe, expect, test, vi } from "vitest";

let mockRuntime: any;
let mockPort: any;

vi.mock("../src/utils", () => ({
	getExtRuntime: vi.fn(() => mockRuntime),
	getExtTabs: vi.fn(),
	getActiveTab: vi.fn(),
	isSameOrigin: vi.fn(),
	getRuntimeContext: vi.fn(),
}));

const { listen, getPort, removePort } = await import("../src/port");

describe("port.getPort", () => {
	beforeEach(() => {
		mockPort = {
			name: "test-port",
			onMessage: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
			onDisconnect: {
				addListener: vi.fn(),
				removeListener: vi.fn(),
			},
		};

		mockRuntime = {
			connect: vi.fn(() => mockPort),
		};

		// Clear the port map
		removePort("test-port");
	});

	test("creates new port via runtime.connect", () => {
		const port = getPort("test-port");

		expect(mockRuntime.connect).toHaveBeenCalledWith({ name: "test-port" });
		expect(port).toBe(mockPort);
	});

	test("caches port for subsequent calls", () => {
		getPort("test-port");
		const port2 = getPort("test-port");

		expect(mockRuntime.connect).toHaveBeenCalledTimes(1);
		expect(port2).toBe(mockPort);
	});
});

describe("port.listen", () => {
	beforeEach(() => {
		mockPort = {
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
		};

		mockRuntime = {
			connect: vi.fn(() => mockPort),
		};

		removePort("test-port");
	});

	test("registers message listener", () => {
		const handler = vi.fn();
		listen("test-port", handler);

		expect(mockPort.onMessage.addListener).toHaveBeenCalled();
	});

	test("registers disconnect listener", () => {
		const handler = vi.fn();
		listen("test-port", handler);

		expect(mockPort.onDisconnect.addListener).toHaveBeenCalled();
	});

	test("returns disconnect function", () => {
		const handler = vi.fn();
		const { disconnect } = listen("test-port", handler);

		expect(typeof disconnect).toBe("function");
	});

	test("calls reconnect callback on disconnect", () => {
		const handler = vi.fn();
		const onReconnect = vi.fn();

		listen("test-port", handler, onReconnect);

		const disconnectListener =
			mockPort.onDisconnect.addListener.mock.calls[0][0];
		disconnectListener();

		expect(onReconnect).toHaveBeenCalled();
	});

	test("removes port from cache on disconnect", () => {
		const handler = vi.fn();
		const onReconnect = vi.fn();

		listen("test-port", handler, onReconnect);

		const disconnectListener =
			mockPort.onDisconnect.addListener.mock.calls[0][0];
		disconnectListener();

		// Next call should create a new port
		mockRuntime.connect.mockClear();
		getPort("test-port");

		expect(mockRuntime.connect).toHaveBeenCalledTimes(1);
	});

	test("handles handler errors", async () => {
		const error = new Error("Handler failed");
		const handler = vi.fn(() => {
			throw error;
		});

		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		listen("test-port", handler);

		const messageListener = mockPort.onMessage.addListener.mock.calls[0][0];
		messageListener({ data: "test" });

		await Promise.resolve();

		expect(consoleSpy).toHaveBeenCalledWith("Port handler error:", error);

		consoleSpy.mockRestore();
	});

	test("cleans up listeners on disconnect", () => {
		const handler = vi.fn();
		const { disconnect } = listen("test-port", handler);

		disconnect();

		expect(mockPort.onMessage.removeListener).toHaveBeenCalled();
		expect(mockPort.onDisconnect.removeListener).toHaveBeenCalled();
	});
});
