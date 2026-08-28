import type { ExtMessaging } from "./types";
import { getExtRuntime } from "./utils";

export const listen = <RequestBody = any, ResponseBody = any>(
	handler: ExtMessaging.Handler<string, RequestBody, ResponseBody>,
) => {
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
