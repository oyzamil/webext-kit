import { type PortName } from "./types";
import { getExtRuntime } from "./utils";

const portMap = new Map<PortName, chrome.runtime.Port>();

export const getPort = (name: PortName) => {
	const port = portMap.get(name);
	if (port) {
		return port;
	}
	const newPort = getExtRuntime().connect({ name });
	portMap.set(name, newPort);
	return newPort;
};

export const removePort = (name: PortName) => {
	portMap.delete(name);
};

export const listen = <ResponseBody = any>(
	name: PortName,
	handler: (msg: ResponseBody) => Promise<void> | void,
	onReconnect?: () => void,
) => {
	const port = getPort(name);

	function reconnectHandler() {
		removePort(name);
		onReconnect?.();
	}

	const wrappedHandler = async (msg: ResponseBody) => {
		try {
			await handler(msg);
		} catch (error) {
			console.error("Port handler error:", error);
		}
	};

	port.onMessage.addListener(wrappedHandler);
	port.onDisconnect.addListener(reconnectHandler);

	return {
		port,
		disconnect: () => {
			port.onMessage.removeListener(wrappedHandler);
			port.onDisconnect.removeListener(reconnectHandler);
		},
	};
};

type PortConnectResult = {
	onMessage?: (msg: any) => void;
	onDisconnect?: () => void;
} | void;

/**
 * Background only: accept-side. Fires when a port named `name` connects
 * in (e.g. a content script or popup calling `getPort`/`onPort`).
 * Handler receives the raw `chrome.runtime.Port` and returns
 * `{ onMessage, onDisconnect }` to wire up. Distinct from `onPort`
 * (client connect-out) because the two shapes can't be told apart by
 * the type checker if merged into one overloaded function.
 */
export const onPortConnect = (
	name: PortName,
	handler: (
		port: chrome.runtime.Port,
	) => PortConnectResult | Promise<PortConnectResult>,
) => {
	const runtime = getExtRuntime();

	const connectListener = async (port: chrome.runtime.Port) => {
		if (port.name !== name) {
			return;
		}

		const result = await handler(port);

		if (result?.onMessage) {
			port.onMessage.addListener(result.onMessage);
		}
		port.onDisconnect.addListener(() => {
			result?.onDisconnect?.();
		});
	};

	runtime.onConnect.addListener(connectListener);

	return () => {
		runtime.onConnect.removeListener(connectListener);
	};
};
