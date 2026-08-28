import { relay as rawRelay, sendViaRelay as rawSendViaRelay } from "./relay";
import { type ExtMessaging, type MessageName } from "./types";
import { getActiveTab, getExtRuntime, getExtTabs } from "./utils";

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

/**
 * Send to Background Service Workers from Content Scripts or Extension pages.
 * extensionId is required to send from Content Script in main world
 */
export const sendToBackground: ExtMessaging.SendFx<MessageName> = async (
	req,
) => {
	return getExtRuntime().sendMessage(req.extensionId ?? null, req);
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

	return getExtTabs().sendMessage(tabId, req);
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

export const sendToBackgroundViaRelay: ExtMessaging.SendFx<MessageName> =
	rawSendViaRelay;

/**
 * @deprecated Migrated to sendToBackgroundViaRelay
 */
export const sendViaRelay = sendToBackgroundViaRelay;
