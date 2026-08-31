import {
	sendToBackground,
	sendToBackgroundViaRelay,
	onMessage,
} from "webext-message";

export default defineContentScript({
	matches: ["*://*.example.com/*"],
	main() {
		console.log("[Content Script] Initialized");

		// Listen for messages from background
		onMessage<{ type: string }, { acknowledged: boolean }>(
			async (request, response) => {
				console.log("[Content Script] Received from background:", request);

				if (request.name === "content-notify") {
					response.send({ acknowledged: true });
				}
			},
		);

		// Example: Send message to background
		async function sendEchoMessage(text: string) {
			try {
				const response = await sendToBackground<
					{ echo: string },
					{ echoed: string }
				>({
					name: "echo-message",
					body: { echo: text },
				});

				console.log("[Content Script] Response:", response);
			} catch (error) {
				console.error("[Content Script] Error:", error);
			}
		}

		// Example: Process data through background
		async function processData(data: any) {
			try {
				interface DataResponse {
					status: "success" | "error";
					data?: any;
					error?: string;
				}

				const response = await sendToBackground<any, DataResponse>({
					name: "process-data",
					body: { type: "process", payload: data },
				});

				console.log("[Content Script] Process result:", response);
			} catch (error) {
				console.error("[Content Script] Process error:", error);
			}
		}

		// Example: Get current tab info
		async function getTabInfo() {
			try {
				interface TabInfo {
					tabId: number;
					url: string | undefined;
				}

				const response = await sendToBackground<{}, TabInfo>({
					name: "get-tab-info",
				});

				console.log("[Content Script] Tab info:", response);
			} catch (error) {
				console.error("[Content Script] Tab info error:", error);
			}
		}

		// Example: Relay communication
		async function relayMessage(text: string) {
			try {
				const response = await sendToBackgroundViaRelay<
					{ message: string },
					{ broadcastId: string }
				>({
					name: "broadcast-message",
					body: { message: text },
				});

				console.log("[Content Script] Relay response:", response);
			} catch (error) {
				console.error("[Content Script] Relay error:", error);
			}
		}

		// Make functions available on window for testing
		if (typeof window !== "undefined") {
			(window as any).__extMessagingDemo = {
				sendEchoMessage,
				processData,
				getTabInfo,
				relayMessage,
			};
		}

		// Run some examples on load
		setTimeout(() => {
			getTabInfo();
			sendEchoMessage("Hello from content script");
			processData(["a", "b", "c"]);
		}, 1000);
	},
});
