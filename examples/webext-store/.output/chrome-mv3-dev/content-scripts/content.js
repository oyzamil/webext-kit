(function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
	//#endregion
	//#region ../../node_modules/.bun/superlock@1.3.5/node_modules/superlock/src/create.js
	var require_create = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Node = class {
			constructor(data) {
				this.data = data;
			}
		};
		var LinkedList = class {
			constructor() {
				this.length = 0;
			}
			enqueue(data) {
				const node = new Node(data);
				node.prev = this.tail;
				if (this.tail) this.tail.next = node;
				else this.head = node;
				this.tail = node;
				this.length++;
				return node;
			}
			dequeue() {
				if (!this.head) return;
				const { data } = this.head;
				this.remove(this.head);
				return data;
			}
			remove(node) {
				if (node.prev) node.prev.next = node.next;
				else this.head = node.next;
				if (node.next) node.next.prev = node.prev;
				else this.tail = node.prev;
				this.length--;
			}
			size() {
				return this.length;
			}
		};
		module.exports = (slots = 1) => {
			const queue = new LinkedList();
			const release = () => {
				++slots;
				const waiter = queue.dequeue();
				if (waiter) return waiter.acquire();
			};
			const acquire = (resolve) => {
				--slots;
				resolve(release);
			};
			const lock = (signal) => new Promise((resolve) => {
				if (signal != null && typeof signal.addEventListener !== "function") throw new TypeError("`signal` needs to be an AbortSignal.");
				if (signal?.aborted) return resolve(null);
				if (!lock.isLocked()) return acquire(resolve);
				const waiter = { acquire: () => acquire(resolve) };
				const node = queue.enqueue(waiter);
				if (signal != null) {
					const onAbort = () => {
						queue.remove(node);
						resolve(null);
					};
					waiter.acquire = () => {
						signal.removeEventListener("abort", onAbort);
						acquire(resolve);
					};
					signal.addEventListener("abort", onAbort, { once: true });
				}
			});
			lock.isLocked = () => slots === 0;
			lock.awaiting = () => queue.size();
			return lock;
		};
	}));
	//#endregion
	//#region ../../packages/webext-store/dist/src-CxWF9kj-.mjs
	var import_src = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
		var createLock = require_create();
		var withLock = (opts) => {
			const lock = createLock(opts);
			const withLock = async (fn, signal) => {
				const release = await lock(signal);
				if (!release) return;
				try {
					return await fn();
				} finally {
					release();
				}
			};
			withLock.isLocked = lock.isLocked;
			withLock.awaiting = lock.awaiting;
			return withLock;
		};
		module.exports = {
			withLock,
			createLock
		};
	})))();
	var has = Object.prototype.hasOwnProperty;
	function dequal(foo, bar) {
		var ctor, len;
		if (foo === bar) return true;
		if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
			if (ctor === Date) return foo.getTime() === bar.getTime();
			if (ctor === RegExp) return foo.toString() === bar.toString();
			if (ctor === Array) {
				if ((len = foo.length) === bar.length) while (len-- && dequal(foo[len], bar[len]));
				return len === -1;
			}
			if (!ctor || typeof foo === "object") {
				len = 0;
				for (ctor in foo) {
					if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
					if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
				}
				return Object.keys(bar).length === len;
			}
		}
		return foo !== foo && bar !== bar;
	}
	/** Migration error for version migrations */
	var MigrationError = class extends Error {
		key;
		version;
		constructor(key, version, options) {
			super(`v${version} migration failed for "${key}"`, options);
			this.key = key;
			this.version = version;
		}
	};
	var globals = globalThis;
	var browser$2 = globals.browser ?? globals.chrome ?? {};
	/**
	* Simplified, type-safe storage APIs for browser extensions, with support for
	* versioned fields, snapshots, metadata, and item definitions.
	*
	* @module webext-store
	*/
	var storage = createStorage();
	function createStorage() {
		const drivers = {
			local: createDriver("local"),
			session: createDriver("session"),
			sync: createDriver("sync"),
			managed: createDriver("managed")
		};
		const getDriver = (area) => {
			const driver = drivers[area];
			if (driver == null) {
				const areaNames = Object.keys(drivers).join(", ");
				throw Error(`Invalid area "${area}". Options: ${areaNames}`);
			}
			return driver;
		};
		const resolveKey = (key) => {
			const deliminatorIndex = key.indexOf(":");
			const driverArea = key.substring(0, deliminatorIndex);
			const driverKey = key.substring(deliminatorIndex + 1);
			if (driverKey == null) throw Error(`Storage key should be in the form of "area:key", but received "${key}"`);
			return {
				driverArea,
				driverKey,
				driver: getDriver(driverArea)
			};
		};
		const getMetaKey = (key) => `${key}$`;
		const mergeMeta = (oldMeta, newMeta) => {
			const newFields = { ...oldMeta };
			Object.entries(newMeta).forEach(([key, value]) => {
				if (value == null) delete newFields[key];
				else newFields[key] = value;
			});
			return newFields;
		};
		const getValueOrFallback = (value, fallback) => value ?? fallback ?? null;
		const getMetaValue = (properties) => typeof properties === "object" && !Array.isArray(properties) ? properties : {};
		const getItem = async (driver, driverKey, opts) => {
			const res = await driver.getItem(driverKey);
			return getValueOrFallback(res, opts?.fallback);
		};
		const getMeta = async (driver, driverKey) => {
			const metaKey = getMetaKey(driverKey);
			const res = await driver.getItem(metaKey);
			return getMetaValue(res);
		};
		const setItem = async (driver, driverKey, value) => {
			await driver.setItem(driverKey, value ?? null);
		};
		const setMeta = async (driver, driverKey, properties) => {
			const metaKey = getMetaKey(driverKey);
			const existingFields = getMetaValue(await driver.getItem(metaKey));
			await driver.setItem(metaKey, mergeMeta(existingFields, properties));
		};
		const removeItem = async (driver, driverKey, opts) => {
			await driver.removeItem(driverKey);
			if (opts?.removeMeta) {
				const metaKey = getMetaKey(driverKey);
				await driver.removeItem(metaKey);
			}
		};
		const removeMeta = async (driver, driverKey, properties) => {
			const metaKey = getMetaKey(driverKey);
			if (properties == null) await driver.removeItem(metaKey);
			else {
				const newFields = getMetaValue(await driver.getItem(metaKey));
				[properties].flat().forEach((field) => {
					delete newFields[field];
				});
				await driver.setItem(metaKey, newFields);
			}
		};
		const watch = (driver, driverKey, cb) => driver.watch(driverKey, cb);
		return {
			getItem: async (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				return await getItem(driver, driverKey, opts);
			},
			getItems: async (keys) => {
				const areaToKeyMap = /* @__PURE__ */ new Map();
				const keyToOptsMap = /* @__PURE__ */ new Map();
				const orderedKeys = [];
				keys.forEach((key) => {
					let keyStr;
					let opts;
					if (typeof key === "string") keyStr = key;
					else if ("getValue" in key) {
						keyStr = key.key;
						opts = { fallback: key.fallback };
					} else if ("item" in key) {
						keyStr = key.item.key;
						opts = { fallback: key.item.fallback };
					} else {
						keyStr = key.key;
						opts = key.options;
					}
					orderedKeys.push(keyStr);
					const { driverArea, driverKey } = resolveKey(keyStr);
					const areaKeys = areaToKeyMap.get(driverArea) ?? [];
					areaToKeyMap.set(driverArea, areaKeys.concat(driverKey));
					keyToOptsMap.set(keyStr, opts);
				});
				const resultsMap = /* @__PURE__ */ new Map();
				await Promise.all(Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys]) => {
					(await drivers[driverArea].getItems(keys)).forEach((driverResult) => {
						const key = `${driverArea}:${driverResult.key}`;
						const opts = keyToOptsMap.get(key);
						const value = getValueOrFallback(driverResult.value, opts?.fallback ?? opts?.fallback);
						resultsMap.set(key, value);
					});
				}));
				return orderedKeys.map((key) => ({
					key,
					value: resultsMap.get(key)
				}));
			},
			getMeta: async (key) => {
				const { driver, driverKey } = resolveKey(key);
				return await getMeta(driver, driverKey);
			},
			getMetas: async (args) => {
				const keys = args.map((arg) => {
					const key = typeof arg === "string" ? arg : arg.key;
					const { driverArea, driverKey } = resolveKey(key);
					return {
						key,
						driverArea,
						driverKey,
						driverMetaKey: getMetaKey(driverKey)
					};
				});
				const areaToDriverMetaKeysMap = keys.reduce((map, key) => {
					map[key.driverArea] ??= [];
					map[key.driverArea]?.push(key);
					return map;
				}, {});
				const resultsMap = {};
				const storage = browser$2.storage;
				if (!storage) throw new Error("Browser storage API is unavailable");
				await Promise.all(Object.entries(areaToDriverMetaKeysMap).map(async ([area, keys]) => {
					const areaRes = await storage[area].get(keys.map((key) => key.driverMetaKey));
					keys.forEach((key) => {
						resultsMap[key.key] = areaRes[key.driverMetaKey] ?? {};
					});
				}));
				return keys.map((key) => ({
					key: key.key,
					meta: resultsMap[key.key]
				}));
			},
			setItem: async (key, value) => {
				const { driver, driverKey } = resolveKey(key);
				await setItem(driver, driverKey, value);
			},
			setItems: async (items) => {
				const areaToKeyValueMap = {};
				items.forEach((item) => {
					const { driverArea, driverKey } = resolveKey("key" in item ? item.key : item.item.key);
					areaToKeyValueMap[driverArea] ??= [];
					areaToKeyValueMap[driverArea].push({
						key: driverKey,
						value: item.value
					});
				});
				await Promise.all(Object.entries(areaToKeyValueMap).map(async ([driverArea, values]) => {
					await getDriver(driverArea).setItems(values);
				}));
			},
			setMeta: async (key, properties) => {
				const { driver, driverKey } = resolveKey(key);
				await setMeta(driver, driverKey, properties);
			},
			setMetas: async (items) => {
				const areaToMetaUpdatesMap = {};
				items.forEach((item) => {
					const { driverArea, driverKey } = resolveKey("key" in item ? item.key : item.item.key);
					areaToMetaUpdatesMap[driverArea] ??= [];
					areaToMetaUpdatesMap[driverArea].push({
						key: driverKey,
						properties: item.meta
					});
				});
				await Promise.all(Object.entries(areaToMetaUpdatesMap).map(async ([storageArea, updates]) => {
					const driver = getDriver(storageArea);
					const metaKeys = updates.map(({ key }) => getMetaKey(key));
					const existingMetas = await driver.getItems(metaKeys);
					const existingMetaMap = Object.fromEntries(existingMetas.map(({ key, value }) => [key, getMetaValue(value)]));
					const metaUpdates = updates.map(({ key, properties }) => {
						const metaKey = getMetaKey(key);
						return {
							key: metaKey,
							value: mergeMeta(existingMetaMap[metaKey] ?? {}, properties)
						};
					});
					await driver.setItems(metaUpdates);
				}));
			},
			removeItem: async (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				await removeItem(driver, driverKey, opts);
			},
			removeItems: async (keys) => {
				const areaToKeysMap = {};
				keys.forEach((key) => {
					let keyStr;
					let opts;
					if (typeof key === "string") keyStr = key;
					else if ("getValue" in key) keyStr = key.key;
					else if ("item" in key) {
						keyStr = key.item.key;
						opts = key.options;
					} else {
						keyStr = key.key;
						opts = key.options;
					}
					const { driverArea, driverKey } = resolveKey(keyStr);
					areaToKeysMap[driverArea] ??= [];
					areaToKeysMap[driverArea].push(driverKey);
					if (opts?.removeMeta) areaToKeysMap[driverArea].push(getMetaKey(driverKey));
				});
				await Promise.all(Object.entries(areaToKeysMap).map(async ([driverArea, keys]) => {
					await getDriver(driverArea).removeItems(keys);
				}));
			},
			clear: async (base) => {
				await getDriver(base).clear();
			},
			removeMeta: async (key, properties) => {
				const { driver, driverKey } = resolveKey(key);
				await removeMeta(driver, driverKey, properties);
			},
			snapshot: async (base, opts) => {
				const data = await getDriver(base).snapshot();
				opts?.excludeKeys?.forEach((key) => {
					delete data[key];
					delete data[getMetaKey(key)];
				});
				return data;
			},
			restoreSnapshot: async (base, data) => {
				await getDriver(base).restoreSnapshot(data);
			},
			watch: (key, cb) => {
				const { driver, driverKey } = resolveKey(key);
				return watch(driver, driverKey, cb);
			},
			unwatch() {
				Object.values(drivers).forEach((driver) => {
					driver.unwatch();
				});
			},
			defineItem: (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				const { version: targetVersion = 1, migrations = {}, onMigrationComplete, debug = false } = opts ?? {};
				if (targetVersion < 1) throw Error("Storage item version cannot be less than 1. Initial versions should be set to 1, not 0.");
				let needsVersionSet = false;
				const migrate = async () => {
					const driverMetaKey = getMetaKey(driverKey);
					const [{ value }, { value: meta }] = await driver.getItems([driverKey, driverMetaKey]);
					needsVersionSet = value == null && meta?.v == null && !!targetVersion;
					if (value == null) return;
					const currentVersion = meta?.v ?? 1;
					if (currentVersion > targetVersion) throw Error(`Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`);
					if (currentVersion === targetVersion) return;
					if (debug) console.debug(`[webext-store] Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`);
					const migrationsToRun = Array.from({ length: targetVersion - currentVersion }, (_, i) => currentVersion + i + 1);
					let migratedValue = value;
					for (const migrateToVersion of migrationsToRun) try {
						migratedValue = await migrations?.[migrateToVersion]?.(migratedValue) ?? migratedValue;
						if (debug) console.debug(`[webext-store] Storage migration processed for version: v${migrateToVersion}`);
					} catch (err) {
						throw new MigrationError(key, migrateToVersion, { cause: err });
					}
					await driver.setItems([{
						key: driverKey,
						value: migratedValue
					}, {
						key: driverMetaKey,
						value: {
							...meta,
							v: targetVersion
						}
					}]);
					if (debug) console.debug(`[webext-store] Storage migration completed for ${key} v${targetVersion}`, { migratedValue });
					onMigrationComplete?.(migratedValue, targetVersion);
				};
				const migrationsDone = opts?.migrations == null ? Promise.resolve() : migrate().catch((err) => {
					console.error(`[webext-store] Migration failed for ${key}`, err);
				});
				const initLock = (0, import_src.withLock)();
				const getFallback = () => opts?.fallback ?? opts?.defaultValue ?? null;
				const getOrInitValue = () => initLock(async () => {
					const value = await driver.getItem(driverKey);
					if (value != null || opts?.init == null) return value;
					const newValue = await opts.init();
					await driver.setItem(driverKey, newValue);
					if (value == null && targetVersion > 1) await setMeta(driver, driverKey, { v: targetVersion });
					return newValue;
				});
				migrationsDone.then(getOrInitValue);
				return {
					key,
					get defaultValue() {
						return getFallback();
					},
					get fallback() {
						return getFallback();
					},
					getValue: async () => {
						await migrationsDone;
						if (opts?.init) return await getOrInitValue();
						else return await getItem(driver, driverKey, opts);
					},
					getMeta: async () => {
						await migrationsDone;
						return await getMeta(driver, driverKey);
					},
					setValue: async (value) => {
						await migrationsDone;
						if (needsVersionSet) {
							needsVersionSet = false;
							await Promise.all([setItem(driver, driverKey, value), setMeta(driver, driverKey, { v: targetVersion })]);
						} else await setItem(driver, driverKey, value);
					},
					setMeta: async (properties) => {
						await migrationsDone;
						return await setMeta(driver, driverKey, properties);
					},
					removeValue: async (opts) => {
						await migrationsDone;
						return await removeItem(driver, driverKey, opts);
					},
					removeMeta: async (properties) => {
						await migrationsDone;
						return await removeMeta(driver, driverKey, properties);
					},
					watch: (cb) => watch(driver, driverKey, (newValue, oldValue) => cb(newValue ?? getFallback(), oldValue ?? getFallback())),
					migrate
				};
			}
		};
	}
	function createDriver(storageArea) {
		const getStorageArea = () => {
			if (browser$2.runtime == null) throw Error(`'webext-store' must be loaded in a web extension environment.`);
			if (browser$2.storage == null) throw Error("You must add the 'storage' permission to your manifest to use 'webext-store'");
			const area = browser$2.storage[storageArea];
			if (area == null) throw Error(`"browser.storage.${storageArea}" is undefined`);
			return area;
		};
		const watchListeners = /* @__PURE__ */ new Set();
		return {
			getItem: async (key) => {
				return (await getStorageArea().get(key))[key];
			},
			getItems: async (keys) => {
				const result = await getStorageArea().get(keys);
				return keys.map((key) => ({
					key,
					value: result[key] ?? null
				}));
			},
			setItem: async (key, value) => {
				if (value == null) await getStorageArea().remove(key);
				else await getStorageArea().set({ [key]: value });
			},
			setItems: async (values) => {
				const map = values.reduce((map, { key, value }) => {
					map[key] = value;
					return map;
				}, {});
				await getStorageArea().set(map);
			},
			removeItem: async (key) => {
				await getStorageArea().remove(key);
			},
			removeItems: async (keys) => {
				await getStorageArea().remove(keys);
			},
			clear: async () => {
				await getStorageArea().clear();
			},
			snapshot: async () => {
				return await getStorageArea().get();
			},
			restoreSnapshot: async (data) => {
				await getStorageArea().set(data);
			},
			watch(key, cb) {
				const listener = (changes) => {
					const change = changes[key];
					if (change == null || dequal(change.newValue, change.oldValue)) return;
					cb(change.newValue ?? null, change.oldValue ?? null);
				};
				getStorageArea().onChanged.addListener(listener);
				watchListeners.add(listener);
				return () => {
					getStorageArea().onChanged.removeListener(listener);
					watchListeners.delete(listener);
				};
			},
			unwatch() {
				watchListeners.forEach((listener) => {
					getStorageArea().onChanged.removeListener(listener);
				});
				watchListeners.clear();
			}
		};
	}
	storage.defineItem("sync:settings", {
		fallback: {
			theme: "light",
			displayName: "Guest"
		},
		version: 3,
		migrations: {
			2: (old) => ({
				...old,
				theme: old?.theme ?? "light"
			}),
			3: (old) => ({
				...old,
				displayName: old?.displayName ?? "Guest"
			})
		},
		debug: true,
		onMigrationComplete: (value, targetVersion) => {
			console.log(`[webext-store-demo] settings migrated to v${targetVersion}`, value);
		}
	});
	storage.defineItem("local:installId", { init: () => crypto.randomUUID() });
	/**
	* A plain counter with a fallback of 0. Written to from the popup (via the
	* React hook), the background (on an alarm + on message), and read from
	* both — this is what the "Cross-context" tab uses to prove `watch()` fires
	* across execution contexts.
	*/
	var heartbeatItem = storage.defineItem("local:heartbeat", { fallback: 0 });
	storage.defineItem("local:appSetting", { fallback: {
		theme: "dark",
		free: true
	} });
	//#endregion
	//#region src/entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["*://*/*"],
		runAt: "document_idle",
		main() {
			const badge = document.createElement("div");
			badge.setAttribute("style", [
				"position:fixed",
				"bottom:12px",
				"right:12px",
				"z-index:2147483647",
				"padding:6px 10px",
				"border-radius:8px",
				"background:#1e293b",
				"color:#6ee7b7",
				"font:600 11px/1.4 monospace",
				"box-shadow:0 2px 8px rgba(0,0,0,.25)",
				"pointer-events:none",
				"opacity:0.85"
			].join(";"));
			badge.textContent = "webext-store heartbeat: …";
			document.documentElement.appendChild(badge);
			const render = (n) => {
				badge.textContent = `webext-store heartbeat: ${n}`;
			};
			heartbeatItem.getValue().then(render);
			const unwatch = heartbeatItem.watch((newValue) => render(newValue));
			window.addEventListener("pagehide", unwatch, { once: true });
		}
	});
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/logger.mjs
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
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/browser.mjs
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
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/custom-events.mjs
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
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/location-watcher.mjs
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
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/content-script-context.mjs
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
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?D:/Projects/webext-kit/examples/webext-store/src/entrypoints/content.ts
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJ3aXRoTG9jayIsInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3N1cGVybG9ja0AxLjMuNS9ub2RlX21vZHVsZXMvc3VwZXJsb2NrL3NyYy9jcmVhdGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9zdXBlcmxvY2tAMS4zLjUvbm9kZV9tb2R1bGVzL3N1cGVybG9jay9zcmMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtc3RvcmUvZGlzdC9zcmMtQ3hXRjlrai0ubWpzIiwiLi4vLi4vLi4vc3JjL3V0aWxzL3N0b3JhZ2UtaXRlbXMudHMiLCIuLi8uLi8uLi9zcmMvZW50cnlwb2ludHMvY29udGVudC50cyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvbG9nZ2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40KzAwN2RmYmM0MmY1YTQyNzYvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCswMDdkZmJjNDJmNWE0Mjc2L25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvY29udGVudC1zY3JpcHQtY29udGV4dC5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8jcmVnaW9uIHNyYy91dGlscy9kZWZpbmUtY29udGVudC1zY3JpcHQudHNcbmZ1bmN0aW9uIGRlZmluZUNvbnRlbnRTY3JpcHQoZGVmaW5pdGlvbikge1xuXHRyZXR1cm4gZGVmaW5pdGlvbjtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQ29udGVudFNjcmlwdCB9O1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3RvciAoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGFcbiAgfVxufVxuXG5jbGFzcyBMaW5rZWRMaXN0IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMubGVuZ3RoID0gMFxuICB9XG5cbiAgZW5xdWV1ZSAoZGF0YSkge1xuICAgIGNvbnN0IG5vZGUgPSBuZXcgTm9kZShkYXRhKVxuICAgIG5vZGUucHJldiA9IHRoaXMudGFpbFxuICAgIGlmICh0aGlzLnRhaWwpIHRoaXMudGFpbC5uZXh0ID0gbm9kZVxuICAgIGVsc2UgdGhpcy5oZWFkID0gbm9kZVxuICAgIHRoaXMudGFpbCA9IG5vZGVcbiAgICB0aGlzLmxlbmd0aCsrXG4gICAgcmV0dXJuIG5vZGVcbiAgfVxuXG4gIGRlcXVldWUgKCkge1xuICAgIGlmICghdGhpcy5oZWFkKSByZXR1cm5cbiAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXMuaGVhZFxuICAgIHRoaXMucmVtb3ZlKHRoaXMuaGVhZClcbiAgICByZXR1cm4gZGF0YVxuICB9XG5cbiAgcmVtb3ZlIChub2RlKSB7XG4gICAgaWYgKG5vZGUucHJldikgbm9kZS5wcmV2Lm5leHQgPSBub2RlLm5leHRcbiAgICBlbHNlIHRoaXMuaGVhZCA9IG5vZGUubmV4dFxuICAgIGlmIChub2RlLm5leHQpIG5vZGUubmV4dC5wcmV2ID0gbm9kZS5wcmV2XG4gICAgZWxzZSB0aGlzLnRhaWwgPSBub2RlLnByZXZcbiAgICB0aGlzLmxlbmd0aC0tXG4gIH1cblxuICBzaXplICgpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGhcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IChzbG90cyA9IDEpID0+IHtcbiAgY29uc3QgcXVldWUgPSBuZXcgTGlua2VkTGlzdCgpXG5cbiAgY29uc3QgcmVsZWFzZSA9ICgpID0+IHtcbiAgICArK3Nsb3RzXG4gICAgY29uc3Qgd2FpdGVyID0gcXVldWUuZGVxdWV1ZSgpXG4gICAgaWYgKHdhaXRlcikgcmV0dXJuIHdhaXRlci5hY3F1aXJlKClcbiAgfVxuXG4gIGNvbnN0IGFjcXVpcmUgPSByZXNvbHZlID0+IHtcbiAgICAtLXNsb3RzXG4gICAgcmVzb2x2ZShyZWxlYXNlKVxuICB9XG5cbiAgY29uc3QgbG9jayA9IHNpZ25hbCA9PlxuICAgIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKHNpZ25hbCAhPSBudWxsICYmIHR5cGVvZiBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdgc2lnbmFsYCBuZWVkcyB0byBiZSBhbiBBYm9ydFNpZ25hbC4nKVxuICAgICAgfVxuICAgICAgaWYgKHNpZ25hbD8uYWJvcnRlZCkgcmV0dXJuIHJlc29sdmUobnVsbClcbiAgICAgIGlmICghbG9jay5pc0xvY2tlZCgpKSByZXR1cm4gYWNxdWlyZShyZXNvbHZlKVxuXG4gICAgICBjb25zdCB3YWl0ZXIgPSB7IGFjcXVpcmU6ICgpID0+IGFjcXVpcmUocmVzb2x2ZSkgfVxuICAgICAgY29uc3Qgbm9kZSA9IHF1ZXVlLmVucXVldWUod2FpdGVyKVxuXG4gICAgICBpZiAoc2lnbmFsICE9IG51bGwpIHtcbiAgICAgICAgY29uc3Qgb25BYm9ydCA9ICgpID0+IHtcbiAgICAgICAgICBxdWV1ZS5yZW1vdmUobm9kZSlcbiAgICAgICAgICByZXNvbHZlKG51bGwpXG4gICAgICAgIH1cbiAgICAgICAgd2FpdGVyLmFjcXVpcmUgPSAoKSA9PiB7XG4gICAgICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydClcbiAgICAgICAgICBhY3F1aXJlKHJlc29sdmUpXG4gICAgICAgIH1cbiAgICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pXG4gICAgICB9XG4gICAgfSlcblxuICBsb2NrLmlzTG9ja2VkID0gKCkgPT4gc2xvdHMgPT09IDBcblxuICBsb2NrLmF3YWl0aW5nID0gKCkgPT4gcXVldWUuc2l6ZSgpXG5cbiAgcmV0dXJuIGxvY2tcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBjcmVhdGVMb2NrID0gcmVxdWlyZSgnLi9jcmVhdGUnKVxuXG5jb25zdCB3aXRoTG9jayA9IG9wdHMgPT4ge1xuICBjb25zdCBsb2NrID0gY3JlYXRlTG9jayhvcHRzKVxuXG4gIGNvbnN0IHdpdGhMb2NrID0gYXN5bmMgKGZuLCBzaWduYWwpID0+IHtcbiAgICBjb25zdCByZWxlYXNlID0gYXdhaXQgbG9jayhzaWduYWwpXG4gICAgaWYgKCFyZWxlYXNlKSByZXR1cm5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGZuKClcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVsZWFzZSgpXG4gICAgfVxuICB9XG5cbiAgd2l0aExvY2suaXNMb2NrZWQgPSBsb2NrLmlzTG9ja2VkXG4gIHdpdGhMb2NrLmF3YWl0aW5nID0gbG9jay5hd2FpdGluZ1xuXG4gIHJldHVybiB3aXRoTG9ja1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgd2l0aExvY2ssIGNyZWF0ZUxvY2sgfVxuIiwiaW1wb3J0IHsgd2l0aExvY2sgfSBmcm9tIFwic3VwZXJsb2NrXCI7XG4vLyNyZWdpb24gLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vZGVxdWFsQDIuMC4zL25vZGVfbW9kdWxlcy9kZXF1YWwvbGl0ZS9pbmRleC5tanNcbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gZGVxdWFsKGZvbywgYmFyKSB7XG5cdHZhciBjdG9yLCBsZW47XG5cdGlmIChmb28gPT09IGJhcikgcmV0dXJuIHRydWU7XG5cdGlmIChmb28gJiYgYmFyICYmIChjdG9yID0gZm9vLmNvbnN0cnVjdG9yKSA9PT0gYmFyLmNvbnN0cnVjdG9yKSB7XG5cdFx0aWYgKGN0b3IgPT09IERhdGUpIHJldHVybiBmb28uZ2V0VGltZSgpID09PSBiYXIuZ2V0VGltZSgpO1xuXHRcdGlmIChjdG9yID09PSBSZWdFeHApIHJldHVybiBmb28udG9TdHJpbmcoKSA9PT0gYmFyLnRvU3RyaW5nKCk7XG5cdFx0aWYgKGN0b3IgPT09IEFycmF5KSB7XG5cdFx0XHRpZiAoKGxlbiA9IGZvby5sZW5ndGgpID09PSBiYXIubGVuZ3RoKSB3aGlsZSAobGVuLS0gJiYgZGVxdWFsKGZvb1tsZW5dLCBiYXJbbGVuXSkpO1xuXHRcdFx0cmV0dXJuIGxlbiA9PT0gLTE7XG5cdFx0fVxuXHRcdGlmICghY3RvciB8fCB0eXBlb2YgZm9vID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRsZW4gPSAwO1xuXHRcdFx0Zm9yIChjdG9yIGluIGZvbykge1xuXHRcdFx0XHRpZiAoaGFzLmNhbGwoZm9vLCBjdG9yKSAmJiArK2xlbiAmJiAhaGFzLmNhbGwoYmFyLCBjdG9yKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoIShjdG9yIGluIGJhcikgfHwgIWRlcXVhbChmb29bY3Rvcl0sIGJhcltjdG9yXSkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhiYXIpLmxlbmd0aCA9PT0gbGVuO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZm9vICE9PSBmb28gJiYgYmFyICE9PSBiYXI7XG59XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvdHlwZXMudHNcbi8qKiBNaWdyYXRpb24gZXJyb3IgZm9yIHZlcnNpb24gbWlncmF0aW9ucyAqL1xudmFyIE1pZ3JhdGlvbkVycm9yID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG5cdGtleTtcblx0dmVyc2lvbjtcblx0Y29uc3RydWN0b3Ioa2V5LCB2ZXJzaW9uLCBvcHRpb25zKSB7XG5cdFx0c3VwZXIoYHYke3ZlcnNpb259IG1pZ3JhdGlvbiBmYWlsZWQgZm9yIFwiJHtrZXl9XCJgLCBvcHRpb25zKTtcblx0XHR0aGlzLmtleSA9IGtleTtcblx0XHR0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbmNvbnN0IGdsb2JhbHMgPSBnbG9iYWxUaGlzO1xuY29uc3QgYnJvd3NlciA9IGdsb2JhbHMuYnJvd3NlciA/PyBnbG9iYWxzLmNocm9tZSA/PyB7fTtcbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9pbmRleC50c1xuLyoqXG4qIFNpbXBsaWZpZWQsIHR5cGUtc2FmZSBzdG9yYWdlIEFQSXMgZm9yIGJyb3dzZXIgZXh0ZW5zaW9ucywgd2l0aCBzdXBwb3J0IGZvclxuKiB2ZXJzaW9uZWQgZmllbGRzLCBzbmFwc2hvdHMsIG1ldGFkYXRhLCBhbmQgaXRlbSBkZWZpbml0aW9ucy5cbipcbiogQG1vZHVsZSB3ZWJleHQtc3RvcmVcbiovXG5jb25zdCBzdG9yYWdlID0gY3JlYXRlU3RvcmFnZSgpO1xuZnVuY3Rpb24gY3JlYXRlU3RvcmFnZSgpIHtcblx0Y29uc3QgZHJpdmVycyA9IHtcblx0XHRsb2NhbDogY3JlYXRlRHJpdmVyKFwibG9jYWxcIiksXG5cdFx0c2Vzc2lvbjogY3JlYXRlRHJpdmVyKFwic2Vzc2lvblwiKSxcblx0XHRzeW5jOiBjcmVhdGVEcml2ZXIoXCJzeW5jXCIpLFxuXHRcdG1hbmFnZWQ6IGNyZWF0ZURyaXZlcihcIm1hbmFnZWRcIilcblx0fTtcblx0Y29uc3QgZ2V0RHJpdmVyID0gKGFyZWEpID0+IHtcblx0XHRjb25zdCBkcml2ZXIgPSBkcml2ZXJzW2FyZWFdO1xuXHRcdGlmIChkcml2ZXIgPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgYXJlYU5hbWVzID0gT2JqZWN0LmtleXMoZHJpdmVycykuam9pbihcIiwgXCIpO1xuXHRcdFx0dGhyb3cgRXJyb3IoYEludmFsaWQgYXJlYSBcIiR7YXJlYX1cIi4gT3B0aW9uczogJHthcmVhTmFtZXN9YCk7XG5cdFx0fVxuXHRcdHJldHVybiBkcml2ZXI7XG5cdH07XG5cdGNvbnN0IHJlc29sdmVLZXkgPSAoa2V5KSA9PiB7XG5cdFx0Y29uc3QgZGVsaW1pbmF0b3JJbmRleCA9IGtleS5pbmRleE9mKFwiOlwiKTtcblx0XHRjb25zdCBkcml2ZXJBcmVhID0ga2V5LnN1YnN0cmluZygwLCBkZWxpbWluYXRvckluZGV4KTtcblx0XHRjb25zdCBkcml2ZXJLZXkgPSBrZXkuc3Vic3RyaW5nKGRlbGltaW5hdG9ySW5kZXggKyAxKTtcblx0XHRpZiAoZHJpdmVyS2V5ID09IG51bGwpIHRocm93IEVycm9yKGBTdG9yYWdlIGtleSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgXCJhcmVhOmtleVwiLCBidXQgcmVjZWl2ZWQgXCIke2tleX1cImApO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkcml2ZXJBcmVhLFxuXHRcdFx0ZHJpdmVyS2V5LFxuXHRcdFx0ZHJpdmVyOiBnZXREcml2ZXIoZHJpdmVyQXJlYSlcblx0XHR9O1xuXHR9O1xuXHRjb25zdCBnZXRNZXRhS2V5ID0gKGtleSkgPT4gYCR7a2V5fSRgO1xuXHRjb25zdCBtZXJnZU1ldGEgPSAob2xkTWV0YSwgbmV3TWV0YSkgPT4ge1xuXHRcdGNvbnN0IG5ld0ZpZWxkcyA9IHsgLi4ub2xkTWV0YSB9O1xuXHRcdE9iamVjdC5lbnRyaWVzKG5ld01ldGEpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwpIGRlbGV0ZSBuZXdGaWVsZHNba2V5XTtcblx0XHRcdGVsc2UgbmV3RmllbGRzW2tleV0gPSB2YWx1ZTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3RmllbGRzO1xuXHR9O1xuXHRjb25zdCBnZXRWYWx1ZU9yRmFsbGJhY2sgPSAodmFsdWUsIGZhbGxiYWNrKSA9PiB2YWx1ZSA/PyBmYWxsYmFjayA/PyBudWxsO1xuXHRjb25zdCBnZXRNZXRhVmFsdWUgPSAocHJvcGVydGllcykgPT4gdHlwZW9mIHByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcykgPyBwcm9wZXJ0aWVzIDoge307XG5cdGNvbnN0IGdldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuXHRcdHJldHVybiBnZXRWYWx1ZU9yRmFsbGJhY2socmVzLCBvcHRzPy5mYWxsYmFjayk7XG5cdH07XG5cdGNvbnN0IGdldE1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXkpID0+IHtcblx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGRyaXZlci5nZXRJdGVtKG1ldGFLZXkpO1xuXHRcdHJldHVybiBnZXRNZXRhVmFsdWUocmVzKTtcblx0fTtcblx0Y29uc3Qgc2V0SXRlbSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpID0+IHtcblx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbShkcml2ZXJLZXksIHZhbHVlID8/IG51bGwpO1xuXHR9O1xuXHRjb25zdCBzZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRjb25zdCBleGlzdGluZ0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG5cdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbWVyZ2VNZXRhKGV4aXN0aW5nRmllbGRzLCBwcm9wZXJ0aWVzKSk7XG5cdH07XG5cdGNvbnN0IHJlbW92ZUl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcblx0XHRhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShkcml2ZXJLZXkpO1xuXHRcdGlmIChvcHRzPy5yZW1vdmVNZXRhKSB7XG5cdFx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdFx0YXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0obWV0YUtleSk7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCByZW1vdmVNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRpZiAocHJvcGVydGllcyA9PSBudWxsKSBhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShtZXRhS2V5KTtcblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IG5ld0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG5cdFx0XHRbcHJvcGVydGllc10uZmxhdCgpLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdGRlbGV0ZSBuZXdGaWVsZHNbZmllbGRdO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbShtZXRhS2V5LCBuZXdGaWVsZHMpO1xuXHRcdH1cblx0fTtcblx0Y29uc3Qgd2F0Y2ggPSAoZHJpdmVyLCBkcml2ZXJLZXksIGNiKSA9PiBkcml2ZXIud2F0Y2goZHJpdmVyS2V5LCBjYik7XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdH0sXG5cdFx0Z2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRjb25zdCBhcmVhVG9LZXlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Y29uc3Qga2V5VG9PcHRzTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGNvbnN0IG9yZGVyZWRLZXlzID0gW107XG5cdFx0XHRrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRsZXQga2V5U3RyO1xuXHRcdFx0XHRsZXQgb3B0cztcblx0XHRcdFx0aWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIGtleVN0ciA9IGtleTtcblx0XHRcdFx0ZWxzZSBpZiAoXCJnZXRWYWx1ZVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IHsgZmFsbGJhY2s6IGtleS5mYWxsYmFjayB9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKFwiaXRlbVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5pdGVtLmtleTtcblx0XHRcdFx0XHRvcHRzID0geyBmYWxsYmFjazoga2V5Lml0ZW0uZmFsbGJhY2sgfTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRcdG9wdHMgPSBrZXkub3B0aW9ucztcblx0XHRcdFx0fVxuXHRcdFx0XHRvcmRlcmVkS2V5cy5wdXNoKGtleVN0cik7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleVN0cik7XG5cdFx0XHRcdGNvbnN0IGFyZWFLZXlzID0gYXJlYVRvS2V5TWFwLmdldChkcml2ZXJBcmVhKSA/PyBbXTtcblx0XHRcdFx0YXJlYVRvS2V5TWFwLnNldChkcml2ZXJBcmVhLCBhcmVhS2V5cy5jb25jYXQoZHJpdmVyS2V5KSk7XG5cdFx0XHRcdGtleVRvT3B0c01hcC5zZXQoa2V5U3RyLCBvcHRzKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgcmVzdWx0c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKGFyZWFUb0tleU1hcC5lbnRyaWVzKCkpLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdChhd2FpdCBkcml2ZXJzW2RyaXZlckFyZWFdLmdldEl0ZW1zKGtleXMpKS5mb3JFYWNoKChkcml2ZXJSZXN1bHQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBrZXkgPSBgJHtkcml2ZXJBcmVhfToke2RyaXZlclJlc3VsdC5rZXl9YDtcblx0XHRcdFx0XHRjb25zdCBvcHRzID0ga2V5VG9PcHRzTWFwLmdldChrZXkpO1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gZ2V0VmFsdWVPckZhbGxiYWNrKGRyaXZlclJlc3VsdC52YWx1ZSwgb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZmFsbGJhY2spO1xuXHRcdFx0XHRcdHJlc3VsdHNNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pKTtcblx0XHRcdHJldHVybiBvcmRlcmVkS2V5cy5tYXAoKGtleSkgPT4gKHtcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR2YWx1ZTogcmVzdWx0c01hcC5nZXQoa2V5KVxuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0Z2V0TWV0YTogYXN5bmMgKGtleSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuXHRcdH0sXG5cdFx0Z2V0TWV0YXM6IGFzeW5jIChhcmdzKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gYXJncy5tYXAoKGFyZykgPT4ge1xuXHRcdFx0XHRjb25zdCBrZXkgPSB0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiID8gYXJnIDogYXJnLmtleTtcblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0ZHJpdmVyQXJlYSxcblx0XHRcdFx0XHRkcml2ZXJLZXksXG5cdFx0XHRcdFx0ZHJpdmVyTWV0YUtleTogZ2V0TWV0YUtleShkcml2ZXJLZXkpXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGFyZWFUb0RyaXZlck1ldGFLZXlzTWFwID0ga2V5cy5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG5cdFx0XHRcdG1hcFtrZXkuZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRtYXBba2V5LmRyaXZlckFyZWFdPy5wdXNoKGtleSk7XG5cdFx0XHRcdHJldHVybiBtYXA7XG5cdFx0XHR9LCB7fSk7XG5cdFx0XHRjb25zdCByZXN1bHRzTWFwID0ge307XG5cdFx0XHRjb25zdCBzdG9yYWdlID0gYnJvd3Nlci5zdG9yYWdlO1xuXHRcdFx0aWYgKCFzdG9yYWdlKSB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIHN0b3JhZ2UgQVBJIGlzIHVuYXZhaWxhYmxlXCIpO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvRHJpdmVyTWV0YUtleXNNYXApLm1hcChhc3luYyAoW2FyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFyZWFSZXMgPSBhd2FpdCBzdG9yYWdlW2FyZWFdLmdldChrZXlzLm1hcCgoa2V5KSA9PiBrZXkuZHJpdmVyTWV0YUtleSkpO1xuXHRcdFx0XHRrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRcdHJlc3VsdHNNYXBba2V5LmtleV0gPSBhcmVhUmVzW2tleS5kcml2ZXJNZXRhS2V5XSA/PyB7fTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRyZXR1cm4ga2V5cy5tYXAoKGtleSkgPT4gKHtcblx0XHRcdFx0a2V5OiBrZXkua2V5LFxuXHRcdFx0XHRtZXRhOiByZXN1bHRzTWFwW2tleS5rZXldXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0c2V0SXRlbXM6IGFzeW5jIChpdGVtcykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5VmFsdWVNYXAgPSB7fTtcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoXCJrZXlcIiBpbiBpdGVtID8gaXRlbS5rZXkgOiBpdGVtLml0ZW0ua2V5KTtcblx0XHRcdFx0YXJlYVRvS2V5VmFsdWVNYXBbZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRhcmVhVG9LZXlWYWx1ZU1hcFtkcml2ZXJBcmVhXS5wdXNoKHtcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogaXRlbS52YWx1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvS2V5VmFsdWVNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIHZhbHVlc10pID0+IHtcblx0XHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGRyaXZlckFyZWEpLnNldEl0ZW1zKHZhbHVlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNldE1ldGFzOiBhc3luYyAoaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb01ldGFVcGRhdGVzTWFwID0ge307XG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KFwia2V5XCIgaW4gaXRlbSA/IGl0ZW0ua2V5IDogaXRlbS5pdGVtLmtleSk7XG5cdFx0XHRcdGFyZWFUb01ldGFVcGRhdGVzTWFwW2RyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0YXJlYVRvTWV0YVVwZGF0ZXNNYXBbZHJpdmVyQXJlYV0ucHVzaCh7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0cHJvcGVydGllczogaXRlbS5tZXRhXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyhhcmVhVG9NZXRhVXBkYXRlc01hcCkubWFwKGFzeW5jIChbc3RvcmFnZUFyZWEsIHVwZGF0ZXNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRyaXZlciA9IGdldERyaXZlcihzdG9yYWdlQXJlYSk7XG5cdFx0XHRcdGNvbnN0IG1ldGFLZXlzID0gdXBkYXRlcy5tYXAoKHsga2V5IH0pID0+IGdldE1ldGFLZXkoa2V5KSk7XG5cdFx0XHRcdGNvbnN0IGV4aXN0aW5nTWV0YXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbXMobWV0YUtleXMpO1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ01ldGFNYXAgPSBPYmplY3QuZnJvbUVudHJpZXMoZXhpc3RpbmdNZXRhcy5tYXAoKHsga2V5LCB2YWx1ZSB9KSA9PiBba2V5LCBnZXRNZXRhVmFsdWUodmFsdWUpXSkpO1xuXHRcdFx0XHRjb25zdCBtZXRhVXBkYXRlcyA9IHVwZGF0ZXMubWFwKCh7IGtleSwgcHJvcGVydGllcyB9KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0a2V5OiBtZXRhS2V5LFxuXHRcdFx0XHRcdFx0dmFsdWU6IG1lcmdlTWV0YShleGlzdGluZ01ldGFNYXBbbWV0YUtleV0gPz8ge30sIHByb3BlcnRpZXMpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtcyhtZXRhVXBkYXRlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtOiBhc3luYyAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5c01hcCA9IHt9O1xuXHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0bGV0IGtleVN0cjtcblx0XHRcdFx0bGV0IG9wdHM7XG5cdFx0XHRcdGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSBrZXlTdHIgPSBrZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiZ2V0VmFsdWVcIiBpbiBrZXkpIGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiaXRlbVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5pdGVtLmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5U3RyKTtcblx0XHRcdFx0YXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0ucHVzaChkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAob3B0cz8ucmVtb3ZlTWV0YSkgYXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXS5wdXNoKGdldE1ldGFLZXkoZHJpdmVyS2V5KSk7XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0tleXNNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdGF3YWl0IGdldERyaXZlcihkcml2ZXJBcmVhKS5yZW1vdmVJdGVtcyhrZXlzKTtcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBhc3luYyAoYmFzZSkgPT4ge1xuXHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGJhc2UpLmNsZWFyKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoYmFzZSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGdldERyaXZlcihiYXNlKS5zbmFwc2hvdCgpO1xuXHRcdFx0b3B0cz8uZXhjbHVkZUtleXM/LmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldO1xuXHRcdFx0XHRkZWxldGUgZGF0YVtnZXRNZXRhS2V5KGtleSldO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGJhc2UsIGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldERyaXZlcihiYXNlKS5yZXN0b3JlU25hcHNob3QoZGF0YSk7XG5cdFx0fSxcblx0XHR3YXRjaDogKGtleSwgY2IpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgY2IpO1xuXHRcdH0sXG5cdFx0dW53YXRjaCgpIHtcblx0XHRcdE9iamVjdC52YWx1ZXMoZHJpdmVycykuZm9yRWFjaCgoZHJpdmVyKSA9PiB7XG5cdFx0XHRcdGRyaXZlci51bndhdGNoKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRlZmluZUl0ZW06IChrZXksIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdGNvbnN0IHsgdmVyc2lvbjogdGFyZ2V0VmVyc2lvbiA9IDEsIG1pZ3JhdGlvbnMgPSB7fSwgb25NaWdyYXRpb25Db21wbGV0ZSwgZGVidWcgPSBmYWxzZSB9ID0gb3B0cyA/PyB7fTtcblx0XHRcdGlmICh0YXJnZXRWZXJzaW9uIDwgMSkgdGhyb3cgRXJyb3IoXCJTdG9yYWdlIGl0ZW0gdmVyc2lvbiBjYW5ub3QgYmUgbGVzcyB0aGFuIDEuIEluaXRpYWwgdmVyc2lvbnMgc2hvdWxkIGJlIHNldCB0byAxLCBub3QgMC5cIik7XG5cdFx0XHRsZXQgbmVlZHNWZXJzaW9uU2V0ID0gZmFsc2U7XG5cdFx0XHRjb25zdCBtaWdyYXRlID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBkcml2ZXJNZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdFx0XHRjb25zdCBbeyB2YWx1ZSB9LCB7IHZhbHVlOiBtZXRhIH1dID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKFtkcml2ZXJLZXksIGRyaXZlck1ldGFLZXldKTtcblx0XHRcdFx0bmVlZHNWZXJzaW9uU2V0ID0gdmFsdWUgPT0gbnVsbCAmJiBtZXRhPy52ID09IG51bGwgJiYgISF0YXJnZXRWZXJzaW9uO1xuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0XHRjb25zdCBjdXJyZW50VmVyc2lvbiA9IG1ldGE/LnYgPz8gMTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWZXJzaW9uID4gdGFyZ2V0VmVyc2lvbikgdGhyb3cgRXJyb3IoYFZlcnNpb24gZG93bmdyYWRlIGRldGVjdGVkICh2JHtjdXJyZW50VmVyc2lvbn0gLT4gdiR7dGFyZ2V0VmVyc2lvbn0pIGZvciBcIiR7a2V5fVwiYCk7XG5cdFx0XHRcdGlmIChjdXJyZW50VmVyc2lvbiA9PT0gdGFyZ2V0VmVyc2lvbikgcmV0dXJuO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFJ1bm5pbmcgc3RvcmFnZSBtaWdyYXRpb24gZm9yICR7a2V5fTogdiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259YCk7XG5cdFx0XHRcdGNvbnN0IG1pZ3JhdGlvbnNUb1J1biA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRhcmdldFZlcnNpb24gLSBjdXJyZW50VmVyc2lvbiB9LCAoXywgaSkgPT4gY3VycmVudFZlcnNpb24gKyBpICsgMSk7XG5cdFx0XHRcdGxldCBtaWdyYXRlZFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdGZvciAoY29uc3QgbWlncmF0ZVRvVmVyc2lvbiBvZiBtaWdyYXRpb25zVG9SdW4pIHRyeSB7XG5cdFx0XHRcdFx0bWlncmF0ZWRWYWx1ZSA9IGF3YWl0IG1pZ3JhdGlvbnM/LlttaWdyYXRlVG9WZXJzaW9uXT8uKG1pZ3JhdGVkVmFsdWUpID8/IG1pZ3JhdGVkVmFsdWU7XG5cdFx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBTdG9yYWdlIG1pZ3JhdGlvbiBwcm9jZXNzZWQgZm9yIHZlcnNpb246IHYke21pZ3JhdGVUb1ZlcnNpb259YCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBNaWdyYXRpb25FcnJvcihrZXksIG1pZ3JhdGVUb1ZlcnNpb24sIHsgY2F1c2U6IGVyciB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbXMoW3tcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogbWlncmF0ZWRWYWx1ZVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJNZXRhS2V5LFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHQuLi5tZXRhLFxuXHRcdFx0XHRcdFx0djogdGFyZ2V0VmVyc2lvblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fV0pO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFN0b3JhZ2UgbWlncmF0aW9uIGNvbXBsZXRlZCBmb3IgJHtrZXl9IHYke3RhcmdldFZlcnNpb259YCwgeyBtaWdyYXRlZFZhbHVlIH0pO1xuXHRcdFx0XHRvbk1pZ3JhdGlvbkNvbXBsZXRlPy4obWlncmF0ZWRWYWx1ZSwgdGFyZ2V0VmVyc2lvbik7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbWlncmF0aW9uc0RvbmUgPSBvcHRzPy5taWdyYXRpb25zID09IG51bGwgPyBQcm9taXNlLnJlc29sdmUoKSA6IG1pZ3JhdGUoKS5jYXRjaCgoZXJyKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFt3ZWJleHQtc3RvcmVdIE1pZ3JhdGlvbiBmYWlsZWQgZm9yICR7a2V5fWAsIGVycik7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGluaXRMb2NrID0gd2l0aExvY2soKTtcblx0XHRcdGNvbnN0IGdldEZhbGxiYWNrID0gKCkgPT4gb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZGVmYXVsdFZhbHVlID8/IG51bGw7XG5cdFx0XHRjb25zdCBnZXRPckluaXRWYWx1ZSA9ICgpID0+IGluaXRMb2NrKGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAodmFsdWUgIT0gbnVsbCB8fCBvcHRzPy5pbml0ID09IG51bGwpIHJldHVybiB2YWx1ZTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBhd2FpdCBvcHRzLmluaXQoKTtcblx0XHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCBuZXdWYWx1ZSk7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmIHRhcmdldFZlcnNpb24gPiAxKSBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCB7IHY6IHRhcmdldFZlcnNpb24gfSk7XG5cdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0bWlncmF0aW9uc0RvbmUudGhlbihnZXRPckluaXRWYWx1ZSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdGdldCBkZWZhdWx0VmFsdWUoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEZhbGxiYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldCBmYWxsYmFjaygpIHtcblx0XHRcdFx0XHRyZXR1cm4gZ2V0RmFsbGJhY2soKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0VmFsdWU6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAob3B0cz8uaW5pdCkgcmV0dXJuIGF3YWl0IGdldE9ySW5pdFZhbHVlKCk7XG5cdFx0XHRcdFx0ZWxzZSByZXR1cm4gYXdhaXQgZ2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldE1ldGE6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldFZhbHVlOiBhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAobmVlZHNWZXJzaW9uU2V0KSB7XG5cdFx0XHRcdFx0XHRuZWVkc1ZlcnNpb25TZXQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFtzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSksIHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHsgdjogdGFyZ2V0VmVyc2lvbiB9KV0pO1xuXHRcdFx0XHRcdH0gZWxzZSBhd2FpdCBzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldE1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmVWYWx1ZTogYXN5bmMgKG9wdHMpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZU1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHJlbW92ZU1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR3YXRjaDogKGNiKSA9PiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4gY2IobmV3VmFsdWUgPz8gZ2V0RmFsbGJhY2soKSwgb2xkVmFsdWUgPz8gZ2V0RmFsbGJhY2soKSkpLFxuXHRcdFx0XHRtaWdyYXRlXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURyaXZlcihzdG9yYWdlQXJlYSkge1xuXHRjb25zdCBnZXRTdG9yYWdlQXJlYSA9ICgpID0+IHtcblx0XHRpZiAoYnJvd3Nlci5ydW50aW1lID09IG51bGwpIHRocm93IEVycm9yKGAnd2ViZXh0LXN0b3JlJyBtdXN0IGJlIGxvYWRlZCBpbiBhIHdlYiBleHRlbnNpb24gZW52aXJvbm1lbnQuYCk7XG5cdFx0aWYgKGJyb3dzZXIuc3RvcmFnZSA9PSBudWxsKSB0aHJvdyBFcnJvcihcIllvdSBtdXN0IGFkZCB0aGUgJ3N0b3JhZ2UnIHBlcm1pc3Npb24gdG8geW91ciBtYW5pZmVzdCB0byB1c2UgJ3dlYmV4dC1zdG9yZSdcIik7XG5cdFx0Y29uc3QgYXJlYSA9IGJyb3dzZXIuc3RvcmFnZVtzdG9yYWdlQXJlYV07XG5cdFx0aWYgKGFyZWEgPT0gbnVsbCkgdGhyb3cgRXJyb3IoYFwiYnJvd3Nlci5zdG9yYWdlLiR7c3RvcmFnZUFyZWF9XCIgaXMgdW5kZWZpbmVkYCk7XG5cdFx0cmV0dXJuIGFyZWE7XG5cdH07XG5cdGNvbnN0IHdhdGNoTGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRyZXR1cm4gKGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleSkpW2tleV07XG5cdFx0fSxcblx0XHRnZXRJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleXMpO1xuXHRcdFx0cmV0dXJuIGtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHJlc3VsdFtrZXldID8/IG51bGxcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdHNldEl0ZW06IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5yZW1vdmUoa2V5KTtcblx0XHRcdGVsc2UgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoeyBba2V5XTogdmFsdWUgfSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtczogYXN5bmMgKHZhbHVlcykgPT4ge1xuXHRcdFx0Y29uc3QgbWFwID0gdmFsdWVzLnJlZHVjZSgobWFwLCB7IGtleSwgdmFsdWUgfSkgPT4ge1xuXHRcdFx0XHRtYXBba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0YXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQobWFwKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW06IGFzeW5jIChrZXkpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleXMpO1xuXHRcdH0sXG5cdFx0Y2xlYXI6IGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuY2xlYXIoKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5nZXQoKTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KGRhdGEpO1xuXHRcdH0sXG5cdFx0d2F0Y2goa2V5LCBjYikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoY2hhbmdlcykgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzW2tleV07XG5cdFx0XHRcdGlmIChjaGFuZ2UgPT0gbnVsbCB8fCBkZXF1YWwoY2hhbmdlLm5ld1ZhbHVlLCBjaGFuZ2Uub2xkVmFsdWUpKSByZXR1cm47XG5cdFx0XHRcdGNiKGNoYW5nZS5uZXdWYWx1ZSA/PyBudWxsLCBjaGFuZ2Uub2xkVmFsdWUgPz8gbnVsbCk7XG5cdFx0XHR9O1xuXHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHR1bndhdGNoKCkge1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcblx0XHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0fSk7XG5cdFx0XHR3YXRjaExpc3RlbmVycy5jbGVhcigpO1xuXHRcdH1cblx0fTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgc3RvcmFnZSBhcyB0IH07XG4iLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnd2ViZXh0LXN0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5ncyB7XG4gIHRoZW1lOiAnbGlnaHQnIHwgJ2RhcmsnO1xuICBkaXNwbGF5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgdmVyc2lvbmVkIGl0ZW0uIEJ1bXBpbmcgYHZlcnNpb25gIGFuZCBhZGRpbmcgYSBtaWdyYXRpb24gZnVuY3Rpb24gaXMgaG93XG4gKiB3ZWJleHQtc3RvcmUgZXZvbHZlcyBhIHN0b3JlZCBzaGFwZSBvdmVyIHRpbWUg4oCUIG1pZ3JhdGlvbnMgcnVuXG4gKiBhdXRvbWF0aWNhbGx5LCBvbmNlLCB0aGUgZmlyc3QgdGltZSB0aGUgaXRlbSBpcyB0b3VjaGVkIGFmdGVyIGFuIHVwZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxTZXR0aW5ncz4oJ3N5bmM6c2V0dGluZ3MnLCB7XG4gIGZhbGxiYWNrOiB7IHRoZW1lOiAnbGlnaHQnLCBkaXNwbGF5TmFtZTogJ0d1ZXN0JyB9LFxuICB2ZXJzaW9uOiAzLFxuICBtaWdyYXRpb25zOiB7XG4gICAgLy8gdjEgLT4gdjI6IGludHJvZHVjZWQgYHRoZW1lYFxuICAgIDI6IChvbGQ6IGFueSkgPT4gKHsgLi4ub2xkLCB0aGVtZTogb2xkPy50aGVtZSA/PyAnbGlnaHQnIH0pLFxuICAgIC8vIHYyIC0+IHYzOiBpbnRyb2R1Y2VkIGBkaXNwbGF5TmFtZWBcbiAgICAzOiAob2xkOiBhbnkpID0+ICh7IC4uLm9sZCwgZGlzcGxheU5hbWU6IG9sZD8uZGlzcGxheU5hbWUgPz8gJ0d1ZXN0JyB9KSxcbiAgfSxcbiAgZGVidWc6IHRydWUsXG4gIG9uTWlncmF0aW9uQ29tcGxldGU6ICh2YWx1ZSwgdGFyZ2V0VmVyc2lvbikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBbd2ViZXh0LXN0b3JlLWRlbW9dIHNldHRpbmdzIG1pZ3JhdGVkIHRvIHYke3RhcmdldFZlcnNpb259YCwgdmFsdWUpO1xuICB9LFxufSk7XG5cbi8qKlxuICogYGluaXRgIHJ1bnMgZXhhY3RseSBvbmNlIOKAlCB0aGUgZmlyc3QgdGltZSB0aGlzIGl0ZW0gaXMgZGVmaW5lZCBpbiBhbnlcbiAqIGV4dGVuc2lvbiBjb250ZXh0IGFmdGVyIGluc3RhbGwg4oCUIGFuZCBvbmx5IGlmIG5vdGhpbmcgaXMgaW4gc3RvcmFnZSB5ZXQuXG4gKiBHb29kIGZvciBvbmUtdGltZSBJRHMsIGZpcnN0LXJ1biB0aW1lc3RhbXBzLCBldGMuXG4gKi9cbmV4cG9ydCBjb25zdCBpbnN0YWxsSWRJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPHN0cmluZz4oJ2xvY2FsOmluc3RhbGxJZCcsIHtcbiAgaW5pdDogKCkgPT4gY3J5cHRvLnJhbmRvbVVVSUQoKSxcbn0pO1xuXG4vKipcbiAqIEEgcGxhaW4gY291bnRlciB3aXRoIGEgZmFsbGJhY2sgb2YgMC4gV3JpdHRlbiB0byBmcm9tIHRoZSBwb3B1cCAodmlhIHRoZVxuICogUmVhY3QgaG9vayksIHRoZSBiYWNrZ3JvdW5kIChvbiBhbiBhbGFybSArIG9uIG1lc3NhZ2UpLCBhbmQgcmVhZCBmcm9tXG4gKiBib3RoIOKAlCB0aGlzIGlzIHdoYXQgdGhlIFwiQ3Jvc3MtY29udGV4dFwiIHRhYiB1c2VzIHRvIHByb3ZlIGB3YXRjaCgpYCBmaXJlc1xuICogYWNyb3NzIGV4ZWN1dGlvbiBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGhlYXJ0YmVhdEl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08bnVtYmVyPignbG9jYWw6aGVhcnRiZWF0Jywge1xuICBmYWxsYmFjazogMCxcbn0pO1xuXG4vKiogRml4ZWQga2V5cyB1c2VkIGJ5IHRoZSBiYXRjaC1vcGVyYXRpb25zIHRhYi4gKi9cbmV4cG9ydCBjb25zdCBCQVRDSF9LRVlTID0gWydsb2NhbDpiYXRjaEEnLCAnbG9jYWw6YmF0Y2hCJywgJ2xvY2FsOmJhdGNoQyddIGFzIGNvbnN0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFwcFNldHRpbmcge1xuICB0aGVtZTogJ2xpZ2h0JyB8ICdkYXJrJztcbiAgZnJlZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgYHsgdGhlbWU6ICdkYXJrJywgZnJlZTogdHJ1ZSB9YCBzaGFwZSBmcm9tIHRoZSBcImhvdyBkbyBJIHVwZGF0ZSBvbmVcbiAqIGtleVwiIHF1ZXN0aW9uIOKAlCB1c2VkIGJ5IE9iamVjdFVwZGF0ZVBhbmVsLiB3ZWJleHQtc3RvcmUgc3RvcmVzIHRoZSB3aG9sZVxuICogdmFsdWUgYXMgb25lIEpTT04gYmxvYiwgc28gXCJ1cGRhdGluZyBvbmUga2V5XCIgYWx3YXlzIG1lYW5zIHJlYWQtbW9kaWZ5LVxuICogd3JpdGUgdGhlIHdob2xlIG9iamVjdCwgc2FtZSBhcyB5b3Ugd291bGQgd2l0aCBwbGFpbiBSZWFjdCBzdGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGFwcFNldHRpbmdJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPEFwcFNldHRpbmc+KCdsb2NhbDphcHBTZXR0aW5nJywge1xuICBmYWxsYmFjazogeyB0aGVtZTogJ2RhcmsnLCBmcmVlOiB0cnVlIH0sXG59KTtcbiIsImltcG9ydCB7IGhlYXJ0YmVhdEl0ZW0gfSBmcm9tICdAL3V0aWxzL3N0b3JhZ2UtaXRlbXMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcbiAgbWF0Y2hlczogWycqOi8vKi8qJ10sXG4gIHJ1bkF0OiAnZG9jdW1lbnRfaWRsZScsXG5cbiAgbWFpbigpIHtcbiAgICAvLyBObyBSZWFjdCBoZXJlIGF0IGFsbCDigJQgcHJvdmVzIHdlYmV4dC1zdG9yZSdzIGNvcmUgQVBJIChzdG9yYWdlIC9cbiAgICAvLyBkZWZpbmVJdGVtKSB3b3JrcyBpbiBhIHBsYWluIGNvbnRlbnQgc2NyaXB0LCBzYW1lIGFzIGFueXdoZXJlIGVsc2UuXG4gICAgY29uc3QgYmFkZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBiYWRnZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAnc3R5bGUnLFxuICAgICAgW1xuICAgICAgICAncG9zaXRpb246Zml4ZWQnLFxuICAgICAgICAnYm90dG9tOjEycHgnLFxuICAgICAgICAncmlnaHQ6MTJweCcsXG4gICAgICAgICd6LWluZGV4OjIxNDc0ODM2NDcnLFxuICAgICAgICAncGFkZGluZzo2cHggMTBweCcsXG4gICAgICAgICdib3JkZXItcmFkaXVzOjhweCcsXG4gICAgICAgICdiYWNrZ3JvdW5kOiMxZTI5M2InLFxuICAgICAgICAnY29sb3I6IzZlZTdiNycsXG4gICAgICAgICdmb250OjYwMCAxMXB4LzEuNCBtb25vc3BhY2UnLFxuICAgICAgICAnYm94LXNoYWRvdzowIDJweCA4cHggcmdiYSgwLDAsMCwuMjUpJyxcbiAgICAgICAgJ3BvaW50ZXItZXZlbnRzOm5vbmUnLFxuICAgICAgICAnb3BhY2l0eTowLjg1JyxcbiAgICAgIF0uam9pbignOycpLFxuICAgICk7XG4gICAgYmFkZ2UudGV4dENvbnRlbnQgPSAnd2ViZXh0LXN0b3JlIGhlYXJ0YmVhdDog4oCmJztcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuXG4gICAgY29uc3QgcmVuZGVyID0gKG46IG51bWJlcikgPT4ge1xuICAgICAgYmFkZ2UudGV4dENvbnRlbnQgPSBgd2ViZXh0LXN0b3JlIGhlYXJ0YmVhdDogJHtufWA7XG4gICAgfTtcblxuICAgIGhlYXJ0YmVhdEl0ZW0uZ2V0VmFsdWUoKS50aGVuKHJlbmRlcik7XG5cbiAgICAvLyBGaXJlcyBmb3Igd3JpdGVzIGZyb20gdGhlIGJhY2tncm91bmQncyBhbGFybSwgdGhlIHBvcHVwJ3MgYnV0dG9uLFxuICAgIC8vIGFuZCB0aGUgcG9wdXAncyBob29rIOKAlCB0aGlzIGNvbnRlbnQgc2NyaXB0IHNlZXMgYWxsIG9mIHRoZW0gZXF1YWxseS5cbiAgICBjb25zdCB1bndhdGNoID0gaGVhcnRiZWF0SXRlbS53YXRjaCgobmV3VmFsdWUpID0+IHJlbmRlcihuZXdWYWx1ZSkpO1xuXG4gICAgLy8gV1hUIHRlYXJzIGNvbnRlbnQgc2NyaXB0cyBkb3duIG9uIG5hdmlnYXRpb24vaW52YWxpZGF0aW9uIGZvciB1cztcbiAgICAvLyB0aGlzIGxpc3RlbmVyIGlzIGp1c3QgYmVsdC1hbmQtc3VzcGVuZGVycyBjbGVhbnVwLlxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwYWdlaGlkZScsIHVud2F0Y2gsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfSxcbn0pO1xuIiwiLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9sb2dnZXIudHNcbmZ1bmN0aW9uIHByaW50KG1ldGhvZCwgLi4uYXJncykge1xuXHRpZiAoaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09IFwicHJvZHVjdGlvblwiKSByZXR1cm47XG5cdGlmICh0eXBlb2YgYXJnc1swXSA9PT0gXCJzdHJpbmdcIikgbWV0aG9kKGBbd3h0XSAke2FyZ3Muc2hpZnQoKX1gLCAuLi5hcmdzKTtcblx0ZWxzZSBtZXRob2QoXCJbd3h0XVwiLCAuLi5hcmdzKTtcbn1cbi8qKiBXcmFwcGVyIGFyb3VuZCBgY29uc29sZWAgd2l0aCBhIFwiW3d4dF1cIiBwcmVmaXggKi9cbmNvbnN0IGxvZ2dlciA9IHtcblx0ZGVidWc6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmRlYnVnLCAuLi5hcmdzKSxcblx0bG9nOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS5sb2csIC4uLmFyZ3MpLFxuXHR3YXJuOiAoLi4uYXJncykgPT4gcHJpbnQoY29uc29sZS53YXJuLCAuLi5hcmdzKSxcblx0ZXJyb3I6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmVycm9yLCAuLi5hcmdzKVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgbG9nZ2VyIH07XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9pbnRlcm5hbC9jdXN0b20tZXZlbnRzLnRzXG52YXIgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCA9IGNsYXNzIFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG5cdHN0YXRpYyBFVkVOVF9OQU1FID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpO1xuXHRjb25zdHJ1Y3RvcihuZXdVcmwsIG9sZFVybCkge1xuXHRcdHN1cGVyKFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQuRVZFTlRfTkFNRSwge30pO1xuXHRcdHRoaXMubmV3VXJsID0gbmV3VXJsO1xuXHRcdHRoaXMub2xkVXJsID0gb2xkVXJsO1xuXHR9XG59O1xuLyoqXG4qIFJldHVybnMgYW4gZXZlbnQgbmFtZSB1bmlxdWUgdG8gdGhlIGV4dGVuc2lvbiBhbmQgY29udGVudCBzY3JpcHQgdGhhdCdzXG4qIHJ1bm5pbmcuXG4qL1xuZnVuY3Rpb24gZ2V0VW5pcXVlRXZlbnROYW1lKGV2ZW50TmFtZSkge1xuXHRyZXR1cm4gYCR7YnJvd3Nlcj8ucnVudGltZT8uaWR9OiR7aW1wb3J0Lm1ldGEuZW52LkVOVFJZUE9JTlR9OiR7ZXZlbnROYW1lfWA7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQsIGdldFVuaXF1ZUV2ZW50TmFtZSB9O1xuIiwiaW1wb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCB9IGZyb20gXCIuL2N1c3RvbS1ldmVudHMubWpzXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIudHNcbmNvbnN0IHN1cHBvcnRzTmF2aWdhdGlvbkFwaSA9IHR5cGVvZiBnbG9iYWxUaGlzLm5hdmlnYXRpb24/LmFkZEV2ZW50TGlzdGVuZXIgPT09IFwiZnVuY3Rpb25cIjtcbi8qKlxuKiBDcmVhdGUgYSB1dGlsIHRoYXQgd2F0Y2hlcyBmb3IgVVJMIGNoYW5nZXMsIGRpc3BhdGNoaW5nIHRoZSBjdXN0b20gZXZlbnQgd2hlblxuKiBkZXRlY3RlZC4gU3RvcHMgd2F0Y2hpbmcgd2hlbiBjb250ZW50IHNjcmlwdCBpcyBpbnZhbGlkYXRlZC4gVXNlcyBOYXZpZ2F0aW9uXG4qIEFQSSB3aGVuIGF2YWlsYWJsZSwgb3RoZXJ3aXNlIGZhbGxzIGJhY2sgdG8gcG9sbGluZy5cbiovXG5mdW5jdGlvbiBjcmVhdGVMb2NhdGlvbldhdGNoZXIoY3R4KSB7XG5cdGxldCBsYXN0VXJsO1xuXHRsZXQgd2F0Y2hpbmcgPSBmYWxzZTtcblx0cmV0dXJuIHsgcnVuKCkge1xuXHRcdGlmICh3YXRjaGluZykgcmV0dXJuO1xuXHRcdHdhdGNoaW5nID0gdHJ1ZTtcblx0XHRsYXN0VXJsID0gbmV3IFVSTChsb2NhdGlvbi5ocmVmKTtcblx0XHRpZiAoc3VwcG9ydHNOYXZpZ2F0aW9uQXBpKSBnbG9iYWxUaGlzLm5hdmlnYXRpb24uYWRkRXZlbnRMaXN0ZW5lcihcIm5hdmlnYXRlXCIsIChldmVudCkgPT4ge1xuXHRcdFx0Y29uc3QgbmV3VXJsID0gbmV3IFVSTChldmVudC5kZXN0aW5hdGlvbi51cmwpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmID09PSBsYXN0VXJsLmhyZWYpIHJldHVybjtcblx0XHRcdHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50KG5ld1VybCwgbGFzdFVybCkpO1xuXHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHR9LCB7IHNpZ25hbDogY3R4LnNpZ25hbCB9KTtcblx0XHRlbHNlIGN0eC5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdFx0aWYgKG5ld1VybC5ocmVmICE9PSBsYXN0VXJsLmhyZWYpIHtcblx0XHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRcdGxhc3RVcmwgPSBuZXdVcmw7XG5cdFx0XHR9XG5cdFx0fSwgMWUzKTtcblx0fSB9O1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfTtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gXCIuL2ludGVybmFsL2xvZ2dlci5tanNcIjtcbmltcG9ydCB7IGdldFVuaXF1ZUV2ZW50TmFtZSB9IGZyb20gXCIuL2ludGVybmFsL2N1c3RvbS1ldmVudHMubWpzXCI7XG5pbXBvcnQgeyBjcmVhdGVMb2NhdGlvbldhdGNoZXIgfSBmcm9tIFwiLi9pbnRlcm5hbC9sb2NhdGlvbi13YXRjaGVyLm1qc1wiO1xuaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gXCJ3eHQvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0LnRzXG4vKipcbiogSW1wbGVtZW50c1xuKiBbYEFib3J0Q29udHJvbGxlcmBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9BYm9ydENvbnRyb2xsZXIpLlxuKiBVc2VkIHRvIGRldGVjdCBhbmQgc3RvcCBjb250ZW50IHNjcmlwdCBjb2RlIHdoZW4gdGhlIHNjcmlwdCBpcyBpbnZhbGlkYXRlZC5cbipcbiogSXQgYWxzbyBwcm92aWRlcyBzZXZlcmFsIHV0aWxpdGllcyBsaWtlIGBjdHguc2V0VGltZW91dGAgYW5kXG4qIGBjdHguc2V0SW50ZXJ2YWxgIHRoYXQgc2hvdWxkIGJlIHVzZWQgaW4gY29udGVudCBzY3JpcHRzIGluc3RlYWQgb2ZcbiogYHdpbmRvdy5zZXRUaW1lb3V0YCBvciBgd2luZG93LnNldEludGVydmFsYC5cbipcbiogVG8gY3JlYXRlIGNvbnRleHQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gdXNlIHRoZSBjbGFzcydzIGNvbnN0cnVjdG9yOlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4dCB9IGZyb20gJ3d4dC91dGlscy9jb250ZW50LXNjcmlwdHMtY29udGV4dCc7XG4qXG4qIHRlc3QoJ3N0b3JhZ2UgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2hlbiBjb250ZXh0IGlzIGludmFsaWRhdGVkJywgKCkgPT4ge1xuKiAgIGNvbnN0IGN0eCA9IG5ldyBDb250ZW50U2NyaXB0Q29udGV4dCgndGVzdCcpO1xuKiAgIGNvbnN0IGl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW0oJ2xvY2FsOmNvdW50JywgeyBkZWZhdWx0VmFsdWU6IDAgfSk7XG4qICAgY29uc3Qgd2F0Y2hlciA9IHZpLmZuKCk7XG4qXG4qICAgY29uc3QgdW53YXRjaCA9IGl0ZW0ud2F0Y2god2F0Y2hlcik7XG4qICAgY3R4Lm9uSW52YWxpZGF0ZWQodW53YXRjaCk7IC8vIExpc3RlbiBmb3IgaW52YWxpZGF0ZSBoZXJlXG4qXG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgxKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkV2l0aCgxLCAwKTtcbipcbiogICBjdHgubm90aWZ5SW52YWxpZGF0ZWQoKTsgLy8gVXNlIHRoaXMgZnVuY3Rpb24gdG8gaW52YWxpZGF0ZSB0aGUgY29udGV4dFxuKiAgIGF3YWl0IGl0ZW0uc2V0VmFsdWUoMik7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRUaW1lcygxKTtcbiogfSk7XG4qIGBgYFxuKi9cbnZhciBDb250ZW50U2NyaXB0Q29udGV4dCA9IGNsYXNzIENvbnRlbnRTY3JpcHRDb250ZXh0IHtcblx0c3RhdGljIFNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSA9IGdldFVuaXF1ZUV2ZW50TmFtZShcInd4dDpjb250ZW50LXNjcmlwdC1zdGFydGVkXCIpO1xuXHRpZDtcblx0YWJvcnRDb250cm9sbGVyO1xuXHRsb2NhdGlvbldhdGNoZXIgPSBjcmVhdGVMb2NhdGlvbldhdGNoZXIodGhpcyk7XG5cdGNvbnN0cnVjdG9yKGNvbnRlbnRTY3JpcHROYW1lLCBvcHRpb25zKSB7XG5cdFx0dGhpcy5jb250ZW50U2NyaXB0TmFtZSA9IGNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdFx0dGhpcy5pZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIpO1xuXHRcdHRoaXMuYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpO1xuXHRcdHRoaXMuc3RvcE9sZFNjcmlwdHMoKTtcblx0XHR0aGlzLmxpc3RlbkZvck5ld2VyU2NyaXB0cygpO1xuXHR9XG5cdGdldCBzaWduYWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbDtcblx0fVxuXHRhYm9ydChyZWFzb24pIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuYWJvcnQocmVhc29uKTtcblx0fVxuXHRnZXQgaXNJbnZhbGlkKCkge1xuXHRcdGlmIChicm93c2VyLnJ1bnRpbWU/LmlkID09IG51bGwpIHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHRyZXR1cm4gdGhpcy5zaWduYWwuYWJvcnRlZDtcblx0fVxuXHRnZXQgaXNWYWxpZCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNJbnZhbGlkO1xuXHR9XG5cdC8qKlxuXHQqIEFkZCBhIGxpc3RlbmVyIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRlbnQgc2NyaXB0J3MgY29udGV4dCBpc1xuXHQqIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoY2IpO1xuXHQqICAgY29uc3QgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lciA9IGN0eC5vbkludmFsaWRhdGVkKCgpID0+IHtcblx0KiAgICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5yZW1vdmVMaXN0ZW5lcihjYik7XG5cdCogICB9KTtcblx0KiAgIC8vIC4uLlxuXHQqICAgcmVtb3ZlSW52YWxpZGF0ZWRMaXN0ZW5lcigpO1xuXHQqXG5cdCogQHJldHVybnMgQSBmdW5jdGlvbiB0byByZW1vdmUgdGhlIGxpc3RlbmVyLlxuXHQqL1xuXHRvbkludmFsaWRhdGVkKGNiKSB7XG5cdFx0dGhpcy5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0XHRyZXR1cm4gKCkgPT4gdGhpcy5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsIGNiKTtcblx0fVxuXHQvKipcblx0KiBSZXR1cm4gYSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMuIFVzZWZ1bCBpZiB5b3UgaGF2ZSBhbiBhc3luYyBmdW5jdGlvblxuXHQqIHRoYXQgc2hvdWxkbid0IHJ1biBhZnRlciB0aGUgY29udGV4dCBpcyBleHBpcmVkLlxuXHQqXG5cdCogQGV4YW1wbGVcblx0KiAgIGNvbnN0IGdldFZhbHVlRnJvbVN0b3JhZ2UgPSBhc3luYyAoKSA9PiB7XG5cdCogICAgIGlmIChjdHguaXNJbnZhbGlkKSByZXR1cm4gY3R4LmJsb2NrKCk7XG5cdCpcblx0KiAgICAgLy8gLi4uXG5cdCogICB9O1xuXHQqL1xuXHRibG9jaygpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKCkgPT4ge30pO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cuc2V0SW50ZXJ2YWxgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIEludGVydmFscyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNsZWFySW50ZXJ2YWxgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRJbnRlcnZhbChoYW5kbGVyLCB0aW1lb3V0KSB7XG5cdFx0Y29uc3QgaWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFySW50ZXJ2YWwoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRUaW1lb3V0YCB0aGF0IGF1dG9tYXRpY2FsbHkgY2xlYXJzIHRoZSBpbnRlcnZhbFxuXHQqIHdoZW4gaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBUaW1lb3V0cyBjYW4gYmUgY2xlYXJlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYHNldFRpbWVvdXRgIGZ1bmN0aW9uLlxuXHQqL1xuXHRzZXRUaW1lb3V0KGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgaGFuZGxlcigpO1xuXHRcdH0sIHRpbWVvdXQpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjbGVhclRpbWVvdXQoaWQpKTtcblx0XHRyZXR1cm4gaWQ7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzXG5cdCogdGhlIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxBbmltYXRpb25GcmFtZWBcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNhbGxiYWNrKSB7XG5cdFx0Y29uc3QgaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGNhbGxiYWNrKC4uLmFyZ3MpO1xuXHRcdH0pO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2tgIHRoYXQgYXV0b21hdGljYWxseSBjYW5jZWxzIHRoZVxuXHQqIHJlcXVlc3Qgd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIENhbGxiYWNrcyBjYW4gYmUgY2FuY2VsZWQgYnkgY2FsbGluZyB0aGUgbm9ybWFsIGBjYW5jZWxJZGxlQ2FsbGJhY2tgXG5cdCogZnVuY3Rpb24uXG5cdCovXG5cdHJlcXVlc3RJZGxlQ2FsbGJhY2soY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RJZGxlQ2FsbGJhY2soKC4uLmFyZ3MpID0+IHtcblx0XHRcdGlmICghdGhpcy5zaWduYWwuYWJvcnRlZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSwgb3B0aW9ucyk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbElkbGVDYWxsYmFjayhpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHRhZGRFdmVudExpc3RlbmVyKHRhcmdldCwgdHlwZSwgaGFuZGxlciwgb3B0aW9ucykge1xuXHRcdGlmICh0eXBlID09PSBcInd4dDpsb2NhdGlvbmNoYW5nZVwiKSB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSB0aGlzLmxvY2F0aW9uV2F0Y2hlci5ydW4oKTtcblx0XHR9XG5cdFx0dGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXI/Lih0eXBlLnN0YXJ0c1dpdGgoXCJ3eHQ6XCIpID8gZ2V0VW5pcXVlRXZlbnROYW1lKHR5cGUpIDogdHlwZSwgaGFuZGxlciwge1xuXHRcdFx0Li4ub3B0aW9ucyxcblx0XHRcdHNpZ25hbDogdGhpcy5zaWduYWxcblx0XHR9KTtcblx0fVxuXHQvKipcblx0KiBAaW50ZXJuYWxcblx0KiBBYm9ydCB0aGUgYWJvcnQgY29udHJvbGxlciBhbmQgZXhlY3V0ZSBhbGwgYG9uSW52YWxpZGF0ZWRgIGxpc3RlbmVycy5cblx0Ki9cblx0bm90aWZ5SW52YWxpZGF0ZWQoKSB7XG5cdFx0dGhpcy5hYm9ydChcIkNvbnRlbnQgc2NyaXB0IGNvbnRleHQgaW52YWxpZGF0ZWRcIik7XG5cdFx0bG9nZ2VyLmRlYnVnKGBDb250ZW50IHNjcmlwdCBcIiR7dGhpcy5jb250ZW50U2NyaXB0TmFtZX1cIiBjb250ZXh0IGludmFsaWRhdGVkYCk7XG5cdH1cblx0c3RvcE9sZFNjcmlwdHMoKSB7XG5cdFx0ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCB7IGRldGFpbDoge1xuXHRcdFx0Y29udGVudFNjcmlwdE5hbWU6IHRoaXMuY29udGVudFNjcmlwdE5hbWUsXG5cdFx0XHRtZXNzYWdlSWQ6IHRoaXMuaWRcblx0XHR9IH0pKTtcblx0XHRpZiAoIXRoaXMub3B0aW9ucz8ubm9TY3JpcHRTdGFydGVkUG9zdE1lc3NhZ2UpIHdpbmRvdy5wb3N0TWVzc2FnZSh7XG5cdFx0XHR0eXBlOiBDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsXG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0sIFwiKlwiKTtcblx0fVxuXHR2ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpIHtcblx0XHRjb25zdCBpc1NhbWVDb250ZW50U2NyaXB0ID0gZXZlbnQuZGV0YWlsPy5jb250ZW50U2NyaXB0TmFtZSA9PT0gdGhpcy5jb250ZW50U2NyaXB0TmFtZTtcblx0XHRjb25zdCBpc0Zyb21TZWxmID0gZXZlbnQuZGV0YWlsPy5tZXNzYWdlSWQgPT09IHRoaXMuaWQ7XG5cdFx0cmV0dXJuIGlzU2FtZUNvbnRlbnRTY3JpcHQgJiYgIWlzRnJvbVNlbGY7XG5cdH1cblx0bGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCkge1xuXHRcdGNvbnN0IGNiID0gKGV2ZW50KSA9PiB7XG5cdFx0XHRpZiAoIShldmVudCBpbnN0YW5jZW9mIEN1c3RvbUV2ZW50KSB8fCAhdGhpcy52ZXJpZnlTY3JpcHRTdGFydGVkRXZlbnQoZXZlbnQpKSByZXR1cm47XG5cdFx0XHR0aGlzLm5vdGlmeUludmFsaWRhdGVkKCk7XG5cdFx0fTtcblx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpO1xuXHRcdHRoaXMub25JbnZhbGlkYXRlZCgoKSA9PiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSwgY2IpKTtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgQ29udGVudFNjcmlwdENvbnRleHQgfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0Ijpb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