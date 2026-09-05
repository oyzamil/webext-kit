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
				requestId: event.data.requestId,
				body: event.data.body,
			};
			const targetOrigin = req.targetOrigin || "/";

			try {
				const backgroundResponse = await onMessage?.(relayPayload);
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
			} catch (error) {
				// Post the failure back instead of leaving the sender
				// hanging until its own timeout fires.
				messagePort.postMessage(
					{
						name: req.name,
						relayId: req.relayId,
						instanceId: event.data.instanceId,
						error: error instanceof Error ? error.message : String(error),
						relayed: true,
					},
					{
						targetOrigin,
					},
				);
			}
		}
	};

	messagePort.addEventListener("message", relayHandler);
	return () => messagePort.removeEventListener("message", relayHandler);
};

/**
 * Sends a request through a `window.postMessage` relay (set up on
 * the other end via {@link relay}) and resolves with the relayed
 * response. Rejects if the relay handler threw (`event.data.error`),
 * or if no response arrives within `req.timeoutMs` (default 30s —
 * kept finite so a dead relay on the other end can't hang the
 * caller forever).
 */
export const sendViaRelay: ExtMessaging.SendFx = (
	req,
	messagePort = globalThis.window,
) =>
	new Promise((resolve, reject) => {
		const instanceId = nanoid();
		const requestId = req.requestId || nanoid(8);
		const targetOrigin = req.targetOrigin || "/";
		const timeoutMs = req.timeoutMs ?? 30_000;

		const cleanup = () => {
			messagePort.removeEventListener("message", handler);
			clearTimeout(timer);
		};

		const handler = (evt: Event) => {
			const event = evt as MessageEvent<ExtMessaging.RelayMessage>;

			if (
				isSameOrigin(event, req) &&
				event.data.relayed &&
				event.data.instanceId === instanceId
			) {
				cleanup();
				if (event.data.error) {
					reject(new Error(`Relay error: ${event.data.error}`));
				} else {
					resolve(event.data.body);
				}
			}
		};

		messagePort.addEventListener("message", handler);

		messagePort.postMessage(
			{
				name: req.name,
				body: req.body,
				relayId: req.relayId,
				requestId,
				instanceId,
				targetOrigin,
			},
			{
				targetOrigin,
			},
		);

		const timer = setTimeout(() => {
			cleanup();
			reject(new Error(`Relay timeout for message: ${req.name}`));
		}, timeoutMs);
	});
