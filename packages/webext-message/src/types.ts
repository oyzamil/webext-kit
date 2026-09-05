/**
 * Augment this via module augmentation in a consumer app to get
 * autocomplete/type-checking on `chrome.runtime.sendMessage` names.
 * Left empty (`{}`) by default, which makes `MessageName` fall back
 * to `string`.
 */
export type MessagesMetadata = {};

/**
 * Augment this via module augmentation in a consumer app to get
 * autocomplete/type-checking on `chrome.runtime.connect` port names.
 * Left empty (`{}`) by default, which makes `PortName` fall back to
 * `string`.
 */
export type PortsMetadata = {};

/**
 * Union of message names declared on {@link MessagesMetadata}, or
 * `string` if the consumer hasn't augmented it.
 */
export type MessageName = [keyof MessagesMetadata] extends [never]
	? string
	: keyof MessagesMetadata;

/**
 * Union of port names declared on {@link PortsMetadata}, or `string`
 * if the consumer hasn't augmented it.
 */
export type PortName = [keyof PortsMetadata] extends [never]
	? string
	: keyof PortsMetadata;

/**
 * Signal value used for the internal background-alive ping/pong
 * handshake. Not part of the public messaging API.
 */
export type InternalSignal = "__EXT_MESSAGING_PING__";

export namespace ExtMessaging {
	/**
	 * Shape of a message sent through any of the library's send
	 * functions (`sendToBackground`, `sendToContentScript`, relays,
	 * etc). Most fields are optional because different send paths
	 * only need a subset of them.
	 */
	export type Request<TName = any, TBody = any> = {
		/** Name of the message/channel, matched by listeners. */
		name: TName;
		/** Target extension id, for cross-extension messaging. */
		extensionId?: string;
		/** Port this request travelled over, when using ports. */
		port?: chrome.runtime.Port;
		/** Sender info attached by the runtime on receipt. */
		sender?: chrome.runtime.MessageSender;
		/** Message payload. */
		body?: TBody;
		/** Target tab id, for `sendToContentScript`. */
		tabId?: number;
		/** Correlates a relayed request with its response. */
		relayId?: string;
		/** `postMessage` target origin, for window relays. */
		targetOrigin?: string;
		/** Unique id for this request, auto-generated if omitted. Useful for tracing. */
		requestId?: string;
		/** Per-request override for how long to wait before timing out, in ms. */
		timeoutMs?: number;
	};

	/**
	 * A {@link Request} as it travels over a `window.postMessage`
	 * relay, tagged with an instance id (to match request/response)
	 * and whether it has already been relayed once.
	 */
	export type RelayMessage<TName = any, TBody = any> = Request<TName, TBody> & {
		instanceId: string;
		relayed: boolean;
		/** Set instead of `body` when the relayed `onMessage` handler threw. */
		error?: string;
	};

	/**
	 * Internal-only request shape used for the background-alive
	 * ping. Not part of the public messaging API.
	 */
	export type InternalRequest = {
		__EXT_MESSAGING_SIGNAL__: InternalSignal;
	};

	/**
	 * Response handle passed to a {@link Handler}, used to send a
	 * reply back to the sender.
	 */
	export type Response<TBody = any> = {
		send: (body: TBody) => void;
	};

	/** Handler signature for the internal background-alive ping. */
	export type InternalHandler = (request: InternalRequest) => void;

	/**
	 * Generic handler signature shared by message and port listeners.
	 * May return a boolean (to match the raw `chrome.runtime`
	 * listener contract) or a `Promise`/`void`.
	 */
	export type Handler<
		RequestName = string,
		RequestBody = any,
		ResponseBody = any,
	> = (
		request: Request<RequestName, RequestBody>,
		response: Response<ResponseBody>,
	) => void | Promise<void> | boolean;

	/** {@link Handler} specialized for port messages. */
	export type PortHandler<RequestBody = any, ResponseBody = any> = Handler<
		PortName,
		RequestBody,
		ResponseBody
	>;

	/** {@link Handler} specialized for one-off runtime messages. */
	export type MessageHandler<RequestBody = any, ResponseBody = any> = Handler<
		MessageName,
		RequestBody,
		ResponseBody
	>;

	/**
	 * Signature of a "send" function: takes a request (and, for
	 * window-based sends, the `MessagePort`/`Window` to send it
	 * through) and resolves with the response body.
	 */
	export type SendFx<TName = string> = <RequestBody = any, ResponseBody = any>(
		request: Request<TName, RequestBody>,
		messagePort?:
			| Pick<
					MessagePort,
					"addEventListener" | "removeEventListener" | "postMessage"
			  >
			| Window,
	) => Promise<ResponseBody>;

	/**
	 * Signature of a "relay" function: wires up a `postMessage`
	 * listener that forwards matching requests to `onMessage` and
	 * relays the result back. Returns an unsubscribe function.
	 */
	export type RelayFx = <
		RelayName = any,
		RequestBody = any,
		ResponseBody = any,
	>(
		request: Request<RelayName, RequestBody>,
		onMessage?: (
			request: Request<RelayName, RequestBody>,
		) => Promise<ResponseBody>,
		messagePort?:
			| Pick<
					MessagePort,
					"addEventListener" | "removeEventListener" | "postMessage"
			  >
			| Window,
	) => () => void;

	/**
	 * Signature of a message-specific relay function, fixed to
	 * {@link MessageName} and forwarding to the background.
	 */
	export type MessageRelayFx = <RequestBody = any>(
		request: Request<MessageName, RequestBody>,
	) => () => void;

	/**
	 * Signature of the `usePort` React hook: given a port name,
	 * returns the latest received payload plus `send`/`listen`
	 * helpers for that port.
	 */
	export type PortHook = <
		TRequestBody = Record<string, any>,
		TResponseBody = any,
	>(
		name: PortName,
	) => {
		data?: TResponseBody;
		send: (payload: TRequestBody) => void;
		listen: <T = TResponseBody>(
			handler: (msg: T) => void,
		) => {
			port: chrome.runtime.Port;
			disconnect: () => void;
		};
	};
}

/**
 * Extension context a piece of code is currently running in.
 */
export type OriginContext =
	| "background"
	| "extension-page"
	| "sandbox-page"
	| "content-script"
	| "window";
