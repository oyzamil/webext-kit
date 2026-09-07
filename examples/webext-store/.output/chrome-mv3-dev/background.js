var background = (function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
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
	var browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.bun/@wxt-dev+browser@0.2.9/node_modules/@wxt-dev/browser/src/index.mjs
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
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
	//#region ../../packages/webext-store/dist/src-CJW_6Jac.mjs
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
			return getValueOrFallback(res, opts?.fallback ?? opts?.defaultValue);
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
						const value = getValueOrFallback(driverResult.value, opts?.fallback ?? opts?.defaultValue);
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
				await Promise.all(Object.entries(areaToDriverMetaKeysMap).map(async ([area, keys]) => {
					const areaRes = await browser.storage[area].get(keys.map((key) => key.driverMetaKey));
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
			if (browser.runtime == null) throw Error(`'webext-store' must be loaded in a web extension environment.

 - If thrown during tests, mock '@wxt-dev/browser' correctly. See https://wxt.dev/guide/go-further/testing.html
`);
			if (browser.storage == null) throw Error("You must add the 'storage' permission to your manifest to use 'webext-store'");
			const area = browser.storage[storageArea];
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
	var MigrationError = class extends Error {
		key;
		version;
		constructor(key, version, options) {
			super(`v${version} migration failed for "${key}"`, options);
			this.key = key;
			this.version = version;
		}
	};
	//#endregion
	//#region src/utils/storage-items.ts
	/**
	* A versioned item. Bumping `version` and adding a migration function is how
	* webext-store evolves a stored shape over time — migrations run
	* automatically, once, the first time the item is touched after an update.
	*/
	var settingsItem = storage.defineItem("sync:settings", {
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
	/**
	* `init` runs exactly once — the first time this item is defined in any
	* extension context after install — and only if nothing is in storage yet.
	* Good for one-time IDs, first-run timestamps, etc.
	*/
	var installIdItem = storage.defineItem("local:installId", { init: () => crypto.randomUUID() });
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
	//#region src/entrypoints/background.ts
	/**
	* Background / service worker guide
	* ----------------------------------
	* MV3 service workers are NOT long-lived — the browser kills and restarts
	* them whenever it wants (idle timeout, memory pressure, etc). Nothing you
	* hold in a plain JS variable here survives that. `webext-store` items do,
	* because every read/write goes straight to `browser.storage`, not to
	* in-memory state — that's *why* storage, not module-level variables, is
	* the right place for anything the background needs to remember.
	*
	* Three separate lifecycle hooks matter here, and it's easy to conflate
	* them:
	*   - `defineBackground(() => {...})` body — runs every time this service
	*     worker (re)starts. Put subscriptions (`.watch()`) and alarm/message
	*     listeners here — they need to be re-registered on every restart.
	*   - `browser.runtime.onInstalled` — runs once on install, and once per
	*     extension update. This is the correct place for one-time setup and
	*     for forcing migrations before anything else touches the data.
	*   - `browser.alarms` — MV3's replacement for `setInterval` in a service
	*     worker; a plain `setInterval` gets thrown away the moment the worker
	*     is killed, `alarms` survives restarts because the browser itself
	*     schedules them.
	*/
	var background_default = defineBackground(() => {
		console.log("[webext-store-demo] background started");
		browser$1.runtime.onInstalled.addListener(({ reason }) => {
			if (reason === "install") console.log("[webext-store-demo] first install");
			else if (reason === "update") console.log("[webext-store-demo] updated — running pending migrations");
			settingsItem.migrate();
		});
		settingsItem.migrate();
		installIdItem.getValue().then((id) => {
			console.log("[webext-store-demo] install id:", id);
		});
		const unwatchHeartbeat = heartbeatItem.watch((newValue, oldValue) => {
			console.log(`[webext-store-demo] heartbeat: ${oldValue} -> ${newValue}`);
		});
		browser$1.alarms.create("heartbeat", { periodInMinutes: .05 });
		browser$1.alarms.onAlarm.addListener(async (alarm) => {
			if (alarm.name !== "heartbeat") return;
			const current = await heartbeatItem.getValue();
			await heartbeatItem.setValue(current + 1);
		});
		browser$1.runtime.onMessage.addListener((message) => {
			if (message?.type === "bump-heartbeat") return heartbeatItem.getValue().then((current) => heartbeatItem.setValue(current + 1));
		});
		self.addEventListener("beforeunload", () => {
			unwatchHeartbeat();
			storage.unwatch();
		});
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
	//#region \0virtual:wxt-background-entrypoint?D:/Projects/webext-kit/examples/webext-store/src/entrypoints/background.ts
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
			await browser$1.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser$1.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		logger.log("Reloading content script:", contentScript);
		const registered = await browser$1.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser$1.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser$1.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser$1.scripting.getRegisteredContentScripts();
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
		await browser$1.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser$1.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser$1.tabs.reload(tab.id);
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
			browser$1.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser$1.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser$1.runtime.reload();
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJicm93c2VyIiwiYnJvd3NlciQxIiwid2l0aExvY2siXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40KzAwN2RmYmM0MmY1YTQyNzYvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad3h0LWRlditicm93c2VyQDAuMi45L25vZGVfbW9kdWxlcy9Ad3h0LWRldi9icm93c2VyL3NyYy9pbmRleC5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9zdXBlcmxvY2tAMS4zLjUvbm9kZV9tb2R1bGVzL3N1cGVybG9jay9zcmMvY3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vc3VwZXJsb2NrQDEuMy41L25vZGVfbW9kdWxlcy9zdXBlcmxvY2svc3JjL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LXN0b3JlL2Rpc3Qvc3JjLUNKV182SmFjLm1qcyIsIi4uLy4uL3NyYy91dGlscy9zdG9yYWdlLWl0ZW1zLnRzIiwiLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad2ViZXh0LWNvcmUrbWF0Y2gtcGF0dGVybnNAMi4wLjAvbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhXG4gIH1cbn1cblxuY2xhc3MgTGlua2VkTGlzdCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgfVxuXG4gIGVucXVldWUgKGRhdGEpIHtcbiAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoZGF0YSlcbiAgICBub2RlLnByZXYgPSB0aGlzLnRhaWxcbiAgICBpZiAodGhpcy50YWlsKSB0aGlzLnRhaWwubmV4dCA9IG5vZGVcbiAgICBlbHNlIHRoaXMuaGVhZCA9IG5vZGVcbiAgICB0aGlzLnRhaWwgPSBub2RlXG4gICAgdGhpcy5sZW5ndGgrK1xuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBkZXF1ZXVlICgpIHtcbiAgICBpZiAoIXRoaXMuaGVhZCkgcmV0dXJuXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLmhlYWRcbiAgICB0aGlzLnJlbW92ZSh0aGlzLmhlYWQpXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIHJlbW92ZSAobm9kZSkge1xuICAgIGlmIChub2RlLnByZXYpIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0XG4gICAgZWxzZSB0aGlzLmhlYWQgPSBub2RlLm5leHRcbiAgICBpZiAobm9kZS5uZXh0KSBub2RlLm5leHQucHJldiA9IG5vZGUucHJldlxuICAgIGVsc2UgdGhpcy50YWlsID0gbm9kZS5wcmV2XG4gICAgdGhpcy5sZW5ndGgtLVxuICB9XG5cbiAgc2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoc2xvdHMgPSAxKSA9PiB7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IExpbmtlZExpc3QoKVxuXG4gIGNvbnN0IHJlbGVhc2UgPSAoKSA9PiB7XG4gICAgKytzbG90c1xuICAgIGNvbnN0IHdhaXRlciA9IHF1ZXVlLmRlcXVldWUoKVxuICAgIGlmICh3YWl0ZXIpIHJldHVybiB3YWl0ZXIuYWNxdWlyZSgpXG4gIH1cblxuICBjb25zdCBhY3F1aXJlID0gcmVzb2x2ZSA9PiB7XG4gICAgLS1zbG90c1xuICAgIHJlc29sdmUocmVsZWFzZSlcbiAgfVxuXG4gIGNvbnN0IGxvY2sgPSBzaWduYWwgPT5cbiAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChzaWduYWwgIT0gbnVsbCAmJiB0eXBlb2Ygc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHNpZ25hbGAgbmVlZHMgdG8gYmUgYW4gQWJvcnRTaWduYWwuJylcbiAgICAgIH1cbiAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHJldHVybiByZXNvbHZlKG51bGwpXG4gICAgICBpZiAoIWxvY2suaXNMb2NrZWQoKSkgcmV0dXJuIGFjcXVpcmUocmVzb2x2ZSlcblxuICAgICAgY29uc3Qgd2FpdGVyID0geyBhY3F1aXJlOiAoKSA9PiBhY3F1aXJlKHJlc29sdmUpIH1cbiAgICAgIGNvbnN0IG5vZGUgPSBxdWV1ZS5lbnF1ZXVlKHdhaXRlcilcblxuICAgICAgaWYgKHNpZ25hbCAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7XG4gICAgICAgICAgcXVldWUucmVtb3ZlKG5vZGUpXG4gICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICB9XG4gICAgICAgIHdhaXRlci5hY3F1aXJlID0gKCkgPT4ge1xuICAgICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpXG4gICAgICAgICAgYWNxdWlyZShyZXNvbHZlKVxuICAgICAgICB9XG4gICAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgbG9jay5pc0xvY2tlZCA9ICgpID0+IHNsb3RzID09PSAwXG5cbiAgbG9jay5hd2FpdGluZyA9ICgpID0+IHF1ZXVlLnNpemUoKVxuXG4gIHJldHVybiBsb2NrXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgY3JlYXRlTG9jayA9IHJlcXVpcmUoJy4vY3JlYXRlJylcblxuY29uc3Qgd2l0aExvY2sgPSBvcHRzID0+IHtcbiAgY29uc3QgbG9jayA9IGNyZWF0ZUxvY2sob3B0cylcblxuICBjb25zdCB3aXRoTG9jayA9IGFzeW5jIChmbiwgc2lnbmFsKSA9PiB7XG4gICAgY29uc3QgcmVsZWFzZSA9IGF3YWl0IGxvY2soc2lnbmFsKVxuICAgIGlmICghcmVsZWFzZSkgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBmbigpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlbGVhc2UoKVxuICAgIH1cbiAgfVxuXG4gIHdpdGhMb2NrLmlzTG9ja2VkID0gbG9jay5pc0xvY2tlZFxuICB3aXRoTG9jay5hd2FpdGluZyA9IGxvY2suYXdhaXRpbmdcblxuICByZXR1cm4gd2l0aExvY2tcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHdpdGhMb2NrLCBjcmVhdGVMb2NrIH1cbiIsImltcG9ydCB7IGJyb3dzZXIgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuaW1wb3J0IHsgd2l0aExvY2sgfSBmcm9tIFwic3VwZXJsb2NrXCI7XG4vLyNyZWdpb24gLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vZGVxdWFsQDIuMC4zL25vZGVfbW9kdWxlcy9kZXF1YWwvbGl0ZS9pbmRleC5tanNcbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gZGVxdWFsKGZvbywgYmFyKSB7XG5cdHZhciBjdG9yLCBsZW47XG5cdGlmIChmb28gPT09IGJhcikgcmV0dXJuIHRydWU7XG5cdGlmIChmb28gJiYgYmFyICYmIChjdG9yID0gZm9vLmNvbnN0cnVjdG9yKSA9PT0gYmFyLmNvbnN0cnVjdG9yKSB7XG5cdFx0aWYgKGN0b3IgPT09IERhdGUpIHJldHVybiBmb28uZ2V0VGltZSgpID09PSBiYXIuZ2V0VGltZSgpO1xuXHRcdGlmIChjdG9yID09PSBSZWdFeHApIHJldHVybiBmb28udG9TdHJpbmcoKSA9PT0gYmFyLnRvU3RyaW5nKCk7XG5cdFx0aWYgKGN0b3IgPT09IEFycmF5KSB7XG5cdFx0XHRpZiAoKGxlbiA9IGZvby5sZW5ndGgpID09PSBiYXIubGVuZ3RoKSB3aGlsZSAobGVuLS0gJiYgZGVxdWFsKGZvb1tsZW5dLCBiYXJbbGVuXSkpO1xuXHRcdFx0cmV0dXJuIGxlbiA9PT0gLTE7XG5cdFx0fVxuXHRcdGlmICghY3RvciB8fCB0eXBlb2YgZm9vID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRsZW4gPSAwO1xuXHRcdFx0Zm9yIChjdG9yIGluIGZvbykge1xuXHRcdFx0XHRpZiAoaGFzLmNhbGwoZm9vLCBjdG9yKSAmJiArK2xlbiAmJiAhaGFzLmNhbGwoYmFyLCBjdG9yKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoIShjdG9yIGluIGJhcikgfHwgIWRlcXVhbChmb29bY3Rvcl0sIGJhcltjdG9yXSkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhiYXIpLmxlbmd0aCA9PT0gbGVuO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZm9vICE9PSBmb28gJiYgYmFyICE9PSBiYXI7XG59XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvaW5kZXgudHNcbi8qKlxuKiBTaW1wbGlmaWVkLCB0eXBlLXNhZmUgc3RvcmFnZSBBUElzIGZvciBicm93c2VyIGV4dGVuc2lvbnMsIHdpdGggc3VwcG9ydCBmb3JcbiogdmVyc2lvbmVkIGZpZWxkcywgc25hcHNob3RzLCBtZXRhZGF0YSwgYW5kIGl0ZW0gZGVmaW5pdGlvbnMuXG4qXG4qIEBtb2R1bGUgd2ViZXh0LXN0b3JlXG4qL1xuY29uc3Qgc3RvcmFnZSA9IGNyZWF0ZVN0b3JhZ2UoKTtcbmZ1bmN0aW9uIGNyZWF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IGRyaXZlcnMgPSB7XG5cdFx0bG9jYWw6IGNyZWF0ZURyaXZlcihcImxvY2FsXCIpLFxuXHRcdHNlc3Npb246IGNyZWF0ZURyaXZlcihcInNlc3Npb25cIiksXG5cdFx0c3luYzogY3JlYXRlRHJpdmVyKFwic3luY1wiKSxcblx0XHRtYW5hZ2VkOiBjcmVhdGVEcml2ZXIoXCJtYW5hZ2VkXCIpXG5cdH07XG5cdGNvbnN0IGdldERyaXZlciA9IChhcmVhKSA9PiB7XG5cdFx0Y29uc3QgZHJpdmVyID0gZHJpdmVyc1thcmVhXTtcblx0XHRpZiAoZHJpdmVyID09IG51bGwpIHtcblx0XHRcdGNvbnN0IGFyZWFOYW1lcyA9IE9iamVjdC5rZXlzKGRyaXZlcnMpLmpvaW4oXCIsIFwiKTtcblx0XHRcdHRocm93IEVycm9yKGBJbnZhbGlkIGFyZWEgXCIke2FyZWF9XCIuIE9wdGlvbnM6ICR7YXJlYU5hbWVzfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZHJpdmVyO1xuXHR9O1xuXHRjb25zdCByZXNvbHZlS2V5ID0gKGtleSkgPT4ge1xuXHRcdGNvbnN0IGRlbGltaW5hdG9ySW5kZXggPSBrZXkuaW5kZXhPZihcIjpcIik7XG5cdFx0Y29uc3QgZHJpdmVyQXJlYSA9IGtleS5zdWJzdHJpbmcoMCwgZGVsaW1pbmF0b3JJbmRleCk7XG5cdFx0Y29uc3QgZHJpdmVyS2V5ID0ga2V5LnN1YnN0cmluZyhkZWxpbWluYXRvckluZGV4ICsgMSk7XG5cdFx0aWYgKGRyaXZlcktleSA9PSBudWxsKSB0aHJvdyBFcnJvcihgU3RvcmFnZSBrZXkgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIFwiYXJlYTprZXlcIiwgYnV0IHJlY2VpdmVkIFwiJHtrZXl9XCJgKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZHJpdmVyQXJlYSxcblx0XHRcdGRyaXZlcktleSxcblx0XHRcdGRyaXZlcjogZ2V0RHJpdmVyKGRyaXZlckFyZWEpXG5cdFx0fTtcblx0fTtcblx0Y29uc3QgZ2V0TWV0YUtleSA9IChrZXkpID0+IGAke2tleX0kYDtcblx0Y29uc3QgbWVyZ2VNZXRhID0gKG9sZE1ldGEsIG5ld01ldGEpID0+IHtcblx0XHRjb25zdCBuZXdGaWVsZHMgPSB7IC4uLm9sZE1ldGEgfTtcblx0XHRPYmplY3QuZW50cmllcyhuZXdNZXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSBkZWxldGUgbmV3RmllbGRzW2tleV07XG5cdFx0XHRlbHNlIG5ld0ZpZWxkc1trZXldID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0ZpZWxkcztcblx0fTtcblx0Y29uc3QgZ2V0VmFsdWVPckZhbGxiYWNrID0gKHZhbHVlLCBmYWxsYmFjaykgPT4gdmFsdWUgPz8gZmFsbGJhY2sgPz8gbnVsbDtcblx0Y29uc3QgZ2V0TWV0YVZhbHVlID0gKHByb3BlcnRpZXMpID0+IHR5cGVvZiBwcm9wZXJ0aWVzID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb3BlcnRpZXMpID8gcHJvcGVydGllcyA6IHt9O1xuXHRjb25zdCBnZXRJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG5cdFx0Y29uc3QgcmVzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0oZHJpdmVyS2V5KTtcblx0XHRyZXR1cm4gZ2V0VmFsdWVPckZhbGxiYWNrKHJlcywgb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZGVmYXVsdFZhbHVlKTtcblx0fTtcblx0Y29uc3QgZ2V0TWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSkgPT4ge1xuXHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0Y29uc3QgcmVzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSk7XG5cdFx0cmV0dXJuIGdldE1ldGFWYWx1ZShyZXMpO1xuXHR9O1xuXHRjb25zdCBzZXRJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSkgPT4ge1xuXHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKGRyaXZlcktleSwgdmFsdWUgPz8gbnVsbCk7XG5cdH07XG5cdGNvbnN0IHNldE1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpID0+IHtcblx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdGNvbnN0IGV4aXN0aW5nRmllbGRzID0gZ2V0TWV0YVZhbHVlKGF3YWl0IGRyaXZlci5nZXRJdGVtKG1ldGFLZXkpKTtcblx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbShtZXRhS2V5LCBtZXJnZU1ldGEoZXhpc3RpbmdGaWVsZHMsIHByb3BlcnRpZXMpKTtcblx0fTtcblx0Y29uc3QgcmVtb3ZlSXRlbSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgb3B0cykgPT4ge1xuXHRcdGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKGRyaXZlcktleSk7XG5cdFx0aWYgKG9wdHM/LnJlbW92ZU1ldGEpIHtcblx0XHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0XHRhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShtZXRhS2V5KTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IHJlbW92ZU1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpID0+IHtcblx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdGlmIChwcm9wZXJ0aWVzID09IG51bGwpIGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKG1ldGFLZXkpO1xuXHRcdGVsc2Uge1xuXHRcdFx0Y29uc3QgbmV3RmllbGRzID0gZ2V0TWV0YVZhbHVlKGF3YWl0IGRyaXZlci5nZXRJdGVtKG1ldGFLZXkpKTtcblx0XHRcdFtwcm9wZXJ0aWVzXS5mbGF0KCkuZm9yRWFjaCgoZmllbGQpID0+IHtcblx0XHRcdFx0ZGVsZXRlIG5ld0ZpZWxkc1tmaWVsZF07XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKG1ldGFLZXksIG5ld0ZpZWxkcyk7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCB3YXRjaCA9IChkcml2ZXIsIGRyaXZlcktleSwgY2IpID0+IGRyaXZlci53YXRjaChkcml2ZXJLZXksIGNiKTtcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtOiBhc3luYyAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRyZXR1cm4gYXdhaXQgZ2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0fSxcblx0XHRnZXRJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb0tleU1hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRjb25zdCBrZXlUb09wdHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Y29uc3Qgb3JkZXJlZEtleXMgPSBbXTtcblx0XHRcdGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRcdGxldCBrZXlTdHI7XG5cdFx0XHRcdGxldCBvcHRzO1xuXHRcdFx0XHRpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikga2V5U3RyID0ga2V5O1xuXHRcdFx0XHRlbHNlIGlmIChcImdldFZhbHVlXCIgaW4ga2V5KSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0geyBmYWxsYmFjazoga2V5LmZhbGxiYWNrIH07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3JkZXJlZEtleXMucHVzaChrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCBhcmVhS2V5cyA9IGFyZWFUb0tleU1hcC5nZXQoZHJpdmVyQXJlYSkgPz8gW107XG5cdFx0XHRcdGFyZWFUb0tleU1hcC5zZXQoZHJpdmVyQXJlYSwgYXJlYUtleXMuY29uY2F0KGRyaXZlcktleSkpO1xuXHRcdFx0XHRrZXlUb09wdHNNYXAuc2V0KGtleVN0ciwgb3B0cyk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJlc3VsdHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShhcmVhVG9LZXlNYXAuZW50cmllcygpKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHQoYXdhaXQgZHJpdmVyc1tkcml2ZXJBcmVhXS5nZXRJdGVtcyhrZXlzKSkuZm9yRWFjaCgoZHJpdmVyUmVzdWx0KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qga2V5ID0gYCR7ZHJpdmVyQXJlYX06JHtkcml2ZXJSZXN1bHQua2V5fWA7XG5cdFx0XHRcdFx0Y29uc3Qgb3B0cyA9IGtleVRvT3B0c01hcC5nZXQoa2V5KTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGdldFZhbHVlT3JGYWxsYmFjayhkcml2ZXJSZXN1bHQudmFsdWUsIG9wdHM/LmZhbGxiYWNrID8/IG9wdHM/LmRlZmF1bHRWYWx1ZSk7XG5cdFx0XHRcdFx0cmVzdWx0c01hcC5zZXQoa2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXHRcdFx0cmV0dXJuIG9yZGVyZWRLZXlzLm1hcCgoa2V5KSA9PiAoe1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHZhbHVlOiByZXN1bHRzTWFwLmdldChrZXkpXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRnZXRNZXRhOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRyZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG5cdFx0fSxcblx0XHRnZXRNZXRhczogYXN5bmMgKGFyZ3MpID0+IHtcblx0XHRcdGNvbnN0IGtleXMgPSBhcmdzLm1hcCgoYXJnKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGtleSA9IHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIgPyBhcmcgOiBhcmcua2V5O1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHRkcml2ZXJBcmVhLFxuXHRcdFx0XHRcdGRyaXZlcktleSxcblx0XHRcdFx0XHRkcml2ZXJNZXRhS2V5OiBnZXRNZXRhS2V5KGRyaXZlcktleSlcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgYXJlYVRvRHJpdmVyTWV0YUtleXNNYXAgPSBrZXlzLnJlZHVjZSgobWFwLCBrZXkpID0+IHtcblx0XHRcdFx0bWFwW2tleS5kcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdG1hcFtrZXkuZHJpdmVyQXJlYV0/LnB1c2goa2V5KTtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH0sIHt9KTtcblx0XHRcdGNvbnN0IHJlc3VsdHNNYXAgPSB7fTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0RyaXZlck1ldGFLZXlzTWFwKS5tYXAoYXN5bmMgKFthcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBhcmVhUmVzID0gYXdhaXQgYnJvd3Nlci5zdG9yYWdlW2FyZWFdLmdldChrZXlzLm1hcCgoa2V5KSA9PiBrZXkuZHJpdmVyTWV0YUtleSkpO1xuXHRcdFx0XHRrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRcdHJlc3VsdHNNYXBba2V5LmtleV0gPSBhcmVhUmVzW2tleS5kcml2ZXJNZXRhS2V5XSA/PyB7fTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRyZXR1cm4ga2V5cy5tYXAoKGtleSkgPT4gKHtcblx0XHRcdFx0a2V5OiBrZXkua2V5LFxuXHRcdFx0XHRtZXRhOiByZXN1bHRzTWFwW2tleS5rZXldXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0c2V0SXRlbXM6IGFzeW5jIChpdGVtcykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5VmFsdWVNYXAgPSB7fTtcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoXCJrZXlcIiBpbiBpdGVtID8gaXRlbS5rZXkgOiBpdGVtLml0ZW0ua2V5KTtcblx0XHRcdFx0YXJlYVRvS2V5VmFsdWVNYXBbZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRhcmVhVG9LZXlWYWx1ZU1hcFtkcml2ZXJBcmVhXS5wdXNoKHtcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogaXRlbS52YWx1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvS2V5VmFsdWVNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIHZhbHVlc10pID0+IHtcblx0XHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGRyaXZlckFyZWEpLnNldEl0ZW1zKHZhbHVlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNldE1ldGFzOiBhc3luYyAoaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb01ldGFVcGRhdGVzTWFwID0ge307XG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KFwia2V5XCIgaW4gaXRlbSA/IGl0ZW0ua2V5IDogaXRlbS5pdGVtLmtleSk7XG5cdFx0XHRcdGFyZWFUb01ldGFVcGRhdGVzTWFwW2RyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0YXJlYVRvTWV0YVVwZGF0ZXNNYXBbZHJpdmVyQXJlYV0ucHVzaCh7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0cHJvcGVydGllczogaXRlbS5tZXRhXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyhhcmVhVG9NZXRhVXBkYXRlc01hcCkubWFwKGFzeW5jIChbc3RvcmFnZUFyZWEsIHVwZGF0ZXNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRyaXZlciA9IGdldERyaXZlcihzdG9yYWdlQXJlYSk7XG5cdFx0XHRcdGNvbnN0IG1ldGFLZXlzID0gdXBkYXRlcy5tYXAoKHsga2V5IH0pID0+IGdldE1ldGFLZXkoa2V5KSk7XG5cdFx0XHRcdGNvbnN0IGV4aXN0aW5nTWV0YXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbXMobWV0YUtleXMpO1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ01ldGFNYXAgPSBPYmplY3QuZnJvbUVudHJpZXMoZXhpc3RpbmdNZXRhcy5tYXAoKHsga2V5LCB2YWx1ZSB9KSA9PiBba2V5LCBnZXRNZXRhVmFsdWUodmFsdWUpXSkpO1xuXHRcdFx0XHRjb25zdCBtZXRhVXBkYXRlcyA9IHVwZGF0ZXMubWFwKCh7IGtleSwgcHJvcGVydGllcyB9KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0a2V5OiBtZXRhS2V5LFxuXHRcdFx0XHRcdFx0dmFsdWU6IG1lcmdlTWV0YShleGlzdGluZ01ldGFNYXBbbWV0YUtleV0gPz8ge30sIHByb3BlcnRpZXMpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtcyhtZXRhVXBkYXRlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtOiBhc3luYyAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5c01hcCA9IHt9O1xuXHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0bGV0IGtleVN0cjtcblx0XHRcdFx0bGV0IG9wdHM7XG5cdFx0XHRcdGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSBrZXlTdHIgPSBrZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiZ2V0VmFsdWVcIiBpbiBrZXkpIGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiaXRlbVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5pdGVtLmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5U3RyKTtcblx0XHRcdFx0YXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0ucHVzaChkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAob3B0cz8ucmVtb3ZlTWV0YSkgYXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXS5wdXNoKGdldE1ldGFLZXkoZHJpdmVyS2V5KSk7XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0tleXNNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdGF3YWl0IGdldERyaXZlcihkcml2ZXJBcmVhKS5yZW1vdmVJdGVtcyhrZXlzKTtcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBhc3luYyAoYmFzZSkgPT4ge1xuXHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGJhc2UpLmNsZWFyKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoYmFzZSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGdldERyaXZlcihiYXNlKS5zbmFwc2hvdCgpO1xuXHRcdFx0b3B0cz8uZXhjbHVkZUtleXM/LmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldO1xuXHRcdFx0XHRkZWxldGUgZGF0YVtnZXRNZXRhS2V5KGtleSldO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGJhc2UsIGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldERyaXZlcihiYXNlKS5yZXN0b3JlU25hcHNob3QoZGF0YSk7XG5cdFx0fSxcblx0XHR3YXRjaDogKGtleSwgY2IpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgY2IpO1xuXHRcdH0sXG5cdFx0dW53YXRjaCgpIHtcblx0XHRcdE9iamVjdC52YWx1ZXMoZHJpdmVycykuZm9yRWFjaCgoZHJpdmVyKSA9PiB7XG5cdFx0XHRcdGRyaXZlci51bndhdGNoKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRlZmluZUl0ZW06IChrZXksIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdGNvbnN0IHsgdmVyc2lvbjogdGFyZ2V0VmVyc2lvbiA9IDEsIG1pZ3JhdGlvbnMgPSB7fSwgb25NaWdyYXRpb25Db21wbGV0ZSwgZGVidWcgPSBmYWxzZSB9ID0gb3B0cyA/PyB7fTtcblx0XHRcdGlmICh0YXJnZXRWZXJzaW9uIDwgMSkgdGhyb3cgRXJyb3IoXCJTdG9yYWdlIGl0ZW0gdmVyc2lvbiBjYW5ub3QgYmUgbGVzcyB0aGFuIDEuIEluaXRpYWwgdmVyc2lvbnMgc2hvdWxkIGJlIHNldCB0byAxLCBub3QgMC5cIik7XG5cdFx0XHRsZXQgbmVlZHNWZXJzaW9uU2V0ID0gZmFsc2U7XG5cdFx0XHRjb25zdCBtaWdyYXRlID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBkcml2ZXJNZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdFx0XHRjb25zdCBbeyB2YWx1ZSB9LCB7IHZhbHVlOiBtZXRhIH1dID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKFtkcml2ZXJLZXksIGRyaXZlck1ldGFLZXldKTtcblx0XHRcdFx0bmVlZHNWZXJzaW9uU2V0ID0gdmFsdWUgPT0gbnVsbCAmJiBtZXRhPy52ID09IG51bGwgJiYgISF0YXJnZXRWZXJzaW9uO1xuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0XHRjb25zdCBjdXJyZW50VmVyc2lvbiA9IG1ldGE/LnYgPz8gMTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWZXJzaW9uID4gdGFyZ2V0VmVyc2lvbikgdGhyb3cgRXJyb3IoYFZlcnNpb24gZG93bmdyYWRlIGRldGVjdGVkICh2JHtjdXJyZW50VmVyc2lvbn0gLT4gdiR7dGFyZ2V0VmVyc2lvbn0pIGZvciBcIiR7a2V5fVwiYCk7XG5cdFx0XHRcdGlmIChjdXJyZW50VmVyc2lvbiA9PT0gdGFyZ2V0VmVyc2lvbikgcmV0dXJuO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFJ1bm5pbmcgc3RvcmFnZSBtaWdyYXRpb24gZm9yICR7a2V5fTogdiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259YCk7XG5cdFx0XHRcdGNvbnN0IG1pZ3JhdGlvbnNUb1J1biA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRhcmdldFZlcnNpb24gLSBjdXJyZW50VmVyc2lvbiB9LCAoXywgaSkgPT4gY3VycmVudFZlcnNpb24gKyBpICsgMSk7XG5cdFx0XHRcdGxldCBtaWdyYXRlZFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdGZvciAoY29uc3QgbWlncmF0ZVRvVmVyc2lvbiBvZiBtaWdyYXRpb25zVG9SdW4pIHRyeSB7XG5cdFx0XHRcdFx0bWlncmF0ZWRWYWx1ZSA9IGF3YWl0IG1pZ3JhdGlvbnM/LlttaWdyYXRlVG9WZXJzaW9uXT8uKG1pZ3JhdGVkVmFsdWUpID8/IG1pZ3JhdGVkVmFsdWU7XG5cdFx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBTdG9yYWdlIG1pZ3JhdGlvbiBwcm9jZXNzZWQgZm9yIHZlcnNpb246IHYke21pZ3JhdGVUb1ZlcnNpb259YCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBNaWdyYXRpb25FcnJvcihrZXksIG1pZ3JhdGVUb1ZlcnNpb24sIHsgY2F1c2U6IGVyciB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbXMoW3tcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogbWlncmF0ZWRWYWx1ZVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJNZXRhS2V5LFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHQuLi5tZXRhLFxuXHRcdFx0XHRcdFx0djogdGFyZ2V0VmVyc2lvblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fV0pO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFN0b3JhZ2UgbWlncmF0aW9uIGNvbXBsZXRlZCBmb3IgJHtrZXl9IHYke3RhcmdldFZlcnNpb259YCwgeyBtaWdyYXRlZFZhbHVlIH0pO1xuXHRcdFx0XHRvbk1pZ3JhdGlvbkNvbXBsZXRlPy4obWlncmF0ZWRWYWx1ZSwgdGFyZ2V0VmVyc2lvbik7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbWlncmF0aW9uc0RvbmUgPSBvcHRzPy5taWdyYXRpb25zID09IG51bGwgPyBQcm9taXNlLnJlc29sdmUoKSA6IG1pZ3JhdGUoKS5jYXRjaCgoZXJyKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFt3ZWJleHQtc3RvcmVdIE1pZ3JhdGlvbiBmYWlsZWQgZm9yICR7a2V5fWAsIGVycik7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGluaXRMb2NrID0gd2l0aExvY2soKTtcblx0XHRcdGNvbnN0IGdldEZhbGxiYWNrID0gKCkgPT4gb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZGVmYXVsdFZhbHVlID8/IG51bGw7XG5cdFx0XHRjb25zdCBnZXRPckluaXRWYWx1ZSA9ICgpID0+IGluaXRMb2NrKGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAodmFsdWUgIT0gbnVsbCB8fCBvcHRzPy5pbml0ID09IG51bGwpIHJldHVybiB2YWx1ZTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBhd2FpdCBvcHRzLmluaXQoKTtcblx0XHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCBuZXdWYWx1ZSk7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmIHRhcmdldFZlcnNpb24gPiAxKSBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCB7IHY6IHRhcmdldFZlcnNpb24gfSk7XG5cdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0bWlncmF0aW9uc0RvbmUudGhlbihnZXRPckluaXRWYWx1ZSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdGdldCBkZWZhdWx0VmFsdWUoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEZhbGxiYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldCBmYWxsYmFjaygpIHtcblx0XHRcdFx0XHRyZXR1cm4gZ2V0RmFsbGJhY2soKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0VmFsdWU6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAob3B0cz8uaW5pdCkgcmV0dXJuIGF3YWl0IGdldE9ySW5pdFZhbHVlKCk7XG5cdFx0XHRcdFx0ZWxzZSByZXR1cm4gYXdhaXQgZ2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldE1ldGE6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldFZhbHVlOiBhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAobmVlZHNWZXJzaW9uU2V0KSB7XG5cdFx0XHRcdFx0XHRuZWVkc1ZlcnNpb25TZXQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFtzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSksIHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHsgdjogdGFyZ2V0VmVyc2lvbiB9KV0pO1xuXHRcdFx0XHRcdH0gZWxzZSBhd2FpdCBzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldE1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmVWYWx1ZTogYXN5bmMgKG9wdHMpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZU1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHJlbW92ZU1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR3YXRjaDogKGNiKSA9PiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4gY2IobmV3VmFsdWUgPz8gZ2V0RmFsbGJhY2soKSwgb2xkVmFsdWUgPz8gZ2V0RmFsbGJhY2soKSkpLFxuXHRcdFx0XHRtaWdyYXRlXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURyaXZlcihzdG9yYWdlQXJlYSkge1xuXHRjb25zdCBnZXRTdG9yYWdlQXJlYSA9ICgpID0+IHtcblx0XHRpZiAoYnJvd3Nlci5ydW50aW1lID09IG51bGwpIHRocm93IEVycm9yKGAnd2ViZXh0LXN0b3JlJyBtdXN0IGJlIGxvYWRlZCBpbiBhIHdlYiBleHRlbnNpb24gZW52aXJvbm1lbnQuXG5cbiAtIElmIHRocm93biBkdXJpbmcgdGVzdHMsIG1vY2sgJ0B3eHQtZGV2L2Jyb3dzZXInIGNvcnJlY3RseS4gU2VlIGh0dHBzOi8vd3h0LmRldi9ndWlkZS9nby1mdXJ0aGVyL3Rlc3RpbmcuaHRtbFxuYCk7XG5cdFx0aWYgKGJyb3dzZXIuc3RvcmFnZSA9PSBudWxsKSB0aHJvdyBFcnJvcihcIllvdSBtdXN0IGFkZCB0aGUgJ3N0b3JhZ2UnIHBlcm1pc3Npb24gdG8geW91ciBtYW5pZmVzdCB0byB1c2UgJ3dlYmV4dC1zdG9yZSdcIik7XG5cdFx0Y29uc3QgYXJlYSA9IGJyb3dzZXIuc3RvcmFnZVtzdG9yYWdlQXJlYV07XG5cdFx0aWYgKGFyZWEgPT0gbnVsbCkgdGhyb3cgRXJyb3IoYFwiYnJvd3Nlci5zdG9yYWdlLiR7c3RvcmFnZUFyZWF9XCIgaXMgdW5kZWZpbmVkYCk7XG5cdFx0cmV0dXJuIGFyZWE7XG5cdH07XG5cdGNvbnN0IHdhdGNoTGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRyZXR1cm4gKGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleSkpW2tleV07XG5cdFx0fSxcblx0XHRnZXRJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleXMpO1xuXHRcdFx0cmV0dXJuIGtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHJlc3VsdFtrZXldID8/IG51bGxcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdHNldEl0ZW06IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5yZW1vdmUoa2V5KTtcblx0XHRcdGVsc2UgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoeyBba2V5XTogdmFsdWUgfSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtczogYXN5bmMgKHZhbHVlcykgPT4ge1xuXHRcdFx0Y29uc3QgbWFwID0gdmFsdWVzLnJlZHVjZSgobWFwLCB7IGtleSwgdmFsdWUgfSkgPT4ge1xuXHRcdFx0XHRtYXBba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0YXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQobWFwKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW06IGFzeW5jIChrZXkpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleXMpO1xuXHRcdH0sXG5cdFx0Y2xlYXI6IGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuY2xlYXIoKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5nZXQoKTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KGRhdGEpO1xuXHRcdH0sXG5cdFx0d2F0Y2goa2V5LCBjYikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoY2hhbmdlcykgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzW2tleV07XG5cdFx0XHRcdGlmIChjaGFuZ2UgPT0gbnVsbCB8fCBkZXF1YWwoY2hhbmdlLm5ld1ZhbHVlLCBjaGFuZ2Uub2xkVmFsdWUpKSByZXR1cm47XG5cdFx0XHRcdGNiKGNoYW5nZS5uZXdWYWx1ZSA/PyBudWxsLCBjaGFuZ2Uub2xkVmFsdWUgPz8gbnVsbCk7XG5cdFx0XHR9O1xuXHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHR1bndhdGNoKCkge1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcblx0XHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0fSk7XG5cdFx0XHR3YXRjaExpc3RlbmVycy5jbGVhcigpO1xuXHRcdH1cblx0fTtcbn1cbnZhciBNaWdyYXRpb25FcnJvciA9IGNsYXNzIGV4dGVuZHMgRXJyb3Ige1xuXHRrZXk7XG5cdHZlcnNpb247XG5cdGNvbnN0cnVjdG9yKGtleSwgdmVyc2lvbiwgb3B0aW9ucykge1xuXHRcdHN1cGVyKGB2JHt2ZXJzaW9ufSBtaWdyYXRpb24gZmFpbGVkIGZvciBcIiR7a2V5fVwiYCwgb3B0aW9ucyk7XG5cdFx0dGhpcy5rZXkgPSBrZXk7XG5cdFx0dGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgc3RvcmFnZSBhcyBuLCBNaWdyYXRpb25FcnJvciBhcyB0IH07XG4iLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnd2ViZXh0LXN0b3JlJztcblxuZXhwb3J0IGludGVyZmFjZSBTZXR0aW5ncyB7XG4gIHRoZW1lOiAnbGlnaHQnIHwgJ2RhcmsnO1xuICBkaXNwbGF5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgdmVyc2lvbmVkIGl0ZW0uIEJ1bXBpbmcgYHZlcnNpb25gIGFuZCBhZGRpbmcgYSBtaWdyYXRpb24gZnVuY3Rpb24gaXMgaG93XG4gKiB3ZWJleHQtc3RvcmUgZXZvbHZlcyBhIHN0b3JlZCBzaGFwZSBvdmVyIHRpbWUg4oCUIG1pZ3JhdGlvbnMgcnVuXG4gKiBhdXRvbWF0aWNhbGx5LCBvbmNlLCB0aGUgZmlyc3QgdGltZSB0aGUgaXRlbSBpcyB0b3VjaGVkIGFmdGVyIGFuIHVwZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxTZXR0aW5ncz4oJ3N5bmM6c2V0dGluZ3MnLCB7XG4gIGZhbGxiYWNrOiB7IHRoZW1lOiAnbGlnaHQnLCBkaXNwbGF5TmFtZTogJ0d1ZXN0JyB9LFxuICB2ZXJzaW9uOiAzLFxuICBtaWdyYXRpb25zOiB7XG4gICAgLy8gdjEgLT4gdjI6IGludHJvZHVjZWQgYHRoZW1lYFxuICAgIDI6IChvbGQ6IGFueSkgPT4gKHsgLi4ub2xkLCB0aGVtZTogb2xkPy50aGVtZSA/PyAnbGlnaHQnIH0pLFxuICAgIC8vIHYyIC0+IHYzOiBpbnRyb2R1Y2VkIGBkaXNwbGF5TmFtZWBcbiAgICAzOiAob2xkOiBhbnkpID0+ICh7IC4uLm9sZCwgZGlzcGxheU5hbWU6IG9sZD8uZGlzcGxheU5hbWUgPz8gJ0d1ZXN0JyB9KSxcbiAgfSxcbiAgZGVidWc6IHRydWUsXG4gIG9uTWlncmF0aW9uQ29tcGxldGU6ICh2YWx1ZSwgdGFyZ2V0VmVyc2lvbikgPT4ge1xuICAgIGNvbnNvbGUubG9nKGBbd2ViZXh0LXN0b3JlLWRlbW9dIHNldHRpbmdzIG1pZ3JhdGVkIHRvIHYke3RhcmdldFZlcnNpb259YCwgdmFsdWUpO1xuICB9LFxufSk7XG5cbi8qKlxuICogYGluaXRgIHJ1bnMgZXhhY3RseSBvbmNlIOKAlCB0aGUgZmlyc3QgdGltZSB0aGlzIGl0ZW0gaXMgZGVmaW5lZCBpbiBhbnlcbiAqIGV4dGVuc2lvbiBjb250ZXh0IGFmdGVyIGluc3RhbGwg4oCUIGFuZCBvbmx5IGlmIG5vdGhpbmcgaXMgaW4gc3RvcmFnZSB5ZXQuXG4gKiBHb29kIGZvciBvbmUtdGltZSBJRHMsIGZpcnN0LXJ1biB0aW1lc3RhbXBzLCBldGMuXG4gKi9cbmV4cG9ydCBjb25zdCBpbnN0YWxsSWRJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPHN0cmluZz4oJ2xvY2FsOmluc3RhbGxJZCcsIHtcbiAgaW5pdDogKCkgPT4gY3J5cHRvLnJhbmRvbVVVSUQoKSxcbn0pO1xuXG4vKipcbiAqIEEgcGxhaW4gY291bnRlciB3aXRoIGEgZmFsbGJhY2sgb2YgMC4gV3JpdHRlbiB0byBmcm9tIHRoZSBwb3B1cCAodmlhIHRoZVxuICogUmVhY3QgaG9vayksIHRoZSBiYWNrZ3JvdW5kIChvbiBhbiBhbGFybSArIG9uIG1lc3NhZ2UpLCBhbmQgcmVhZCBmcm9tXG4gKiBib3RoIOKAlCB0aGlzIGlzIHdoYXQgdGhlIFwiQ3Jvc3MtY29udGV4dFwiIHRhYiB1c2VzIHRvIHByb3ZlIGB3YXRjaCgpYCBmaXJlc1xuICogYWNyb3NzIGV4ZWN1dGlvbiBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGhlYXJ0YmVhdEl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08bnVtYmVyPignbG9jYWw6aGVhcnRiZWF0Jywge1xuICBmYWxsYmFjazogMCxcbn0pO1xuXG4vKiogRml4ZWQga2V5cyB1c2VkIGJ5IHRoZSBiYXRjaC1vcGVyYXRpb25zIHRhYi4gKi9cbmV4cG9ydCBjb25zdCBCQVRDSF9LRVlTID0gWydsb2NhbDpiYXRjaEEnLCAnbG9jYWw6YmF0Y2hCJywgJ2xvY2FsOmJhdGNoQyddIGFzIGNvbnN0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFwcFNldHRpbmcge1xuICB0aGVtZTogJ2xpZ2h0JyB8ICdkYXJrJztcbiAgZnJlZTogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUaGUgYHsgdGhlbWU6ICdkYXJrJywgZnJlZTogdHJ1ZSB9YCBzaGFwZSBmcm9tIHRoZSBcImhvdyBkbyBJIHVwZGF0ZSBvbmVcbiAqIGtleVwiIHF1ZXN0aW9uIOKAlCB1c2VkIGJ5IE9iamVjdFVwZGF0ZVBhbmVsLiB3ZWJleHQtc3RvcmUgc3RvcmVzIHRoZSB3aG9sZVxuICogdmFsdWUgYXMgb25lIEpTT04gYmxvYiwgc28gXCJ1cGRhdGluZyBvbmUga2V5XCIgYWx3YXlzIG1lYW5zIHJlYWQtbW9kaWZ5LVxuICogd3JpdGUgdGhlIHdob2xlIG9iamVjdCwgc2FtZSBhcyB5b3Ugd291bGQgd2l0aCBwbGFpbiBSZWFjdCBzdGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IGFwcFNldHRpbmdJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPEFwcFNldHRpbmc+KCdsb2NhbDphcHBTZXR0aW5nJywge1xuICBmYWxsYmFjazogeyB0aGVtZTogJ2RhcmsnLCBmcmVlOiB0cnVlIH0sXG59KTtcbiIsImltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tICd3ZWJleHQtc3RvcmUnO1xuaW1wb3J0IHsgaGVhcnRiZWF0SXRlbSwgaW5zdGFsbElkSXRlbSwgc2V0dGluZ3NJdGVtIH0gZnJvbSAnQC91dGlscy9zdG9yYWdlLWl0ZW1zJztcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIC8gc2VydmljZSB3b3JrZXIgZ3VpZGVcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIE1WMyBzZXJ2aWNlIHdvcmtlcnMgYXJlIE5PVCBsb25nLWxpdmVkIOKAlCB0aGUgYnJvd3NlciBraWxscyBhbmQgcmVzdGFydHNcbiAqIHRoZW0gd2hlbmV2ZXIgaXQgd2FudHMgKGlkbGUgdGltZW91dCwgbWVtb3J5IHByZXNzdXJlLCBldGMpLiBOb3RoaW5nIHlvdVxuICogaG9sZCBpbiBhIHBsYWluIEpTIHZhcmlhYmxlIGhlcmUgc3Vydml2ZXMgdGhhdC4gYHdlYmV4dC1zdG9yZWAgaXRlbXMgZG8sXG4gKiBiZWNhdXNlIGV2ZXJ5IHJlYWQvd3JpdGUgZ29lcyBzdHJhaWdodCB0byBgYnJvd3Nlci5zdG9yYWdlYCwgbm90IHRvXG4gKiBpbi1tZW1vcnkgc3RhdGUg4oCUIHRoYXQncyAqd2h5KiBzdG9yYWdlLCBub3QgbW9kdWxlLWxldmVsIHZhcmlhYmxlcywgaXNcbiAqIHRoZSByaWdodCBwbGFjZSBmb3IgYW55dGhpbmcgdGhlIGJhY2tncm91bmQgbmVlZHMgdG8gcmVtZW1iZXIuXG4gKlxuICogVGhyZWUgc2VwYXJhdGUgbGlmZWN5Y2xlIGhvb2tzIG1hdHRlciBoZXJlLCBhbmQgaXQncyBlYXN5IHRvIGNvbmZsYXRlXG4gKiB0aGVtOlxuICogICAtIGBkZWZpbmVCYWNrZ3JvdW5kKCgpID0+IHsuLi59KWAgYm9keSDigJQgcnVucyBldmVyeSB0aW1lIHRoaXMgc2VydmljZVxuICogICAgIHdvcmtlciAocmUpc3RhcnRzLiBQdXQgc3Vic2NyaXB0aW9ucyAoYC53YXRjaCgpYCkgYW5kIGFsYXJtL21lc3NhZ2VcbiAqICAgICBsaXN0ZW5lcnMgaGVyZSDigJQgdGhleSBuZWVkIHRvIGJlIHJlLXJlZ2lzdGVyZWQgb24gZXZlcnkgcmVzdGFydC5cbiAqICAgLSBgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkYCDigJQgcnVucyBvbmNlIG9uIGluc3RhbGwsIGFuZCBvbmNlIHBlclxuICogICAgIGV4dGVuc2lvbiB1cGRhdGUuIFRoaXMgaXMgdGhlIGNvcnJlY3QgcGxhY2UgZm9yIG9uZS10aW1lIHNldHVwIGFuZFxuICogICAgIGZvciBmb3JjaW5nIG1pZ3JhdGlvbnMgYmVmb3JlIGFueXRoaW5nIGVsc2UgdG91Y2hlcyB0aGUgZGF0YS5cbiAqICAgLSBgYnJvd3Nlci5hbGFybXNgIOKAlCBNVjMncyByZXBsYWNlbWVudCBmb3IgYHNldEludGVydmFsYCBpbiBhIHNlcnZpY2VcbiAqICAgICB3b3JrZXI7IGEgcGxhaW4gYHNldEludGVydmFsYCBnZXRzIHRocm93biBhd2F5IHRoZSBtb21lbnQgdGhlIHdvcmtlclxuICogICAgIGlzIGtpbGxlZCwgYGFsYXJtc2Agc3Vydml2ZXMgcmVzdGFydHMgYmVjYXVzZSB0aGUgYnJvd3NlciBpdHNlbGZcbiAqICAgICBzY2hlZHVsZXMgdGhlbS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdbd2ViZXh0LXN0b3JlLWRlbW9dIGJhY2tncm91bmQgc3RhcnRlZCcpO1xuXG4gIC8vIFJ1bnMgb25jZSBwZXIgaW5zdGFsbCBhbmQgb25jZSBwZXIgdXBkYXRlIOKAlCBub3Qgb24gZXZlcnkgd29ya2VyXG4gIC8vIHJlc3RhcnQuIEdvb2QgcGxhY2UgdG8gZm9yY2UgbWlncmF0aW9ucy9pbml0IGFoZWFkIG9mIGFueXRoaW5nIGVsc2UsXG4gIC8vIGFuZCB0byB0ZWxsIGZyZXNoIGluc3RhbGxzIGFwYXJ0IGZyb20gdXBkYXRlcy5cbiAgYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCh7IHJlYXNvbiB9KSA9PiB7XG4gICAgaWYgKHJlYXNvbiA9PT0gJ2luc3RhbGwnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW3dlYmV4dC1zdG9yZS1kZW1vXSBmaXJzdCBpbnN0YWxsJyk7XG4gICAgfSBlbHNlIGlmIChyZWFzb24gPT09ICd1cGRhdGUnKSB7XG4gICAgICBjb25zb2xlLmxvZygnW3dlYmV4dC1zdG9yZS1kZW1vXSB1cGRhdGVkIOKAlCBydW5uaW5nIHBlbmRpbmcgbWlncmF0aW9ucycpO1xuICAgIH1cbiAgICBzZXR0aW5nc0l0ZW0ubWlncmF0ZSgpO1xuICB9KTtcblxuICAvLyBgZGVmaW5lSXRlbSgpYCBhbHNvIHJ1bnMgcGVuZGluZyBtaWdyYXRpb25zIGxhemlseSB0aGUgZmlyc3QgdGltZSBpdCdzXG4gIC8vIHRvdWNoZWQsIHNvIHRoaXMgaXNuJ3Qgc3RyaWN0bHkgcmVxdWlyZWQg4oCUIGJ1dCBjYWxsaW5nIGl0IGV4cGxpY2l0bHkgb25cbiAgLy8gZXZlcnkgd29ya2VyIHN0YXJ0IChub3QganVzdCBvbiBpbnN0YWxsL3VwZGF0ZSkgbWVhbnMgaXQncyBndWFyYW50ZWVkXG4gIC8vIHRvIGhhdmUgaGFwcGVuZWQgYmVmb3JlIGFueXRoaW5nIGJlbG93IHJlYWRzIGBzZXR0aW5nc0l0ZW1gLlxuICBzZXR0aW5nc0l0ZW0ubWlncmF0ZSgpO1xuXG4gIC8vIGBpbml0YCBpdGVtcyByZXNvbHZlIHRoZW1zZWx2ZXMgb24gZmlyc3QgYWNjZXNzIHRvbyDigJQgdGhpcyBqdXN0IGZvcmNlc1xuICAvLyB0aGF0IHRvIGhhcHBlbiBpbW1lZGlhdGVseSwgc28gdGhlIGluc3RhbGwgSUQgZXhpc3RzIHJpZ2h0IGF3YXkgcmF0aGVyXG4gIC8vIHRoYW4gd2FpdGluZyBmb3IgdGhlIGZpcnN0IGBnZXRWYWx1ZSgpYCBjYWxsIGZyb20gZWxzZXdoZXJlLlxuICBpbnN0YWxsSWRJdGVtLmdldFZhbHVlKCkudGhlbigoaWQpID0+IHtcbiAgICBjb25zb2xlLmxvZygnW3dlYmV4dC1zdG9yZS1kZW1vXSBpbnN0YWxsIGlkOicsIGlkKTtcbiAgfSk7XG5cbiAgLy8gUHJvdmUgYHN0b3JhZ2Uud2F0Y2hgIHdvcmtzIGZyb20gdGhlIGJhY2tncm91bmQgdG9vLCBub3QganVzdCBmcm9tXG4gIC8vIFJlYWN0IOKAlCB0aGlzIGxvZ3MgZXZlcnkgY2hhbmdlIG1hZGUgZnJvbSBBTlkgY29udGV4dCAocG9wdXAgaW5jbHVkZWQpLlxuICAvLyBNdXN0IGJlIHJlLXJlZ2lzdGVyZWQgaGVyZSwgaW4gdGhlIGZ1bmN0aW9uIGJvZHksIGV2ZXJ5IHRpbWUgdGhlXG4gIC8vIHdvcmtlciByZXN0YXJ0cyDigJQgYSB3YXRjaGVyIHNldCB1cCBvbmNlIGFuZCBcInJlbWVtYmVyZWRcIiBkb2Vzbid0XG4gIC8vIHN1cnZpdmUgdGhlIHdvcmtlciBiZWluZyBraWxsZWQuXG4gIGNvbnN0IHVud2F0Y2hIZWFydGJlYXQgPSBoZWFydGJlYXRJdGVtLndhdGNoKChuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhgW3dlYmV4dC1zdG9yZS1kZW1vXSBoZWFydGJlYXQ6ICR7b2xkVmFsdWV9IC0+ICR7bmV3VmFsdWV9YCk7XG4gIH0pO1xuXG4gIC8vIFBlcmlvZGljIHdyaXRlLCBlbnRpcmVseSBpbmRlcGVuZGVudCBvZiB0aGUgcG9wdXAgYmVpbmcgb3Blbi4gSWYgeW91XG4gIC8vIGhhdmUgdGhlIHBvcHVwIG9wZW4gd2l0aCB0aGUgXCJDcm9zcy1jb250ZXh0XCIgdGFiIGFjdGl2ZSwgeW91J2xsIHNlZVxuICAvLyB0aGlzIHRpY2sgdXAgb24gaXRzIG93biBldmVyeSBmZXcgc2Vjb25kcy4gYGFsYXJtcy5jcmVhdGVgIGlzXG4gIC8vIGlkZW1wb3RlbnQgYnkgbmFtZSwgc28gcmUtY2FsbGluZyBpdCBvbiBldmVyeSB3b3JrZXIgcmVzdGFydCBpcyBmaW5lIOKAlFxuICAvLyBpdCB3b24ndCBjcmVhdGUgZHVwbGljYXRlIGFsYXJtcy5cbiAgYnJvd3Nlci5hbGFybXMuY3JlYXRlKCdoZWFydGJlYXQnLCB7IHBlcmlvZEluTWludXRlczogMC4wNSB9KTsgLy8gfjNzXG4gIGJyb3dzZXIuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoYXN5bmMgKGFsYXJtKSA9PiB7XG4gICAgaWYgKGFsYXJtLm5hbWUgIT09ICdoZWFydGJlYXQnKSByZXR1cm47XG4gICAgY29uc3QgY3VycmVudCA9IGF3YWl0IGhlYXJ0YmVhdEl0ZW0uZ2V0VmFsdWUoKTtcbiAgICBhd2FpdCBoZWFydGJlYXRJdGVtLnNldFZhbHVlKGN1cnJlbnQgKyAxKTtcbiAgfSk7XG5cbiAgLy8gT24tZGVtYW5kIGJ1bXAsIHRyaWdnZXJlZCBieSBhIGJ1dHRvbiBpbiB0aGUgcG9wdXAg4oCUIGRlbW9uc3RyYXRlcyBhXG4gIC8vIHdyaXRlIGZyb20gdGhlIGJhY2tncm91bmQgYmVpbmcgcmVmbGVjdGVkIGxpdmUgaW4gdGhlIHBvcHVwJ3MgVUkgdmlhXG4gIC8vIGB1c2VTdG9yYWdlYCdzIGJ1aWx0LWluIHdhdGNoLCB3aXRoIG5vIG1hbnVhbCBtZXNzYWdlLXBhc3NpbmcgbmVlZGVkIG9uXG4gIC8vIHRoZSBwb3B1cCBzaWRlIHRvIHBpY2sgaXQgdXAuXG4gIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UpID0+IHtcbiAgICBpZiAobWVzc2FnZT8udHlwZSA9PT0gJ2J1bXAtaGVhcnRiZWF0Jykge1xuICAgICAgcmV0dXJuIGhlYXJ0YmVhdEl0ZW0uZ2V0VmFsdWUoKS50aGVuKChjdXJyZW50KSA9PiBoZWFydGJlYXRJdGVtLnNldFZhbHVlKGN1cnJlbnQgKyAxKSk7XG4gICAgfVxuICB9KTtcblxuICAvLyBDbGVhbnVwIGlzIG1vc3RseSBtb290IGZvciBhIHNlcnZpY2Ugd29ya2VyIChpdCdzIHRvcm4gZG93biBieSB0aGVcbiAgLy8gYnJvd3Nlciwgbm90IHVubW91bnRlZCksIGJ1dCBzaG93biBoZXJlIGZvciBjb21wbGV0ZW5lc3MgLyBzeW1tZXRyeVxuICAvLyB3aXRoIGhvdyB5b3UnZCBjbGVhbiB1cCBhIHdhdGNoZXIgYW55d2hlcmUgZWxzZS5cbiAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCdiZWZvcmV1bmxvYWQnIGFzIGFueSwgKCkgPT4ge1xuICAgIHVud2F0Y2hIZWFydGJlYXQoKTtcbiAgICBzdG9yYWdlLnVud2F0Y2goKTtcbiAgfSk7XG59KTtcbiIsIi8vI3JlZ2lvbiBzcmMvaW5kZXgudHNcbi8qKlxuKiBDbGFzcyBmb3IgcGFyc2luZyBhbmQgcGVyZm9ybWluZyBvcGVyYXRpb25zIG9uIG1hdGNoIHBhdHRlcm5zLlxuKlxuKiBAZXhhbXBsZVxuKiAgIGNvbnN0IHBhdHRlcm4gPSBuZXcgTWF0Y2hQYXR0ZXJuKCcqOi8vZ29vZ2xlLmNvbS8qJyk7XG4qXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cHM6Ly9nb29nbGUuY29tJyk7IC8vIHRydWVcbiogICBwYXR0ZXJuLmluY2x1ZGVzKCdodHRwOi8veW91dHViZS5jb20vd2F0Y2g/dj0xMjMnKTsgLy8gZmFsc2VcbiovXG52YXIgTWF0Y2hQYXR0ZXJuID0gY2xhc3MgTWF0Y2hQYXR0ZXJuIHtcblx0c3RhdGljIHtcblx0XHR0aGlzLlBST1RPQ09MUyA9IFtcblx0XHRcdFwiaHR0cFwiLFxuXHRcdFx0XCJodHRwc1wiLFxuXHRcdFx0XCJmaWxlXCIsXG5cdFx0XHRcImZ0cFwiLFxuXHRcdFx0XCJ1cm5cIixcblx0XHRcdFwid3NcIixcblx0XHRcdFwid3NzXCJcblx0XHRdO1xuXHR9XG5cdC8qKlxuXHQqIFBhcnNlIGEgbWF0Y2ggcGF0dGVybiBzdHJpbmcuIElmIGl0IGlzIGludmFsaWQsIHRoZSBjb25zdHJ1Y3RvciB3aWxsIHRocm93IGFuXG5cdCogYEludmFsaWRNYXRjaFBhdHRlcm5gIGVycm9yLlxuXHQqXG5cdCogQHBhcmFtIG1hdGNoUGF0dGVybiBUaGUgbWF0Y2ggcGF0dGVybiB0byBwYXJzZS5cblx0Ki9cblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuKSB7XG5cdFx0aWYgKG1hdGNoUGF0dGVybiA9PT0gXCI8YWxsX3VybHM+XCIpIHtcblx0XHRcdHRoaXMuaXNBbGxVcmxzID0gdHJ1ZTtcblx0XHRcdHRoaXMucHJvdG9jb2xNYXRjaGVzID0gWy4uLk1hdGNoUGF0dGVybi5QUk9UT0NPTFNdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBcIipcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y29uc3QgZ3JvdXBzID0gLyguKik6XFwvXFwvKC4qPykoXFwvLiopLy5leGVjKG1hdGNoUGF0dGVybik7XG5cdFx0XHRpZiAoZ3JvdXBzID09IG51bGwpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgXCJJbmNvcnJlY3QgZm9ybWF0XCIpO1xuXHRcdFx0Y29uc3QgW18sIHByb3RvY29sLCBob3N0bmFtZSwgcGF0aG5hbWVdID0gZ3JvdXBzO1xuXHRcdFx0dmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKTtcblx0XHRcdHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSk7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IHByb3RvY29sID09PSBcIipcIiA/IFtcImh0dHBcIiwgXCJodHRwc1wiXSA6IFtwcm90b2NvbF07XG5cdFx0XHR0aGlzLmhvc3RuYW1lTWF0Y2ggPSBob3N0bmFtZTtcblx0XHRcdHRoaXMucGF0aG5hbWVNYXRjaCA9IHBhdGhuYW1lO1xuXHRcdH1cblx0fVxuXHQvKiogQ2hlY2sgaWYgYSBVUkwgaXMgaW5jbHVkZWQgaW4gYSBwYXR0ZXJuLiAqL1xuXHRpbmNsdWRlcyh1cmwpIHtcblx0XHRjb25zdCB1ID0gdHlwZW9mIHVybCA9PT0gXCJzdHJpbmdcIiA/IG5ldyBVUkwodXJsKSA6IHVybCBpbnN0YW5jZW9mIExvY2F0aW9uID8gbmV3IFVSTCh1cmwuaHJlZikgOiB1cmw7XG5cdFx0aWYgKHRoaXMuaXNBbGxVcmxzKSByZXR1cm4gIXRoaXMuaXNVbmtub3duUHJvdG9jb2wodSk7XG5cdFx0cmV0dXJuICEhdGhpcy5wcm90b2NvbE1hdGNoZXMuZmluZCgocHJvdG9jb2wpID0+IHtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwXCIpIHJldHVybiB0aGlzLmlzSHR0cE1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImh0dHBzXCIpIHJldHVybiB0aGlzLmlzSHR0cHNNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmaWxlXCIpIHJldHVybiB0aGlzLmlzRmlsZU1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImZ0cFwiKSByZXR1cm4gdGhpcy5pc0Z0cE1hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcInVyblwiKSByZXR1cm4gdGhpcy5pc1Vybk1hdGNoKHUpO1xuXHRcdH0pO1xuXHR9XG5cdGlzSHR0cE1hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cDpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSHR0cHNNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHBzOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNIb3N0UGF0aE1hdGNoKHVybCkge1xuXHRcdGlmICghdGhpcy5ob3N0bmFtZU1hdGNoIHx8ICF0aGlzLnBhdGhuYW1lTWF0Y2gpIHJldHVybiBmYWxzZTtcblx0XHRjb25zdCBob3N0bmFtZU1hdGNoUmVnZXhzID0gW3RoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaCksIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMuaG9zdG5hbWVNYXRjaC5yZXBsYWNlKC9eXFwqXFwuLywgXCJcIikpXTtcblx0XHRjb25zdCBwYXRobmFtZU1hdGNoUmVnZXggPSB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpO1xuXHRcdHJldHVybiAhIWhvc3RuYW1lTWF0Y2hSZWdleHMuZmluZCgocmVnZXgpID0+IHJlZ2V4LnRlc3QodXJsLmhvc3RuYW1lKSkgJiYgcGF0aG5hbWVNYXRjaFJlZ2V4LnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc1Vua25vd25Qcm90b2NvbCh1cmwpIHtcblx0XHRyZXR1cm4gIXRoaXMucHJvdG9jb2xNYXRjaGVzLmluY2x1ZGVzKHVybC5wcm90b2NvbC5zbGljZSgwLCAtMSkpO1xuXHR9XG5cdGlzUGF0aE1hdGNoKHVybCkge1xuXHRcdGlmICghdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCkudGVzdCh1cmwucGF0aG5hbWUpO1xuXHR9XG5cdGlzRmlsZU1hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiZmlsZTpcIiAmJiB0aGlzLmlzUGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNGdHBNYXRjaChfdXJsKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IGZ0cDovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG5cdH1cblx0aXNVcm5NYXRjaChfdXJsKSB7XG5cdFx0dGhyb3cgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQ6IHVybjovLyBwYXR0ZXJuIG1hdGNoaW5nLiBPcGVuIGEgUFIgdG8gYWRkIHN1cHBvcnRcIik7XG5cdH1cblx0Y29udmVydFBhdHRlcm5Ub1JlZ2V4KHBhdHRlcm4pIHtcblx0XHRjb25zdCBzdGFyc1JlcGxhY2VkID0gdGhpcy5lc2NhcGVGb3JSZWdleChwYXR0ZXJuKS5yZXBsYWNlKC9cXFxcXFwqL2csIFwiLipcIik7XG5cdFx0cmV0dXJuIFJlZ0V4cChgXiR7c3RhcnNSZXBsYWNlZH0kYCk7XG5cdH1cblx0ZXNjYXBlRm9yUmVnZXgoc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG5cdH1cbn07XG52YXIgSW52YWxpZE1hdGNoUGF0dGVybiA9IGNsYXNzIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4sIHJlYXNvbikge1xuXHRcdHN1cGVyKGBJbnZhbGlkIG1hdGNoIHBhdHRlcm4gXCIke21hdGNoUGF0dGVybn1cIjogJHtyZWFzb259YCk7XG5cdH1cbn07XG5mdW5jdGlvbiB2YWxpZGF0ZVByb3RvY29sKG1hdGNoUGF0dGVybiwgcHJvdG9jb2wpIHtcblx0aWYgKCFNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmluY2x1ZGVzKHByb3RvY29sKSAmJiBwcm90b2NvbCAhPT0gXCIqXCIpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYCR7cHJvdG9jb2x9IG5vdCBhIHZhbGlkIHByb3RvY29sICgke01hdGNoUGF0dGVybi5QUk9UT0NPTFMuam9pbihcIiwgXCIpfSlgKTtcbn1cbmZ1bmN0aW9uIHZhbGlkYXRlSG9zdG5hbWUobWF0Y2hQYXR0ZXJuLCBob3N0bmFtZSkge1xuXHRpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBIb3N0bmFtZSBjYW5ub3QgaW5jbHVkZSBhIHBvcnRgKTtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiKlwiKSAmJiBob3N0bmFtZS5sZW5ndGggPiAxICYmICFob3N0bmFtZS5zdGFydHNXaXRoKFwiKi5cIikpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYElmIHVzaW5nIGEgd2lsZGNhcmQgKCopLCBpdCBtdXN0IGdvIGF0IHRoZSBzdGFydCBvZiB0aGUgaG9zdG5hbWVgKTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgSW52YWxpZE1hdGNoUGF0dGVybiwgTWF0Y2hQYXR0ZXJuIH07XG4iXSwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDMsNCw1LDldLCJtYXBwaW5ncyI6Ijs7Ozs7Q0FDQSxTQUFTLGlCQUFpQixLQUFLO0VBQzlCLElBQUksT0FBTyxRQUFRLE9BQU8sUUFBUSxZQUFZLE9BQU8sRUFBRSxNQUFNLElB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