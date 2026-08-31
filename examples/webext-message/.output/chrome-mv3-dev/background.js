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
	//#region src/entrypoints/background.ts
	var background_default = defineBackground(() => {
		a$2();
		i();
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
				a({ payload: {
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
	//#region \0virtual:wxt-background-entrypoint?D:/Projects/webext-kit/examples/wxt-demo/src/entrypoints/background.ts
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImkiLCJhIiwiYyIsImkiLCJhIiwibyIsIm4iLCJlIiwiciIsInIiLCJpIiwiYSIsIm8iLCJuIiwidCIsInIiLCJpIiwibiIsInQiLCJyIiwiaSIsImEiLCJvIiwicyIsIm4iLCJ0IiwibiIsInQiLCJpIiwiXyIsInAiLCJsIiwiZCIsIm0iLCJoIiwidiIsInkiLCJuIiwiZSIsInUiLCJmIiwiZyIsImIiLCJ0IiwiYSIsInIiLCJvIiwicyIsImJyb3dzZXIiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvdXRpbHMtMUxDVzZCTXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LW1lc3NhZ2UvZGlzdC9yZWxheS5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvYmFja2dyb3VuZC5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvbWVzc2FnZS5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcG9ydC5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcHViLXN1Yi5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvaW5kZXguanMiLCIuLi8uLi9zcmMvZW50cnlwb2ludHMvYmFja2dyb3VuZC50cyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad2ViZXh0LWNvcmUrbWF0Y2gtcGF0dGVybnNAMi4wLjAvbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwidmFyIGU9T2JqZWN0LmRlZmluZVByb3BlcnR5LHQ9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixuPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLHI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxpPShlLHQsbik9PigpPT57aWYobil0aHJvdyBuWzBdO3RyeXtyZXR1cm4gZSYmKHQ9ZShlPTApKSx0fWNhdGNoKGUpe3Rocm93IG49W2VdLGV9fSxhPSh0LG4pPT57bGV0IHI9e307Zm9yKHZhciBpIGluIHQpZShyLGkse2dldDp0W2ldLGVudW1lcmFibGU6ITB9KTtyZXR1cm4gbnx8ZShyLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6YE1vZHVsZWB9KSxyfSxvPShpLGEsbyxzKT0+e2lmKGEmJnR5cGVvZiBhPT1gb2JqZWN0YHx8dHlwZW9mIGE9PWBmdW5jdGlvbmApZm9yKHZhciBjPW4oYSksbD0wLHU9Yy5sZW5ndGgsZDtsPHU7bCsrKWQ9Y1tsXSwhci5jYWxsKGksZCkmJmQhPT1vJiZlKGksZCx7Z2V0OihlPT5hW2VdKS5iaW5kKG51bGwsZCksZW51bWVyYWJsZTohKHM9dChhLGQpKXx8cy5lbnVtZXJhYmxlfSk7cmV0dXJuIGl9LHM9dD0+ci5jYWxsKHQsYG1vZHVsZS5leHBvcnRzYCk/dFtgbW9kdWxlLmV4cG9ydHNgXTpvKGUoe30sYF9fZXNNb2R1bGVgLHt2YWx1ZTohMH0pLHQpLGMsbCx1LGQsZixwPWkoKCgpPT57Yz1nbG9iYWxUaGlzLGw9KCk9PntsZXQgZT1jLmJyb3dzZXI/LnJ1bnRpbWU/P2MuY2hyb21lPy5ydW50aW1lO2lmKCFlKXRocm93IEVycm9yKGBFeHRlbnNpb24gcnVudGltZSBpcyBub3QgYXZhaWxhYmxlYCk7cmV0dXJuIGV9LHU9KCk9PntsZXQgZT1jLmJyb3dzZXI/LnRhYnM/P2MuY2hyb21lPy50YWJzO2lmKCFlKXRocm93IEVycm9yKGBFeHRlbnNpb24gdGFicyBBUEkgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSxkPWFzeW5jKCk9PntsZXRbZV09YXdhaXQgdSgpLnF1ZXJ5KHthY3RpdmU6ITAsY3VycmVudFdpbmRvdzohMH0pO3JldHVybiBlfSxmPShlLHQpPT4hdC5fX2ludGVybmFsJiZlLnNvdXJjZT09PWdsb2JhbFRoaXMud2luZG93JiZlLmRhdGEubmFtZT09PXQubmFtZSYmKHQucmVsYXlJZD09PXZvaWQgMHx8ZS5kYXRhLnJlbGF5SWQ9PT10LnJlbGF5SWQpfSkpO2V4cG9ydHtmIGFzIGEscyBhcyBjLHAgYXMgaSxsIGFzIG4saSBhcyBvLHUgYXMgcixhIGFzIHMsZCBhcyB0fTsiLCJleHBvcnQgbGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG4iLCJcblxuaW1wb3J0IHsgdXJsQWxwaGFiZXQgfSBmcm9tICcuL3VybC1hbHBoYWJldC9pbmRleC5qcydcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuXG5leHBvcnQgbGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxuXG5leHBvcnQgbGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgZGVmYXVsdFNpemUsIGdldFJhbmRvbSkgPT4ge1xuICBsZXQgc2FmZUJ5dGVDdXRvZmYgPSAyNTYgLSAoMjU2ICUgYWxwaGFiZXQubGVuZ3RoKVxuXG4gIGlmIChzYWZlQnl0ZUN1dG9mZiA9PT0gMjU2KSB7XG4gICAgbGV0IG1hc2sgPSBhbHBoYWJldC5sZW5ndGggLSAxXG5cbiAgICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgICAgaWYgKCFzaXplKSByZXR1cm4gJydcbiAgICAgIGxldCBpZCA9ICcnXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc2l6ZSlcbiAgICAgICAgbGV0IGogPSBzaXplXG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBzdGVwID0gTWF0aC5jZWlsKCgxLjYgKiAyNTYgKiBkZWZhdWx0U2l6ZSkgLyBzYWZlQnl0ZUN1dG9mZilcblxuICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgaWYgKGJ5dGVzW2pdIDwgc2FmZUJ5dGVDdXRvZmYpIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAlIGFscGhhYmV0Lmxlbmd0aF1cbiAgICAgICAgICBpZiAoaWQubGVuZ3RoID49IHNpemUpIHJldHVybiBpZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplIHwgMCwgcmFuZG9tKVxuXG5leHBvcnQgbGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgoc2l6ZSB8PSAwKSkpXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBpZCArPSB1cmxBbHBoYWJldFtieXRlc1tzaXplXSAmIDYzXVxuICB9XG4gIHJldHVybiBpZFxufVxuIiwiaW1wb3J0e2EgYXMgZSxpIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjtpbXBvcnR7bmFub2lkIGFzIHJ9ZnJvbVwibmFub2lkXCI7dmFyIGksYSxvPW4oKCgpPT57dCgpLGk9KHQsbixyPWdsb2JhbFRoaXMud2luZG93KT0+e2xldCBpPWFzeW5jIGk9PntsZXQgYT1pO2lmKGUoYSx0KSYmIWEuZGF0YS5yZWxheWVkKXtsZXQgZT17bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsYm9keTphLmRhdGEuYm9keX0saT1hd2FpdCBuPy4oZSk7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxib2R5OmkscmVsYXllZDohMH0se3RhcmdldE9yaWdpbjp0LnRhcmdldE9yaWdpbnx8YC9gfSl9fTtyZXR1cm4gci5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKSwoKT0+ci5yZW1vdmVFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKX0sYT0odCxuPWdsb2JhbFRoaXMud2luZG93KT0+bmV3IFByb21pc2UoKGksYSk9PntsZXQgbz1yKCkscz1yPT57bGV0IGE9cjtlKGEsdCkmJmEuZGF0YS5yZWxheWVkJiZhLmRhdGEuaW5zdGFuY2VJZD09PW8mJihuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLHMpLGkoYS5kYXRhLmJvZHkpKX07bi5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxzKSxuLnBvc3RNZXNzYWdlKHtuYW1lOnQubmFtZSxib2R5OnQuYm9keSxyZWxheUlkOnQucmVsYXlJZCxpbnN0YW5jZUlkOm8sdGFyZ2V0T3JpZ2luOnQudGFyZ2V0T3JpZ2lufHxgL2B9LHt0YXJnZXRPcmlnaW46dC50YXJnZXRPcmlnaW58fGAvYH0pLHNldFRpbWVvdXQoKCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLHMpLGEoRXJyb3IoYFJlbGF5IHRpbWVvdXQgZm9yIG1lc3NhZ2U6ICR7dC5uYW1lfWApKX0sM2U0KX0pfSkpO28oKTtleHBvcnR7aSBhcyByZWxheSxhIGFzIHNlbmRWaWFSZWxheSxvIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaSxhLG89bigoKCk9PntlKCkscj0oKT0+KGdsb2JhbFRoaXMuX19leHRNZXNzYWdpbmdQb3J0TWFwfHwoZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ1BvcnRNYXA9bmV3IE1hcCksZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ1BvcnRNYXApLGk9ZT0+e2xldCB0PXIoKS5nZXQoZSk7aWYoIXQpdGhyb3cgRXJyb3IoYFBvcnQgJHtlfSBub3QgZm91bmRgKTtyZXR1cm4gdH0sYT0oKT0+e2xldCBlPXQoKTtlLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigoZSx0LG4pPT5lLl9fRVhUX01FU1NBR0lOR19TSUdOQUxfXz09PWBfX0VYVF9NRVNTQUdJTkdfUElOR19fYCYmKG4oITApLCEwKSksZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoZT0+e2xldCB0PXIoKTt0LnNldChlLm5hbWUsZSksZS5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9Pnt0LmRlbGV0ZShlLm5hbWUpfSl9KX0sdHlwZW9mIGdsb2JhbFRoaXM8YHVgJiZnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZSYmYSgpfSkpO28oKTtleHBvcnR7aSBhcyBnZXRQb3J0LHIgYXMgZ2V0UG9ydE1hcCxhIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLG8gYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpPW4oKCgpPT57ZSgpLHI9ZT0+e2xldCBuPWFzeW5jKHQsbixyKT0+e3RyeXthd2FpdCBlPy4oey4uLnQsc2VuZGVyOm59LHtzZW5kOmU9PnIoZSl9KX1jYXRjaChlKXtjb25zb2xlLmVycm9yKGBNZXNzYWdlIGhhbmRsZXIgZXJyb3I6YCxlKSxyKHZvaWQgMCl9fSxyPShlLHQscik9PihuKGUsdCxyKSwhMCksaT10KCk7cmV0dXJuIGkub25NZXNzYWdlLmFkZExpc3RlbmVyKHIpLCgpPT57aS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIocil9fX0pKTtpKCk7ZXhwb3J0e3IgYXMgbGlzdGVuLGkgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtMUxDVzZCTXguanNcIjt2YXIgcixpLGEsbyxzLGM9bigoKCk9PntlKCkscj1uZXcgTWFwLGk9ZT0+e2xldCBuPXIuZ2V0KGUpO2lmKG4pcmV0dXJuIG47bGV0IGk9dCgpLmNvbm5lY3Qoe25hbWU6ZX0pO3JldHVybiByLnNldChlLGkpLGl9LGE9ZT0+e3IuZGVsZXRlKGUpfSxvPShlLHQsbik9PntsZXQgcj1pKGUpO2Z1bmN0aW9uIG8oKXthKGUpLG4/LigpfWxldCBzPWFzeW5jIGU9Pnt0cnl7YXdhaXQgdChlKX1jYXRjaChlKXtjb25zb2xlLmVycm9yKGBQb3J0IGhhbmRsZXIgZXJyb3I6YCxlKX19O3JldHVybiByLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihzKSxyLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcihvKSx7cG9ydDpyLGRpc2Nvbm5lY3Q6KCk9PntyLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihzKSxyLm9uRGlzY29ubmVjdC5yZW1vdmVMaXN0ZW5lcihvKX19fSxzPShlLG4pPT57bGV0IHI9dCgpLGk9YXN5bmMgdD0+e2lmKHQubmFtZSE9PWUpcmV0dXJuO2xldCByPWF3YWl0IG4odCk7cj8ub25NZXNzYWdlJiZ0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyLm9uTWVzc2FnZSksdC5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIoKCk9PntyPy5vbkRpc2Nvbm5lY3Q/LigpfSl9O3JldHVybiByLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihpKSwoKT0+e3Iub25Db25uZWN0LnJlbW92ZUxpc3RlbmVyKGkpfX19KSk7YygpO2V4cG9ydHtpIGFzIGdldFBvcnQsbyBhcyBsaXN0ZW4scyBhcyBvblBvcnRDb25uZWN0LGEgYXMgcmVtb3ZlUG9ydCxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7dmFyIHIsaSxhLG8scz1uKCgoKT0+e2UoKSxyPSgpPT4oZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcHx8KGdsb2JhbFRoaXMuX19leHRNZXNzYWdpbmdIdWJNYXA9bmV3IE1hcCksZ2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcCksaT0oKT0+e2xldCBlPXQoKTtpZighZS5vbkNvbm5lY3RFeHRlcm5hbCl0aHJvdyBFcnJvcihgb25Db25uZWN0RXh0ZXJuYWwgbm90IGF2YWlsYWJsZS4gTmVlZCBleHRlcm5hbGx5X2Nvbm5lY3RhYmxlIGluIG1hbmlmZXN0YCk7Z2xvYmFsVGhpcy5fX2V4dE1lc3NhZ2luZ0h1Yk1hcD1uZXcgTWFwO2xldCBuPXIoKTtlLm9uQ29ubmVjdEV4dGVybmFsLmFkZExpc3RlbmVyKGU9PntsZXQgdD1lLnNlbmRlcj8udGFiPy5pZDt0JiYhbi5oYXModCkmJihuLnNldCh0LGUpLGUub25NZXNzYWdlLmFkZExpc3RlbmVyKGU9PnthKHtmcm9tOnQscGF5bG9hZDplfSl9KSxlLm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKT0+e24uZGVsZXRlKHQpfSkpfSl9LGE9ZT0+e3IoKS5mb3JFYWNoKCh0LG4pPT57biE9PWUuZnJvbSYmdC5wb3N0TWVzc2FnZSh7Li4uZSx0bzpufSl9KX0sbz1lPT57bGV0IG49dD0+e2UodCl9LHI9dCgpO3JldHVybiByLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihuKSwoKT0+e3Iub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKG4pfX19KSk7cygpO2V4cG9ydHthIGFzIGJyb2FkY2FzdCxyIGFzIGdldEh1Yk1hcCxpIGFzIHN0YXJ0SHViLG8gYXMgc3Vic2NyaWJlLHMgYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBuLHIscyBhcyBpLHQgYXMgYX1mcm9tXCIuL3V0aWxzLTFMQ1c2Qk14LmpzXCI7aW1wb3J0e3JlbGF5IGFzIG8sc2VuZFZpYVJlbGF5IGFzIHMsdCBhcyBjfWZyb21cIi4vcmVsYXkuanNcIjtpbXBvcnR7aW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcgYXMgbCx0IGFzIHV9ZnJvbVwiLi9iYWNrZ3JvdW5kLmpzXCI7aW1wb3J0e2xpc3RlbiBhcyBkLHQgYXMgZn1mcm9tXCIuL21lc3NhZ2UuanNcIjtpbXBvcnR7Z2V0UG9ydCBhcyBwLGxpc3RlbiBhcyBtLG9uUG9ydENvbm5lY3QgYXMgaCx0IGFzIGd9ZnJvbVwiLi9wb3J0LmpzXCI7aW1wb3J0e2Jyb2FkY2FzdCBhcyBfLHN0YXJ0SHViIGFzIHYsc3Vic2NyaWJlIGFzIHksdCBhcyBifWZyb21cIi4vcHViLXN1Yi5qc1wiO3ZhciB4PWkoe2Jyb2FkY2FzdDooKT0+XyxnZXRQb3J0OigpPT5wLGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nOigpPT5sLG9uTWVzc2FnZTooKT0+ZCxvblBvcnQ6KCk9Pm0sb25Qb3J0Q29ubmVjdDooKT0+aCxyZWxheTooKT0+RSxyZWxheU1lc3NhZ2U6KCk9PlQsc2VuZFRvQWN0aXZlQ29udGVudFNjcmlwdDooKT0+dyxzZW5kVG9CYWNrZ3JvdW5kOigpPT5TLHNlbmRUb0JhY2tncm91bmRWaWFSZWxheTooKT0+RCxzZW5kVG9Db250ZW50U2NyaXB0OigpPT5DLHNlbmRWaWFSZWxheTooKT0+TyxzdGFydEh1YjooKT0+dixzdWJzY3JpYmU6KCk9Pnl9KSxTLEMsdyxULEUsRCxPLGs9bigoKCk9PntjKCksZSgpLHUoKSxmKCksZygpLGIoKSxTPWFzeW5jIGU9PnQoKS5zZW5kTWVzc2FnZShlLmV4dGVuc2lvbklkPz9udWxsLGUpLEM9YXN5bmMgZT0+e2xldCB0PXR5cGVvZiBlLnRhYklkPT1gbnVtYmVyYD9lLnRhYklkOihhd2FpdCBhKCkpPy5pZDtpZighdCl0aHJvdyBFcnJvcihgTm8gYWN0aXZlIHRhYiBmb3VuZCB0byBzZW5kIG1lc3NhZ2UgdG8uYCk7cmV0dXJuIHIoKS5zZW5kTWVzc2FnZSh0LGUpfSx3PUMsVD1lPT5vKGUsUyksRT1ULEQ9cyxPPUR9KSk7dSgpLGYoKSxnKCksYigpLGsoKTtleHBvcnR7XyBhcyBicm9hZGNhc3QscCBhcyBnZXRQb3J0LGwgYXMgaW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcseCBhcyBuLGQgYXMgb25NZXNzYWdlLG0gYXMgb25Qb3J0LGggYXMgb25Qb3J0Q29ubmVjdCxFIGFzIHJlbGF5LFQgYXMgcmVsYXlNZXNzYWdlLHcgYXMgc2VuZFRvQWN0aXZlQ29udGVudFNjcmlwdCxTIGFzIHNlbmRUb0JhY2tncm91bmQsRCBhcyBzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXksQyBhcyBzZW5kVG9Db250ZW50U2NyaXB0LE8gYXMgc2VuZFZpYVJlbGF5LHYgYXMgc3RhcnRIdWIseSBhcyBzdWJzY3JpYmUsayBhcyB0fTsiLCJpbXBvcnQge1xuXHRpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyxcblx0b25NZXNzYWdlLFxuXHRvblBvcnRDb25uZWN0LFxuXHRzdGFydEh1Yixcblx0YnJvYWRjYXN0LFxufSBmcm9tIFwid2ViZXh0LW1lc3NhZ2VcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG5cdC8vIEluaXRpYWxpemUgYmFja2dyb3VuZCBtZXNzYWdpbmdcblx0aW5pdGlhbGl6ZUJhY2tncm91bmRNZXNzYWdpbmcoKTtcblxuXHQvLyBTdGFydCBwdWItc3ViIGh1YiBmb3IgbXVsdGktdGFiIGNvbW11bmljYXRpb25cblx0c3RhcnRIdWIoKTtcblxuXHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSB3ZWJleHQtbWVzc2FnZSBpbml0aWFsaXplZFwiKTtcblxuXHQvLyBFeGFtcGxlIDE6IFNpbXBsZSBNZXNzYWdlIEhhbmRsZXJcblx0b25NZXNzYWdlPHsgdGV4dDogc3RyaW5nIH0sIHsgc3VjY2VzczogYm9vbGVhbiB9Pihcblx0XHRhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiW0JhY2tncm91bmRdIE1lc3NhZ2UgcmVjZWl2ZWQ6XCIsIHJlcXVlc3QpO1xuXG5cdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcInNpbXBsZS1tZXNzYWdlXCIpIHtcblx0XHRcdFx0Y29uc3QgeyB0ZXh0IH0gPSByZXF1ZXN0LmJvZHkgfHwge307XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0JhY2tncm91bmRdIFByb2Nlc3Npbmc6XCIsIHRleHQpO1xuXG5cdFx0XHRcdC8vIFNpbXVsYXRlIGFzeW5jIG9wZXJhdGlvblxuXHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDApKTtcblxuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHsgc3VjY2VzczogdHJ1ZSB9KTtcblx0XHRcdH1cblx0XHR9LFxuXHQpO1xuXG5cdC8vIEV4YW1wbGUgMjogRWNobyBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7IGVjaG86IHN0cmluZyB9LCB7IGVjaG9lZDogc3RyaW5nIH0+KGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwiZWNoby1tZXNzYWdlXCIpIHtcblx0XHRcdGNvbnN0IHsgZWNobyB9ID0gcmVxdWVzdC5ib2R5IHx8IHt9O1xuXHRcdFx0cmVzcG9uc2Uuc2VuZCh7IGVjaG9lZDogYEVjaG86ICR7ZWNob31gIH0pO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gRXhhbXBsZSAzOiBUYWIgSW5mbyBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7fSwgeyB0YWJJZDogbnVtYmVyOyB1cmw6IHN0cmluZyB8IHVuZGVmaW5lZCB9Pihcblx0XHRhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwiZ2V0LXRhYi1pbmZvXCIgJiYgcmVxdWVzdC5zZW5kZXI/LnRhYikge1xuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHtcblx0XHRcdFx0XHR0YWJJZDogcmVxdWVzdC5zZW5kZXIudGFiLmlkIHx8IDAsXG5cdFx0XHRcdFx0dXJsOiByZXF1ZXN0LnNlbmRlci50YWIudXJsLFxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9LFxuXHQpO1xuXG5cdC8vIEV4YW1wbGUgNDogUG9ydCBDb21tdW5pY2F0aW9uXG5cdGNvbnN0IHBvcnRIYW5kbGVycyA9IG5ldyBNYXA8c3RyaW5nLCAobXNnOiBhbnkpID0+IHZvaWQ+KCk7XG5cblx0b25Qb3J0Q29ubmVjdChcImRlbW8tcG9ydFwiLCBhc3luYyAocG9ydCkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKFwiW0JhY2tncm91bmRdIFBvcnQgY29ubmVjdGVkOlwiLCBwb3J0Lm5hbWUpO1xuXG5cdFx0Y29uc3QgaGFuZGxlUG9ydE1lc3NhZ2UgPSAobXNnOiBhbnkpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKFwiW0JhY2tncm91bmRdIFBvcnQgbWVzc2FnZTpcIiwgbXNnKTtcblxuXHRcdFx0Ly8gRWNobyBiYWNrIHdpdGggdGltZXN0YW1wXG5cdFx0XHRwb3J0LnBvc3RNZXNzYWdlKHtcblx0XHRcdFx0dHlwZTogXCJyZXNwb25zZVwiLFxuXHRcdFx0XHRvcmlnaW5hbDogbXNnLFxuXHRcdFx0XHR0aW1lc3RhbXA6IERhdGUubm93KCksXG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0cG9ydEhhbmRsZXJzLnNldChcImRlbW8tcG9ydFwiLCBoYW5kbGVQb3J0TWVzc2FnZSk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0b25NZXNzYWdlOiBoYW5kbGVQb3J0TWVzc2FnZSxcblx0XHRcdG9uRGlzY29ubmVjdDogKCkgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQb3J0IGRpc2Nvbm5lY3RlZDpcIiwgcG9ydC5uYW1lKTtcblx0XHRcdFx0cG9ydEhhbmRsZXJzLmRlbGV0ZShcImRlbW8tcG9ydFwiKTtcblx0XHRcdH0sXG5cdFx0fTtcblx0fSk7XG5cblx0Ly8gRXhhbXBsZSA1OiBDb21wbGV4IERhdGEgSGFuZGxlclxuXHRpbnRlcmZhY2UgRGF0YVJlcXVlc3Qge1xuXHRcdHR5cGU6IFwiZmV0Y2hcIiB8IFwicHJvY2Vzc1wiIHwgXCJzYXZlXCI7XG5cdFx0cGF5bG9hZDogYW55O1xuXHR9XG5cblx0aW50ZXJmYWNlIERhdGFSZXNwb25zZSB7XG5cdFx0c3RhdHVzOiBcInN1Y2Nlc3NcIiB8IFwiZXJyb3JcIjtcblx0XHRkYXRhPzogYW55O1xuXHRcdGVycm9yPzogc3RyaW5nO1xuXHR9XG5cblx0b25NZXNzYWdlPERhdGFSZXF1ZXN0LCBEYXRhUmVzcG9uc2U+KGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwicHJvY2Vzcy1kYXRhXCIpIHtcblx0XHRcdGNvbnN0IHsgdHlwZSwgcGF5bG9hZCB9ID0gcmVxdWVzdC5ib2R5IHx8IHt9O1xuXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRsZXQgcmVzdWx0O1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiZmV0Y2hcIjpcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHsgZmV0Y2hlZDogdHJ1ZSwgaXRlbXM6IFsxLCAyLCAzXSB9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInByb2Nlc3NcIjpcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHsgcHJvY2Vzc2VkOiBwYXlsb2FkLCBjb3VudDogcGF5bG9hZD8ubGVuZ3RoIHx8IDAgfTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJzYXZlXCI6XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB7IHNhdmVkOiB0cnVlLCBpZDogTWF0aC5yYW5kb20oKSB9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZVwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiByZXN1bHQgfSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHtcblx0XHRcdFx0XHRzdGF0dXM6IFwiZXJyb3JcIixcblx0XHRcdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIlVua25vd24gZXJyb3JcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBFeGFtcGxlIDY6IFB1Yi1TdWIgQnJvYWRjYXN0XG5cdG9uTWVzc2FnZTx7IG1lc3NhZ2U6IHN0cmluZyB9LCB7IGJyb2FkY2FzdElkOiBzdHJpbmcgfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImJyb2FkY2FzdC1tZXNzYWdlXCIpIHtcblx0XHRcdFx0Y29uc3QgYnJvYWRjYXN0SWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyk7XG5cblx0XHRcdFx0Ly8gQnJvYWRjYXN0IHRvIGFsbCBvdGhlciB0YWJzXG5cdFx0XHRcdGJyb2FkY2FzdCh7XG5cdFx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IHJlcXVlc3QuYm9keT8ubWVzc2FnZSxcblx0XHRcdFx0XHRcdGZyb206IHJlcXVlc3Quc2VuZGVyPy50YWI/LmlkLFxuXHRcdFx0XHRcdFx0YnJvYWRjYXN0SWQsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7IGJyb2FkY2FzdElkIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdCk7XG5cblx0Ly8gRXhhbXBsZSA3OiBFcnJvciBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7IHNob3VsZEVycm9yOiBib29sZWFuIH0sIHsgcmVzdWx0Pzogc3RyaW5nIH0+KFxuXHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJ0ZXN0LWVycm9yXCIpIHtcblx0XHRcdFx0aWYgKHJlcXVlc3QuYm9keT8uc2hvdWxkRXJyb3IpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnRlbnRpb25hbCBlcnJvciBmb3IgdGVzdGluZ1wiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyByZXN1bHQ6IFwiU3VjY2VzcyB3aXRob3V0IGVycm9yXCIgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBBbGwgbWVzc2FnZSBoYW5kbGVycyByZWdpc3RlcmVkXCIpO1xufSk7XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiLy8jcmVnaW9uIHNyYy9pbmRleC50c1xuLyoqXG4qIENsYXNzIGZvciBwYXJzaW5nIGFuZCBwZXJmb3JtaW5nIG9wZXJhdGlvbnMgb24gbWF0Y2ggcGF0dGVybnMuXG4qXG4qIEBleGFtcGxlXG4qICAgY29uc3QgcGF0dGVybiA9IG5ldyBNYXRjaFBhdHRlcm4oJyo6Ly9nb29nbGUuY29tLyonKTtcbipcbiogICBwYXR0ZXJuLmluY2x1ZGVzKCdodHRwczovL2dvb2dsZS5jb20nKTsgLy8gdHJ1ZVxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHA6Ly95b3V0dWJlLmNvbS93YXRjaD92PTEyMycpOyAvLyBmYWxzZVxuKi9cbnZhciBNYXRjaFBhdHRlcm4gPSBjbGFzcyBNYXRjaFBhdHRlcm4ge1xuXHRzdGF0aWMge1xuXHRcdHRoaXMuUFJPVE9DT0xTID0gW1xuXHRcdFx0XCJodHRwXCIsXG5cdFx0XHRcImh0dHBzXCIsXG5cdFx0XHRcImZpbGVcIixcblx0XHRcdFwiZnRwXCIsXG5cdFx0XHRcInVyblwiLFxuXHRcdFx0XCJ3c1wiLFxuXHRcdFx0XCJ3c3NcIlxuXHRcdF07XG5cdH1cblx0LyoqXG5cdCogUGFyc2UgYSBtYXRjaCBwYXR0ZXJuIHN0cmluZy4gSWYgaXQgaXMgaW52YWxpZCwgdGhlIGNvbnN0cnVjdG9yIHdpbGwgdGhyb3cgYW5cblx0KiBgSW52YWxpZE1hdGNoUGF0dGVybmAgZXJyb3IuXG5cdCpcblx0KiBAcGFyYW0gbWF0Y2hQYXR0ZXJuIFRoZSBtYXRjaCBwYXR0ZXJuIHRvIHBhcnNlLlxuXHQqL1xuXHRjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcblx0XHRpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuXHRcdFx0dGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uTWF0Y2hQYXR0ZXJuLlBST1RPQ09MU107XG5cdFx0XHR0aGlzLmhvc3RuYW1lTWF0Y2ggPSBcIipcIjtcblx0XHRcdHRoaXMucGF0aG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBncm91cHMgPSAvKC4qKTpcXC9cXC8oLio/KShcXC8uKikvLmV4ZWMobWF0Y2hQYXR0ZXJuKTtcblx0XHRcdGlmIChncm91cHMgPT0gbnVsbCkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBcIkluY29ycmVjdCBmb3JtYXRcIik7XG5cdFx0XHRjb25zdCBbXywgcHJvdG9jb2wsIGhvc3RuYW1lLCBwYXRobmFtZV0gPSBncm91cHM7XG5cdFx0XHR2YWxpZGF0ZVByb3RvY29sKG1hdGNoUGF0dGVybiwgcHJvdG9jb2wpO1xuXHRcdFx0dmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKTtcblx0XHRcdHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG5cdFx0fVxuXHR9XG5cdC8qKiBDaGVjayBpZiBhIFVSTCBpcyBpbmNsdWRlZCBpbiBhIHBhdHRlcm4uICovXG5cdGluY2x1ZGVzKHVybCkge1xuXHRcdGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcblx0XHRpZiAodGhpcy5pc0FsbFVybHMpIHJldHVybiAhdGhpcy5pc1Vua25vd25Qcm90b2NvbCh1KTtcblx0XHRyZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImh0dHBcIikgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIikgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImZpbGVcIikgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG5cdFx0fSk7XG5cdH1cblx0aXNIdHRwTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNIdHRwc01hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSwgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSldO1xuXHRcdGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG5cdFx0cmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuXHR9XG5cdGlzVW5rbm93blByb3RvY29sKHVybCkge1xuXHRcdHJldHVybiAhdGhpcy5wcm90b2NvbE1hdGNoZXMuaW5jbHVkZXModXJsLnByb3RvY29sLnNsaWNlKDAsIC0xKSk7XG5cdH1cblx0aXNQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLnBhdGhuYW1lTWF0Y2gpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKS50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNGaWxlTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJmaWxlOlwiICYmIHRoaXMuaXNQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0Z0cE1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRpc1Vybk1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogdXJuOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRjb252ZXJ0UGF0dGVyblRvUmVnZXgocGF0dGVybikge1xuXHRcdGNvbnN0IHN0YXJzUmVwbGFjZWQgPSB0aGlzLmVzY2FwZUZvclJlZ2V4KHBhdHRlcm4pLnJlcGxhY2UoL1xcXFxcXCovZywgXCIuKlwiKTtcblx0XHRyZXR1cm4gUmVnRXhwKGBeJHtzdGFyc1JlcGxhY2VkfSRgKTtcblx0fVxuXHRlc2NhcGVGb3JSZWdleChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcblx0fVxufTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG5cdFx0c3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcblx0fVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuXHRpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIikgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgJHtwcm90b2NvbH0gbm90IGEgdmFsaWQgcHJvdG9jb2wgKCR7TWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5qb2luKFwiLCBcIil9KWApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKSB7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIjpcIikpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuXHRpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWApO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBJbnZhbGlkTWF0Y2hQYXR0ZXJuLCBNYXRjaFBhdHRlcm4gfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwyLDMsMTEsMTIsMTNdLCJtYXBwaW5ncyI6Ijs7Q0FDQSxTQUFTLGlCQUFpQixLQUFLO0VBQzlCLElBQUksT0FBTyxRQUFRLE9BQU8sUUFBUSxZQUFZLE9BQU8sRUFBRSxNQUFNLElBQUk7RUFDakUsT0FBTztDQUNSOzs7Q0NKQSxJQUFJLElBQUUsT0FBTztDQUFnSEEsSUFBQUEsT0FBRyxHQUFFLEdBQUUsWUFBUTtFQUFDLElBQUcsR0FBRSxNQUFNLEVBQUU7RUFBRyxJQUFHO0dBQUMsT0FBTyxNQUFJLElBQUUsRUFBRSxJQUFFLENBQUMsSUFBRztFQUFDLFNBQU8sR0FBRTtHQUFDLE1BQU0sSUFBRSxDQUFDLENBQUMsR0FBRTtFQUFDO0NBQUM7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LElBQUEsNEJBQUEsSUFBQTtJQUdBLE1BQUEsSUFBQSxTQUFBLFlBQUEsV0FBQSxTQUFBLEdBQUEsQ0FBQTtJQUVBLFNBQUEsS0FBQSxFQUFBLFNBQUEsS0FBQSxDQUFBO0dBQ0Q7RUFDRCxDQUFBO0VBSUQsSUFBQSxPQUFBLFNBQUEsYUFBQTtHQUNDLElBQUEsUUFBQSxTQUFBLGdCQUFBO0lBQ0MsTUFBQSxFQUFBLFNBQUEsUUFBQSxRQUFBLENBQUE7SUFDQSxTQUFBLEtBQUEsRUFBQSxRQUFBLFNBQUEsT0FBQSxDQUFBO0dBQ0Q7RUFDRCxDQUFBO0VBR0EsSUFBQSxPQUFBLFNBQUEsYUFBQTtHQUVFLElBQUEsUUFBQSxTQUFBLGtCQUFBLFFBQUEsUUFBQSxLQUNDLFNBQUEsS0FBQTtJQUNDLE9BQUEsUUFBQSxPQUFBLElBQUEsTUFBQTtJQUNBLEtBQUEsUUFBQSxPQUFBLElBQUE7R0FDRCxDQUFBO0VBRUYsQ0FBQTtFQUlELE1BQUEsK0JBQUEsSUFBQSxJQUFBO0VBRUEsSUFBQSxhQUFBLE9BQUEsU0FBQTtHQUNDLFFBQUEsSUFBQSxnQ0FBQSxLQUFBLElBQUE7R0FFQSxNQUFBLHFCQUFBLFFBQUE7SUFDQyxRQUFBLElBQUEsOEJBQUEsR0FBQTtJQUdBLEtBQUEsWUFBQTtLQUNDLE1BQUE7S0FDQSxVQUFBO0tBQ0EsV0FBQSxLQUFBLElBQUE7SUFDRCxDQUFBO0dBQ0Q7R0FFQSxhQUFBLElBQUEsYUFBQSxpQkFBQTtHQUVBLE9BQUE7SUFDQyxXQUFBO0lBQ0Esb0JBQUE7S0FDQyxRQUFBLElBQUEsbUNBQUEsS0FBQSxJQUFBO0tBQ0EsYUFBQSxPQUFBLFdBQUE7SUFDRDtHQUNEO0VBQ0QsQ0FBQTtFQWNBLElBQUEsT0FBQSxTQUFBLGFBQUE7R0FDQyxJQUFBLFFBQUEsU0FBQSxnQkFBQTtJQUNDLE1BQUEsRUFBQSxNQUFBLFlBQUEsUUFBQSxRQUFBLENBQUE7SUFFQSxJQUFBO0tBQ0MsSUFBQTtLQUNBLFFBQUEsTUFBQTtNQUNDLEtBQUE7T0FDQyxTQUFBO1FBQVcsU0FBQTtRQUFlLE9BQUE7U0FB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