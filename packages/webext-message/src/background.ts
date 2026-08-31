import { type ExtMessaging } from "./types";
import { getExtRuntime } from "./utils";

/**
 * Sets up the background-side listener that answers the internal
 * "is the background context alive" ping used to detect a stale
 * service worker. Safe to call multiple times; each call adds its
 * own listener via `runtime.onMessage`.
 */
export const initializeBackgroundMessaging = (): void => {
	const runtime = getExtRuntime();

	runtime.onMessage.addListener(
		(request: ExtMessaging.InternalRequest, _sender, sendResponse) => {
			if (request.__EXT_MESSAGING_SIGNAL__ === "__EXT_MESSAGING_PING__") {
				sendResponse(true);
				return true;
			}
			return false;
		},
	);
};

// Auto-initialize when this module is imported
if (typeof globalThis !== "undefined" && globalThis.chrome?.runtime) {
	initializeBackgroundMessaging();
}
