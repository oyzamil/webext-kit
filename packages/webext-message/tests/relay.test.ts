import { beforeEach, describe, expect, vi, test } from "vitest";

import type { ExtMessaging } from "../src/types";

const { relay, sendViaRelay } = await import("../src/relay");

class MessagePortMock {
	callbacks = new Set<EventListenerOrEventListenerObject>();

	addEventListener = (
		_message: string,
		callback: EventListenerOrEventListenerObject,
	) => {
		this.callbacks.add(callback);
	};

	removeEventListener = (
		_message: string,
		callback: EventListenerOrEventListenerObject,
	) => {
		this.callbacks.delete(callback);
	};

	postMessage = (data: any) => {
		const event = {
			data,
			source: globalThis.window,
		} as unknown as MessageEvent;

		this.callbacks.forEach((callback) => {
			if (typeof callback === "function") {
				callback(event);
			} else {
				callback.handleEvent(event);
			}
		});
	};

	clear() {
		this.callbacks.clear();
	}
}

/**
 * Message port callbacks happen synchronously
 * But promises get resolved in event queue
 */
const waitForMicroTasks = () => Promise.resolve();

describe("sendViaRelay", () => {
	const port = new MessagePortMock();
	const req: ExtMessaging.Request = {
		name: "test",
		body: { foo: "bar" },
		relayId: "1",
	};

	beforeEach(() => {
		port.clear();
	});

	test("posts message to provided message port", () => {
		let received: any;
		port.addEventListener("message", (evt: Event) => {
			const event = evt as MessageEvent;
			received = event.data;
		});

		sendViaRelay(req, port);

		expect(received).toMatchObject({
			name: req.name,
			body: req.body,
			relayId: req.relayId,
		});
		expect(port.callbacks.size).toBe(2);
	});

	test("appends random instanceId to relayed request", () => {
		let received: any;
		port.addEventListener("message", (evt: Event) => {
			const event = evt as MessageEvent;
			received = event.data;
		});

		sendViaRelay(req, port);

		expect(Object.hasOwn(received, "instanceId")).toBeTruthy();
	});

	test("only resolves body with matching instanceId", async () => {
		let response: any = null;

		port.addEventListener("message", async (evt: Event) => {
			const event = evt as MessageEvent;
			if (event.data.relayed) {
				return;
			}

			port.postMessage({
				...event.data,
				body: { bar: "foo" },
				relayed: true,
				instanceId: "123",
			});
			await waitForMicroTasks();

			expect(response).toEqual(null);

			port.postMessage({
				...event.data,
				body: { bar: "foo" },
				relayed: true,
			});
			await waitForMicroTasks();

			expect(response).toEqual({ bar: "foo" });
		});

		response = await sendViaRelay(req, port);
	});
});

describe("relay", () => {
	const port = new MessagePortMock();
	const req: ExtMessaging.Request = {
		name: "test",
		relayId: "1",
	};
	const handler = (data: any) => {
		return Promise.resolve({ echo: data.body });
	};

	beforeEach(() => {
		port.clear();
	});

	test("returns cleanup function", () => {
		const cleanup = relay(req, handler, port as any);

		expect(port.callbacks.size).toBe(1);

		cleanup();

		expect(port.callbacks.size).toBe(0);
	});

	test("does not handle relayed messages", () => {
		const notCalledHandler = vi.fn((data) => Promise.resolve(data));
		relay(req, notCalledHandler, port as any);

		port.postMessage({ ...req, relayed: true });

		expect(notCalledHandler).not.toBeCalled();
	});

	test("posts back resolution result and instanceId", async () => {
		return new Promise<void>((done) => {
			relay(req, handler, port as any);

			const mockedReq = { ...req, instanceId: "123", body: { foo: "bar" } };

			port.addEventListener("message", async (evt: Event) => {
				const event = evt as MessageEvent;
				if (!event.data.relayed) {
					return;
				}

				expect(event.data.body).toEqual({ echo: mockedReq.body });
				expect(event.data.instanceId).toEqual(mockedReq.instanceId);

				done();
			});

			port.postMessage(mockedReq);
		});
	});
});
