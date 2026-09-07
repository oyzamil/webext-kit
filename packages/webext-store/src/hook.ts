/**
 * Optional React bindings for `webext-store`.
 *
 * `react` is a peer dependency and is only ever imported from this file, so
 * anyone importing from `webext-store` (the root entrypoint) never pulls
 * React into their bundle. Only projects that import from
 * `webext-store/react` need `react` installed at all.
 *
 * @module webext-store/react (source: hook.ts)
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
	type GetItemOptions,
	type RemoveItemOptions,
	type StorageItemKey,
	type StoreItem,
	storage,
	type WatchCallback,
} from "./index";

export interface UseStorageOptions<T> extends GetItemOptions<T> {
	/**
	 * Called every time the value changes in storage — whether the change came
	 * from this hook, another component, another tab, or another extension
	 * context (background/popup/content script). This is effectively a
	 * `storage.watch()` subscription managed for you.
	 */
	onChange?: WatchCallback<T | null>;
}

export interface UseStorageResult<T> {
	/** Current value. Equal to the fallback/default until the initial read resolves. */
	value: T;
	/** `true` until the first read from storage has resolved. */
	loading: boolean;
	/** Set if the initial read (or a subsequent write) throws. */
	error: Error | null;
	/** Write a new value to storage. Updates `value` for every subscriber, in every context, once the change event fires. */
	setValue: (value: T) => Promise<void>;
	/**
	 * Shallow-merge a partial object into the current value and write the
	 * result — `patchValue({ theme: 'light' })` instead of
	 * `setValue({ ...value, theme: 'light' })`. Only makes sense for object
	 * values. Reads the current value fresh from storage first (not the
	 * `value` from this render), so back-to-back patches don't clobber each
	 * other.
	 */
	patchValue: T extends object ? (partial: Partial<T>) => Promise<void> : never;
	/** Remove the value from storage, resetting `value` back to the fallback. */
	removeValue: (opts?: RemoveItemOptions) => Promise<void>;
}

type AnyItem = StoreItem<any, any>;

const isStorageItem = (x: unknown): x is AnyItem =>
	typeof x === "object" &&
	x != null &&
	typeof (x as any).getValue === "function";

// patchValue is read-modify-write; two concurrent patches on the same key
// would otherwise both read the pre-patch value and the second write would
// silently clobber the first. Queue patches per key so they always see each
// other's result.
const patchQueues = new Map<string, Promise<unknown>>();

function queuePatch<T>(key: string, fn: () => Promise<T>): Promise<T> {
	const prev = patchQueues.get(key) ?? Promise.resolve();
	const next = prev.then(fn, fn);
	patchQueues.set(
		key,
		next.then(
			() => undefined,
			() => undefined,
		),
	);
	return next;
}

/**
 * Subscribe to a storage key (or a `defineItem()` item) and re-render
 * whenever it changes — in this component, another component, another tab,
 * or another extension context.
 *
 * @example Raw key
 *   const { value, setValue } = useStorage<number>('local:installDate');
 *
 * @example With a fallback (removes `| null` from the type)
 *   const { value, setValue } = useStorage('local:counter', { fallback: 0 });
 *
 * @example With a `defineItem()` definition (shares migrations/versioning)
 *   const counterItem = storage.defineItem<number>('local:counter', { fallback: 0 });
 *   const { value, setValue } = useStorage(counterItem);
 *
 * @example `defineItem()` + onChange
 *   const { value } = useStorage(counterItem, {
 *     onChange: (n, old) => console.log(`counter: ${old} -> ${n}`),
 *   });
 *
 * @example Updating one key of an object
 *   const settingsItem = storage.defineItem('local:settings', { fallback: { theme: 'dark', free: true } });
 *   const { value, patchValue } = useStorage(settingsItem);
 *   await patchValue({ theme: 'light' }); // `free` untouched
 *
 * @example Reacting to external changes
 *   useStorage('local:theme', {
 *     fallback: 'light',
 *     onChange: (theme) => document.body.dataset.theme = theme,
 *   });
 */
