/**
 * Simplified, type-safe storage APIs for browser extensions, with support for
 * versioned fields, snapshots, metadata, and item definitions.
 *
 * @module webext-store
 */

import { dequal } from "dequal/lite";
import { withLock } from "superlock";

import { browser } from "./browser";
import {
	type GetItemOptions,
	MigrationError,
	type RemoveItemOptions,
	type StorageArea,
	type StorageAreaChanges,
	type StorageItemKey,
	type Store,
	type StoreDriver,
	type StoreItem,
	type StoreItemOptions,
	type WatchCallback,
} from "./types";

export const storage: Store = createStorage();

function createStorage(): Store {
	const drivers: Record<StorageArea, StoreDriver> = {
		local: createDriver("local"),
		session: createDriver("session"),
		sync: createDriver("sync"),
		managed: createDriver("managed"),
	};

	const getDriver = (area: StorageArea) => {
		const driver = drivers[area];
		if (driver == null) {
			const areaNames = Object.keys(drivers).join(", ");
			throw Error(`Invalid area "${area}". Options: ${areaNames}`);
		}
		return driver;
	};

	const resolveKey = (key: StorageItemKey) => {
		const deliminatorIndex = key.indexOf(":");
		const driverArea = key.substring(0, deliminatorIndex) as StorageArea;

		const driverKey = key.substring(deliminatorIndex + 1);
		if (driverKey == null) {
			throw Error(
				`Storage key should be in the form of "area:key", but received "${key}"`,
			);
		}

		return {
			driverArea,
			driverKey,
			driver: getDriver(driverArea),
		};
	};

	const getMetaKey = (key: string) => `${key}$`;

	const mergeMeta = (oldMeta: any, newMeta: any): any => {
		const newFields = { ...oldMeta };

		Object.entries(newMeta).forEach(([key, value]) => {
			if (value == null) delete newFields[key];
			else newFields[key] = value;
		});

		return newFields;
	};

	const getValueOrFallback = (value: any, fallback: any) =>
		value ?? fallback ?? null;

	const getMetaValue = (properties: any) =>
		typeof properties === "object" && !Array.isArray(properties)
			? properties
			: {};

	const getItem = async (
		driver: StoreDriver,
		driverKey: string,
		opts: GetItemOptions<any> | undefined,
	) => {
		const res = await driver.getItem<any>(driverKey);
		return getValueOrFallback(res, opts?.fallback);
	};

	const getMeta = async (driver: StoreDriver, driverKey: string) => {
		const metaKey = getMetaKey(driverKey);
		const res = await driver.getItem<any>(metaKey);
		return getMetaValue(res);
	};

	const setItem = async (
		driver: StoreDriver,
		driverKey: string,
		value: any,
	) => {
		await driver.setItem(driverKey, value ?? null);
	};

	const setMeta = async (
		driver: StoreDriver,
		driverKey: string,
		properties: any | undefined,
	) => {
		const metaKey = getMetaKey(driverKey);
		const existingFields = getMetaValue(await driver.getItem(metaKey));
		await driver.setItem(metaKey, mergeMeta(existingFields, properties));
	};

	const removeItem = async (
		driver: StoreDriver,
		driverKey: string,
		opts: RemoveItemOptions | undefined,
	) => {
		await driver.removeItem(driverKey);

		if (opts?.removeMeta) {
			const metaKey = getMetaKey(driverKey);
			await driver.removeItem(metaKey);
		}
	};

	const removeMeta = async (
		driver: StoreDriver,
		driverKey: string,
		properties: string | string[] | undefined,
	) => {
		const metaKey = getMetaKey(driverKey);

		if (properties == null) {
			await driver.removeItem(metaKey);
		} else {
			const newFields = getMetaValue(await driver.getItem(metaKey));
			[properties].flat().forEach((field) => {
				delete newFields[field];
			});
			await driver.setItem(metaKey, newFields);
		}
	};

	const watch = (
		driver: StoreDriver,
		driverKey: string,
		cb: WatchCallback<any>,
	) => driver.watch(driverKey, cb);

	return {
		getItem: async (key, opts) => {
			const { driver, driverKey } = resolveKey(key);
			return await getItem(driver, driverKey, opts);
		},

		getItems: async (keys) => {
			const areaToKeyMap = new Map<StorageArea, string[]>();
			const keyToOptsMap = new Map<string, GetItemOptions<any> | undefined>();
			const orderedKeys: StorageItemKey[] = [];

			keys.forEach((key) => {
				let keyStr: StorageItemKey;
				let opts: GetItemOptions<any> | undefined;

				if (typeof key === "string") {
					// key: string
					keyStr = key;
				} else if ("getValue" in key) {
					// key: StoreItem
					keyStr = key.key;
					opts = { fallback: key.fallback };
				} else if ("item" in key) {
					// key: { item }
					keyStr = key.item.key;
					opts = { fallback: key.item.fallback };
				} else {
					// key: { key, options }
					keyStr = key.key;
					opts = key.options;
				}

				orderedKeys.push(keyStr);

				const { driverArea, driverKey } = resolveKey(keyStr);

				const areaKeys = areaToKeyMap.get(driverArea) ?? [];
				areaToKeyMap.set(driverArea, areaKeys.concat(driverKey));

				keyToOptsMap.set(keyStr, opts);
			});

			const resultsMap = new Map<StorageItemKey, any>();
			await Promise.all(
				Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys]) => {
					const driverResults = await drivers[driverArea].getItems(keys);

					driverResults.forEach((driverResult) => {
						const key = `${driverArea}:${driverResult.key}` as StorageItemKey;
						const opts = keyToOptsMap.get(key);
						const value = getValueOrFallback(
							driverResult.value,
							opts?.fallback ?? opts?.fallback,
						);

						resultsMap.set(key, value);
					});
				}),
			);

			return orderedKeys.map((key) => ({
				key,
				value: resultsMap.get(key),
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
					driverMetaKey: getMetaKey(driverKey),
				};
			});

			const areaToDriverMetaKeysMap = keys.reduce<
				Partial<Record<StorageArea, (typeof keys)[number][]>>
			>((map, key) => {
				map[key.driverArea] ??= [];
				map[key.driverArea]?.push(key);
				return map;
			}, {});

			const resultsMap: Record<string, any> = {};
			const storage = browser.storage;

			if (!storage) {
				throw new Error("Browser storage API is unavailable");
			}

			await Promise.all(
				Object.entries(areaToDriverMetaKeysMap).map(async ([area, keys]) => {
					const areaRes = await storage[area as StorageArea]!.get(
						keys.map((key) => key.driverMetaKey),
					);

					keys.forEach((key) => {
						resultsMap[key.key] = areaRes[key.driverMetaKey] ?? {};
					});
				}),
			);

			return keys.map((key) => ({
				key: key.key,
				meta: resultsMap[key.key],
			}));
		},

		setItem: async (key, value) => {
			const { driver, driverKey } = resolveKey(key);
			await setItem(driver, driverKey, value);
		},

		setItems: async (items) => {
			const areaToKeyValueMap: Partial<
				Record<StorageArea, Array<{ key: string; value: any }>>
			> = {};
			items.forEach((item) => {
				const { driverArea, driverKey } = resolveKey(
					"key" in item ? item.key : item.item.key,
				);
				areaToKeyValueMap[driverArea] ??= [];
				areaToKeyValueMap[driverArea].push({
					key: driverKey,
					value: item.value,
				});
			});

			await Promise.all(
				Object.entries(areaToKeyValueMap).map(async ([driverArea, values]) => {
					const driver = getDriver(driverArea as StorageArea);
					await driver.setItems(values);
				}),
			);
		},

		setMeta: async (key, properties) => {
			const { driver, driverKey } = resolveKey(key);
			await setMeta(driver, driverKey, properties);
		},

		setMetas: async (items) => {
			const areaToMetaUpdatesMap: Partial<
				Record<StorageArea, { key: string; properties: any }[]>
			> = {};
			items.forEach((item) => {
				const { driverArea, driverKey } = resolveKey(
					"key" in item ? item.key : item.item.key,
				);
				areaToMetaUpdatesMap[driverArea] ??= [];
				areaToMetaUpdatesMap[driverArea].push({
					key: driverKey,
					properties: item.meta,
				});
			});

			await Promise.all(
				Object.entries(areaToMetaUpdatesMap).map(
					async ([storageArea, updates]) => {
						const driver = getDriver(storageArea as StorageArea);
						const metaKeys = updates.map(({ key }) => getMetaKey(key));
						const existingMetas = await driver.getItems(metaKeys);
						const existingMetaMap = Object.fromEntries(
							existingMetas.map(({ key, value }) => [key, getMetaValue(value)]),
						);

						const metaUpdates = updates.map(({ key, properties }) => {
							const metaKey = getMetaKey(key);
							return {
								key: metaKey,
								value: mergeMeta(existingMetaMap[metaKey] ?? {}, properties),
							};
						});

						await driver.setItems(metaUpdates);
					},
				),
			);
		},

		removeItem: async (key, opts) => {
			const { driver, driverKey } = resolveKey(key);
			await removeItem(driver, driverKey, opts);
		},

		removeItems: async (keys) => {
			const areaToKeysMap: Partial<Record<StorageArea, string[]>> = {};

			keys.forEach((key) => {
				let keyStr: StorageItemKey;
				let opts: RemoveItemOptions | undefined;

				if (typeof key === "string") {
					// key: string
					keyStr = key;
				} else if ("getValue" in key) {
					// key: StoreItem
					keyStr = key.key;
				} else if ("item" in key) {
					// key: { item, options }
					keyStr = key.item.key;
					opts = key.options;
				} else {
					// key: { key, options }
					keyStr = key.key;
					opts = key.options;
				}

				const { driverArea, driverKey } = resolveKey(keyStr);
				areaToKeysMap[driverArea] ??= [];
				areaToKeysMap[driverArea].push(driverKey);

				if (opts?.removeMeta) {
					areaToKeysMap[driverArea].push(getMetaKey(driverKey));
				}
			});

			await Promise.all(
				Object.entries(areaToKeysMap).map(async ([driverArea, keys]) => {
					const driver = getDriver(driverArea as StorageArea);
					await driver.removeItems(keys);
				}),
			);
		},

		clear: async (base) => {
			const driver = getDriver(base);
			await driver.clear();
		},

		removeMeta: async (key, properties) => {
			const { driver, driverKey } = resolveKey(key);
			await removeMeta(driver, driverKey, properties);
		},

		snapshot: async (base, opts) => {
			const driver = getDriver(base);
			const data = await driver.snapshot();

			opts?.excludeKeys?.forEach((key) => {
				delete data[key];
				delete data[getMetaKey(key)];
			});

			return data;
		},

		restoreSnapshot: async (base, data) => {
			const driver = getDriver(base);
			await driver.restoreSnapshot(data);
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

		defineItem: (key, opts?: StoreItemOptions<any>) => {
			const { driver, driverKey } = resolveKey(key);

			const {
				version: targetVersion = 1,
				migrations = {},
				onMigrationComplete,
				debug = false,
			} = opts ?? {};

			if (targetVersion < 1) {
				throw Error(
					"Storage item version cannot be less than 1. Initial versions should be set to 1, not 0.",
				);
			}

			let needsVersionSet = false;

			const migrate: StoreItem<any, any>["migrate"] = async () => {
				const driverMetaKey = getMetaKey(driverKey);
				const [{ value }, { value: meta }] = await driver.getItems([
					driverKey,
					driverMetaKey,
				]);

				// Used in setValue to also set the version when needed
				needsVersionSet = value == null && meta?.v == null && !!targetVersion;

				if (value == null) return;

				const currentVersion = meta?.v ?? 1;
				if (currentVersion > targetVersion) {
					throw Error(
						`Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`,
					);
				}

				if (currentVersion === targetVersion) {
					return;
				}

				if (debug) {
					console.debug(
						`[webext-store] Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`,
					);
				}
				const migrationsToRun = Array.from(
					{ length: targetVersion - currentVersion },
					(_, i) => currentVersion + i + 1,
				);
				let migratedValue = value;
				for (const migrateToVersion of migrationsToRun) {
					try {
						migratedValue =
							(await migrations?.[migrateToVersion]?.(migratedValue)) ??
							migratedValue;
						if (debug) {
							console.debug(
								`[webext-store] Storage migration processed for version: v${migrateToVersion}`,
							);
						}
					} catch (err) {
						throw new MigrationError(key, migrateToVersion, {
							cause: err,
						});
					}
				}
				await driver.setItems([
					{ key: driverKey, value: migratedValue },
					{ key: driverMetaKey, value: { ...meta, v: targetVersion } },
				]);

				if (debug) {
					console.debug(
						`[webext-store] Storage migration completed for ${key} v${targetVersion}`,
						{ migratedValue },
					);
				}

				onMigrationComplete?.(migratedValue, targetVersion);
			};

			const migrationsDone =
				opts?.migrations == null
					? Promise.resolve()
					: migrate().catch((err) => {
							console.error(`[webext-store] Migration failed for ${key}`, err);
						});

			const initLock = withLock();

			const getFallback = () => opts?.fallback ?? opts?.defaultValue ?? null;

			const getOrInitValue = () =>
				initLock(async () => {
					const value = await driver.getItem<any>(driverKey);
					// Don't init value if it already exists or the init function isn't provided
					if (value != null || opts?.init == null) return value;

					const newValue = await opts.init();
					await driver.setItem<any>(driverKey, newValue);
					if (value == null && targetVersion > 1) {
						await setMeta(driver, driverKey, { v: targetVersion });
					}
					return newValue;
				});

			// Initialize the value once migrations have finished
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

					if (opts?.init) {
						return await getOrInitValue();
					} else {
						return await getItem(driver, driverKey, opts);
					}
				},

				getMeta: async () => {
					await migrationsDone;

					return await getMeta(driver, driverKey);
				},

				setValue: async (value) => {
					await migrationsDone;

					if (needsVersionSet) {
						needsVersionSet = false;
						await Promise.all([
							// Note: These calls cannot be done in a single `setItems` call;
							// metadata needs to be merged together with existing data and
							// setItems overwrites the whole value without merging.
							setItem(driver, driverKey, value),
							setMeta(driver, driverKey, { v: targetVersion }),
						]);
					} else {
						await setItem(driver, driverKey, value);
					}
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

				watch: (cb) =>
					watch(driver, driverKey, (newValue, oldValue) =>
						cb(newValue ?? getFallback(), oldValue ?? getFallback()),
					),

				migrate,
			};
		},
	};
}

