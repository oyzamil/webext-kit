(function() {
	//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
				get: ((k) => from[k]).bind(null, key),
				enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
			});
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
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
	//#region ../../node_modules/.bun/many-keys-map@3.0.3/node_modules/many-keys-map/index.js
	var nullKey = Symbol("null");
	var keyCounter = 0;
	var ManyKeysMap = class extends Map {
		constructor(...arguments_) {
			super();
			this._objectHashes = /* @__PURE__ */ new WeakMap();
			this._symbolHashes = /* @__PURE__ */ new Map();
			this._publicKeys = /* @__PURE__ */ new Map();
			const [pairs] = arguments_;
			if (pairs === null || pairs === void 0) return;
			if (typeof pairs[Symbol.iterator] !== "function") throw new TypeError(typeof pairs + " is not iterable (cannot read property Symbol(Symbol.iterator))");
			for (const [keys, value] of pairs) this.set(keys, value);
		}
		_getPublicKeys(keys, create = false) {
			if (!Array.isArray(keys)) throw new TypeError("The keys parameter must be an array");
			const privateKey = this._getPrivateKey(keys, create);
			let publicKey;
			if (privateKey && this._publicKeys.has(privateKey)) publicKey = this._publicKeys.get(privateKey);
			else if (create) {
				publicKey = [...keys];
				this._publicKeys.set(privateKey, publicKey);
			}
			return {
				privateKey,
				publicKey
			};
		}
		_getPrivateKey(keys, create = false) {
			const privateKeys = [];
			for (const key of keys) {
				const keyToPass = key === null ? nullKey : key;
				let hashes;
				if (typeof keyToPass === "object" || typeof keyToPass === "function") hashes = "_objectHashes";
				else if (typeof keyToPass === "symbol") hashes = "_symbolHashes";
				else hashes = false;
				if (!hashes) privateKeys.push(keyToPass);
				else if (this[hashes].has(keyToPass)) privateKeys.push(this[hashes].get(keyToPass));
				else if (create) {
					const privateKey = `@@mkm-ref-${keyCounter++}@@`;
					this[hashes].set(keyToPass, privateKey);
					privateKeys.push(privateKey);
				} else return false;
			}
			return JSON.stringify(privateKeys);
		}
		set(keys, value) {
			const { publicKey } = this._getPublicKeys(keys, true);
			return super.set(publicKey, value);
		}
		get(keys) {
			const { publicKey } = this._getPublicKeys(keys);
			return super.get(publicKey);
		}
		has(keys) {
			const { publicKey } = this._getPublicKeys(keys);
			return super.has(publicKey);
		}
		delete(keys) {
			const { publicKey, privateKey } = this._getPublicKeys(keys);
			return Boolean(publicKey && super.delete(publicKey) && this._publicKeys.delete(privateKey));
		}
		clear() {
			super.clear();
			this._symbolHashes.clear();
			this._publicKeys.clear();
		}
		get [Symbol.toStringTag]() {
			return "ManyKeysMap";
		}
		get size() {
			return super.size;
		}
	};
	//#endregion
	//#region ../../node_modules/.bun/defu@6.1.7/node_modules/defu/dist/defu.mjs
	function isPlainObject(value) {
		if (value === null || typeof value !== "object") return false;
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
		if (Symbol.iterator in value) return false;
		if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
		return true;
	}
	function _defu(baseObject, defaults, namespace = ".", merger) {
		if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace, merger);
		const object = { ...defaults };
		for (const key of Object.keys(baseObject)) {
			if (key === "__proto__" || key === "constructor") continue;
			const value = baseObject[key];
			if (value === null || value === void 0) continue;
			if (merger && merger(object, key, value, namespace)) continue;
			if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
			else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
			else object[key] = value;
		}
		return object;
	}
	function createDefu(merger) {
		return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
	}
	var defu = createDefu();
	//#endregion
	//#region ../../node_modules/.bun/@1natsu+wait-element@4.2.0/node_modules/@1natsu/wait-element/dist/detectors.mjs
	var isExist = (element) => {
		return element !== null ? {
			isDetected: true,
			result: element
		} : { isDetected: false };
	};
	var isNotExist = (element) => {
		return element === null ? {
			isDetected: true,
			result: null
		} : { isDetected: false };
	};
	//#endregion
	//#region ../../node_modules/.bun/@1natsu+wait-element@4.2.0/node_modules/@1natsu/wait-element/dist/index.mjs
	var getDefaultOptions = () => ({
		target: globalThis.document,
		unifyProcess: true,
		detector: isExist,
		observeConfigs: {
			childList: true,
			subtree: true,
			attributes: true
		},
		signal: void 0,
		customMatcher: void 0
	});
	var mergeOptions = (userSideOptions, defaultOptions) => {
		return defu(userSideOptions, defaultOptions);
	};
	var unifyCache = new ManyKeysMap();
	function createWaitElement(instanceOptions) {
		const { defaultOptions } = instanceOptions;
		return (selector, options) => {
			const { target, unifyProcess, observeConfigs, detector, signal, customMatcher } = mergeOptions(options, defaultOptions);
			const unifyPromiseKey = [
				selector,
				target,
				unifyProcess,
				observeConfigs,
				detector,
				signal,
				customMatcher
			];
			const cachedPromise = unifyCache.get(unifyPromiseKey);
			if (unifyProcess && cachedPromise) return cachedPromise;
			const detectPromise = new Promise(async (resolve, reject) => {
				if (signal?.aborted) return reject(signal.reason);
				const observer = new MutationObserver(async (mutations) => {
					for (const _ of mutations) {
						if (signal?.aborted) {
							observer.disconnect();
							break;
						}
						const detectResult2 = await detectElement({
							selector,
							target,
							detector,
							customMatcher
						});
						if (detectResult2.isDetected) {
							observer.disconnect();
							resolve(detectResult2.result);
							break;
						}
					}
				});
				signal?.addEventListener("abort", () => {
					observer.disconnect();
					return reject(signal.reason);
				}, { once: true });
				const detectResult = await detectElement({
					selector,
					target,
					detector,
					customMatcher
				});
				if (detectResult.isDetected) return resolve(detectResult.result);
				observer.observe(target, observeConfigs);
			}).finally(() => {
				unifyCache.delete(unifyPromiseKey);
			});
			unifyCache.set(unifyPromiseKey, detectPromise);
			return detectPromise;
		};
	}
	async function detectElement({ target, selector, detector, customMatcher }) {
		return await detector(customMatcher ? customMatcher(selector) : target.querySelector(selector));
	}
	var waitElement = createWaitElement({ defaultOptions: getDefaultOptions() });
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/content-script-ui/shared.mjs
	function applyPosition(root, positionedElement, options) {
		if (options.position === "inline") return;
		if (options.zIndex != null) root.style.zIndex = String(options.zIndex);
		root.style.overflow = "visible";
		root.style.position = "relative";
		root.style.width = "0";
		root.style.height = "0";
		root.style.display = "block";
		if (positionedElement) if (options.position === "overlay") {
			positionedElement.style.position = "absolute";
			if (options.alignment?.startsWith("bottom-")) positionedElement.style.bottom = "0";
			else positionedElement.style.top = "0";
			if (options.alignment?.endsWith("-right")) positionedElement.style.right = "0";
			else positionedElement.style.left = "0";
		} else {
			positionedElement.style.position = "fixed";
			positionedElement.style.top = "0";
			positionedElement.style.bottom = "0";
			positionedElement.style.left = "0";
			positionedElement.style.right = "0";
		}
	}
	function getAnchor(options) {
		if (options.anchor == null) return document.body;
		let resolved = typeof options.anchor === "function" ? options.anchor() : options.anchor;
		if (typeof resolved === "string") if (resolved.startsWith("/")) return document.evaluate(resolved, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue ?? void 0;
		else return document.querySelector(resolved) ?? void 0;
		return resolved ?? void 0;
	}
	function mountUi(root, options) {
		const anchor = getAnchor(options);
		if (anchor == null) throw Error("Failed to mount content script UI: could not find anchor element");
		switch (options.append) {
			case void 0:
			case "last":
				anchor.append(root);
				break;
			case "first":
				anchor.prepend(root);
				break;
			case "replace":
				anchor.replaceWith(root);
				break;
			case "after":
				anchor.parentElement?.insertBefore(root, anchor.nextElementSibling);
				break;
			case "before":
				anchor.parentElement?.insertBefore(root, anchor);
				break;
			default: options.append(anchor, root);
		}
	}
	function createMountFunctions(baseFunctions, options) {
		let autoMountInstance;
		const stopAutoMount = () => {
			autoMountInstance?.stopAutoMount();
			autoMountInstance = void 0;
		};
		const mount = () => {
			baseFunctions.mount();
		};
		const unmount = baseFunctions.remove;
		const remove = () => {
			stopAutoMount();
			baseFunctions.remove();
		};
		const autoMount = (autoMountOptions) => {
			if (autoMountInstance) logger$1.warn("autoMount is already set.");
			autoMountInstance = autoMountUi({
				mount,
				unmount,
				stopAutoMount
			}, {
				...options,
				...autoMountOptions
			});
		};
		return {
			mount,
			remove,
			autoMount
		};
	}
	function autoMountUi(uiCallbacks, options) {
		const abortController = new AbortController();
		const EXPLICIT_STOP_REASON = "explicit_stop_auto_mount";
		const _stopAutoMount = () => {
			abortController.abort(EXPLICIT_STOP_REASON);
			options.onStop?.();
		};
		let resolvedAnchor = typeof options.anchor === "function" ? options.anchor() : options.anchor;
		if (resolvedAnchor instanceof Element) throw Error("autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor.");
		async function observeElement(selector) {
			let isAnchorExist = !!getAnchor(options);
			if (isAnchorExist) uiCallbacks.mount();
			while (!abortController.signal.aborted) try {
				isAnchorExist = !!await waitElement(selector ?? "body", {
					customMatcher: () => getAnchor(options) ?? null,
					detector: isAnchorExist ? isNotExist : isExist,
					signal: abortController.signal
				});
				if (isAnchorExist) uiCallbacks.mount();
				else {
					uiCallbacks.unmount();
					if (options.once) uiCallbacks.stopAutoMount();
				}
			} catch (error) {
				if (abortController.signal.aborted && abortController.signal.reason === EXPLICIT_STOP_REASON) break;
				else throw error;
			}
		}
		observeElement(resolvedAnchor);
		return { stopAutoMount: _stopAutoMount };
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/split-shadow-root-css.mjs
	/** @module wxt/utils/split-shadow-root-css */
	var AT_RULE_BLOCKS = /(\s*@(property|font-face)[\s\S]*?{[\s\S]*?})/gm;
	/**
	* Given a CSS string that will be loaded into a shadow root, split it into two
	* parts:
	*
	* - `documentCss`: CSS that needs to be applied to the document (like
	*   `@property`)
	* - `shadowCss`: CSS that needs to be applied to the shadow root
	*
	* @param css
	*/
	function splitShadowRootCss(css) {
		return {
			documentCss: Array.from(css.matchAll(AT_RULE_BLOCKS), (m) => m[0]).join("").trim(),
			shadowCss: css.replace(AT_RULE_BLOCKS, "").trim()
		};
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
	//#region ../../node_modules/.bun/@webext-core+isolated-element@3.0.0/node_modules/@webext-core/isolated-element/dist/index.mjs
	var import_is_potential_custom_element_name = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
		var regex = /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
		var isPotentialCustomElementName = function(string) {
			return regex.test(string);
		};
		module.exports = isPotentialCustomElementName;
	})))(), 1);
	/**
	* Built-in elements that can have a shadow root attached to them.
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#elements_you_can_attach_a_shadow_to
	*/
	var ALLOWED_SHADOW_ELEMENTS = [
		"article",
		"aside",
		"blockquote",
		"body",
		"div",
		"footer",
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"header",
		"main",
		"nav",
		"p",
		"section",
		"span"
	];
	/**
	* Create an HTML element that has isolated styles from the rest of the page.
	*
	* @example
	*   const { isolatedElement, parentElement } = createIsolatedElement({
	*     name: 'example-ui',
	*     css: { textContent: 'p { color: red }' },
	*     isolateEvents: true, // or ['keydown', 'keyup', 'keypress']
	*   });
	*
	*   // Create and mount your app inside the isolation
	*   const ui = document.createElement('p');
	*   ui.textContent = 'Example UI';
	*   isolatedElement.appendChild(ui);
	*
	*   // Add the UI to the DOM
	*   document.body.appendChild(parentElement);
	*
	* @param options
	* @returns A `parentElement` that can be added to the DOM, the `shadow` root, and an
	*   `isolatedElement` that you should mount your UI to.
	*/
	async function createIsolatedElement(options) {
		const { name, mode = "closed", css, isolateEvents = false } = options;
		if (!ALLOWED_SHADOW_ELEMENTS.includes(name) && !(0, import_is_potential_custom_element_name.default)(name)) throw Error(`"${name}" cannot have a shadow root attached to it. It must be two words and kebab-case, with a few exceptions. See https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#elements_you_can_attach_a_shadow_to`);
		const parentElement = document.createElement(name);
		const shadow = parentElement.attachShadow({ mode });
		const isolatedElement = document.createElement("div");
		if (css) {
			const style = document.createElement("style");
			if ("url" in css) style.textContent = await fetch(css.url).then((res) => res.text());
			else style.textContent = css.textContent;
			shadow.appendChild(style);
		}
		shadow.appendChild(isolatedElement);
		if (isolateEvents) (Array.isArray(isolateEvents) ? isolateEvents : [
			"keydown",
			"keyup",
			"keypress"
		]).forEach((eventType) => {
			shadow.addEventListener(eventType, (e) => e.stopPropagation());
		});
		return {
			parentElement,
			shadow,
			isolatedElement
		};
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+aa6a9a45a377fc11/node_modules/wxt/dist/utils/content-script-ui/shadow-root.mjs
	/** @module wxt/utils/content-script-ui/shadow-root */
	/**
	* Create a content script UI inside a
	* [`ShadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot).
	*
	* > This function is async because it has to load the CSS via a network call.
	*
	* @param options - Shadow root options. See {@link ContentScriptUiOptions} for
	*   shared positioning, anchoring, `append`, and removal options.
	* @see https://wxt.dev/guide/essentials/content-scripts.html#shadow-root
	*/
	async function createShadowRootUi(ctx, options) {
		const instanceId = Math.random().toString(36).substring(2, 15);
		const css = [];
		if (!options.inheritStyles) css.push(`/* WXT Shadow Root Reset */ :host{all:initial !important;}`);
		if (options.css) css.push(options.css);
		if (ctx.options?.cssInjectionMode === "ui") {
			const entryCss = await loadCss();
			css.push(entryCss.replaceAll(":root", ":host"));
		}
		const { shadowCss, documentCss } = splitShadowRootCss(css.join("\n").trim());
		const { isolatedElement: uiContainer, parentElement: shadowHost, shadow } = await createIsolatedElement({
			name: options.name,
			css: { textContent: shadowCss },
			mode: options.mode ?? "open",
			isolateEvents: options.isolateEvents
		});
		let mounted;
		const mount = () => {
			mountUi(shadowHost, options);
			applyPosition(shadowHost, uiContainer, options);
			if (documentCss && !document.querySelector(`style[wxt-shadow-root-document-styles="${instanceId}"]`)) {
				const style = document.createElement("style");
				style.textContent = documentCss;
				style.setAttribute("wxt-shadow-root-document-styles", instanceId);
				(document.head ?? document.body).append(style);
			}
			mounted = options.onMount(uiContainer, shadow, shadowHost);
		};
		const remove = () => {
			options.onRemove?.(mounted);
			shadowHost.remove();
			document.querySelector(`style[wxt-shadow-root-document-styles="${instanceId}"]`)?.remove();
			while (uiContainer.lastChild) uiContainer.removeChild(uiContainer.lastChild);
			mounted = void 0;
		};
		const mountFunctions = createMountFunctions({
			mount,
			remove
		}, options);
		ctx.onInvalidated(remove);
		return {
			shadow,
			shadowHost,
			uiContainer,
			...mountFunctions,
			get mounted() {
				return mounted;
			}
		};
	}
	/** Load the CSS for the current entrypoint. */
	async function loadCss() {
		const url = browser.runtime.getURL(`/content-scripts/content.css`);
		try {
			return await (await fetch(url)).text();
		} catch (err) {
			logger$1.warn(`Failed to load styles @ ${url}. Did you forget to import the stylesheet in your entrypoint?`, err);
			return "";
		}
	}
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
	//#region src/entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["*://*.example.com/*"],
		cssInjectionMode: "ui",
		async main(ctx) {
			console.log("[Content Script] Initialized");
			r$2(async (request, response) => {
				console.log("[Content Script] Received from background:", request);
				if (request.name === "content-notify") response.send({ acknowledged: true });
			});
			r$2(async (request, response) => {
				if (request.name === "content-notify-popup") {
					console.log("[Content Script] Message relayed from popup:", request.body?.message);
					response.send({ acknowledged: true });
				}
			});
			async function sendEchoMessage(text) {
				try {
					const response = await T({
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
					const response = await T({
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
					const response = await T({ name: "get-tab-info" });
					console.log("[Content Script] Tab info:", response);
				} catch (error) {
					console.error("[Content Script] Tab info error:", error);
				}
			}
			async function relayMessage(text) {
				try {
					const response = await A({
						name: "broadcast-message",
						body: { message: text }
					});
					console.log("[Content Script] Relay response:", response);
				} catch (error) {
					console.error("[Content Script] Relay error:", error);
				}
			}
			function notifyOptionsAndPopup(target) {
				return async () => {
					try {
						const response = await T({
							name: "open-and-notify",
							body: {
								target,
								message: `Hello ${target} from the content script button!`
							}
						});
						console.log("[Content Script] Open & notify response:", response);
					} catch (error) {
						console.error("[Content Script] Open & notify error:", error);
					}
				};
			}
			if (typeof window !== "undefined") window.__extMessagingDemo = {
				sendEchoMessage,
				processData,
				getTabInfo,
				relayMessage,
				notifyOptionsAndPopup
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
			(await createShadowRootUi(ctx, {
				name: "webext-message-demo-panel",
				position: "inline",
				anchor: "body",
				onMount: (container) => {
					const panel = document.createElement("div");
					panel.style.cssText = [
						"position:fixed",
						"bottom:16px",
						"right:16px",
						"z-index:2147483647",
						"display:flex",
						"flex-direction:column",
						"gap:8px",
						"font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
					].join(";");
					const makeButton = (label, onClick) => {
						const button = document.createElement("button");
						button.type = "button";
						button.textContent = label;
						button.style.cssText = [
							"padding:10px 14px",
							"background:#667eea",
							"color:#fff",
							"border:none",
							"border-radius:6px",
							"cursor:pointer",
							"font-size:13px",
							"font-weight:500",
							"box-shadow:0 2px 6px rgba(0,0,0,0.2)"
						].join(";");
						button.addEventListener("click", onClick);
						return button;
					};
					panel.append(makeButton("📤 Send to Background", () => sendEchoMessage("Hello from the content script button")), makeButton("🔔 Notify Options", notifyOptionsAndPopup("options")), makeButton("🔔 Notify Popup", notifyOptionsAndPopup("popup")));
					container.append(panel);
				}
			})).mount();
		}
	});
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciIsImlzUG90ZW50aWFsQ3VzdG9tRWxlbWVudE5hbWUiLCJpIiwiYSIsImMiLCJpIiwiYSIsIm8iLCJuIiwiZSIsInIiLCJmIiwiciIsImkiLCJuIiwiciIsImkiLCJuIiwidCIsInIiLCJpIiwiYSIsIm8iLCJzIiwiYyIsIm4iLCJ0IiwibiIsInQiLCJpIiwiXyIsImEiLCJwIiwibCIsImQiLCJtIiwiaCIsInYiLCJ5IiwibiIsImUiLCJ1IiwiZiIsImciLCJiIiwieCIsInQiLCJyIiwibyIsInMiXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvZ2dlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9tYW55LWtleXMtbWFwQDMuMC4zL25vZGVfbW9kdWxlcy9tYW55LWtleXMtbWFwL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vZGVmdUA2LjEuNy9ub2RlX21vZHVsZXMvZGVmdS9kaXN0L2RlZnUubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vQDFuYXRzdSt3YWl0LWVsZW1lbnRANC4yLjAvbm9kZV9tb2R1bGVzL0AxbmF0c3Uvd2FpdC1lbGVtZW50L2Rpc3QvZGV0ZWN0b3JzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0AxbmF0c3Urd2FpdC1lbGVtZW50QDQuMi4wL25vZGVfbW9kdWxlcy9AMW5hdHN1L3dhaXQtZWxlbWVudC9kaXN0L2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvY29udGVudC1zY3JpcHQtdWkvc2hhcmVkLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvc3BsaXQtc2hhZG93LXJvb3QtY3NzLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9pcy1wb3RlbnRpYWwtY3VzdG9tLWVsZW1lbnQtbmFtZUAxLjAuMS9ub2RlX21vZHVsZXMvaXMtcG90ZW50aWFsLWN1c3RvbS1lbGVtZW50LW5hbWUvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad2ViZXh0LWNvcmUraXNvbGF0ZWQtZWxlbWVudEAzLjAuMC9ub2RlX21vZHVsZXMvQHdlYmV4dC1jb3JlL2lzb2xhdGVkLWVsZW1lbnQvZGlzdC9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2NvbnRlbnQtc2NyaXB0LXVpL3NoYWRvdy1yb290Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvdXRpbHMtQ2NTeWhsOFguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC91cmwtYWxwaGFiZXQvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9uYW5vaWRANi4wLjEvbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LW1lc3NhZ2UvZGlzdC9yZWxheS5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvYmFja2dyb3VuZC5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvbWVzc2FnZS5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcG9ydC5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvcHViLXN1Yi5qcyIsIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3dlYmV4dC1tZXNzYWdlL2Rpc3QvaW5kZXguanMiLCIuLi8uLi8uLi9zcmMvZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrYWE2YTlhNDVhMzc3ZmMxMS9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40K2FhNmE5YTQ1YTM3N2ZjMTEvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCthYTZhOWE0NWEzNzdmYzExL25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG5cdHJldHVybiBkZWZpbml0aW9uO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVDb250ZW50U2NyaXB0IH07XG4iLCIvLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG5cdGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcblx0aWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSBtZXRob2QoYFt3eHRdICR7YXJncy5zaGlmdCgpfWAsIC4uLmFyZ3MpO1xuXHRlbHNlIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xufVxuLyoqIFdyYXBwZXIgYXJvdW5kIGBjb25zb2xlYCB3aXRoIGEgXCJbd3h0XVwiIHByZWZpeCAqL1xuY29uc3QgbG9nZ2VyID0ge1xuXHRkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuXHRsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG5cdHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuXHRlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBsb2dnZXIgfTtcbiIsImNvbnN0IG51bGxLZXkgPSBTeW1ib2woJ251bGwnKTsgLy8gYG9iamVjdEhhc2hlc2Aga2V5IGZvciBudWxsXG5cbmxldCBrZXlDb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFueUtleXNNYXAgZXh0ZW5kcyBNYXAge1xuXHRjb25zdHJ1Y3RvciguLi5hcmd1bWVudHNfKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX29iamVjdEhhc2hlcyA9IG5ldyBXZWFrTWFwKCk7XG5cdFx0dGhpcy5fc3ltYm9sSGFzaGVzID0gbmV3IE1hcCgpOyAvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9lY21hMjYyL2lzc3Vlcy8xMTk0XG5cdFx0dGhpcy5fcHVibGljS2V5cyA9IG5ldyBNYXAoKTtcblxuXHRcdGNvbnN0IFtwYWlyc10gPSBhcmd1bWVudHNfOyAvLyBNYXAgY29tcGF0XG5cdFx0aWYgKHBhaXJzID09PSBudWxsIHx8IHBhaXJzID09PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAodHlwZW9mIHBhaXJzW1N5bWJvbC5pdGVyYXRvcl0gIT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IodHlwZW9mIHBhaXJzICsgJyBpcyBub3QgaXRlcmFibGUgKGNhbm5vdCByZWFkIHByb3BlcnR5IFN5bWJvbChTeW1ib2wuaXRlcmF0b3IpKScpO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgW2tleXMsIHZhbHVlXSBvZiBwYWlycykge1xuXHRcdFx0dGhpcy5zZXQoa2V5cywgdmFsdWUpO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRQdWJsaWNLZXlzKGtleXMsIGNyZWF0ZSA9IGZhbHNlKSB7XG5cdFx0aWYgKCFBcnJheS5pc0FycmF5KGtleXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUga2V5cyBwYXJhbWV0ZXIgbXVzdCBiZSBhbiBhcnJheScpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHByaXZhdGVLZXkgPSB0aGlzLl9nZXRQcml2YXRlS2V5KGtleXMsIGNyZWF0ZSk7XG5cblx0XHRsZXQgcHVibGljS2V5O1xuXHRcdGlmIChwcml2YXRlS2V5ICYmIHRoaXMuX3B1YmxpY0tleXMuaGFzKHByaXZhdGVLZXkpKSB7XG5cdFx0XHRwdWJsaWNLZXkgPSB0aGlzLl9wdWJsaWNLZXlzLmdldChwcml2YXRlS2V5KTtcblx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0cHVibGljS2V5ID0gWy4uLmtleXNdOyAvLyBSZWdlbmVyYXRlIGtleXMgYXJyYXkgdG8gYXZvaWQgZXh0ZXJuYWwgaW50ZXJhY3Rpb25cblx0XHRcdHRoaXMuX3B1YmxpY0tleXMuc2V0KHByaXZhdGVLZXksIHB1YmxpY0tleSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtwcml2YXRlS2V5LCBwdWJsaWNLZXl9O1xuXHR9XG5cblx0X2dldFByaXZhdGVLZXkoa2V5cywgY3JlYXRlID0gZmFsc2UpIHtcblx0XHRjb25zdCBwcml2YXRlS2V5cyA9IFtdO1xuXHRcdGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcblx0XHRcdGNvbnN0IGtleVRvUGFzcyA9IGtleSA9PT0gbnVsbCA/IG51bGxLZXkgOiBrZXk7XG5cblx0XHRcdGxldCBoYXNoZXM7XG5cdFx0XHRpZiAodHlwZW9mIGtleVRvUGFzcyA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGtleVRvUGFzcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRoYXNoZXMgPSAnX29iamVjdEhhc2hlcyc7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBrZXlUb1Bhc3MgPT09ICdzeW1ib2wnKSB7XG5cdFx0XHRcdGhhc2hlcyA9ICdfc3ltYm9sSGFzaGVzJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGhhc2hlcyA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWhhc2hlcykge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKGtleVRvUGFzcyk7XG5cdFx0XHR9IGVsc2UgaWYgKHRoaXNbaGFzaGVzXS5oYXMoa2V5VG9QYXNzKSkge1xuXHRcdFx0XHRwcml2YXRlS2V5cy5wdXNoKHRoaXNbaGFzaGVzXS5nZXQoa2V5VG9QYXNzKSk7XG5cdFx0XHR9IGVsc2UgaWYgKGNyZWF0ZSkge1xuXHRcdFx0XHRjb25zdCBwcml2YXRlS2V5ID0gYEBAbWttLXJlZi0ke2tleUNvdW50ZXIrK31AQGA7XG5cdFx0XHRcdHRoaXNbaGFzaGVzXS5zZXQoa2V5VG9QYXNzLCBwcml2YXRlS2V5KTtcblx0XHRcdFx0cHJpdmF0ZUtleXMucHVzaChwcml2YXRlS2V5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkocHJpdmF0ZUtleXMpO1xuXHR9XG5cblx0c2V0KGtleXMsIHZhbHVlKSB7XG5cdFx0Y29uc3Qge3B1YmxpY0tleX0gPSB0aGlzLl9nZXRQdWJsaWNLZXlzKGtleXMsIHRydWUpO1xuXHRcdHJldHVybiBzdXBlci5zZXQocHVibGljS2V5LCB2YWx1ZSk7XG5cdH1cblxuXHRnZXQoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuZ2V0KHB1YmxpY0tleSk7XG5cdH1cblxuXHRoYXMoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gc3VwZXIuaGFzKHB1YmxpY0tleSk7XG5cdH1cblxuXHRkZWxldGUoa2V5cykge1xuXHRcdGNvbnN0IHtwdWJsaWNLZXksIHByaXZhdGVLZXl9ID0gdGhpcy5fZ2V0UHVibGljS2V5cyhrZXlzKTtcblx0XHRyZXR1cm4gQm9vbGVhbihwdWJsaWNLZXkgJiYgc3VwZXIuZGVsZXRlKHB1YmxpY0tleSkgJiYgdGhpcy5fcHVibGljS2V5cy5kZWxldGUocHJpdmF0ZUtleSkpO1xuXHR9XG5cblx0Y2xlYXIoKSB7XG5cdFx0c3VwZXIuY2xlYXIoKTtcblx0XHR0aGlzLl9zeW1ib2xIYXNoZXMuY2xlYXIoKTtcblx0XHR0aGlzLl9wdWJsaWNLZXlzLmNsZWFyKCk7XG5cdH1cblxuXHRnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10oKSB7XG5cdFx0cmV0dXJuICdNYW55S2V5c01hcCc7XG5cdH1cblxuXHRnZXQgc2l6ZSgpIHtcblx0XHRyZXR1cm4gc3VwZXIuc2l6ZTtcblx0fVxufVxuIiwiZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT09IG51bGwgfHwgdHlwZW9mIHZhbHVlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IHByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIGlmIChwcm90b3R5cGUgIT09IG51bGwgJiYgcHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90b3R5cGUpICE9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gdmFsdWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKFN5bWJvbC50b1N0cmluZ1RhZyBpbiB2YWx1ZSkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSBcIltvYmplY3QgTW9kdWxlXVwiO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBfZGVmdShiYXNlT2JqZWN0LCBkZWZhdWx0cywgbmFtZXNwYWNlID0gXCIuXCIsIG1lcmdlcikge1xuICBpZiAoIWlzUGxhaW5PYmplY3QoZGVmYXVsdHMpKSB7XG4gICAgcmV0dXJuIF9kZWZ1KGJhc2VPYmplY3QsIHt9LCBuYW1lc3BhY2UsIG1lcmdlcik7XG4gIH1cbiAgY29uc3Qgb2JqZWN0ID0geyAuLi5kZWZhdWx0cyB9O1xuICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhiYXNlT2JqZWN0KSkge1xuICAgIGlmIChrZXkgPT09IFwiX19wcm90b19fXCIgfHwga2V5ID09PSBcImNvbnN0cnVjdG9yXCIpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZSA9IGJhc2VPYmplY3Rba2V5XTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHZvaWQgMCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChtZXJnZXIgJiYgbWVyZ2VyKG9iamVjdCwga2V5LCB2YWx1ZSwgbmFtZXNwYWNlKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiBBcnJheS5pc0FycmF5KG9iamVjdFtrZXldKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSBbLi4udmFsdWUsIC4uLm9iamVjdFtrZXldXTtcbiAgICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpICYmIGlzUGxhaW5PYmplY3Qob2JqZWN0W2tleV0pKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IF9kZWZ1KFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgb2JqZWN0W2tleV0sXG4gICAgICAgIChuYW1lc3BhY2UgPyBgJHtuYW1lc3BhY2V9LmAgOiBcIlwiKSArIGtleS50b1N0cmluZygpLFxuICAgICAgICBtZXJnZXJcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5mdW5jdGlvbiBjcmVhdGVEZWZ1KG1lcmdlcikge1xuICByZXR1cm4gKC4uLmFyZ3VtZW50c18pID0+IChcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgdW5pY29ybi9uby1hcnJheS1yZWR1Y2VcbiAgICBhcmd1bWVudHNfLnJlZHVjZSgocCwgYykgPT4gX2RlZnUocCwgYywgXCJcIiwgbWVyZ2VyKSwge30pXG4gICk7XG59XG5jb25zdCBkZWZ1ID0gY3JlYXRlRGVmdSgpO1xuY29uc3QgZGVmdUZuID0gY3JlYXRlRGVmdSgob2JqZWN0LCBrZXksIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICBpZiAob2JqZWN0W2tleV0gIT09IHZvaWQgMCAmJiB0eXBlb2YgY3VycmVudFZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBvYmplY3Rba2V5XSA9IGN1cnJlbnRWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuY29uc3QgZGVmdUFycmF5Rm4gPSBjcmVhdGVEZWZ1KChvYmplY3QsIGtleSwgY3VycmVudFZhbHVlKSA9PiB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iamVjdFtrZXldKSAmJiB0eXBlb2YgY3VycmVudFZhbHVlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBvYmplY3Rba2V5XSA9IGN1cnJlbnRWYWx1ZShvYmplY3Rba2V5XSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG5leHBvcnQgeyBjcmVhdGVEZWZ1LCBkZWZ1IGFzIGRlZmF1bHQsIGRlZnUsIGRlZnVBcnJheUZuLCBkZWZ1Rm4gfTtcbiIsImNvbnN0IGlzRXhpc3QgPSAoZWxlbWVudCkgPT4ge1xuICByZXR1cm4gZWxlbWVudCAhPT0gbnVsbCA/IHsgaXNEZXRlY3RlZDogdHJ1ZSwgcmVzdWx0OiBlbGVtZW50IH0gOiB7IGlzRGV0ZWN0ZWQ6IGZhbHNlIH07XG59O1xuY29uc3QgaXNOb3RFeGlzdCA9IChlbGVtZW50KSA9PiB7XG4gIHJldHVybiBlbGVtZW50ID09PSBudWxsID8geyBpc0RldGVjdGVkOiB0cnVlLCByZXN1bHQ6IG51bGwgfSA6IHsgaXNEZXRlY3RlZDogZmFsc2UgfTtcbn07XG5cbmV4cG9ydCB7IGlzRXhpc3QsIGlzTm90RXhpc3QgfTtcbiIsImltcG9ydCBNYW55S2V5c01hcCBmcm9tICdtYW55LWtleXMtbWFwJztcbmltcG9ydCB7IGRlZnUgfSBmcm9tICdkZWZ1JztcbmltcG9ydCB7IGlzRXhpc3QgfSBmcm9tICcuL2RldGVjdG9ycy5tanMnO1xuXG5jb25zdCBnZXREZWZhdWx0T3B0aW9ucyA9ICgpID0+ICh7XG4gIHRhcmdldDogZ2xvYmFsVGhpcy5kb2N1bWVudCxcbiAgdW5pZnlQcm9jZXNzOiB0cnVlLFxuICBkZXRlY3RvcjogaXNFeGlzdCxcbiAgb2JzZXJ2ZUNvbmZpZ3M6IHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgICBhdHRyaWJ1dGVzOiB0cnVlXG4gIH0sXG4gIHNpZ25hbDogdm9pZCAwLFxuICBjdXN0b21NYXRjaGVyOiB2b2lkIDBcbn0pO1xuY29uc3QgbWVyZ2VPcHRpb25zID0gKHVzZXJTaWRlT3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpID0+IHtcbiAgcmV0dXJuIGRlZnUodXNlclNpZGVPcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XG59O1xuXG5jb25zdCB1bmlmeUNhY2hlID0gbmV3IE1hbnlLZXlzTWFwKCk7XG5mdW5jdGlvbiBjcmVhdGVXYWl0RWxlbWVudChpbnN0YW5jZU9wdGlvbnMpIHtcbiAgY29uc3QgeyBkZWZhdWx0T3B0aW9ucyB9ID0gaW5zdGFuY2VPcHRpb25zO1xuICByZXR1cm4gKHNlbGVjdG9yLCBvcHRpb25zKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgdGFyZ2V0LFxuICAgICAgdW5pZnlQcm9jZXNzLFxuICAgICAgb2JzZXJ2ZUNvbmZpZ3MsXG4gICAgICBkZXRlY3RvcixcbiAgICAgIHNpZ25hbCxcbiAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICB9ID0gbWVyZ2VPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcbiAgICBjb25zdCB1bmlmeVByb21pc2VLZXkgPSBbXG4gICAgICBzZWxlY3RvcixcbiAgICAgIHRhcmdldCxcbiAgICAgIHVuaWZ5UHJvY2VzcyxcbiAgICAgIG9ic2VydmVDb25maWdzLFxuICAgICAgZGV0ZWN0b3IsXG4gICAgICBzaWduYWwsXG4gICAgICBjdXN0b21NYXRjaGVyXG4gICAgXTtcbiAgICBjb25zdCBjYWNoZWRQcm9taXNlID0gdW5pZnlDYWNoZS5nZXQodW5pZnlQcm9taXNlS2V5KTtcbiAgICBpZiAodW5pZnlQcm9jZXNzICYmIGNhY2hlZFByb21pc2UpIHtcbiAgICAgIHJldHVybiBjYWNoZWRQcm9taXNlO1xuICAgIH1cbiAgICBjb25zdCBkZXRlY3RQcm9taXNlID0gbmV3IFByb21pc2UoXG4gICAgICAvLyBiaW9tZS1pZ25vcmUgbGludC9zdXNwaWNpb3VzL25vQXN5bmNQcm9taXNlRXhlY3V0b3I6IGF2b2lkIG5lc3RpbmcgcHJvbWlzZVxuICAgICAgYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgICAgIGFzeW5jIChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgXyBvZiBtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBkZXRlY3RSZXN1bHQyID0gYXdhaXQgZGV0ZWN0RWxlbWVudCh7XG4gICAgICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgIGRldGVjdG9yLFxuICAgICAgICAgICAgICAgIGN1c3RvbU1hdGNoZXJcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChkZXRlY3RSZXN1bHQyLmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZXRlY3RSZXN1bHQyLnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHNpZ25hbD8uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICBcImFib3J0XCIsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChzaWduYWwucmVhc29uKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgb25jZTogdHJ1ZSB9XG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGRldGVjdFJlc3VsdCA9IGF3YWl0IGRldGVjdEVsZW1lbnQoe1xuICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgIHRhcmdldCxcbiAgICAgICAgICBkZXRlY3RvcixcbiAgICAgICAgICBjdXN0b21NYXRjaGVyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZGV0ZWN0UmVzdWx0LmlzRGV0ZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShkZXRlY3RSZXN1bHQucmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCwgb2JzZXJ2ZUNvbmZpZ3MpO1xuICAgICAgfVxuICAgICkuZmluYWxseSgoKSA9PiB7XG4gICAgICB1bmlmeUNhY2hlLmRlbGV0ZSh1bmlmeVByb21pc2VLZXkpO1xuICAgIH0pO1xuICAgIHVuaWZ5Q2FjaGUuc2V0KHVuaWZ5UHJvbWlzZUtleSwgZGV0ZWN0UHJvbWlzZSk7XG4gICAgcmV0dXJuIGRldGVjdFByb21pc2U7XG4gIH07XG59XG5hc3luYyBmdW5jdGlvbiBkZXRlY3RFbGVtZW50KHtcbiAgdGFyZ2V0LFxuICBzZWxlY3RvcixcbiAgZGV0ZWN0b3IsXG4gIGN1c3RvbU1hdGNoZXJcbn0pIHtcbiAgY29uc3QgZWxlbWVudCA9IGN1c3RvbU1hdGNoZXIgPyBjdXN0b21NYXRjaGVyKHNlbGVjdG9yKSA6IHRhcmdldC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgcmV0dXJuIGF3YWl0IGRldGVjdG9yKGVsZW1lbnQpO1xufVxuY29uc3Qgd2FpdEVsZW1lbnQgPSBjcmVhdGVXYWl0RWxlbWVudCh7XG4gIGRlZmF1bHRPcHRpb25zOiBnZXREZWZhdWx0T3B0aW9ucygpXG59KTtcblxuZXhwb3J0IHsgY3JlYXRlV2FpdEVsZW1lbnQsIGdldERlZmF1bHRPcHRpb25zLCB3YWl0RWxlbWVudCB9O1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4uL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IHdhaXRFbGVtZW50IH0gZnJvbSBcIkAxbmF0c3Uvd2FpdC1lbGVtZW50XCI7XG5pbXBvcnQgeyBpc0V4aXN0LCBpc05vdEV4aXN0IH0gZnJvbSBcIkAxbmF0c3Uvd2FpdC1lbGVtZW50L2RldGVjdG9yc1wiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC11aS9zaGFyZWQudHNcbmZ1bmN0aW9uIGFwcGx5UG9zaXRpb24ocm9vdCwgcG9zaXRpb25lZEVsZW1lbnQsIG9wdGlvbnMpIHtcblx0aWYgKG9wdGlvbnMucG9zaXRpb24gPT09IFwiaW5saW5lXCIpIHJldHVybjtcblx0aWYgKG9wdGlvbnMuekluZGV4ICE9IG51bGwpIHJvb3Quc3R5bGUuekluZGV4ID0gU3RyaW5nKG9wdGlvbnMuekluZGV4KTtcblx0cm9vdC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuXHRyb290LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuXHRyb290LnN0eWxlLndpZHRoID0gXCIwXCI7XG5cdHJvb3Quc3R5bGUuaGVpZ2h0ID0gXCIwXCI7XG5cdHJvb3Quc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcblx0aWYgKHBvc2l0aW9uZWRFbGVtZW50KSBpZiAob3B0aW9ucy5wb3NpdGlvbiA9PT0gXCJvdmVybGF5XCIpIHtcblx0XHRwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblx0XHRpZiAob3B0aW9ucy5hbGlnbm1lbnQ/LnN0YXJ0c1dpdGgoXCJib3R0b20tXCIpKSBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5ib3R0b20gPSBcIjBcIjtcblx0XHRlbHNlIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMFwiO1xuXHRcdGlmIChvcHRpb25zLmFsaWdubWVudD8uZW5kc1dpdGgoXCItcmlnaHRcIikpIHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCIwXCI7XG5cdFx0ZWxzZSBwb3NpdGlvbmVkRWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwXCI7XG5cdH0gZWxzZSB7XG5cdFx0cG9zaXRpb25lZEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG5cdFx0cG9zaXRpb25lZEVsZW1lbnQuc3R5bGUudG9wID0gXCIwXCI7XG5cdFx0cG9zaXRpb25lZEVsZW1lbnQuc3R5bGUuYm90dG9tID0gXCIwXCI7XG5cdFx0cG9zaXRpb25lZEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMFwiO1xuXHRcdHBvc2l0aW9uZWRFbGVtZW50LnN0eWxlLnJpZ2h0ID0gXCIwXCI7XG5cdH1cbn1cbmZ1bmN0aW9uIGdldEFuY2hvcihvcHRpb25zKSB7XG5cdGlmIChvcHRpb25zLmFuY2hvciA9PSBudWxsKSByZXR1cm4gZG9jdW1lbnQuYm9keTtcblx0bGV0IHJlc29sdmVkID0gdHlwZW9mIG9wdGlvbnMuYW5jaG9yID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmFuY2hvcigpIDogb3B0aW9ucy5hbmNob3I7XG5cdGlmICh0eXBlb2YgcmVzb2x2ZWQgPT09IFwic3RyaW5nXCIpIGlmIChyZXNvbHZlZC5zdGFydHNXaXRoKFwiL1wiKSkgcmV0dXJuIGRvY3VtZW50LmV2YWx1YXRlKHJlc29sdmVkLCBkb2N1bWVudCwgbnVsbCwgWFBhdGhSZXN1bHQuRklSU1RfT1JERVJFRF9OT0RFX1RZUEUsIG51bGwpLnNpbmdsZU5vZGVWYWx1ZSA/PyB2b2lkIDA7XG5cdGVsc2UgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocmVzb2x2ZWQpID8/IHZvaWQgMDtcblx0cmV0dXJuIHJlc29sdmVkID8/IHZvaWQgMDtcbn1cbmZ1bmN0aW9uIG1vdW50VWkocm9vdCwgb3B0aW9ucykge1xuXHRjb25zdCBhbmNob3IgPSBnZXRBbmNob3Iob3B0aW9ucyk7XG5cdGlmIChhbmNob3IgPT0gbnVsbCkgdGhyb3cgRXJyb3IoXCJGYWlsZWQgdG8gbW91bnQgY29udGVudCBzY3JpcHQgVUk6IGNvdWxkIG5vdCBmaW5kIGFuY2hvciBlbGVtZW50XCIpO1xuXHRzd2l0Y2ggKG9wdGlvbnMuYXBwZW5kKSB7XG5cdFx0Y2FzZSB2b2lkIDA6XG5cdFx0Y2FzZSBcImxhc3RcIjpcblx0XHRcdGFuY2hvci5hcHBlbmQocm9vdCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiZmlyc3RcIjpcblx0XHRcdGFuY2hvci5wcmVwZW5kKHJvb3QpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlcGxhY2VcIjpcblx0XHRcdGFuY2hvci5yZXBsYWNlV2l0aChyb290KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJhZnRlclwiOlxuXHRcdFx0YW5jaG9yLnBhcmVudEVsZW1lbnQ/Lmluc2VydEJlZm9yZShyb290LCBhbmNob3IubmV4dEVsZW1lbnRTaWJsaW5nKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJiZWZvcmVcIjpcblx0XHRcdGFuY2hvci5wYXJlbnRFbGVtZW50Py5pbnNlcnRCZWZvcmUocm9vdCwgYW5jaG9yKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6IG9wdGlvbnMuYXBwZW5kKGFuY2hvciwgcm9vdCk7XG5cdH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZU1vdW50RnVuY3Rpb25zKGJhc2VGdW5jdGlvbnMsIG9wdGlvbnMpIHtcblx0bGV0IGF1dG9Nb3VudEluc3RhbmNlO1xuXHRjb25zdCBzdG9wQXV0b01vdW50ID0gKCkgPT4ge1xuXHRcdGF1dG9Nb3VudEluc3RhbmNlPy5zdG9wQXV0b01vdW50KCk7XG5cdFx0YXV0b01vdW50SW5zdGFuY2UgPSB2b2lkIDA7XG5cdH07XG5cdGNvbnN0IG1vdW50ID0gKCkgPT4ge1xuXHRcdGJhc2VGdW5jdGlvbnMubW91bnQoKTtcblx0fTtcblx0Y29uc3QgdW5tb3VudCA9IGJhc2VGdW5jdGlvbnMucmVtb3ZlO1xuXHRjb25zdCByZW1vdmUgPSAoKSA9PiB7XG5cdFx0c3RvcEF1dG9Nb3VudCgpO1xuXHRcdGJhc2VGdW5jdGlvbnMucmVtb3ZlKCk7XG5cdH07XG5cdGNvbnN0IGF1dG9Nb3VudCA9IChhdXRvTW91bnRPcHRpb25zKSA9PiB7XG5cdFx0aWYgKGF1dG9Nb3VudEluc3RhbmNlKSBsb2dnZXIud2FybihcImF1dG9Nb3VudCBpcyBhbHJlYWR5IHNldC5cIik7XG5cdFx0YXV0b01vdW50SW5zdGFuY2UgPSBhdXRvTW91bnRVaSh7XG5cdFx0XHRtb3VudCxcblx0XHRcdHVubW91bnQsXG5cdFx0XHRzdG9wQXV0b01vdW50XG5cdFx0fSwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdC4uLmF1dG9Nb3VudE9wdGlvbnNcblx0XHR9KTtcblx0fTtcblx0cmV0dXJuIHtcblx0XHRtb3VudCxcblx0XHRyZW1vdmUsXG5cdFx0YXV0b01vdW50XG5cdH07XG59XG5mdW5jdGlvbiBhdXRvTW91bnRVaSh1aUNhbGxiYWNrcywgb3B0aW9ucykge1xuXHRjb25zdCBhYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdGNvbnN0IEVYUExJQ0lUX1NUT1BfUkVBU09OID0gXCJleHBsaWNpdF9zdG9wX2F1dG9fbW91bnRcIjtcblx0Y29uc3QgX3N0b3BBdXRvTW91bnQgPSAoKSA9PiB7XG5cdFx0YWJvcnRDb250cm9sbGVyLmFib3J0KEVYUExJQ0lUX1NUT1BfUkVBU09OKTtcblx0XHRvcHRpb25zLm9uU3RvcD8uKCk7XG5cdH07XG5cdGxldCByZXNvbHZlZEFuY2hvciA9IHR5cGVvZiBvcHRpb25zLmFuY2hvciA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5hbmNob3IoKSA6IG9wdGlvbnMuYW5jaG9yO1xuXHRpZiAocmVzb2x2ZWRBbmNob3IgaW5zdGFuY2VvZiBFbGVtZW50KSB0aHJvdyBFcnJvcihcImF1dG9Nb3VudCBhbmQgRWxlbWVudCBhbmNob3Igb3B0aW9uIGNhbm5vdCBiZSBjb21iaW5lZC4gQXZvaWQgcGFzc2luZyBgRWxlbWVudGAgZGlyZWN0bHkgb3IgYCgpID0+IEVsZW1lbnRgIHRvIHRoZSBhbmNob3IuXCIpO1xuXHRhc3luYyBmdW5jdGlvbiBvYnNlcnZlRWxlbWVudChzZWxlY3Rvcikge1xuXHRcdGxldCBpc0FuY2hvckV4aXN0ID0gISFnZXRBbmNob3Iob3B0aW9ucyk7XG5cdFx0aWYgKGlzQW5jaG9yRXhpc3QpIHVpQ2FsbGJhY2tzLm1vdW50KCk7XG5cdFx0d2hpbGUgKCFhYm9ydENvbnRyb2xsZXIuc2lnbmFsLmFib3J0ZWQpIHRyeSB7XG5cdFx0XHRpc0FuY2hvckV4aXN0ID0gISFhd2FpdCB3YWl0RWxlbWVudChzZWxlY3RvciA/PyBcImJvZHlcIiwge1xuXHRcdFx0XHRjdXN0b21NYXRjaGVyOiAoKSA9PiBnZXRBbmNob3Iob3B0aW9ucykgPz8gbnVsbCxcblx0XHRcdFx0ZGV0ZWN0b3I6IGlzQW5jaG9yRXhpc3QgPyBpc05vdEV4aXN0IDogaXNFeGlzdCxcblx0XHRcdFx0c2lnbmFsOiBhYm9ydENvbnRyb2xsZXIuc2lnbmFsXG5cdFx0XHR9KTtcblx0XHRcdGlmIChpc0FuY2hvckV4aXN0KSB1aUNhbGxiYWNrcy5tb3VudCgpO1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHVpQ2FsbGJhY2tzLnVubW91bnQoKTtcblx0XHRcdFx0aWYgKG9wdGlvbnMub25jZSkgdWlDYWxsYmFja3Muc3RvcEF1dG9Nb3VudCgpO1xuXHRcdFx0fVxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRpZiAoYWJvcnRDb250cm9sbGVyLnNpZ25hbC5hYm9ydGVkICYmIGFib3J0Q29udHJvbGxlci5zaWduYWwucmVhc29uID09PSBFWFBMSUNJVF9TVE9QX1JFQVNPTikgYnJlYWs7XG5cdFx0XHRlbHNlIHRocm93IGVycm9yO1xuXHRcdH1cblx0fVxuXHRvYnNlcnZlRWxlbWVudChyZXNvbHZlZEFuY2hvcik7XG5cdHJldHVybiB7IHN0b3BBdXRvTW91bnQ6IF9zdG9wQXV0b01vdW50IH07XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGFwcGx5UG9zaXRpb24sIGNyZWF0ZU1vdW50RnVuY3Rpb25zLCBtb3VudFVpIH07XG4iLCIvLyNyZWdpb24gc3JjL3V0aWxzL3NwbGl0LXNoYWRvdy1yb290LWNzcy50c1xuLyoqIEBtb2R1bGUgd3h0L3V0aWxzL3NwbGl0LXNoYWRvdy1yb290LWNzcyAqL1xuY29uc3QgQVRfUlVMRV9CTE9DS1MgPSAvKFxccypAKHByb3BlcnR5fGZvbnQtZmFjZSlbXFxzXFxTXSo/e1tcXHNcXFNdKj99KS9nbTtcbi8qKlxuKiBHaXZlbiBhIENTUyBzdHJpbmcgdGhhdCB3aWxsIGJlIGxvYWRlZCBpbnRvIGEgc2hhZG93IHJvb3QsIHNwbGl0IGl0IGludG8gdHdvXG4qIHBhcnRzOlxuKlxuKiAtIGBkb2N1bWVudENzc2A6IENTUyB0aGF0IG5lZWRzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGRvY3VtZW50IChsaWtlXG4qICAgYEBwcm9wZXJ0eWApXG4qIC0gYHNoYWRvd0Nzc2A6IENTUyB0aGF0IG5lZWRzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIHNoYWRvdyByb290XG4qXG4qIEBwYXJhbSBjc3NcbiovXG5mdW5jdGlvbiBzcGxpdFNoYWRvd1Jvb3RDc3MoY3NzKSB7XG5cdHJldHVybiB7XG5cdFx0ZG9jdW1lbnRDc3M6IEFycmF5LmZyb20oY3NzLm1hdGNoQWxsKEFUX1JVTEVfQkxPQ0tTKSwgKG0pID0+IG1bMF0pLmpvaW4oXCJcIikudHJpbSgpLFxuXHRcdHNoYWRvd0NzczogY3NzLnJlcGxhY2UoQVRfUlVMRV9CTE9DS1MsIFwiXCIpLnRyaW0oKVxuXHR9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBzcGxpdFNoYWRvd1Jvb3RDc3MgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsImltcG9ydCB7IGJyb3dzZXIgYXMgYnJvd3NlciQxIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuLyoqXG4qIENvbnRhaW5zIHRoZSBgYnJvd3NlcmAgZXhwb3J0IHdoaWNoIHlvdSBzaG91bGQgdXNlIHRvIGFjY2VzcyB0aGUgZXh0ZW5zaW9uXG4qIEFQSXMgaW4geW91ciBwcm9qZWN0OlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBicm93c2VyIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuKlxuKiBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuKiAgIC8vIC4uLlxuKiB9KTtcbiogYGBgXG4qXG4qIEBtb2R1bGUgd3h0L2Jyb3dzZXJcbiovXG5jb25zdCBicm93c2VyID0gYnJvd3NlciQxO1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBicm93c2VyIH07XG4iLCIvLyBHZW5lcmF0ZWQgdXNpbmcgYG5wbSBydW4gYnVpbGRgLiBEbyBub3QgZWRpdC5cblxudmFyIHJlZ2V4ID0gL15bYS16XSg/OltcXC4wLTlfYS16XFx4QjdcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMENcXHUyMDBEXFx1MjAzRlxcdTIwNDBcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdfFtcXHVEODAwLVxcdURCN0ZdW1xcdURDMDAtXFx1REZGRl0pKi0oPzpbXFx4MkRcXC4wLTlfYS16XFx4QjdcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMENcXHUyMDBEXFx1MjAzRlxcdTIwNDBcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdfFtcXHVEODAwLVxcdURCN0ZdW1xcdURDMDAtXFx1REZGRl0pKiQvO1xuXG52YXIgaXNQb3RlbnRpYWxDdXN0b21FbGVtZW50TmFtZSA9IGZ1bmN0aW9uKHN0cmluZykge1xuXHRyZXR1cm4gcmVnZXgudGVzdChzdHJpbmcpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1BvdGVudGlhbEN1c3RvbUVsZW1lbnROYW1lO1xuIiwiaW1wb3J0IGlzUG90ZW50aWFsQ3VzdG9tRWxlbWVudE5hbWUgZnJvbSBcImlzLXBvdGVudGlhbC1jdXN0b20tZWxlbWVudC1uYW1lXCI7XG4vLyNyZWdpb24gc3JjL2luZGV4LnRzXG4vKipcbiogQnVpbHQtaW4gZWxlbWVudHMgdGhhdCBjYW4gaGF2ZSBhIHNoYWRvdyByb290IGF0dGFjaGVkIHRvIHRoZW0uXG4qXG4qIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvYXR0YWNoU2hhZG93I2VsZW1lbnRzX3lvdV9jYW5fYXR0YWNoX2Ffc2hhZG93X3RvXG4qL1xuY29uc3QgQUxMT1dFRF9TSEFET1dfRUxFTUVOVFMgPSBbXG5cdFwiYXJ0aWNsZVwiLFxuXHRcImFzaWRlXCIsXG5cdFwiYmxvY2txdW90ZVwiLFxuXHRcImJvZHlcIixcblx0XCJkaXZcIixcblx0XCJmb290ZXJcIixcblx0XCJoMVwiLFxuXHRcImgyXCIsXG5cdFwiaDNcIixcblx0XCJoNFwiLFxuXHRcImg1XCIsXG5cdFwiaDZcIixcblx0XCJoZWFkZXJcIixcblx0XCJtYWluXCIsXG5cdFwibmF2XCIsXG5cdFwicFwiLFxuXHRcInNlY3Rpb25cIixcblx0XCJzcGFuXCJcbl07XG4vKipcbiogQ3JlYXRlIGFuIEhUTUwgZWxlbWVudCB0aGF0IGhhcyBpc29sYXRlZCBzdHlsZXMgZnJvbSB0aGUgcmVzdCBvZiB0aGUgcGFnZS5cbipcbiogQGV4YW1wbGVcbiogICBjb25zdCB7IGlzb2xhdGVkRWxlbWVudCwgcGFyZW50RWxlbWVudCB9ID0gY3JlYXRlSXNvbGF0ZWRFbGVtZW50KHtcbiogICAgIG5hbWU6ICdleGFtcGxlLXVpJyxcbiogICAgIGNzczogeyB0ZXh0Q29udGVudDogJ3AgeyBjb2xvcjogcmVkIH0nIH0sXG4qICAgICBpc29sYXRlRXZlbnRzOiB0cnVlLCAvLyBvciBbJ2tleWRvd24nLCAna2V5dXAnLCAna2V5cHJlc3MnXVxuKiAgIH0pO1xuKlxuKiAgIC8vIENyZWF0ZSBhbmQgbW91bnQgeW91ciBhcHAgaW5zaWRlIHRoZSBpc29sYXRpb25cbiogICBjb25zdCB1aSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiogICB1aS50ZXh0Q29udGVudCA9ICdFeGFtcGxlIFVJJztcbiogICBpc29sYXRlZEVsZW1lbnQuYXBwZW5kQ2hpbGQodWkpO1xuKlxuKiAgIC8vIEFkZCB0aGUgVUkgdG8gdGhlIERPTVxuKiAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocGFyZW50RWxlbWVudCk7XG4qXG4qIEBwYXJhbSBvcHRpb25zXG4qIEByZXR1cm5zIEEgYHBhcmVudEVsZW1lbnRgIHRoYXQgY2FuIGJlIGFkZGVkIHRvIHRoZSBET00sIHRoZSBgc2hhZG93YCByb290LCBhbmQgYW5cbiogICBgaXNvbGF0ZWRFbGVtZW50YCB0aGF0IHlvdSBzaG91bGQgbW91bnQgeW91ciBVSSB0by5cbiovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVJc29sYXRlZEVsZW1lbnQob3B0aW9ucykge1xuXHRjb25zdCB7IG5hbWUsIG1vZGUgPSBcImNsb3NlZFwiLCBjc3MsIGlzb2xhdGVFdmVudHMgPSBmYWxzZSB9ID0gb3B0aW9ucztcblx0aWYgKCFBTExPV0VEX1NIQURPV19FTEVNRU5UUy5pbmNsdWRlcyhuYW1lKSAmJiAhaXNQb3RlbnRpYWxDdXN0b21FbGVtZW50TmFtZShuYW1lKSkgdGhyb3cgRXJyb3IoYFwiJHtuYW1lfVwiIGNhbm5vdCBoYXZlIGEgc2hhZG93IHJvb3QgYXR0YWNoZWQgdG8gaXQuIEl0IG11c3QgYmUgdHdvIHdvcmRzIGFuZCBrZWJhYi1jYXNlLCB3aXRoIGEgZmV3IGV4Y2VwdGlvbnMuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9hdHRhY2hTaGFkb3cjZWxlbWVudHNfeW91X2Nhbl9hdHRhY2hfYV9zaGFkb3dfdG9gKTtcblx0Y29uc3QgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSk7XG5cdGNvbnN0IHNoYWRvdyA9IHBhcmVudEVsZW1lbnQuYXR0YWNoU2hhZG93KHsgbW9kZSB9KTtcblx0Y29uc3QgaXNvbGF0ZWRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0aWYgKGNzcykge1xuXHRcdGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRcdGlmIChcInVybFwiIGluIGNzcykgc3R5bGUudGV4dENvbnRlbnQgPSBhd2FpdCBmZXRjaChjc3MudXJsKS50aGVuKChyZXMpID0+IHJlcy50ZXh0KCkpO1xuXHRcdGVsc2Ugc3R5bGUudGV4dENvbnRlbnQgPSBjc3MudGV4dENvbnRlbnQ7XG5cdFx0c2hhZG93LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fVxuXHRzaGFkb3cuYXBwZW5kQ2hpbGQoaXNvbGF0ZWRFbGVtZW50KTtcblx0aWYgKGlzb2xhdGVFdmVudHMpIChBcnJheS5pc0FycmF5KGlzb2xhdGVFdmVudHMpID8gaXNvbGF0ZUV2ZW50cyA6IFtcblx0XHRcImtleWRvd25cIixcblx0XHRcImtleXVwXCIsXG5cdFx0XCJrZXlwcmVzc1wiXG5cdF0pLmZvckVhY2goKGV2ZW50VHlwZSkgPT4ge1xuXHRcdHNoYWRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkpO1xuXHR9KTtcblx0cmV0dXJuIHtcblx0XHRwYXJlbnRFbGVtZW50LFxuXHRcdHNoYWRvdyxcblx0XHRpc29sYXRlZEVsZW1lbnRcblx0fTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgY3JlYXRlSXNvbGF0ZWRFbGVtZW50IH07XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tIFwiLi4vaW50ZXJuYWwvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgYXBwbHlQb3NpdGlvbiwgY3JlYXRlTW91bnRGdW5jdGlvbnMsIG1vdW50VWkgfSBmcm9tIFwiLi9zaGFyZWQubWpzXCI7XG5pbXBvcnQgeyBzcGxpdFNoYWRvd1Jvb3RDc3MgfSBmcm9tIFwiLi4vc3BsaXQtc2hhZG93LXJvb3QtY3NzLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuaW1wb3J0IHsgY3JlYXRlSXNvbGF0ZWRFbGVtZW50IH0gZnJvbSBcIkB3ZWJleHQtY29yZS9pc29sYXRlZC1lbGVtZW50XCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2NvbnRlbnQtc2NyaXB0LXVpL3NoYWRvdy1yb290LnRzXG4vKiogQG1vZHVsZSB3eHQvdXRpbHMvY29udGVudC1zY3JpcHQtdWkvc2hhZG93LXJvb3QgKi9cbi8qKlxuKiBDcmVhdGUgYSBjb250ZW50IHNjcmlwdCBVSSBpbnNpZGUgYVxuKiBbYFNoYWRvd1Jvb3RgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2hhZG93Um9vdCkuXG4qXG4qID4gVGhpcyBmdW5jdGlvbiBpcyBhc3luYyBiZWNhdXNlIGl0IGhhcyB0byBsb2FkIHRoZSBDU1MgdmlhIGEgbmV0d29yayBjYWxsLlxuKlxuKiBAcGFyYW0gb3B0aW9ucyAtIFNoYWRvdyByb290IG9wdGlvbnMuIFNlZSB7QGxpbmsgQ29udGVudFNjcmlwdFVpT3B0aW9uc30gZm9yXG4qICAgc2hhcmVkIHBvc2l0aW9uaW5nLCBhbmNob3JpbmcsIGBhcHBlbmRgLCBhbmQgcmVtb3ZhbCBvcHRpb25zLlxuKiBAc2VlIGh0dHBzOi8vd3h0LmRldi9ndWlkZS9lc3NlbnRpYWxzL2NvbnRlbnQtc2NyaXB0cy5odG1sI3NoYWRvdy1yb290XG4qL1xuYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2hhZG93Um9vdFVpKGN0eCwgb3B0aW9ucykge1xuXHRjb25zdCBpbnN0YW5jZUlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDE1KTtcblx0Y29uc3QgY3NzID0gW107XG5cdGlmICghb3B0aW9ucy5pbmhlcml0U3R5bGVzKSBjc3MucHVzaChgLyogV1hUIFNoYWRvdyBSb290IFJlc2V0ICovIDpob3N0e2FsbDppbml0aWFsICFpbXBvcnRhbnQ7fWApO1xuXHRpZiAob3B0aW9ucy5jc3MpIGNzcy5wdXNoKG9wdGlvbnMuY3NzKTtcblx0aWYgKGN0eC5vcHRpb25zPy5jc3NJbmplY3Rpb25Nb2RlID09PSBcInVpXCIpIHtcblx0XHRjb25zdCBlbnRyeUNzcyA9IGF3YWl0IGxvYWRDc3MoKTtcblx0XHRjc3MucHVzaChlbnRyeUNzcy5yZXBsYWNlQWxsKFwiOnJvb3RcIiwgXCI6aG9zdFwiKSk7XG5cdH1cblx0Y29uc3QgeyBzaGFkb3dDc3MsIGRvY3VtZW50Q3NzIH0gPSBzcGxpdFNoYWRvd1Jvb3RDc3MoY3NzLmpvaW4oXCJcXG5cIikudHJpbSgpKTtcblx0Y29uc3QgeyBpc29sYXRlZEVsZW1lbnQ6IHVpQ29udGFpbmVyLCBwYXJlbnRFbGVtZW50OiBzaGFkb3dIb3N0LCBzaGFkb3cgfSA9IGF3YWl0IGNyZWF0ZUlzb2xhdGVkRWxlbWVudCh7XG5cdFx0bmFtZTogb3B0aW9ucy5uYW1lLFxuXHRcdGNzczogeyB0ZXh0Q29udGVudDogc2hhZG93Q3NzIH0sXG5cdFx0bW9kZTogb3B0aW9ucy5tb2RlID8/IFwib3BlblwiLFxuXHRcdGlzb2xhdGVFdmVudHM6IG9wdGlvbnMuaXNvbGF0ZUV2ZW50c1xuXHR9KTtcblx0bGV0IG1vdW50ZWQ7XG5cdGNvbnN0IG1vdW50ID0gKCkgPT4ge1xuXHRcdG1vdW50VWkoc2hhZG93SG9zdCwgb3B0aW9ucyk7XG5cdFx0YXBwbHlQb3NpdGlvbihzaGFkb3dIb3N0LCB1aUNvbnRhaW5lciwgb3B0aW9ucyk7XG5cdFx0aWYgKGRvY3VtZW50Q3NzICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBzdHlsZVt3eHQtc2hhZG93LXJvb3QtZG9jdW1lbnQtc3R5bGVzPVwiJHtpbnN0YW5jZUlkfVwiXWApKSB7XG5cdFx0XHRjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0XHRcdHN0eWxlLnRleHRDb250ZW50ID0gZG9jdW1lbnRDc3M7XG5cdFx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJ3eHQtc2hhZG93LXJvb3QtZG9jdW1lbnQtc3R5bGVzXCIsIGluc3RhbmNlSWQpO1xuXHRcdFx0KGRvY3VtZW50LmhlYWQgPz8gZG9jdW1lbnQuYm9keSkuYXBwZW5kKHN0eWxlKTtcblx0XHR9XG5cdFx0bW91bnRlZCA9IG9wdGlvbnMub25Nb3VudCh1aUNvbnRhaW5lciwgc2hhZG93LCBzaGFkb3dIb3N0KTtcblx0fTtcblx0Y29uc3QgcmVtb3ZlID0gKCkgPT4ge1xuXHRcdG9wdGlvbnMub25SZW1vdmU/Lihtb3VudGVkKTtcblx0XHRzaGFkb3dIb3N0LnJlbW92ZSgpO1xuXHRcdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYHN0eWxlW3d4dC1zaGFkb3ctcm9vdC1kb2N1bWVudC1zdHlsZXM9XCIke2luc3RhbmNlSWR9XCJdYCk/LnJlbW92ZSgpO1xuXHRcdHdoaWxlICh1aUNvbnRhaW5lci5sYXN0Q2hpbGQpIHVpQ29udGFpbmVyLnJlbW92ZUNoaWxkKHVpQ29udGFpbmVyLmxhc3RDaGlsZCk7XG5cdFx0bW91bnRlZCA9IHZvaWQgMDtcblx0fTtcblx0Y29uc3QgbW91bnRGdW5jdGlvbnMgPSBjcmVhdGVNb3VudEZ1bmN0aW9ucyh7XG5cdFx0bW91bnQsXG5cdFx0cmVtb3ZlXG5cdH0sIG9wdGlvbnMpO1xuXHRjdHgub25JbnZhbGlkYXRlZChyZW1vdmUpO1xuXHRyZXR1cm4ge1xuXHRcdHNoYWRvdyxcblx0XHRzaGFkb3dIb3N0LFxuXHRcdHVpQ29udGFpbmVyLFxuXHRcdC4uLm1vdW50RnVuY3Rpb25zLFxuXHRcdGdldCBtb3VudGVkKCkge1xuXHRcdFx0cmV0dXJuIG1vdW50ZWQ7XG5cdFx0fVxuXHR9O1xufVxuLyoqIExvYWQgdGhlIENTUyBmb3IgdGhlIGN1cnJlbnQgZW50cnlwb2ludC4gKi9cbmFzeW5jIGZ1bmN0aW9uIGxvYWRDc3MoKSB7XG5cdGNvbnN0IHVybCA9IGJyb3dzZXIucnVudGltZS5nZXRVUkwoYC9jb250ZW50LXNjcmlwdHMvJHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH0uY3NzYCk7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGF3YWl0IChhd2FpdCBmZXRjaCh1cmwpKS50ZXh0KCk7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gbG9hZCBzdHlsZXMgQCAke3VybH0uIERpZCB5b3UgZm9yZ2V0IHRvIGltcG9ydCB0aGUgc3R5bGVzaGVldCBpbiB5b3VyIGVudHJ5cG9pbnQ/YCwgZXJyKTtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVTaGFkb3dSb290VWkgfTtcbiIsInZhciBlPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSx0PU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Isbj1PYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksaT0oZSx0LG4pPT4oKT0+e2lmKG4pdGhyb3cgblswXTt0cnl7cmV0dXJuIGUmJih0PWUoZT0wKSksdH1jYXRjaChlKXt0aHJvdyBuPVtlXSxlfX0sYT0odCxuKT0+e2xldCByPXt9O2Zvcih2YXIgaSBpbiB0KWUocixpLHtnZXQ6dFtpXSxlbnVtZXJhYmxlOiEwfSk7cmV0dXJuIG58fGUocixTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOmBNb2R1bGVgfSkscn0sbz0oaSxhLG8scyk9PntpZihhJiZ0eXBlb2YgYT09YG9iamVjdGB8fHR5cGVvZiBhPT1gZnVuY3Rpb25gKWZvcih2YXIgYz1uKGEpLGw9MCx1PWMubGVuZ3RoLGQ7bDx1O2wrKylkPWNbbF0sIXIuY2FsbChpLGQpJiZkIT09byYmZShpLGQse2dldDooZT0+YVtlXSkuYmluZChudWxsLGQpLGVudW1lcmFibGU6IShzPXQoYSxkKSl8fHMuZW51bWVyYWJsZX0pO3JldHVybiBpfSxzPXQ9PnIuY2FsbCh0LGBtb2R1bGUuZXhwb3J0c2ApP3RbYG1vZHVsZS5leHBvcnRzYF06byhlKHt9LGBfX2VzTW9kdWxlYCx7dmFsdWU6ITB9KSx0KSxjLGwsdSxkLGYscD1pKCgoKT0+e2M9Z2xvYmFsVGhpcyxsPSgpPT57bGV0IGU9Yy5icm93c2VyPy5ydW50aW1lPz9jLmNocm9tZT8ucnVudGltZTtpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHJ1bnRpbWUgaXMgbm90IGF2YWlsYWJsZWApO3JldHVybiBlfSx1PSgpPT57bGV0IGU9Yy5icm93c2VyPy50YWJzPz9jLmNocm9tZT8udGFicztpZighZSl0aHJvdyBFcnJvcihgRXh0ZW5zaW9uIHRhYnMgQVBJIGlzIG5vdCBhdmFpbGFibGVgKTtyZXR1cm4gZX0sZD1hc3luYygpPT57bGV0W2VdPWF3YWl0IHUoKS5xdWVyeSh7YWN0aXZlOiEwLGN1cnJlbnRXaW5kb3c6ITB9KTtyZXR1cm4gZX0sZj0oZSx0KT0+e2xldCBuPSF0LnRhcmdldE9yaWdpbnx8dC50YXJnZXRPcmlnaW49PT1gL2A/d2luZG93LmxvY2F0aW9uLm9yaWdpbjp0LnRhcmdldE9yaWdpbjtyZXR1cm4hdC5fX2ludGVybmFsJiZlLnNvdXJjZT09PWdsb2JhbFRoaXMud2luZG93JiYobj09PWAqYHx8ZS5vcmlnaW49PT12b2lkIDB8fGUub3JpZ2luPT09bikmJmUuZGF0YS5uYW1lPT09dC5uYW1lJiYodC5yZWxheUlkPT09dm9pZCAwfHxlLmRhdGEucmVsYXlJZD09PXQucmVsYXlJZCl9fSkpO2V4cG9ydHtmIGFzIGEscyBhcyBjLHAgYXMgaSxsIGFzIG4saSBhcyBvLHUgYXMgcixhIGFzIHMsZCBhcyB0fTsiLCJleHBvcnQgbGV0IHVybEFscGhhYmV0ID1cbiAgJ3VzZWFuZG9tLTI2VDE5ODM0MFBYNzVweEpBQ0tWRVJZTUlOREJVU0hXT0xGX0dRWmJmZ2hqa2xxdnd5enJpY3QnXG4iLCJcblxuaW1wb3J0IHsgdXJsQWxwaGFiZXQgfSBmcm9tICcuL3VybC1hbHBoYWJldC9pbmRleC5qcydcblxuZXhwb3J0IHsgdXJsQWxwaGFiZXQgfVxuXG5leHBvcnQgbGV0IHJhbmRvbSA9IGJ5dGVzID0+IGNyeXB0by5nZXRSYW5kb21WYWx1ZXMobmV3IFVpbnQ4QXJyYXkoYnl0ZXMpKVxuXG5leHBvcnQgbGV0IGN1c3RvbVJhbmRvbSA9IChhbHBoYWJldCwgZGVmYXVsdFNpemUsIGdldFJhbmRvbSkgPT4ge1xuICBsZXQgc2FmZUJ5dGVDdXRvZmYgPSAyNTYgLSAoMjU2ICUgYWxwaGFiZXQubGVuZ3RoKVxuXG4gIGlmIChzYWZlQnl0ZUN1dG9mZiA9PT0gMjU2KSB7XG4gICAgbGV0IG1hc2sgPSBhbHBoYWJldC5sZW5ndGggLSAxXG5cbiAgICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgICAgaWYgKCFzaXplKSByZXR1cm4gJydcbiAgICAgIGxldCBpZCA9ICcnXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc2l6ZSlcbiAgICAgICAgbGV0IGogPSBzaXplXG4gICAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdXG4gICAgICAgICAgaWYgKGlkLmxlbmd0aCA+PSBzaXplKSByZXR1cm4gaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxldCBzdGVwID0gTWF0aC5jZWlsKCgxLjYgKiAyNTYgKiBkZWZhdWx0U2l6ZSkgLyBzYWZlQnl0ZUN1dG9mZilcblxuICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgIGlmICghc2l6ZSkgcmV0dXJuICcnXG4gICAgbGV0IGlkID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbGV0IGJ5dGVzID0gZ2V0UmFuZG9tKHN0ZXApXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgaWYgKGJ5dGVzW2pdIDwgc2FmZUJ5dGVDdXRvZmYpIHtcbiAgICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAlIGFscGhhYmV0Lmxlbmd0aF1cbiAgICAgICAgICBpZiAoaWQubGVuZ3RoID49IHNpemUpIHJldHVybiBpZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplIHwgMCwgcmFuZG9tKVxuXG5leHBvcnQgbGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheSgoc2l6ZSB8PSAwKSkpXG4gIHdoaWxlIChzaXplLS0pIHtcbiAgICBpZCArPSB1cmxBbHBoYWJldFtieXRlc1tzaXplXSAmIDYzXVxuICB9XG4gIHJldHVybiBpZFxufVxuIiwiaW1wb3J0e2EgYXMgZSxpIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjtpbXBvcnR7bmFub2lkIGFzIHJ9ZnJvbVwibmFub2lkXCI7dmFyIGksYSxvPW4oKCgpPT57dCgpLGk9KHQsbixyPWdsb2JhbFRoaXMud2luZG93KT0+e2xldCBpPWFzeW5jIGk9PntsZXQgYT1pO2lmKGUoYSx0KSYmIWEuZGF0YS5yZWxheWVkKXtsZXQgZT17bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQscmVxdWVzdElkOmEuZGF0YS5yZXF1ZXN0SWQsYm9keTphLmRhdGEuYm9keX0saT10LnRhcmdldE9yaWdpbnx8YC9gO3RyeXtsZXQgbz1hd2FpdCBuPy4oZSk7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxib2R5Om8scmVsYXllZDohMH0se3RhcmdldE9yaWdpbjppfSl9Y2F0Y2goZSl7ci5wb3N0TWVzc2FnZSh7bmFtZTp0Lm5hbWUscmVsYXlJZDp0LnJlbGF5SWQsaW5zdGFuY2VJZDphLmRhdGEuaW5zdGFuY2VJZCxlcnJvcjplIGluc3RhbmNlb2YgRXJyb3I/ZS5tZXNzYWdlOlN0cmluZyhlKSxyZWxheWVkOiEwfSx7dGFyZ2V0T3JpZ2luOml9KX19fTtyZXR1cm4gci5hZGRFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKSwoKT0+ci5yZW1vdmVFdmVudExpc3RlbmVyKGBtZXNzYWdlYCxpKX0sYT0odCxuPWdsb2JhbFRoaXMud2luZG93KT0+bmV3IFByb21pc2UoKGksYSk9PntsZXQgbz1yKCkscz10LnJlcXVlc3RJZHx8cig4KSxjPXQudGFyZ2V0T3JpZ2lufHxgL2AsbD10LnRpbWVvdXRNcz8/M2U0LHU9KCk9PntuLnJlbW92ZUV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGQpLGNsZWFyVGltZW91dChmKX0sZD1uPT57bGV0IHI9bjtlKHIsdCkmJnIuZGF0YS5yZWxheWVkJiZyLmRhdGEuaW5zdGFuY2VJZD09PW8mJih1KCksci5kYXRhLmVycm9yP2EoRXJyb3IoYFJlbGF5IGVycm9yOiAke3IuZGF0YS5lcnJvcn1gKSk6aShyLmRhdGEuYm9keSkpfTtuLmFkZEV2ZW50TGlzdGVuZXIoYG1lc3NhZ2VgLGQpLG4ucG9zdE1lc3NhZ2Uoe25hbWU6dC5uYW1lLGJvZHk6dC5ib2R5LHJlbGF5SWQ6dC5yZWxheUlkLHJlcXVlc3RJZDpzLGluc3RhbmNlSWQ6byx0YXJnZXRPcmlnaW46Y30se3RhcmdldE9yaWdpbjpjfSk7bGV0IGY9c2V0VGltZW91dCgoKT0+e3UoKSxhKEVycm9yKGBSZWxheSB0aW1lb3V0IGZvciBtZXNzYWdlOiAke3QubmFtZX1gKSl9LGwpfSl9KSk7bygpO2V4cG9ydHtpIGFzIHJlbGF5LGEgYXMgc2VuZFZpYVJlbGF5LG8gYXMgdH07IiwiaW1wb3J0e2kgYXMgZSxuIGFzIHQsbyBhcyBufWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjt2YXIgcixpPW4oKCgpPT57ZSgpLHI9KCk9Pnt0KCkub25NZXNzYWdlLmFkZExpc3RlbmVyKChlLHQsbik9PmUuX19FWFRfTUVTU0FHSU5HX1NJR05BTF9fPT09YF9fRVhUX01FU1NBR0lOR19QSU5HX19gJiYobighMCksITApKX0sdHlwZW9mIGdsb2JhbFRoaXM8YHVgJiZnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZSYmcigpfSkpO2koKTtleHBvcnR7ciBhcyBpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyxpIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaT1uKCgoKT0+e2UoKSxyPWU9PntsZXQgbj1hc3luYyh0LG4scik9Pnt0cnl7YXdhaXQgZT8uKHsuLi50LHNlbmRlcjpufSx7c2VuZDplPT5yKGUpfSl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgTWVzc2FnZSBoYW5kbGVyIGVycm9yOmAsZSkscih2b2lkIDApfX0scj0oZSx0LHIpPT4obihlLHQsciksITApLGk9dCgpO3JldHVybiBpLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyKSwoKT0+e2kub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKHIpfX19KSk7aSgpO2V4cG9ydHtyIGFzIGxpc3RlbixpIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaSxhLG8scyxjPW4oKCgpPT57ZSgpLHI9bmV3IE1hcCxpPWU9PntsZXQgbj1yLmdldChlKTtpZihuKXJldHVybiBuO2xldCBpPXQoKS5jb25uZWN0KHtuYW1lOmV9KTtyZXR1cm4gci5zZXQoZSxpKSxpfSxhPWU9PntyLmRlbGV0ZShlKX0sbz0oZSx0LG4pPT57bGV0IHI9aShlKTtmdW5jdGlvbiBvKCl7YShlKSxuPy4oKX1sZXQgcz1hc3luYyBlPT57dHJ5e2F3YWl0IHQoZSl9Y2F0Y2goZSl7Y29uc29sZS5lcnJvcihgUG9ydCBoYW5kbGVyIGVycm9yOmAsZSl9fTtyZXR1cm4gci5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIocyksci5vbkRpc2Nvbm5lY3QuYWRkTGlzdGVuZXIobykse3BvcnQ6cixkaXNjb25uZWN0OigpPT57ci5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIocyksci5vbkRpc2Nvbm5lY3QucmVtb3ZlTGlzdGVuZXIobyl9fX0scz0oZSxuKT0+e2xldCByPXQoKSxpPWFzeW5jIHQ9PntpZih0Lm5hbWU9PT1lKXRyeXtsZXQgcj1hd2FpdCBuKHQpO3I/Lm9uTWVzc2FnZSYmdC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoci5vbk1lc3NhZ2UpLHQub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpPT57dHJ5e3I/Lm9uRGlzY29ubmVjdD8uKCl9Y2F0Y2godCl7Y29uc29sZS5lcnJvcihgUG9ydCBkaXNjb25uZWN0IGhhbmRsZXIgZXJyb3IgZm9yICcke2V9JzpgLHQpfX0pfWNhdGNoKG4pe2NvbnNvbGUuZXJyb3IoYFBvcnQgY29ubmVjdCBoYW5kbGVyIGVycm9yIGZvciAnJHtlfSc6YCxuKSx0LmRpc2Nvbm5lY3QoKX19O3JldHVybiByLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihpKSwoKT0+e3Iub25Db25uZWN0LnJlbW92ZUxpc3RlbmVyKGkpfX19KSk7YygpO2V4cG9ydHtpIGFzIGdldFBvcnQsbyBhcyBsaXN0ZW4scyBhcyBvblBvcnRDb25uZWN0LGEgYXMgcmVtb3ZlUG9ydCxjIGFzIHR9OyIsImltcG9ydHtpIGFzIGUsbiBhcyB0LG8gYXMgbn1mcm9tXCIuL3V0aWxzLUNjU3lobDhYLmpzXCI7dmFyIHIsaSxhLG8scyxjPW4oKCgpPT57ZSgpLGk9KCk9PihyfHw9bmV3IE1hcCxyKSxhPSgpPT57bGV0IGU9dCgpO2lmKCFlLm9uQ29ubmVjdEV4dGVybmFsKXRocm93IEVycm9yKGBvbkNvbm5lY3RFeHRlcm5hbCBub3QgYXZhaWxhYmxlLiBOZWVkIGV4dGVybmFsbHlfY29ubmVjdGFibGUgaW4gbWFuaWZlc3RgKTtyPW5ldyBNYXA7bGV0IG49aSgpO2Uub25Db25uZWN0RXh0ZXJuYWwuYWRkTGlzdGVuZXIoZT0+e2xldCB0PWUuc2VuZGVyPy50YWI/LmlkO3QmJiFuLmhhcyh0KSYmKG4uc2V0KHQsZSksZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZT0+e28oe2Zyb206dCxwYXlsb2FkOmV9KX0pLGUub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKCgpPT57bi5kZWxldGUodCl9KSl9KX0sbz1lPT57aSgpLmZvckVhY2goKHQsbik9PntuIT09ZS5mcm9tJiZ0LnBvc3RNZXNzYWdlKHsuLi5lLHRvOm59KX0pfSxzPWU9PntsZXQgbj10PT57ZSh0KX0scj10KCk7cmV0dXJuIHIub25NZXNzYWdlLmFkZExpc3RlbmVyKG4pLCgpPT57ci5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobil9fX0pKTtjKCk7ZXhwb3J0e28gYXMgYnJvYWRjYXN0LGkgYXMgZ2V0SHViTWFwLGEgYXMgc3RhcnRIdWIscyBhcyBzdWJzY3JpYmUsYyBhcyB0fTsiLCJpbXBvcnR7aSBhcyBlLG4gYXMgdCxvIGFzIG4scixzIGFzIGksdCBhcyBhfWZyb21cIi4vdXRpbHMtQ2NTeWhsOFguanNcIjtpbXBvcnR7cmVsYXkgYXMgbyxzZW5kVmlhUmVsYXkgYXMgcyx0IGFzIGN9ZnJvbVwiLi9yZWxheS5qc1wiO2ltcG9ydHtpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZyBhcyBsLHQgYXMgdX1mcm9tXCIuL2JhY2tncm91bmQuanNcIjtpbXBvcnR7bGlzdGVuIGFzIGQsdCBhcyBmfWZyb21cIi4vbWVzc2FnZS5qc1wiO2ltcG9ydHtnZXRQb3J0IGFzIHAsbGlzdGVuIGFzIG0sb25Qb3J0Q29ubmVjdCBhcyBoLHQgYXMgZ31mcm9tXCIuL3BvcnQuanNcIjtpbXBvcnR7YnJvYWRjYXN0IGFzIF8sc3RhcnRIdWIgYXMgdixzdWJzY3JpYmUgYXMgeSx0IGFzIGJ9ZnJvbVwiLi9wdWItc3ViLmpzXCI7aW1wb3J0e25hbm9pZCBhcyB4fWZyb21cIm5hbm9pZFwiO3ZhciBTPWkoe0RFRkFVTFRfTUVTU0FHRV9USU1FT1VUX01TOigpPT5DLGJyb2FkY2FzdDooKT0+XyxnZXRBY3RpdmVUYWI6KCk9PmEsZ2V0UG9ydDooKT0+cCxpbml0aWFsaXplQmFja2dyb3VuZE1lc3NhZ2luZzooKT0+bCxvbk1lc3NhZ2U6KCk9PmQsb25Qb3J0OigpPT5tLG9uUG9ydENvbm5lY3Q6KCk9PmgscmVsYXk6KCk9PmsscmVsYXlNZXNzYWdlOigpPT5PLHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQ6KCk9PkQsc2VuZFRvQmFja2dyb3VuZDooKT0+VCxzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXk6KCk9PkEsc2VuZFRvQ29udGVudFNjcmlwdDooKT0+RSxzZW5kVmlhUmVsYXk6KCk9Pmosc3RhcnRIdWI6KCk9PnYsc3Vic2NyaWJlOigpPT55fSksQyx3LFQsRSxELE8sayxBLGosTT1uKCgoKT0+e2MoKSxlKCksdSgpLGYoKSxnKCksYigpLEM9M2U0LHc9KGUsdCxuKT0+e2xldCByO3JldHVybiBQcm9taXNlLnJhY2UoW2UuZmluYWxseSgoKT0+Y2xlYXJUaW1lb3V0KHIpKSxuZXcgUHJvbWlzZSgoZSxpKT0+e3I9c2V0VGltZW91dCgoKT0+aShFcnJvcihgTWVzc2FnZSAnJHt0fScgdGltZWQgb3V0IGFmdGVyICR7bn1tc2ApKSxuKX0pXSl9LFQ9YXN5bmMgZT0+e2xldCBuPXsuLi5lLHJlcXVlc3RJZDplLnJlcXVlc3RJZHx8eCg4KX07cmV0dXJuIHcodCgpLnNlbmRNZXNzYWdlKGUuZXh0ZW5zaW9uSWQ/P251bGwsbiksU3RyaW5nKGUubmFtZSksZS50aW1lb3V0TXM/PzNlNCl9LEU9YXN5bmMgZT0+e2xldCB0PXR5cGVvZiBlLnRhYklkPT1gbnVtYmVyYD9lLnRhYklkOihhd2FpdCBhKCkpPy5pZDtpZighdCl0aHJvdyBFcnJvcihgTm8gYWN0aXZlIHRhYiBmb3VuZCB0byBzZW5kIG1lc3NhZ2UgdG8uYCk7bGV0IG49ey4uLmUscmVxdWVzdElkOmUucmVxdWVzdElkfHx4KDgpfTtyZXR1cm4gdyhyKCkuc2VuZE1lc3NhZ2UodCxuKSxTdHJpbmcoZS5uYW1lKSxlLnRpbWVvdXRNcz8/M2U0KX0sRD1FLE89ZT0+byhlLFQpLGs9TyxBPXMsaj1BfSkpO2UoKSx1KCksZigpLGcoKSxiKCksTSgpO2V4cG9ydHtDIGFzIERFRkFVTFRfTUVTU0FHRV9USU1FT1VUX01TLF8gYXMgYnJvYWRjYXN0LGEgYXMgZ2V0QWN0aXZlVGFiLHAgYXMgZ2V0UG9ydCxsIGFzIGluaXRpYWxpemVCYWNrZ3JvdW5kTWVzc2FnaW5nLFMgYXMgbixkIGFzIG9uTWVzc2FnZSxtIGFzIG9uUG9ydCxoIGFzIG9uUG9ydENvbm5lY3QsayBhcyByZWxheSxPIGFzIHJlbGF5TWVzc2FnZSxEIGFzIHNlbmRUb0FjdGl2ZUNvbnRlbnRTY3JpcHQsVCBhcyBzZW5kVG9CYWNrZ3JvdW5kLEEgYXMgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5LEUgYXMgc2VuZFRvQ29udGVudFNjcmlwdCxqIGFzIHNlbmRWaWFSZWxheSx2IGFzIHN0YXJ0SHViLHkgYXMgc3Vic2NyaWJlLE0gYXMgdH07IiwiaW1wb3J0IHtcblx0b25NZXNzYWdlLFxuXHRzZW5kVG9CYWNrZ3JvdW5kLFxuXHRzZW5kVG9CYWNrZ3JvdW5kVmlhUmVsYXksXG59IGZyb20gXCJ3ZWJleHQtbWVzc2FnZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcblx0bWF0Y2hlczogW1wiKjovLyouZXhhbXBsZS5jb20vKlwiXSxcblx0Y3NzSW5qZWN0aW9uTW9kZTogXCJ1aVwiLFxuXHRhc3luYyBtYWluKGN0eCkge1xuXHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBJbml0aWFsaXplZFwiKTtcblxuXHRcdC8vIExpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSBiYWNrZ3JvdW5kXG5cdFx0b25NZXNzYWdlPHsgdHlwZTogc3RyaW5nIH0sIHsgYWNrbm93bGVkZ2VkOiBib29sZWFuIH0+KFxuXHRcdFx0YXN5bmMgKHJlcXVlc3QsIHJlc3BvbnNlKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBSZWNlaXZlZCBmcm9tIGJhY2tncm91bmQ6XCIsIHJlcXVlc3QpO1xuXG5cdFx0XHRcdGlmIChyZXF1ZXN0Lm5hbWUgPT09IFwiY29udGVudC1ub3RpZnlcIikge1xuXHRcdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBhY2tub3dsZWRnZWQ6IHRydWUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0KTtcblxuXHRcdC8vIExpc3RlbiBmb3IgbWVzc2FnZXMgcmVsYXllZCBmcm9tIHRoZSBwb3B1cCAocG9wdXAgLT4gYmFja2dyb3VuZCAtPlxuXHRcdC8vIGhlcmUsIHNpbmNlIHNlbmRUb0NvbnRlbnRTY3JpcHQoKSBpcyBiYWNrZ3JvdW5kLW9ubHkpLlxuXHRcdG9uTWVzc2FnZTx7IG1lc3NhZ2U6IHN0cmluZyB9LCB7IGFja25vd2xlZGdlZDogYm9vbGVhbiB9Pihcblx0XHRcdGFzeW5jIChyZXF1ZXN0LCByZXNwb25zZSkgPT4ge1xuXHRcdFx0XHRpZiAocmVxdWVzdC5uYW1lID09PSBcImNvbnRlbnQtbm90aWZ5LXBvcHVwXCIpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcblx0XHRcdFx0XHRcdFwiW0NvbnRlbnQgU2NyaXB0XSBNZXNzYWdlIHJlbGF5ZWQgZnJvbSBwb3B1cDpcIixcblx0XHRcdFx0XHRcdHJlcXVlc3QuYm9keT8ubWVzc2FnZSxcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdHJlc3BvbnNlLnNlbmQoeyBhY2tub3dsZWRnZWQ6IHRydWUgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0KTtcblxuXHRcdC8vIEV4YW1wbGU6IFNlbmQgbWVzc2FnZSB0byBiYWNrZ3JvdW5kXG5cdFx0YXN5bmMgZnVuY3Rpb24gc2VuZEVjaG9NZXNzYWdlKHRleHQ6IHN0cmluZykge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZW5kVG9CYWNrZ3JvdW5kPFxuXHRcdFx0XHRcdHsgZWNobzogc3RyaW5nIH0sXG5cdFx0XHRcdFx0eyBlY2hvZWQ6IHN0cmluZyB9XG5cdFx0XHRcdD4oe1xuXHRcdFx0XHRcdG5hbWU6IFwiZWNoby1tZXNzYWdlXCIsXG5cdFx0XHRcdFx0Ym9keTogeyBlY2hvOiB0ZXh0IH0sXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBSZXNwb25zZTpcIiwgcmVzcG9uc2UpO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihcIltDb250ZW50IFNjcmlwdF0gRXJyb3I6XCIsIGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBFeGFtcGxlOiBQcm9jZXNzIGRhdGEgdGhyb3VnaCBiYWNrZ3JvdW5kXG5cdFx0YXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0RhdGEoZGF0YTogYW55KSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpbnRlcmZhY2UgRGF0YVJlc3BvbnNlIHtcblx0XHRcdFx0XHRzdGF0dXM6IFwic3VjY2Vzc1wiIHwgXCJlcnJvclwiO1xuXHRcdFx0XHRcdGRhdGE/OiBhbnk7XG5cdFx0XHRcdFx0ZXJyb3I/OiBzdHJpbmc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmQ8YW55LCBEYXRhUmVzcG9uc2U+KHtcblx0XHRcdFx0XHRuYW1lOiBcInByb2Nlc3MtZGF0YVwiLFxuXHRcdFx0XHRcdGJvZHk6IHsgdHlwZTogXCJwcm9jZXNzXCIsIHBheWxvYWQ6IGRhdGEgfSxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJbQ29udGVudCBTY3JpcHRdIFByb2Nlc3MgcmVzdWx0OlwiLCByZXNwb25zZSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKFwiW0NvbnRlbnQgU2NyaXB0XSBQcm9jZXNzIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogR2V0IGN1cnJlbnQgdGFiIGluZm9cblx0XHRhc3luYyBmdW5jdGlvbiBnZXRUYWJJbmZvKCkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0aW50ZXJmYWNlIFRhYkluZm8ge1xuXHRcdFx0XHRcdHRhYklkOiBudW1iZXI7XG5cdFx0XHRcdFx0dXJsOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmQ8e30sIFRhYkluZm8+KHtcblx0XHRcdFx0XHRuYW1lOiBcImdldC10YWItaW5mb1wiLFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gVGFiIGluZm86XCIsIHJlc3BvbnNlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbQ29udGVudCBTY3JpcHRdIFRhYiBpbmZvIGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogUmVsYXkgY29tbXVuaWNhdGlvblxuXHRcdGFzeW5jIGZ1bmN0aW9uIHJlbGF5TWVzc2FnZSh0ZXh0OiBzdHJpbmcpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgc2VuZFRvQmFja2dyb3VuZFZpYVJlbGF5PFxuXHRcdFx0XHRcdHsgbWVzc2FnZTogc3RyaW5nIH0sXG5cdFx0XHRcdFx0eyBicm9hZGNhc3RJZDogc3RyaW5nIH1cblx0XHRcdFx0Pih7XG5cdFx0XHRcdFx0bmFtZTogXCJicm9hZGNhc3QtbWVzc2FnZVwiLFxuXHRcdFx0XHRcdGJvZHk6IHsgbWVzc2FnZTogdGV4dCB9LFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIltDb250ZW50IFNjcmlwdF0gUmVsYXkgcmVzcG9uc2U6XCIsIHJlc3BvbnNlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoXCJbQ29udGVudCBTY3JpcHRdIFJlbGF5IGVycm9yOlwiLCBlcnJvcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXhhbXBsZTogQXNrIHRoZSBiYWNrZ3JvdW5kIHRvIG9wZW4gdGhlIG9wdGlvbnMgcGFnZSArIHBvcHVwIGFuZFxuXHRcdC8vIGhhbmQgZWFjaCBvZiB0aGVtIGEgbWVzc2FnZS4gQ29udGVudCBzY3JpcHRzIGNhbid0IHJlYWNoIHRob3NlIHBhZ2VzXG5cdFx0Ly8gZGlyZWN0bHkgKHRoZXkgYXJlbid0IHRhYnMpLCBzbyB0aGlzIGdvZXMgdGhyb3VnaCB0aGUgYmFja2dyb3VuZC5cblx0XHRmdW5jdGlvbiBub3RpZnlPcHRpb25zQW5kUG9wdXAodGFyZ2V0OiBcIm9wdGlvbnNcIiB8IFwicG9wdXBcIikge1xuXHRcdFx0cmV0dXJuIGFzeW5jICgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHNlbmRUb0JhY2tncm91bmQ8XG5cdFx0XHRcdFx0XHR7IHRhcmdldDogXCJvcHRpb25zXCIgfCBcInBvcHVwXCI7IG1lc3NhZ2U6IHN0cmluZyB9LFxuXHRcdFx0XHRcdFx0eyBvcGVuZWQ6IGJvb2xlYW4gfVxuXHRcdFx0XHRcdD4oe1xuXHRcdFx0XHRcdFx0bmFtZTogXCJvcGVuLWFuZC1ub3RpZnlcIixcblx0XHRcdFx0XHRcdGJvZHk6IHtcblx0XHRcdFx0XHRcdFx0dGFyZ2V0LFxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBgSGVsbG8gJHt0YXJnZXR9IGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0IGJ1dHRvbiFgLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiW0NvbnRlbnQgU2NyaXB0XSBPcGVuICYgbm90aWZ5IHJlc3BvbnNlOlwiLCByZXNwb25zZSk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcihcIltDb250ZW50IFNjcmlwdF0gT3BlbiAmIG5vdGlmeSBlcnJvcjpcIiwgZXJyb3IpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIE1ha2UgZnVuY3Rpb25zIGF2YWlsYWJsZSBvbiB3aW5kb3cgZm9yIHRlc3Rpbmdcblx0XHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0KHdpbmRvdyBhcyBhbnkpLl9fZXh0TWVzc2FnaW5nRGVtbyA9IHtcblx0XHRcdFx0c2VuZEVjaG9NZXNzYWdlLFxuXHRcdFx0XHRwcm9jZXNzRGF0YSxcblx0XHRcdFx0Z2V0VGFiSW5mbyxcblx0XHRcdFx0cmVsYXlNZXNzYWdlLFxuXHRcdFx0XHRub3RpZnlPcHRpb25zQW5kUG9wdXAsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIFJ1biBzb21lIGV4YW1wbGVzIG9uIGxvYWRcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGdldFRhYkluZm8oKTtcblx0XHRcdHNlbmRFY2hvTWVzc2FnZShcIkhlbGxvIGZyb20gY29udGVudCBzY3JpcHRcIik7XG5cdFx0XHRwcm9jZXNzRGF0YShbXCJhXCIsIFwiYlwiLCBcImNcIl0pO1xuXHRcdH0sIDEwMDApO1xuXG5cdFx0Ly8gSW5qZWN0IGEgc21hbGwgZmxvYXRpbmcgcGFuZWwgKGluIGEgc2hhZG93IHJvb3QsIHNvIGl0cyBzdHlsZXMgbmV2ZXJcblx0XHQvLyBsZWFrIGludG8gdGhlIGhvc3QgcGFnZSkgd2l0aCBidXR0b25zIGRlbW9uc3RyYXRpbmcgYm90aFxuXHRcdC8vIGNvbnRlbnQtc2NyaXB0LWluaXRpYXRlZCBmbG93cy5cblx0XHRjb25zdCB1aSA9IGF3YWl0IGNyZWF0ZVNoYWRvd1Jvb3RVaShjdHgsIHtcblx0XHRcdG5hbWU6IFwid2ViZXh0LW1lc3NhZ2UtZGVtby1wYW5lbFwiLFxuXHRcdFx0cG9zaXRpb246IFwiaW5saW5lXCIsXG5cdFx0XHRhbmNob3I6IFwiYm9keVwiLFxuXHRcdFx0b25Nb3VudDogKGNvbnRhaW5lcikgPT4ge1xuXHRcdFx0XHRjb25zdCBwYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRcdHBhbmVsLnN0eWxlLmNzc1RleHQgPSBbXG5cdFx0XHRcdFx0XCJwb3NpdGlvbjpmaXhlZFwiLFxuXHRcdFx0XHRcdFwiYm90dG9tOjE2cHhcIixcblx0XHRcdFx0XHRcInJpZ2h0OjE2cHhcIixcblx0XHRcdFx0XHRcInotaW5kZXg6MjE0NzQ4MzY0N1wiLFxuXHRcdFx0XHRcdFwiZGlzcGxheTpmbGV4XCIsXG5cdFx0XHRcdFx0XCJmbGV4LWRpcmVjdGlvbjpjb2x1bW5cIixcblx0XHRcdFx0XHRcImdhcDo4cHhcIixcblx0XHRcdFx0XHRcImZvbnQtZmFtaWx5Oi1hcHBsZS1zeXN0ZW0sQmxpbmtNYWNTeXN0ZW1Gb250LCdTZWdvZSBVSScsUm9ib3RvLHNhbnMtc2VyaWZcIixcblx0XHRcdFx0XS5qb2luKFwiO1wiKTtcblxuXHRcdFx0XHRjb25zdCBtYWtlQnV0dG9uID0gKGxhYmVsOiBzdHJpbmcsIG9uQ2xpY2s6ICgpID0+IHZvaWQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdFx0XHRcdGJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcblx0XHRcdFx0XHRidXR0b24udGV4dENvbnRlbnQgPSBsYWJlbDtcblx0XHRcdFx0XHRidXR0b24uc3R5bGUuY3NzVGV4dCA9IFtcblx0XHRcdFx0XHRcdFwicGFkZGluZzoxMHB4IDE0cHhcIixcblx0XHRcdFx0XHRcdFwiYmFja2dyb3VuZDojNjY3ZWVhXCIsXG5cdFx0XHRcdFx0XHRcImNvbG9yOiNmZmZcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyOm5vbmVcIixcblx0XHRcdFx0XHRcdFwiYm9yZGVyLXJhZGl1czo2cHhcIixcblx0XHRcdFx0XHRcdFwiY3Vyc29yOnBvaW50ZXJcIixcblx0XHRcdFx0XHRcdFwiZm9udC1zaXplOjEzcHhcIixcblx0XHRcdFx0XHRcdFwiZm9udC13ZWlnaHQ6NTAwXCIsXG5cdFx0XHRcdFx0XHRcImJveC1zaGFkb3c6MCAycHggNnB4IHJnYmEoMCwwLDAsMC4yKVwiLFxuXHRcdFx0XHRcdF0uam9pbihcIjtcIik7XG5cdFx0XHRcdFx0YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBvbkNsaWNrKTtcblx0XHRcdFx0XHRyZXR1cm4gYnV0dG9uO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdHBhbmVsLmFwcGVuZChcblx0XHRcdFx0XHRtYWtlQnV0dG9uKFwi8J+TpCBTZW5kIHRvIEJhY2tncm91bmRcIiwgKCkgPT5cblx0XHRcdFx0XHRcdHNlbmRFY2hvTWVzc2FnZShcIkhlbGxvIGZyb20gdGhlIGNvbnRlbnQgc2NyaXB0IGJ1dHRvblwiKSxcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdG1ha2VCdXR0b24oXCLwn5SUIE5vdGlmeSBPcHRpb25zXCIsIG5vdGlmeU9wdGlvbnNBbmRQb3B1cChcIm9wdGlvbnNcIikpLFxuXHRcdFx0XHRcdG1ha2VCdXR0b24oXCLwn5SUIE5vdGlmeSBQb3B1cFwiLCBub3RpZnlPcHRpb25zQW5kUG9wdXAoXCJwb3B1cFwiKSksXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29udGFpbmVyLmFwcGVuZChwYW5lbCk7XG5cdFx0XHR9LFxuXHRcdH0pO1xuXG5cdFx0dWkubW91bnQoKTtcblx0fSxcbn0pO1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xuXHRjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuXHRcdHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuXHRcdHRoaXMubmV3VXJsID0gbmV3VXJsO1xuXHRcdHRoaXMub2xkVXJsID0gb2xkVXJsO1xuXHR9XG59O1xuLyoqXG4qIFJldHVybnMgYW4gZXZlbnQgbmFtZSB1bmlxdWUgdG8gdGhlIGV4dGVuc2lvbiBhbmQgY29udGVudCBzY3JpcHQgdGhhdCdzXG4qIHJ1bm5pbmcuXG4qL1xuZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRyZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQsIGdldFVuaXF1ZUV2ZW50TmFtZSB9O1xuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIudHNcbmNvbnN0IHN1cHBvcnRzTmF2aWdhdGlvbkFwaSA9IHR5cGVvZiBnbG9iYWxUaGlzLm5hdmlnYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwiZnVuY3Rpb25cIjtcbi8qKlxuKiBDcmVhdGUgYSB1dGlsIHRoYXQgd2F0Y2hlcyBmb3IgVVJMIGNoYW5nZXMsIGRpc3BhdGNoaW5nIHRoZSBjdXN0b20gZXZlbnQgd2hlblxuKiBkZXRlY3RlZC4gU3RvcHMgd2F0Y2hpbmcgd2hlbiBjb250ZW50IHNjcmlwdCBpcyBpbnZhbGlkYXRlZC4gVXNlcyBOYXZpZ2F0aW9uXG4qIEFQSSB3aGVuIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbiovXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG5cdGxldCBsYXN0VXJsO1xuXHRsZXQgd2F0Y2hpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHsgcnVuKCkge1xuXHRcdGlmICh3YXRjaGluZykgcmV0dXJuO1xuXHRcdHdhdGNoaW5nID0gdHJ1ZTtcblx0XHRsYXN0VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRpZiAoc3VwcG9ydHNOYXZpZ2F0aW9uQXBpKSBnbG9iYWxUaGlzLm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmID09PSBsYXN0VXJsLmhyZWYpIHJldHVybjtcblx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHR9LCB7IHNpZ25hbDogY3R4LnNpZ25hbCB9KTtcblx0XHRlbHNlIGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmICE9PSBsYXN0VXJsLmhyZWYpIHtcblx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0XHR9XG5cdFx0fSwgMWUzKTtcblx0fSB9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfTtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0LnRzXG4vKipcbiogSW1wbGVtZW50c1xuKiBbYEFib3J0Q29udHJvbGxlcmBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BYm9ydENvbnRyb2xsZXIpLlxuKiBVc2VkIHRvIGRldGVjdCBhbmQgc3RvcCBjb250ZW50IHNjcmlwdCBjb2RlIHdoZW4gdGhlIHNjcmlwdCBpcyBpbnZhbGlkYXRlZC5cbipcbiogSXQgYWxzbyBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdGllcyBsaWtlIGBjdHguc2V0VGltZW91dGAgYW5kXG4qIGBjdHguc2V0SW50ZXJ2YWxgIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW4gY29udGVudCBzY3JpcHRzIGluc3RlYWQgb2ZcbiogYHdpbmRvdy5zZXRUaW1lb3V0YCBvciBgd2luZG93LnNldEludGVydmFsYC5cbipcbiogVG8gY3JlYXRlIGNvbnRleHQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gdXNlIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yOlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9IGZyb20gJ3d4dC91dGlscy9jb250ZW50LXNjcmlwdHMtY29udGV4dCc7XG4qXG4qIHRlc3QoJ3N0b3JhZ2UgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiBjb250ZXh0IGlzIGludmFsaWRhdGVkJywgKCkgPT4ge1xuKiAgIGNvbnN0IGN0eCA9IG5ldyBDb250ZW50U2NyaXB0Q29udGV4dCgndGVzdCcpO1xuKiAgIGNvbnN0IGl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW0oJ2xvY2FsOmNvdW50JywgeyBkZWZhdWx0VmFsdWU6IDAgfSk7XG4qICAgY29uc3Qgd2F0Y2hlciA9IHZpLmZuKCk7XG4qXG4qICAgY29uc3QgdW53YXRjaCA9IGl0ZW0ud2F0Y2god2F0Y2hlcik7XG4qICAgY3R4Lm9uSW52YWxpZGF0ZWQodW53YXRjaCk7IC8vIExpc3RlbiBmb3IgaW52YWxpZGF0ZSBoZXJlXG4qXG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkV2l0aCgxLCAwKTtcbipcbiogICBjdHgubm90aWZ5SW52YWxpZGF0ZWQoKTsgLy8gVXNlIHRoaXMgZnVuY3Rpb24gdG8gaW52YWxpZGF0ZSB0aGUgY29udGV4dFxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMik7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogfSk7XG4qIGBgYFxuKi9cbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcblx0c3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCIpO1xuXHRpZDtcblx0YWJvcnRDb250cm9sbGVyO1xuXHRsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG5cdGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXHRcdHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcblx0XHR0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuXHR9XG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcblx0fVxuXHRhYm9ydChyZWFzb24pIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcblx0fVxuXHRnZXQgaXNJbnZhbGlkKCkge1xuXHRcdGlmIChicm93c2VyLnJ1bnRpbWU/LmlkID09IG51bGwpIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHRyZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcblx0fVxuXHRnZXQgaXNWYWxpZCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuXHR9XG5cdC8qKlxuXHQqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpc1xuXHQqIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuXHQqICAgY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcblx0KiAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG5cdCogICB9KTtcblx0KiAgIC8vIC4uLlxuXHQqICAgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuXHQqXG5cdCogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuXHQqL1xuXHRvbkludmFsaWRhdGVkKGNiKSB7XG5cdFx0dGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0fVxuXHQvKipcblx0KiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvblxuXHQqIHRoYXQgc2hvdWxkbid0IHJ1biBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG5cdCogICAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG5cdCpcblx0KiAgICAgLy8gLi4uXG5cdCogICB9O1xuXHQqL1xuXHRibG9jaygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEludGVydmFscyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNsZWFySW50ZXJ2YWxgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBUaW1lb3V0cyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYHNldFRpbWVvdXRgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzXG5cdCogdGhlIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWBcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0pO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZVxuXHQqIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHRhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcblx0XHR9XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/Lih0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSwgaGFuZGxlciwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHNpZ25hbDogdGhpcy5zaWduYWxcblx0XHR9KTtcblx0fVxuXHQvKipcblx0KiBAaW50ZXJuYWxcblx0KiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cblx0Ki9cblx0bm90aWZ5SW52YWxpZGF0ZWQoKSB7XG5cdFx0dGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG5cdFx0bG9nZ2VyLmRlYnVnKGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYCk7XG5cdH1cblx0c3RvcE9sZFNjcmlwdHMoKSB7XG5cdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCB7IGRldGFpbDoge1xuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9IH0pKTtcblx0XHRpZiAoIXRoaXMub3B0aW9ucz8ubm9TY3JpcHRTdGFydGVkUG9zdE1lc3NhZ2UpIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG5cdFx0XHR0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0sIFwiKlwiKTtcblx0fVxuXHR2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcblx0XHRjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGV0YWlsPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcblx0XHRjb25zdCBpc0Zyb21TZWxmID0gZXZlbnQuZGV0YWlsPy5tZXNzYWdlSWQgPT09IHRoaXMuaWQ7XG5cdFx0cmV0dXJuIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgIWlzRnJvbVNlbGY7XG5cdH1cblx0bGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuXHRcdGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB8fCAhdGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSByZXR1cm47XG5cdFx0XHR0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpKTtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxNCwxNSwyMywyNCwyNV0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQ0EsU0FBUyxvQkFBb0IsWUFBWTtFQUN4QyxPQUFPO0NBQ1I7OztDQ0ZBLFNBQVNBLFFBQU0sUUFBUSxHQUFHLE1BQU07RUFFL0IsSUFBSSxPQUFPLEtBQUssT0FBTyxVQUFVLE9BQU8sU0FBUyxLQUFLLE1BQU0sS0FBSyxHQUFHLElBQUk7T0FDbkUsT0FBTyxTQUFTLEdBQUcsSUFBSTtDQUM3Qjs7Q0FFQSxJ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