export function useStorage<T>(
	key: StorageItemKey,
	options: UseStorageOptions<T> & { fallback: T },
): UseStorageResult<T>;
export function useStorage<T>(
	key: StorageItemKey,
	options?: UseStorageOptions<T>,
): UseStorageResult<T | null>;
export function useStorage<T, TMetadata extends Record<string, unknown> = {}>(
	item: StoreItem<T, TMetadata>,
	options?: { onChange?: WatchCallback<T> },
): UseStorageResult<T>;
export function useStorage(
	keyOrItem: StorageItemKey | AnyItem,
	options?: UseStorageOptions<any>,
): UseStorageResult<any> {
	const item = isStorageItem(keyOrItem) ? keyOrItem : undefined;
	const key = item ? item.key : (keyOrItem as StorageItemKey);
	const fallback = item
		? item.fallback
		: (options?.fallback ?? options?.defaultValue ?? null);

	// onChange is read fresh on every render via a ref so callers don't need
	// to memoize it themselves — passing an inline arrow function is fine.
	const onChangeRef = useRef(options?.onChange);
	onChangeRef.current = options?.onChange;

	const [state, setState] = useState<{
		value: any;
		loading: boolean;
		error: Error | null;
	}>({ value: fallback, loading: true, error: null });

	useEffect(() => {
		let cancelled = false;
		setState((s) => ({ ...s, loading: true }));
		(async () => {
			try {
				const value = item
					? await item.getValue()
					: await storage.getItem(key, options);
				if (!cancelled) setState({ value, loading: false, error: null });
			} catch (error) {
				if (!cancelled) {
					setState((s) => ({ ...s, loading: false, error: error as Error }));
				}
			}
		})();

		const handleChange: WatchCallback<any> = (newValue, oldValue) => {
			setState({ value: newValue ?? fallback, loading: false, error: null });
			onChangeRef.current?.(newValue, oldValue);
		};

		const unwatch = item
			? item.watch(handleChange)
			: storage.watch(key, handleChange);

		return () => {
			cancelled = true;
			unwatch();
		};
		// Only re-subscribe if the key itself changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [key]);

	const setValue = useCallback(
		async (value: any) => {
			if (item) await item.setValue(value);
			else await storage.setItem(key, value);
		},
		[key],
	);

	const patchValue = useCallback(
		(partial: Record<string, unknown>) =>
			queuePatch(key, async () => {
				const current = item
					? await item.getValue()
					: ((await storage.getItem(key, options)) ?? fallback);
				const next = { ...current, ...partial };
				if (item) await item.setValue(next);
				else await storage.setItem(key, next);
			}),
		[key],
	);

	const removeValue = useCallback(
		async (opts?: RemoveItemOptions) => {
			if (item) await item.removeValue(opts);
			else await storage.removeItem(key, opts);
		},
		[key],
	);

	return {
		value: state.value,
		loading: state.loading,
		error: state.error,
		setValue,
		patchValue: patchValue as UseStorageResult<any>["patchValue"],
		removeValue,
	};
}

/**
 * Lower-level hook for when you just want to *react* to changes (e.g. sync
 * something outside React, log analytics, invalidate a cache) without
 * needing the value in render state at all. Effectively `storage.watch()`
 * wired up to the component lifecycle.
 *
 * @example
 *   useStorageWatch('local:theme', (newTheme, oldTheme) => {
 *     console.log(`theme changed: ${oldTheme} -> ${newTheme}`);
 *   });
 */
export function useStorageWatch<T = unknown>(
	key: StorageItemKey,
	callback: WatchCallback<T | null>,
): void {
	const callbackRef = useRef(callback);
	callbackRef.current = callback;

	useEffect(() => {
		const unwatch = storage.watch<T>(key, (newValue, oldValue) =>
			callbackRef.current(newValue, oldValue),
		);
		return unwatch;
	}, [key]);
}
