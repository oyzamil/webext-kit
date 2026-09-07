import { storage } from 'webext-store';

export interface Settings {
  theme: 'light' | 'dark';
  displayName: string;
}

/**
 * A versioned item. Bumping `version` and adding a migration function is how
 * webext-store evolves a stored shape over time — migrations run
 * automatically, once, the first time the item is touched after an update.
 */
export const settingsItem = storage.defineItem<Settings>('sync:settings', {
  fallback: { theme: 'light', displayName: 'Guest' },
  version: 3,
  migrations: {
    // v1 -> v2: introduced `theme`
    2: (old: any) => ({ ...old, theme: old?.theme ?? 'light' }),
    // v2 -> v3: introduced `displayName`
    3: (old: any) => ({ ...old, displayName: old?.displayName ?? 'Guest' }),
  },
  debug: true,
  onMigrationComplete: (value, targetVersion) => {
    console.log(`[webext-store-demo] settings migrated to v${targetVersion}`, value);
  },
});

/**
 * `init` runs exactly once — the first time this item is defined in any
 * extension context after install — and only if nothing is in storage yet.
 * Good for one-time IDs, first-run timestamps, etc.
 */
export const installIdItem = storage.defineItem<string>('local:installId', {
  init: () => crypto.randomUUID(),
});

/**
 * A plain counter with a fallback of 0. Written to from the popup (via the
 * React hook), the background (on an alarm + on message), and read from
 * both — this is what the "Cross-context" tab uses to prove `watch()` fires
 * across execution contexts.
 */
export const heartbeatItem = storage.defineItem<number>('local:heartbeat', {
  fallback: 0,
});

/** Fixed keys used by the batch-operations tab. */
export const BATCH_KEYS = ['local:batchA', 'local:batchB', 'local:batchC'] as const;

export interface AppSetting {
  theme: 'light' | 'dark';
  free: boolean;
}

/**
 * The `{ theme: 'dark', free: true }` shape from the "how do I update one
 * key" question — used by ObjectUpdatePanel. webext-store stores the whole
 * value as one JSON blob, so "updating one key" always means read-modify-
 * write the whole object, same as you would with plain React state.
 */
export const appSettingItem = storage.defineItem<AppSetting>('local:appSetting', {
  fallback: { theme: 'dark', free: true },
});
