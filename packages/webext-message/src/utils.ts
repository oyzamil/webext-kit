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
 * Resolves currently active tab in current window.
 *
 * Queries extension tabs API for single active tab in focused window.
 * Returns undefined if no active tab found (e.g., no windows open,
 * user permission not granted). Throws if tabs API unavailable.
 *
 * Useful for sending messages from background/popup to active content script
 * without requiring caller to specify tabId.
 *
 * @returns Promise resolving to active tab object, or undefined if none
 * @throws Error if extension tabs API is not available (background context only)
 *
 * @example
 * ```typescript
 * // From popup/background: send message to active content script
 * const tab = await getActiveTab();
 * if (tab?.id) {
 *   await sendToContentScript({
 *     tabId: tab.id,
 *     name: 'analyze',
 *     body: { url: tab.url }
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Check if specific tab is active
 * const activeTab = await getActiveTab();
 * if (activeTab?.id === targetTabId) {
 *   console.log('Target tab is currently active');
 * }
 * ```
 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
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
): req is ExtMessaging.Request => {
	// "/" is the postMessage shorthand for "same origin as this document",
	// not a literal value `event.origin` will ever equal — normalize it.
	const targetOrigin =
		!req.targetOrigin || req.targetOrigin === "/"
			? window.location.origin
			: req.targetOrigin;

	return (
		!req.__internal &&
		event.source === globalThis.window &&
		// Real `MessageEvent`s always carry `origin`; only synthetic test
		// doubles omit it, so this only ever tightens production behavior.
		(targetOrigin === "*" ||
			event.origin === undefined ||
			event.origin === targetOrigin) &&
		event.data.name === req.name &&
		(req.relayId === undefined || event.data.relayId === req.relayId)
	);
};

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
