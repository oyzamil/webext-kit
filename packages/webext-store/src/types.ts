/**
 * Type definitions for webext-store
 *
 * @module webext-store/types
 */
export type StorageChange = {
	oldValue?: unknown;
	newValue?: unknown;
};

export interface StorageAreaAPI {
	get<T = Record<string, unknown>>(keys?: string | string[] | null): Promise<T>;

	set(items: Record<string, unknown>): Promise<void>;

	remove(keys: string | string[]): Promise<void>;

	clear(): Promise<void>;

	onChanged: {
		addListener(
			callback: (changes: Record<string, StorageChange>) => void,
		): void;

		removeListener(
			callback: (changes: Record<string, StorageChange>) => void,
		): void;
	};
}

export interface Browser {
	runtime?: unknown;

	storage?: {
		local?: StorageAreaAPI;
		session?: StorageAreaAPI;
		sync?: StorageAreaAPI;
		managed?: StorageAreaAPI;
	};
}

/** Resolved storage key with driver information */
export type ResolvedKey = {
	driverArea: StorageArea;
	driverKey: string;
	driver: StoreDriver;
};

/** Map of storage areas to keys */
export type AreaKeyMap = Partial<Record<StorageArea, string[]>>;

/** Main storage interface with all operations */
export interface Store {
	getItem<T>(
		key: StorageItemKey,
		opts: GetItemOptions<T> & { fallback: T },
	): Promise<T>;
	getItem<T>(key: StorageItemKey, opts?: GetItemOptions<T>): Promise<T | null>;

	getItems(
		keys: Array<
			| StorageItemKey
			| StoreItem<any, any>
			| { key: StorageItemKey; options?: GetItemOptions<any> }
			| { item: StoreItem<any, any> }
		>,
	): Promise<Array<{ key: StorageItemKey; value: any }>>;

	getMeta(key: StorageItemKey): Promise<Record<string, any>>;

	getMetas(
		args: Array<StorageItemKey | { key: StorageItemKey }>,
	): Promise<Array<{ key: StorageItemKey; meta: Record<string, any> }>>;

	setItem<T>(key: StorageItemKey, value: T | null): Promise<void>;

	setItems(
		values: Array<
			| { key: StorageItemKey; value: any }
			| { item: StoreItem<any, any>; value: any }
		>,
	): Promise<void>;

	setMeta<T extends Record<string, unknown>>(
		key: StorageItemKey,
		properties: T | null,
	): Promise<void>;

	setMetas(
		metas: Array<
			| { key: StorageItemKey; meta: Record<string, any> }
			| { item: StoreItem<any, any>; meta: Record<string, any> }
		>,
	): Promise<void>;

	removeItem(key: StorageItemKey, opts?: RemoveItemOptions): Promise<void>;

	removeItems(
		keys: Array<
			| StorageItemKey
			| StoreItem<any, any>
			| { key: StorageItemKey; options?: RemoveItemOptions }
			| { item: StoreItem<any, any>; options?: RemoveItemOptions }
		>,
	): Promise<void>;

	clear(base: StorageArea): Promise<void>;

	removeMeta(
		key: StorageItemKey,
		properties?: string | string[],
	): Promise<void>;

	snapshot(
		base: StorageArea,
		opts?: SnapshotOptions,
	): Promise<Record<string, unknown>>;

	restoreSnapshot(base: StorageArea, data: any): Promise<void>;

	watch<T>(key: StorageItemKey, cb: WatchCallback<T | null>): Unwatch;

	unwatch(): void;

	defineItem<TValue, TMetadata extends Record<string, unknown> = {}>(
		key: StorageItemKey,
	): StoreItem<TValue | null, TMetadata>;
	defineItem<TValue, TMetadata extends Record<string, unknown> = {}>(
		key: StorageItemKey,
		options: StoreItemOptions<TValue> & { fallback: TValue },
	): StoreItem<TValue, TMetadata>;
	defineItem<TValue, TMetadata extends Record<string, unknown> = {}>(
		key: StorageItemKey,
		options: StoreItemOptions<TValue> & { defaultValue: TValue },
	): StoreItem<TValue, TMetadata>;
	defineItem<TValue, TMetadata extends Record<string, unknown> = {}>(
		key: StorageItemKey,
		options: StoreItemOptions<TValue> & {
			init: () => TValue | Promise<TValue>;
		},
	): StoreItem<TValue, TMetadata>;
	defineItem<TValue, TMetadata extends Record<string, unknown> = {}>(
		key: StorageItemKey,
		options: StoreItemOptions<TValue>,
	): StoreItem<TValue | null, TMetadata>;
}

