import { type PortName } from "./types";
import { getExtRuntime } from "./utils";

const portMap = new Map<PortName, chrome.runtime.Port>();

/**
 * Returns the cached `chrome.runtime.Port` for `name`, connecting
 * one via `runtime.connect` on first use. Client-side (connect-out):
 * for the background-side accept listener, see {@link onPortConnect}.
 */
export const getPort = (name: PortName): chrome.runtime.Port => {
	const port = portMap.get(name);
	if (port) {
		return port;
	}
	const newPort = getExtRuntime().connect({ name });
	portMap.set(name, newPort);
	return newPort;
};

/**
 * Drops the cached port for `name`, if any, so the next
 * {@link getPort} call opens a fresh connection.
 */
export const removePort = (name: PortName) => {
	portMap.delete(name);
};

/**
 * Connects to (or reuses) the port named `name` and listens for
 * messages on it. On disconnect, clears the cached port and invokes
 * `onReconnect` so the caller can reconnect on demand. Returns the
 * underlying port plus a `disconnect` function that removes this
 * handler's listeners (without closing the port itself).
 *
 * @param name port name to connect to
 * @param handler called with each message received on the port
 * @param onReconnect optional callback fired when the port disconnects
 */
export const listen = <ResponseBody = any>(
	name: PortName,
	handler: (msg: ResponseBody) => Promise<void> | void,
	onReconnect?: () => void,
): { port: chrome.runtime.Port; disconnect: () => void } => {
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

/**
 * Wiring returned by an {@link onPortConnect} handler: listeners to
 * attach to the newly-connected port. Returning nothing (`void`)
 * skips wiring anything up.
 */
type PortConnectResult = {
	/** Called with each message received on the port. */
	onMessage?: (msg: any) => void;
	/** Called when the port disconnects. */
	onDisconnect?: () => void;
} | void;

/**
 * Background only: accept-side. Fires when a port named `name` connects
 * in (e.g. a content script or popup calling `getPort`/`onPort`).
 * Handler receives the raw `chrome.runtime.Port` and returns
 * `{ onMessage, onDisconnect }` to wire up. Distinct from `onPort`
 * (client connect-out) because the two shapes can't be told apart by
 * the type checker if merged into one overloaded function.
 *
 * @param name port name to accept connections for
 * @param handler invoked with the connecting port; may be async
 * @returns unsubscribe function that stops accepting new connections
 */
export const onPortConnect = (
	name: PortName,
	handler: (
		port: chrome.runtime.Port,
	) => PortConnectResult | Promise<PortConnectResult>,
): (() => void) => {
	const runtime = getExtRuntime();

	const connectListener = async (port: chrome.runtime.Port) => {
		if (port.name !== name) {
			return;
		}

		try {
			const result = await handler(port);

			if (result?.onMessage) {
				port.onMessage.addListener(result.onMessage);
			}
			port.onDisconnect.addListener(() => {
				try {
					result?.onDisconnect?.();
				} catch (error) {
					console.error(`Port disconnect handler error for '${name}':`, error);
				}
			});
		} catch (error) {
			console.error(`Port connect handler error for '${name}':`, error);
			port.disconnect();
		}
	};

	runtime.onConnect.addListener(connectListener);

	return () => {
		runtime.onConnect.removeListener(connectListener);
	};
};
