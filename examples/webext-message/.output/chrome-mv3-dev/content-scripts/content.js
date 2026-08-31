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
	var a$4 = (t, n) => {
		let r = {};
		for (var i in t) e(r, i, {
			get: t[i],
			enumerable: !0
		});
		return n || e(r, Symbol.toStringTag, { value: `Module` }), r;
	};
	var c$1;
	var l;
	var u;
	var d;
	var f;
	var p = i$5((() => {
		c$1 = globalThis, l = () => {
			let e = c$1.browser?.runtime ?? c$1.chrome?.runtime;
			if (!e) throw Error(`Extension runtime is not available`);
			return e;
		}, u = () => {
			let e = c$1.browser?.tabs ?? c$1.chrome?.tabs;
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
	var a$3;
	var o$3 = i$5((() => {
		p(), i$4 = (t, n, r = globalThis.window) => {
			let i = async (i) => {
				let a = i;
				if (f(a, t) && !a.data.relayed) {
					let e = {
						name: t.name,
						relayId: t.relayId,
						body: a.data.body
					}, i = await n?.(e);
					r.postMessage({
						name: t.name,
						relayId: t.relayId,
						instanceId: a.data.instanceId,
						body: i,
						relayed: !0
					}, { targetOrigin: t.targetOrigin || `/` });
				}
			};
			return r.addEventListener(`message`, i), () => r.removeEventListener(`message`, i);
		}, a$3 = (t, n = globalThis.window) => new Promise((i, a) => {
			let o = nanoid(), s = (r) => {
				let a = r;
				f(a, t) && a.data.relayed && a.data.instanceId === o && (n.removeEventListener(`message`, s), i(a.data.body));
			};
			n.addEventListener(`message`, s), n.postMessage({
				name: t.name,
				body: t.body,
				relayId: t.relayId,
				instanceId: o,
				targetOrigin: t.targetOrigin || `/`
			}, { targetOrigin: t.targetOrigin || `/` }), setTimeout(() => {
				n.removeEventListener(`message`, s), a(Error(`Relay timeout for message: ${t.name}`));
			}, 3e4);
		});
	}));
	o$3();
	//#endregion
	//#region ../../packages/webext-message/dist/background.js
	var r$3;
	var a$2;
	var o$2 = i$5((() => {
		p(), r$3 = () => (globalThis.__extMessagingPortMap || (globalThis.__extMessagingPortMap = /* @__PURE__ */ new Map()), globalThis.__extMessagingPortMap), a$2 = () => {
			let e = l();
			e.onMessage.addListener((e, t, n) => e.__EXT_MESSAGING_SIGNAL__ === `__EXT_MESSAGING_PING__` && (n(!0), !0)), e.onConnect.addListener((e) => {
				let t = r$3();
				t.set(e.name, e), e.onDisconnect.addListener(() => {
					t.delete(e.name);
				});
			});
		}, typeof globalThis < `u` && globalThis.chrome?.runtime && a$2();
	}));
	o$2();
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
	var c = i$5((() => {
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
	c();
	//#endregion
	//#region ../../packages/webext-message/dist/pub-sub.js
	var r;
	var i;
	var a;
	var o;
	var s = i$5((() => {
		p(), r = () => (globalThis.__extMessagingHubMap || (globalThis.__extMessagingHubMap = /* @__PURE__ */ new Map()), globalThis.__extMessagingHubMap), i = () => {
			let e = l();
			if (!e.onConnectExternal) throw Error(`onConnectExternal not available. Need externally_connectable in manifest`);
			globalThis.__extMessagingHubMap = /* @__PURE__ */ new Map();
			let n = r();
			e.onConnectExternal.addListener((e) => {
				let t = e.sender?.tab?.id;
				t && !n.has(t) && (n.set(t, e), e.onMessage.addListener((e) => {
					a({
						from: t,
						payload: e
					});
				}), e.onDisconnect.addListener(() => {
					n.delete(t);
				}));
			});
		}, a = (e) => {
			r().forEach((t, n) => {
				n !== e.from && t.postMessage({
					...e,
					to: n
				});
			});
		}, o = (e) => {
			let n = (t) => {
				e(t);
			}, r = l();
			return r.onMessage.addListener(n), () => {
				r.onMessage.removeListener(n);
			};
		};
	}));
	s();
	a$4({
		broadcast: () => a,
		getPort: () => i$1,
		initializeBackgroundMessaging: () => a$2,
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
		startHub: () => i,
		subscribe: () => o
	});
	var S;
	var C;
	var w;
	var T;
	var E;
	var D;
	var O;
	var k = i$5((() => {
		o$3(), p(), o$2(), i$2(), c(), s(), S = async (e) => l().sendMessage(e.extensionId ?? null, e), C = async (e) => {
			let t = typeof e.tabId == `number` ? e.tabId : (await d())?.id;
			if (!t) throw Error(`No active tab found to send message to.`);
			return u().sendMessage(t, e);
		}, w = C, T = (e) => i$4(e, S), E = T, D = a$3, O = D;
	}));
	o$2(), i$2(), c(), s(), k();
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
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?D:/Projects/webext-kit/examples/wxt-demo/src/entrypoints/content.ts
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImkiLCJhIiwiYyIsImkiLCJhIiwibyIsIm4iLCJlIiwiciIsInIiLCJpIiwiYSIsIm8iLCJuIiwidCIsInIiLCJpIiwibiIsInQiLCJyIiwiaSIsImEiLCJvIiwicyIsIm4iLCJ0IiwibiIsInQiLCJpIiwiXyIsInAiLCJsIiwiZCIsIm0iLCJoIiwidiIsInkiLCJuIiwiZSIsInUiLCJmIiwiZyIsImIiLCJ0IiwiYSIsInIiLCJvIiwicyIsInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvdXRpbHMtMUxDVzZCTXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LW1lc3NhZ2UvZGlzdC9yZWxheS5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvYmFja2dyb3VuZC5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvbWVzc2FnZS5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcG9ydC5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcHViLXN1Yi5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCthYTZhOWE0NWEzNzdmYzExL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIHNyYy91dGlscy9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuXHRyZXR1cm4gZGVmaW5pdGlvbjtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQ29udGVudFNjcmlwdCB9O1xuIiwidmFyIGU9T2JqZWN0LmRlZmluZVByb3BlcnR5LHQ9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixuPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLHI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxpPShlLHQsbik9PigpPT57aWYobil0aHJvdyBuWzBdO3RyeXtyZXR1cm4gZSYmKHQ9ZShlPTApKSx0fWNhdGNoKGUpe3Rocm93IG49W2VdLGV9fSxhPSh0LG4pPT57bGV0IHI9e307Zm9yKHZhciBpIGluIHQpZShyLGkse2dldDp0W2ldLGVudW1lcmFibGU6ITB9KTtyZXR1cm4gbnx8ZShyLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6YE1vZHVsZWB9KSxyfSxvPShpLGEsbyxzKT0+e2lmKGEmJnR5cGVvZiBhPT1gb2JqZWN0YHx8dHlwZW9mIGE9PWBmdW5jdGlvbmApZm9yKHZhciBjPW4oYSksbD0wLHU9Yy5sZW5ndGgsZDtsPHU7bCsrKWQ9Y1tsXSwhci5jYWxsKGksZCkmJmQhPT1vJiZlKGksZCx7Z2V0OihlPT5hW2VdKS5iaW5kKG51bGwsZCksZW51bWVyYWJsZTohKHM9dChhLGQpKXx8cy5lbnVtZXJhYmxlfSk7cmV0dXJuIGl9LHM9dD0+ci5jYWxsKHQsYG1vZHVsZS5leHBvcnRzYCk/dFtgbW9kdWxlLmV4cG9ydHNgXTpvKGUoe30sYF9fZXNNb2R1bGVgLHt2YWx1ZTohMH0pLHQpLGMsbCx1LGQsZixwPWkoKCgpPT57Yz1nbG9iYWxUaGlzLGw9KCk9PntsZXQgZT1jLmJyb3dzZXI/LnJ1bnRpbWU/P2MuY2hyb21lPy5ydW50aW1lO2lmKCFlKXRocm93IEVycm9yKGBFeHRlbnNpb24gcnVudGltZSBpcyBub3QgYXZhaWxhYmxlYCk7cmV0dXJuIGV9LHU9KCk9PntsZXQgZT1jLmJyb3dzZXI/LnRhYnM/P2MuY2hyb21lPy50YWJzO2lmKCFlKXRocm93IEVycm9yKGBFeHRlbnNpb24gdGFicyBBUEkgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSxkPWFzeW5jKCk9PntsZXRbZV09YXdhaXQgdSgpLnF1ZXJ5KHthY3RpdmU6ITAsY3VycmVudFdpbmRvdzohMH0pO3JldHVybiBlfSxmPShlLHQpPT4hdC5fX2ludGVybmFsJiZlLnNvdXJjZT09PWdsb2JhbFRoaXMud2luZG93JiZlLmRhdGEubmFtZT09PXQubmFtZSYmKHQucmVsYXlJZD09PXZvaWQgMHx8ZS5kYXRhLnJlbGF5SWQ9PT10LnJlbGF5SWQpfSkpO2V4cG9ydHtmIGFzIGEscyBhcyBjLHAgYXMgaSxsIGFzIG4saSBhcyBvLHUgYXMgcixhIGFzIHMsZCBhcyB0fTsiLCJleHBvcnQgbGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG4iLCJcblxuaW1wb3J0IHsgdXJsQWxwaGFiZXQgfSBmcm9tICcuL3VybC1hbHBoYWJldC9pbmRleC5qcydcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuXG5leHBvcnQgbGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxuXG5leHBvcnQgbGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgZGVmYXVsdFNpemUsIGdldFJhbmRvbSkgPT4ge1xuICBsZXQgc2FmZUJ5dGVDdXRvZmYgPSAyNTYgLSAoMjU2ICUgYWxwaGFiZXQubGVuZ3RoKVxuXG4gIGlmIChzYWZlQnl0ZUN1dG9mZiA9PT0gMjU2KSB7XG4gICAgbGV0IG1hc2sgPSBhbHBoYWJldC5sZW5ndGggLSAxXG5cbiAgICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgICAgaWYgKCFzaXplKSByZXR1cm4gJydcbiAgICAgIGxldCBpZCA9ICcnXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc2l6ZSlcbiAgICAgICAgbGV0IGogPSBzaXplXG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBzdGVwID0gTWF0aC5jZWlsKCgxLjYgKiAyNTYgKiBkZWZhdWx0U2l6ZSkgLyBzYWZlQnl0ZUN1dG9mZilcblxuICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgaWYgKGJ5dGVzW2pdIDwgc2FmZUJ5dGVDdXRvZmYpIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAlIGFscGhhYmV0Lmxlbmd0aF1cbiAgICAgICAgICBpZiAoaWQubGVuZ3RoID49IHNpemUpIHJldHVybiBpZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplIHwgMCwgcmFuZG9tKVxuXG5leHBvcnQgbGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgoc2l6ZSB8PSAwKSkpXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBpZCArPSB1cmxBbHBoYWJldFtieXRlc1tzaXplXSAmIDYzXVxuICB9XG4gIHJldHVybiBpZFxufVxuIiwiaW1wb3J0e2EgYXMgZSxpIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjtpbXBvcnR7bmFub2lkIGFzIHJ9ZnJvbVwibmFub2lkXCI7dmFyIGksYSxvPW4oKCgpPT57dCgpLGk9KHQsbixyPWdsb2JhbFRoaXMud2luZG93KT0+e2xldCBpPWFzeW5jIGk9PntsZXQgYT1pO2lmKGUoYSx0KSYmIWEuZGF0YS5yZWxheWVkKXtsZXQgZT17bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsYm9keTphLmRhdGEuYm9keX0saT1hd2FpdCBuPy4oZSk7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxib2R5OmkscmVsYXllZDohMH0se3RhcmdldE9yaWdpbjp0LnRhcmdldE9yaWdpbnx8YC9gfSl9fTtyZXR1cm4gci5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKSwoKT0+ci5yZW1vdmVFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKX0sYT0odCxuPWdsb2JhbFRoaXMud2luZG93KT0+bmV3IFByb21pc2UoKGksYSk9PntsZXQgbz1yKCkscz1yPT57bGV0IGE9cjtlKGEsdCkmJmEuZGF0YS5yZWxheWVkJiZhLmRhdGEuaW5zdGFuY2VJZD09PW8mJihuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLHMpLGkoYS5kYXRhLmJvZHkpKX07bi5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxzKSxuLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxib2R5OnQuYm9keSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOm8sdGFyZ2V0T3JpZ2luOnQudGFyZ2V0T3JpZ2lufHxgL2B9LHt0YXJnZXRPcmlnaW46dC50YXJnZXRPcmlnaW58fGAvYH0pLHNldFRpbWVvdXQoKCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLHMpLGEoRXJyb3IoYFJlbGF5IHRpbWVvdXQgZm9yIG1lc3NhZ2U6ICR7dC5uYW1lfWApKX0sM2U0KX0pfSkpO28oKTtleHBvcnR7aSBhcyByZWxheSxhIGFzIHNlbmRWaWFSZWxheSxvIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaSxhLG89bigoKCk9PntlKCkscj0oKT0+KGdsb2JhbFRoaXMuX19leHRNZXNzYWdpbmdQb3J0TWFwfHwoZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ1BvcnRNYXA9bmV3IE1hcCksZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ1BvcnRNYXApLGk9ZT0+e2xldCB0PXIoKS5nZXQoZSk7aWYoIXQpdGhyb3cgRXJyb3IoYFBvcnQgJHtlfSBub3QgZm91bmRgKTtyZXR1cm4gdH0sYT0oKT0+e2xldCBlPXQoKTtlLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigoZSx0LG4pPT5lLl9fRVhUX01FU1NBR0lOR19TSUdOQUxfXz09PWBfX0VYVF9NRVNTQUdJTkdfUElOR19fYCYmKG4oITApLCEwKSksZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZT0+e2xldCB0PXIoKTt0LnNldChlLm5hbWUsZSksZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9Pnt0LmRlbGV0ZShlLm5hbWUpfSl9KX0sdHlwZW9mIGdsb2JhbFRoaXM8YHVgJiZnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZSYmYSgpfSkpO28oKTtleHBvcnR7aSBhcyBnZXRQb3J0LHIgYXMgZ2V0UG9ydE1hcCxhIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLG8gYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpPW4oKCgpPT57ZSgpLHI9ZT0+e2xldCBuPWFzeW5jKHQsbixyKT0+e3RyeXthd2FpdCBlPy4oey4uLnQsc2VuZGVyOm59LHtzZW5kOmU9PnIoZSl9KX1jYXRjaChlKXtjb25zb2xlLmVycm9yKGBNZXNzYWdlIGhhbmRsZXIgZXJyb3I6YCxlKSxyKHZvaWQgMCl9fSxyPShlLHQscik9PihuKGUsdCxyKSwhMCksaT10KCk7cmV0dXJuIGkub25NZXNzYWdlLmFkZExpc3RlbmVyKHIpLCgpPT57aS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIocil9fX0pKTtpKCk7ZXhwb3J0e3IgYXMgbGlzdGVuLGkgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpLGEsbyxzLGM9bigoKCk9PntlKCkscj1uZXcgTWFwLGk9ZT0+e2xldCBuPXIuZ2V0KGUpO2lmKG4pcmV0dXJuIG47bGV0IGk9dCgpLmNvbm5lY3Qoe25hbWU6ZX0pO3JldHVybiByLnNldChlLGkpLGl9LGE9ZT0+e3IuZGVsZXRlKGUpfSxvPShlLHQsbik9PntsZXQgcj1pKGUpO2Z1bmN0aW9uIG8oKXthKGUpLG4/LigpfWxldCBzPWFzeW5jIGU9Pnt0cnl7YXdhaXQgdChlKX1jYXRjaChlKXtjb25zb2xlLmVycm9yKGBQb3J0IGhhbmRsZXIgZXJyb3I6YCxlKX19O3JldHVybiByLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihzKSxyLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihvKSx7cG9ydDpyLGRpc2Nvbm5lY3Q6KCk9PntyLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihzKSxyLm9uRGlzY29ubmVjdC5yZW1vdmVMaXN0ZW5lcihvKX19fSxzPShlLG4pPT57bGV0IHI9dCgpLGk9YXN5bmMgdD0+e2lmKHQubmFtZSE9PWUpcmV0dXJuO2xldCByPWF3YWl0IG4odCk7cj8ub25NZXNzYWdlJiZ0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyLm9uTWVzc2FnZSksdC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9PntyPy5vbkRpc2Nvbm5lY3Q/LigpfSl9O3JldHVybiByLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihpKSwoKT0+e3Iub25Db25uZWN0LnJlbW92ZUxpc3RlbmVyKGkpfX19KSk7YygpO2V4cG9ydHtpIGFzIGdldFBvcnQsbyBhcyBsaXN0ZW4scyBhcyBvblBvcnRDb25uZWN0LGEgYXMgcmVtb3ZlUG9ydCxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaSxhLG8scz1uKCgoKT0+e2UoKSxyPSgpPT4oZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcHx8KGdsb2JhbFRoaXMuX19leHRNZXNzYWdpbmdIdWJNYXA9bmV3IE1hcCksZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcCksaT0oKT0+e2xldCBlPXQoKTtpZighZS5vbkNvbm5lY3RFeHRlcm5hbCl0aHJvdyBFcnJvcihgb25Db25uZWN0RXh0ZXJuYWwgbm90IGF2YWlsYWJsZS4gTmVlZCBleHRlcm5hbGx5X2Nvbm5lY3RhYmxlIGluIG1hbmlmZXN0YCk7Z2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcD1uZXcgTWFwO2xldCBuPXIoKTtlLm9uQ29ubmVjdEV4dGVybmFsLmFkZExpc3RlbmVyKGU9PntsZXQgdD1lLnNlbmRlcj8udGFiPy5pZDt0JiYhbi5oYXModCkmJihuLnNldCh0LGUpLGUub25NZXNzYWdlLmFkZExpc3RlbmVyKGU9PnthKHtmcm9tOnQscGF5bG9hZDplfSl9KSxlLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKT0+e24uZGVsZXRlKHQpfSkpfSl9LGE9ZT0+e3IoKS5mb3JFYWNoKCh0LG4pPT57biE9PWUuZnJvbSYmdC5wb3N0TWVzc2FnZSh7Li4uZSx0bzpufSl9KX0sbz1lPT57bGV0IG49dD0+e2UodCl9LHI9dCgpO3JldHVybiByLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihuKSwoKT0+e3Iub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKG4pfX19KSk7cygpO2V4cG9ydHthIGFzIGJyb2FkY2FzdCxyIGFzIGdldEh1Yk1hcCxpIGFzIHN0YXJ0SHViLG8gYXMgc3Vic2NyaWJlLHMgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBuLHIscyBhcyBpLHQgYXMgYX1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7aW1wb3J0e3JlbGF5IGFzIG8sc2VuZFZpYVJlbGF5IGFzIHMsdCBhcyBjfWZyb21cIi4vcmVsYXkuanNcIjtpbXBvcnR7aW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcgYXMgbCx0IGFzIHV9ZnJvbVwiLi9iYWNrZ3JvdW5kLmpzXCI7aW1wb3J0e2xpc3RlbiBhcyBkLHQgYXMgZn1mcm9tXCIuL21lc3NhZ2UuanNcIjtpbXBvcnR7Z2V0UG9ydCBhcyBwLGxpc3RlbiBhcyBtLG9uUG9ydENvbm5lY3QgYXMgaCx0IGFzIGd9ZnJvbVwiLi9wb3J0LmpzXCI7aW1wb3J0e2Jyb2FkY2FzdCBhcyBfLHN0YXJ0SHViIGFzIHYsc3Vic2NyaWJlIGFzIHksdCBhcyBifWZyb21cIi4vcHViLXN1Yi5qc1wiO3ZhciB4PWkoe2Jyb2FkY2FzdDooKT0+XyxnZXRQb3J0OigpPT5wLGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nOigpPT5sLG9uTWVzc2FnZTooKT0+ZCxvblBvcnQ6KCk9Pm0sb25Qb3J0Q29ubmVjdDooKT0+aCxyZWxheTooKT0+RSxyZWxheU1lc3NhZ2U6KCk9PlQsc2VuZFRvQWN0aXZlQ29udGVudFNjcmlwdDooKT0+dyxzZW5kVG9CYWNrZ3JvdW5kOigpPT5TLHNlbmRUb0JhY2tncm91bmRWaWFSZWxheTooKT0+RCxzZW5kVG9Db250ZW50U2NyaXB0OigpPT5DLHNlbmRWaWFSZWxheTooKT0+TyxzdGFydEh1YjooKT0+dixzdWJzY3JpYmU6KCk9Pnl9KSxTLEMsdyxULEUsRCxPLGs9bigoKCk9PntjKCksZSgpLHUoKSxmKCksZygpLGIoKSxTPWFzeW5jIGU9PnQoKS5zZW5kTWVzc2FnZShlLmV4dGVuc2lvbklkPz9udWxsLGUpLEM9YXN5bmMgZT0+e2xldCB0PXR5cGVvZiBlLnRhYklkPT1gbnVtYmVyYD9lLnRhYklkOihhd2FpdCBhKCkpPy5pZDtpZighdCl0aHJvdyBFcnJvcihgTm8gYWN0aXZlIHRhYiBmb3VuZCB0byBzZW5kIG1lc3NhZ2UgdG8uYCk7cmV0dXJuIHIoKS5zZW5kTWVzc2FnZSh0LGUpfSx3PUMsVD1lPT5vKGUsUyksRT1ULEQ9cyxPPUR9KSk7dSgpLGYoKSxnKCksYigpLGsoKTtleHBvcnR7XyBhcyBicm9hZGNhc3QscCBhcyBnZXRQb3J0LGwgYXMgaW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcseCBhcyBuLGQgYXMgb25NZXNzYWdlLG0gYXMgb25Qb3J0LGggYXMgb25Qb3J0Q29ubmVjdCxFIGFzIHJlbGF5LFQgYXMgcmVsYXlNZXNzYWdlLHcgYXMgc2VuZFRvQWN0aXZlQ29udGVudFNjcmlwdCxTIGFzIHNlbmRUb0JhY2tncm91bmQsRCBhcyBzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXksQyBhcyBzZW5kVG9Db250ZW50U2NyaXB0LE8gYXMgc2VuZFZpYVJlbGF5LHYgYXMgc3RhcnRIdWIseSBhcyBzdWJzY3JpYmUsayBhcyB0fTsiLCJpbXBvcnQge1xuXHRzZW5kVG9CYWNrZ3JvdW5kLFxuXHRzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXksXG5cdG9uTWVzc2FnZSxcbn0gZnJvbSBcIndlYmV4dC1tZXNzYWdlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbnRlbnRTY3JpcHQoe1xuXHRtYXRjaGVzOiBbXCIqOi8vKi5leGFtcGxlLmNvbS8qXCJdLFxuXHRtYWluKCkge1xuXHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBJbml0aWFsaXplZFwiKTtcblxuXHRcdC8vIExpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSBiYWNrZ3JvdW5kXG5cdFx0b25NZXNzYWdlPHsgdHlwZTogc3RyaW5nIH0sIHsgYWNrbm93bGVkZ2VkOiBib29sZWFuIH0+KFxuXHRcdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBSZWNlaXZlZCBmcm9tIGJhY2tncm91bmQ6XCIsIHJlcXVlc3QpO1xuXG5cdFx0XHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwiY29udGVudC1ub3RpZnlcIikge1xuXHRcdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBhY2tub3dsZWRnZWQ6IHRydWUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0KTtcblxuXHRcdC8vIEV4YW1wbGU6IFNlbmQgbWVzc2FnZSB0byBiYWNrZ3JvdW5kXG5cdFx0YXN5bmMgZnVuY3Rpb24gc2VuZEVjaG9NZXNzYWdlKHRleHQ6IHN0cmluZykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kVG9CYWNrZ3JvdW5kPFxuXHRcdFx0XHRcdHsgZWNobzogc3RyaW5nIH0sXG5cdFx0XHRcdFx0eyBlY2hvZWQ6IHN0cmluZyB9XG5cdFx0XHRcdD4oe1xuXHRcdFx0XHRcdG5hbWU6IFwiZWNoby1tZXNzYWdlXCIsXG5cdFx0XHRcdFx0Ym9keTogeyBlY2hvOiB0ZXh0IH0sXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBSZXNwb25zZTpcIiwgcmVzcG9uc2UpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIltDb250ZW50IFNjcmlwdF0gRXJyb3I6XCIsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBFeGFtcGxlOiBQcm9jZXNzIGRhdGEgdGhyb3VnaCBiYWNrZ3JvdW5kXG5cdFx0YXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0RhdGEoZGF0YTogYW55KSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpbnRlcmZhY2UgRGF0YVJlc3BvbnNlIHtcblx0XHRcdFx0XHRzdGF0dXM6IFwic3VjY2Vzc1wiIHwgXCJlcnJvclwiO1xuXHRcdFx0XHRcdGRhdGE/OiBhbnk7XG5cdFx0XHRcdFx0ZXJyb3I/OiBzdHJpbmc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmQ8YW55LCBEYXRhUmVzcG9uc2U+KHtcblx0XHRcdFx0XHRuYW1lOiBcInByb2Nlc3MtZGF0YVwiLFxuXHRcdFx0XHRcdGJvZHk6IHsgdHlwZTogXCJwcm9jZXNzXCIsIHBheWxvYWQ6IGRhdGEgfSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQ29udGVudCBTY3JpcHRdIFByb2Nlc3MgcmVzdWx0OlwiLCByZXNwb25zZSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiW0NvbnRlbnQgU2NyaXB0XSBQcm9jZXNzIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogR2V0IGN1cnJlbnQgdGFiIGluZm9cblx0XHRhc3luYyBmdW5jdGlvbiBnZXRUYWJJbmZvKCkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aW50ZXJmYWNlIFRhYkluZm8ge1xuXHRcdFx0XHRcdHRhYklkOiBudW1iZXI7XG5cdFx0XHRcdFx0dXJsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmQ8e30sIFRhYkluZm8+KHtcblx0XHRcdFx0XHRuYW1lOiBcImdldC10YWItaW5mb1wiLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gVGFiIGluZm86XCIsIHJlc3BvbnNlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbQ29udGVudCBTY3JpcHRdIFRhYiBpbmZvIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogUmVsYXkgY29tbXVuaWNhdGlvblxuXHRcdGFzeW5jIGZ1bmN0aW9uIHJlbGF5TWVzc2FnZSh0ZXh0OiBzdHJpbmcpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5PFxuXHRcdFx0XHRcdHsgbWVzc2FnZTogc3RyaW5nIH0sXG5cdFx0XHRcdFx0eyBicm9hZGNhc3RJZDogc3RyaW5nIH1cblx0XHRcdFx0Pih7XG5cdFx0XHRcdFx0bmFtZTogXCJicm9hZGNhc3QtbWVzc2FnZVwiLFxuXHRcdFx0XHRcdGJvZHk6IHsgbWVzc2FnZTogdGV4dCB9LFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gUmVsYXkgcmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbQ29udGVudCBTY3JpcHRdIFJlbGF5IGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gTWFrZSBmdW5jdGlvbnMgYXZhaWxhYmxlIG9uIHdpbmRvdyBmb3IgdGVzdGluZ1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHQod2luZG93IGFzIGFueSkuX19leHRNZXNzYWdpbmdEZW1vID0ge1xuXHRcdFx0XHRzZW5kRWNob01lc3NhZ2UsXG5cdFx0XHRcdHByb2Nlc3NEYXRhLFxuXHRcdFx0XHRnZXRUYWJJbmZvLFxuXHRcdFx0XHRyZWxheU1lc3NhZ2UsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFJ1biBzb21lIGV4YW1wbGVzIG9uIGxvYWRcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGdldFRhYkluZm8oKTtcblx0XHRcdHNlbmRFY2hvTWVzc2FnZShcIkhlbGxvIGZyb20gY29udGVudCBzY3JpcHRcIik7XG5cdFx0XHRwcm9jZXNzRGF0YShbXCJhXCIsIFwiYlwiLCBcImNcIl0pO1xuXHRcdH0sIDEwMDApO1xuXHR9LFxufSk7XG4iLCIvLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG5cdGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcblx0aWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSBtZXRob2QoYFt3eHRdICR7YXJncy5zaGlmdCgpfWAsIC4uLmFyZ3MpO1xuXHRlbHNlIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xufVxuLyoqIFdyYXBwZXIgYXJvdW5kIGBjb25zb2xlYCB3aXRoIGEgXCJbd3h0XVwiIHByZWZpeCAqL1xuY29uc3QgbG9nZ2VyID0ge1xuXHRkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuXHRsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG5cdHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuXHRlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBsb2dnZXIgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsImltcG9ydCB7IGJyb3dzZXIgYXMgYnJvd3NlciQxIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuLyoqXG4qIENvbnRhaW5zIHRoZSBgYnJvd3NlcmAgZXhwb3J0IHdoaWNoIHlvdSBzaG91bGQgdXNlIHRvIGFjY2VzcyB0aGUgZXh0ZW5zaW9uXG4qIEFQSXMgaW4geW91ciBwcm9qZWN0OlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBicm93c2VyIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuKlxuKiBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuKiAgIC8vIC4uLlxuKiB9KTtcbiogYGBgXG4qXG4qIEBtb2R1bGUgd3h0L2Jyb3dzZXJcbiovXG5jb25zdCBicm93c2VyID0gYnJvd3NlciQxO1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBicm93c2VyIH07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMudHNcbnZhciBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50ID0gY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0c3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG5cdGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG5cdFx0c3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG5cdFx0dGhpcy5uZXdVcmwgPSBuZXdVcmw7XG5cdFx0dGhpcy5vbGRVcmwgPSBvbGRVcmw7XG5cdH1cbn07XG4vKipcbiogUmV0dXJucyBhbiBldmVudCBuYW1lIHVuaXF1ZSB0byB0aGUgZXh0ZW5zaW9uIGFuZCBjb250ZW50IHNjcmlwdCB0aGF0J3NcbiogcnVubmluZy5cbiovXG5mdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG5cdHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCwgZ2V0VW5pcXVlRXZlbnROYW1lIH07XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci50c1xuY29uc3Qgc3VwcG9ydHNOYXZpZ2F0aW9uQXBpID0gdHlwZW9mIGdsb2JhbFRoaXMubmF2aWdhdGlvbj8uYWRkRXZlbnRMaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiO1xuLyoqXG4qIENyZWF0ZSBhIHV0aWwgdGhhdCB3YXRjaGVzIGZvciBVUkwgY2hhbmdlcywgZGlzcGF0Y2hpbmcgdGhlIGN1c3RvbSBldmVudCB3aGVuXG4qIGRldGVjdGVkLiBTdG9wcyB3YXRjaGluZyB3aGVuIGNvbnRlbnQgc2NyaXB0IGlzIGludmFsaWRhdGVkLiBVc2VzIE5hdmlnYXRpb25cbiogQVBJIHdoZW4gYXZhaWxhYmxlLCBvdGhlcndpc2UgZmFsbHMgYmFjayB0byBwb2xsaW5nLlxuKi9cbmZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcblx0bGV0IGxhc3RVcmw7XG5cdGxldCB3YXRjaGluZyA9IGZhbHNlO1xuXHRyZXR1cm4geyBydW4oKSB7XG5cdFx0aWYgKHdhdGNoaW5nKSByZXR1cm47XG5cdFx0d2F0Y2hpbmcgPSB0cnVlO1xuXHRcdGxhc3RVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdGlmIChzdXBwb3J0c05hdmlnYXRpb25BcGkpIGdsb2JhbFRoaXMubmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgPT09IGxhc3RVcmwuaHJlZikgcmV0dXJuO1xuXHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRsYXN0VXJsID0gbmV3VXJsO1xuXHRcdH0sIHsgc2lnbmFsOiBjdHguc2lnbmFsIH0pO1xuXHRcdGVsc2UgY3R4LnNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGNvbnN0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgIT09IGxhc3RVcmwuaHJlZikge1xuXHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIGxhc3RVcmwpKTtcblx0XHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHRcdH1cblx0XHR9LCAxZTMpO1xuXHR9IH07XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9O1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vaW50ZXJuYWwvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgZ2V0VW5pcXVlRXZlbnROYW1lIH0gZnJvbSBcIi4vaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9IGZyb20gXCIuL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzXCI7XG5pbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQudHNcbi8qKlxuKiBJbXBsZW1lbnRzXG4qIFtgQWJvcnRDb250cm9sbGVyYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Fib3J0Q29udHJvbGxlcikuXG4qIFVzZWQgdG8gZGV0ZWN0IGFuZCBzdG9wIGNvbnRlbnQgc2NyaXB0IGNvZGUgd2hlbiB0aGUgc2NyaXB0IGlzIGludmFsaWRhdGVkLlxuKlxuKiBJdCBhbHNvIHByb3ZpZGVzIHNldmVyYWwgdXRpbGl0aWVzIGxpa2UgYGN0eC5zZXRUaW1lb3V0YCBhbmRcbiogYGN0eC5zZXRJbnRlcnZhbGAgdGhhdCBzaG91bGQgYmUgdXNlZCBpbiBjb250ZW50IHNjcmlwdHMgaW5zdGVhZCBvZlxuKiBgd2luZG93LnNldFRpbWVvdXRgIG9yIGB3aW5kb3cuc2V0SW50ZXJ2YWxgLlxuKlxuKiBUbyBjcmVhdGUgY29udGV4dCBmb3IgdGVzdGluZywgeW91IGNhbiB1c2UgdGhlIGNsYXNzJ3MgY29uc3RydWN0b3I6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IENvbnRlbnRTY3JpcHRDb250ZXh0IH0gZnJvbSAnd3h0L3V0aWxzL2NvbnRlbnQtc2NyaXB0cy1jb250ZXh0JztcbipcbiogdGVzdCgnc3RvcmFnZSBsaXN0ZW5lciBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQnLCAoKSA9PiB7XG4qICAgY29uc3QgY3R4ID0gbmV3IENvbnRlbnRTY3JpcHRDb250ZXh0KCd0ZXN0Jyk7XG4qICAgY29uc3QgaXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbSgnbG9jYWw6Y291bnQnLCB7IGRlZmF1bHRWYWx1ZTogMCB9KTtcbiogICBjb25zdCB3YXRjaGVyID0gdmkuZm4oKTtcbipcbiogICBjb25zdCB1bndhdGNoID0gaXRlbS53YXRjaCh3YXRjaGVyKTtcbiogICBjdHgub25JbnZhbGlkYXRlZCh1bndhdGNoKTsgLy8gTGlzdGVuIGZvciBpbnZhbGlkYXRlIGhlcmVcbipcbiogICBhd2FpdCBpdGVtLnNldFZhbHVlKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkVGltZXMoMSk7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRXaXRoKDEsIDApO1xuKlxuKiAgIGN0eC5ub3RpZnlJbnZhbGlkYXRlZCgpOyAvLyBVc2UgdGhpcyBmdW5jdGlvbiB0byBpbnZhbGlkYXRlIHRoZSBjb250ZXh0XG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgyKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiB9KTtcbiogYGBgXG4qL1xudmFyIENvbnRlbnRTY3JpcHRDb250ZXh0ID0gY2xhc3MgQ29udGVudFNjcmlwdENvbnRleHQge1xuXHRzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIik7XG5cdGlkO1xuXHRhYm9ydENvbnRyb2xsZXI7XG5cdGxvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcblx0Y29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG5cdFx0dGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdFx0dGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuXHRcdHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG5cdH1cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuXHR9XG5cdGFib3J0KHJlYXNvbikge1xuXHRcdHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydChyZWFzb24pO1xuXHR9XG5cdGdldCBpc0ludmFsaWQoKSB7XG5cdFx0aWYgKGJyb3dzZXIucnVudGltZT8uaWQgPT0gbnVsbCkgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuXHRcdHJldHVybiB0aGlzLnNpZ25hbC5hYm9ydGVkO1xuXHR9XG5cdGdldCBpc1ZhbGlkKCkge1xuXHRcdHJldHVybiAhdGhpcy5pc0ludmFsaWQ7XG5cdH1cblx0LyoqXG5cdCogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzXG5cdCogaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG5cdCogICBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuXHQqICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGNiKTtcblx0KiAgIH0pO1xuXHQqICAgLy8gLi4uXG5cdCogICByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG5cdCpcblx0KiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG5cdCovXG5cdG9uSW52YWxpZGF0ZWQoY2IpIHtcblx0XHR0aGlzLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHR9XG5cdC8qKlxuXHQqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uXG5cdCogdGhhdCBzaG91bGRuJ3QgcnVuIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgY29uc3QgZ2V0VmFsdWVGcm9tU3RvcmFnZSA9IGFzeW5jICgpID0+IHtcblx0KiAgICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcblx0KlxuXHQqICAgICAvLyAuLi5cblx0KiAgIH07XG5cdCovXG5cdGJsb2NrKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7fSk7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWxcblx0KiB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogSW50ZXJ2YWxzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2xlYXJJbnRlcnZhbGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcblx0XHR9LCB0aW1lb3V0KTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldFRpbWVvdXRgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIFRpbWVvdXRzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgc2V0VGltZW91dGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuXHRcdGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHNcblx0KiB0aGUgcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbEFuaW1hdGlvbkZyYW1lYFxuXHQqIGZ1bmN0aW9uLlxuXHQqL1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlXG5cdCogcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbElkbGVDYWxsYmFja2Bcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuXHRcdGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcblx0XHR9LCBvcHRpb25zKTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG5cdFx0aWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuXHRcdH1cblx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLCBoYW5kbGVyLCB7XG5cdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0c2lnbmFsOiB0aGlzLnNpZ25hbFxuXHRcdH0pO1xuXHR9XG5cdC8qKlxuXHQqIEBpbnRlcm5hbFxuXHQqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuXHQqL1xuXHRub3RpZnlJbnZhbGlkYXRlZCgpIHtcblx0XHR0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcblx0XHRsb2dnZXIuZGVidWcoYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgKTtcblx0fVxuXHRzdG9wT2xkU2NyaXB0cygpIHtcblx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsIHsgZGV0YWlsOiB7XG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0gfSkpO1xuXHRcdGlmICghdGhpcy5vcHRpb25zPy5ub1NjcmlwdFN0YXJ0ZWRQb3N0TWVzc2FnZSkgd2luZG93LnBvc3RNZXNzYWdlKHtcblx0XHRcdHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcblx0XHRcdGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuXHRcdFx0bWVzc2FnZUlkOiB0aGlzLmlkXG5cdFx0fSwgXCIqXCIpO1xuXHR9XG5cdHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuXHRcdGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kZXRhaWw/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdGNvbnN0IGlzRnJvbVNlbGYgPSBldmVudC5kZXRhaWw/Lm1lc3NhZ2VJZCA9PT0gdGhpcy5pZDtcblx0XHRyZXR1cm4gaXNTYW1lQ29udGVudFNjcmlwdCAmJiAhaXNGcm9tU2VsZjtcblx0fVxuXHRsaXN0ZW5Gb3JOZXdlclNjcmlwdHMoKSB7XG5cdFx0Y29uc3QgY2IgPSAoZXZlbnQpID0+IHtcblx0XHRcdGlmICghKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQpIHx8ICF0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHJldHVybjtcblx0XHRcdHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHR9O1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYik7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYikpO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDIsMywxMSwxMiwxMywxNCwxNSwxNl0sIm1hcHBpbmdzIjoiOztDQUNBLFNBQVMsb0JBQW9CLFlBQVk7RUFDeEMsT0FBTztDQUNSOzs7Q0NIQSxJQUFJLElBQUUsT0FBTztDQUFnSEEsSUFBQUEsT0FBRyxHQUFFLEdBQUUsWUFBUTtFQUFDLElBQUcsR0FBRSxNQUFNLEVBQUU7RUFBRyxJQUFHO0dBQUMsT0FBTyxNQUFJLElBQUUsRUFBRSxJQUFFLENBQUMsSUFBRztFQUFDLFNBQU8sR0FBRTtHQUFDLE1BQU0sSUFBRSxDQUFDLENBQUMsR0FBRTtFQUFDO0NBQUM7Q0FBRUMsSUFBQUEsT0FBRyxHQUFFLE1BQUk7RUFBQyxJQUFJLElBQUUsQ0FBQztFQUFFLEtBQUksSUFBSSxLQUFLLEdBQUUsRUFBRSxHQUFFLEdBQUU7R0FBQyxLQUFJLEVBQUU7R0FBRyxZQUFXLENBQUM7RUFBQyxDQUFDO0VBQUUsT0FBTyxLQUFHLEVBQUUsR0FBRSxPQUFPLGFBQVksRUFBQyxPQUFNLFNBQVEsQ0FBQyxHQUFFO0NBQUM7Q0FBNlNDLElBQUFBO0NBQUUsSUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBO0NBQUUsSUFBQTtDQUFFLElBQUEsSUFBRUYsV0FBTztFQUFDLE1BQUUsWUFBVyxVQUFNO0dBQUMsSUFBSSxJQUFFRSxJQUFFLFNBQVMsV0FBU0EsSUFBRSxRQUFRO0dBQVEsSUFBRyxDQUFDLEdBQUUsTUFBTSxNQUFNLG9DQUFvQztHQUFFLE9BQU87RUFBQyxHQUFFLFVBQU07R0FBQyxJQUFJLElBQUVBLElBQUUsU0FBUyxRQUFNQSxJQUFFLFFBQVE7R0FBSyxJQUFHLENBQUMsR0FBRSxNQUFNLE1BQU0scUNBQXFDO0dBQUUsT0FBTztFQUFDLEdBQUUsSUFBRSxZQUFTO0dBQUMsSUFBRyxDQUFDLEtBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO0lBQUMsUUFBTyxDQUFDO0lBQUUsZUFBYyxDQUFDO0dBQUMsQ0FBQztHQUFFLE9BQU87RUFBQyxHQUFFLEtBQUcsR0FBRSxNQUFJLENBQUMsRUFBRSxjQUFZLEVBQUUsV0FBUyxXQUFXLFVBQVEsRUFBRSxLQUFLLFNBQU8sRUFBRSxTQUFPLEVBQUUsWUFBVSxLQUFLLEtBQUcsRUFBRSxLQUFLLFlBQVUsRUFBRTtDQUFRLEVBQUU7OztDQ0Fua0MsSUFBVyxjQUNUOzs7Q0NnREYsSUFBVyxVQUFVLE9BQU8sT0FBTztFQUNqQyxJQUFJLEtBQUs7RUFDVCxJQUFJLFFBQVEsT0FBTyxnQkFBZ0IsSUFBSSxXQUFZLFFBQVEsQ0FBRSxDQUFDO0VBQzlELE9BQU8sUUFDTCxNQUFNLFlBQVksTUFBTSxRQUFRO0VBRWxDLE9BQU87Q0FDVDs7O0NDeERzRixJQUFJQztDQUFFQyxJQUFBQTtDQUFFQyxJQUFBQSxNQUFFQyxXQUFPO0VBQUMsRUFBRSxHQUFFLE9BQUcsR0FBRSxHQUFFLElBQUUsV0FBVyxXQUFTO0dBQUMsSUFBSSxJQUFFLE9BQU0sTUFBRztJQUFDLElBQUksSUFBRTtJQUFFLElBQUdDLEVBQUUsR0FBRSxDQUFDLEtBQUcsQ0FBQyxFQUFFLEtBQUssU0FBUTtLQUFDLElBQUksSUFBRTtNQUFDLE1BQUssRUFBRTtNQUFLLFNBQVEsRUFBRTtNQUFRLE1BQUssRUFBRSxLQUFLO0tBQUksR0FBRSxJQUFFLE1BQU0sSUFBSSxDQUFDO0tBQUUsRUFBRSxZQUFZO01BQUMsTUFBSyxFQUFFO01BQUssU0FBUSxFQUFFO01BQVEsWUFBVyxFQUFFLEtBQUs7TUFBVyxNQUFLO01BQUUsU0FBUSxDQUFDO0tBQUMsR0FBRSxFQUFDLGNBQWEsRUFBRSxnQkFBYyxJQUFHLENBQUM7SUFBQztHQUFDO0dBQUUsT0FBTyxFQUFFLGlCQUFpQixXQUFVLENBQUMsU0FBTSxFQUFFLG9CQUFvQixXQUFVLENBQUM7RUFBQyxHQUFFLE9BQUcsR0FBRSxJQUFFLFdBQVcsV0FBUyxJQUFJLFNBQVMsR0FBRSxNQUFJO0dBQUMsSUFBSSxJQUFFQyxPQUFFLEdBQUUsS0FBRSxNQUFHO0lBQUMsSUFBSSxJQUFFO0lBQUUsRUFBRSxHQUFFLENBQUMsS0FBRyxFQUFFLEtBQUssV0FBUyxFQUFFLEtBQUssZUFBYSxNQUFJLEVBQUUsb0JBQW9CLFdBQVUsQ0FBQyxHQUFFLEVBQUUsRUFBRSxLQUFLLElBQUk7R0FBRTtHQUFFLEVBQUUsaUJBQWlCLFdBQVUsQ0FBQyxHQUFFLEVBQUUsWUFBWTtJQUFDLE1BQUssRUFBRTtJQUFLLE1BQUssRUFBRTtJQUFLLFNBQVEsRUFBRTtJQUFRLFlBQVc7SUFBRSxjQUFhLEVBQUUsZ0JBQWM7R0FBRyxHQUFFLEVBQUMsY0FBYSxFQUFFLGdCQUFjLElBQUcsQ0FBQyxHQUFFLGlCQUFlO0lBQUMsRUFBRSxvQkFBb0IsV0FBVSxDQUFDLEdBQUUsRUFBRSxNQUFNLDhCQUE4QixFQUFFLE1BQU0sQ0FBQztHQUFDLEdBQUUsR0FBRztFQUFDLENBQUM7Q0FBQyxFQUFFO0NBQUUsSUFBRTs7O0NDQXgyQixJQUFJQztDQUFJRSxJQUFBQTtDQUFFQyxJQUFBQSxNQUFFQyxXQUFPO0VBQUMsRUFBRSxHQUFFLGFBQU8sV0FBVywwQkFBd0IsV0FBVyx3Q0FBc0IsSUFBSSxJQUFFLElBQUcsV0FBVyx3QkFBaUcsWUFBTTtHQUFDLElBQUksSUFBRUMsRUFBRTtHQUFFLEVBQUUsVUFBVSxhQUFhLEdBQUUsR0FBRSxNQUFJLEVBQUUsNkJBQTJCLDZCQUEyQixFQUFFLENBQUMsQ0FBQyxHQUFFLENBQUMsRUFBRSxHQUFFLEVBQUUsVUFBVSxhQUFZLE1BQUc7SUFBQyxJQUFJLElBQUVMLElBQUU7SUFBRSxFQUFFLElBQUksRUFBRSxNQUFLLENBQUMsR0FBRSxFQUFFLGFBQWEsa0JBQWdCO0tBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSTtJQUFDLENBQUM7R0FBQyxDQUFDO0VBQUMsR0FBRSxPQUFPLGFBQVcsT0FBSyxXQUFXLFFBQVEsV0FBU0UsSUFBRTtDQUFDLEVBQUU7Q0FBRSxJQUFFOzs7Q0NBcmYsSUFBSUk7Q0FBRUMsSUFBQUEsTUFBRUMsV0FBTztFQUFDLEVBQUUsR0FBRSxPQUFFLE1BQUc7R0FBQyxJQUFJLElBQUUsT0FBTSxHQUFFLEdBQUUsTUFBSTtJQUFDLElBQUc7S0FBQyxNQUFNLElBQUk7TUFBQyxHQUFHO01BQUUsUUFBTztLQUFDLEdBQUUsRUFBQyxPQUFLLE1BQUcsRUFBRSxDQUFDLEVBQUMsQ0FBQztJQUFDLFNBQU8sR0FBRTtLQUFDLFFBQVEsTUFBTSwwQkFBeUIsQ0FBQyxHQUFFLEVBQUUsS0FBSyxDQUFDO0lBQUM7R0FBQyxHQUFFLEtBQUcsR0FBRSxHQUFFLE9BQUssRUFBRSxHQUFFLEdBQUUsQ0FBQyxHQUFFLENBQUMsSUFBRyxJQUFFQyxFQUFFO0dBQUUsT0FBTyxFQUFFLFVBQVUsWUFBWSxDQUFDLFNBQU07SUFBQyxFQUFFLFVBQVUsZUFBZSxDQUFDO0dBQUM7RUFBQztDQUFDLEVBQUU7Q0FBRSxJQUFFOzs7Q0NBdlEsSUFBSUM7Q0FBRUMsSUFBQUE7Q0FBRUMsSUFBQUE7Q0FBRUMsSUFBQUE7Q0FBRUMsSUFBQUE7Q0FBRSxJQUFBLElBQUVDLFdBQU87RUFBQyxFQUFFLEdBQUUsc0JBQUUsSUFBSSxJQUFFLEdBQUUsT0FBRSxNQUFHO0dBQUMsSUFBSSxJQUFFTCxJQUFFLElBQUksQ0FBQztHQUFFLElBQUcsR0FBRSxPQUFPO0dBQUUsSUFBSSxJQUFFTSxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUMsTUFBSyxFQUFDLENBQUM7R0FBRSxPQUFPTixJQUFFLElBQUksR0FBRSxDQUFDLEdBQUU7RUFBQyxHQUFFLE9BQUUsTUFBRztHQUFDLElBQUUsT0FBTyxDQUFDO0VBQUMsR0FBRSxPQUFHLEdBQUUsR0FBRSxNQUFJO0dBQUMsSUFBSSxJQUFFQyxJQUFFLENBQUM7R0FBRSxTQUFTLElBQUc7SUFBQyxJQUFFLENBQUMsR0FBRSxJQUFJO0dBQUM7R0FBQyxJQUFJLElBQUUsT0FBTSxNQUFHO0lBQUMsSUFBRztLQUFDLE1BQU0sRUFBRSxDQUFDO0lBQUMsU0FBTyxHQUFFO0tBQUMsUUFBUSxNQUFNLHVCQUFzQixDQUFDO0lBQUM7R0FBQztHQUFFLE9BQU8sRUFBRSxVQUFVLFlBQVksQ0FBQyxHQUFFLEVBQUUsYUFBYSxZQUFZLENBQUMsR0FBRTtJQUFDLE1BQUs7SUFBRSxrQkFBZTtLQUFDLEVBQUUsVUFBVSxlQUFlLENBQUMsR0FBRSxFQUFFLGFBQWEsZUFBZSxDQUFDO0lBQUM7R0FBQztFQUFDLEdBQUUsT0FBRyxHQUFFLE1BQUk7R0FBQyxJQUFJLElBQUVLLEVBQUUsR0FBRSxJQUFFLE9BQU0sTUFBRztJQUFDLElBQUcsRUFBRSxTQUFPLEdBQUU7SUFBTyxJQUFJLElBQUUsTUFBTSxFQUFF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