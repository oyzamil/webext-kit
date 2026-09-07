# webext-store-demo

One combined extension exercising every feature of `webext-store`, running in
every extension context at once: background service worker, popup, options
page, and content script.

Built with WXT, TypeScript, React 19, and Tailwind CSS v4.

## Setup

```sh
pnpm install
pnpm dev            # Chrome, hot-reloading
pnpm dev:firefox     # Firefox
```

Uses `webext-store: workspace:*` — this package lives in the same monorepo.
Point it at `^0.1.0` (or whatever's published) instead if you're using this
outside that workspace.

## Load the unpacked build

```sh
pnpm build            # -> .output/chrome-mv3
pnpm build:firefox    # -> .output/firefox-mv2
```

- **Chrome**: `chrome://extensions` → Developer Mode → "Load unpacked" →
  `.output/chrome-mv3`.
- **Firefox**: `about:debugging#/runtime/this-firefox` → "Load Temporary
  Add-on" → any file inside `.output/firefox-mv2`.

## What's where

| Context | File | What it proves |
| --- | --- | --- |
| Background (service worker) | `src/entrypoints/background.ts` | Migrations + `init` run here on startup; `browser.alarms` writes a counter every ~3s with no UI open at all |
| Popup | `src/entrypoints/popup/` | The full feature playground — 9 tabs, one per API area |
| Options page | `src/entrypoints/options/` | A real settings UI, reading/writing the *same* `sync:settings` item the popup uses — proves it's not popup-specific |
| Content script | `src/entrypoints/content.ts` | A framework-free badge injected into every page, reading `local:heartbeat` with zero React — proves the core package needs neither a UI framework nor an extension page |

Open the background's console (chrome://extensions → "Inspect views: service
worker") to see its own logs, separate from the popup's.

## Popup tabs → API coverage

| Tab | Covers |
| --- | --- |
| Raw API | `getItem` / `setItem` / `removeItem` / `watch` / `unwatch` |
| Areas | `local` / `session` / `sync` / `managed` — what each one is for |
| Batch | `getItems` / `setItems` / `getMetas` / `setMetas` / `removeItems` / `clear` |
| Metadata | `getMeta` / `setMeta` / `removeMeta` |
| Snapshot | `snapshot` / `restoreSnapshot`, `excludeKeys`, export/import as a JSON file |
| defineItem | `fallback`, `version` + `migrations`, `init`, `debug`, `onMigrationComplete`, full `StoreItem` instance API |
| Update 1 key | The read-modify-write pattern for objects (see below) |
| React hook | `useStorage` (incl. `onChange`), `useStorageWatch` |
| Cross-context | Proof the popup updates live from the background's independent writes |

## Using webext-store in every context

The core `storage` object and `defineItem()` work identically everywhere —
they're plain async functions over `browser.storage`, nothing React- or
page-specific. `webext-store/react` (the hook) obviously needs React, so it's
only used where a React tree already exists.

**Background / service worker** (`src/entrypoints/background.ts`)
```ts
import { storage } from 'webext-store';
import { heartbeatItem } from '@/utils/storage-items';

export default defineBackground(() => {
  heartbeatItem.watch((n) => console.log('heartbeat', n));
  browser.alarms.onAlarm.addListener(async () => {
    const n = await heartbeatItem.getValue();
    await heartbeatItem.setValue(n + 1);
  });
});
```

**Content script**, no React (`src/entrypoints/content.ts`)
```ts
import { heartbeatItem } from '@/utils/storage-items';

export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    heartbeatItem.watch((n) => updateBadgeInPage(n));
  },
});
```

**Popup / options / any extension page**, with React
```tsx
import { useStorage } from 'webext-store/react';
import { settingsItem } from '@/utils/storage-items';

function SettingsForm() {
  const { value, setValue } = useStorage(settingsItem);
  return <input value={value.displayName} onChange={(e) => setValue({ ...value, displayName: e.target.value })} />;
}
```

**Popup / options / any extension page**, without React — same core API as
the content script example above; `useStorage` is a thin convenience layer,
not a requirement.

One item, defined once in a shared module (`src/utils/storage-items.ts`),
used from all four contexts above — that's the point. Whichever context
writes, every other context watching that key sees it, live, via
`browser.storage.onChanged` under the hood.

## Updating one key in an object

`webext-store` stores each item as a single JSON value — there's no partial
"patch this field" on the wire. Updating one key is read-modify-write, same
as `useState` with an object:

```ts
const settingsItem = storage.defineItem<{ theme: 'light' | 'dark'; free: boolean }>(
  'local:appSetting',
  { fallback: { theme: 'dark', free: true } },
);
```

With the hook:

```tsx
const { value, setValue, patchValue } = useStorage(settingsItem);

// shorthand — merges into whatever's currently in storage:
await patchValue({ theme: 'light' });

// equivalent, done manually:
await setValue({ ...value, theme: 'light' });
```

`patchValue` re-reads the current value from storage itself (not the `value`
from this render) before merging, so two `patchValue` calls fired back to
back — e.g. from two different buttons in the same tick — don't clobber each
other the way two naive `setValue({ ...value, ... })` calls reading a stale
`value` could.

Without the hook:

```ts
const current = await settingsItem.getValue();
await settingsItem.setValue({ ...current, theme: 'light' });
```

**Subscribing to changes** — `onChange` (hook) and `.watch()` (core) both
fire with the *whole* new and old object, not a per-key diff:

```tsx
useStorage(settingsItem, {
  onChange: (newValue, oldValue) => {
    if (newValue.theme !== oldValue?.theme) {
      console.log('theme changed:', oldValue?.theme, '->', newValue.theme);
    }
  },
});
```

or the side-effect-only version:

```ts
settingsItem.watch((newValue, oldValue) => {
  if (newValue.theme !== oldValue?.theme) { /* ... */ }
});
```

Diffing which key actually changed is on you — `webext-store` doesn't know
which fields you "meant" to touch. If two fields change independently and
often, and re-rendering/notifying on every unrelated write is a problem,
give them separate keys (separate `defineItem()` calls) instead of bundling
them into one object — that's the only way to get true per-field
granularity out of a key-value store.

## Background service worker guide

MV3 service workers are not long-lived — the browser kills and restarts them
whenever it wants. Nothing held in a plain JS variable survives that;
`webext-store` items do, because every read/write goes straight to
`browser.storage`, not in-memory state. That's why storage — not module
variables — is the right place for anything the background needs to
remember across restarts.

Three lifecycle hooks matter, and it's easy to conflate them:

| Hook | Runs | Use it for |
| --- | --- | --- |
| `defineBackground(() => {...})` body | Every time the worker (re)starts | Registering `.watch()` subscriptions, alarm listeners, message listeners — anything that needs to exist for the worker's current lifetime |
| `browser.runtime.onInstalled` | Once on install, once per update — not on every restart | One-time setup, forcing migrations ahead of everything else, telling fresh installs apart from updates |
| `browser.alarms` | Survives worker restarts (the browser schedules it, not your code) | Anything you'd reach for `setInterval` for — a plain interval is thrown away the moment the worker is killed |

```ts
import { storage } from 'webext-store';
import { heartbeatItem, settingsItem } from '@/utils/storage-items';

export default defineBackground(() => {
  // Once per install/update, not per restart.
  browser.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'update') settingsItem.migrate();
  });

  // Re-registered every worker start — must live in the function body.
  const unwatch = heartbeatItem.watch((n, old) => console.log(`heartbeat: ${old} -> ${n}`));

  // alarms.create is idempotent by name — safe to call on every restart.
  browser.alarms.create('heartbeat', { periodInMinutes: 0.05 });
  browser.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== 'heartbeat') return;
    const n = await heartbeatItem.getValue();
    await heartbeatItem.setValue(n + 1);
  });

  self.addEventListener('beforeunload' as any, () => {
    unwatch();
    storage.unwatch();
  });
});
```

See `src/entrypoints/background.ts` for the full version with `init` and
message-triggered writes too.

## Project layout

```
src/
  entrypoints/
    background.ts         service worker: migrations, init, alarm-driven writes
    content.ts             framework-free content script badge
    options/                real settings page, same items as the popup
    popup/
      App.tsx               tab navigation
      panels/                one component per feature area
  utils/
    storage-items.ts        shared storage.defineItem() definitions, used by every context
  components/ui.tsx         shared Tailwind-styled UI primitives
  hooks/useLog.ts            small capped event-log hook used by several panels
```
