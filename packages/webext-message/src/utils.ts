import { type ExtMessaging } from "./types";

/**
 * `globalThis`, typed with the optional `browser`/`chrome` extension
 * APIs this module looks for.
 */
type ExtensionGlobals = typeof globalThis & {
	browser?: {
		runtime: typeof chrome.runtime;
		tabs: typeof chrome.tabs;
	};
	chrome?: typeof chrome;
};

const extGlobal = globalThis as ExtensionGlobals;

/**
 * Returns the extension runtime API, preferring the standard
 * `browser` namespace (Firefox/polyfilled) and falling back to
 * `chrome`.
 *
 * @throws if neither `browser.runtime` nor `chrome.runtime` is available
 */
export const getExtRuntime = () => {
	const extRuntime = extGlobal.browser?.runtime ?? extGlobal.chrome?.runtime;

	if (!extRuntime) {
		throw new Error("Extension runtime is not available");
	}
	return extRuntime;
};

/**
 * Returns the extension tabs API, preferring `browser.tabs` and
 * falling back to `chrome.tabs`.
 *
 * @throws if neither `browser.tabs` nor `chrome.tabs` is available
 */
export const getExtTabs = () => {
	const extTabs = extGlobal.browser?.tabs ?? extGlobal.chrome?.tabs;

	if (!extTabs) {
		throw new Error("Extension tabs API is not available");
	}
	return extTabs;
};

/**
 * Resolves the currently active tab in the current window, if any.
 */
export const getActiveTab = async () => {
	const tabs = getExtTabs();
	const [tab] = await tabs.query({
		active: true,
		currentWindow: true,
	});
	return tab as chrome.tabs.Tab | undefined;
};

/**
 * Type guard used by the relay functions: checks that a
 * `postMessage` event actually corresponds to `req` — same window,
 * matching message name, not flagged internal, and (if `req.relayId`
 * is set) matching relay id.
 */
export const isSameOrigin = (
	event: MessageEvent,
	req: any,
): req is ExtMessaging.Request =>
	!req.__internal &&
	event.source === globalThis.window &&
	event.data.name === req.name &&
	(req.relayId === undefined || event.data.relayId === req.relayId);

/**
 * Best-effort detection of which extension context the current code
 * is running in, based on which globals are available. Returns
 * `undefined` if it can't be determined.
 */
export const getRuntimeContext = (): string | undefined => {
	// Detect context by checking available APIs
	if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.runtime) {
		if (globalThis.chrome.tabs) {
			return "background";
		}
		if (globalThis.chrome.scripting) {
			return "background";
		}
	}

	if (typeof window !== "undefined") {
		if (window === window.parent) {
			return "content-script";
		}
		return "window";
	}

	return undefined;
};
