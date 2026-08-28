export interface MessagesMetadata {}
export interface PortsMetadata {}

export type MessageName = [keyof MessagesMetadata] extends [never]
	? string
	: keyof MessagesMetadata;
export type PortName = [keyof PortsMetadata] extends [never]
	? string
	: keyof PortsMetadata;

export type InternalSignal = "__EXT_MESSAGING_PING__";

export namespace ExtMessaging {
	export type Request<TName = any, TBody = any> = {
		name: TName;
		extensionId?: string;
		port?: chrome.runtime.Port;
		sender?: chrome.runtime.MessageSender;
		body?: TBody;
		tabId?: number;
		relayId?: string;
		targetOrigin?: string;
	};

	export type RelayMessage<TName = any, TBody = any> = Request<TName, TBody> & {
		instanceId: string;
		relayed: boolean;
	};

	export type InternalRequest = {
		__EXT_MESSAGING_SIGNAL__: InternalSignal;
	};

	export type Response<TBody = any> = {
		send: (body: TBody) => void;
	};

	export type InternalHandler = (request: InternalRequest) => void;

	export type Handler<
		RequestName = string,
		RequestBody = any,
		ResponseBody = any,
	> = (
		request: Request<RequestName, RequestBody>,
		response: Response<ResponseBody>,
	) => void | Promise<void> | boolean;

	export type PortHandler<RequestBody = any, ResponseBody = any> = Handler<
		PortName,
		RequestBody,
		ResponseBody
	>;

	export type MessageHandler<RequestBody = any, ResponseBody = any> = Handler<
		MessageName,
		RequestBody,
		ResponseBody
	>;

	export interface SendFx<TName = string> {
		<RequestBody = any, ResponseBody = any>(
			request: Request<TName, RequestBody>,
			messagePort?:
				| Pick<
						MessagePort,
						"addEventListener" | "removeEventListener" | "postMessage"
				  >
				| Window,
		): Promise<ResponseBody>;
	}

	export interface RelayFx {
		<RelayName = any, RequestBody = any, ResponseBody = any>(
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
		): () => void;
	}

	export interface MessageRelayFx {
		<RequestBody = any>(request: Request<MessageName, RequestBody>): () => void;
	}

	export interface PortHook {
		<TRequestBody = Record<string, any>, TResponseBody = any>(
			name: PortName,
		): {
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
}

export type OriginContext =
	| "background"
	| "extension-page"
	| "sandbox-page"
	| "content-script"
	| "window";

/**
 * Compatibility alias for ExtMessaging
 */
// export namespace ExtMessaging {
// 	export import Request = ExtMessaging.Request;
// 	export import RelayMessage = ExtMessaging.RelayMessage;
// 	export import InternalRequest = ExtMessaging.InternalRequest;
// 	export import Response = ExtMessaging.Response;
// 	export import InternalHandler = ExtMessaging.InternalHandler;
// 	export import Handler = ExtMessaging.Handler;
// 	export import PortHandler = ExtMessaging.PortHandler;
// 	export import MessageHandler = ExtMessaging.MessageHandler;
// 	export import SendFx = ExtMessaging.SendFx;
// 	export import RelayFx = ExtMessaging.RelayFx;
// 	export import MessageRelayFx = ExtMessaging.MessageRelayFx;
// 	export import PortHook = ExtMessaging.PortHook;
// }
