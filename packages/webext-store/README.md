# webext-store

Type-safe, zero-config storage for browser extensions — one small API over `browser.storage`, with versioned fields, snapshots, metadata, and an optional React hook.

Works with Chrome, Firefox, Edge, and any other `browser.storage`-compatible extension runtime. Works in every extension context: background/service worker, popup, options page, content script — anywhere your code can `await`.

![Latest Version](https://img.shields.io/npm/v/webext-store?style=for-the-badge&color=green)
![Monthly Downloads](https://img.shields.io/npm/dm/webext-store?style=for-the-badge&color=green)
![License: MIT](https://img.shields.io/badge/License-MIT-brown?style=for-the-badge)
![100% Typescript](https://img.shields.io/github/languages/top/oyzamil/webext-kit?style=for-the-badge&color=blue)

- [Installation](#installation)
- [TypeScript support](#typescript-support)
- [Storage areas & keys](#storage-areas--keys)
- [Core API](#core-api)
  - [getItem](#getitemkey-options)
  - [setItem](#setitemkey-value)
  - [getItems (batch)](#getitemskeys)
  - [setItems (batch)](#setitemsvalues)
  - [removeItem](#removeitemkey-options)
  - [removeItems (batch)](#removeitemskeys)
  - [clear](#cleararea)
  - [getMeta / setMeta / removeMeta](#getmeta--setmeta--removemeta)
  - [getMetas / setMetas (batch)](#getmetas--setmetas-batch)
  - [snapshot / restoreSnapshot](#snapshot--restoresnapshot)
  - [watch / unwatch](#watch--unwatch)
- [defineItem — typed, versioned items](#defineitem--typed-versioned-items)
- [React: webext-store/react](#react-webext-storereact)
  - [useStorage](#usestorage)
  - [Updating one key of an object](#updating-one-key-of-an-object)
  - [useStorageWatch](#usestoragewatch)
- [Development](#development)

## Installation

```sh
npm i webext-store
pnpm add webext-store
yarn add webext-store
bun add webext-store
```

```ts
import { storage } from 'webext-store';
```

## TypeScript support

Yes — full autocomplete and inline type-checking out of the box, no extra
`@types` package needed. The library is written in TypeScript and ships its
own `.d.ts` declaration files in `dist/`, wired up via `package.json`'s
`exports` field, so your editor (VS Code, WebStorm, anything using the
TypeScript language server) picks them up automatically the moment you
`import` from `webext-store` or `webext-store/react` — same as importing
from any other typed package.

Concretely, that means:
- Every function's parameters and return type are checked and autocompleted
  as you type (`storage.getItem(...)`, `storage.defineItem(...)`, etc).
- Passing `<T>` to a call like `storage.getItem<number>(...)` flows through
  to the return type — no `as` casts needed.
- `storage.defineItem()` returns a fully-typed `StoreItem<T>` — its
  `.getValue()`, `.setValue()`, etc. are all typed against the `T` you gave
  it.
- Storage keys are typechecked as `` `local:${string}` | `session:${string}` |
  `sync:${string}` | `managed:${string}` `` — typo the area prefix (e.g.
  `'locl:foo'`) and TypeScript flags it before you run anything.
- The React hook (`webext-store/react`) has its own typed overloads —
  passing a raw key vs. a `defineItem()` item gives you different, correctly
  narrowed return types (see [useStorage](#usestorage) below).

## Storage areas & keys

Every key is a plain string in the form `"<area>:<name>"`. The area picks
which underlying `browser.storage` bucket the value lives in:

| Area | Persists | Synced across devices? | Notes |
| --- | --- | --- | --- |
| `local` | Until removed | No | Largest quota, the default choice |
| `session` | Until the browser/extension restarts | No | In memory, gone on restart |
| `sync` | Until removed | Yes | Small quota (~100KB total), good for small user preferences |
| `managed` | N/A | N/A | Read-only, set by enterprise policy — writes here always fail |

```ts
'local:installDate'   // -> browser.storage.local
'sync:theme'           // -> browser.storage.sync
```

## Core API

Everything below is a method on the single `storage` object:

```ts
import { storage } from 'webext-store';
```

### `getItem(key, options?)`

Reads one value. Returns `null` if nothing's been set yet, unless you give a
`fallback`.

```ts
// No fallback: value is `number | null`
const installDate = await storage.getItem<number>('local:installDate');

// With a fallback: value is `number` (never null)
const count = await storage.getItem<number>('local:visitCount', { fallback: 0 });
```

### `setItem(key, value)`

Writes one value. Setting `null` or `undefined` removes the key (same as
calling `removeItem`).

```ts
await storage.setItem('local:installDate', Date.now());
await storage.setItem('local:installDate', null); // removes it
```

### `getItems(keys)`

Reads several keys in one call, in the order you asked for them. Useful to
avoid several separate round-trips.

```ts
const results = await storage.getItems(['local:installDate', 'sync:theme']);
// -> [
//   { key: 'local:installDate', value: 1699999999999 },
//   { key: 'sync:theme', value: 'dark' },
// ]
```

### `setItems(values)`

Writes several keys in one call.

```ts
await storage.setItems([
  { key: 'local:installDate', value: Date.now() },
  { key: 'sync:theme', value: 'dark' },
]);
```

### `removeItem(key, options?)`

Deletes one key. Pass `{ removeMeta: true }` to also delete any metadata
stored alongside it (see [getMeta / setMeta](#getmeta--setmeta--removemeta)).

```ts
await storage.removeItem('local:installDate');
await storage.removeItem('local:installDate', { removeMeta: true });
```

### `removeItems(keys)`

Deletes several keys in one call.

```ts
await storage.removeItems(['local:batchA', 'local:batchB']);
```

### `clear(area)`

Wipes every key in one storage area. There's no "undo" — this deletes
everything in that area, not just keys your extension recognizes.

```ts
await storage.clear('local');
```

### `getMeta` / `setMeta` / `removeMeta`

Metadata is a small side-object you can attach to a key without touching its
main value — handy for things like "when was this last edited" or "has this
synced yet". It's stored under `key + "$"` behind the scenes, so it doesn't
collide with or get overwritten by `setItem`.

```ts
// Attach metadata alongside a value
await storage.setMeta('local:document', { lastModified: Date.now(), syncStatus: 'pending' });

// Read it back
const meta = await storage.getMeta('local:document');
// -> { lastModified: 1699999999999, syncStatus: 'pending' }

// setMeta merges — existing properties you don't mention are kept
await storage.setMeta('local:document', { syncStatus: 'synced' });
// -> { lastModified: 1699999999999, syncStatus: 'synced' }

// Remove one property...
await storage.removeMeta('local:document', 'syncStatus');
// ...or all of it
await storage.removeMeta('local:document');
```

### getMetas / setMetas (batch)

Same idea as `getItems`/`setItems`, for metadata across several keys at once.

```ts
await storage.setMetas([
  { key: 'local:batchA', meta: { touchedAt: Date.now() } },
  { key: 'local:batchB', meta: { touchedAt: Date.now() } },
]);

const metas = await storage.getMetas(['local:batchA', 'local:batchB']);
// -> [{ key: 'local:batchA', meta: {...} }, { key: 'local:batchB', meta: {...} }]
```

### `snapshot` / `restoreSnapshot`

`snapshot` reads every key currently in one storage area into a plain
object — good for backups, "export my settings", or debugging what's
actually stored. `restoreSnapshot` writes it back later. Restoring only
overwrites keys present in the snapshot — anything written *after* the
snapshot was taken is left alone, not deleted.

```ts
// Back up everything in 'local', except a couple of noisy temp keys
// (excludeKeys are plain key names — no area prefix, since the whole
// snapshot is already scoped to one area)
const backup = await storage.snapshot('local', { excludeKeys: ['tempCache'] });

// ... later, e.g. after the user picks "restore backup" ...
await storage.restoreSnapshot('local', backup);
```

A common pattern: turn the snapshot into a downloadable file.

```ts
const backup = await storage.snapshot('local');
const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// ...then set this as an <a download> link's href
```

### `watch` / `unwatch`

Subscribe to changes on one key. The callback fires for changes made
**anywhere** — this tab, another tab, a popup, the background script, a
content script — not just changes made through this exact `watch()` call.
This is the mechanism that makes cross-context reactivity possible.

```ts
const unwatch = storage.watch<string>('sync:theme', (newValue, oldValue) => {
  console.log(`theme changed: ${oldValue} -> ${newValue}`);
});

// later, when you no longer care:
unwatch();

// or nuke every watcher registered in this file/context at once:
storage.unwatch();
```

## defineItem — typed, versioned items

Calling `storage.getItem('local:x')` everywhere works, but for anything
you'll read/write from more than one place, `defineItem()` bundles the key,
its type, its default value, and its schema-versioning into one reusable
object. Define it once in a shared file, import it wherever you need it.

```ts
interface Settings {
  theme: 'light' | 'dark';
  displayName: string;
}

const settingsItem = storage.defineItem<Settings>('sync:settings', {
  // Returned by getValue() until something's actually been stored.
  fallback: { theme: 'light', displayName: 'Guest' },

  // Bump this whenever the shape of the stored value changes.
  version: 2,

  // One function per version you're migrating *to*. Runs automatically,
  // once, the first time this item is touched after an update — you never
  // call these yourself.
  migrations: {
    2: (old: any) => ({ ...old, displayName: old?.displayName ?? 'Guest' }),
  },

  // Logs each migration step to the console — handy while developing,
  // turn off for production.
  debug: true,

  // Runs once, after migrations finish.
  onMigrationComplete: (value, version) => {
    console.log(`settings migrated to v${version}`, value);
  },
});

// Use it like a tiny typed repository for that one key:
await settingsItem.setValue({ theme: 'dark', displayName: 'Ada' });
const settings = await settingsItem.getValue(); // typed as `Settings`

// Everything from the core API is also available scoped to this one item:
await settingsItem.setMeta({ lastChangedAt: Date.now() });
const meta = await settingsItem.getMeta();
await settingsItem.removeValue();                 // reset to fallback
const unwatch = settingsItem.watch((newValue, oldValue) => { /* ... */ });
await settingsItem.migrate();                     // run pending migrations manually
```

`init` is the other way to give an item a starting value — instead of a
static fallback, it's a function that runs once (ever, per install) the
first time the item is read, and whatever it returns is saved as the actual
value from then on. Good for one-time IDs:

```ts
const installIdItem = storage.defineItem<string>('local:installId', {
  init: () => crypto.randomUUID(),
});

const id = await installIdItem.getValue(); // generated once, stable after that
```

## React: `webext-store/react`

`react` is an optional peer dependency, only ever imported from this
sub-path — importing the core `webext-store` package never pulls React into
your bundle, so non-React consumers (background scripts, content scripts)
pay nothing for it.

```sh
npm i react   # if you don't already have it
```

### `useStorage`

Subscribes a component to a key (or a `defineItem()` item) and re-renders
whenever it changes — from this component, another component, another tab,
or another extension context.

```tsx
import { useStorage } from 'webext-store/react';

function Counter() {
  const { value, loading, error, setValue, removeValue } = useStorage('local:counter', {
    fallback: 0,
  });

  if (loading) return null; // true only until the first read resolves
  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

With a `defineItem()` item instead of a raw key — same shared migrations,
versioning, and fallback as anywhere else that item is used:

```tsx
const counterItem = storage.defineItem<number>('local:counter', { fallback: 0 });

function Counter() {
  const { value, setValue } = useStorage(counterItem);
  return <button onClick={() => setValue(value + 1)}>{value}</button>;
}
```

React to changes made from *outside* this component (another tab, the
background script, etc) with `onChange` — it fires on every change, not just
ones made by this component's own `setValue` calls:

```tsx
useStorage('sync:theme', {
  fallback: 'light',
  onChange: (newTheme, oldTheme) => {
    console.log(`theme: ${oldTheme} -> ${newTheme}`);
  },
});
```

### Updating one key of an object

`webext-store` stores each item as one whole JSON value — there's no
"update just this field" on the wire, so changing one key means read the
current value, change the one field, write the whole thing back. Same as
`useState` with an object. `patchValue` is a shorthand for exactly that:

```tsx
const settingsItem = storage.defineItem<{ theme: 'light' | 'dark'; displayName: string }>(
  'sync:settings',
  { fallback: { theme: 'light', displayName: 'Guest' } },
);

function ThemeToggle() {
  const { value, patchValue } = useStorage(settingsItem);

  // shorthand — merges into whatever's currently stored, leaves
  // `displayName` untouched:
  const toggle = () => patchValue({ theme: value.theme === 'dark' ? 'light' : 'dark' });

  // exactly equivalent, done manually with setValue:
  // const toggle = () => setValue({ ...value, theme: value.theme === 'dark' ? 'light' : 'dark' });

  return <button onClick={toggle}>Theme: {value.theme}</button>;
}
```

`patchValue` re-reads the current value from storage itself before merging
(not the `value` from the render it was called in), so two `patchValue`
calls fired in the same tick — e.g. from two different buttons — don't
overwrite each other's change.

`onChange` (and `.watch()`) always give you the **whole** old and new
object, never a per-key diff — diffing which field actually changed is on
you:

```tsx
useStorage(settingsItem, {
  onChange: (newValue, oldValue) => {
    if (newValue.theme !== oldValue?.theme) {
      console.log('theme changed:', oldValue?.theme, '->', newValue.theme);
    }
  },
});
```

If two fields on the same object change independently and often, and you
don't want a write to one to notify/re-render watchers of the other, give
them separate keys (separate `defineItem()` calls) instead of bundling them
into one object — that's the only way to get true per-field granularity out
of a key-value store.

### `useStorageWatch`

For when you just want the side effect of a change — logging, syncing
something outside React, invalidating a cache — without needing the value
in render state at all.

```tsx
import { useStorageWatch } from 'webext-store/react';

function AuthWatcher() {
  useStorageWatch<string>('local:authToken', (newToken) => {
    if (!newToken) redirectToLogin();
  });
  return null;
}
```

## License

MIT
