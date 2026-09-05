import {
	onMessage,
	sendToBackground,
	sendToBackgroundViaRelay,
} from "webext-message";

export default defineContentScript({
	matches: ["*://*.example.com/*"],
	cssInjectionMode: "ui",
	async main(ctx) {
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

		// Listen for messages relayed from the popup (popup -> background ->
		// here, since sendToContentScript() is background-only).
		onMessage<{ message: string }, { acknowledged: boolean }>(
			async (request, response) => {
				if (request.name === "content-notify-popup") {
					console.log(
						"[Content Script] Message relayed from popup:",
						request.body?.message,
					);
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

		// Example: Ask the background to open the options page + popup and
		// hand each of them a message. Content scripts can't reach those pages
		// directly (they aren't tabs), so this goes through the background.
		function notifyOptionsAndPopup(target: "options" | "popup") {
			return async () => {
				try {
					const response = await sendToBackground<
						{ target: "options" | "popup"; message: string },
						{ opened: boolean }
					>({
						name: "open-and-notify",
						body: {
							target,
							message: `Hello ${target} from the content script button!`,
						},
					});

					console.log("[Content Script] Open & notify response:", response);
				} catch (error) {
					console.error("[Content Script] Open & notify error:", error);
				}
			};
		}

		// Make functions available on window for testing
		if (typeof window !== "undefined") {
			(window as any).__extMessagingDemo = {
				sendEchoMessage,
				processData,
				getTabInfo,
				relayMessage,
				notifyOptionsAndPopup,
			};
		}

		// Run some examples on load
		setTimeout(() => {
			getTabInfo();
			sendEchoMessage("Hello from content script");
			processData(["a", "b", "c"]);
		}, 1000);

		// Inject a small floating panel (in a shadow root, so its styles never
		// leak into the host page) with buttons demonstrating both
		// content-script-initiated flows.
		const ui = await createShadowRootUi(ctx, {
			name: "webext-message-demo-panel",
			position: "inline",
			anchor: "body",
			onMount: (container) => {
				const panel = document.createElement("div");
				panel.style.cssText = [
					"position:fixed",
					"bottom:16px",
					"right:16px",
					"z-index:2147483647",
					"display:flex",
					"flex-direction:column",
					"gap:8px",
					"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
				].join(";");

				const makeButton = (label: string, onClick: () => void) => {
					const button = document.createElement("button");
					button.type = "button";
					button.textContent = label;
					button.style.cssText = [
						"padding:10px 14px",
						"background:#667eea",
						"color:#fff",
						"border:none",
						"border-radius:6px",
						"cursor:pointer",
						"font-size:13px",
						"font-weight:500",
						"box-shadow:0 2px 6px rgba(0,0,0,0.2)",
					].join(";");
					button.addEventListener("click", onClick);
					return button;
				};

				panel.append(
					makeButton("📤 Send to Background", () =>
						sendEchoMessage("Hello from the content script button"),
					),
					makeButton("🔔 Notify Options", notifyOptionsAndPopup("options")),
					makeButton("🔔 Notify Popup", notifyOptionsAndPopup("popup")),
				);

				container.append(panel);
			},
		});

		ui.mount();
	},
});
