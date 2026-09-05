var background = (function() {
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
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
	//#region ../../packages/webext-message/dist/utils-CcSyhl8X.js
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
		}, f = (e, t) => {
			let n = !t.targetOrigin || t.targetOrigin === `/` ? window.location.origin : t.targetOrigin;
			return !t.__internal && e.source === globalThis.window && (n === `*` || e.origin === void 0 || e.origin === n) && e.data.name === t.name && (t.relayId === void 0 || e.data.relayId === t.relayId);
		};
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
						requestId: a.data.requestId,
						body: a.data.body
					}, i = t.targetOrigin || `/`;
					try {
						let o = await n?.(e);
						r.postMessage({
							name: t.name,
							relayId: t.relayId,
							instanceId: a.data.instanceId,
							body: o,
							relayed: !0
						}, { targetOrigin: i });
					} catch (e) {
						r.postMessage({
							name: t.name,
							relayId: t.relayId,
							instanceId: a.data.instanceId,
							error: e instanceof Error ? e.message : String(e),
							relayed: !0
						}, { targetOrigin: i });
					}
				}
			};
			return r.addEventListener(`message`, i), () => r.removeEventListener(`message`, i);
		}, a$2 = (t, n = globalThis.window) => new Promise((i, a) => {
			let o = nanoid(), s = t.requestId || nanoid(8), c = t.targetOrigin || `/`, l = t.timeoutMs ?? 3e4, u = () => {
				n.removeEventListener(`message`, d), clearTimeout(f$1);
			}, d = (n) => {
				let r = n;
				f(r, t) && r.data.relayed && r.data.instanceId === o && (u(), r.data.error ? a(Error(`Relay error: ${r.data.error}`)) : i(r.data.body));
			};
			n.addEventListener(`message`, d), n.postMessage({
				name: t.name,
				body: t.body,
				relayId: t.relayId,
				requestId: s,
				instanceId: o,
				targetOrigin: c
			}, { targetOrigin: c });
			let f$1 = setTimeout(() => {
				u(), a(Error(`Relay timeout for message: ${t.name}`));
			}, l);
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
				if (t.name === e) try {
					let r = await n(t);
					r?.onMessage && t.onMessage.addListener(r.onMessage), t.onDisconnect.addListener(() => {
						try {
							r?.onDisconnect?.();
						} catch (t) {
							console.error(`Port disconnect handler error for '${e}':`, t);
						}
					});
				} catch (n) {
					console.error(`Port connect handler error for '${e}':`, n), t.disconnect();
				}
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
		DEFAULT_MESSAGE_TIMEOUT_MS: () => C,
		broadcast: () => o,
		getActiveTab: () => d,
		getPort: () => i$1,
		initializeBackgroundMessaging: () => r$3,
		onMessage: () => r$2,
		onPort: () => o$1,
		onPortConnect: () => s$1,
		relay: () => k,
		relayMessage: () => O,
		sendToActiveContentScript: () => D,
		sendToBackground: () => T,
		sendToBackgroundViaRelay: () => A,
		sendToContentScript: () => E,
		sendViaRelay: () => j,
		startHub: () => a,
		subscribe: () => s
	});
	var C;
	var w;
	var T;
	var E;
	var D;
	var O;
	var k;
	var A;
	var j;
	var M = i$5((() => {
		o$2(), p(), i$3(), i$2(), c$1(), c(), C = 3e4, w = (e, t, n) => {
			let r;
			return Promise.race([e.finally(() => clearTimeout(r)), new Promise((e, i) => {
				r = setTimeout(() => i(Error(`Message '${t}' timed out after ${n}ms`)), n);
			})]);
		}, T = async (e) => {
			let n = {
				...e,
				requestId: e.requestId || nanoid(8)
			};
			return w(l().sendMessage(e.extensionId ?? null, n), String(e.name), e.timeoutMs ?? 3e4);
		}, E = async (e) => {
			let t = typeof e.tabId == `number` ? e.tabId : (await d())?.id;
			if (!t) throw Error(`No active tab found to send message to.`);
			let n = {
				...e,
				requestId: e.requestId || nanoid(8)
			};
			return w(u().sendMessage(t, n), String(e.name), e.timeoutMs ?? 3e4);
		}, D = E, O = (e) => i$4(e, T), k = O, A = a$2, j = A;
	}));
	p(), i$3(), i$2(), c$1(), c(), M();
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
		r$2(async (request, response) => {
			if (request.name === "relay-to-content") {
				const { tabId, message } = request.body || {};
				if (tabId) await E({
					tabId,
					name: "content-notify-popup",
					body: { message: message || "" }
				});
				response.send({ relayed: true });
			}
		});
		const latestNotifications = {
			options: null,
			popup: null
		};
		r$2(async (request, response) => {
			if (request.name === "open-and-notify") {
				const target = request.body?.target;
				const message = request.body?.message || "";
				if (target === "options" || target === "popup") {
					latestNotifications[target] = {
						message,
						timestamp: Date.now()
					};
					if (target === "options") try {
						await browser.runtime.openOptionsPage();
					} catch (error) {
						console.error("[Background] Failed to open options page:", error);
					}
					else try {
						await browser.action.openPopup();
					} catch (error) {
						console.warn("[Background] action.openPopup() isn't supported here:", error);
					}
					o({ payload: {
						type: "notification",
						target,
						...latestNotifications[target]
					} });
				}
				response.send({ opened: true });
			}
		});
		r$2(async (request, response) => {
			if (request.name === "get-latest-notification") {
				const target = request.body?.target;
				response.send(target ? latestNotifications[target] : null);
			}
		});
		console.log("[Background] All message handlers registered");
	});
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJpIiwiYSIsImMiLCJpIiwiYSIsIm8iLCJuIiwiZSIsInIiLCJmIiwiciIsImkiLCJuIiwiciIsImkiLCJuIiwidCIsInIiLCJpIiwiYSIsIm8iLCJzIiwiYyIsIm4iLCJ0IiwibiIsInQiLCJpIiwiXyIsImEiLCJwIiwibCIsImQiLCJtIiwiaCIsInYiLCJ5IiwibiIsImUiLCJ1IiwiZiIsImciLCJiIiwieCIsInQiLCJyIiwibyIsInMiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3V0aWxzLUNjU3lobDhYLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvdXJsLWFscGhhYmV0L2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vbmFub2lkQDYuMC4xL25vZGVfbW9kdWxlcy9uYW5vaWQvaW5kZXguYnJvd3Nlci5qcyIsIi4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcmVsYXkuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2JhY2tncm91bmQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L21lc3NhZ2UuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3BvcnQuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L3B1Yi1zdWIuanMiLCIuLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtbWVzc2FnZS9kaXN0L2luZGV4LmpzIiwiLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad2ViZXh0LWNvcmUrbWF0Y2gtcGF0dGVybnNAMi4wLjAvbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsInZhciBlPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSx0PU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Isbj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksaT0oZSx0LG4pPT4oKT0+e2lmKG4pdGhyb3cgblswXTt0cnl7cmV0dXJuIGUmJih0PWUoZT0wKSksdH1jYXRjaChlKXt0aHJvdyBuPVtlXSxlfX0sYT0odCxuKT0+e2xldCByPXt9O2Zvcih2YXIgaSBpbiB0KWUocixpLHtnZXQ6dFtpXSxlbnVtZXJhYmxlOiEwfSk7cmV0dXJuIG58fGUocixTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOmBNb2R1bGVgfSkscn0sbz0oaSxhLG8scyk9PntpZihhJiZ0eXBlb2YgYT09YG9iamVjdGB8fHR5cGVvZiBhPT1gZnVuY3Rpb25gKWZvcih2YXIgYz1uKGEpLGw9MCx1PWMubGVuZ3RoLGQ7bDx1O2wrKylkPWNbbF0sIXIuY2FsbChpLGQpJiZkIT09byYmZShpLGQse2dldDooZT0+YVtlXSkuYmluZChudWxsLGQpLGVudW1lcmFibGU6IShzPXQoYSxkKSl8fHMuZW51bWVyYWJsZX0pO3JldHVybiBpfSxzPXQ9PnIuY2FsbCh0LGBtb2R1bGUuZXhwb3J0c2ApP3RbYG1vZHVsZS5leHBvcnRzYF06byhlKHt9LGBfX2VzTW9kdWxlYCx7dmFsdWU6ITB9KSx0KSxjLGwsdSxkLGYscD1pKCgoKT0+e2M9Z2xvYmFsVGhpcyxsPSgpPT57bGV0IGU9Yy5icm93c2VyPy5ydW50aW1lPz9jLmNocm9tZT8ucnVudGltZTtpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHJ1bnRpbWUgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSx1PSgpPT57bGV0IGU9Yy5icm93c2VyPy50YWJzPz9jLmNocm9tZT8udGFicztpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHRhYnMgQVBJIGlzIG5vdCBhdmFpbGFibGVgKTtyZXR1cm4gZX0sZD1hc3luYygpPT57bGV0W2VdPWF3YWl0IHUoKS5xdWVyeSh7YWN0aXZlOiEwLGN1cnJlbnRXaW5kb3c6ITB9KTtyZXR1cm4gZX0sZj0oZSx0KT0+e2xldCBuPSF0LnRhcmdldE9yaWdpbnx8dC50YXJnZXRPcmlnaW49PT1gL2A/d2luZG93LmxvY2F0aW9uLm9yaWdpbjp0LnRhcmdldE9yaWdpbjtyZXR1cm4hdC5fX2ludGVybmFsJiZlLnNvdXJjZT09PWdsb2JhbFRoaXMud2luZG93JiYobj09PWAqYHx8ZS5vcmlnaW49PT12b2lkIDB8fGUub3JpZ2luPT09bikmJmUuZGF0YS5uYW1lPT09dC5uYW1lJiYodC5yZWxheUlkPT09dm9pZCAwfHxlLmRhdGEucmVsYXlJZD09PXQucmVsYXlJZCl9fSkpO2V4cG9ydHtmIGFzIGEscyBhcyBjLHAgYXMgaSxsIGFzIG4saSBhcyBvLHUgYXMgcixhIGFzIHMsZCBhcyB0fTsiLCJleHBvcnQgbGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG4iLCJcblxuaW1wb3J0IHsgdXJsQWxwaGFiZXQgfSBmcm9tICcuL3VybC1hbHBoYWJldC9pbmRleC5qcydcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuXG5leHBvcnQgbGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxuXG5leHBvcnQgbGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgZGVmYXVsdFNpemUsIGdldFJhbmRvbSkgPT4ge1xuICBsZXQgc2FmZUJ5dGVDdXRvZmYgPSAyNTYgLSAoMjU2ICUgYWxwaGFiZXQubGVuZ3RoKVxuXG4gIGlmIChzYWZlQnl0ZUN1dG9mZiA9PT0gMjU2KSB7XG4gICAgbGV0IG1hc2sgPSBhbHBoYWJldC5sZW5ndGggLSAxXG5cbiAgICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgICAgaWYgKCFzaXplKSByZXR1cm4gJydcbiAgICAgIGxldCBpZCA9ICcnXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc2l6ZSlcbiAgICAgICAgbGV0IGogPSBzaXplXG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBzdGVwID0gTWF0aC5jZWlsKCgxLjYgKiAyNTYgKiBkZWZhdWx0U2l6ZSkgLyBzYWZlQnl0ZUN1dG9mZilcblxuICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgaWYgKGJ5dGVzW2pdIDwgc2FmZUJ5dGVDdXRvZmYpIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAlIGFscGhhYmV0Lmxlbmd0aF1cbiAgICAgICAgICBpZiAoaWQubGVuZ3RoID49IHNpemUpIHJldHVybiBpZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplIHwgMCwgcmFuZG9tKVxuXG5leHBvcnQgbGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgoc2l6ZSB8PSAwKSkpXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBpZCArPSB1cmxBbHBoYWJldFtieXRlc1tzaXplXSAmIDYzXVxuICB9XG4gIHJldHVybiBpZFxufVxuIiwiaW1wb3J0e2EgYXMgZSxpIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjtpbXBvcnR7bmFub2lkIGFzIHJ9ZnJvbVwibmFub2lkXCI7dmFyIGksYSxvPW4oKCgpPT57dCgpLGk9KHQsbixyPWdsb2JhbFRoaXMud2luZG93KT0+e2xldCBpPWFzeW5jIGk9PntsZXQgYT1pO2lmKGUoYSx0KSYmIWEuZGF0YS5yZWxheWVkKXtsZXQgZT17bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQscmVxdWVzdElkOmEuZGF0YS5yZXF1ZXN0SWQsYm9keTphLmRhdGEuYm9keX0saT10LnRhcmdldE9yaWdpbnx8YC9gO3RyeXtsZXQgbz1hd2FpdCBuPy4oZSk7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxib2R5Om8scmVsYXllZDohMH0se3RhcmdldE9yaWdpbjppfSl9Y2F0Y2goZSl7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxlcnJvcjplIGluc3RhbmNlb2YgRXJyb3I/ZS5tZXNzYWdlOlN0cmluZyhlKSxyZWxheWVkOiEwfSx7dGFyZ2V0T3JpZ2luOml9KX19fTtyZXR1cm4gci5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKSwoKT0+ci5yZW1vdmVFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKX0sYT0odCxuPWdsb2JhbFRoaXMud2luZG93KT0+bmV3IFByb21pc2UoKGksYSk9PntsZXQgbz1yKCkscz10LnJlcXVlc3RJZHx8cig4KSxjPXQudGFyZ2V0T3JpZ2lufHxgL2AsbD10LnRpbWVvdXRNcz8/M2U0LHU9KCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGQpLGNsZWFyVGltZW91dChmKX0sZD1uPT57bGV0IHI9bjtlKHIsdCkmJnIuZGF0YS5yZWxheWVkJiZyLmRhdGEuaW5zdGFuY2VJZD09PW8mJih1KCksci5kYXRhLmVycm9yP2EoRXJyb3IoYFJlbGF5IGVycm9yOiAke3IuZGF0YS5lcnJvcn1gKSk6aShyLmRhdGEuYm9keSkpfTtuLmFkZEV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGQpLG4ucG9zdE1lc3NhZ2Uoe25hbWU6dC5uYW1lLGJvZHk6dC5ib2R5LHJlbGF5SWQ6dC5yZWxheUlkLHJlcXVlc3RJZDpzLGluc3RhbmNlSWQ6byx0YXJnZXRPcmlnaW46Y30se3RhcmdldE9yaWdpbjpjfSk7bGV0IGY9c2V0VGltZW91dCgoKT0+e3UoKSxhKEVycm9yKGBSZWxheSB0aW1lb3V0IGZvciBtZXNzYWdlOiAke3QubmFtZX1gKSl9LGwpfSl9KSk7bygpO2V4cG9ydHtpIGFzIHJlbGF5LGEgYXMgc2VuZFZpYVJlbGF5LG8gYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjt2YXIgcixpPW4oKCgpPT57ZSgpLHI9KCk9Pnt0KCkub25NZXNzYWdlLmFkZExpc3RlbmVyKChlLHQsbik9PmUuX19FWFRfTUVTU0FHSU5HX1NJR05BTF9fPT09YF9fRVhUX01FU1NBR0lOR19QSU5HX19gJiYobighMCksITApKX0sdHlwZW9mIGdsb2JhbFRoaXM8YHVgJiZnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZSYmcigpfSkpO2koKTtleHBvcnR7ciBhcyBpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyxpIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaT1uKCgoKT0+e2UoKSxyPWU9PntsZXQgbj1hc3luYyh0LG4scik9Pnt0cnl7YXdhaXQgZT8uKHsuLi50LHNlbmRlcjpufSx7c2VuZDplPT5yKGUpfSl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgTWVzc2FnZSBoYW5kbGVyIGVycm9yOmAsZSkscih2b2lkIDApfX0scj0oZSx0LHIpPT4obihlLHQsciksITApLGk9dCgpO3JldHVybiBpLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyKSwoKT0+e2kub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHIpfX19KSk7aSgpO2V4cG9ydHtyIGFzIGxpc3RlbixpIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaSxhLG8scyxjPW4oKCgpPT57ZSgpLHI9bmV3IE1hcCxpPWU9PntsZXQgbj1yLmdldChlKTtpZihuKXJldHVybiBuO2xldCBpPXQoKS5jb25uZWN0KHtuYW1lOmV9KTtyZXR1cm4gci5zZXQoZSxpKSxpfSxhPWU9PntyLmRlbGV0ZShlKX0sbz0oZSx0LG4pPT57bGV0IHI9aShlKTtmdW5jdGlvbiBvKCl7YShlKSxuPy4oKX1sZXQgcz1hc3luYyBlPT57dHJ5e2F3YWl0IHQoZSl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgUG9ydCBoYW5kbGVyIGVycm9yOmAsZSl9fTtyZXR1cm4gci5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIocyksci5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIobykse3BvcnQ6cixkaXNjb25uZWN0OigpPT57ci5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIocyksci5vbkRpc2Nvbm5lY3QucmVtb3ZlTGlzdGVuZXIobyl9fX0scz0oZSxuKT0+e2xldCByPXQoKSxpPWFzeW5jIHQ9PntpZih0Lm5hbWU9PT1lKXRyeXtsZXQgcj1hd2FpdCBuKHQpO3I/Lm9uTWVzc2FnZSYmdC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoci5vbk1lc3NhZ2UpLHQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpPT57dHJ5e3I/Lm9uRGlzY29ubmVjdD8uKCl9Y2F0Y2godCl7Y29uc29sZS5lcnJvcihgUG9ydCBkaXNjb25uZWN0IGhhbmRsZXIgZXJyb3IgZm9yICcke2V9JzpgLHQpfX0pfWNhdGNoKG4pe2NvbnNvbGUuZXJyb3IoYFBvcnQgY29ubmVjdCBoYW5kbGVyIGVycm9yIGZvciAnJHtlfSc6YCxuKSx0LmRpc2Nvbm5lY3QoKX19O3JldHVybiByLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihpKSwoKT0+e3Iub25Db25uZWN0LnJlbW92ZUxpc3RlbmVyKGkpfX19KSk7YygpO2V4cG9ydHtpIGFzIGdldFBvcnQsbyBhcyBsaXN0ZW4scyBhcyBvblBvcnRDb25uZWN0LGEgYXMgcmVtb3ZlUG9ydCxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaSxhLG8scyxjPW4oKCgpPT57ZSgpLGk9KCk9PihyfHw9bmV3IE1hcCxyKSxhPSgpPT57bGV0IGU9dCgpO2lmKCFlLm9uQ29ubmVjdEV4dGVybmFsKXRocm93IEVycm9yKGBvbkNvbm5lY3RFeHRlcm5hbCBub3QgYXZhaWxhYmxlLiBOZWVkIGV4dGVybmFsbHlfY29ubmVjdGFibGUgaW4gbWFuaWZlc3RgKTtyPW5ldyBNYXA7bGV0IG49aSgpO2Uub25Db25uZWN0RXh0ZXJuYWwuYWRkTGlzdGVuZXIoZT0+e2xldCB0PWUuc2VuZGVyPy50YWI/LmlkO3QmJiFuLmhhcyh0KSYmKG4uc2V0KHQsZSksZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZT0+e28oe2Zyb206dCxwYXlsb2FkOmV9KX0pLGUub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpPT57bi5kZWxldGUodCl9KSl9KX0sbz1lPT57aSgpLmZvckVhY2goKHQsbik9PntuIT09ZS5mcm9tJiZ0LnBvc3RNZXNzYWdlKHsuLi5lLHRvOm59KX0pfSxzPWU9PntsZXQgbj10PT57ZSh0KX0scj10KCk7cmV0dXJuIHIub25NZXNzYWdlLmFkZExpc3RlbmVyKG4pLCgpPT57ci5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobil9fX0pKTtjKCk7ZXhwb3J0e28gYXMgYnJvYWRjYXN0LGkgYXMgZ2V0SHViTWFwLGEgYXMgc3RhcnRIdWIscyBhcyBzdWJzY3JpYmUsYyBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG4scixzIGFzIGksdCBhcyBhfWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjtpbXBvcnR7cmVsYXkgYXMgbyxzZW5kVmlhUmVsYXkgYXMgcyx0IGFzIGN9ZnJvbVwiLi9yZWxheS5qc1wiO2ltcG9ydHtpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyBhcyBsLHQgYXMgdX1mcm9tXCIuL2JhY2tncm91bmQuanNcIjtpbXBvcnR7bGlzdGVuIGFzIGQsdCBhcyBmfWZyb21cIi4vbWVzc2FnZS5qc1wiO2ltcG9ydHtnZXRQb3J0IGFzIHAsbGlzdGVuIGFzIG0sb25Qb3J0Q29ubmVjdCBhcyBoLHQgYXMgZ31mcm9tXCIuL3BvcnQuanNcIjtpbXBvcnR7YnJvYWRjYXN0IGFzIF8sc3RhcnRIdWIgYXMgdixzdWJzY3JpYmUgYXMgeSx0IGFzIGJ9ZnJvbVwiLi9wdWItc3ViLmpzXCI7aW1wb3J0e25hbm9pZCBhcyB4fWZyb21cIm5hbm9pZFwiO3ZhciBTPWkoe0RFRkFVTFRfTUVTU0FHRV9USU1FT1VUX01TOigpPT5DLGJyb2FkY2FzdDooKT0+XyxnZXRBY3RpdmVUYWI6KCk9PmEsZ2V0UG9ydDooKT0+cCxpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZzooKT0+bCxvbk1lc3NhZ2U6KCk9PmQsb25Qb3J0OigpPT5tLG9uUG9ydENvbm5lY3Q6KCk9PmgscmVsYXk6KCk9PmsscmVsYXlNZXNzYWdlOigpPT5PLHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQ6KCk9PkQsc2VuZFRvQmFja2dyb3VuZDooKT0+VCxzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXk6KCk9PkEsc2VuZFRvQ29udGVudFNjcmlwdDooKT0+RSxzZW5kVmlhUmVsYXk6KCk9Pmosc3RhcnRIdWI6KCk9PnYsc3Vic2NyaWJlOigpPT55fSksQyx3LFQsRSxELE8sayxBLGosTT1uKCgoKT0+e2MoKSxlKCksdSgpLGYoKSxnKCksYigpLEM9M2U0LHc9KGUsdCxuKT0+e2xldCByO3JldHVybiBQcm9taXNlLnJhY2UoW2UuZmluYWxseSgoKT0+Y2xlYXJUaW1lb3V0KHIpKSxuZXcgUHJvbWlzZSgoZSxpKT0+e3I9c2V0VGltZW91dCgoKT0+aShFcnJvcihgTWVzc2FnZSAnJHt0fScgdGltZWQgb3V0IGFmdGVyICR7bn1tc2ApKSxuKX0pXSl9LFQ9YXN5bmMgZT0+e2xldCBuPXsuLi5lLHJlcXVlc3RJZDplLnJlcXVlc3RJZHx8eCg4KX07cmV0dXJuIHcodCgpLnNlbmRNZXNzYWdlKGUuZXh0ZW5zaW9uSWQ/P251bGwsbiksU3RyaW5nKGUubmFtZSksZS50aW1lb3V0TXM/PzNlNCl9LEU9YXN5bmMgZT0+e2xldCB0PXR5cGVvZiBlLnRhYklkPT1gbnVtYmVyYD9lLnRhYklkOihhd2FpdCBhKCkpPy5pZDtpZighdCl0aHJvdyBFcnJvcihgTm8gYWN0aXZlIHRhYiBmb3VuZCB0byBzZW5kIG1lc3NhZ2UgdG8uYCk7bGV0IG49ey4uLmUscmVxdWVzdElkOmUucmVxdWVzdElkfHx4KDgpfTtyZXR1cm4gdyhyKCkuc2VuZE1lc3NhZ2UodCxuKSxTdHJpbmcoZS5uYW1lKSxlLnRpbWVvdXRNcz8/M2U0KX0sRD1FLE89ZT0+byhlLFQpLGs9TyxBPXMsaj1BfSkpO2UoKSx1KCksZigpLGcoKSxiKCksTSgpO2V4cG9ydHtDIGFzIERFRkFVTFRfTUVTU0FHRV9USU1FT1VUX01TLF8gYXMgYnJvYWRjYXN0LGEgYXMgZ2V0QWN0aXZlVGFiLHAgYXMgZ2V0UG9ydCxsIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLFMgYXMgbixkIGFzIG9uTWVzc2FnZSxtIGFzIG9uUG9ydCxoIGFzIG9uUG9ydENvbm5lY3QsayBhcyByZWxheSxPIGFzIHJlbGF5TWVzc2FnZSxEIGFzIHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQsVCBhcyBzZW5kVG9CYWNrZ3JvdW5kLEEgYXMgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5LEUgYXMgc2VuZFRvQ29udGVudFNjcmlwdCxqIGFzIHNlbmRWaWFSZWxheSx2IGFzIHN0YXJ0SHViLHkgYXMgc3Vic2NyaWJlLE0gYXMgdH07IiwiaW1wb3J0IHtcblx0YnJvYWRjYXN0LFxuXHRpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyxcblx0b25NZXNzYWdlLFxuXHRvblBvcnRDb25uZWN0LFxuXHRzZW5kVG9Db250ZW50U2NyaXB0LFxuXHRzdGFydEh1Yixcbn0gZnJvbSBcIndlYmV4dC1tZXNzYWdlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xuXHQvLyBJbml0aWFsaXplIGJhY2tncm91bmQgbWVzc2FnaW5nXG5cdGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nKCk7XG5cblx0Ly8gU3RhcnQgcHViLXN1YiBodWIgZm9yIG11bHRpLXRhYiBjb21tdW5pY2F0aW9uXG5cdHN0YXJ0SHViKCk7XG5cblx0Y29uc29sZS5sb2coXCJbQmFja2dyb3VuZF0gd2ViZXh0LW1lc3NhZ2UgaW5pdGlhbGl6ZWRcIik7XG5cblx0Ly8gRXhhbXBsZSAxOiBTaW1wbGUgTWVzc2FnZSBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7IHRleHQ6IHN0cmluZyB9LCB7IHN1Y2Nlc3M6IGJvb2xlYW4gfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBNZXNzYWdlIHJlY2VpdmVkOlwiLCByZXF1ZXN0KTtcblxuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJzaW1wbGUtbWVzc2FnZVwiKSB7XG5cdFx0XHRcdGNvbnN0IHsgdGV4dCB9ID0gcmVxdWVzdC5ib2R5IHx8IHt9O1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQcm9jZXNzaW5nOlwiLCB0ZXh0KTtcblxuXHRcdFx0XHQvLyBTaW11bGF0ZSBhc3luYyBvcGVyYXRpb25cblx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSk7XG5cblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7IHN1Y2Nlc3M6IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDI6IEVjaG8gSGFuZGxlclxuXHRvbk1lc3NhZ2U8eyBlY2hvOiBzdHJpbmcgfSwgeyBlY2hvZWQ6IHN0cmluZyB9Pihhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImVjaG8tbWVzc2FnZVwiKSB7XG5cdFx0XHRjb25zdCB7IGVjaG8gfSA9IHJlcXVlc3QuYm9keSB8fCB7fTtcblx0XHRcdHJlc3BvbnNlLnNlbmQoeyBlY2hvZWQ6IGBFY2hvOiAke2VjaG99YCB9KTtcblx0XHR9XG5cdH0pO1xuXG5cdC8vIEV4YW1wbGUgMzogVGFiIEluZm8gSGFuZGxlclxuXHRvbk1lc3NhZ2U8e30sIHsgdGFiSWQ6IG51bWJlcjsgdXJsOiBzdHJpbmcgfCB1bmRlZmluZWQgfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImdldC10YWItaW5mb1wiICYmIHJlcXVlc3Quc2VuZGVyPy50YWIpIHtcblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7XG5cdFx0XHRcdFx0dGFiSWQ6IHJlcXVlc3Quc2VuZGVyLnRhYi5pZCB8fCAwLFxuXHRcdFx0XHRcdHVybDogcmVxdWVzdC5zZW5kZXIudGFiLnVybCxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDQ6IFBvcnQgQ29tbXVuaWNhdGlvblxuXHRjb25zdCBwb3J0SGFuZGxlcnMgPSBuZXcgTWFwPHN0cmluZywgKG1zZzogYW55KSA9PiB2b2lkPigpO1xuXG5cdG9uUG9ydENvbm5lY3QoXCJkZW1vLXBvcnRcIiwgYXN5bmMgKHBvcnQpID0+IHtcblx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQb3J0IGNvbm5lY3RlZDpcIiwgcG9ydC5uYW1lKTtcblxuXHRcdGNvbnN0IGhhbmRsZVBvcnRNZXNzYWdlID0gKG1zZzogYW55KSA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBQb3J0IG1lc3NhZ2U6XCIsIG1zZyk7XG5cblx0XHRcdC8vIEVjaG8gYmFjayB3aXRoIHRpbWVzdGFtcFxuXHRcdFx0cG9ydC5wb3N0TWVzc2FnZSh7XG5cdFx0XHRcdHR5cGU6IFwicmVzcG9uc2VcIixcblx0XHRcdFx0b3JpZ2luYWw6IG1zZyxcblx0XHRcdFx0dGltZXN0YW1wOiBEYXRlLm5vdygpLFxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdHBvcnRIYW5kbGVycy5zZXQoXCJkZW1vLXBvcnRcIiwgaGFuZGxlUG9ydE1lc3NhZ2UpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdG9uTWVzc2FnZTogaGFuZGxlUG9ydE1lc3NhZ2UsXG5cdFx0XHRvbkRpc2Nvbm5lY3Q6ICgpID0+IHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQmFja2dyb3VuZF0gUG9ydCBkaXNjb25uZWN0ZWQ6XCIsIHBvcnQubmFtZSk7XG5cdFx0XHRcdHBvcnRIYW5kbGVycy5kZWxldGUoXCJkZW1vLXBvcnRcIik7XG5cdFx0XHR9LFxuXHRcdH07XG5cdH0pO1xuXG5cdC8vIEV4YW1wbGUgNTogQ29tcGxleCBEYXRhIEhhbmRsZXJcblx0aW50ZXJmYWNlIERhdGFSZXF1ZXN0IHtcblx0XHR0eXBlOiBcImZldGNoXCIgfCBcInByb2Nlc3NcIiB8IFwic2F2ZVwiO1xuXHRcdHBheWxvYWQ6IGFueTtcblx0fVxuXG5cdGludGVyZmFjZSBEYXRhUmVzcG9uc2Uge1xuXHRcdHN0YXR1czogXCJzdWNjZXNzXCIgfCBcImVycm9yXCI7XG5cdFx0ZGF0YT86IGFueTtcblx0XHRlcnJvcj86IHN0cmluZztcblx0fVxuXG5cdG9uTWVzc2FnZTxEYXRhUmVxdWVzdCwgRGF0YVJlc3BvbnNlPihhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcInByb2Nlc3MtZGF0YVwiKSB7XG5cdFx0XHRjb25zdCB7IHR5cGUsIHBheWxvYWQgfSA9IHJlcXVlc3QuYm9keSB8fCB7fTtcblxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0bGV0IHJlc3VsdDogYW55O1xuXHRcdFx0XHRzd2l0Y2ggKHR5cGUpIHtcblx0XHRcdFx0XHRjYXNlIFwiZmV0Y2hcIjpcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHsgZmV0Y2hlZDogdHJ1ZSwgaXRlbXM6IFsxLCAyLCAzXSB9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcInByb2Nlc3NcIjpcblx0XHRcdFx0XHRcdHJlc3VsdCA9IHsgcHJvY2Vzc2VkOiBwYXlsb2FkLCBjb3VudDogcGF5bG9hZD8ubGVuZ3RoIHx8IDAgfTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgXCJzYXZlXCI6XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSB7IHNhdmVkOiB0cnVlLCBpZDogTWF0aC5yYW5kb20oKSB9O1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZVwiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiByZXN1bHQgfSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRyZXNwb25zZS5zZW5kKHtcblx0XHRcdFx0XHRzdGF0dXM6IFwiZXJyb3JcIixcblx0XHRcdFx0XHRlcnJvcjogZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIlVua25vd24gZXJyb3JcIixcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBFeGFtcGxlIDY6IFB1Yi1TdWIgQnJvYWRjYXN0XG5cdG9uTWVzc2FnZTx7IG1lc3NhZ2U6IHN0cmluZyB9LCB7IGJyb2FkY2FzdElkOiBzdHJpbmcgfT4oXG5cdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImJyb2FkY2FzdC1tZXNzYWdlXCIpIHtcblx0XHRcdFx0Y29uc3QgYnJvYWRjYXN0SWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyk7XG5cblx0XHRcdFx0Ly8gQnJvYWRjYXN0IHRvIGFsbCBvdGhlciB0YWJzXG5cdFx0XHRcdGJyb2FkY2FzdCh7XG5cdFx0XHRcdFx0cGF5bG9hZDoge1xuXHRcdFx0XHRcdFx0dHlwZTogXCJub3RpZmljYXRpb25cIixcblx0XHRcdFx0XHRcdG1lc3NhZ2U6IHJlcXVlc3QuYm9keT8ubWVzc2FnZSxcblx0XHRcdFx0XHRcdGZyb206IHJlcXVlc3Quc2VuZGVyPy50YWI/LmlkLFxuXHRcdFx0XHRcdFx0YnJvYWRjYXN0SWQsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7IGJyb2FkY2FzdElkIH0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdCk7XG5cblx0Ly8gRXhhbXBsZSA3OiBFcnJvciBIYW5kbGVyXG5cdG9uTWVzc2FnZTx7IHNob3VsZEVycm9yOiBib29sZWFuIH0sIHsgcmVzdWx0Pzogc3RyaW5nIH0+KFxuXHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJ0ZXN0LWVycm9yXCIpIHtcblx0XHRcdFx0aWYgKHJlcXVlc3QuYm9keT8uc2hvdWxkRXJyb3IpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnRlbnRpb25hbCBlcnJvciBmb3IgdGVzdGluZ1wiKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyByZXN1bHQ6IFwiU3VjY2VzcyB3aXRob3V0IGVycm9yXCIgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDg6IFJlbGF5IGEgbWVzc2FnZSBmcm9tIHRoZSBwb3B1cCB0byBhIGNvbnRlbnQgc2NyaXB0LlxuXHQvLyBQb3B1cHMgY2FuJ3QgYmUgdGFyZ2V0ZWQgYnkgc2VuZFRvQ29udGVudFNjcmlwdCgpIGRpcmVjdGx5ICh0aGV5IGFyZW4ndFxuXHQvLyB0YWJzKSwgYW5kIGNvbnRlbnQgc2NyaXB0cyBjYW4ndCBjYWxsIGl0IGF0IGFsbCAoaXQncyBiYWNrZ3JvdW5kLW9ubHkpLFxuXHQvLyBzbyB0aGUgYmFja2dyb3VuZCBhY3RzIGFzIHRoZSBnby1iZXR3ZWVuLlxuXHRvbk1lc3NhZ2U8eyB0YWJJZDogbnVtYmVyOyBtZXNzYWdlOiBzdHJpbmcgfSwgeyByZWxheWVkOiBib29sZWFuIH0+KFxuXHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJyZWxheS10by1jb250ZW50XCIpIHtcblx0XHRcdFx0Y29uc3QgeyB0YWJJZCwgbWVzc2FnZSB9ID0gcmVxdWVzdC5ib2R5IHx8IHt9O1xuXG5cdFx0XHRcdGlmICh0YWJJZCkge1xuXHRcdFx0XHRcdGF3YWl0IHNlbmRUb0NvbnRlbnRTY3JpcHQ8XG5cdFx0XHRcdFx0XHR7IG1lc3NhZ2U6IHN0cmluZyB9LFxuXHRcdFx0XHRcdFx0eyBhY2tub3dsZWRnZWQ6IGJvb2xlYW4gfVxuXHRcdFx0XHRcdD4oe1xuXHRcdFx0XHRcdFx0dGFiSWQsXG5cdFx0XHRcdFx0XHRuYW1lOiBcImNvbnRlbnQtbm90aWZ5LXBvcHVwXCIsXG5cdFx0XHRcdFx0XHRib2R5OiB7IG1lc3NhZ2U6IG1lc3NhZ2UgfHwgXCJcIiB9LFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzcG9uc2Uuc2VuZCh7IHJlbGF5ZWQ6IHRydWUgfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0KTtcblxuXHQvLyBFeGFtcGxlIDk6IENvbnRlbnQgc2NyaXB0IGFza3MgdGhlIGJhY2tncm91bmQgdG8gb3BlbiB0aGUgb3B0aW9ucyBwYWdlXG5cdC8vIGFuZCB0aGUgcG9wdXAsIHRoZW4gaGFuZCB0aGVtIGEgbWVzc2FnZS4gT3B0aW9ucy9wb3B1cCBwYWdlcyBhcmVuJ3Rcblx0Ly8gdGFicyBlaXRoZXIsIHNvIGluc3RlYWQgb2YgXCJzZW5kaW5nXCIgdG8gdGhlbSBkaXJlY3RseSB3ZSAoYSkgb3BlbiB0aGVtXG5cdC8vIHdpdGggdGhlIHJlYWwgZXh0ZW5zaW9uIEFQSXMgYW5kIChiKSBzdGFzaCB0aGUgbWVzc2FnZSBzbyB0aGV5IGNhbiBwdWxsXG5cdC8vIGl0IGFzIHNvb24gYXMgdGhleSBtb3VudCB2aWEgYGdldC1sYXRlc3Qtbm90aWZpY2F0aW9uYC5cblx0Y29uc3QgbGF0ZXN0Tm90aWZpY2F0aW9uczoge1xuXHRcdG9wdGlvbnM6IHsgbWVzc2FnZTogc3RyaW5nOyB0aW1lc3RhbXA6IG51bWJlciB9IHwgbnVsbDtcblx0XHRwb3B1cDogeyBtZXNzYWdlOiBzdHJpbmc7IHRpbWVzdGFtcDogbnVtYmVyIH0gfCBudWxsO1xuXHR9ID0geyBvcHRpb25zOiBudWxsLCBwb3B1cDogbnVsbCB9O1xuXG5cdG9uTWVzc2FnZTxcblx0XHR7IHRhcmdldDogXCJvcHRpb25zXCIgfCBcInBvcHVwXCI7IG1lc3NhZ2U6IHN0cmluZyB9LFxuXHRcdHsgb3BlbmVkOiBib29sZWFuIH1cblx0Pihhc3luYyAocmVxdWVzdCwgcmVzcG9uc2UpID0+IHtcblx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcIm9wZW4tYW5kLW5vdGlmeVwiKSB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSByZXF1ZXN0LmJvZHk/LnRhcmdldDtcblx0XHRcdGNvbnN0IG1lc3NhZ2UgPSByZXF1ZXN0LmJvZHk/Lm1lc3NhZ2UgfHwgXCJcIjtcblxuXHRcdFx0aWYgKHRhcmdldCA9PT0gXCJvcHRpb25zXCIgfHwgdGFyZ2V0ID09PSBcInBvcHVwXCIpIHtcblx0XHRcdFx0bGF0ZXN0Tm90aWZpY2F0aW9uc1t0YXJnZXRdID0geyBtZXNzYWdlLCB0aW1lc3RhbXA6IERhdGUubm93KCkgfTtcblxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBcIm9wdGlvbnNcIikge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHQvLyBUaGUgcmVhbCBBUEkgaXMgYHJ1bnRpbWUub3Blbk9wdGlvbnNQYWdlKClgIOKAlCB0aGVyZSBpcyBub1xuXHRcdFx0XHRcdFx0Ly8gYGJyb3dzZXIub3Blbk9wdGlvbnNQYWdlKClgLlxuXHRcdFx0XHRcdFx0YXdhaXQgYnJvd3Nlci5ydW50aW1lLm9wZW5PcHRpb25zUGFnZSgpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKFwiW0JhY2tncm91bmRdIEZhaWxlZCB0byBvcGVuIG9wdGlvbnMgcGFnZTpcIiwgZXJyb3IpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIHJlYWwgQVBJIGlzIGBhY3Rpb24ub3BlblBvcHVwKClgIChNVjMpIOKAlCB0aGVyZSBpcyBub1xuXHRcdFx0XHRcdFx0Ly8gYGJyb3dzZXIub3BlbkFjdGlvbigpYC4gU3VwcG9ydCBmb3Igb3BlbmluZyB0aGUgcG9wdXBcblx0XHRcdFx0XHRcdC8vIHByb2dyYW1tYXRpY2FsbHkgaXMgbmV3ZXIgYW5kIGJyb3dzZXItZGVwZW5kZW50LCBzbyB0aGlzXG5cdFx0XHRcdFx0XHQvLyBpcyBiZXN0LWVmZm9ydC5cblx0XHRcdFx0XHRcdGF3YWl0IGJyb3dzZXIuYWN0aW9uLm9wZW5Qb3B1cCgpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oXG5cdFx0XHRcdFx0XHRcdFwiW0JhY2tncm91bmRdIGFjdGlvbi5vcGVuUG9wdXAoKSBpc24ndCBzdXBwb3J0ZWQgaGVyZTpcIixcblx0XHRcdFx0XHRcdFx0ZXJyb3IsXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEFsc28gYnJvYWRjYXN0LCBpbiBjYXNlIHRoZSB0YXJnZXQgcGFnZSBpcyBhbHJlYWR5IG9wZW4gYW5kXG5cdFx0XHRcdC8vIHN1YnNjcmliZWQgd2hlbiB0aGlzIGZpcmVzLlxuXHRcdFx0XHRicm9hZGNhc3Qoe1xuXHRcdFx0XHRcdHBheWxvYWQ6IHtcblx0XHRcdFx0XHRcdHR5cGU6IFwibm90aWZpY2F0aW9uXCIsXG5cdFx0XHRcdFx0XHR0YXJnZXQsXG5cdFx0XHRcdFx0XHQuLi5sYXRlc3ROb3RpZmljYXRpb25zW3RhcmdldF0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3BvbnNlLnNlbmQoeyBvcGVuZWQ6IHRydWUgfSk7XG5cdFx0fVxuXHR9KTtcblxuXHRvbk1lc3NhZ2U8XG5cdFx0eyB0YXJnZXQ6IFwib3B0aW9uc1wiIHwgXCJwb3B1cFwiIH0sXG5cdFx0eyBtZXNzYWdlOiBzdHJpbmc7IHRpbWVzdGFtcDogbnVtYmVyIH0gfCBudWxsXG5cdD4oYXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0aWYgKHJlcXVlc3QubmFtZSA9PT0gXCJnZXQtbGF0ZXN0LW5vdGlmaWNhdGlvblwiKSB7XG5cdFx0XHRjb25zdCB0YXJnZXQgPSByZXF1ZXN0LmJvZHk/LnRhcmdldDtcblx0XHRcdHJlc3BvbnNlLnNlbmQodGFyZ2V0ID8gbGF0ZXN0Tm90aWZpY2F0aW9uc1t0YXJnZXRdIDogbnVsbCk7XG5cdFx0fVxuXHR9KTtcblxuXHRjb25zb2xlLmxvZyhcIltCYWNrZ3JvdW5kXSBBbGwgbWVzc2FnZSBoYW5kbGVycyByZWdpc3RlcmVkXCIpO1xufSk7XG4iLCIvLyNyZWdpb24gc3JjL2luZGV4LnRzXG4vKipcbiogQ2xhc3MgZm9yIHBhcnNpbmcgYW5kIHBlcmZvcm1pbmcgb3BlcmF0aW9ucyBvbiBtYXRjaCBwYXR0ZXJucy5cbipcbiogQGV4YW1wbGVcbiogICBjb25zdCBwYXR0ZXJuID0gbmV3IE1hdGNoUGF0dGVybignKjovL2dvb2dsZS5jb20vKicpO1xuKlxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHBzOi8vZ29vZ2xlLmNvbScpOyAvLyB0cnVlXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cDovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MTIzJyk7IC8vIGZhbHNlXG4qL1xudmFyIE1hdGNoUGF0dGVybiA9IGNsYXNzIE1hdGNoUGF0dGVybiB7XG5cdHN0YXRpYyB7XG5cdFx0dGhpcy5QUk9UT0NPTFMgPSBbXG5cdFx0XHRcImh0dHBcIixcblx0XHRcdFwiaHR0cHNcIixcblx0XHRcdFwiZmlsZVwiLFxuXHRcdFx0XCJmdHBcIixcblx0XHRcdFwidXJuXCIsXG5cdFx0XHRcIndzXCIsXG5cdFx0XHRcIndzc1wiXG5cdFx0XTtcblx0fVxuXHQvKipcblx0KiBQYXJzZSBhIG1hdGNoIHBhdHRlcm4gc3RyaW5nLiBJZiBpdCBpcyBpbnZhbGlkLCB0aGUgY29uc3RydWN0b3Igd2lsbCB0aHJvdyBhblxuXHQqIGBJbnZhbGlkTWF0Y2hQYXR0ZXJuYCBlcnJvci5cblx0KlxuXHQqIEBwYXJhbSBtYXRjaFBhdHRlcm4gVGhlIG1hdGNoIHBhdHRlcm4gdG8gcGFyc2UuXG5cdCovXG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybikge1xuXHRcdGlmIChtYXRjaFBhdHRlcm4gPT09IFwiPGFsbF91cmxzPlwiKSB7XG5cdFx0XHR0aGlzLmlzQWxsVXJscyA9IHRydWU7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IFsuLi5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuXHRcdFx0aWYgKGdyb3VwcyA9PSBudWxsKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcblx0XHRcdGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3Vwcztcblx0XHRcdHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG5cdFx0XHR2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcblx0XHR9XG5cdH1cblx0LyoqIENoZWNrIGlmIGEgVVJMIGlzIGluY2x1ZGVkIGluIGEgcGF0dGVybi4gKi9cblx0aW5jbHVkZXModXJsKSB7XG5cdFx0Y29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuXHRcdGlmICh0aGlzLmlzQWxsVXJscykgcmV0dXJuICF0aGlzLmlzVW5rbm93blByb3RvY29sKHUpO1xuXHRcdHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKSByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKSByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKSByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIikgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIikgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcblx0XHR9KTtcblx0fVxuXHRpc0h0dHBNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0h0dHBzTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaG9zdG5hbWVNYXRjaFJlZ2V4cyA9IFt0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLCB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gucmVwbGFjZSgvXlxcKlxcLi8sIFwiXCIpKV07XG5cdFx0Y29uc3QgcGF0aG5hbWVNYXRjaFJlZ2V4ID0gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKTtcblx0XHRyZXR1cm4gISFob3N0bmFtZU1hdGNoUmVnZXhzLmZpbmQoKHJlZ2V4KSA9PiByZWdleC50ZXN0KHVybC5ob3N0bmFtZSkpICYmIHBhdGhuYW1lTWF0Y2hSZWdleC50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNVbmtub3duUHJvdG9jb2wodXJsKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3RvY29sTWF0Y2hlcy5pbmNsdWRlcyh1cmwucHJvdG9jb2wuc2xpY2UoMCwgLTEpKTtcblx0fVxuXHRpc1BhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpLnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc0ZpbGVNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImZpbGU6XCIgJiYgdGhpcy5pc1BhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzRnRwTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGlzVXJuTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG5cdFx0Y29uc3Qgc3RhcnNSZXBsYWNlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybikucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuXHRcdHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuXHR9XG5cdGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuXHR9XG59O1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcblx0XHRzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuXHR9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG5cdGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYCk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSG9zdG5hbWUgY2Fubm90IGluY2x1ZGUgYSBwb3J0YCk7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIipcIikgJiYgaG9zdG5hbWUubGVuZ3RoID4gMSAmJiAhaG9zdG5hbWUuc3RhcnRzV2l0aChcIiouXCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYCk7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IEludmFsaWRNYXRjaFBhdHRlcm4sIE1hdGNoUGF0dGVybiB9O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiw0LDUsMTNdLCJtYXBwaW5ncyI6Ijs7Q0FDQSxTQUFTLGlCQUFpQixLQUFLO0VBQzlCLElBQUksT0FBTyxRQUFRLE9BQU8sUUFBUSxZQUFZLE9BQU8sRUFBRSxNQUFNLElBQUk7RUFDakUsT0FBTztDQUNSOzs7Ozs7Ozs7Ozs7Ozs7OztDRVlBLElBQU0sVURmaUIsV0FBVyxTQUFTLFNBQVMsS0FDaEQsV0FBVyxVQUNYLFdBQVc7OztDRUhmLElBQUksSUFBRSxPQUFPO0NBQWdIQyxJQUFBQSxPQUFHLEdBQUUsR0FBRSxZQUFRO0VBQUMsSUFBRyxHQUFFLE1BQU0sRUFBRTtFQUFHLElBQUc7R0FBQyxPQUFPLE1BQUksSUFBRSxFQUFFLElBQUUsQ0FBQyxJQUFHO0VBQUMsU0FBTyxHQUFFO0dBQUMsTUFBTSxJQUFFLENBQUMsQ0FBQyxHQUFFO0VBQUM7Q0FBQztDQUFFQyxJQUFBQSxPQUFHLEdBQUUsTUFBSTtFQUFDLElBQUksSUFBRSxDQUFDO0VBQUUsS0FBSSxJQUFJLEtBQUssR0FBRSxFQUFFLEdBQUUsR0FBRTtHQUFDLEtBQUksRUFBRTtHQUFHLFlBQVcsQ0FBQztFQUFDLENBQUM7RUFBRSxPQUFPLEtBQUcsRUFBRSxHQUFFLE9BQU8sYUFBWSxFQUFDLE9BQU0sU0FBUSxDQUFDLEdBQUU7Q0FBQztDQUE2U0MsSUFBQUE7Q0FBRSxJQUFBO0NBQUUsSUFBQTtDQUFFLElBQUE7Q0FBRSxJQUFBO0NBQUUsSUFBQSxJQUFFRixXQUFPO0VBQUMsTUFBRSxZQUFXLFVBQU07R0FBQyxJQUFJLElBQUVFLElBQUUsU0FBUyxXQUFTQSxJQUFFLFFBQVE7R0FBUSxJQUFHLENBQUMsR0FBRSxNQUFNLE1BQU0sb0NBQW9DO0dBQUUsT0FBTztFQUFDLEdBQUUsVUFBTTtHQUFDLElBQUksSUFBRUEsSUFBRSxTQUFTLFFB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