/** Internal driver interface */
export interface StoreDriver {
	getItem<T>(key: string): Promise<T | null>;
	getItems(keys: string[]): Promise<{ key: string; value: any }[]>;
	setItem<T>(key: string, value: T | null): Promise<void>;
	setItems(values: Array<{ key: string; value: any }>): Promise<void>;
	removeItem(key: string): Promise<void>;
	removeItems(keys: string[]): Promise<void>;
	clear(): Promise<void>;
	snapshot(): Promise<Record<string, unknown>>;
	restoreSnapshot(data: Record<string, unknown>): Promise<void>;
	watch<T>(key: string, cb: WatchCallback<T | null>): Unwatch;
	unwatch(): void;
}

/** Type-safe storage item with versioning support */
export interface StoreItem<TValue, TMetadata extends Record<string, unknown>> {
	/** The storage key passed when creating the storage item */
	key: StorageItemKey;

	/** @deprecated Renamed to fallback, use it instead */
	defaultValue: TValue;

	/** The value provided by the `fallback` option */
	fallback: TValue;

	/** Get the latest value from storage */
	getValue(): Promise<TValue>;

	/** Get metadata */
	getMeta(): Promise<NullablePartial<TMetadata>>;

	/** Set the value in storage */
	setValue(value: TValue): Promise<void>;

	/** Set metadata properties */
	setMeta(properties: NullablePartial<TMetadata>): Promise<void>;

	/** Remove the value from storage */
	removeValue(opts?: RemoveItemOptions): Promise<void>;

	/** Remove all metadata or certain properties from metadata */
	removeMeta(properties?: string | string[]): Promise<void>;

	/** Listen for changes to the value in storage */
	watch(cb: WatchCallback<TValue>): Unwatch;

	/**
	 * If there are migrations defined on the storage item, migrate to the latest
	 * version. This function is run automatically whenever the extension updates.
	 */
	migrate(): Promise<void>;
}

/** Valid storage areas */
export type StorageArea = "local" | "session" | "sync" | "managed";

/** Storage item key with area prefix (e.g., "local:myKey") */
export type StorageItemKey = `${StorageArea}:${string}`;

/** Options for getItem operations */
export interface GetItemOptions<T> {
	/** @deprecated Renamed to `fallback`, use it instead */
	defaultValue?: T;

	/** Default value returned when `getItem` would otherwise return `null` */
	fallback?: T;
}

/** Options for removeItem operations */
export interface RemoveItemOptions {
	/**
	 * Optionally remove metadata when deleting a key
	 * @default false
	 */
	removeMeta?: boolean;
}

/** Options for snapshot operations */
export interface SnapshotOptions {
	/**
	 * Exclude a list of keys. The storage area prefix should be removed since
	 * the snapshot is for a specific storage area already
	 */
	excludeKeys?: string[];
}

/** Options for defineItem operations */
export interface StoreItemOptions<T> {
	/** @deprecated Renamed to `fallback`, use it instead */
	defaultValue?: T;

	/** Default value returned when `getValue` would otherwise return `null` */
	fallback?: T;

	/**
	 * If passed, a value in storage will be initialized immediately after
	 * defining the storage item
	 */
	init?: () => T | Promise<T>;

	/**
	 * Provide a version number for the storage item to enable migrations.
	 * When changing the version in the future, migration functions will be
	 * run on application startup
	 */
	version?: number;

	/**
	 * A map of version numbers to the functions used to migrate the data
	 * to that version
	 */
	migrations?: Record<number, (oldValue: any) => any>;

	/**
	 * Print debug logs, such as migration process
	 * @default false
	 */
	debug?: boolean;

	/** A callback function that runs on migration complete */
	onMigrationComplete?: (migratedValue: T, targetVersion: number) => void;
}

/** Storage area changes from storage.onChanged listener */
export type StorageAreaChanges = {
	[key: string]: StorageChange;
};

/**
 * Same as `Partial`, but includes `| null`. Makes all properties
 * optional and nullable
 */
export type NullablePartial<T> = {
	[key in keyof T]+?: T[key] | undefined | null;
};

/** Callback called when a value in storage is changed */
export type WatchCallback<T> = (newValue: T, oldValue: T) => void;

/** Call to remove a watch listener */
export type Unwatch = () => void;

/** Migration error for version migrations */
export class MigrationError extends Error {
	constructor(
		public key: string,
		public version: number,
		options?: ErrorOptions,
	) {
		super(`v${version} migration failed for "${key}"`, options);
	}
}
