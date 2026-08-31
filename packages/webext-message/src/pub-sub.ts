import { getExtRuntime } from "./utils";

/**
 * Message shape used by the tab-to-tab pub/sub hub.
 */
export type PubSubMessage = {
	/** Sender tab id, set automatically by {@link startHub}. */
	from?: number;
	/** Recipient tab id, set automatically per-recipient by {@link broadcast}. */
	to?: number;
	/** Arbitrary message payload. */
	payload: any;
};

let hubMapInstance: Map<number, chrome.runtime.Port> | undefined;

/**
 * Lazily creates and returns the singleton map of connected hub
 * ports, keyed by tab id.
 */
export const getHubMap = (): Map<number, chrome.runtime.Port> => {
	if (!hubMapInstance) {
		hubMapInstance = new Map();
	}
	return hubMapInstance;
};

/**
 * Background only. Starts accepting external port connections (via
 * `chrome.runtime.onConnectExternal`) and relaying messages between
 * connected tabs through {@link broadcast}. Requires
 * `externally_connectable` to be set in the extension manifest.
 *
 * @throws if `onConnectExternal` isn't available (missing manifest config)
 */
export const startHub = (): void => {
	const runtime = getExtRuntime();

	if (!runtime.onConnectExternal) {
		throw new Error(
			"onConnectExternal not available. Need externally_connectable in manifest",
		);
	}

	hubMapInstance = new Map();
	const hub = getHubMap();

	runtime.onConnectExternal.addListener((port) => {
		const tabId = port.sender?.tab?.id;
		if (tabId && !hub.has(tabId)) {
			hub.set(tabId, port);

			port.onMessage.addListener((message) => {
				broadcast({ from: tabId, payload: message });
			});

			port.onDisconnect.addListener(() => {
				hub.delete(tabId);
			});
		}
	});
};

/**
 * Sends `pubSubMessage` to every hub-connected tab except the
 * sender (`pubSubMessage.from`).
 */
export const broadcast = (pubSubMessage: PubSubMessage): void => {
	const hub = getHubMap();
	hub.forEach((port, tabId) => {
		const skipBroadcast = tabId === pubSubMessage.from;
		if (skipBroadcast) {
			return;
		}
		port.postMessage({ ...pubSubMessage, to: tabId });
	});
};

/**
 * Subscribes to incoming runtime messages. Returns an unsubscribe
 * function.
 */
export const subscribe = (
	callback: (message: PubSubMessage) => void,
): (() => void) => {
	const listener = (message: PubSubMessage) => {
		callback(message);
	};

	const runtime = getExtRuntime();
	runtime.onMessage.addListener(listener as any);

	return () => {
		runtime.onMessage.removeListener(listener as any);
	};
};
