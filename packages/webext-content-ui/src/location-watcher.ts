/**
 * SPA navigation watcher — fires when `location.href` changes without a full page load
 * (pushState/replaceState-driven routing, e.g. AliExpress's order page). Equivalent in
 * spirit to WXT's `wxt:locationchange`, but standalone (no WXT context dependency) so it
 * works in any of this package's three injection modes.
 *
 * Prefers the Navigation API when available (Chrome/Edge); falls back to polling.
 * Multiple subscribers share ONE underlying watcher (single interval/listener), started
 * lazily on first subscribe and torn down when the last unsubscribes.
 */

/** Payload delivered to onLocationChange listeners on each SPA navigation. */
export interface LocationChangeDetail {
	/** The new `location.href` after navigation. */
	url: string;
	/** The `location.href` before navigation. */
	oldUrl: string;
}

/** Listener signature for onLocationChange. */
export type LocationChangeListener = (detail: LocationChangeDetail) => void;

const listeners = new Set<LocationChangeListener>();
let currentUrl: string | null = null;
let stopWatcher: (() => void) | null = null;

/**
 * Broadcast a location change to every current subscriber.
 * @param url - New URL
 * @param oldUrl - Previous URL
 */
function notify(url: string, oldUrl: string): void {
	for (const listener of listeners) listener({ url, oldUrl });
}

/** Compare `location.href` against the last known URL and notify listeners if it changed. */
function checkForChange(): void {
	const url = location.href;
	if (url === currentUrl) return;
	const oldUrl = currentUrl!;
	currentUrl = url;
	notify(url, oldUrl);
}

/**
 * Start the single shared watcher (Navigation API, falling back to polling).
 * @returns Cleanup function that stops watching
 */
function startWatcher(): () => void {
	currentUrl = location.href;

	const nav = (globalThis as { navigation?: EventTarget }).navigation;
	if (nav && typeof nav.addEventListener === "function") {
		// Defer: the "navigate" event fires before location.href updates in some cases.
		const handler = () => queueMicrotask(checkForChange);
		nav.addEventListener("navigate", handler);
		return () => nav.removeEventListener("navigate", handler);
	}

	const interval = setInterval(checkForChange, 1000);
	return () => clearInterval(interval);
}

/**
 * Subscribe to SPA location changes. Returns an unsubscribe function.
 * @param listener - Called with `{ url, oldUrl }` whenever `location.href` changes.
 */
export function onLocationChange(listener: LocationChangeListener): () => void {
	listeners.add(listener);
	if (!stopWatcher) stopWatcher = startWatcher();
	return () => {
		listeners.delete(listener);
		if (listeners.size === 0 && stopWatcher) {
			stopWatcher();
			stopWatcher = null;
			currentUrl = null;
		}
	};
}
