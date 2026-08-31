import {
	initializeBackgroundMessaging,
	onMessage,
	onPortConnect,
	startHub,
	broadcast,
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
				let result;
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

	console.log("[Background] All message handlers registered");
});
