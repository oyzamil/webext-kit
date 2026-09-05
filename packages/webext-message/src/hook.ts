import { useEffect, useRef, useState } from "react";

import { listen as messageListen } from "./message";
import { listen as portListen } from "./port";
import { relay } from "./relay";
import { type ExtMessaging, type MessageName } from "./types";

/**
 * Used in any extension context to listen and send messages to background.
 *
 * Wraps {@link messageListen}: tracks the latest received body in
 * state and re-registers the listener whenever `handler` changes.
 */
export const useMessage = <RequestBody = any, ResponseBody = any>(
	handler: ExtMessaging.Handler<string, RequestBody, ResponseBody>,
) => {
	const [data, setData] = useState<RequestBody>();

	useEffect(
		() =>
			messageListen<RequestBody, ResponseBody>(async (req, res) => {
				setData(req.body);
				await handler(req, res);
			}),
		[handler],
	);

	return {
		data,
	};
};

/**
 * Hook for connecting to and communicating over a named port. Tracks
 * the latest received message in state, reconnects when `name`
 * changes, and exposes `send`/`listen` for imperative use.
 */
export const usePort: ExtMessaging.PortHook = (name) => {
	const portRef = useRef<chrome.runtime.Port | undefined>(undefined);
	const reconnectRef = useRef(0);
	const [data, setData] = useState();

	// biome-ignore lint/correctness/useExhaustiveDependencies: Expected
	useEffect(() => {
		if (!name) {
			return;
		}

		const { port, disconnect } = portListen(
			name,
			(msg) => {
				setData(msg);
			},
			() => {
				reconnectRef.current = reconnectRef.current + 1;
			},
		);

		portRef.current = port;
		return disconnect;
	}, [name, reconnectRef.current]);

	return {
		data,
		send: (body) => {
			if (portRef.current) {
				portRef.current.postMessage({
					name,
					body,
				});
			}
		},
		listen: (handler) => portListen(name, handler),
	};
};

/**
 * Hook to set up relay for message relaying
 *
 * Re-sends `req` through the message relay whenever `req.name` or
 * `req.relayId` changes. Imports `relayMessage` lazily from `./index`
 * to avoid a circular dependency at module load time.
 */
export function useMessageRelay<RequestBody = any>(
	req: ExtMessaging.Request<MessageName, RequestBody>,
) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: Expected
	useEffect(() => {
		// Import here to avoid circular dependency
		const relayMessageFn = require("./index")
			.relayMessage as ExtMessaging.MessageRelayFx;
		// relayMessageFn returns an unsubscribe fn — must be returned from
		// the effect so React actually tears the relay down, otherwise it
		// keeps stacking one live listener per mount/dep-change forever.
		return relayMessageFn(req);
	}, [req.name, req.relayId]);
}

/**
 * Hook wrapper around {@link relay}: sets up the `postMessage` relay
 * for `req`/`onMessage` on mount and tears it down on unmount or
 * when either argument changes.
 */
export const useRelay: ExtMessaging.RelayFx = (req, onMessage) => {
	const relayRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		relayRef.current = relay(req, onMessage);
		return relayRef.current;
	}, [req, onMessage]);

	return () => relayRef.current?.();
};
