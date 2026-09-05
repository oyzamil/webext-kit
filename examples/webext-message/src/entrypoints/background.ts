import {
	broadcast,
	initializeBackgroundMessaging,
	onMessage,
	onPortConnect,
	sendToContentScript,
	startHub,
} from "webext-message";

export default defineBackground(() => {
	// Initialize background messaging
	initializeBackgroundMessaging();

	// Start pub-sub hub for multi-tab communication
	startHub();

	console.log("[Background] webext-message initialized");

	// Example 1: Simple Message Handler
	onMessage<{ text: string }, { success: boolean }>(
		async (request, response) => {
			console.log("[Background] Message received:", request);

			if (request.name === "simple-message") {
				const { text } = request.body || {};
				console.log("[Background] Processing:", text);

				// Simulate async operation
				await new Promise((resolve) => setTimeout(resolve, 100));

				response.send({ success: true });
			}
		},
	);

	// Example 2: Echo Handler
	onMessage<{ echo: string }, { echoed: string }>(async (request, response) => {
		if (request.name === "echo-message") {
			const { echo } = request.body || {};
			response.send({ echoed: `Echo: ${echo}` });
		}
	});

	// Example 3: Tab Info Handler
	onMessage<{}, { tabId: number; url: string | undefined }>(
		async (request, response) => {
			if (request.name === "get-tab-info" && request.sender?.tab) {
				response.send({
					tabId: request.sender.tab.id || 0,
					url: request.sender.tab.url,
				});
			}
		},
	);

	// Example 4: Port Communication
	const portHandlers = new Map<string, (msg: any) => void>();

	onPortConnect("demo-port", async (port) => {
		console.log("[Background] Port connected:", port.name);

		const handlePortMessage = (msg: any) => {
			console.log("[Background] Port message:", msg);

			// Echo back with timestamp
			port.postMessage({
				type: "response",
				original: msg,
				timestamp: Date.now(),
			});
		};

		portHandlers.set("demo-port", handlePortMessage);

		return {
			onMessage: handlePortMessage,
			onDisconnect: () => {
				console.log("[Background] Port disconnected:", port.name);
				portHandlers.delete("demo-port");
			},
		};
	});

	// Example 5: Complex Data Handler
	interface DataRequest {
		type: "fetch" | "process" | "save";
		payload: any;
	}

	interface DataResponse {
		status: "success" | "error";
		data?: any;
		error?: string;
	}

	onMessage<DataRequest, DataResponse>(async (request, response) => {
		if (request.name === "process-data") {
			const { type, payload } = request.body || {};

			try {
				let result: any;
				switch (type) {
					case "fetch":
						result = { fetched: true, items: [1, 2, 3] };
						break;
					case "process":
						result = { processed: payload, count: payload?.length || 0 };
						break;
					case "save":
						result = { saved: true, id: Math.random() };
						break;
					default:
						throw new Error("Unknown type");
				}

				response.send({ status: "success", data: result });
			} catch (error) {
				response.send({
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}
	});

	// Example 6: Pub-Sub Broadcast
	onMessage<{ message: string }, { broadcastId: string }>(
		async (request, response) => {
			if (request.name === "broadcast-message") {
				const broadcastId = Math.random().toString(36).substring(7);

				// Broadcast to all other tabs
				broadcast({
					payload: {
						type: "notification",
						message: request.body?.message,
						from: request.sender?.tab?.id,
						broadcastId,
					},
				});

				response.send({ broadcastId });
			}
		},
	);

	// Example 7: Error Handler
	onMessage<{ shouldError: boolean }, { result?: string }>(
		async (request, response) => {
			if (request.name === "test-error") {
				if (request.body?.shouldError) {
					throw new Error("Intentional error for testing");
				}

				response.send({ result: "Success without error" });
			}
		},
	);

	// Example 8: Relay a message from the popup to a content script.
	// Popups can't be targeted by sendToContentScript() directly (they aren't
	// tabs), and content scripts can't call it at all (it's background-only),
	// so the background acts as the go-between.
	onMessage<{ tabId: number; message: string }, { relayed: boolean }>(
		async (request, response) => {
			if (request.name === "relay-to-content") {
				const { tabId, message } = request.body || {};

				if (tabId) {
					await sendToContentScript<
						{ message: string },
						{ acknowledged: boolean }
					>({
						tabId,
						name: "content-notify-popup",
						body: { message: message || "" },
					});
				}

				response.send({ relayed: true });
			}
		},
	);

	// Example 9: Content script asks the background to open the options page
	// and the popup, then hand them a message. Options/popup pages aren't
	// tabs either, so instead of "sending" to them directly we (a) open them
	// with the real extension APIs and (b) stash the message so they can pull
	// it as soon as they mount via `get-latest-notification`.
	const latestNotifications: {
		options: { message: string; timestamp: number } | null;
		popup: { message: string; timestamp: number } | null;
	} = { options: null, popup: null };

	onMessage<
		{ target: "options" | "popup"; message: string },
		{ opened: boolean }
	>(async (request, response) => {
		if (request.name === "open-and-notify") {
			const target = request.body?.target;
			const message = request.body?.message || "";

			if (target === "options" || target === "popup") {
				latestNotifications[target] = { message, timestamp: Date.now() };

				if (target === "options") {
					try {
						// The real API is `runtime.openOptionsPage()` — there is no
						// `browser.openOptionsPage()`.
						await browser.runtime.openOptionsPage();
					} catch (error) {
						console.error("[Background] Failed to open options page:", error);
					}
				} else {
					try {
						// The real API is `action.openPopup()` (MV3) — there is no
						// `browser.openAction()`. Support for opening the popup
						// programmatically is newer and browser-dependent, so this
						// is best-effort.
						await browser.action.openPopup();
					} catch (error) {
						console.warn(
							"[Background] action.openPopup() isn't supported here:",
							error,
						);
					}
				}

				// Also broadcast, in case the target page is already open and
				// subscribed when this fires.
				broadcast({
					payload: {
						type: "notification",
						target,
						...latestNotifications[target],
					},
				});
			}

			response.send({ opened: true });
		}
	});

	onMessage<
		{ target: "options" | "popup" },
		{ message: string; timestamp: number } | null
	>(async (request, response) => {
		if (request.name === "get-latest-notification") {
			const target = request.body?.target;
			response.send(target ? latestNotifications[target] : null);
		}
	});

	console.log("[Background] All message handlers registered");
});