function createDriver(storageArea: StorageArea): StoreDriver {
	const getStorageArea = () => {
		if (browser.runtime == null) {
			throw Error(
				`'webext-store' must be loaded in a web extension environment.`,
			);
		}

		if (browser.storage == null) {
			throw Error(
				"You must add the 'storage' permission to your manifest to use 'webext-store'",
			);
		}

		const area = browser.storage[storageArea];

		if (area == null) {
			throw Error(`"browser.storage.${storageArea}" is undefined`);
		}

		return area;
	};

	const watchListeners = new Set<(changes: StorageAreaChanges) => void>();

	return {
		getItem: async (key) => {
			const res = await getStorageArea().get<Record<string, any>>(key);
			return res[key];
		},

		getItems: async (keys) => {
			const result = await getStorageArea().get(keys);
			return keys.map((key) => ({ key, value: result[key] ?? null }));
		},

		setItem: async (key, value) => {
			if (value == null) {
				await getStorageArea().remove(key);
			} else {
				await getStorageArea().set({ [key]: value });
			}
		},

		setItems: async (values) => {
			const map = values.reduce<Record<string, unknown>>(
				(map, { key, value }) => {
					map[key] = value;
					return map;
				},
				{},
			);

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
			const listener = (changes: StorageAreaChanges) => {
				const change = changes[key] as {
					newValue?: any;
					oldValue?: any | null;
				} | null;

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
		},
	};
}
