import { getExtRuntime } from "./utils";

export type PubSubMessage = {
	from?: number;
	to?: number;
	payload: any;
};

let hubMapInstance: Map<number, chrome.runtime.Port> | undefined;

export const getHubMap = (): Map<number, chrome.runtime.Port> => {
	if (!hubMapInstance) {
		hubMapInstance = new Map();
	}
	return hubMapInstance;
};

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
