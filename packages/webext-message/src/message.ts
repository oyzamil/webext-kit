import { type ExtMessaging } from "./types";
import { getExtRuntime } from "./utils";

/**
 * Registers a `chrome.runtime.onMessage` listener that calls
 * `handler` for every incoming message, attaching `sender` onto the
 * request and forwarding `handler`'s `send` call as the async
 * response. Handler errors are caught and logged; the listener
 * always responds with `true` to keep the message channel open for
 * the async reply. Returns an unsubscribe function.
 */
export const listen = <RequestBody = any, ResponseBody = any>(
	handler: ExtMessaging.Handler<string, RequestBody, ResponseBody>,
): (() => void) => {
	const metaListener = async (
		req: any,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response?: ResponseBody) => void,
	) => {
		try {
			await handler?.(
				{
					...req,
					sender,
				},
				{
					send: (p) => sendResponse(p),
				},
			);
		} catch (error) {
			console.error("Message handler error:", error);
			sendResponse(undefined);
		}
	};

	const listener = (
		req: any,
		sender: chrome.runtime.MessageSender,
		sendResponse: (response?: ResponseBody) => void,
	) => {
		metaListener(req, sender, sendResponse);
		return true;
	};

	const runtime = getExtRuntime();
	runtime.onMessage.addListener(listener);

	return () => {
		runtime.onMessage.removeListener(listener);
	};
};
