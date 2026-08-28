import { useEffect, useRef, useState } from "react";

import { type MessageName, type ExtMessaging } from "./types";
import { listen as messageListen } from "./message";
import { listen as portListen } from "./port";
import { relay } from "./relay";

/**
 * Used in any extension context to listen and send messages to background.
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

export const usePort: ExtMessaging.PortHook = (name) => {
	const portRef = useRef<chrome.runtime.Port | undefined>(undefined);
	const reconnectRef = useRef(0);
	const [data, setData] = useState();

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
 */
export function useMessageRelay<RequestBody = any>(
	req: ExtMessaging.Request<MessageName, RequestBody>,
) {
	useEffect(() => {
		// Import here to avoid circular dependency
		const relayMessageFn = require("./index")
			.relayMessage as ExtMessaging.MessageRelayFx;
		relayMessageFn(req);
	}, [req.name, req.relayId]);
}

export const useRelay: ExtMessaging.RelayFx = (req, onMessage) => {
	const relayRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		relayRef.current = relay(req, onMessage);
		return relayRef.current;
	}, [req, onMessage]);

	return () => relayRef.current?.();
};
