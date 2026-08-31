var background = (function() {
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
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
	//#region src/entrypoints/background.ts
	var background_default = defineBackground(() => {
		r$3();
		a();
		console.log("[Background] webext-message initialized");
		r$2(async (request, response) => {
			console.log("[Background] Message received:", request);
			if (request.name === "simple-message") {
				const { text } = request.body || {};
				console.log("[Background] Processing:", text);
				await new Promise((resolve) => setTimeout(resolve, 100));
				response.send({ success: true });
			}
		});
		r$2(async (request, response) => {
			if (request.name === "echo-message") {
				const { echo } = request.body || {};
				response.send({ echoed: `Echo: ${echo}` });
			}
		});
		r$2(async (request, response) => {
			if (request.name === "get-tab-info" && request.sender?.tab) response.send({
				tabId: request.sender.tab.id || 0,
				url: request.sender.tab.url
			});
		});
		const portHandlers = /* @__PURE__ */ new Map();
		s$1("demo-port", async (port) => {
			console.log("[Background] Port connected:", port.name);
			const handlePortMessage = (msg) => {
				console.log("[Background] Port message:", msg);
				port.postMessage({
					type: "response",
					original: msg,
					timestamp: Date.now()
				});
			};
			portHandlers.set("demo-port", handlePortMessage);
			return {
				onMessage: handlePortMessage,
				onDisconnect: () => {
					console.log("[Background] Port disconnected:", port.name);
					portHandlers.delete("demo-port");
				}
			};
		});
		r$2(async (request, response) => {
			if (request.name === "process-data") {
				const { type, payload } = request.body || {};
				try {
					let result;
					switch (type) {
						case "fetch":
							result = {
								fetched: true,
								items: [
									1,
									2,
									3
								]
							};
							break;
						case "process":
							result = {
								processed: payload,
								count: payload?.length || 0
							};
							break;
						case "save":
							result = {
								saved: true,
								id: Math.random()
							};
							break;
						default: throw new Error("Unknown type");
					}
					response.send({
						status: "success",
						data: result
					});
				} catch (error) {
					response.send({
						status: "error",
						error: error instanceof Error ? error.message : "Unknown error"
					});
				}
			}
		});
		r$2(async (request, response) => {
			if (request.name === "broadcast-message") {
				const broadcastId = Math.random().toString(36).substring(7);
				o({ payload: {
					type: "notification",
					message: request.body?.message,
					from: request.sender?.tab?.id,
					broadcastId
				} });
				response.send({ broadcastId });
			}
		});
		r$2(async (request, response) => {
			if (request.name === "test-error") {
				if (request.body?.shouldError) throw new Error("Intentional error for testing");
				response.send({ result: "Success without error" });
			}
		});
		console.log("[Background] All message handlers registered");
	});
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
	//#region ../../node_modules/.bun/@webext-core+match-patterns@2.0.0/node_modules/@webext-core/match-patterns/dist/index.mjs
	/**
	* Class for parsing and performing operations on match patterns.
	*
	* @example
	*   const pattern = new MatchPattern('*://google.com/*');
	*
	*   pattern.includes('https://google.com'); // true
	*   pattern.includes('http://youtube.com/watch?v=123'); // false
	*/
	var MatchPattern = class MatchPattern {
		static {
			this.PROTOCOLS = [
				"http",
				"https",
				"file",
				"ftp",
				"urn",
				"ws",
				"wss"
			];
		}
		/**
		* Parse a match pattern string. If it is invalid, the constructor will throw an
		* `InvalidMatchPattern` error.
		*
		* @param matchPattern The match pattern to parse.
		*/
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [...MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		/** Check if a URL is included in a pattern. */
		includes(url) {
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			if (this.isAllUrls) return !this.isUnknownProtocol(u);
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isUnknownProtocol(url) {
			return !this.protocolMatches.includes(url.protocol.slice(0, -1));
		}
		isPathMatch(url) {
			if (!this.pathnameMatch) return false;
			return this.convertPatternToRegex(this.pathnameMatch).test(url.pathname);
		}
		isFileMatch(url) {
			return url.protocol === "file:" && this.isPathMatch(url);
		}
		isFtpMatch(_url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(_url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?D:/Projects/webext-kit/examples/webext-message/src/entrypoints/background.ts
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
	var ws;
	/** Connect to the websocket and listen for messages. */
	function getDevServerWebSocket() {
		if (ws == null) {
			const serverUrl = "ws://localhost:3000";
			logger.debug("Connecting to dev server @", serverUrl);
			ws = new WebSocket(serverUrl, "vite-hmr");
			ws.addWxtEventListener = ws.addEventListener.bind(ws);
			ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({
				type: "custom",
				event,
				payload
			}));
			ws.addEventListener("open", () => {
				logger.debug("Connected to dev server");
			});
			ws.addEventListener("close", () => {
				logger.debug("Disconnected from dev server");
			});
			ws.addEventListener("error", (event) => {
				logger.error("Failed to connect to dev server", event);
			});
			ws.addEventListener("message", (e) => {
				try {
					const message = JSON.parse(e.data);
					if (message.type === "custom") ws?.dispatchEvent(new CustomEvent(message.event, { detail: message.data }));
				} catch (err) {
					logger.error("Failed to handle message", err);
				}
			});
		}
		return ws;
	}
	/** https://developer.chrome.com/blog/longer-esw-lifetimes/ */
	function keepServiceWorkerAlive() {
		setInterval(async () => {
			await browser.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const matches = registered.filter((cs) => {
			const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
			const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
			return hasJs || hasCss;
		});
		if (matches.length === 0) {
			logger.log("Content script is not registered yet, nothing to reload", contentScript);
			return;
		}
		await browser.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser.tabs.reload(tab.id);
			} catch (err) {
				logger.warn("Failed to reload tab:", err);
			}
		}));
	}
	async function reloadContentScriptMv2(_payload) {
		throw Error("TODO: reloadContentScriptMv2");
	}
	try {
		const ws = getDevServerWebSocket();
		ws.addWxtEventListener("wxt:reload-extension", () => {
			browser.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser.runtime.reload();
	});
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImkiLCJhIiwiYyIsImkiLCJhIiwibyIsIm4iLCJlIiwiciIsInIiLCJpIiwibiIsInIiLCJpIiwibiIsInQiLCJyIiwiaSIsImEiLCJvIiwicyIsImMiLCJuIiwidCIsIm4iLCJ0IiwiaSIsIl8iLCJwIiwibCIsImQiLCJtIiwiaCIsInYiLCJ5IiwibiIsImUiLCJ1IiwiZiIsImciLCJiIiwidCIsImEiLCJyIiwibyIsInMiLCJicm93c2VyIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCthYTZhOWE0NWEzNzdmYzExL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9kZWZpbmUtYmFja2dyb3VuZC5tanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3V0aWxzLTFMQ1c2Qk14LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcmVsYXkuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2JhY2tncm91bmQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L21lc3NhZ2UuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3BvcnQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3B1Yi1zdWIuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad3h0LWRlditicm93c2VyQDAuMi43L25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L2Jyb3dzZXIubWpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vQHdlYmV4dC1jb3JlK21hdGNoLXBhdHRlcm5zQDIuMC4wL25vZGVfbW9kdWxlcy9Ad2ViZXh0LWNvcmUvbWF0Y2gtcGF0dGVybnMvZGlzdC9pbmRleC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIHNyYy91dGlscy9kZWZpbmUtYmFja2dyb3VuZC50c1xuZnVuY3Rpb24gZGVmaW5lQmFja2dyb3VuZChhcmcpIHtcblx0aWYgKGFyZyA9PSBudWxsIHx8IHR5cGVvZiBhcmcgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHsgbWFpbjogYXJnIH07XG5cdHJldHVybiBhcmc7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGRlZmluZUJhY2tncm91bmQgfTtcbiIsInZhciBlPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSx0PU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Isbj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksaT0oZSx0LG4pPT4oKT0+e2lmKG4pdGhyb3cgblswXTt0cnl7cmV0dXJuIGUmJih0PWUoZT0wKSksdH1jYXRjaChlKXt0aHJvdyBuPVtlXSxlfX0sYT0odCxuKT0+e2xldCByPXt9O2Zvcih2YXIgaSBpbiB0KWUocixpLHtnZXQ6dFtpXSxlbnVtZXJhYmxlOiEwfSk7cmV0dXJuIG58fGUocixTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOmBNb2R1bGVgfSkscn0sbz0oaSxhLG8scyk9PntpZihhJiZ0eXBlb2YgYT09YG9iamVjdGB8fHR5cGVvZiBhPT1gZnVuY3Rpb25gKWZvcih2YXIgYz1uKGEpLGw9MCx1PWMubGVuZ3RoLGQ7bDx1O2wrKylkPWNbbF0sIXIuY2FsbChpLGQpJiZkIT09byYmZShpLGQse2dldDooZT0+YVtlXSkuYmluZChudWxsLGQpLGVudW1lcmFibGU6IShzPXQoYSxkKSl8fHMuZW51bWVyYWJsZX0pO3JldHVybiBpfSxzPXQ9PnIuY2FsbCh0LGBtb2R1bGUuZXhwb3J0c2ApP3RbYG1vZHVsZS5leHBvcnRzYF06byhlKHt9LGBfX2VzTW9kdWxlYCx7dmFsdWU6ITB9KSx0KSxjLGwsdSxkLGYscD1pKCgoKT0+e2M9Z2xvYmFsVGhpcyxsPSgpPT57bGV0IGU9Yy5icm93c2VyPy5ydW50aW1lPz9jLmNocm9tZT8ucnVudGltZTtpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHJ1bnRpbWUgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSx1PSgpPT57bGV0IGU9Yy5icm93c2VyPy50YWJzPz9jLmNocm9tZT8udGFicztpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHRhYnMgQVBJIGlzIG5vdCBhdmFpbGFibGVgKTtyZXR1cm4gZX0sZD1hc3luYygpPT57bGV0W2VdPWF3YWl0IHUoKS5xdWVyeSh7YWN0aXZlOiEwLGN1cnJlbnRXaW5kb3c6ITB9KTtyZXR1cm4gZX0sZj0oZSx0KT0+IXQuX19pbnRlcm5hbCYmZS5zb3VyY2U9PT1nbG9iYWxUaGlzLndpbmRvdyYmZS5kYXRhLm5hbWU9PT10Lm5hbWUmJih0LnJlbGF5SWQ9PT12b2lkIDB8fGUuZGF0YS5yZWxheUlkPT09dC5yZWxheUlkKX0pKTtleHBvcnR7ZiBhcyBhLHMgYXMgYyxwIGFzIGksbCBhcyBuLGkgYXMgbyx1IGFzIHIsYSBhcyBzLGQgYXMgdH07IiwiZXhwb3J0IGxldCB1cmxBbHBoYWJldCA9XG4gICd1c2VhbmRvbS0yNlQxOTgzNDBQWDc1cHhKQUNLVkVSWU1JTkRCVVNIV09MRl9HUVpiZmdoamtscXZ3eXpyaWN0J1xuIiwiXG5cbmltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5cbmV4cG9ydCB7IHVybEFscGhhYmV0IH1cblxuZXhwb3J0IGxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcblxuZXhwb3J0IGxldCBjdXN0b21SYW5kb20gPSAoYWxwaGFiZXQsIGRlZmF1bHRTaXplLCBnZXRSYW5kb20pID0+IHtcbiAgbGV0IHNhZmVCeXRlQ3V0b2ZmID0gMjU2IC0gKDI1NiAlIGFscGhhYmV0Lmxlbmd0aClcblxuICBpZiAoc2FmZUJ5dGVDdXRvZmYgPT09IDI1Nikge1xuICAgIGxldCBtYXNrID0gYWxwaGFiZXQubGVuZ3RoIC0gMVxuXG4gICAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgICBsZXQgaWQgPSAnJ1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHNpemUpXG4gICAgICAgIGxldCBqID0gc2l6ZVxuICAgICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJiBtYXNrXVxuICAgICAgICAgIGlmIChpZC5sZW5ndGggPj0gc2l6ZSkgcmV0dXJuIGlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsZXQgc3RlcCA9IE1hdGguY2VpbCgoMS42ICogMjU2ICogZGVmYXVsdFNpemUpIC8gc2FmZUJ5dGVDdXRvZmYpXG5cbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBpZiAoIXNpemUpIHJldHVybiAnJ1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgbGV0IGogPSBzdGVwXG4gICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgIGlmIChieXRlc1tqXSA8IHNhZmVCeXRlQ3V0b2ZmKSB7XG4gICAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJSBhbHBoYWJldC5sZW5ndGhdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgbGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplID0gMjEpID0+XG4gIGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSB8IDAsIHJhbmRvbSlcblxuZXhwb3J0IGxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBieXRlcyA9IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoKHNpemUgfD0gMCkpKVxuICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgaWQgKz0gdXJsQWxwaGFiZXRbYnl0ZXNbc2l6ZV0gJiA2M11cbiAgfVxuICByZXR1cm4gaWRcbn1cbiIsImltcG9ydHthIGFzIGUsaSBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7aW1wb3J0e25hbm9pZCBhcyByfWZyb21cIm5hbm9pZFwiO3ZhciBpLGEsbz1uKCgoKT0+e3QoKSxpPSh0LG4scj1nbG9iYWxUaGlzLndpbmRvdyk9PntsZXQgaT1hc3luYyBpPT57bGV0IGE9aTtpZihlKGEsdCkmJiFhLmRhdGEucmVsYXllZCl7bGV0IGU9e25hbWU6dC5uYW1lLHJlbGF5SWQ6dC5yZWxheUlkLGJvZHk6YS5kYXRhLmJvZHl9LGk9YXdhaXQgbj8uKGUpLG89dC50YXJnZXRPcmlnaW58fGAvYDtyLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOmEuZGF0YS5pbnN0YW5jZUlkLGJvZHk6aSxyZWxheWVkOiEwfSx7dGFyZ2V0T3JpZ2luOm99KX19O3JldHVybiByLmFkZEV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGkpLCgpPT5yLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGkpfSxhPSh0LG49Z2xvYmFsVGhpcy53aW5kb3cpPT5uZXcgUHJvbWlzZSgoaSxhKT0+e2xldCBvPXIoKSxzPXQudGFyZ2V0T3JpZ2lufHxgL2AsYz1yPT57bGV0IGE9cjtlKGEsdCkmJmEuZGF0YS5yZWxheWVkJiZhLmRhdGEuaW5zdGFuY2VJZD09PW8mJihuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGMpLGkoYS5kYXRhLmJvZHkpKX07bi5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxjKSxuLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxib2R5OnQuYm9keSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOm8sdGFyZ2V0T3JpZ2luOnN9LHt0YXJnZXRPcmlnaW46c30pLHNldFRpbWVvdXQoKCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGMpLGEoRXJyb3IoYFJlbGF5IHRpbWVvdXQgZm9yIG1lc3NhZ2U6ICR7dC5uYW1lfWApKX0sM2U0KX0pfSkpO28oKTtleHBvcnR7aSBhcyByZWxheSxhIGFzIHNlbmRWaWFSZWxheSxvIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaT1uKCgoKT0+e2UoKSxyPSgpPT57dCgpLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigoZSx0LG4pPT5lLl9fRVhUX01FU1NBR0lOR19TSUdOQUxfXz09PWBfX0VYVF9NRVNTQUdJTkdfUElOR19fYCYmKG4oITApLCEwKSl9LHR5cGVvZiBnbG9iYWxUaGlzPGB1YCYmZ2xvYmFsVGhpcy5jaHJvbWU/LnJ1bnRpbWUmJnIoKX0pKTtpKCk7ZXhwb3J0e3IgYXMgaW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcsaSBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG59ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO3ZhciByLGk9bigoKCk9PntlKCkscj1lPT57bGV0IG49YXN5bmModCxuLHIpPT57dHJ5e2F3YWl0IGU/Lih7Li4udCxzZW5kZXI6bn0se3NlbmQ6ZT0+cihlKX0pfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoYE1lc3NhZ2UgaGFuZGxlciBlcnJvcjpgLGUpLHIodm9pZCAwKX19LHI9KGUsdCxyKT0+KG4oZSx0LHIpLCEwKSxpPXQoKTtyZXR1cm4gaS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIociksKCk9PntpLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihyKX19fSkpO2koKTtleHBvcnR7ciBhcyBsaXN0ZW4saSBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG59ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO3ZhciByLGksYSxvLHMsYz1uKCgoKT0+e2UoKSxyPW5ldyBNYXAsaT1lPT57bGV0IG49ci5nZXQoZSk7aWYobilyZXR1cm4gbjtsZXQgaT10KCkuY29ubmVjdCh7bmFtZTplfSk7cmV0dXJuIHIuc2V0KGUsaSksaX0sYT1lPT57ci5kZWxldGUoZSl9LG89KGUsdCxuKT0+e2xldCByPWkoZSk7ZnVuY3Rpb24gbygpe2EoZSksbj8uKCl9bGV0IHM9YXN5bmMgZT0+e3RyeXthd2FpdCB0KGUpfWNhdGNoKGUpe2NvbnNvbGUuZXJyb3IoYFBvcnQgaGFuZGxlciBlcnJvcjpgLGUpfX07cmV0dXJuIHIub25NZXNzYWdlLmFkZExpc3RlbmVyKHMpLHIub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKG8pLHtwb3J0OnIsZGlzY29ubmVjdDooKT0+e3Iub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHMpLHIub25EaXNjb25uZWN0LnJlbW92ZUxpc3RlbmVyKG8pfX19LHM9KGUsbik9PntsZXQgcj10KCksaT1hc3luYyB0PT57aWYodC5uYW1lIT09ZSlyZXR1cm47bGV0IHI9YXdhaXQgbih0KTtyPy5vbk1lc3NhZ2UmJnQub25NZXNzYWdlLmFkZExpc3RlbmVyKHIub25NZXNzYWdlKSx0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKT0+e3I/Lm9uRGlzY29ubmVjdD8uKCl9KX07cmV0dXJuIHIub25Db25uZWN0LmFkZExpc3RlbmVyKGkpLCgpPT57ci5vbkNvbm5lY3QucmVtb3ZlTGlzdGVuZXIoaSl9fX0pKTtjKCk7ZXhwb3J0e2kgYXMgZ2V0UG9ydCxvIGFzIGxpc3RlbixzIGFzIG9uUG9ydENvbm5lY3QsYSBhcyByZW1vdmVQb3J0LGMgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpLGEsbyxzLGM9bigoKCk9PntlKCksaT0oKT0+KHJ8fD1uZXcgTWFwLHIpLGE9KCk9PntsZXQgZT10KCk7aWYoIWUub25Db25uZWN0RXh0ZXJuYWwpdGhyb3cgRXJyb3IoYG9uQ29ubmVjdEV4dGVybmFsIG5vdCBhdmFpbGFibGUuIE5lZWQgZXh0ZXJuYWxseV9jb25uZWN0YWJsZSBpbiBtYW5pZmVzdGApO3I9bmV3IE1hcDtsZXQgbj1pKCk7ZS5vbkNvbm5lY3RFeHRlcm5hbC5hZGRMaXN0ZW5lcihlPT57bGV0IHQ9ZS5zZW5kZXI/LnRhYj8uaWQ7dCYmIW4uaGFzKHQpJiYobi5zZXQodCxlKSxlLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihlPT57byh7ZnJvbTp0LHBheWxvYWQ6ZX0pfSksZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9PntuLmRlbGV0ZSh0KX0pKX0pfSxvPWU9PntpKCkuZm9yRWFjaCgodCxuKT0+e24hPT1lLmZyb20mJnQucG9zdE1lc3NhZ2Uoey4uLmUsdG86bn0pfSl9LHM9ZT0+e2xldCBuPXQ9PntlKHQpfSxyPXQoKTtyZXR1cm4gci5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobiksKCk9PntyLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihuKX19fSkpO2MoKTtleHBvcnR7byBhcyBicm9hZGNhc3QsaSBhcyBnZXRIdWJNYXAsYSBhcyBzdGFydEh1YixzIGFzIHN1YnNjcmliZSxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbixyLHMgYXMgaSx0IGFzIGF9ZnJvbVwiLi91dGlscy0xTENXNkJNeC5qc1wiO2ltcG9ydHtyZWxheSBhcyBvLHNlbmRWaWFSZWxheSBhcyBzLHQgYXMgY31mcm9tXCIuL3JlbGF5LmpzXCI7aW1wb3J0e2luaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nIGFzIGwsdCBhcyB1fWZyb21cIi4vYmFja2dyb3VuZC5qc1wiO2ltcG9ydHtsaXN0ZW4gYXMgZCx0IGFzIGZ9ZnJvbVwiLi9tZXNzYWdlLmpzXCI7aW1wb3J0e2dldFBvcnQgYXMgcCxsaXN0ZW4gYXMgbSxvblBvcnRDb25uZWN0IGFzIGgsdCBhcyBnfWZyb21cIi4vcG9ydC5qc1wiO2ltcG9ydHticm9hZGNhc3QgYXMgXyxzdGFydEh1YiBhcyB2LHN1YnNjcmliZSBhcyB5LHQgYXMgYn1mcm9tXCIuL3B1Yi1zdWIuanNcIjt2YXIgeD1pKHticm9hZGNhc3Q6KCk9Pl8sZ2V0UG9ydDooKT0+cCxpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZzooKT0+bCxvbk1lc3NhZ2U6KCk9PmQsb25Qb3J0OigpPT5tLG9uUG9ydENvbm5lY3Q6KCk9PmgscmVsYXk6KCk9PkUscmVsYXlNZXNzYWdlOigpPT5ULHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQ6KCk9Pncsc2VuZFRvQmFja2dyb3VuZDooKT0+UyxzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXk6KCk9PkQsc2VuZFRvQ29udGVudFNjcmlwdDooKT0+QyxzZW5kVmlhUmVsYXk6KCk9Pk8sc3RhcnRIdWI6KCk9PnYsc3Vic2NyaWJlOigpPT55fSksUyxDLHcsVCxFLEQsTyxrPW4oKCgpPT57YygpLGUoKSx1KCksZigpLGcoKSxiKCksUz1hc3luYyBlPT50KCkuc2VuZE1lc3NhZ2UoZS5leHRlbnNpb25JZD8/bnVsbCxlKSxDPWFzeW5jIGU9PntsZXQgdD10eXBlb2YgZS50YWJJZD09YG51bWJlcmA/ZS50YWJJZDooYXdhaXQgYSgpKT8uaWQ7aWYoIXQpdGhyb3cgRXJyb3IoYE5vIGFjdGl2ZSB0YWIgZm91bmQgdG8gc2VuZCBtZXNzYWdlIHRvLmApO3JldHVybiByKCkuc2VuZE1lc3NhZ2UodCxlKX0sdz1DLFQ9ZT0+byhlLFMpLEU9VCxEPXMsTz1EfSkpO3UoKSxmKCksZygpLGIoKSxrKCk7ZXhwb3J0e18gYXMgYnJvYWRjYXN0LHAgYXMgZ2V0UG9ydCxsIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLHggYXMgbixkIGFzIG9uTWVzc2FnZSxtIGFzIG9uUG9ydCxoIGFzIG9uUG9ydENvbm5lY3QsRSBhcyByZWxheSxUIGFzIHJlbGF5TWVzc2FnZSx3IGFzIHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQsUyBhcyBzZW5kVG9CYWNrZ3JvdW5kLEQgYXMgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5LEMgYXMgc2VuZFRvQ29udGVudFNjcmlwdCxPIGFzIHNlbmRWaWFSZWxheSx2IGFzIHN0YXJ0SHViLHkgYXMgc3Vic2NyaWJlLGsgYXMgdH07IiwiaW1wb3J0IHtcblx0aW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcsXG5cdG9uTWVzc2FnZSxcblx0b25Qb3J0Q29ubmVjdCxcblx0c3RhcnRIdWIsXG5cdGJyb2FkY2FzdCxcbn0gZnJvbSBcIndlYmV4dC1tZXNzYWdlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xuXHQvLyBJbml0aWFsaXplIGJhY2tncm91bmQgbWVzc2FnaW5nXG5cdGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nKCk7XG5cblx0Ly8gU3RhcnQgcHViLXN1YiBodWIgZm9yIG11bHRpLXRhYiBjb21tdW5pY2F0aW9uXG5cdHN0YXJ0SHViKCk7XG5cblx0Y29uc29sZS5sb2coXCJbQmFja2dyb3VuZF0gd2ViZXh0LW1lc3NhZ2UgaW5pdGlhbGl6ZWRcIik7XG5cblx0Ly8gRXhhbXBsZSAxOiBTaW1wbGUgTWVzc2FnZSBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7IHRleHQ6IHN0cmluZyB9LCB7IHN1Y2Nlc3M6IGJvb2xlYW4gfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBNZXNzYWdlIHJlY2VpdmVkOlwiLCByZXF1ZXN0KTtcblxuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJzaW1wbGUtbWVzc2FnZVwiKSB7XG5cdFx0XHRcdGNvbnN0IHsgdGV4dCB9ID0gcmVxdWVzdC5ib2R5IHx8IHt9O1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQcm9jZXNzaW5nOlwiLCB0ZXh0KTtcblxuXHRcdFx0XHQvLyBTaW11bGF0ZSBhc3luYyBvcGVyYXRpb25cblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSk7XG5cblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7IHN1Y2Nlc3M6IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDI6IEVjaG8gSGFuZGxlclxuXHRvbk1lc3NhZ2U8eyBlY2hvOiBzdHJpbmcgfSwgeyBlY2hvZWQ6IHN0cmluZyB9Pihhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImVjaG8tbWVzc2FnZVwiKSB7XG5cdFx0XHRjb25zdCB7IGVjaG8gfSA9IHJlcXVlc3QuYm9keSB8fCB7fTtcblx0XHRcdHJlc3BvbnNlLnNlbmQoeyBlY2hvZWQ6IGBFY2hvOiAke2VjaG99YCB9KTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEV4YW1wbGUgMzogVGFiIEluZm8gSGFuZGxlclxuXHRvbk1lc3NhZ2U8e30sIHsgdGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWQgfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImdldC10YWItaW5mb1wiICYmIHJlcXVlc3Quc2VuZGVyPy50YWIpIHtcblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7XG5cdFx0XHRcdFx0dGFiSWQ6IHJlcXVlc3Quc2VuZGVyLnRhYi5pZCB8fCAwLFxuXHRcdFx0XHRcdHVybDogcmVxdWVzdC5zZW5kZXIudGFiLnVybCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDQ6IFBvcnQgQ29tbXVuaWNhdGlvblxuXHRjb25zdCBwb3J0SGFuZGxlcnMgPSBuZXcgTWFwPHN0cmluZywgKG1zZzogYW55KSA9PiB2b2lkPigpO1xuXG5cdG9uUG9ydENvbm5lY3QoXCJkZW1vLXBvcnRcIiwgYXN5bmMgKHBvcnQpID0+IHtcblx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQb3J0IGNvbm5lY3RlZDpcIiwgcG9ydC5uYW1lKTtcblxuXHRcdGNvbnN0IGhhbmRsZVBvcnRNZXNzYWdlID0gKG1zZzogYW55KSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQb3J0IG1lc3NhZ2U6XCIsIG1zZyk7XG5cblx0XHRcdC8vIEVjaG8gYmFjayB3aXRoIHRpbWVzdGFtcFxuXHRcdFx0cG9ydC5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0b3JpZ2luYWw6IG1zZyxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHBvcnRIYW5kbGVycy5zZXQoXCJkZW1vLXBvcnRcIiwgaGFuZGxlUG9ydE1lc3NhZ2UpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG9uTWVzc2FnZTogaGFuZGxlUG9ydE1lc3NhZ2UsXG5cdFx0XHRvbkRpc2Nvbm5lY3Q6ICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQmFja2dyb3VuZF0gUG9ydCBkaXNjb25uZWN0ZWQ6XCIsIHBvcnQubmFtZSk7XG5cdFx0XHRcdHBvcnRIYW5kbGVycy5kZWxldGUoXCJkZW1vLXBvcnRcIik7XG5cdFx0XHR9LFxuXHRcdH07XG5cdH0pO1xuXG5cdC8vIEV4YW1wbGUgNTogQ29tcGxleCBEYXRhIEhhbmRsZXJcblx0aW50ZXJmYWNlIERhdGFSZXF1ZXN0IHtcblx0XHR0eXBlOiBcImZldGNoXCIgfCBcInByb2Nlc3NcIiB8IFwic2F2ZVwiO1xuXHRcdHBheWxvYWQ6IGFueTtcblx0fVxuXG5cdGludGVyZmFjZSBEYXRhUmVzcG9uc2Uge1xuXHRcdHN0YXR1czogXCJzdWNjZXNzXCIgfCBcImVycm9yXCI7XG5cdFx0ZGF0YT86IGFueTtcblx0XHRlcnJvcj86IHN0cmluZztcblx0fVxuXG5cdG9uTWVzc2FnZTxEYXRhUmVxdWVzdCwgRGF0YVJlc3BvbnNlPihhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcInByb2Nlc3MtZGF0YVwiKSB7XG5cdFx0XHRjb25zdCB7IHR5cGUsIHBheWxvYWQgfSA9IHJlcXVlc3QuYm9keSB8fCB7fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IHJlc3VsdDtcblx0XHRcdFx0c3dpdGNoICh0eXBlKSB7XG5cdFx0XHRcdFx0Y2FzZSBcImZldGNoXCI6XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB7IGZldGNoZWQ6IHRydWUsIGl0ZW1zOiBbMSwgMiwgM10gfTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJwcm9jZXNzXCI6XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB7IHByb2Nlc3NlZDogcGF5bG9hZCwgY291bnQ6IHBheWxvYWQ/Lmxlbmd0aCB8fCAwIH07XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwic2F2ZVwiOlxuXHRcdFx0XHRcdFx0cmVzdWx0ID0geyBzYXZlZDogdHJ1ZSwgaWQ6IE1hdGgucmFuZG9tKCkgfTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHR5cGVcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogcmVzdWx0IH0pO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7XG5cdFx0XHRcdFx0c3RhdHVzOiBcImVycm9yXCIsXG5cdFx0XHRcdFx0ZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogXCJVbmtub3duIGVycm9yXCIsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Ly8gRXhhbXBsZSA2OiBQdWItU3ViIEJyb2FkY2FzdFxuXHRvbk1lc3NhZ2U8eyBtZXNzYWdlOiBzdHJpbmcgfSwgeyBicm9hZGNhc3RJZDogc3RyaW5nIH0+KFxuXHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJicm9hZGNhc3QtbWVzc2FnZVwiKSB7XG5cdFx0XHRcdGNvbnN0IGJyb2FkY2FzdElkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpO1xuXG5cdFx0XHRcdC8vIEJyb2FkY2FzdCB0byBhbGwgb3RoZXIgdGFic1xuXHRcdFx0XHRicm9hZGNhc3Qoe1xuXHRcdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwibm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiByZXF1ZXN0LmJvZHk/Lm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRmcm9tOiByZXF1ZXN0LnNlbmRlcj8udGFiPy5pZCxcblx0XHRcdFx0XHRcdGJyb2FkY2FzdElkLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBicm9hZGNhc3RJZCB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHQpO1xuXG5cdC8vIEV4YW1wbGUgNzogRXJyb3IgSGFuZGxlclxuXHRvbk1lc3NhZ2U8eyBzaG91bGRFcnJvcjogYm9vbGVhbiB9LCB7IHJlc3VsdD86IHN0cmluZyB9Pihcblx0XHRhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwidGVzdC1lcnJvclwiKSB7XG5cdFx0XHRcdGlmIChyZXF1ZXN0LmJvZHk/LnNob3VsZEVycm9yKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW50ZW50aW9uYWwgZXJyb3IgZm9yIHRlc3RpbmdcIik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHsgcmVzdWx0OiBcIlN1Y2Nlc3Mgd2l0aG91dCBlcnJvclwiIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdCk7XG5cblx0Y29uc29sZS5sb2coXCJbQmFja2dyb3VuZF0gQWxsIG1lc3NhZ2UgaGFuZGxlcnMgcmVnaXN0ZXJlZFwiKTtcbn0pO1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsIi8vI3JlZ2lvbiBzcmMvaW5kZXgudHNcbi8qKlxuKiBDbGFzcyBmb3IgcGFyc2luZyBhbmQgcGVyZm9ybWluZyBvcGVyYXRpb25zIG9uIG1hdGNoIHBhdHRlcm5zLlxuKlxuKiBAZXhhbXBsZVxuKiAgIGNvbnN0IHBhdHRlcm4gPSBuZXcgTWF0Y2hQYXR0ZXJuKCcqOi8vZ29vZ2xlLmNvbS8qJyk7XG4qXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cHM6Ly9nb29nbGUuY29tJyk7IC8vIHRydWVcbiogICBwYXR0ZXJuLmluY2x1ZGVzKCdodHRwOi8veW91dHViZS5jb20vd2F0Y2g/dj0xMjMnKTsgLy8gZmFsc2VcbiovXG52YXIgTWF0Y2hQYXR0ZXJuID0gY2xhc3MgTWF0Y2hQYXR0ZXJuIHtcblx0c3RhdGljIHtcblx0XHR0aGlzLlBST1RPQ09MUyA9IFtcblx0XHRcdFwiaHR0cFwiLFxuXHRcdFx0XCJodHRwc1wiLFxuXHRcdFx0XCJmaWxlXCIsXG5cdFx0XHRcImZ0cFwiLFxuXHRcdFx0XCJ1cm5cIixcblx0XHRcdFwid3NcIixcblx0XHRcdFwid3NzXCJcblx0XHRdO1xuXHR9XG5cdC8qKlxuXHQqIFBhcnNlIGEgbWF0Y2ggcGF0dGVybiBzdHJpbmcuIElmIGl0IGlzIGludmFsaWQsIHRoZSBjb25zdHJ1Y3RvciB3aWxsIHRocm93IGFuXG5cdCogYEludmFsaWRNYXRjaFBhdHRlcm5gIGVycm9yLlxuXHQqXG5cdCogQHBhcmFtIG1hdGNoUGF0dGVybiBUaGUgbWF0Y2ggcGF0dGVybiB0byBwYXJzZS5cblx0Ki9cblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG5cdFx0aWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcblx0XHRcdHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcblx0XHRcdHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLk1hdGNoUGF0dGVybi5QUk9UT0NPTFNdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBcIipcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZ3JvdXBzID0gLyguKik6XFwvXFwvKC4qPykoXFwvLiopLy5leGVjKG1hdGNoUGF0dGVybik7XG5cdFx0XHRpZiAoZ3JvdXBzID09IG51bGwpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgXCJJbmNvcnJlY3QgZm9ybWF0XCIpO1xuXHRcdFx0Y29uc3QgW18sIHByb3RvY29sLCBob3N0bmFtZSwgcGF0aG5hbWVdID0gZ3JvdXBzO1xuXHRcdFx0dmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKTtcblx0XHRcdHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSk7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IHByb3RvY29sID09PSBcIipcIiA/IFtcImh0dHBcIiwgXCJodHRwc1wiXSA6IFtwcm90b2NvbF07XG5cdFx0XHR0aGlzLmhvc3RuYW1lTWF0Y2ggPSBob3N0bmFtZTtcblx0XHRcdHRoaXMucGF0aG5hbWVNYXRjaCA9IHBhdGhuYW1lO1xuXHRcdH1cblx0fVxuXHQvKiogQ2hlY2sgaWYgYSBVUkwgaXMgaW5jbHVkZWQgaW4gYSBwYXR0ZXJuLiAqL1xuXHRpbmNsdWRlcyh1cmwpIHtcblx0XHRjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybCBpbnN0YW5jZW9mIExvY2F0aW9uID8gbmV3IFVSTCh1cmwuaHJlZikgOiB1cmw7XG5cdFx0aWYgKHRoaXMuaXNBbGxVcmxzKSByZXR1cm4gIXRoaXMuaXNVbmtub3duUHJvdG9jb2wodSk7XG5cdFx0cmV0dXJuICEhdGhpcy5wcm90b2NvbE1hdGNoZXMuZmluZCgocHJvdG9jb2wpID0+IHtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwXCIpIHJldHVybiB0aGlzLmlzSHR0cE1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImh0dHBzXCIpIHJldHVybiB0aGlzLmlzSHR0cHNNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmaWxlXCIpIHJldHVybiB0aGlzLmlzRmlsZU1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImZ0cFwiKSByZXR1cm4gdGhpcy5pc0Z0cE1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcInVyblwiKSByZXR1cm4gdGhpcy5pc1Vybk1hdGNoKHUpO1xuXHRcdH0pO1xuXHR9XG5cdGlzSHR0cE1hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cDpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSHR0cHNNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHBzOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNIb3N0UGF0aE1hdGNoKHVybCkge1xuXHRcdGlmICghdGhpcy5ob3N0bmFtZU1hdGNoIHx8ICF0aGlzLnBhdGhuYW1lTWF0Y2gpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW3RoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaCksIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXTtcblx0XHRjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuXHRcdHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc1Vua25vd25Qcm90b2NvbCh1cmwpIHtcblx0XHRyZXR1cm4gIXRoaXMucHJvdG9jb2xNYXRjaGVzLmluY2x1ZGVzKHVybC5wcm90b2NvbC5zbGljZSgwLCAtMSkpO1xuXHR9XG5cdGlzUGF0aE1hdGNoKHVybCkge1xuXHRcdGlmICghdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCkudGVzdCh1cmwucGF0aG5hbWUpO1xuXHR9XG5cdGlzRmlsZU1hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiZmlsZTpcIiAmJiB0aGlzLmlzUGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNGdHBNYXRjaChfdXJsKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IGZ0cDovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG5cdH1cblx0aXNVcm5NYXRjaChfdXJsKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IHVybjovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG5cdH1cblx0Y29udmVydFBhdHRlcm5Ub1JlZ2V4KHBhdHRlcm4pIHtcblx0XHRjb25zdCBzdGFyc1JlcGxhY2VkID0gdGhpcy5lc2NhcGVGb3JSZWdleChwYXR0ZXJuKS5yZXBsYWNlKC9cXFxcXFwqL2csIFwiLipcIik7XG5cdFx0cmV0dXJuIFJlZ0V4cChgXiR7c3RhcnNSZXBsYWNlZH0kYCk7XG5cdH1cblx0ZXNjYXBlRm9yUmVnZXgoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG5cdH1cbn07XG52YXIgSW52YWxpZE1hdGNoUGF0dGVybiA9IGNsYXNzIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4sIHJlYXNvbikge1xuXHRcdHN1cGVyKGBJbnZhbGlkIG1hdGNoIHBhdHRlcm4gXCIke21hdGNoUGF0dGVybn1cIjogJHtyZWFzb259YCk7XG5cdH1cbn07XG5mdW5jdGlvbiB2YWxpZGF0ZVByb3RvY29sKG1hdGNoUGF0dGVybiwgcHJvdG9jb2wpIHtcblx0aWYgKCFNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmluY2x1ZGVzKHByb3RvY29sKSAmJiBwcm90b2NvbCAhPT0gXCIqXCIpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYCR7cHJvdG9jb2x9IG5vdCBhIHZhbGlkIHByb3RvY29sICgke01hdGNoUGF0dGVybi5QUk9UT0NPTFMuam9pbihcIiwgXCIpfSlgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSkge1xuXHRpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYElmIHVzaW5nIGEgd2lsZGNhcmQgKCopLCBpdCBtdXN0IGdvIGF0IHRoZSBzdGFydCBvZiB0aGUgaG9zdG5hbWVgKTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgSW52YWxpZE1hdGNoUGF0dGVybiwgTWF0Y2hQYXR0ZXJuIH07XG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMiwzLDExLDEyLDEzXSwibWFwcGluZ3MiOiI7O0NBQ0EsU0FBUyxpQkFBaUIsS0FBSztFQUM5QixJQUFJLE9BQU8sUUFBUSxPQUFPLFFBQVEsWUFBWSxPQUFPLEVBQUUsTUFBTSxJQUFJO0VBQ2pFLE9BQU87Q0FDUjs7O0NDSkEsSUFBSSxJQUFFLE9BQU87Q0FBZ0hBLElBQUFBLE9BQUcsR0FBRSxHQUFFLFlBQVE7RUFBQyxJQUFHLEdBQUUsTUFBTSxFQUFFO0VBQUcsSUFBRztHQUFDLE9BQU8sTUFBSSxJQUFFLEVBQUUsSUFBRSxDQUFDLElBQUc7RUFBQyxTQUFPLEdBQUU7R0FBQyxNQUFNLElBQUUsQ0FBQyxDQUFDLEdBQUU7RUFBQztDQUFDO0NBQUVDLElBQUFBLE9BQUcsR0FBRSxNQUFJO0VBQUMsSUFBSSxJQUFFLENBQUM7RUFBRSxLQUFJLElBQUksS0FBSyxHQUFFLEVBQUUsR0FBRSxHQUFFO0dBQUMsS0FBSSxFQUFFO0dBQUcsWUFBVyxDQUFDO0VBQUMsQ0FBQztFQUFFLE9BQU8sS0FBRyxFQUFFLEdBQUUsT0FBTyxhQUFZLEVBQUMsT0FBTSxTQUFRLENBQUMsR0FBRTtDQUFDO0NBQTZTQyxJQUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBO0NBQUUsSUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBLElBQUVGLFdBQU87RUFBQyxNQUFFLFlBQVcsVUFBTTtHQUFDLElBQUksSUFBRUUsSUFBRSxTQUFTLFdBQVNBLElBQUUsUUFBUTtHQUFRLElBQUcsQ0FBQyxHQUFFLE1BQU0sTUFBTSxvQ0FBb0M7R0FBRSxPQUFPO0VBQUMsR0FBRSxVQUFNO0dBQUMsSUFBSSxJQUFFQSxJQUFFLFNBQVMsUUFBTUEsSUFBRSxRQUFRO0dBQUssSUFBRyxDQUFDLEdBQUUsTUFBTSxNQUFNLHFDQUFxQztHQUFFLE9BQU87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QUFDLENBQUM7SUFBQyxTQUFPLEdBQUU7S0FBQyxRQUFRLE1BQU0sMEJBQXlCLENBQUMsR0FBRSxFQUFFLEtBQUssQ0FBQztJQUFDO0dBQUMsR0FBRSxLQUFHLEdBQUUsR0FBRSxPQUFLLEVBQUUsR0FBRSxHQUFFLENBQUMsR0FBRSxDQUFDLElBQUcsSUFBRUMsRUFBRTtHQUFFLE9BQU8sRUFBRSxVQUFVLFlBQVksQ0FBQyxTQUFNO0lBQUMsRUFBRSxVQUFVLGVBQWUsQ0FBQztHQUFDO0VBQUM7Q0FBQyxFQUFFO0NBQUUsSUFBRTs7O0NDQXZRLElBQUlDO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBO0NBQUVDLElBQUFBLE1BQUVDLFdBQU87RUFBQyxFQUFFLEdBQUUsc0JBQUUsSUFBSSxJQUFFLEdBQUUsT0FBRSxNQUFHO0dBQUMsSUFBSSxJQUFFTixJQUFFLElBQUksQ0FBQztHQUFFLElBQUcsR0FBRSxPQUFPO0dBQUUsSUFBSSxJQUFFTyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUMsTUFBSyxFQUFDLENBQUM7R0FBRSxPQUFPUCxJQUFFLElBQUksR0FBRSxDQUFDLEdBQUU7RUFBQyxHQUFFLE9BQUUsTUFBRztHQUFDLElBQUUsT0FBTyxDQUFDO0VBQUMsR0FBRSxPQUFHLEdBQUUsR0FBRSxNQUFJO0dBQUMsSUFBSSxJQUFFQyxJQUFFLENBQUM7R0FBRSxTQUFTLElBQUc7SUFBQyxJQUFFLENBQUMsR0FBRSxJQUFJO0dBQUM7R0FBQyxJQUFJLElBQUUsT0FBTSxNQUFHO0lBQUMsSUFBRztLQUFDLE1BQU0sRUFBRSxDQUFDO0lBQUMsU0FBTyxHQUFFO0tBQUMsUUFBUSxNQUFNLHVCQUFzQixDQUFDO0lBQUM7R0FBQztHQUFFLE9BQU8sRUFBRSxVQUFVLFlBQVksQ0FBQyxHQUFFLEVBQUUsYUFBYSxZQUFZLENBQUMsR0FBRTtJQUFDLE1BQUs7SUFBRSxrQkFBZTtLQUFDLEVBQUUsVUFBVSxlQUFlLENBQUMsR0FBRSxFQUFFLGFBQWEsZUFBZSxDQUFDO0lBQUM7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