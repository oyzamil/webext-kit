import { nanoid } from "nanoid";

import { type ExtMessaging } from "./types";
import { isSameOrigin } from "./utils";

/**
 * Raw relay abstracting window.postMessage
 *
 * Listens on `messagePort` (a `Window` by default) for a request
 * matching `req`, forwards it to `onMessage` (typically a send to
 * the background), and posts the result back tagged `relayed: true`
 * so the original sender's listener can pick it up. Returns an
 * unsubscribe function.
 */
export const relay: ExtMessaging.RelayFx = (
	req,
	onMessage,
	messagePort = globalThis.window,
) => {
	const relayHandler = async (evt: Event) => {
		const event = evt as MessageEvent<ExtMessaging.RelayMessage>;

		if (isSameOrigin(event, req) && !event.data.relayed) {
			const relayPayload = {
				name: req.name,
				relayId: req.relayId,
				body: event.data.body,
			};

			const backgroundResponse = await onMessage?.(relayPayload);
			const targetOrigin = req.targetOrigin || "/";

			messagePort.postMessage(
				{
					name: req.name,
					relayId: req.relayId,
					instanceId: event.data.instanceId,
					body: backgroundResponse,
					relayed: true,
				},
				{
					targetOrigin,
				},
			);
		}
	};

	messagePort.addEventListener("message", relayHandler);
	return () => messagePort.removeEventListener("message", relayHandler);
};

/**
 * Sends a request through a `window.postMessage` relay (set up on
 * the other end via {@link relay}) and resolves with the relayed
 * response. Rejects if no response arrives within 30s.
 */
export const sendViaRelay: ExtMessaging.SendFx = (
	req,
	messagePort = globalThis.window,
) =>
	new Promise((resolve, reject) => {
		const instanceId = nanoid();
		const targetOrigin = req.targetOrigin || "/";

		const handler = (evt: Event) => {
			const event = evt as MessageEvent<ExtMessaging.RelayMessage>;

			if (
				isSameOrigin(event, req) &&
				event.data.relayed &&
				event.data.instanceId === instanceId
			) {
				messagePort.removeEventListener("message", handler);
				resolve(event.data.body);
			}
		};

		messagePort.addEventListener("message", handler);

		messagePort.postMessage(
			{
				name: req.name,
				body: req.body,
				relayId: req.relayId,
				instanceId,
				targetOrigin,
			},
			{
				targetOrigin,
			},
		);

		// Add timeout for relay
		setTimeout(() => {
			messagePort.removeEventListener("message", handler);
			reject(new Error(`Relay timeout for message: ${req.name}`));
		}, 30000);
	});
