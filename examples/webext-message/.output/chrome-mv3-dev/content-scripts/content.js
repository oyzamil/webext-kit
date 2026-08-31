(function() {
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region ../../packages/webext-message/dist/utils-1LCW6BMx.js
	var e = Object.defineProperty;
	var i$5 = (e, t, n) => () => {
		if (n) throw n[0];
		try {
			return e && (t = e(e = 0)), t;
		} catch (e) {
			throw n = [e], e;
		}
	};
	var a$3 = (t, n) => {
		let r = {};
		for (var i in t) e(r, i, {
			get: t[i],
			enumerable: !0
		});
		return n || e(r, Symbol.toStringTag, { value: `Module` }), r;
	};
	var c$2;
	var l;
	var u;
	var d;
	var f;
	var p = i$5((() => {
		c$2 = globalThis, l = () => {
			let e = c$2.browser?.runtime ?? c$2.chrome?.runtime;
			if (!e) throw Error(`Extension runtime is not available`);
			return e;
		}, u = () => {
			let e = c$2.browser?.tabs ?? c$2.chrome?.tabs;
			if (!e) throw Error(`Extension tabs API is not available`);
			return e;
		}, d = async () => {
			let [e] = await u().query({
				active: !0,
				currentWindow: !0
			});
			return e;
		}, f = (e, t) => !t.__internal && e.source === globalThis.window && e.data.name === t.name && (t.relayId === void 0 || e.data.relayId === t.relayId);
	}));
	//#endregion
	//#region ../../node_modules/.bun/nanoid@6.0.1/node_modules/nanoid/url-alphabet/index.js
	var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
	//#endregion
	//#region ../../node_modules/.bun/nanoid@6.0.1/node_modules/nanoid/index.browser.js
	var nanoid = (size = 21) => {
		let id = "";
		let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
		while (size--) id += urlAlphabet[bytes[size] & 63];
		return id;
	};
	//#endregion
	//#region ../../packages/webext-message/dist/relay.js
	var i$4;
	var a$2;
	var o$2 = i$5((() => {
		p(), i$4 = (t, n, r = globalThis.window) => {
			let i = async (i) => {
				let a = i;
				if (f(a, t) && !a.data.relayed) {
					let e = {
						name: t.name,
						relayId: t.relayId,
						body: a.data.body
					}, i = await n?.(e), o = t.targetOrigin || `/`;
					r.postMessage({
						name: t.name,
						relayId: t.relayId,
						instanceId: a.data.instanceId,
						body: i,
						relayed: !0
					}, { targetOrigin: o });
				}
			};
			return r.addEventListener(`message`, i), () => r.removeEventListener(`message`, i);
		}, a$2 = (t, n = globalThis.window) => new Promise((i, a) => {
			let o = nanoid(), s = t.targetOrigin || `/`, c = (r) => {
				let a = r;
				f(a, t) && a.data.relayed && a.data.instanceId === o && (n.removeEventListener(`message`, c), i(a.data.body));
			};
			n.addEventListener(`message`, c), n.postMessage({
				name: t.name,
				body: t.body,
				relayId: t.relayId,
				instanceId: o,
				targetOrigin: s
			}, { targetOrigin: s }), setTimeout(() => {
				n.removeEventListener(`message`, c), a(Error(`Relay timeout for message: ${t.name}`));
			}, 3e4);
		});
	}));
	o$2();
	//#endregion
	//#region ../../packages/webext-message/dist/background.js
	var r$3;
	var i$3 = i$5((() => {
		p(), r$3 = () => {
			l().onMessage.addListener((e, t, n) => e.__EXT_MESSAGING_SIGNAL__ === `__EXT_MESSAGING_PING__` && (n(!0), !0));
		}, typeof globalThis < `u` && globalThis.chrome?.runtime && r$3();
	}));
	i$3();
	//#endregion
	//#region ../../packages/webext-message/dist/message.js
	var r$2;
	var i$2 = i$5((() => {
		p(), r$2 = (e) => {
			let n = async (t, n, r) => {
				try {
					await e?.({
						...t,
						sender: n
					}, { send: (e) => r(e) });
				} catch (e) {
					console.error(`Message handler error:`, e), r(void 0);
				}
			}, r = (e, t, r) => (n(e, t, r), !0), i = l();
			return i.onMessage.addListener(r), () => {
				i.onMessage.removeListener(r);
			};
		};
	}));
	i$2();
	//#endregion
	//#region ../../packages/webext-message/dist/port.js
	var r$1;
	var i$1;
	var a$1;
	var o$1;
	var s$1;
	var c$1 = i$5((() => {
		p(), r$1 = /* @__PURE__ */ new Map(), i$1 = (e) => {
			let n = r$1.get(e);
			if (n) return n;
			let i = l().connect({ name: e });
			return r$1.set(e, i), i;
		}, a$1 = (e) => {
			r$1.delete(e);
		}, o$1 = (e, t, n) => {
			let r = i$1(e);
			function o() {
				a$1(e), n?.();
			}
			let s = async (e) => {
				try {
					await t(e);
				} catch (e) {
					console.error(`Port handler error:`, e);
				}
			};
			return r.onMessage.addListener(s), r.onDisconnect.addListener(o), {
				port: r,
				disconnect: () => {
					r.onMessage.removeListener(s), r.onDisconnect.removeListener(o);
				}
			};
		}, s$1 = (e, n) => {
			let r = l(), i = async (t) => {
				if (t.name !== e) return;
				let r = await n(t);
				r?.onMessage && t.onMessage.addListener(r.onMessage), t.onDisconnect.addListener(() => {
					r?.onDisconnect?.();
				});
			};
			return r.onConnect.addListener(i), () => {
				r.onConnect.removeListener(i);
			};
		};
	}));
	c$1();
	//#endregion
	//#region ../../packages/webext-message/dist/pub-sub.js
	var r;
	var i;
	var a;
	var o;
	var s;
	var c = i$5((() => {
		p(), i = () => (r ||= /* @__PURE__ */ new Map(), r), a = () => {
			let e = l();
			if (!e.onConnectExternal) throw Error(`onConnectExternal not available. Need externally_connectable in manifest`);
			r = /* @__PURE__ */ new Map();
			let n = i();
			e.onConnectExternal.addListener((e) => {
				let t = e.sender?.tab?.id;
				t && !n.has(t) && (n.set(t, e), e.onMessage.addListener((e) => {
					o({
						from: t,
						payload: e
					});
				}), e.onDisconnect.addListener(() => {
					n.delete(t);
				}));
			});
		}, o = (e) => {
			i().forEach((t, n) => {
				n !== e.from && t.postMessage({
					...e,
					to: n
				});
			});
		}, s = (e) => {
			let n = (t) => {
				e(t);
			}, r = l();
			return r.onMessage.addListener(n), () => {
				r.onMessage.removeListener(n);
			};
		};
	}));
	c();
	a$3({
		broadcast: () => o,
		getPort: () => i$1,
		initializeBackgroundMessaging: () => r$3,
		onMessage: () => r$2,
		onPort: () => o$1,
		onPortConnect: () => s$1,
		relay: () => E,
		relayMessage: () => T,
		sendToActiveContentScript: () => w,
		sendToBackground: () => S,
		sendToBackgroundViaRelay: () => D,
		sendToContentScript: () => C,
		sendViaRelay: () => O,
		startHub: () => a,
		subscribe: () => s
	});
	var S;
	var C;
	var w;
	var T;
	var E;
	var D;
	var O;
	var k = i$5((() => {
		o$2(), p(), i$3(), i$2(), c$1(), c(), S = async (e) => l().sendMessage(e.extensionId ?? null, e), C = async (e) => {
			let t = typeof e.tabId == `number` ? e.tabId : (await d())?.id;
			if (!t) throw Error(`No active tab found to send message to.`);
			return u().sendMessage(t, e);
		}, w = C, T = (e) => i$4(e, S), E = T, D = a$2, O = D;
	}));
	i$3(), i$2(), c$1(), c(), k();
	//#endregion
	//#region src/entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["*://*.example.com/*"],
		main() {
			console.log("[Content Script] Initialized");
			r$2(async (request, response) => {
				console.log("[Content Script] Received from background:", request);
				if (request.name === "content-notify") response.send({ acknowledged: true });
			});
			async function sendEchoMessage(text) {
				try {
					const response = await S({
						name: "echo-message",
						body: { echo: text }
					});
					console.log("[Content Script] Response:", response);
				} catch (error) {
					console.error("[Content Script] Error:", error);
				}
			}
			async function processData(data) {
				try {
					const response = await S({
						name: "process-data",
						body: {
							type: "process",
							payload: data
						}
					});
					console.log("[Content Script] Process result:", response);
				} catch (error) {
					console.error("[Content Script] Process error:", error);
				}
			}
			async function getTabInfo() {
				try {
					const response = await S({ name: "get-tab-info" });
					console.log("[Content Script] Tab info:", response);
				} catch (error) {
					console.error("[Content Script] Tab info error:", error);
				}
			}
			async function relayMessage(text) {
				try {
					const response = await D({
						name: "broadcast-message",
						body: { message: text }
					});
					console.log("[Content Script] Relay response:", response);
				} catch (error) {
					console.error("[Content Script] Relay error:", error);
				}
			}
			if (typeof window !== "undefined") window.__extMessagingDemo = {
				sendEchoMessage,
				processData,
				getTabInfo,
				relayMessage
			};
			setTimeout(() => {
				getTabInfo();
				sendEchoMessage("Hello from content script");
				processData([
					"a",
					"b",
					"c"
				]);
			}, 1e3);
		}
	});
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?D:/Projects/webext-kit/examples/webext-message/src/entrypoints/content.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	//#endregion
	return (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImkiLCJhIiwiYyIsImkiLCJhIiwibyIsIm4iLCJlIiwiciIsInIiLCJpIiwibiIsInIiLCJpIiwibiIsInQiLCJyIiwiaSIsImEiLCJvIiwicyIsImMiLCJuIiwidCIsIm4iLCJ0IiwiaSIsIl8iLCJwIiwibCIsImQiLCJtIiwiaCIsInYiLCJ5IiwibiIsImUiLCJ1IiwiZiIsImciLCJiIiwidCIsImEiLCJyIiwibyIsInMiLCJwcmludCIsImxvZ2dlciIsImJyb3dzZXIiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3V0aWxzLTFMQ1c2Qk14LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcmVsYXkuanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2JhY2tncm91bmQuanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L21lc3NhZ2UuanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3BvcnQuanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3B1Yi1zdWIuanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2NvbnRlbnQudHMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad3h0LWRlditicm93c2VyQDAuMi43L25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCthYTZhOWE0NWEzNzdmYzExL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vI3JlZ2lvbiBzcmMvdXRpbHMvZGVmaW5lLWNvbnRlbnQtc2NyaXB0LnRzXG5mdW5jdGlvbiBkZWZpbmVDb250ZW50U2NyaXB0KGRlZmluaXRpb24pIHtcblx0cmV0dXJuIGRlZmluaXRpb247XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGRlZmluZUNvbnRlbnRTY3JpcHQgfTtcbiIsInZhciBlPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSx0PU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Isbj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksaT0oZSx0LG4pPT4oKT0+e2lmKG4pdGhyb3cgblswXTt0cnl7cmV0dXJuIGUmJih0PWUoZT0wKSksdH1jYXRjaChlKXt0aHJvdyBuPVtlXSxlfX0sYT0odCxuKT0+e2xldCByPXt9O2Zvcih2YXIgaSBpbiB0KWUocixpLHtnZXQ6dFtpXSxlbnVtZXJhYmxlOiEwfSk7cmV0dXJuIG58fGUocixTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOmBNb2R1bGVgfSkscn0sbz0oaSxhLG8scyk9PntpZihhJiZ0eXBlb2YgYT09YG9iamVjdGB8fHR5cGVvZiBhPT1gZnVuY3Rpb25gKWZvcih2YXIgYz1uKGEpLGw9MCx1PWMubGVuZ3RoLGQ7bDx1O2wrKylkPWNbbF0sIXIuY2FsbChpLGQpJiZkIT09byYmZShpLGQse2dldDooZT0+YVtlXSkuYmluZChudWxsLGQpLGVudW1lcmFibGU6IShzPXQoYSxkKSl8fHMuZW51bWVyYWJsZX0pO3JldHVybiBpfSxzPXQ9PnIuY2FsbCh0LGBtb2R1bGUuZXhwb3J0c2ApP3RbYG1vZHVsZS5leHBvcnRzYF06byhlKHt9LGBfX2VzTW9kdWxlYCx7dmFsdWU6ITB9KSx0KSxjLGwsdSxkLGYscD1pKCgoKT0+e2M9Z2xvYmFsVGhpcyxsPSgpPT57bGV0IGU9Yy5icm93c2VyPy5ydW50aW1lPz9jLmNocm9tZT8ucnVudGltZTtpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHJ1bnRpbWUgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSx1PSgpPT57bGV0IGU9Yy5icm93c2VyPy50YWJzPz9jLmNocm9tZT8udGFicztpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHRhYnMgQVBJIGlzIG5vdCBhdmFpbGFibGVgKTtyZXR1cm4gZX0sZD1hc3luYygpPT57bGV0W2VdPWF3YWl0IHUoKS5xdWVyeSh7YWN0aXZlOiEwLGN1cnJlbnRXaW5kb3c6ITB9KTtyZXR1cm4gZX0sZj0oZSx0KT0+IXQuX19pbnRlcm5hbCYmZS5zb3VyY2U9PT1nbG9iYWxUaGlzLndpbmRvdyYmZS5kYXRhLm5hbWU9PT10Lm5hbWUmJih0LnJlbGF5SWQ9PT12b2lkIDB8fGUuZGF0YS5yZWxheUlkPT09dC5yZWxheUlkKX0pKTtleHBvcnR7ZiBhcyBhLHMgYXMgYyxwIGFzIGksbCBhcyBuLGkgYXMgbyx1IGFzIHIsYSBhcyBzLGQgYXMgdH07IiwiZXhwb3J0IGxldCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIiwiXG5cbmltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5cbmV4cG9ydCB7IHVybEFscGhhYmV0IH1cblxuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxuZXhwb3J0IGxldCBjdXN0b21SYW5kb20gPSAoYWxwaGFiZXQsIGRlZmF1bHRTaXplLCBnZXRSYW5kb20pID0+IHtcbiAgbGV0IHNhZmVCeXRlQ3V0b2ZmID0gMjU2IC0gKDI1NiAlIGFscGhhYmV0Lmxlbmd0aClcblxuICBpZiAoc2FmZUJ5dGVDdXRvZmYgPT09IDI1Nikge1xuICAgIGxldCBtYXNrID0gYWxwaGFiZXQubGVuZ3RoIC0gMVxuXG4gICAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgICBsZXQgaWQgPSAnJ1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHNpemUpXG4gICAgICAgIGxldCBqID0gc2l6ZVxuICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJiBtYXNrXVxuICAgICAgICAgIGlmIChpZC5sZW5ndGggPj0gc2l6ZSkgcmV0dXJuIGlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgc3RlcCA9IE1hdGguY2VpbCgoMS42ICogMjU2ICogZGVmYXVsdFNpemUpIC8gc2FmZUJ5dGVDdXRvZmYpXG5cbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBpZiAoIXNpemUpIHJldHVybiAnJ1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgbGV0IGogPSBzdGVwXG4gICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgIGlmIChieXRlc1tqXSA8IHNhZmVCeXRlQ3V0b2ZmKSB7XG4gICAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJSBhbHBoYWJldC5sZW5ndGhdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplID0gMjEpID0+XG4gIGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSB8IDAsIHJhbmRvbSlcblxuZXhwb3J0IGxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBieXRlcyA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoKHNpemUgfD0gMCkpKVxuICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgaWQgKz0gdXJsQWxwaGFiZXRbYnl0ZXNbc2l6ZV0gJiA2M11cbiAgfVxuICByZXR1cm4gaWRcbn1cbiIsImltcG9ydHthIGFzIGUsaSBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7aW1wb3J0e25hbm9pZCBhcyByfWZyb21cIm5hbm9pZFwiO3ZhciBpLGEsbz1uKCgoKT0+e3QoKSxpPSh0LG4scj1nbG9iYWxUaGlzLndpbmRvdyk9PntsZXQgaT1hc3luYyBpPT57bGV0IGE9aTtpZihlKGEsdCkmJiFhLmRhdGEucmVsYXllZCl7bGV0IGU9e25hbWU6dC5uYW1lLHJlbGF5SWQ6dC5yZWxheUlkLGJvZHk6YS5kYXRhLmJvZHl9LGk9YXdhaXQgbj8uKGUpLG89dC50YXJnZXRPcmlnaW58fGAvYDtyLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOmEuZGF0YS5pbnN0YW5jZUlkLGJvZHk6aSxyZWxheWVkOiEwfSx7dGFyZ2V0T3JpZ2luOm99KX19O3JldHVybiByLmFkZEV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGkpLCgpPT5yLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGkpfSxhPSh0LG49Z2xvYmFsVGhpcy53aW5kb3cpPT5uZXcgUHJvbWlzZSgoaSxhKT0+e2xldCBvPXIoKSxzPXQudGFyZ2V0T3JpZ2lufHxgL2AsYz1yPT57bGV0IGE9cjtlKGEsdCkmJmEuZGF0YS5yZWxheWVkJiZhLmRhdGEuaW5zdGFuY2VJZD09PW8mJihuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGMpLGkoYS5kYXRhLmJvZHkpKX07bi5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxjKSxuLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxib2R5OnQuYm9keSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOm8sdGFyZ2V0T3JpZ2luOnN9LHt0YXJnZXRPcmlnaW46c30pLHNldFRpbWVvdXQoKCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGMpLGEoRXJyb3IoYFJlbGF5IHRpbWVvdXQgZm9yIG1lc3NhZ2U6ICR7dC5uYW1lfWApKX0sM2U0KX0pfSkpO28oKTtleHBvcnR7aSBhcyByZWxheSxhIGFzIHNlbmRWaWFSZWxheSxvIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaT1uKCgoKT0+e2UoKSxyPSgpPT57dCgpLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigoZSx0LG4pPT5lLl9fRVhUX01FU1NBR0lOR19TSUdOQUxfXz09PWBfX0VYVF9NRVNTQUdJTkdfUElOR19fYCYmKG4oITApLCEwKSl9LHR5cGVvZiBnbG9iYWxUaGlzPGB1YCYmZ2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWUmJnIoKX0pKTtpKCk7ZXhwb3J0e3IgYXMgaW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcsaSBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG59ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO3ZhciByLGk9bigoKCk9PntlKCkscj1lPT57bGV0IG49YXN5bmModCxuLHIpPT57dHJ5e2F3YWl0IGU/Lih7Li4udCxzZW5kZXI6bn0se3NlbmQ6ZT0+cihlKX0pfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoYE1lc3NhZ2UgaGFuZGxlciBlcnJvcjpgLGUpLHIodm9pZCAwKX19LHI9KGUsdCxyKT0+KG4oZSx0LHIpLCEwKSxpPXQoKTtyZXR1cm4gaS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIociksKCk9PntpLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihyKX19fSkpO2koKTtleHBvcnR7ciBhcyBsaXN0ZW4saSBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG59ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO3ZhciByLGksYSxvLHMsYz1uKCgoKT0+e2UoKSxyPW5ldyBNYXAsaT1lPT57bGV0IG49ci5nZXQoZSk7aWYobilyZXR1cm4gbjtsZXQgaT10KCkuY29ubmVjdCh7bmFtZTplfSk7cmV0dXJuIHIuc2V0KGUsaSksaX0sYT1lPT57ci5kZWxldGUoZSl9LG89KGUsdCxuKT0+e2xldCByPWkoZSk7ZnVuY3Rpb24gbygpe2EoZSksbj8uKCl9bGV0IHM9YXN5bmMgZT0+e3RyeXthd2FpdCB0KGUpfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoYFBvcnQgaGFuZGxlciBlcnJvcjpgLGUpfX07cmV0dXJuIHIub25NZXNzYWdlLmFkZExpc3RlbmVyKHMpLHIub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKG8pLHtwb3J0OnIsZGlzY29ubmVjdDooKT0+e3Iub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHMpLHIub25EaXNjb25uZWN0LnJlbW92ZUxpc3RlbmVyKG8pfX19LHM9KGUsbik9PntsZXQgcj10KCksaT1hc3luYyB0PT57aWYodC5uYW1lIT09ZSlyZXR1cm47bGV0IHI9YXdhaXQgbih0KTtyPy5vbk1lc3NhZ2UmJnQub25NZXNzYWdlLmFkZExpc3RlbmVyKHIub25NZXNzYWdlKSx0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKT0+e3I/Lm9uRGlzY29ubmVjdD8uKCl9KX07cmV0dXJuIHIub25Db25uZWN0LmFkZExpc3RlbmVyKGkpLCgpPT57ci5vbkNvbm5lY3QucmVtb3ZlTGlzdGVuZXIoaSl9fX0pKTtjKCk7ZXhwb3J0e2kgYXMgZ2V0UG9ydCxvIGFzIGxpc3RlbixzIGFzIG9uUG9ydENvbm5lY3QsYSBhcyByZW1vdmVQb3J0LGMgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpLGEsbyxzLGM9bigoKCk9PntlKCksaT0oKT0+KHJ8fD1uZXcgTWFwLHIpLGE9KCk9PntsZXQgZT10KCk7aWYoIWUub25Db25uZWN0RXh0ZXJuYWwpdGhyb3cgRXJyb3IoYG9uQ29ubmVjdEV4dGVybmFsIG5vdCBhdmFpbGFibGUuIE5lZWQgZXh0ZXJuYWxseV9jb25uZWN0YWJsZSBpbiBtYW5pZmVzdGApO3I9bmV3IE1hcDtsZXQgbj1pKCk7ZS5vbkNvbm5lY3RFeHRlcm5hbC5hZGRMaXN0ZW5lcihlPT57bGV0IHQ9ZS5zZW5kZXI/LnRhYj8uaWQ7dCYmIW4uaGFzKHQpJiYobi5zZXQodCxlKSxlLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihlPT57byh7ZnJvbTp0LHBheWxvYWQ6ZX0pfSksZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9PntuLmRlbGV0ZSh0KX0pKX0pfSxvPWU9PntpKCkuZm9yRWFjaCgodCxuKT0+e24hPT1lLmZyb20mJnQucG9zdE1lc3NhZ2Uoey4uLmUsdG86bn0pfSl9LHM9ZT0+e2xldCBuPXQ9PntlKHQpfSxyPXQoKTtyZXR1cm4gci5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobiksKCk9PntyLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihuKX19fSkpO2MoKTtleHBvcnR7byBhcyBicm9hZGNhc3QsaSBhcyBnZXRIdWJNYXAsYSBhcyBzdGFydEh1YixzIGFzIHN1YnNjcmliZSxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbixyLHMgYXMgaSx0IGFzIGF9ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO2ltcG9ydHtyZWxheSBhcyBvLHNlbmRWaWFSZWxheSBhcyBzLHQgYXMgY31mcm9tXCIuL3JlbGF5LmpzXCI7aW1wb3J0e2luaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nIGFzIGwsdCBhcyB1fWZyb21cIi4vYmFja2dyb3VuZC5qc1wiO2ltcG9ydHtsaXN0ZW4gYXMgZCx0IGFzIGZ9ZnJvbVwiLi9tZXNzYWdlLmpzXCI7aW1wb3J0e2dldFBvcnQgYXMgcCxsaXN0ZW4gYXMgbSxvblBvcnRDb25uZWN0IGFzIGgsdCBhcyBnfWZyb21cIi4vcG9ydC5qc1wiO2ltcG9ydHticm9hZGNhc3QgYXMgXyxzdGFydEh1YiBhcyB2LHN1YnNjcmliZSBhcyB5LHQgYXMgYn1mcm9tXCIuL3B1Yi1zdWIuanNcIjt2YXIgeD1pKHticm9hZGNhc3Q6KCk9Pl8sZ2V0UG9ydDooKT0+cCxpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZzooKT0+bCxvbk1lc3NhZ2U6KCk9PmQsb25Qb3J0OigpPT5tLG9uUG9ydENvbm5lY3Q6KCk9PmgscmVsYXk6KCk9PkUscmVsYXlNZXNzYWdlOigpPT5ULHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQ6KCk9Pncsc2VuZFRvQmFja2dyb3VuZDooKT0+UyxzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXk6KCk9PkQsc2VuZFRvQ29udGVudFNjcmlwdDooKT0+QyxzZW5kVmlhUmVsYXk6KCk9Pk8sc3RhcnRIdWI6KCk9PnYsc3Vic2NyaWJlOigpPT55fSksUyxDLHcsVCxFLEQsTyxrPW4oKCgpPT57YygpLGUoKSx1KCksZigpLGcoKSxiKCksUz1hc3luYyBlPT50KCkuc2VuZE1lc3NhZ2UoZS5leHRlbnNpb25JZD8/bnVsbCxlKSxDPWFzeW5jIGU9PntsZXQgdD10eXBlb2YgZS50YWJJZD09YG51bWJlcmA/ZS50YWJJZDooYXdhaXQgYSgpKT8uaWQ7aWYoIXQpdGhyb3cgRXJyb3IoYE5vIGFjdGl2ZSB0YWIgZm91bmQgdG8gc2VuZCBtZXNzYWdlIHRvLmApO3JldHVybiByKCkuc2VuZE1lc3NhZ2UodCxlKX0sdz1DLFQ9ZT0+byhlLFMpLEU9VCxEPXMsTz1EfSkpO3UoKSxmKCksZygpLGIoKSxrKCk7ZXhwb3J0e18gYXMgYnJvYWRjYXN0LHAgYXMgZ2V0UG9ydCxsIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLHggYXMgbixkIGFzIG9uTWVzc2FnZSxtIGFzIG9uUG9ydCxoIGFzIG9uUG9ydENvbm5lY3QsRSBhcyByZWxheSxUIGFzIHJlbGF5TWVzc2FnZSx3IGFzIHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQsUyBhcyBzZW5kVG9CYWNrZ3JvdW5kLEQgYXMgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5LEMgYXMgc2VuZFRvQ29udGVudFNjcmlwdCxPIGFzIHNlbmRWaWFSZWxheSx2IGFzIHN0YXJ0SHViLHkgYXMgc3Vic2NyaWJlLGsgYXMgdH07IiwiaW1wb3J0IHtcblx0c2VuZFRvQmFja2dyb3VuZCxcblx0c2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5LFxuXHRvbk1lc3NhZ2UsXG59IGZyb20gXCJ3ZWJleHQtbWVzc2FnZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcblx0bWF0Y2hlczogW1wiKjovLyouZXhhbXBsZS5jb20vKlwiXSxcblx0bWFpbigpIHtcblx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gSW5pdGlhbGl6ZWRcIik7XG5cblx0XHQvLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzIGZyb20gYmFja2dyb3VuZFxuXHRcdG9uTWVzc2FnZTx7IHR5cGU6IHN0cmluZyB9LCB7IGFja25vd2xlZGdlZDogYm9vbGVhbiB9Pihcblx0XHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gUmVjZWl2ZWQgZnJvbSBiYWNrZ3JvdW5kOlwiLCByZXF1ZXN0KTtcblxuXHRcdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImNvbnRlbnQtbm90aWZ5XCIpIHtcblx0XHRcdFx0XHRyZXNwb25zZS5zZW5kKHsgYWNrbm93bGVkZ2VkOiB0cnVlIH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdCk7XG5cblx0XHQvLyBFeGFtcGxlOiBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZFxuXHRcdGFzeW5jIGZ1bmN0aW9uIHNlbmRFY2hvTWVzc2FnZSh0ZXh0OiBzdHJpbmcpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZFRvQmFja2dyb3VuZDxcblx0XHRcdFx0XHR7IGVjaG86IHN0cmluZyB9LFxuXHRcdFx0XHRcdHsgZWNob2VkOiBzdHJpbmcgfVxuXHRcdFx0XHQ+KHtcblx0XHRcdFx0XHRuYW1lOiBcImVjaG8tbWVzc2FnZVwiLFxuXHRcdFx0XHRcdGJvZHk6IHsgZWNobzogdGV4dCB9LFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gUmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbQ29udGVudCBTY3JpcHRdIEVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogUHJvY2VzcyBkYXRhIHRocm91Z2ggYmFja2dyb3VuZFxuXHRcdGFzeW5jIGZ1bmN0aW9uIHByb2Nlc3NEYXRhKGRhdGE6IGFueSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aW50ZXJmYWNlIERhdGFSZXNwb25zZSB7XG5cdFx0XHRcdFx0c3RhdHVzOiBcInN1Y2Nlc3NcIiB8IFwiZXJyb3JcIjtcblx0XHRcdFx0XHRkYXRhPzogYW55O1xuXHRcdFx0XHRcdGVycm9yPzogc3RyaW5nO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kVG9CYWNrZ3JvdW5kPGFueSwgRGF0YVJlc3BvbnNlPih7XG5cdFx0XHRcdFx0bmFtZTogXCJwcm9jZXNzLWRhdGFcIixcblx0XHRcdFx0XHRib2R5OiB7IHR5cGU6IFwicHJvY2Vzc1wiLCBwYXlsb2FkOiBkYXRhIH0sXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBQcm9jZXNzIHJlc3VsdDpcIiwgcmVzcG9uc2UpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIltDb250ZW50IFNjcmlwdF0gUHJvY2VzcyBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEV4YW1wbGU6IEdldCBjdXJyZW50IHRhYiBpbmZvXG5cdFx0YXN5bmMgZnVuY3Rpb24gZ2V0VGFiSW5mbygpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGludGVyZmFjZSBUYWJJbmZvIHtcblx0XHRcdFx0XHR0YWJJZDogbnVtYmVyO1xuXHRcdFx0XHRcdHVybDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kVG9CYWNrZ3JvdW5kPHt9LCBUYWJJbmZvPih7XG5cdFx0XHRcdFx0bmFtZTogXCJnZXQtdGFiLWluZm9cIixcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQ29udGVudCBTY3JpcHRdIFRhYiBpbmZvOlwiLCByZXNwb25zZSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiW0NvbnRlbnQgU2NyaXB0XSBUYWIgaW5mbyBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEV4YW1wbGU6IFJlbGF5IGNvbW11bmljYXRpb25cblx0XHRhc3luYyBmdW5jdGlvbiByZWxheU1lc3NhZ2UodGV4dDogc3RyaW5nKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmRWaWFSZWxheTxcblx0XHRcdFx0XHR7IG1lc3NhZ2U6IHN0cmluZyB9LFxuXHRcdFx0XHRcdHsgYnJvYWRjYXN0SWQ6IHN0cmluZyB9XG5cdFx0XHRcdD4oe1xuXHRcdFx0XHRcdG5hbWU6IFwiYnJvYWRjYXN0LW1lc3NhZ2VcIixcblx0XHRcdFx0XHRib2R5OiB7IG1lc3NhZ2U6IHRleHQgfSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQ29udGVudCBTY3JpcHRdIFJlbGF5IHJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiW0NvbnRlbnQgU2NyaXB0XSBSZWxheSBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE1ha2UgZnVuY3Rpb25zIGF2YWlsYWJsZSBvbiB3aW5kb3cgZm9yIHRlc3Rpbmdcblx0XHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0KHdpbmRvdyBhcyBhbnkpLl9fZXh0TWVzc2FnaW5nRGVtbyA9IHtcblx0XHRcdFx0c2VuZEVjaG9NZXNzYWdlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YSxcblx0XHRcdFx0Z2V0VGFiSW5mbyxcblx0XHRcdFx0cmVsYXlNZXNzYWdlLFxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHQvLyBSdW4gc29tZSBleGFtcGxlcyBvbiBsb2FkXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRnZXRUYWJJbmZvKCk7XG5cdFx0XHRzZW5kRWNob01lc3NhZ2UoXCJIZWxsbyBmcm9tIGNvbnRlbnQgc2NyaXB0XCIpO1xuXHRcdFx0cHJvY2Vzc0RhdGEoW1wiYVwiLCBcImJcIiwgXCJjXCJdKTtcblx0XHR9LCAxMDAwKTtcblx0fSxcbn0pO1xuIiwiLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9sb2dnZXIudHNcbmZ1bmN0aW9uIHByaW50KG1ldGhvZCwgLi4uYXJncykge1xuXHRpZiAoaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09IFwicHJvZHVjdGlvblwiKSByZXR1cm47XG5cdGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIikgbWV0aG9kKGBbd3h0XSAke2FyZ3Muc2hpZnQoKX1gLCAuLi5hcmdzKTtcblx0ZWxzZSBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbn1cbi8qKiBXcmFwcGVyIGFyb3VuZCBgY29uc29sZWAgd2l0aCBhIFwiW3d4dF1cIiBwcmVmaXggKi9cbmNvbnN0IGxvZ2dlciA9IHtcblx0ZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcblx0bG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuXHR3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcblx0ZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgbG9nZ2VyIH07XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xuXHRjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuXHRcdHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuXHRcdHRoaXMubmV3VXJsID0gbmV3VXJsO1xuXHRcdHRoaXMub2xkVXJsID0gb2xkVXJsO1xuXHR9XG59O1xuLyoqXG4qIFJldHVybnMgYW4gZXZlbnQgbmFtZSB1bmlxdWUgdG8gdGhlIGV4dGVuc2lvbiBhbmQgY29udGVudCBzY3JpcHQgdGhhdCdzXG4qIHJ1bm5pbmcuXG4qL1xuZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRyZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQsIGdldFVuaXF1ZUV2ZW50TmFtZSB9O1xuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIudHNcbmNvbnN0IHN1cHBvcnRzTmF2aWdhdGlvbkFwaSA9IHR5cGVvZiBnbG9iYWxUaGlzLm5hdmlnYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwiZnVuY3Rpb25cIjtcbi8qKlxuKiBDcmVhdGUgYSB1dGlsIHRoYXQgd2F0Y2hlcyBmb3IgVVJMIGNoYW5nZXMsIGRpc3BhdGNoaW5nIHRoZSBjdXN0b20gZXZlbnQgd2hlblxuKiBkZXRlY3RlZC4gU3RvcHMgd2F0Y2hpbmcgd2hlbiBjb250ZW50IHNjcmlwdCBpcyBpbnZhbGlkYXRlZC4gVXNlcyBOYXZpZ2F0aW9uXG4qIEFQSSB3aGVuIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbiovXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG5cdGxldCBsYXN0VXJsO1xuXHRsZXQgd2F0Y2hpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHsgcnVuKCkge1xuXHRcdGlmICh3YXRjaGluZykgcmV0dXJuO1xuXHRcdHdhdGNoaW5nID0gdHJ1ZTtcblx0XHRsYXN0VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRpZiAoc3VwcG9ydHNOYXZpZ2F0aW9uQXBpKSBnbG9iYWxUaGlzLm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmID09PSBsYXN0VXJsLmhyZWYpIHJldHVybjtcblx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHR9LCB7IHNpZ25hbDogY3R4LnNpZ25hbCB9KTtcblx0XHRlbHNlIGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmICE9PSBsYXN0VXJsLmhyZWYpIHtcblx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0XHR9XG5cdFx0fSwgMWUzKTtcblx0fSB9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfTtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0LnRzXG4vKipcbiogSW1wbGVtZW50c1xuKiBbYEFib3J0Q29udHJvbGxlcmBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BYm9ydENvbnRyb2xsZXIpLlxuKiBVc2VkIHRvIGRldGVjdCBhbmQgc3RvcCBjb250ZW50IHNjcmlwdCBjb2RlIHdoZW4gdGhlIHNjcmlwdCBpcyBpbnZhbGlkYXRlZC5cbipcbiogSXQgYWxzbyBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdGllcyBsaWtlIGBjdHguc2V0VGltZW91dGAgYW5kXG4qIGBjdHguc2V0SW50ZXJ2YWxgIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW4gY29udGVudCBzY3JpcHRzIGluc3RlYWQgb2ZcbiogYHdpbmRvdy5zZXRUaW1lb3V0YCBvciBgd2luZG93LnNldEludGVydmFsYC5cbipcbiogVG8gY3JlYXRlIGNvbnRleHQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gdXNlIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yOlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9IGZyb20gJ3d4dC91dGlscy9jb250ZW50LXNjcmlwdHMtY29udGV4dCc7XG4qXG4qIHRlc3QoJ3N0b3JhZ2UgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiBjb250ZXh0IGlzIGludmFsaWRhdGVkJywgKCkgPT4ge1xuKiAgIGNvbnN0IGN0eCA9IG5ldyBDb250ZW50U2NyaXB0Q29udGV4dCgndGVzdCcpO1xuKiAgIGNvbnN0IGl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW0oJ2xvY2FsOmNvdW50JywgeyBkZWZhdWx0VmFsdWU6IDAgfSk7XG4qICAgY29uc3Qgd2F0Y2hlciA9IHZpLmZuKCk7XG4qXG4qICAgY29uc3QgdW53YXRjaCA9IGl0ZW0ud2F0Y2god2F0Y2hlcik7XG4qICAgY3R4Lm9uSW52YWxpZGF0ZWQodW53YXRjaCk7IC8vIExpc3RlbiBmb3IgaW52YWxpZGF0ZSBoZXJlXG4qXG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkV2l0aCgxLCAwKTtcbipcbiogICBjdHgubm90aWZ5SW52YWxpZGF0ZWQoKTsgLy8gVXNlIHRoaXMgZnVuY3Rpb24gdG8gaW52YWxpZGF0ZSB0aGUgY29udGV4dFxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMik7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogfSk7XG4qIGBgYFxuKi9cbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcblx0c3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCIpO1xuXHRpZDtcblx0YWJvcnRDb250cm9sbGVyO1xuXHRsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG5cdGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXHRcdHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcblx0XHR0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuXHR9XG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcblx0fVxuXHRhYm9ydChyZWFzb24pIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcblx0fVxuXHRnZXQgaXNJbnZhbGlkKCkge1xuXHRcdGlmIChicm93c2VyLnJ1bnRpbWU/LmlkID09IG51bGwpIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHRyZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcblx0fVxuXHRnZXQgaXNWYWxpZCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuXHR9XG5cdC8qKlxuXHQqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpc1xuXHQqIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuXHQqICAgY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcblx0KiAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG5cdCogICB9KTtcblx0KiAgIC8vIC4uLlxuXHQqICAgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuXHQqXG5cdCogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuXHQqL1xuXHRvbkludmFsaWRhdGVkKGNiKSB7XG5cdFx0dGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0fVxuXHQvKipcblx0KiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvblxuXHQqIHRoYXQgc2hvdWxkbid0IHJ1biBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG5cdCogICAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG5cdCpcblx0KiAgICAgLy8gLi4uXG5cdCogICB9O1xuXHQqL1xuXHRibG9jaygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEludGVydmFscyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNsZWFySW50ZXJ2YWxgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBUaW1lb3V0cyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYHNldFRpbWVvdXRgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzXG5cdCogdGhlIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWBcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0pO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZVxuXHQqIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHRhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcblx0XHR9XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/Lih0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSwgaGFuZGxlciwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHNpZ25hbDogdGhpcy5zaWduYWxcblx0XHR9KTtcblx0fVxuXHQvKipcblx0KiBAaW50ZXJuYWxcblx0KiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cblx0Ki9cblx0bm90aWZ5SW52YWxpZGF0ZWQoKSB7XG5cdFx0dGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG5cdFx0bG9nZ2VyLmRlYnVnKGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYCk7XG5cdH1cblx0c3RvcE9sZFNjcmlwdHMoKSB7XG5cdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCB7IGRldGFpbDoge1xuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9IH0pKTtcblx0XHRpZiAoIXRoaXMub3B0aW9ucz8ubm9TY3JpcHRTdGFydGVkUG9zdE1lc3NhZ2UpIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG5cdFx0XHR0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0sIFwiKlwiKTtcblx0fVxuXHR2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcblx0XHRjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGV0YWlsPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcblx0XHRjb25zdCBpc0Zyb21TZWxmID0gZXZlbnQuZGV0YWlsPy5tZXNzYWdlSWQgPT09IHRoaXMuaWQ7XG5cdFx0cmV0dXJuIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgIWlzRnJvbVNlbGY7XG5cdH1cblx0bGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuXHRcdGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB8fCAhdGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSByZXR1cm47XG5cdFx0XHR0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpKTtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwyLDMsMTEsMTIsMTMsMTQsMTUsMTZdLCJtYXBwaW5ncyI6Ijs7Q0FDQSxTQUFTLG9CQUFvQixZQUFZO0VBQ3hDLE9BQU87Q0FDUjs7O0NDSEEsSUFBSSxJQUFFLE9BQU87Q0FBZ0hBLElBQUFBLE9BQUcsR0FBRSxHQUFFLFlBQVE7RUFBQyxJQUFHLEdBQUUsTUFBTSxFQUFFO0VBQUcsSUFBRztHQUFDLE9BQU8sTUFBSSxJQUFFLEVBQUUsSUFBRSxDQUFDLElBQUc7RUFBQyxTQUFPLEdBQUU7R0FBQyxNQUFNLElBQUUsQ0FBQyxDQUFDLEdBQUU7RUFBQztDQUFDO0NBQUVDLElBQUFBLE9BQUcsR0FBRSxNQUFJO0VBQUMsSUFBSSxJQUFFLENBQUM7RUFBRSxLQUFJLElBQUksS0FBSyxHQUFFLEVBQUUsR0FBRSxHQUFFO0dBQUMsS0FBSSxFQUFFO0dBQUcsWUFBVyxDQUFDO0VBQUMsQ0FBQztFQUFFLE9BQU8sS0FBRyxFQUFFLEdBQUUsT0FBTyxhQUFZLEVBQUMsT0FBTSxTQUFRLENBQUMsR0FBRTtDQUFDO0NBQTZTQyxJQUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBO0NBQUUsSUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBLElBQUVGLFdBQU87RUFBQyxNQUFFLFlBQVcsVUFBTTtHQUFDLElBQUksSUFBRUUsSUFBRSxTQUFTLFdBQVNBLElBQUUsUUFBUTtHQUFRLElBQUcsQ0FBQyxHQUFFLE1BQU0sTUFBTSxvQ0FBb0M7R0FBRSxPQUFPO0VBQUMsR0FBRSxVQUFN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QUFFLE1BQUk7SUFBQyxJQUFHO0tBQUMsTUFBTSxJQUFJO01BQUMsR0FBRztNQUFFLFFBQU87S0FBQyxHQUFFLEVBQUMsT0FBSyxNQUFHLEVBQUUsQ0FBQyxFQUFDLENBQUM7SUFBQyxTQUFPLEdBQUU7S0FBQyxRQUFRLE1BQU0sMEJBQXlCLENBQUMsR0FBRSxFQUFFLEtBQUssQ0FBQztJQUFDO0dBQUMsR0FBRSxLQUFHLEdBQUUsR0FBRSxPQUFLLEVBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxDQUFDLElBQUcsSUFBRUMsRUFBRTtHQUFFLE9BQU8sRUFBRSxVQUFVLFlBQVksQ0FBQyxTQUFNO0lBQUMsRUFBRSxVQUFVLGVBQWUsQ0FBQztHQUFDO0VBQUM7Q0FBQyxFQUFFO0NBQUUsSUFBRTs7O0NDQXZRLElBQUlDO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBLE1BQUVDLFdBQU87RUFBQyxFQUFFLEdBQUUsc0JBQUUsSUFBSSxJQUFFLEdBQUUsT0FBRSxNQUFHO0dBQUMsSUFBSSxJQUFFTixJQUFFLElBQUksQ0FBQztHQUFFLElBQUcsR0FBRSxPQUFPO0dBQUUsSUFBSSxJQUFFTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUMsTUFBSyxFQUFDLENBQUM7R0FBRSxPQUFPUCxJQUFFLElBQUksR0FBRSxDQUFDLEdBQUU7RUFBQyxHQUFFLE9BQUUsTUFBRztHQUFDLElBQUUsT0FBTyxDQUFDO0VBQUMsR0FBRSxPQUFHLEdBQUUsR0FBRSxNQUFJO0dBQUMsSUFBSSxJQUFFQyxJQUFFLENBQUM7R0FBRSxTQUFTLElBQUc7SUFBQyxJQUFFLENBQUMsR0FBRSxJQUFJO0dBQUM7R0FBQyxJQUFJLElBQUUsT0FBTSxNQUFHO0lBQUMsSUFBRztLQUFDLE1BQU0sRUFBRSxDQUFDO0lBQUMsU0FBTyxHQUFFO0tBQUMsUUFBUSxNQUFNLHVCQUFzQixDQUFDO0lBQUM7R0FBQztHQUFFLE9BQU8sRUFBRSxVQUFVLFlBQVksQ0FBQyxHQUFFLEVBQUUsYUFBYSxZ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