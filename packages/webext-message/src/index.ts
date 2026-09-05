import { nanoid } from "nanoid";

import { relay as rawRelay, sendViaRelay as rawSendViaRelay } from "./relay";
import { type ExtMessaging, type MessageName } from "./types";
import { getActiveTab, getExtRuntime, getExtTabs } from "./utils";

/**
 * Default time to wait for a response before rejecting, in ms. Kept
 * finite on purpose: without it, a crashed/restarted background
 * service worker leaves the caller awaiting forever. Override per
 * call via `req.timeoutMs` for genuinely long-running operations.
 */
export const DEFAULT_MESSAGE_TIMEOUT_MS = 30_000;

/**
 * Races `promise` against a timeout, rejecting with a descriptive
 * error if `promise` hasn't settled in time.
 */
const withTimeout = <T>(
	promise: Promise<T>,
	name: string,
	timeoutMs: number,
): Promise<T> => {
	let timer: ReturnType<typeof setTimeout>;
	return Promise.race([
		promise.finally(() => clearTimeout(timer)),
		new Promise<never>((_, reject) => {
			timer = setTimeout(
				() =>
					reject(new Error(`Message '${name}' timed out after ${timeoutMs}ms`)),
				timeoutMs,
			);
		}),
	]);
};

export type {
	ExtMessaging,
	MessageName,
	MessagesMetadata,
	OriginContext,
	PortName,
	PortsMetadata,
} from "./types";

export { initializeBackgroundMessaging } from "./background";
export { listen as onMessage } from "./message";
export { getPort, listen as onPort, onPortConnect } from "./port";
export { broadcast, startHub, subscribe } from "./pub-sub";
export { getActiveTab };
/**
 * Send to Background Service Workers from Content Scripts or Extension pages.
 * extensionId is required to send from Content Script in main world
 */
export const sendToBackground: ExtMessaging.SendFx<MessageName> = async (
	req,
) => {
	const withId = { ...req, requestId: req.requestId || nanoid(8) };
	return withTimeout(
		getExtRuntime().sendMessage(req.extensionId ?? null, withId),
		String(req.name),
		req.timeoutMs ?? DEFAULT_MESSAGE_TIMEOUT_MS,
	);
};

/**
 * Send to Content Scripts from Extension pages or Background Service Workers.
 * Defaults to active tab if no tabId provided
 */
export const sendToContentScript: ExtMessaging.SendFx = async (req) => {
	const tabId =
		typeof req.tabId === "number" ? req.tabId : (await getActiveTab())?.id;

	if (!tabId) {
		throw new Error("No active tab found to send message to.");
	}

	const withId = { ...req, requestId: req.requestId || nanoid(8) };
	return withTimeout(
		getExtTabs().sendMessage(tabId, withId),
		String(req.name),
		req.timeoutMs ?? DEFAULT_MESSAGE_TIMEOUT_MS,
	);
};

/**
 * @deprecated Renamed to sendToContentScript
 */
export const sendToActiveContentScript = sendToContentScript;

/**
 * Any request sent to this relay gets sent to background, then emitted back as response
 */
export const relayMessage: ExtMessaging.MessageRelayFx = (req) =>
	rawRelay(req, sendToBackground);

/**
 * @deprecated Migrated to relayMessage
 */
export const relay = relayMessage;

/**
 * Sends a request to the background through a `window.postMessage`
 * relay (see {@link rawSendViaRelay}), for contexts that can't use
 * `chrome.runtime.sendMessage` directly (e.g. main-world content
 * scripts).
 */
export const sendToBackgroundViaRelay: ExtMessaging.SendFx<MessageName> =
	rawSendViaRelay;

/**
 * @deprecated Migrated to sendToBackgroundViaRelay
 */
export const sendViaRelay = sendToBackgroundViaRelay;
