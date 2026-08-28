import { getExtRuntime } from "./utils";

export type PubSubMessage = {
	from?: number;
	to?: number;
	payload: any;
};

declare global {
	var __extMessagingHubMap: Map<number, chrome.runtime.Port> | undefined;
}

export const getHubMap = (): Map<number, chrome.runtime.Port> => {
	if (!globalThis.__extMessagingHubMap) {
		globalThis.__extMessagingHubMap = new Map();
	}
	return globalThis.__extMessagingHubMap;
};

export const startHub = () => {
	const runtime = getExtRuntime();

	if (!runtime.onConnectExternal) {
		throw new Error(
			"onConnectExternal not available. Need externally_connectable in manifest",
		);
	}

	globalThis.__extMessagingHubMap = new Map();
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

export const broadcast = (pubSubMessage: PubSubMessage) => {
	const hub = getHubMap();
	hub.forEach((port, tabId) => {
		const skipBroadcast = tabId === pubSubMessage.from;
		if (skipBroadcast) {
			return;
		}
		port.postMessage({ ...pubSubMessage, to: tabId });
	});
};

export const subscribe = (callback: (message: PubSubMessage) => void) => {
	const listener = (message: PubSubMessage) => {
		callback(message);
	};

	const runtime = getExtRuntime();
	runtime.onMessage.addListener(listener as any);

	return () => {
		runtime.onMessage.removeListener(listener as any);
	};
};
