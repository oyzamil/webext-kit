import { type ExtMessaging, type PortName } from "./types";
import { getExtRuntime } from "./utils";

let portMapInstance: Map<PortName, chrome.runtime.Port> | undefined;

export const getPortMap = (): Map<PortName, chrome.runtime.Port> => {
	if (!portMapInstance) {
		portMapInstance = new Map<PortName, chrome.runtime.Port>();
	}
	return portMapInstance;
};

export const getPort = (name: PortName): chrome.runtime.Port => {
	const portMap = getPortMap();
	const port = portMap.get(name);
	if (!port) {
		throw new Error(`Port ${name} not found`);
	}
	return port;
};

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

	runtime.onConnect.addListener((port) => {
		const portMap = getPortMap();
		portMap.set(port.name as PortName, port);

		port.onDisconnect.addListener(() => {
			portMap.delete(port.name as PortName);
		});
	});
};

// Auto-initialize when this module is imported
if (typeof globalThis !== "undefined" && globalThis.chrome?.runtime) {
	initializeBackgroundMessaging();
}
