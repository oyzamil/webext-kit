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
	var browser = globals.browser ?? globals.chrome ?? {};
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
				const storage = browser.storage;
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
			if (browser.runtime == null) throw Error(`'webext-store' must be loaded in a web extension environment.`);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJicm93c2VyIiwiYnJvd3NlciQxIiwid2l0aExvY2siXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40KzAwN2RmYmM0MmY1YTQyNzYvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9zdXBlcmxvY2tAMS4zLjUvbm9kZV9tb2R1bGVzL3N1cGVybG9jay9zcmMvY3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vc3VwZXJsb2NrQDEuMy41L25vZGVfbW9kdWxlcy9zdXBlcmxvY2svc3JjL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LXN0b3JlL2Rpc3Qvc3JjLUN4V0Y5a2otLm1qcyIsIi4uLy4uL3NyYy91dGlscy9zdG9yYWdlLWl0ZW1zLnRzIiwiLi4vLi4vc3JjL2VudHJ5cG9pbnRzL2JhY2tncm91bmQudHMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9Ad2ViZXh0LWNvcmUrbWF0Y2gtcGF0dGVybnNAMi4wLjAvbm9kZV9tb2R1bGVzL0B3ZWJleHQtY29yZS9tYXRjaC1wYXR0ZXJucy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLnRzXG5mdW5jdGlvbiBkZWZpbmVCYWNrZ3JvdW5kKGFyZykge1xuXHRpZiAoYXJnID09IG51bGwgfHwgdHlwZW9mIGFyZyA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4geyBtYWluOiBhcmcgfTtcblx0cmV0dXJuIGFyZztcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgZGVmaW5lQmFja2dyb3VuZCB9O1xuIiwiLy8gI3JlZ2lvbiBzbmlwcGV0XG5leHBvcnQgY29uc3QgYnJvd3NlciA9IGdsb2JhbFRoaXMuYnJvd3Nlcj8ucnVudGltZT8uaWRcbiAgPyBnbG9iYWxUaGlzLmJyb3dzZXJcbiAgOiBnbG9iYWxUaGlzLmNocm9tZTtcbi8vICNlbmRyZWdpb24gc25pcHBldFxuIiwiaW1wb3J0IHsgYnJvd3NlciBhcyBicm93c2VyJDEgfSBmcm9tIFwiQHd4dC1kZXYvYnJvd3NlclwiO1xuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG4vKipcbiogQ29udGFpbnMgdGhlIGBicm93c2VyYCBleHBvcnQgd2hpY2ggeW91IHNob3VsZCB1c2UgdG8gYWNjZXNzIHRoZSBleHRlbnNpb25cbiogQVBJcyBpbiB5b3VyIHByb2plY3Q6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IGJyb3dzZXIgfSBmcm9tICd3eHQvYnJvd3Nlcic7XG4qXG4qIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4qICAgLy8gLi4uXG4qIH0pO1xuKiBgYGBcbipcbiogQG1vZHVsZSB3eHQvYnJvd3NlclxuKi9cbmNvbnN0IGJyb3dzZXIgPSBicm93c2VyJDE7XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGJyb3dzZXIgfTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhXG4gIH1cbn1cblxuY2xhc3MgTGlua2VkTGlzdCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgfVxuXG4gIGVucXVldWUgKGRhdGEpIHtcbiAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoZGF0YSlcbiAgICBub2RlLnByZXYgPSB0aGlzLnRhaWxcbiAgICBpZiAodGhpcy50YWlsKSB0aGlzLnRhaWwubmV4dCA9IG5vZGVcbiAgICBlbHNlIHRoaXMuaGVhZCA9IG5vZGVcbiAgICB0aGlzLnRhaWwgPSBub2RlXG4gICAgdGhpcy5sZW5ndGgrK1xuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBkZXF1ZXVlICgpIHtcbiAgICBpZiAoIXRoaXMuaGVhZCkgcmV0dXJuXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLmhlYWRcbiAgICB0aGlzLnJlbW92ZSh0aGlzLmhlYWQpXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIHJlbW92ZSAobm9kZSkge1xuICAgIGlmIChub2RlLnByZXYpIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0XG4gICAgZWxzZSB0aGlzLmhlYWQgPSBub2RlLm5leHRcbiAgICBpZiAobm9kZS5uZXh0KSBub2RlLm5leHQucHJldiA9IG5vZGUucHJldlxuICAgIGVsc2UgdGhpcy50YWlsID0gbm9kZS5wcmV2XG4gICAgdGhpcy5sZW5ndGgtLVxuICB9XG5cbiAgc2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoc2xvdHMgPSAxKSA9PiB7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IExpbmtlZExpc3QoKVxuXG4gIGNvbnN0IHJlbGVhc2UgPSAoKSA9PiB7XG4gICAgKytzbG90c1xuICAgIGNvbnN0IHdhaXRlciA9IHF1ZXVlLmRlcXVldWUoKVxuICAgIGlmICh3YWl0ZXIpIHJldHVybiB3YWl0ZXIuYWNxdWlyZSgpXG4gIH1cblxuICBjb25zdCBhY3F1aXJlID0gcmVzb2x2ZSA9PiB7XG4gICAgLS1zbG90c1xuICAgIHJlc29sdmUocmVsZWFzZSlcbiAgfVxuXG4gIGNvbnN0IGxvY2sgPSBzaWduYWwgPT5cbiAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChzaWduYWwgIT0gbnVsbCAmJiB0eXBlb2Ygc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHNpZ25hbGAgbmVlZHMgdG8gYmUgYW4gQWJvcnRTaWduYWwuJylcbiAgICAgIH1cbiAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHJldHVybiByZXNvbHZlKG51bGwpXG4gICAgICBpZiAoIWxvY2suaXNMb2NrZWQoKSkgcmV0dXJuIGFjcXVpcmUocmVzb2x2ZSlcblxuICAgICAgY29uc3Qgd2FpdGVyID0geyBhY3F1aXJlOiAoKSA9PiBhY3F1aXJlKHJlc29sdmUpIH1cbiAgICAgIGNvbnN0IG5vZGUgPSBxdWV1ZS5lbnF1ZXVlKHdhaXRlcilcblxuICAgICAgaWYgKHNpZ25hbCAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7XG4gICAgICAgICAgcXVldWUucmVtb3ZlKG5vZGUpXG4gICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICB9XG4gICAgICAgIHdhaXRlci5hY3F1aXJlID0gKCkgPT4ge1xuICAgICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpXG4gICAgICAgICAgYWNxdWlyZShyZXNvbHZlKVxuICAgICAgICB9XG4gICAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgbG9jay5pc0xvY2tlZCA9ICgpID0+IHNsb3RzID09PSAwXG5cbiAgbG9jay5hd2FpdGluZyA9ICgpID0+IHF1ZXVlLnNpemUoKVxuXG4gIHJldHVybiBsb2NrXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgY3JlYXRlTG9jayA9IHJlcXVpcmUoJy4vY3JlYXRlJylcblxuY29uc3Qgd2l0aExvY2sgPSBvcHRzID0+IHtcbiAgY29uc3QgbG9jayA9IGNyZWF0ZUxvY2sob3B0cylcblxuICBjb25zdCB3aXRoTG9jayA9IGFzeW5jIChmbiwgc2lnbmFsKSA9PiB7XG4gICAgY29uc3QgcmVsZWFzZSA9IGF3YWl0IGxvY2soc2lnbmFsKVxuICAgIGlmICghcmVsZWFzZSkgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBmbigpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlbGVhc2UoKVxuICAgIH1cbiAgfVxuXG4gIHdpdGhMb2NrLmlzTG9ja2VkID0gbG9jay5pc0xvY2tlZFxuICB3aXRoTG9jay5hd2FpdGluZyA9IGxvY2suYXdhaXRpbmdcblxuICByZXR1cm4gd2l0aExvY2tcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHdpdGhMb2NrLCBjcmVhdGVMb2NrIH1cbiIsImltcG9ydCB7IHdpdGhMb2NrIH0gZnJvbSBcInN1cGVybG9ja1wiO1xuLy8jcmVnaW9uIC4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL2RlcXVhbEAyLjAuMy9ub2RlX21vZHVsZXMvZGVxdWFsL2xpdGUvaW5kZXgubWpzXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGRlcXVhbChmb28sIGJhcikge1xuXHR2YXIgY3RvciwgbGVuO1xuXHRpZiAoZm9vID09PSBiYXIpIHJldHVybiB0cnVlO1xuXHRpZiAoZm9vICYmIGJhciAmJiAoY3RvciA9IGZvby5jb25zdHJ1Y3RvcikgPT09IGJhci5jb25zdHJ1Y3Rvcikge1xuXHRcdGlmIChjdG9yID09PSBEYXRlKSByZXR1cm4gZm9vLmdldFRpbWUoKSA9PT0gYmFyLmdldFRpbWUoKTtcblx0XHRpZiAoY3RvciA9PT0gUmVnRXhwKSByZXR1cm4gZm9vLnRvU3RyaW5nKCkgPT09IGJhci50b1N0cmluZygpO1xuXHRcdGlmIChjdG9yID09PSBBcnJheSkge1xuXHRcdFx0aWYgKChsZW4gPSBmb28ubGVuZ3RoKSA9PT0gYmFyLmxlbmd0aCkgd2hpbGUgKGxlbi0tICYmIGRlcXVhbChmb29bbGVuXSwgYmFyW2xlbl0pKTtcblx0XHRcdHJldHVybiBsZW4gPT09IC0xO1xuXHRcdH1cblx0XHRpZiAoIWN0b3IgfHwgdHlwZW9mIGZvbyA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0bGVuID0gMDtcblx0XHRcdGZvciAoY3RvciBpbiBmb28pIHtcblx0XHRcdFx0aWYgKGhhcy5jYWxsKGZvbywgY3RvcikgJiYgKytsZW4gJiYgIWhhcy5jYWxsKGJhciwgY3RvcikpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWYgKCEoY3RvciBpbiBiYXIpIHx8ICFkZXF1YWwoZm9vW2N0b3JdLCBiYXJbY3Rvcl0pKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMoYmFyKS5sZW5ndGggPT09IGxlbjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZvbyAhPT0gZm9vICYmIGJhciAhPT0gYmFyO1xufVxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3R5cGVzLnRzXG4vKiogTWlncmF0aW9uIGVycm9yIGZvciB2ZXJzaW9uIG1pZ3JhdGlvbnMgKi9cbnZhciBNaWdyYXRpb25FcnJvciA9IGNsYXNzIGV4dGVuZHMgRXJyb3Ige1xuXHRrZXk7XG5cdHZlcnNpb247XG5cdGNvbnN0cnVjdG9yKGtleSwgdmVyc2lvbiwgb3B0aW9ucykge1xuXHRcdHN1cGVyKGB2JHt2ZXJzaW9ufSBtaWdyYXRpb24gZmFpbGVkIGZvciBcIiR7a2V5fVwiYCwgb3B0aW9ucyk7XG5cdFx0dGhpcy5rZXkgPSBrZXk7XG5cdFx0dGhpcy52ZXJzaW9uID0gdmVyc2lvbjtcblx0fVxufTtcbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9icm93c2VyLnRzXG5jb25zdCBnbG9iYWxzID0gZ2xvYmFsVGhpcztcbmNvbnN0IGJyb3dzZXIgPSBnbG9iYWxzLmJyb3dzZXIgPz8gZ2xvYmFscy5jaHJvbWUgPz8ge307XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvaW5kZXgudHNcbi8qKlxuKiBTaW1wbGlmaWVkLCB0eXBlLXNhZmUgc3RvcmFnZSBBUElzIGZvciBicm93c2VyIGV4dGVuc2lvbnMsIHdpdGggc3VwcG9ydCBmb3JcbiogdmVyc2lvbmVkIGZpZWxkcywgc25hcHNob3RzLCBtZXRhZGF0YSwgYW5kIGl0ZW0gZGVmaW5pdGlvbnMuXG4qXG4qIEBtb2R1bGUgd2ViZXh0LXN0b3JlXG4qL1xuY29uc3Qgc3RvcmFnZSA9IGNyZWF0ZVN0b3JhZ2UoKTtcbmZ1bmN0aW9uIGNyZWF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IGRyaXZlcnMgPSB7XG5cdFx0bG9jYWw6IGNyZWF0ZURyaXZlcihcImxvY2FsXCIpLFxuXHRcdHNlc3Npb246IGNyZWF0ZURyaXZlcihcInNlc3Npb25cIiksXG5cdFx0c3luYzogY3JlYXRlRHJpdmVyKFwic3luY1wiKSxcblx0XHRtYW5hZ2VkOiBjcmVhdGVEcml2ZXIoXCJtYW5hZ2VkXCIpXG5cdH07XG5cdGNvbnN0IGdldERyaXZlciA9IChhcmVhKSA9PiB7XG5cdFx0Y29uc3QgZHJpdmVyID0gZHJpdmVyc1thcmVhXTtcblx0XHRpZiAoZHJpdmVyID09IG51bGwpIHtcblx0XHRcdGNvbnN0IGFyZWFOYW1lcyA9IE9iamVjdC5rZXlzKGRyaXZlcnMpLmpvaW4oXCIsIFwiKTtcblx0XHRcdHRocm93IEVycm9yKGBJbnZhbGlkIGFyZWEgXCIke2FyZWF9XCIuIE9wdGlvbnM6ICR7YXJlYU5hbWVzfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZHJpdmVyO1xuXHR9O1xuXHRjb25zdCByZXNvbHZlS2V5ID0gKGtleSkgPT4ge1xuXHRcdGNvbnN0IGRlbGltaW5hdG9ySW5kZXggPSBrZXkuaW5kZXhPZihcIjpcIik7XG5cdFx0Y29uc3QgZHJpdmVyQXJlYSA9IGtleS5zdWJzdHJpbmcoMCwgZGVsaW1pbmF0b3JJbmRleCk7XG5cdFx0Y29uc3QgZHJpdmVyS2V5ID0ga2V5LnN1YnN0cmluZyhkZWxpbWluYXRvckluZGV4ICsgMSk7XG5cdFx0aWYgKGRyaXZlcktleSA9PSBudWxsKSB0aHJvdyBFcnJvcihgU3RvcmFnZSBrZXkgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIFwiYXJlYTprZXlcIiwgYnV0IHJlY2VpdmVkIFwiJHtrZXl9XCJgKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZHJpdmVyQXJlYSxcblx0XHRcdGRyaXZlcktleSxcblx0XHRcdGRyaXZlcjogZ2V0RHJpdmVyKGRyaXZlckFyZWEpXG5cdFx0fTtcblx0fTtcblx0Y29uc3QgZ2V0TWV0YUtleSA9IChrZXkpID0+IGAke2tleX0kYDtcblx0Y29uc3QgbWVyZ2VNZXRhID0gKG9sZE1ldGEsIG5ld01ldGEpID0+IHtcblx0XHRjb25zdCBuZXdGaWVsZHMgPSB7IC4uLm9sZE1ldGEgfTtcblx0XHRPYmplY3QuZW50cmllcyhuZXdNZXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSBkZWxldGUgbmV3RmllbGRzW2tleV07XG5cdFx0XHRlbHNlIG5ld0ZpZWxkc1trZXldID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0ZpZWxkcztcblx0fTtcblx0Y29uc3QgZ2V0VmFsdWVPckZhbGxiYWNrID0gKHZhbHVlLCBmYWxsYmFjaykgPT4gdmFsdWUgPz8gZmFsbGJhY2sgPz8gbnVsbDtcblx0Y29uc3QgZ2V0TWV0YVZhbHVlID0gKHByb3BlcnRpZXMpID0+IHR5cGVvZiBwcm9wZXJ0aWVzID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb3BlcnRpZXMpID8gcHJvcGVydGllcyA6IHt9O1xuXHRjb25zdCBnZXRJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG5cdFx0Y29uc3QgcmVzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0oZHJpdmVyS2V5KTtcblx0XHRyZXR1cm4gZ2V0VmFsdWVPckZhbGxiYWNrKHJlcywgb3B0cz8uZmFsbGJhY2spO1xuXHR9O1xuXHRjb25zdCBnZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5KSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KTtcblx0XHRyZXR1cm4gZ2V0TWV0YVZhbHVlKHJlcyk7XG5cdH07XG5cdGNvbnN0IHNldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKSA9PiB7XG5cdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCB2YWx1ZSA/PyBudWxsKTtcblx0fTtcblx0Y29uc3Qgc2V0TWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0Y29uc3QgZXhpc3RpbmdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuXHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKG1ldGFLZXksIG1lcmdlTWV0YShleGlzdGluZ0ZpZWxkcywgcHJvcGVydGllcykpO1xuXHR9O1xuXHRjb25zdCByZW1vdmVJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG5cdFx0YXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0oZHJpdmVyS2V5KTtcblx0XHRpZiAob3B0cz8ucmVtb3ZlTWV0YSkge1xuXHRcdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRcdGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKG1ldGFLZXkpO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgcmVtb3ZlTWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0aWYgKHByb3BlcnRpZXMgPT0gbnVsbCkgYXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0obWV0YUtleSk7XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBuZXdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuXHRcdFx0W3Byb3BlcnRpZXNdLmZsYXQoKS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRkZWxldGUgbmV3RmllbGRzW2ZpZWxkXTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbmV3RmllbGRzKTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IHdhdGNoID0gKGRyaXZlciwgZHJpdmVyS2V5LCBjYikgPT4gZHJpdmVyLndhdGNoKGRyaXZlcktleSwgY2IpO1xuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGFzeW5jIChrZXksIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiBhd2FpdCBnZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcblx0XHR9LFxuXHRcdGdldEl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGNvbnN0IGtleVRvT3B0c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRjb25zdCBvcmRlcmVkS2V5cyA9IFtdO1xuXHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0bGV0IGtleVN0cjtcblx0XHRcdFx0bGV0IG9wdHM7XG5cdFx0XHRcdGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSBrZXlTdHIgPSBrZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiZ2V0VmFsdWVcIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRcdG9wdHMgPSB7IGZhbGxiYWNrOiBrZXkuZmFsbGJhY2sgfTtcblx0XHRcdFx0fSBlbHNlIGlmIChcIml0ZW1cIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkuaXRlbS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IHsgZmFsbGJhY2s6IGtleS5pdGVtLmZhbGxiYWNrIH07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3JkZXJlZEtleXMucHVzaChrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCBhcmVhS2V5cyA9IGFyZWFUb0tleU1hcC5nZXQoZHJpdmVyQXJlYSkgPz8gW107XG5cdFx0XHRcdGFyZWFUb0tleU1hcC5zZXQoZHJpdmVyQXJlYSwgYXJlYUtleXMuY29uY2F0KGRyaXZlcktleSkpO1xuXHRcdFx0XHRrZXlUb09wdHNNYXAuc2V0KGtleVN0ciwgb3B0cyk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJlc3VsdHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShhcmVhVG9LZXlNYXAuZW50cmllcygpKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHQoYXdhaXQgZHJpdmVyc1tkcml2ZXJBcmVhXS5nZXRJdGVtcyhrZXlzKSkuZm9yRWFjaCgoZHJpdmVyUmVzdWx0KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qga2V5ID0gYCR7ZHJpdmVyQXJlYX06JHtkcml2ZXJSZXN1bHQua2V5fWA7XG5cdFx0XHRcdFx0Y29uc3Qgb3B0cyA9IGtleVRvT3B0c01hcC5nZXQoa2V5KTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGdldFZhbHVlT3JGYWxsYmFjayhkcml2ZXJSZXN1bHQudmFsdWUsIG9wdHM/LmZhbGxiYWNrID8/IG9wdHM/LmZhbGxiYWNrKTtcblx0XHRcdFx0XHRyZXN1bHRzTWFwLnNldChrZXksIHZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRyZXR1cm4gb3JkZXJlZEtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHJlc3VsdHNNYXAuZ2V0KGtleSlcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdGdldE1ldGE6IGFzeW5jIChrZXkpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiBhd2FpdCBnZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5KTtcblx0XHR9LFxuXHRcdGdldE1ldGFzOiBhc3luYyAoYXJncykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5cyA9IGFyZ3MubWFwKChhcmcpID0+IHtcblx0XHRcdFx0Y29uc3Qga2V5ID0gdHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIiA/IGFyZyA6IGFyZy5rZXk7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdGRyaXZlckFyZWEsXG5cdFx0XHRcdFx0ZHJpdmVyS2V5LFxuXHRcdFx0XHRcdGRyaXZlck1ldGFLZXk6IGdldE1ldGFLZXkoZHJpdmVyS2V5KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBhcmVhVG9Ecml2ZXJNZXRhS2V5c01hcCA9IGtleXMucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0XHRtYXBba2V5LmRyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0bWFwW2tleS5kcml2ZXJBcmVhXT8ucHVzaChrZXkpO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0Y29uc3QgcmVzdWx0c01hcCA9IHt9O1xuXHRcdFx0Y29uc3Qgc3RvcmFnZSA9IGJyb3dzZXIuc3RvcmFnZTtcblx0XHRcdGlmICghc3RvcmFnZSkgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBzdG9yYWdlIEFQSSBpcyB1bmF2YWlsYWJsZVwiKTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0RyaXZlck1ldGFLZXlzTWFwKS5tYXAoYXN5bmMgKFthcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBhcmVhUmVzID0gYXdhaXQgc3RvcmFnZVthcmVhXS5nZXQoa2V5cy5tYXAoKGtleSkgPT4ga2V5LmRyaXZlck1ldGFLZXkpKTtcblx0XHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0XHRyZXN1bHRzTWFwW2tleS5rZXldID0gYXJlYVJlc1trZXkuZHJpdmVyTWV0YUtleV0gPz8ge307XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXHRcdFx0cmV0dXJuIGtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleToga2V5LmtleSxcblx0XHRcdFx0bWV0YTogcmVzdWx0c01hcFtrZXkua2V5XVxuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0c2V0SXRlbTogYXN5bmMgKGtleSwgdmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdGF3YWl0IHNldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKTtcblx0XHR9LFxuXHRcdHNldEl0ZW1zOiBhc3luYyAoaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb0tleVZhbHVlTWFwID0ge307XG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KFwia2V5XCIgaW4gaXRlbSA/IGl0ZW0ua2V5IDogaXRlbS5pdGVtLmtleSk7XG5cdFx0XHRcdGFyZWFUb0tleVZhbHVlTWFwW2RyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0YXJlYVRvS2V5VmFsdWVNYXBbZHJpdmVyQXJlYV0ucHVzaCh7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0dmFsdWU6IGl0ZW0udmFsdWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0tleVZhbHVlTWFwKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCB2YWx1ZXNdKSA9PiB7XG5cdFx0XHRcdGF3YWl0IGdldERyaXZlcihkcml2ZXJBcmVhKS5zZXRJdGVtcyh2YWx1ZXMpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0c2V0TWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG5cdFx0fSxcblx0XHRzZXRNZXRhczogYXN5bmMgKGl0ZW1zKSA9PiB7XG5cdFx0XHRjb25zdCBhcmVhVG9NZXRhVXBkYXRlc01hcCA9IHt9O1xuXHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShcImtleVwiIGluIGl0ZW0gPyBpdGVtLmtleSA6IGl0ZW0uaXRlbS5rZXkpO1xuXHRcdFx0XHRhcmVhVG9NZXRhVXBkYXRlc01hcFtkcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdGFyZWFUb01ldGFVcGRhdGVzTWFwW2RyaXZlckFyZWFdLnB1c2goe1xuXHRcdFx0XHRcdGtleTogZHJpdmVyS2V5LFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IGl0ZW0ubWV0YVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvTWV0YVVwZGF0ZXNNYXApLm1hcChhc3luYyAoW3N0b3JhZ2VBcmVhLCB1cGRhdGVzXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBkcml2ZXIgPSBnZXREcml2ZXIoc3RvcmFnZUFyZWEpO1xuXHRcdFx0XHRjb25zdCBtZXRhS2V5cyA9IHVwZGF0ZXMubWFwKCh7IGtleSB9KSA9PiBnZXRNZXRhS2V5KGtleSkpO1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ01ldGFzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKG1ldGFLZXlzKTtcblx0XHRcdFx0Y29uc3QgZXhpc3RpbmdNZXRhTWFwID0gT2JqZWN0LmZyb21FbnRyaWVzKGV4aXN0aW5nTWV0YXMubWFwKCh7IGtleSwgdmFsdWUgfSkgPT4gW2tleSwgZ2V0TWV0YVZhbHVlKHZhbHVlKV0pKTtcblx0XHRcdFx0Y29uc3QgbWV0YVVwZGF0ZXMgPSB1cGRhdGVzLm1hcCgoeyBrZXksIHByb3BlcnRpZXMgfSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGtleSk7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdFx0XHRcdHZhbHVlOiBtZXJnZU1ldGEoZXhpc3RpbmdNZXRhTWFwW21ldGFLZXldID8/IHt9LCBwcm9wZXJ0aWVzKVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbXMobWV0YVVwZGF0ZXMpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlSXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb0tleXNNYXAgPSB7fTtcblx0XHRcdGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRcdGxldCBrZXlTdHI7XG5cdFx0XHRcdGxldCBvcHRzO1xuXHRcdFx0XHRpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikga2V5U3RyID0ga2V5O1xuXHRcdFx0XHRlbHNlIGlmIChcImdldFZhbHVlXCIgaW4ga2V5KSBrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRlbHNlIGlmIChcIml0ZW1cIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkuaXRlbS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IGtleS5vcHRpb25zO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IGtleS5vcHRpb25zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleVN0cik7XG5cdFx0XHRcdGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRhcmVhVG9LZXlzTWFwW2RyaXZlckFyZWFdLnB1c2goZHJpdmVyS2V5KTtcblx0XHRcdFx0aWYgKG9wdHM/LnJlbW92ZU1ldGEpIGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0ucHVzaChnZXRNZXRhS2V5KGRyaXZlcktleSkpO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyhhcmVhVG9LZXlzTWFwKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHRhd2FpdCBnZXREcml2ZXIoZHJpdmVyQXJlYSkucmVtb3ZlSXRlbXMoa2V5cyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRjbGVhcjogYXN5bmMgKGJhc2UpID0+IHtcblx0XHRcdGF3YWl0IGdldERyaXZlcihiYXNlKS5jbGVhcigpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlTWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgcmVtb3ZlTWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG5cdFx0fSxcblx0XHRzbmFwc2hvdDogYXN5bmMgKGJhc2UsIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBnZXREcml2ZXIoYmFzZSkuc25hcHNob3QoKTtcblx0XHRcdG9wdHM/LmV4Y2x1ZGVLZXlzPy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XTtcblx0XHRcdFx0ZGVsZXRlIGRhdGFbZ2V0TWV0YUtleShrZXkpXTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fSxcblx0XHRyZXN0b3JlU25hcHNob3Q6IGFzeW5jIChiYXNlLCBkYXRhKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXREcml2ZXIoYmFzZSkucmVzdG9yZVNuYXBzaG90KGRhdGEpO1xuXHRcdH0sXG5cdFx0d2F0Y2g6IChrZXksIGNiKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRyZXR1cm4gd2F0Y2goZHJpdmVyLCBkcml2ZXJLZXksIGNiKTtcblx0XHR9LFxuXHRcdHVud2F0Y2goKSB7XG5cdFx0XHRPYmplY3QudmFsdWVzKGRyaXZlcnMpLmZvckVhY2goKGRyaXZlcikgPT4ge1xuXHRcdFx0XHRkcml2ZXIudW53YXRjaCgpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRkZWZpbmVJdGVtOiAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRjb25zdCB7IHZlcnNpb246IHRhcmdldFZlcnNpb24gPSAxLCBtaWdyYXRpb25zID0ge30sIG9uTWlncmF0aW9uQ29tcGxldGUsIGRlYnVnID0gZmFsc2UgfSA9IG9wdHMgPz8ge307XG5cdFx0XHRpZiAodGFyZ2V0VmVyc2lvbiA8IDEpIHRocm93IEVycm9yKFwiU3RvcmFnZSBpdGVtIHZlcnNpb24gY2Fubm90IGJlIGxlc3MgdGhhbiAxLiBJbml0aWFsIHZlcnNpb25zIHNob3VsZCBiZSBzZXQgdG8gMSwgbm90IDAuXCIpO1xuXHRcdFx0bGV0IG5lZWRzVmVyc2lvblNldCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgbWlncmF0ZSA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgZHJpdmVyTWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRcdFx0Y29uc3QgW3sgdmFsdWUgfSwgeyB2YWx1ZTogbWV0YSB9XSA9IGF3YWl0IGRyaXZlci5nZXRJdGVtcyhbZHJpdmVyS2V5LCBkcml2ZXJNZXRhS2V5XSk7XG5cdFx0XHRcdG5lZWRzVmVyc2lvblNldCA9IHZhbHVlID09IG51bGwgJiYgbWV0YT8udiA9PSBudWxsICYmICEhdGFyZ2V0VmVyc2lvbjtcblx0XHRcdFx0aWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcblx0XHRcdFx0Y29uc3QgY3VycmVudFZlcnNpb24gPSBtZXRhPy52ID8/IDE7XG5cdFx0XHRcdGlmIChjdXJyZW50VmVyc2lvbiA+IHRhcmdldFZlcnNpb24pIHRocm93IEVycm9yKGBWZXJzaW9uIGRvd25ncmFkZSBkZXRlY3RlZCAodiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259KSBmb3IgXCIke2tleX1cImApO1xuXHRcdFx0XHRpZiAoY3VycmVudFZlcnNpb24gPT09IHRhcmdldFZlcnNpb24pIHJldHVybjtcblx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBSdW5uaW5nIHN0b3JhZ2UgbWlncmF0aW9uIGZvciAke2tleX06IHYke2N1cnJlbnRWZXJzaW9ufSAtPiB2JHt0YXJnZXRWZXJzaW9ufWApO1xuXHRcdFx0XHRjb25zdCBtaWdyYXRpb25zVG9SdW4gPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0YXJnZXRWZXJzaW9uIC0gY3VycmVudFZlcnNpb24gfSwgKF8sIGkpID0+IGN1cnJlbnRWZXJzaW9uICsgaSArIDEpO1xuXHRcdFx0XHRsZXQgbWlncmF0ZWRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRmb3IgKGNvbnN0IG1pZ3JhdGVUb1ZlcnNpb24gb2YgbWlncmF0aW9uc1RvUnVuKSB0cnkge1xuXHRcdFx0XHRcdG1pZ3JhdGVkVmFsdWUgPSBhd2FpdCBtaWdyYXRpb25zPy5bbWlncmF0ZVRvVmVyc2lvbl0/LihtaWdyYXRlZFZhbHVlKSA/PyBtaWdyYXRlZFZhbHVlO1xuXHRcdFx0XHRcdGlmIChkZWJ1ZykgY29uc29sZS5kZWJ1ZyhgW3dlYmV4dC1zdG9yZV0gU3RvcmFnZSBtaWdyYXRpb24gcHJvY2Vzc2VkIGZvciB2ZXJzaW9uOiB2JHttaWdyYXRlVG9WZXJzaW9ufWApO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWlncmF0aW9uRXJyb3Ioa2V5LCBtaWdyYXRlVG9WZXJzaW9uLCB7IGNhdXNlOiBlcnIgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW1zKFt7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0dmFsdWU6IG1pZ3JhdGVkVmFsdWVcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdGtleTogZHJpdmVyTWV0YUtleSxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0Li4ubWV0YSxcblx0XHRcdFx0XHRcdHY6IHRhcmdldFZlcnNpb25cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dKTtcblx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBTdG9yYWdlIG1pZ3JhdGlvbiBjb21wbGV0ZWQgZm9yICR7a2V5fSB2JHt0YXJnZXRWZXJzaW9ufWAsIHsgbWlncmF0ZWRWYWx1ZSB9KTtcblx0XHRcdFx0b25NaWdyYXRpb25Db21wbGV0ZT8uKG1pZ3JhdGVkVmFsdWUsIHRhcmdldFZlcnNpb24pO1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IG1pZ3JhdGlvbnNEb25lID0gb3B0cz8ubWlncmF0aW9ucyA9PSBudWxsID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBtaWdyYXRlKCkuY2F0Y2goKGVycikgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBbd2ViZXh0LXN0b3JlXSBNaWdyYXRpb24gZmFpbGVkIGZvciAke2tleX1gLCBlcnIpO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBpbml0TG9jayA9IHdpdGhMb2NrKCk7XG5cdFx0XHRjb25zdCBnZXRGYWxsYmFjayA9ICgpID0+IG9wdHM/LmZhbGxiYWNrID8/IG9wdHM/LmRlZmF1bHRWYWx1ZSA/PyBudWxsO1xuXHRcdFx0Y29uc3QgZ2V0T3JJbml0VmFsdWUgPSAoKSA9PiBpbml0TG9jayhhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0oZHJpdmVyS2V5KTtcblx0XHRcdFx0aWYgKHZhbHVlICE9IG51bGwgfHwgb3B0cz8uaW5pdCA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gYXdhaXQgb3B0cy5pbml0KCk7XG5cdFx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKGRyaXZlcktleSwgbmV3VmFsdWUpO1xuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiB0YXJnZXRWZXJzaW9uID4gMSkgYXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgeyB2OiB0YXJnZXRWZXJzaW9uIH0pO1xuXHRcdFx0XHRyZXR1cm4gbmV3VmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdG1pZ3JhdGlvbnNEb25lLnRoZW4oZ2V0T3JJbml0VmFsdWUpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHRnZXQgZGVmYXVsdFZhbHVlKCkge1xuXHRcdFx0XHRcdHJldHVybiBnZXRGYWxsYmFjaygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQgZmFsbGJhY2soKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEZhbGxiYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldFZhbHVlOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0aWYgKG9wdHM/LmluaXQpIHJldHVybiBhd2FpdCBnZXRPckluaXRWYWx1ZSgpO1xuXHRcdFx0XHRcdGVsc2UgcmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXRNZXRhOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXRWYWx1ZTogYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0aWYgKG5lZWRzVmVyc2lvblNldCkge1xuXHRcdFx0XHRcdFx0bmVlZHNWZXJzaW9uU2V0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChbc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpLCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCB7IHY6IHRhcmdldFZlcnNpb24gfSldKTtcblx0XHRcdFx0XHR9IGVsc2UgYXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXRNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuXHRcdFx0XHRcdHJldHVybiBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0cmVtb3ZlVmFsdWU6IGFzeW5jIChvcHRzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHJlbW92ZUl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmVNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuXHRcdFx0XHRcdHJldHVybiBhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0d2F0Y2g6IChjYikgPT4gd2F0Y2goZHJpdmVyLCBkcml2ZXJLZXksIChuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IGNiKG5ld1ZhbHVlID8/IGdldEZhbGxiYWNrKCksIG9sZFZhbHVlID8/IGdldEZhbGxiYWNrKCkpKSxcblx0XHRcdFx0bWlncmF0ZVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59XG5mdW5jdGlvbiBjcmVhdGVEcml2ZXIoc3RvcmFnZUFyZWEpIHtcblx0Y29uc3QgZ2V0U3RvcmFnZUFyZWEgPSAoKSA9PiB7XG5cdFx0aWYgKGJyb3dzZXIucnVudGltZSA9PSBudWxsKSB0aHJvdyBFcnJvcihgJ3dlYmV4dC1zdG9yZScgbXVzdCBiZSBsb2FkZWQgaW4gYSB3ZWIgZXh0ZW5zaW9uIGVudmlyb25tZW50LmApO1xuXHRcdGlmIChicm93c2VyLnN0b3JhZ2UgPT0gbnVsbCkgdGhyb3cgRXJyb3IoXCJZb3UgbXVzdCBhZGQgdGhlICdzdG9yYWdlJyBwZXJtaXNzaW9uIHRvIHlvdXIgbWFuaWZlc3QgdG8gdXNlICd3ZWJleHQtc3RvcmUnXCIpO1xuXHRcdGNvbnN0IGFyZWEgPSBicm93c2VyLnN0b3JhZ2Vbc3RvcmFnZUFyZWFdO1xuXHRcdGlmIChhcmVhID09IG51bGwpIHRocm93IEVycm9yKGBcImJyb3dzZXIuc3RvcmFnZS4ke3N0b3JhZ2VBcmVhfVwiIGlzIHVuZGVmaW5lZGApO1xuXHRcdHJldHVybiBhcmVhO1xuXHR9O1xuXHRjb25zdCB3YXRjaExpc3RlbmVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogYXN5bmMgKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIChhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXkpKVtrZXldO1xuXHRcdH0sXG5cdFx0Z2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXlzKTtcblx0XHRcdHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiAoe1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHZhbHVlOiByZXN1bHRba2V5XSA/PyBudWxsXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwpIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG5cdFx0XHRlbHNlIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KHsgW2tleV06IHZhbHVlIH0pO1xuXHRcdH0sXG5cdFx0c2V0SXRlbXM6IGFzeW5jICh2YWx1ZXMpID0+IHtcblx0XHRcdGNvbnN0IG1hcCA9IHZhbHVlcy5yZWR1Y2UoKG1hcCwgeyBrZXksIHZhbHVlIH0pID0+IHtcblx0XHRcdFx0bWFwW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH0sIHt9KTtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KG1hcCk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXkpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlSXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXlzKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmNsZWFyKCk7XG5cdFx0fSxcblx0XHRzbmFwc2hvdDogYXN5bmMgKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KCk7XG5cdFx0fSxcblx0XHRyZXN0b3JlU25hcHNob3Q6IGFzeW5jIChkYXRhKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnNldChkYXRhKTtcblx0XHR9LFxuXHRcdHdhdGNoKGtleSwgY2IpIHtcblx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKGNoYW5nZXMpID0+IHtcblx0XHRcdFx0Y29uc3QgY2hhbmdlID0gY2hhbmdlc1trZXldO1xuXHRcdFx0XHRpZiAoY2hhbmdlID09IG51bGwgfHwgZGVxdWFsKGNoYW5nZS5uZXdWYWx1ZSwgY2hhbmdlLm9sZFZhbHVlKSkgcmV0dXJuO1xuXHRcdFx0XHRjYihjaGFuZ2UubmV3VmFsdWUgPz8gbnVsbCwgY2hhbmdlLm9sZFZhbHVlID8/IG51bGwpO1xuXHRcdFx0fTtcblx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdHdhdGNoTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRnZXRTdG9yYWdlQXJlYSgpLm9uQ2hhbmdlZC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdHdhdGNoTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0dW53YXRjaCgpIHtcblx0XHRcdHdhdGNoTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG5cdFx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdH0pO1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuY2xlYXIoKTtcblx0XHR9XG5cdH07XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IHN0b3JhZ2UgYXMgdCB9O1xuIiwiaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gJ3dlYmV4dC1zdG9yZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0dGluZ3Mge1xuICB0aGVtZTogJ2xpZ2h0JyB8ICdkYXJrJztcbiAgZGlzcGxheU5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHZlcnNpb25lZCBpdGVtLiBCdW1waW5nIGB2ZXJzaW9uYCBhbmQgYWRkaW5nIGEgbWlncmF0aW9uIGZ1bmN0aW9uIGlzIGhvd1xuICogd2ViZXh0LXN0b3JlIGV2b2x2ZXMgYSBzdG9yZWQgc2hhcGUgb3ZlciB0aW1lIOKAlCBtaWdyYXRpb25zIHJ1blxuICogYXV0b21hdGljYWxseSwgb25jZSwgdGhlIGZpcnN0IHRpbWUgdGhlIGl0ZW0gaXMgdG91Y2hlZCBhZnRlciBhbiB1cGRhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBzZXR0aW5nc0l0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08U2V0dGluZ3M+KCdzeW5jOnNldHRpbmdzJywge1xuICBmYWxsYmFjazogeyB0aGVtZTogJ2xpZ2h0JywgZGlzcGxheU5hbWU6ICdHdWVzdCcgfSxcbiAgdmVyc2lvbjogMyxcbiAgbWlncmF0aW9uczoge1xuICAgIC8vIHYxIC0+IHYyOiBpbnRyb2R1Y2VkIGB0aGVtZWBcbiAgICAyOiAob2xkOiBhbnkpID0+ICh7IC4uLm9sZCwgdGhlbWU6IG9sZD8udGhlbWUgPz8gJ2xpZ2h0JyB9KSxcbiAgICAvLyB2MiAtPiB2MzogaW50cm9kdWNlZCBgZGlzcGxheU5hbWVgXG4gICAgMzogKG9sZDogYW55KSA9PiAoeyAuLi5vbGQsIGRpc3BsYXlOYW1lOiBvbGQ/LmRpc3BsYXlOYW1lID8/ICdHdWVzdCcgfSksXG4gIH0sXG4gIGRlYnVnOiB0cnVlLFxuICBvbk1pZ3JhdGlvbkNvbXBsZXRlOiAodmFsdWUsIHRhcmdldFZlcnNpb24pID0+IHtcbiAgICBjb25zb2xlLmxvZyhgW3dlYmV4dC1zdG9yZS1kZW1vXSBzZXR0aW5ncyBtaWdyYXRlZCB0byB2JHt0YXJnZXRWZXJzaW9ufWAsIHZhbHVlKTtcbiAgfSxcbn0pO1xuXG4vKipcbiAqIGBpbml0YCBydW5zIGV4YWN0bHkgb25jZSDigJQgdGhlIGZpcnN0IHRpbWUgdGhpcyBpdGVtIGlzIGRlZmluZWQgaW4gYW55XG4gKiBleHRlbnNpb24gY29udGV4dCBhZnRlciBpbnN0YWxsIOKAlCBhbmQgb25seSBpZiBub3RoaW5nIGlzIGluIHN0b3JhZ2UgeWV0LlxuICogR29vZCBmb3Igb25lLXRpbWUgSURzLCBmaXJzdC1ydW4gdGltZXN0YW1wcywgZXRjLlxuICovXG5leHBvcnQgY29uc3QgaW5zdGFsbElkSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxzdHJpbmc+KCdsb2NhbDppbnN0YWxsSWQnLCB7XG4gIGluaXQ6ICgpID0+IGNyeXB0by5yYW5kb21VVUlEKCksXG59KTtcblxuLyoqXG4gKiBBIHBsYWluIGNvdW50ZXIgd2l0aCBhIGZhbGxiYWNrIG9mIDAuIFdyaXR0ZW4gdG8gZnJvbSB0aGUgcG9wdXAgKHZpYSB0aGVcbiAqIFJlYWN0IGhvb2spLCB0aGUgYmFja2dyb3VuZCAob24gYW4gYWxhcm0gKyBvbiBtZXNzYWdlKSwgYW5kIHJlYWQgZnJvbVxuICogYm90aCDigJQgdGhpcyBpcyB3aGF0IHRoZSBcIkNyb3NzLWNvbnRleHRcIiB0YWIgdXNlcyB0byBwcm92ZSBgd2F0Y2goKWAgZmlyZXNcbiAqIGFjcm9zcyBleGVjdXRpb24gY29udGV4dHMuXG4gKi9cbmV4cG9ydCBjb25zdCBoZWFydGJlYXRJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPG51bWJlcj4oJ2xvY2FsOmhlYXJ0YmVhdCcsIHtcbiAgZmFsbGJhY2s6IDAsXG59KTtcblxuLyoqIEZpeGVkIGtleXMgdXNlZCBieSB0aGUgYmF0Y2gtb3BlcmF0aW9ucyB0YWIuICovXG5leHBvcnQgY29uc3QgQkFUQ0hfS0VZUyA9IFsnbG9jYWw6YmF0Y2hBJywgJ2xvY2FsOmJhdGNoQicsICdsb2NhbDpiYXRjaEMnXSBhcyBjb25zdDtcblxuZXhwb3J0IGludGVyZmFjZSBBcHBTZXR0aW5nIHtcbiAgdGhlbWU6ICdsaWdodCcgfCAnZGFyayc7XG4gIGZyZWU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGB7IHRoZW1lOiAnZGFyaycsIGZyZWU6IHRydWUgfWAgc2hhcGUgZnJvbSB0aGUgXCJob3cgZG8gSSB1cGRhdGUgb25lXG4gKiBrZXlcIiBxdWVzdGlvbiDigJQgdXNlZCBieSBPYmplY3RVcGRhdGVQYW5lbC4gd2ViZXh0LXN0b3JlIHN0b3JlcyB0aGUgd2hvbGVcbiAqIHZhbHVlIGFzIG9uZSBKU09OIGJsb2IsIHNvIFwidXBkYXRpbmcgb25lIGtleVwiIGFsd2F5cyBtZWFucyByZWFkLW1vZGlmeS1cbiAqIHdyaXRlIHRoZSB3aG9sZSBvYmplY3QsIHNhbWUgYXMgeW91IHdvdWxkIHdpdGggcGxhaW4gUmVhY3Qgc3RhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBhcHBTZXR0aW5nSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxBcHBTZXR0aW5nPignbG9jYWw6YXBwU2V0dGluZycsIHtcbiAgZmFsbGJhY2s6IHsgdGhlbWU6ICdkYXJrJywgZnJlZTogdHJ1ZSB9LFxufSk7XG4iLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSAnd2ViZXh0LXN0b3JlJztcbmltcG9ydCB7IGhlYXJ0YmVhdEl0ZW0sIGluc3RhbGxJZEl0ZW0sIHNldHRpbmdzSXRlbSB9IGZyb20gJ0AvdXRpbHMvc3RvcmFnZS1pdGVtcyc7XG5cbi8qKlxuICogQmFja2dyb3VuZCAvIHNlcnZpY2Ugd29ya2VyIGd1aWRlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBNVjMgc2VydmljZSB3b3JrZXJzIGFyZSBOT1QgbG9uZy1saXZlZCDigJQgdGhlIGJyb3dzZXIga2lsbHMgYW5kIHJlc3RhcnRzXG4gKiB0aGVtIHdoZW5ldmVyIGl0IHdhbnRzIChpZGxlIHRpbWVvdXQsIG1lbW9yeSBwcmVzc3VyZSwgZXRjKS4gTm90aGluZyB5b3VcbiAqIGhvbGQgaW4gYSBwbGFpbiBKUyB2YXJpYWJsZSBoZXJlIHN1cnZpdmVzIHRoYXQuIGB3ZWJleHQtc3RvcmVgIGl0ZW1zIGRvLFxuICogYmVjYXVzZSBldmVyeSByZWFkL3dyaXRlIGdvZXMgc3RyYWlnaHQgdG8gYGJyb3dzZXIuc3RvcmFnZWAsIG5vdCB0b1xuICogaW4tbWVtb3J5IHN0YXRlIOKAlCB0aGF0J3MgKndoeSogc3RvcmFnZSwgbm90IG1vZHVsZS1sZXZlbCB2YXJpYWJsZXMsIGlzXG4gKiB0aGUgcmlnaHQgcGxhY2UgZm9yIGFueXRoaW5nIHRoZSBiYWNrZ3JvdW5kIG5lZWRzIHRvIHJlbWVtYmVyLlxuICpcbiAqIFRocmVlIHNlcGFyYXRlIGxpZmVjeWNsZSBob29rcyBtYXR0ZXIgaGVyZSwgYW5kIGl0J3MgZWFzeSB0byBjb25mbGF0ZVxuICogdGhlbTpcbiAqICAgLSBgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7Li4ufSlgIGJvZHkg4oCUIHJ1bnMgZXZlcnkgdGltZSB0aGlzIHNlcnZpY2VcbiAqICAgICB3b3JrZXIgKHJlKXN0YXJ0cy4gUHV0IHN1YnNjcmlwdGlvbnMgKGAud2F0Y2goKWApIGFuZCBhbGFybS9tZXNzYWdlXG4gKiAgICAgbGlzdGVuZXJzIGhlcmUg4oCUIHRoZXkgbmVlZCB0byBiZSByZS1yZWdpc3RlcmVkIG9uIGV2ZXJ5IHJlc3RhcnQuXG4gKiAgIC0gYGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZGAg4oCUIHJ1bnMgb25jZSBvbiBpbnN0YWxsLCBhbmQgb25jZSBwZXJcbiAqICAgICBleHRlbnNpb24gdXBkYXRlLiBUaGlzIGlzIHRoZSBjb3JyZWN0IHBsYWNlIGZvciBvbmUtdGltZSBzZXR1cCBhbmRcbiAqICAgICBmb3IgZm9yY2luZyBtaWdyYXRpb25zIGJlZm9yZSBhbnl0aGluZyBlbHNlIHRvdWNoZXMgdGhlIGRhdGEuXG4gKiAgIC0gYGJyb3dzZXIuYWxhcm1zYCDigJQgTVYzJ3MgcmVwbGFjZW1lbnQgZm9yIGBzZXRJbnRlcnZhbGAgaW4gYSBzZXJ2aWNlXG4gKiAgICAgd29ya2VyOyBhIHBsYWluIGBzZXRJbnRlcnZhbGAgZ2V0cyB0aHJvd24gYXdheSB0aGUgbW9tZW50IHRoZSB3b3JrZXJcbiAqICAgICBpcyBraWxsZWQsIGBhbGFybXNgIHN1cnZpdmVzIHJlc3RhcnRzIGJlY2F1c2UgdGhlIGJyb3dzZXIgaXRzZWxmXG4gKiAgICAgc2NoZWR1bGVzIHRoZW0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xuICBjb25zb2xlLmxvZygnW3dlYmV4dC1zdG9yZS1kZW1vXSBiYWNrZ3JvdW5kIHN0YXJ0ZWQnKTtcblxuICAvLyBSdW5zIG9uY2UgcGVyIGluc3RhbGwgYW5kIG9uY2UgcGVyIHVwZGF0ZSDigJQgbm90IG9uIGV2ZXJ5IHdvcmtlclxuICAvLyByZXN0YXJ0LiBHb29kIHBsYWNlIHRvIGZvcmNlIG1pZ3JhdGlvbnMvaW5pdCBhaGVhZCBvZiBhbnl0aGluZyBlbHNlLFxuICAvLyBhbmQgdG8gdGVsbCBmcmVzaCBpbnN0YWxscyBhcGFydCBmcm9tIHVwZGF0ZXMuXG4gIGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoeyByZWFzb24gfSkgPT4ge1xuICAgIGlmIChyZWFzb24gPT09ICdpbnN0YWxsJykge1xuICAgICAgY29uc29sZS5sb2coJ1t3ZWJleHQtc3RvcmUtZGVtb10gZmlyc3QgaW5zdGFsbCcpO1xuICAgIH0gZWxzZSBpZiAocmVhc29uID09PSAndXBkYXRlJykge1xuICAgICAgY29uc29sZS5sb2coJ1t3ZWJleHQtc3RvcmUtZGVtb10gdXBkYXRlZCDigJQgcnVubmluZyBwZW5kaW5nIG1pZ3JhdGlvbnMnKTtcbiAgICB9XG4gICAgc2V0dGluZ3NJdGVtLm1pZ3JhdGUoKTtcbiAgfSk7XG5cbiAgLy8gYGRlZmluZUl0ZW0oKWAgYWxzbyBydW5zIHBlbmRpbmcgbWlncmF0aW9ucyBsYXppbHkgdGhlIGZpcnN0IHRpbWUgaXQnc1xuICAvLyB0b3VjaGVkLCBzbyB0aGlzIGlzbid0IHN0cmljdGx5IHJlcXVpcmVkIOKAlCBidXQgY2FsbGluZyBpdCBleHBsaWNpdGx5IG9uXG4gIC8vIGV2ZXJ5IHdvcmtlciBzdGFydCAobm90IGp1c3Qgb24gaW5zdGFsbC91cGRhdGUpIG1lYW5zIGl0J3MgZ3VhcmFudGVlZFxuICAvLyB0byBoYXZlIGhhcHBlbmVkIGJlZm9yZSBhbnl0aGluZyBiZWxvdyByZWFkcyBgc2V0dGluZ3NJdGVtYC5cbiAgc2V0dGluZ3NJdGVtLm1pZ3JhdGUoKTtcblxuICAvLyBgaW5pdGAgaXRlbXMgcmVzb2x2ZSB0aGVtc2VsdmVzIG9uIGZpcnN0IGFjY2VzcyB0b28g4oCUIHRoaXMganVzdCBmb3JjZXNcbiAgLy8gdGhhdCB0byBoYXBwZW4gaW1tZWRpYXRlbHksIHNvIHRoZSBpbnN0YWxsIElEIGV4aXN0cyByaWdodCBhd2F5IHJhdGhlclxuICAvLyB0aGFuIHdhaXRpbmcgZm9yIHRoZSBmaXJzdCBgZ2V0VmFsdWUoKWAgY2FsbCBmcm9tIGVsc2V3aGVyZS5cbiAgaW5zdGFsbElkSXRlbS5nZXRWYWx1ZSgpLnRoZW4oKGlkKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1t3ZWJleHQtc3RvcmUtZGVtb10gaW5zdGFsbCBpZDonLCBpZCk7XG4gIH0pO1xuXG4gIC8vIFByb3ZlIGBzdG9yYWdlLndhdGNoYCB3b3JrcyBmcm9tIHRoZSBiYWNrZ3JvdW5kIHRvbywgbm90IGp1c3QgZnJvbVxuICAvLyBSZWFjdCDigJQgdGhpcyBsb2dzIGV2ZXJ5IGNoYW5nZSBtYWRlIGZyb20gQU5ZIGNvbnRleHQgKHBvcHVwIGluY2x1ZGVkKS5cbiAgLy8gTXVzdCBiZSByZS1yZWdpc3RlcmVkIGhlcmUsIGluIHRoZSBmdW5jdGlvbiBib2R5LCBldmVyeSB0aW1lIHRoZVxuICAvLyB3b3JrZXIgcmVzdGFydHMg4oCUIGEgd2F0Y2hlciBzZXQgdXAgb25jZSBhbmQgXCJyZW1lbWJlcmVkXCIgZG9lc24ndFxuICAvLyBzdXJ2aXZlIHRoZSB3b3JrZXIgYmVpbmcga2lsbGVkLlxuICBjb25zdCB1bndhdGNoSGVhcnRiZWF0ID0gaGVhcnRiZWF0SXRlbS53YXRjaCgobmV3VmFsdWUsIG9sZFZhbHVlKSA9PiB7XG4gICAgY29uc29sZS5sb2coYFt3ZWJleHQtc3RvcmUtZGVtb10gaGVhcnRiZWF0OiAke29sZFZhbHVlfSAtPiAke25ld1ZhbHVlfWApO1xuICB9KTtcblxuICAvLyBQZXJpb2RpYyB3cml0ZSwgZW50aXJlbHkgaW5kZXBlbmRlbnQgb2YgdGhlIHBvcHVwIGJlaW5nIG9wZW4uIElmIHlvdVxuICAvLyBoYXZlIHRoZSBwb3B1cCBvcGVuIHdpdGggdGhlIFwiQ3Jvc3MtY29udGV4dFwiIHRhYiBhY3RpdmUsIHlvdSdsbCBzZWVcbiAgLy8gdGhpcyB0aWNrIHVwIG9uIGl0cyBvd24gZXZlcnkgZmV3IHNlY29uZHMuIGBhbGFybXMuY3JlYXRlYCBpc1xuICAvLyBpZGVtcG90ZW50IGJ5IG5hbWUsIHNvIHJlLWNhbGxpbmcgaXQgb24gZXZlcnkgd29ya2VyIHJlc3RhcnQgaXMgZmluZSDigJRcbiAgLy8gaXQgd29uJ3QgY3JlYXRlIGR1cGxpY2F0ZSBhbGFybXMuXG4gIGJyb3dzZXIuYWxhcm1zLmNyZWF0ZSgnaGVhcnRiZWF0JywgeyBwZXJpb2RJbk1pbnV0ZXM6IDAuMDUgfSk7IC8vIH4zc1xuICBicm93c2VyLmFsYXJtcy5vbkFsYXJtLmFkZExpc3RlbmVyKGFzeW5jIChhbGFybSkgPT4ge1xuICAgIGlmIChhbGFybS5uYW1lICE9PSAnaGVhcnRiZWF0JykgcmV0dXJuO1xuICAgIGNvbnN0IGN1cnJlbnQgPSBhd2FpdCBoZWFydGJlYXRJdGVtLmdldFZhbHVlKCk7XG4gICAgYXdhaXQgaGVhcnRiZWF0SXRlbS5zZXRWYWx1ZShjdXJyZW50ICsgMSk7XG4gIH0pO1xuXG4gIC8vIE9uLWRlbWFuZCBidW1wLCB0cmlnZ2VyZWQgYnkgYSBidXR0b24gaW4gdGhlIHBvcHVwIOKAlCBkZW1vbnN0cmF0ZXMgYVxuICAvLyB3cml0ZSBmcm9tIHRoZSBiYWNrZ3JvdW5kIGJlaW5nIHJlZmxlY3RlZCBsaXZlIGluIHRoZSBwb3B1cCdzIFVJIHZpYVxuICAvLyBgdXNlU3RvcmFnZWAncyBidWlsdC1pbiB3YXRjaCwgd2l0aCBubyBtYW51YWwgbWVzc2FnZS1wYXNzaW5nIG5lZWRlZCBvblxuICAvLyB0aGUgcG9wdXAgc2lkZSB0byBwaWNrIGl0IHVwLlxuICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2U/LnR5cGUgPT09ICdidW1wLWhlYXJ0YmVhdCcpIHtcbiAgICAgIHJldHVybiBoZWFydGJlYXRJdGVtLmdldFZhbHVlKCkudGhlbigoY3VycmVudCkgPT4gaGVhcnRiZWF0SXRlbS5zZXRWYWx1ZShjdXJyZW50ICsgMSkpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQ2xlYW51cCBpcyBtb3N0bHkgbW9vdCBmb3IgYSBzZXJ2aWNlIHdvcmtlciAoaXQncyB0b3JuIGRvd24gYnkgdGhlXG4gIC8vIGJyb3dzZXIsIG5vdCB1bm1vdW50ZWQpLCBidXQgc2hvd24gaGVyZSBmb3IgY29tcGxldGVuZXNzIC8gc3ltbWV0cnlcbiAgLy8gd2l0aCBob3cgeW91J2QgY2xlYW4gdXAgYSB3YXRjaGVyIGFueXdoZXJlIGVsc2UuXG4gIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignYmVmb3JldW5sb2FkJyBhcyBhbnksICgpID0+IHtcbiAgICB1bndhdGNoSGVhcnRiZWF0KCk7XG4gICAgc3RvcmFnZS51bndhdGNoKCk7XG4gIH0pO1xufSk7XG4iLCIvLyNyZWdpb24gc3JjL2luZGV4LnRzXG4vKipcbiogQ2xhc3MgZm9yIHBhcnNpbmcgYW5kIHBlcmZvcm1pbmcgb3BlcmF0aW9ucyBvbiBtYXRjaCBwYXR0ZXJucy5cbipcbiogQGV4YW1wbGVcbiogICBjb25zdCBwYXR0ZXJuID0gbmV3IE1hdGNoUGF0dGVybignKjovL2dvb2dsZS5jb20vKicpO1xuKlxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHBzOi8vZ29vZ2xlLmNvbScpOyAvLyB0cnVlXG4qICAgcGF0dGVybi5pbmNsdWRlcygnaHR0cDovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MTIzJyk7IC8vIGZhbHNlXG4qL1xudmFyIE1hdGNoUGF0dGVybiA9IGNsYXNzIE1hdGNoUGF0dGVybiB7XG5cdHN0YXRpYyB7XG5cdFx0dGhpcy5QUk9UT0NPTFMgPSBbXG5cdFx0XHRcImh0dHBcIixcblx0XHRcdFwiaHR0cHNcIixcblx0XHRcdFwiZmlsZVwiLFxuXHRcdFx0XCJmdHBcIixcblx0XHRcdFwidXJuXCIsXG5cdFx0XHRcIndzXCIsXG5cdFx0XHRcIndzc1wiXG5cdFx0XTtcblx0fVxuXHQvKipcblx0KiBQYXJzZSBhIG1hdGNoIHBhdHRlcm4gc3RyaW5nLiBJZiBpdCBpcyBpbnZhbGlkLCB0aGUgY29uc3RydWN0b3Igd2lsbCB0aHJvdyBhblxuXHQqIGBJbnZhbGlkTWF0Y2hQYXR0ZXJuYCBlcnJvci5cblx0KlxuXHQqIEBwYXJhbSBtYXRjaFBhdHRlcm4gVGhlIG1hdGNoIHBhdHRlcm4gdG8gcGFyc2UuXG5cdCovXG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybikge1xuXHRcdGlmIChtYXRjaFBhdHRlcm4gPT09IFwiPGFsbF91cmxzPlwiKSB7XG5cdFx0XHR0aGlzLmlzQWxsVXJscyA9IHRydWU7XG5cdFx0XHR0aGlzLnByb3RvY29sTWF0Y2hlcyA9IFsuLi5NYXRjaFBhdHRlcm4uUFJPVE9DT0xTXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gXCIqXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IGdyb3VwcyA9IC8oLiopOlxcL1xcLyguKj8pKFxcLy4qKS8uZXhlYyhtYXRjaFBhdHRlcm4pO1xuXHRcdFx0aWYgKGdyb3VwcyA9PSBudWxsKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIFwiSW5jb3JyZWN0IGZvcm1hdFwiKTtcblx0XHRcdGNvbnN0IFtfLCBwcm90b2NvbCwgaG9zdG5hbWUsIHBhdGhuYW1lXSA9IGdyb3Vwcztcblx0XHRcdHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCk7XG5cdFx0XHR2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBwcm90b2NvbCA9PT0gXCIqXCIgPyBbXCJodHRwXCIsIFwiaHR0cHNcIl0gOiBbcHJvdG9jb2xdO1xuXHRcdFx0dGhpcy5ob3N0bmFtZU1hdGNoID0gaG9zdG5hbWU7XG5cdFx0XHR0aGlzLnBhdGhuYW1lTWF0Y2ggPSBwYXRobmFtZTtcblx0XHR9XG5cdH1cblx0LyoqIENoZWNrIGlmIGEgVVJMIGlzIGluY2x1ZGVkIGluIGEgcGF0dGVybi4gKi9cblx0aW5jbHVkZXModXJsKSB7XG5cdFx0Y29uc3QgdSA9IHR5cGVvZiB1cmwgPT09IFwic3RyaW5nXCIgPyBuZXcgVVJMKHVybCkgOiB1cmwgaW5zdGFuY2VvZiBMb2NhdGlvbiA/IG5ldyBVUkwodXJsLmhyZWYpIDogdXJsO1xuXHRcdGlmICh0aGlzLmlzQWxsVXJscykgcmV0dXJuICF0aGlzLmlzVW5rbm93blByb3RvY29sKHUpO1xuXHRcdHJldHVybiAhIXRoaXMucHJvdG9jb2xNYXRjaGVzLmZpbmQoKHByb3RvY29sKSA9PiB7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cFwiKSByZXR1cm4gdGhpcy5pc0h0dHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJodHRwc1wiKSByZXR1cm4gdGhpcy5pc0h0dHBzTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZmlsZVwiKSByZXR1cm4gdGhpcy5pc0ZpbGVNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJmdHBcIikgcmV0dXJuIHRoaXMuaXNGdHBNYXRjaCh1KTtcblx0XHRcdGlmIChwcm90b2NvbCA9PT0gXCJ1cm5cIikgcmV0dXJuIHRoaXMuaXNVcm5NYXRjaCh1KTtcblx0XHR9KTtcblx0fVxuXHRpc0h0dHBNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImh0dHA6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0h0dHBzTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwczpcIiAmJiB0aGlzLmlzSG9zdFBhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzSG9zdFBhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMuaG9zdG5hbWVNYXRjaCB8fCAhdGhpcy5wYXRobmFtZU1hdGNoKSByZXR1cm4gZmFsc2U7XG5cdFx0Y29uc3QgaG9zdG5hbWVNYXRjaFJlZ2V4cyA9IFt0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gpLCB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLmhvc3RuYW1lTWF0Y2gucmVwbGFjZSgvXlxcKlxcLi8sIFwiXCIpKV07XG5cdFx0Y29uc3QgcGF0aG5hbWVNYXRjaFJlZ2V4ID0gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKTtcblx0XHRyZXR1cm4gISFob3N0bmFtZU1hdGNoUmVnZXhzLmZpbmQoKHJlZ2V4KSA9PiByZWdleC50ZXN0KHVybC5ob3N0bmFtZSkpICYmIHBhdGhuYW1lTWF0Y2hSZWdleC50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNVbmtub3duUHJvdG9jb2wodXJsKSB7XG5cdFx0cmV0dXJuICF0aGlzLnByb3RvY29sTWF0Y2hlcy5pbmNsdWRlcyh1cmwucHJvdG9jb2wuc2xpY2UoMCwgLTEpKTtcblx0fVxuXHRpc1BhdGhNYXRjaCh1cmwpIHtcblx0XHRpZiAoIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB0aGlzLmNvbnZlcnRQYXR0ZXJuVG9SZWdleCh0aGlzLnBhdGhuYW1lTWF0Y2gpLnRlc3QodXJsLnBhdGhuYW1lKTtcblx0fVxuXHRpc0ZpbGVNYXRjaCh1cmwpIHtcblx0XHRyZXR1cm4gdXJsLnByb3RvY29sID09PSBcImZpbGU6XCIgJiYgdGhpcy5pc1BhdGhNYXRjaCh1cmwpO1xuXHR9XG5cdGlzRnRwTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiBmdHA6Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGlzVXJuTWF0Y2goX3VybCkge1xuXHRcdHRocm93IEVycm9yKFwiTm90IGltcGxlbWVudGVkOiB1cm46Ly8gcGF0dGVybiBtYXRjaGluZy4gT3BlbiBhIFBSIHRvIGFkZCBzdXBwb3J0XCIpO1xuXHR9XG5cdGNvbnZlcnRQYXR0ZXJuVG9SZWdleChwYXR0ZXJuKSB7XG5cdFx0Y29uc3Qgc3RhcnNSZXBsYWNlZCA9IHRoaXMuZXNjYXBlRm9yUmVnZXgocGF0dGVybikucmVwbGFjZSgvXFxcXFxcKi9nLCBcIi4qXCIpO1xuXHRcdHJldHVybiBSZWdFeHAoYF4ke3N0YXJzUmVwbGFjZWR9JGApO1xuXHR9XG5cdGVzY2FwZUZvclJlZ2V4KHN0cmluZykge1xuXHRcdHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xuXHR9XG59O1xudmFyIEludmFsaWRNYXRjaFBhdHRlcm4gPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IobWF0Y2hQYXR0ZXJuLCByZWFzb24pIHtcblx0XHRzdXBlcihgSW52YWxpZCBtYXRjaCBwYXR0ZXJuIFwiJHttYXRjaFBhdHRlcm59XCI6ICR7cmVhc29ufWApO1xuXHR9XG59O1xuZnVuY3Rpb24gdmFsaWRhdGVQcm90b2NvbChtYXRjaFBhdHRlcm4sIHByb3RvY29sKSB7XG5cdGlmICghTWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5pbmNsdWRlcyhwcm90b2NvbCkgJiYgcHJvdG9jb2wgIT09IFwiKlwiKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGAke3Byb3RvY29sfSBub3QgYSB2YWxpZCBwcm90b2NvbCAoJHtNYXRjaFBhdHRlcm4uUFJPVE9DT0xTLmpvaW4oXCIsIFwiKX0pYCk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZUhvc3RuYW1lKG1hdGNoUGF0dGVybiwgaG9zdG5hbWUpIHtcblx0aWYgKGhvc3RuYW1lLmluY2x1ZGVzKFwiOlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSG9zdG5hbWUgY2Fubm90IGluY2x1ZGUgYSBwb3J0YCk7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIipcIikgJiYgaG9zdG5hbWUubGVuZ3RoID4gMSAmJiAhaG9zdG5hbWUuc3RhcnRzV2l0aChcIiouXCIpKSB0aHJvdyBuZXcgSW52YWxpZE1hdGNoUGF0dGVybihtYXRjaFBhdHRlcm4sIGBJZiB1c2luZyBhIHdpbGRjYXJkICgqKSwgaXQgbXVzdCBnbyBhdCB0aGUgc3RhcnQgb2YgdGhlIGhvc3RuYW1lYCk7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IEludmFsaWRNYXRjaFBhdHRlcm4sIE1hdGNoUGF0dGVybiB9O1xuIl0sInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsOF0sIm1hcHBpbmdzIjoiOzs7OztDQUNBLFNBQVMsaUJBQWlCLEtBQUs7RUFDOUIsSUFBSSxPQUFPLFFBQVEsT0FBTyxRQUFRLFlBQVksT0FBTyxFQUFFLE1BQU0sSUFBSTtFQUNqRSxPQUFPO0NBQ1I7Ozs7Ozs7Ozs7Ozs7Ozs7O0NFWUEsSUFBTUMsWURmaUIsV0FBVyxTQUFTLFNBQVMsS0FDaEQsV0FBVyxVQUNYLFdBQVc7Ozs7RUVEZixJQUFNLE9BQU4sTUFBVztHQUNULFlBQWEsTUFBTTtJQUNqQixLQUFLLE9BQU87R0FDZDtFQUNGO0VBRUEsSUFBTSxhQUFOLE1BQWlCO0dBQ2YsY0FBZTtJQUNiLEtBQUssU0FBUztHQUNoQjtHQUVBLFFBQVMsTUFBTTtJQUNiLE1BQU0sT0FBTyxJQUFJLEtBQUssSUFBSTtJQUMxQixLQUFLLE9BQU8sS0FBSztJQUNqQixJQUFJLEtBQUssTUFBTSxLQUFLLEtBQUssT0FBTztTQUMzQixLQUFLLE9BQU87SUFDakIsS0FBSyxPQUFPO0lBQ1osS0FBSztJQUNMLE9BQU87R0FDVDtHQUVBLFVBQVc7SUFDVCxJQUFJLENBQUMsS0FBSyxNQUFNO0lBQ2hCLE1BQU0sRUFBRSxTQUFTLEtBQUs7SUFDdEIsS0FBSyxPQUFPLEtBQUssSUFBSTtJQUNyQixPQUFPO0dBQ1Q7R0FFQSxPQUFRLE1BQU07SUFDWixJQUFJLEtBQUssTUFBTSxLQUFLLEtBQUssT0FBTyxLQUFLO1NBQ2hDLEtBQUssT0FBTyxLQUFLO0lBQ3RCLElBQUksS0FBSyxNQUFNLEtBQUssS0FBSyxPQUFPLEtBQUs7U0FDaEMsS0FBSyxPQUFPLEtBQUs7SUFDdEIsS0FBSztHQUNQO0dBRUEsT0FBUTtJQUNOLE9BQU8sS0FBSztHQUNkO0VBQ0Y7RUFFQSxPQUFPLFdBQVcsUUFBUSxNQUFNO0dBQzlCLE1BQU0sUUFBUSxJQUFJLFdBQVc7R0FFN0IsTUFBTSxnQkFBZ0I7SUFDcEIsRUFBRTtJQUNGLE1BQU0sU0FBUyxNQUFNLFFBQVE7SUFDN0IsSUFBSSxRQUFRLE9BQU8sT0FBTyxRQUFRO0dBQ3BDO0dBRUEsTUFBTSxXQUFVLFlBQVc7SUFDekIsRUFBRTtJQUNGLFFBQVEsT0FBTztHQUNqQjtHQUVBLE1BQU0sUUFBTyxXQUNYLElBQUksU0FBUSxZQUFXO0lBQ3JCLElBQUksVUFBVSxRQUFRLE9BQU8sT0FBTyxxQkFBcUIsWUFDdkQsTUFBTSxJQUFJLFVBQVUsc0NBQXNDO0lBRTVELElBQUksUUFBUSxTQUFTLE9BQU8sUUFBUSxJQUFJO0lBQ3hDLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxPQUFPLFFBQVEsT0FBTztJQUU1QyxNQUFNLFNBQVMsRUFBRSxlQUFlLFFBQVEsT0FBTyxFQUFFO0lBQ2pELE1BQU0sT0FBTyxNQUFNLFFBQVEsTUFBTTtJQUVqQyxJQUFJLFVBQVUsTUFBTTtLQUNsQixNQUFNLGdCQUFnQjtNQUNwQixNQUFNLE9BQU8sSUFBSTtNQUNqQixRQUFRLElBQUk7S0FDZDtLQUNBLE9BQU8sZ0JBQWdCO01BQ3JCLE9BQU8sb0JBQW9CLFNBQVMsT0FBTztNQUMzQyxRQUFRLE9BQU87S0FDakI7S0FDQSxPQUFPLGlCQUFpQixTQUFTLFNBQVMsRUFBRSxNQUFNLEtBQUssQ0FBQztJQUMxRDtHQUNGLENBQUM7R0FFSCxLQUFLLGlCQUFpQixVQUFVO0dBRWhDLEtBQUssaUJBQWlCLE1BQU0sS0FBSztHQUVqQyxPQUFPO0VBQ1Q7Ozs7O0VDcEZBLElBQU0sYUFBQSxlQUFBO0VBRU4sSUFBTSxZQUFXLFNBQVE7R0FDdkIsTUFBTSxPQUFPLFdBQVcsSUFBSTtHQUU1QixNQUFNLFdBQVcsT0FBTyxJQUFJLFdBQVc7SUFDckMsTUFBTSxVQUFVLE1BQU0sS0FBSyxNQUFNO0lBQ2pDLElBQUksQ0FBQyxTQUFTO0lBQ2QsSUFBSTtLQUNGLE9BQU8sTUFBTSxHQUFHO0lBQ2xCLFVBQVU7S0FDUixRQUFRO0lBQ1Y7R0FDRjtHQUVBLFNBQVMsV0FBVyxLQUFLO0dBQ3pCLFNBQVMsV0FBVyxLQUFLO0dBRXpCLE9BQU87RUFDVDtFQUVBLE9BQU8sVUFBVTtHQUFFO0dBQVU7RUFBVzs7Q0NyQnhDLElBQUksTUFBTSxPQUFPLFVBQVU7Q0FDM0IsU0FBUyxPQUFPLEtBQUssS0FBSztFQUN6QixJQUFJLE1BQU07RUFDVixJQUFJLFFBQVEsS0FBSyxPQUFPO0VBQ3hCLElBQUksT0FBTyxRQUFRLE9BQU8sSUFBSSxpQkFBaUIsSUFBSSxhQUFhO0dBQy9ELElBQUksU0FBUyxNQUFNLE9BQU8sSUFBSSxRQUFRLE1BQU0sSUFBSSxRQUFRO0dBQ3hELElBQUksU0FBUyxRQUFRLE9BQU8sSUFBSSxTQUFTLE1BQU0sSUFBSSxTQUFTO0dBQzVELElBQUksU0FBUyxPQUFPO0lBQ25CLEtBQUssTUFBTSxJQUFJLFlBQVksSUFBSSxRQUFRLE9BQU8sU0FBUyxPQUFPLElBQUksTUFBTSxJQUFJLElBQUk7SUFDaEYsT0FBTyxRQUFRO0dBQ2hCO0dBQ0EsSUFBSSxDQUFDLFFBQVEsT0FBTyxRQUFRLFVBQVU7SUFDckMsTUFBTTtJQUNOLEtBQUssUUFBUSxLQUFLO0tBQ2pCLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxLQUFLLEVBQUUsT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLElBQUksR0FBRyxPQUFPO0tBQ2pFLElBQUksRUFBRSxRQUFRLFFBQVEsQ0FBQyxPQUFPLElBQUksT0FBTyxJQUFJLEtBQUssR0FBRyxPQUFPO0lBQzdEO0lBQ0EsT0FBTyxPQUFPLEtBQUssR0FBRyxDQUFDLENBQUMsV0FBVztHQUNwQztFQUNEO0VBQ0EsT0FBTyxRQUFRLE9BQU8sUUFBUTtDQUMvQjs7Q0FJQSxJQUFJLGlCQUFpQixjQUFjLE1BQU07RUFDeEM7RUFDQTtFQUNBLFlBQVksS0FBSyxTQUFTLFNBQVM7R0FDbEMsTUFBTSxJQUFJLFFBQVEseUJBQXlCLElBQUksSUFBSSxPQUFPO0dBQzFELEtBQUssTUFBTTtHQUNYLEtBQUssVUFBVTtFQUNoQjtDQUNEO0NBR0EsSUFBTSxVQUFVO0NBQ2hCLElBQU0sVUFBVSxRQUFRLFdBQVcsUUFBUSxVQUFVLENBQUM7Ozs7Ozs7Q0FTdEQsSUFBTSxVQUFVLGNBQWM7Q0FDOUIsU0FBUyxnQkFBZ0I7RUFDeEIsTUFBTSxVQUFVO0dBQ2YsT0FBTyxhQUFhLE9BQU87R0FDM0IsU0FBUyxhQUFhLFNBQVM7R0FDL0IsTUFBTSxhQUFhLE1BQU07R0FDekIsU0FBUyxhQUFhLFNBQVM7RUFDaEM7RUFDQSxNQUFNLGFBQWEsU0FBUztHQUMzQixNQUFNLFNBQVMsUUFBUTtHQUN2QixJQUFJLFVBQVUsTUFBTTtJQUNuQixNQUFNLFlBQVksT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSTtJQUNoRCxNQUFNLE1BQU0saUJBQWlCLEtBQUssY0FBYyxXQUFXO0dBQzVEO0dBQ0EsT0FBTztFQUNSO0VBQ0EsTUFBTSxjQUFjLFFBQVE7R0FDM0IsTUFBTSxtQkFBbUIsSUFBSSxRQUFRLEdBQUc7R0FDeEMsTUFBTSxhQUFhLElBQUksVUFBVSxHQUFHLGdCQUFnQjtHQUNwRCxNQUFNLFlBQVksSUFBSSxVQUFVLG1CQUFtQixDQUFDO0dBQ3BELElBQUksYUFBYSxNQUFNLE1BQU0sTUFBTSxrRUFBa0UsSUFBSSxFQUFFO0dBQzNHLE9BQU87SUFDTjtJQUNBO0lBQ0EsUUFBUSxVQUFVLFVBQVU7R0FDN0I7RUFDRDtFQUNBLE1BQU0sY0FBYyxRQUFRLEdBQUcsSUFBSTtFQUNuQyxNQUFNLGFBQWEsU0FBUyxZQUFZO0dBQ3ZDLE1BQU0sWUFBWSxFQUFFLEdBQUcsUUFBUTtHQUMvQixPQUFPLFFBQVEsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssV0FBVztJQUNqRCxJQUFJLFNBQVMsTUFBTSxPQUFPLFVBQVU7U0FDL0IsVUFBVSxPQUFPO0dBQ3ZCLENBQUM7R0FDRCxPQUFPO0VBQ1I7RUFDQSxNQUFNLHNCQUFzQixPQUFPLGFBQWEsU0FBUyxZQUFZO0VBQ3JFLE1BQU0sZ0JBQWdCLGVBQWUsT0FBTyxlQUFlLFlBQVksQ0FBQyxNQUFNLFFBQVEsVUFBVSxJQUFJLGFBQWEsQ0FBQztFQUNsSCxNQUFNLFVBQVUsT0FBTyxRQUFRLFdBQVcsU0FBUztHQUNsRCxNQUFNLE1BQU0sTUFBTSxPQUFPLFFBQVEsU0FBUztHQUMxQyxPQUFPLG1CQUFtQixLQUFLLE1BQU0sUUFBUTtFQUM5QztFQUNBLE1BQU0sVUFBVSxPQUFPLFFBQVEsY0FBYztHQUM1QyxNQUFNLFVBQVUsV0FBVyxTQUFTO0dBQ3BDLE1BQU0sTUFBTSxNQUFNLE9BQU8sUUFBUSxPQUFPO0dBQ3hDLE9BQU8sYUFBYSxHQUFHO0VBQ3hCO0VBQ0EsTUFBTSxVQUFVLE9BQU8sUUFBUSxXQUFXLFVBQVU7R0FDbkQsTUFBTSxPQUFPLFFBQVEsV0FBVyxTQUFTLElBQUk7RUFDOUM7RUFDQSxNQUFNLFVBQVUsT0FBTyxRQUFRLFdBQVcsZUFBZTtHQUN4RCxNQUFNLFVBQVUsV0FBVyxTQUFTO0dBQ3BDLE1BQU0saUJBQWlCLGFBQWEsTUFBTSxPQUFPLFFBQVEsT0FBTyxDQUFDO0dBQ2pFLE1BQU0sT0FBTyxRQUFRLFNBQVMsVUFBVSxnQkFBZ0IsVUFBVSxDQUFDO0VBQ3BFO0VBQ0EsTUFBTSxhQUFhLE9BQU8sUUFBUSxXQUFXLFNBQVM7R0FDckQsTUFBTSxPQUFPLFdBQVcsU0FBUztHQUNqQyxJQUFJLE1BQU0sWUFBWTtJQUNyQixNQUFNLFVBQVUsV0FBVyxTQUFTO0lBQ3BDLE1BQU0sT0FBTyxXQUFXLE9BQU87R0FDaEM7RUFDRDtFQUNBLE1BQU0sYUFBYSxPQUFPLFFBQVEsV0FBVyxlQUFlO0dBQzNELE1BQU0sVUFBVSxXQUFXLFNBQVM7R0FDcEMsSUFBSSxjQUFjLE1BQU0sTUFBTSxPQUFPLFdBQVcsT0FBTztRQUNsRDtJQUNKLE1BQU0sWUFBWSxhQUFhLE1BQU0sT0FBTyxRQUFRLE9BQU8sQ0FBQztJQUM1RCxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsVUFBVTtLQUN0QyxPQUFPLFVBQVU7SUFDbEIsQ0FBQztJQUNELE1BQU0sT0FBTyxRQUFRLFNBQVMsU0FBUztHQUN4QztFQUNEO0VBQ0EsTUFBTSxTQUFTLFFBQVEsV0FBVyxPQUFPLE9BQU8sTUFBTSxXQUFXLEVBQUU7RUFDbkUsT0FBTztHQUNOLFNBQVMsT0FBTyxLQUFLLFNBQVM7SUFDN0IsTUFBTSxFQUFFLFFBQVEsY0FBYyxXQUFXLEdBQUc7SUFDNUMsT0FBTyxNQUFNLFFBQVEsUUFBUSxXQUFXLElBQUk7R0FDN0M7R0FDQSxVQUFVLE9BQU8sU0FBUztJQUN6QixNQUFNLCtCQUErQixJQUFJLElBQUk7SUFDN0MsTUFBTSwrQkFBK0IsSUFBSSxJQUFJO0lBQzdDLE1BQU0sY0FBYyxDQUFDO0lBQ3JCLEtBQUssU0FBUyxRQUFRO0tBQ3JCLElBQUk7S0FDSixJQUFJO0tBQ0osSUFBSSxPQUFPLFFBQVEsVUFBVSxTQUFTO1VBQ2pDLElBQUksY0FBYyxLQUFLO01BQzNCLFNBQVMsSUFBSTtNQUNiLE9BQU8sRUFBRSxVQUFVLElBQUksU0FBUztLQUNqQyxPQUFPLElBQUksVUFBVSxLQUFLO01BQ3pCLFNBQVMsSUFBSSxLQUFLO01BQ2xCLE9BQU8sRUFBRSxVQUFVLElBQUksS0FBSyxTQUFTO0tBQ3RDLE9BQU87TUFDTixTQUFTLElBQUk7TUFDYixPQUFPLElBQUk7S0FDWjtLQUNBLFlBQVksS0FBSyxNQUFNO0tBQ3ZCLE1BQU0sRUFBRSxZQUFZLGNBQWMsV0FBVyxNQUFNO0tBQ25ELE1BQU0sV0FBVyxhQUFhLElBQUksVUFBVSxLQUFLLENBQUM7S0FDbEQsYUFBYSxJQUFJLFlBQVksU0FBUyxPQUFPLFNBQVMsQ0FBQztLQUN2RCxhQUFhLElBQUksUUFBUSxJQUFJO0lBQzlCLENBQUM7SUFDRCxNQUFNLDZCQUE2QixJQUFJLElBQUk7SUFDM0MsTUFBTSxRQUFRLElBQUksTUFBTSxLQUFLLGFBQWEsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLFVBQVU7S0FDdEYsQ0FBQyxNQUFNLFFBQVEsV0FBVyxDQUFDLFNBQVMsSUFBSSxFQUFBLENBQUcsU0FBUyxpQkFBaUI7TUFDcEUsTUFBTSxNQUFNLEdBQUcsV0FBVyxHQUFHLGFBQWE7TUFDMUMsTUFBTSxPQUFPLGFBQWEsSUFBSSxHQUFHO01BQ2pDLE1BQU0sUUFBUSxtQkFBbUIsYUFBYSxPQUFPLE1BQU0sWUFBWSxNQUFNLFFBQVE7TUFDckYsV0FBVyxJQUFJLEtBQUssS0FBSztLQUMxQixDQUFDO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxZQUFZLEtBQUssU0FBUztLQUNoQztLQUNBLE9BQU8sV0FBVyxJQUFJLEdBQUc7SUFDMUIsRUFBRTtHQUNIO0dBQ0EsU0FBUyxPQUFPLFFBQVE7SUFDdkIsTUFBTSxFQUFFLFFBQVEsY0FBYyxXQUFXLEdBQUc7SUFDNUMsT0FBTyxNQUFNLFFBQVEsUUFBUSxTQUFTO0dBQ3ZDO0dBQ0EsVUFBVSxPQUFPLFNBQVM7SUFDekIsTUFBTSxPQUFPLEtBQUssS0FBSyxRQUFRO0tBQzlCLE1BQU0sTUFBTSxPQUFPLFFBQVEsV0FBVyxNQUFNLElBQUk7S0FDaEQsTUFBTSxFQUFFLFlBQVksY0FBYyxXQUFXLEdBQUc7S0FDaEQsT0FBTztNQUNOO01BQ0E7TUFDQTtNQUNBLGVBQWUsV0FBVyxTQUFTO0tBQ3BDO0lBQ0QsQ0FBQztJQUNELE1BQU0sMEJBQTBCLEtBQUssUUFBUSxLQUFLLFFBQVE7S0FDekQsSUFBSSxJQUFJLGdCQUFnQixDQUFDO0tBQ3pCLElBQUksSUFBSSxXQUFXLEVBQUUsS0FBSyxHQUFHO0tBQzdCLE9BQU87SUFDUixHQUFHLENBQUMsQ0FBQztJQUNMLE1BQU0sYUFBYSxDQUFDO0lBQ3BCLE1BQU0sVUFBVSxRQUFRO0lBQ3hCLElBQUksQ0FBQyxTQUFTLE1BQU0sSUFBSSxNQUFNLG9DQUFvQztJQUNsRSxNQUFNLFFBQVEsSUFBSSxPQUFPLFFBQVEsdUJBQXVCLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLFVBQVU7S0FDckYsTUFBTSxVQUFVLE1BQU0sUUFBUSxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssUUFBUSxJQUFJLGFBQWEsQ0FBQztLQUM1RSxLQUFLLFNBQVMsUUFBUTtNQUNyQixXQUFXLElBQUksT0FBTyxRQUFRLElBQUksa0JBQWtCLENBQUM7S0FDdEQsQ0FBQztJQUNGLENBQUMsQ0FBQztJQUNGLE9BQU8sS0FBSyxLQUFLLFNBQVM7S0FDekIsS0FBSyxJQUFJO0tBQ1QsTUFBTSxXQUFXLElBQUk7SUFDdEIsRUFBRTtHQUNIO0dBQ0EsU0FBUyxPQUFPLEtBQUssVUFBVTtJQUM5QixNQUFNLEVBQUUsUUFBUSxjQUFjLFdBQVcsR0FBRztJQUM1QyxNQUFNLFFBQVEsUUFBUSxXQUFXLEtBQUs7R0FDdkM7R0FDQSxVQUFVLE9BQU8sVUFBVTtJQUMxQixNQUFNLG9CQUFvQixDQUFDO0lBQzNCLE1BQU0sU0FBUyxTQUFTO0tBQ3ZCLE1BQU0sRUFBRSxZQUFZLGNBQWMsV0FBVyxTQUFTLE9BQU8sS0FBSyxNQUFNLEtBQUssS0FBSyxHQUFHO0tBQ3JGLGtCQUFrQixnQkFBZ0IsQ0FBQztLQUNuQyxrQkFBa0IsV0FBVyxDQUFDLEtBQUs7TUFDbEMsS0FBSztNQUNMLE9BQU8sS0FBSztLQUNiLENBQUM7SUFDRixDQUFDO0lBQ0QsTUFBTSxRQUFRLElBQUksT0FBTyxRQUFRLGlCQUFpQixDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsWUFBWSxZQUFZO0tBQ3ZGLE1BQU0sVUFBVSxVQUFVLENBQUMsQ0FBQyxTQUFTLE1BQU07SUFDNUMsQ0FBQyxDQUFDO0dBQ0g7R0FDQSxTQUFTLE9BQU8sS0FBSyxlQUFlO0lBQ25DLE1BQU0sRUFBRSxRQUFRLGNBQWMsV0FBVyxHQUFHO0lBQzVDLE1BQU0sUUFBUSxRQUFRLFdBQVcsVUFBVTtHQUM1QztHQUNBLFVBQVUsT0FBTyxVQUFVO0lBQzFCLE1BQU0sdUJBQXVCLENBQUM7SUFDOUIsTUFBTSxTQUFTLFNBQVM7S0FDdkIsTUFBTSxFQUFFLFlBQVksY0FBYyxXQUFXLFNBQVMsT0FBTyxLQUFLLE1BQU0sS0FBSyxLQUFLLEdBQUc7S0FDckYscUJBQXFCLGdCQUFnQixDQUFDO0tBQ3RDLHFCQUFxQixXQUFXLENBQUMsS0FBSztNQUNyQyxLQUFLO01BQ0wsWUFBWSxLQUFLO0tBQ2xCLENBQUM7SUFDRixDQUFDO0lBQ0QsTUFBTSxRQUFRLElBQUksT0FBTyxRQUFRLG9CQUFvQixDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsYUFBYSxhQUFhO0tBQzVGLE1BQU0sU0FBUyxVQUFVLFdBQVc7S0FDcEMsTUFBTSxXQUFXLFFBQVEsS0FBSyxFQUFFLFVBQVUsV0FBVyxHQUFHLENBQUM7S0FDekQsTUFBTSxnQkFBZ0IsTUFBTSxPQUFPLFNBQVMsUUFBUTtLQUNwRCxNQUFNLGtCQUFrQixPQUFPLFlBQVksY0FBYyxLQUFLLEVBQUUsS0FBSyxZQUFZLENBQUMsS0FBSyxhQUFhLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDNUcsTUFBTSxjQUFjLFFBQVEsS0FBSyxFQUFFLEtBQUssaUJBQWlCO01BQ3hELE1BQU0sVUFBVSxXQUFXLEdBQUc7TUFDOUIsT0FBTztPQUNOLEtBQUs7T0FDTCxPQUFPLFVBQVUsZ0JBQWdCLFlBQVksQ0FBQyxHQUFHLFVBQVU7TUFDNUQ7S0FDRCxDQUFDO0tBQ0QsTUFBTSxPQUFPLFNBQVMsV0FBVztJQUNsQyxDQUFDLENBQUM7R0FDSDtHQUNBLFlBQVksT0FBTyxLQUFLLFNBQVM7SUFDaEMsTUFBTSxFQUFFLFFBQVEsY0FBYyxXQUFXLEdBQUc7SUFDNUMsTUFBTSxXQUFXLFFBQVEsV0FBVyxJQUFJO0dBQ3pDO0dBQ0EsYUFBYSxPQUFPLFNBQVM7SUFDNUIsTUFBTSxnQkFBZ0IsQ0FBQztJQUN2QixLQUFLLFNBQVMsUUFBUTtLQUNyQixJQUFJO0tBQ0osSUFBSTtLQUNKLElBQUksT0FBTyxRQUFRLFVBQVUsU0FBUztVQUNqQyxJQUFJLGNBQWMsS0FBSyxTQUFTLElBQUk7VUFDcEMsSUFBSSxVQUFVLEtBQUs7TUFDdkIsU0FBUyxJQUFJLEtBQUs7TUFDbEIsT0FBTyxJQUFJO0tBQ1osT0FBTztNQUNOLFNBQVMsSUFBSTtNQUNiLE9BQU8sSUFBSTtLQUNaO0tBQ0EsTUFBTSxFQUFFLFlBQVksY0FBYyxXQUFXLE1BQU07S0FDbkQsY0FBYyxnQkFBZ0IsQ0FBQztLQUMvQixjQUFjLFdBQVcsQ0FBQyxLQUFLLFNBQVM7S0FDeEMsSUFBSSxNQUFNLFlBQVksY0FBYyxXQUFXLENBQUMsS0FBSyxXQUFXLFNBQVMsQ0FBQztJQUMzRSxDQUFDO0lBQ0QsTUFBTSxRQUFRLElBQUksT0FBTyxRQUFRLGFBQWEsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksVUFBVTtLQUNqRixNQUFNLFVBQVUsVUFBVSxDQUFDLENBQUMsWUFBWSxJQUFJO0lBQzdDLENBQUMsQ0FBQztHQUNIO0dBQ0EsT0FBTyxPQUFPLFNBQVM7SUFDdEIsTUFBTSxVQUFVLElBQUksQ0FBQyxDQUFDLE1BQU07R0FDN0I7R0FDQSxZQUFZLE9BQU8sS0FBSyxlQUFlO0lBQ3RDLE1BQU0sRUFBRSxRQUFRLGNBQWMsV0FBVyxHQUFHO0lBQzVDLE1BQU0sV0FBVyxRQUFRLFdBQVcsVUFBVTtHQUMvQztHQUNBLFVBQVUsT0FBTyxNQUFNLFNBQVM7SUFDL0IsTUFBTSxPQUFPLE1BQU0sVUFBVSxJQUFJLENBQUMsQ0FBQyxTQUFTO0lBQzVDLE1BQU0sYUFBYSxTQUFTLFFBQVE7S0FDbkMsT0FBTyxLQUFLO0tBQ1osT0FBTyxLQUFLLFdBQVcsR0FBRztJQUMzQixDQUFDO0lBQ0QsT0FBTztHQUNSO0dBQ0EsaUJBQWlCLE9BQU8sTUFBTSxTQUFTO0lBQ3RDLE1BQU0sVUFBVSxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSTtHQUMzQztHQUNBLFFBQVEsS0FBSyxPQUFPO0lBQ25CLE1BQU0sRUFBRSxRQUFRLGNBQWMsV0FBVyxHQUFHO0lBQzVDLE9BQU8sTUFBTSxRQUFRLFdBQVcsRUFBRTtHQUNuQztHQUNBLFVBQVU7SUFDVCxPQUFPLE9BQU8sT0FBTyxDQUFDLENBQUMsU0FBUyxXQUFXO0tBQzFDLE9BQU8sUUFBUTtJQUNoQixDQUFDO0dBQ0Y7R0FDQSxhQUFhLEtBQUssU0FBUztJQUMxQixNQUFNLEVBQUUsUUFBUSxjQUFjLFdBQVcsR0FBRztJQUM1QyxNQUFNLEVBQUUsU0FBUyxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsR0FBRyxxQkFBcUIsUUFBUSxVQUFVLFFBQVEsQ0FBQztJQUNyRyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sTUFBTSx5RkFBeUY7SUFDNUgsSUFBSSxrQkFBa0I7SUFDdEIsTUFBTSxVQUFVLFlBQVk7S0FDM0IsTUFBTSxnQkFBZ0IsV0FBVyxTQUFTO0tBQzFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLFVBQVUsTUFBTSxPQUFPLFNBQVMsQ0FBQyxXQUFXLGFBQWEsQ0FBQztLQUNyRixrQkFBa0IsU0FBUyxRQUFRLE1BQU0sS0FBSyxRQUFRLENBQUMsQ0FBQztLQUN4RCxJQUFJLFNBQVMsTUFBTTtLQUNuQixNQUFNLGlCQUFpQixNQUFNLEtBQUs7S0FDbEMsSUFBSSxpQkFBaUIsZUFBZSxNQUFNLE1BQU0sZ0NBQWdDLGVBQWUsT0FBTyxjQUFjLFNBQVMsSUFBSSxFQUFFO0tBQ25JLElBQUksbUJBQW1CLGVBQWU7S0FDdEMsSUFBSSxPQUFPLFFBQVEsTUFBTSxnREFBZ0QsSUFBSSxLQUFLLGVBQWUsT0FBTyxlQUFlO0tBQ3ZILE1BQU0sa0JBQWtCLE1BQU0sS0FBSyxFQUFFLFFBQVEsZ0JBQWdCLGVBQWUsSUFBSSxHQUFHLE1BQU0saUJBQWlCLElBQUksQ0FBQztLQUMvRyxJQUFJLGdCQUFnQjtLQUNwQixLQUFLLE1BQU0sb0JBQW9CLGlCQUFpQixJQUFJO01BQ25ELGdCQUFnQixNQUFNLGFBQWEsaUJBQWlCLEdBQUcsYUFBYSxLQUFLO01BQ3pFLElBQUksT0FBTyxRQUFRLE1BQU0sNERBQTRELGtCQUFrQjtLQUN4RyxTQUFTLEtBQUs7TUFDYixNQUFNLElBQUksZUFBZSxLQUFLLGtCQUFrQixFQUFFLE9BQU8sSUFBSSxDQUFDO0tBQy9EO0tBQ0EsTUFBTSxPQUFPLFNBQVMsQ0FBQztNQUN0QixLQUFLO01BQ0wsT0FBTztLQUNSLEdBQUc7TUFDRixLQUFLO01BQ0wsT0FBTztPQUNOLEdBQUc7T0FDSCxHQUFHO01BQ0o7S0FDRCxDQUFDLENBQUM7S0FDRixJQUFJLE9BQU8sUUFBUSxNQUFNLGtEQUFrRCxJQUFJLElBQUksaUJBQWlCLEVBQUUsY0FBYyxDQUFDO0tBQ3JILHNCQUFzQixlQUFlLGFBQWE7SUFDbkQ7SUFDQSxNQUFNLGlCQUFpQixNQUFNLGNBQWMsT0FBTyxRQUFRLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQyxPQUFPLFFBQVE7S0FDOUYsUUFBUSxNQUFNLHVDQUF1QyxPQUFPLEdBQUc7SUFDaEUsQ0FBQztJQUNELE1BQU0sWUFBQSxHQUFXRSxXQUFBQSxTQUFBQSxDQUFTO0lBQzFCLE1BQU0sb0JBQW9CLE1BQU0sWUFBWSxNQUFNLGdCQUFnQjtJQUNsRSxNQUFNLHVCQUF1QixTQUFTLFlBQVk7S0FDakQsTUFBTSxRQUFRLE1BQU0sT0FBTyxRQUFRLFNBQVM7S0FDNUMsSUFBSSxTQUFTLFFBQVEsTUFBTSxRQUFRLE1BQU0sT0FBTztLQUNoRCxNQUFNLFdBQVcsTUFBTSxLQUFLLEtBQUs7S0FDakMsTUFBTSxPQUFPLFFBQVEsV0FBVyxRQUFRO0tBQ3hDLElBQUksU0FBUyxRQUFRLGdCQUFnQixHQUFHLE1BQU0sUUFBUSxRQUFRLFdBQVcsRUFBRSxHQUFHLGNBQWMsQ0FBQztLQUM3RixPQUFPO0lBQ1IsQ0FBQztJQUNELGVBQWUsS0FBSyxjQUFjO0lBQ2xDLE9BQU87S0FDTjtLQUNBLElBQUksZUFBZTtNQUNsQixPQUFPLFlBQVk7S0FDcEI7S0FDQSxJQUFJLFdBQVc7TUFDZCxPQUFPLFlBQVk7S0FDcEI7S0FDQSxVQUFVLFlBQVk7TUFDckIsTUFBTTtNQUNOLElBQUksTUFBTSxNQUFNLE9BQU8sTUFBTSxlQUFlO1dBQ3ZDLE9BQU8sTUFBTSxRQUFRLFFBQVEsV0FBVyxJQUFJO0tBQ2xEO0tBQ0EsU0FBUyxZQUFZO01BQ3BCLE1BQU07TUFDTixPQUFPLE1BQU0sUUFBUSxRQUFRLFNBQVM7S0FDdkM7S0FDQSxVQUFVLE9BQU8sVUFBVTtNQUMxQixNQUFNO01BQ04sSUFBSSxpQkFBaUI7T0FDcEIsa0JBQWtCO09BQ2xCLE1BQU0sUUFBUSxJQUFJLENBQUMsUUFBUSxRQUFRLFdBQVcsS0FBSyxHQUFHLFFBQVEsUUFBUSxXQUFXLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDO01BQ3hHLE9BQU8sTUFBTSxRQUFRLFFBQVEsV0FBVyxLQUFLO0tBQzlDO0tBQ0EsU0FBUyxPQUFPLGVBQWU7TUFDOUIsTUFBTTtNQUNOLE9BQU8sTUFBTSxRQUFRLFFBQVEsV0FBVyxVQUFVO0tBQ25EO0tBQ0EsYUFBYSxPQUFPLFNBQVM7TUFDNUIsTUFBTTtNQUNOLE9BQU8sTUFBTSxXQUFXLFFBQVEsV0FBVyxJQUFJO0tBQ2hEO0tBQ0EsWUFBWSxPQUFPLGVBQWU7TUFDakMsTUFBTTtNQUNOLE9BQU8sTUFBTSxXQUFXLFFBQVEsV0FBVyxVQUFVO0tBQ3REO0tBQ0EsUUFBUSxPQUFPLE1BQU0sUUFBUSxZQUFZLFVBQVUsYUFBYSxHQUFHLFlBQVksWUFBWSxHQUFHLFlBQVksWUFBWSxDQUFDLENBQUM7S0FDeEg7SUFDRDtHQUNEO0VBQ0Q7Q0FDRDtDQUNBLFNBQVMsYUFBYSxhQUFhO0VBQ2xDLE1BQU0sdUJBQXVCO0dBQzVCLElBQUksUUFBUSxXQUFXLE1BQU0sTUFBTSxNQUFNLCtEQUErRDtHQUN4RyxJQUFJLFFBQVEsV0FBVyxNQUFNLE1BQU0sTUFBTSw4RUFBOEU7R0FDdkgsTUFBTSxPQUFPLFFBQVEsUUFBUTtHQUM3QixJQUFJLFFBQVEsTUFBTSxNQUFNLE1BQU0sb0JBQW9CLFlBQVksZUFBZTtHQUM3RSxPQUFPO0VBQ1I7RUFDQSxNQUFNLGlDQUFpQyxJQUFJLElBQUk7RUFDL0MsT0FBTztHQUNOLFNBQVMsT0FBTyxRQUFRO0lBQ3ZCLFFBQVEsTUFBTSxlQUFlLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBQSxDQUFHO0dBQzFDO0dBQ0EsVUFBVSxPQUFPLFNBQVM7SUFDekIsTUFBTSxTQUFTLE1BQU0sZUFBZSxDQUFDLENBQUMsSUFBSSxJQUFJO0lBQzlDLE9BQU8sS0FBSyxLQUFLLFNBQVM7S0FDekI7S0FDQSxPQUFPLE9BQU8sUUFBUTtJQUN2QixFQUFFO0dBQ0g7R0FDQSxTQUFTLE9BQU8sS0FBSyxVQUFVO0lBQzlCLElBQUksU0FBUyxNQUFNLE1BQU0sZUFBZSxDQUFDLENBQUMsT0FBTyxHQUFHO1NBQy9DLE1BQU0sZUFBZSxDQUFDLENBQUMsSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDO0dBQ2pEO0dBQ0EsVUFBVSxPQUFPLFdBQVc7SUFDM0IsTUFBTSxNQUFNLE9BQU8sUUFBUSxLQUFLLEVBQUUsS0FBSyxZQUFZO0tBQ2xELElBQUksT0FBTztLQUNYLE9BQU87SUFDUixHQUFHLENBQUMsQ0FBQztJQUNMLE1BQU0sZUFBZSxDQUFDLENBQUMsSUFBSSxHQUFHO0dBQy9CO0dBQ0EsWUFBWSxPQUFPLFFBQVE7SUFDMUIsTUFBTSxlQUFlLENBQUMsQ0FBQyxPQUFPLEdBQUc7R0FDbEM7R0FDQSxhQUFhLE9BQU8sU0FBUztJQUM1QixNQUFNLGVBQWUsQ0FBQyxDQUFDLE9BQU8sSUFBSTtHQUNuQztHQUNBLE9BQU8sWUFBWTtJQUNsQixNQUFNLGVBQWUsQ0FBQyxDQUFDLE1BQU07R0FDOUI7R0FDQSxVQUFVLFlBQVk7SUFDckIsT0FBTyxNQUFNLGVBQWUsQ0FBQyxDQUFDLElBQUk7R0FDbkM7R0FDQSxpQkFBaUIsT0FBTyxTQUFTO0lBQ2hDLE1BQU0sZUFBZSxDQUFDLENBQUMsSUFBSSxJQUFJO0dBQ2hDO0dBQ0EsTUFBTSxLQUFLLElBQUk7SUFDZCxNQUFNLFlBQVksWUFBWTtLQUM3QixNQUFNLFNBQVMsUUFBUTtLQUN2QixJQUFJLFVBQVUsUUFBUSxPQUFPLE9BQU8sVUFBVSxPQUFPLFFBQVEsR0FBRztLQUNoRSxHQUFHLE9BQU8sWUFBWSxNQUFNLE9BQU8sWUFBWSxJQUFJO0lBQ3BEO0lBQ0EsZUFBZSxDQUFDLENBQUMsVUFBVSxZQUFZLFFBQVE7SUFDL0MsZUFBZSxJQUFJLFFBQVE7SUFDM0IsYUFBYTtLQUNaLGVBQWUsQ0FBQyxDQUFDLFVBQVUsZUFBZSxRQUFRO0tBQ2xELGVBQWUsT0FBTyxRQUFRO0lBQy9CO0dBQ0Q7R0FDQSxVQUFVO0lBQ1QsZUFBZSxTQUFTLGFBQWE7S0FDcEMsZUFBZSxDQUFDLENBQUMsVUFBVSxlQUFlLFFBQVE7SUFDbkQsQ0FBQztJQUNELGVBQWUsTUFBTTtHQUN0QjtFQUNEO0NBQ0Q7Ozs7Ozs7O0NDN2JBLElBQWEsZUFBZSxRQUFRLFdBQXFCLGlCQUFpQjtFQUN4RSxVQUFVO0dBQUUsT0FBTztHQUFTLGFBQWE7RUFBUTtFQUNqRCxTQUFTO0VBQ1QsWUFBWTtHQUVWLElBQUksU0FBYztJQUFFLEdBQUc7SUFBSyxPQUFPLEtBQUssU0FBUztHQUFRO0dBRXpELElBQUksU0FBYztJQUFFLEdBQUc7SUFBSyxhQUFhLEtBQUssZUFBZTtHQUFRO0VBQ3ZFO0VBQ0EsT0FBTztFQUNQLHNCQUFzQixPQUFPLGtCQUFrQjtHQUM3QyxRQUFRLElBQUksNkNBQTZDLGlCQUFpQixLQUFLO0VBQ2pGO0NBQ0YsQ0FBQzs7Ozs7O0NBT0QsSUFBYSxnQkFBZ0IsUUFBUSxXQUFtQixtQkFBbUIsRUFDekUsWUFBWSxPQUFPLFdBQVcsRUFDaEMsQ0FBQzs7Ozs7OztDQVFELElBQWEsZ0JBQWdCLFFBQVEsV0FBbUIsbUJBQW1CLEVBQ3pFLFVBQVUsRUFDWixDQUFDO0NBZ0I2QixRQUFRLFdBQXVCLG9CQUFvQixFQUMvRSxVQUFVO0VBQUUsT0FBTztFQUFRLE1BQU07Q0FBSyxFQUN4QyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQ3BDRCxJQUFBLHFCQUFBLHVCQUFBO0VBQ0UsUUFBQSxJQUFBLHdDQUFBO0VBS0EsVUFBQSxRQUFBLFlBQUEsYUFBQSxFQUFBLGFBQUE7R0FDRSxJQUFBLFdBQUEsV0FDRSxRQUFBLElBQUEsbUNBQUE7UUFDRixJQUFBLFdBQUEsVUFDRSxRQUFBLElBQUEsMERBQUE7R0FFRixhQUFBLFFBQUE7RUFDRixDQUFBO0VBTUEsYUFBQSxRQUFBO0VBS0EsY0FBQSxTQUFBLENBQUEsQ0FBQSxNQUFBLE9BQUE7R0FDRSxRQUFBLElBQUEsbUNBQUEsRUFBQTtFQUNGLENBQUE7RUFPQSxNQUFBLG1CQUFBLGNBQUEsT0FBQSxVQUFBLGFBQUE7R0FDRSxRQUFBLElBQUEsa0NBQUEsU0FBQSxNQUFBLFVBQUE7RUFDRixDQUFBO0VBT0EsVUFBQSxPQUFBLE9BQUEsYUFBQSxFQUFBLGlCQUFBLElBQUEsQ0FBQTtFQUNBLFVBQUEsT0FBQSxRQUFBLFlBQUEsT0FBQSxVQUFBO0dBQ0UsSUFBQSxNQUFBLFNBQUEsYUFBQTtHQUNBLE1BQUEsVUFBQSxNQUFBLGNBQUEsU0FBQTtHQUNBLE1BQUEsY0FBQSxTQUFBLFVBQUEsQ0FBQTtFQUNGLENBQUE7RUFNQSxVQUFBLFFBQUEsVUFBQSxhQUFBLFlBQUE7R0FDRSxJQUFBLFNBQUEsU0FBQSxrQkFDRSxPQUFBLGNBQUEsU0FBQSxDQUFBLENBQUEsTUFBQSxZQUFBLGNBQUEsU0FBQSxVQUFBLENBQUEsQ0FBQTtFQUVKLENBQUE7RUFLQSxLQUFBLGlCQUFBLHNCQUFBO0dBQ0UsaUJBQUE7R0FDQSxRQUFBLFFBQUE7RUFDRixDQUFBO0NBQ0YsQ0FBQTs7Ozs7Ozs7Ozs7O0NDbEZBLElBQUksZUFBZSxNQUFNLGFBQWE7RUFDckM7R0FDQyxLQUFLLFlBQVk7SUFDaEI7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7R0FDRDtFQUNEOzs7Ozs7O0VBT0EsWUFBWSxjQUFjO0dBQ3pCLElBQUksaUJBQWlCLGNBQWM7SUFDbEMsS0FBSyxZQUFZO0lBQ2pCLEtBQUssa0JBQWtCLENBQUMsR0FBRyxhQUFhLFNBQVM7SUFDakQsS0FBSyxnQkFBZ0I7SUFDckIsS0FBSyxnQkFBZ0I7R0FDdEIsT0FBTztJQUNOLE1BQU0sU0FBUyx1QkFBdUIsS0FBSyxZQUFZO0lBQ3ZELElBQUksVUFBVSxNQUFNLE1BQU0sSUFBSSxvQkFBb0IsY0FBYyxrQkFBa0I7SUFDbEYsTUFBTSxDQUFDLEdBQUcsVUFBVSxVQUFVLFlBQVk7SUFDMUMsaUJBQWlCLGNBQWMsUUFBUTtJQUN2QyxpQkFBaUIsY0FBYyxRQUFRO0lBQ3ZDLEtBQUssa0JBQWtCLGFBQWEsTUFBTSxDQUFDLFFBQVEsT0FBTyxJQUFJLENBQUMsUUFBUTtJQUN2RSxLQUFLLGdCQUFnQjtJQUNyQixLQUFLLGdCQUFnQjtHQUN0QjtFQUNEOztFQUVBLFNBQVMsS0FBSztHQUNiLE1BQU0sSUFBSSxPQUFPLFFBQVEsV0FBVyxJQUFJLElBQUksR0FBRyxJQUFJLGVBQWUsV0FBVyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUk7R0FDakcsSUFBSSxLQUFLLFdBQVcsT0FBTyxDQUFDLEtBQUssa0JBQWtCLENBQUM7R0FDcEQsT0FBTyxDQUFDLENBQUMsS0FBSyxnQkFBZ0IsTUFBTSxhQUFhO0lBQ2hELElBQUksYUFBYSxRQUFRLE9BQU8sS0FBSyxZQUFZLENBQUM7SUFDbEQsSUFBSSxhQUFhLFNBQVMsT0FBTyxLQUFLLGFBQWEsQ0FBQztJQUNwRCxJQUFJLGFBQWEsUUFBUSxPQUFPLEtBQUssWUFBWSxDQUFDO0lBQ2xELElBQUksYUFBYSxPQUFPLE9BQU8sS0FBSyxXQUFXLENBQUM7SUFDaEQsSUFBSSxhQUFhLE9BQU8sT0FBTyxLQUFLLFdBQVcsQ0FBQztHQUNqRCxDQUFDO0VBQ0Y7RUFDQSxZQUFZLEtBQUs7R0FDaEIsT0FBTyxJQUFJLGFBQWEsV0FBVyxLQUFLLGdCQUFnQixHQUFHO0VBQzVEO0VBQ0EsYUFBYSxLQUFLO0dBQ2pCLE9BQU8sSUFBSSxhQUFhLFlBQVksS0FBSyxnQkFBZ0IsR0FBRztFQUM3RDtFQUNBLGdCQUFnQixLQUFLO0dBQ3BCLElBQUksQ0FBQyxLQUFLLGlCQUFpQixDQUFDLEtBQUssZUFBZSxPQUFPO0dBQ3ZELE1BQU0sc0JBQXNCLENBQUMsS0FBSyxzQkFBc0IsS0FBSyxhQUFhLEdBQUcsS0FBSyxzQkFBc0IsS0FBSyxjQUFjLFFBQVEsU0FBUyxFQUFFLENBQUMsQ0FBQztHQUNoSixNQUFNLHFCQUFxQixLQUFLLHNCQUFzQixLQUFLLGFBQWE7R0FDeEUsT0FBTyxDQUFDLENBQUMsb0JBQW9CLE1BQU0sVUFBVSxNQUFNLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxtQkFBbUIsS0FBSyxJQUFJLFFBQVE7RUFDL0c7RUFDQSxrQkFBa0IsS0FBSztHQUN0QixPQUFPLENBQUMsS0FBSyxnQkFBZ0IsU0FBUyxJQUFJLFNBQVMsTUFBTSxHQUFHLEVBQUUsQ0FBQztFQUNoRTtFQUNBLFlBQVksS0FBSztHQUNoQixJQUFJLENBQUMsS0FBSyxlQUFlLE9BQU87R0FDaEMsT0FBTyxLQUFLLHNCQUFzQixLQUFLLGFBQWEsQ0FBQyxDQUFDLEtBQUssSUFBSSxRQUFRO0VBQ3hFO0VBQ0EsWUFBWSxLQUFLO0dBQ2hCLE9BQU8sSUFBSSxhQUFhLFdBQVcsS0FBSyxZQUFZLEdBQUc7RUFDeEQ7RUFDQSxXQUFXLE1BQU07R0FDaEIsTUFBTSxNQUFNLG9FQUFvRTtFQUNqRjtFQUNBLFdBQVcsTUFBTTtHQUNoQixNQUFNLE1BQU0sb0VBQW9FO0VBQ2pGO0VBQ0Esc0JBQXNCLFNBQVM7R0FDOUIsTUFBTSxnQkFBZ0IsS0FBSyxlQUFlLE9BQU8sQ0FBQyxDQUFDLFFBQVEsU0FBUyxJQUFJO0dBQ3hFLE9BQU8sT0FBTyxJQUFJLGNBQWMsRUFBRTtFQUNuQztFQUNBLGVBQWUsUUFBUTtHQUN0QixPQUFPLE9BQU8sUUFBUSx1QkFBdUIsTUFBTTtFQUNwRDtDQUNEO0NBQ0EsSUFBSSxzQkFBc0IsY0FBYyxNQUFNO0VBQzdDLFlBQVksY0FBYyxRQUFRO0dBQ2pDLE1BQU0sMEJBQTBCLGFBQWEsS0FBSyxRQUFRO0VBQzNEO0NBQ0Q7Q0FDQSxTQUFTLGlCQUFpQixjQUFjLFVBQVU7RUFDakQsSUFBSSxDQUFDLGFBQWEsVUFBVSxTQUFTLFFBQVEsS0FBSyxhQUFhLEtBQUssTUFBTSxJQUFJLG9CQUFvQixjQUFjLEdBQUcsU0FBUyx5QkFBeUIsYUFBYSxVQUFVLEtBQUssSUFBSSxFQUFFLEVBQUU7Q0FDMUw7Q0FDQSxTQUFTLGlCQUFpQixjQUFjLFVBQVU7RUFDakQsSUFBSSxTQUFTLFNBQVMsR0FBRyxHQUFHLE1BQU0sSUFBSSxvQkFBb0IsY0FBYyxnQ0FBZ0M7RUFDeEcsSUFBSSxTQUFTLFNBQVMsR0FBRyxLQUFLLFNBQVMsU0FBUyxLQUFLLENBQUMsU0FBUyxXQUFXLElBQUksR0FBRyxNQUFNLElBQUksb0JBQW9CLGNBQWMsa0VBQWtFO0NBQ2hNIn0=