# Webext Content Ui

Inject elements into DOM — single element or batch of anchors, with optional shared styles across shadow roots. Combines Plasmo's batch-anchor injection with WXT's clean UI API and CSS deduplication neither has built-in. Also handles the two problems that come up once you're running the same UI across several content scripts on an SPA: sharing one CSS fetch/stylesheet instead of duplicating it per script, and reacting to client-side route changes without a full page reload.

![Latest Version](https://img.shields.io/npm/v/webext-content-ui?style=for-the-badge&color=green)
![Monthly Downloads](https://img.shields.io/npm/dm/webext-content-ui?style=for-the-badge&color=green)
![License: MIT](https://img.shields.io/badge/License-MIT-brown?style=for-the-badge)
![100% Typescript](https://img.shields.io/github/languages/top/oyzamil/webext-kit?style=for-the-badge&color=blue)

## Install

```bash
npm install webext-content-ui
``` 

## Why

- **Plasmo** can batch multiple anchors into one shared shadow root (`getOverlayAnchorList`), but each inline anchor still gets its own separate shadow + style injection.
- **WXT** has a cleaner `createShadowRootUi` / `createIntegratedUi` API, but no built-in batching, and duplicates the same CSS (e.g. Tailwind output)
  once per shadow root / entrypoint — and that duplication also happens *across separate content scripts* on the same page, since each is built
  and executed as its own bundle.
- Neither gives you a way to scope a UI to specific URLs *within* an already-injected content script, or to react when an SPA route changes without a full page load.

This package gives you all of that: batch or single anchors, a `sharedRoot` mode for Plasmo-overlay-style single-shadow injection, a `sharedStyle` mode that dedupes CSS text across shadow roots (and across separate content-script bundles, via `getSharedCssText`) through `adoptedStyleSheets`, a `matches` option for path-level URL filtering, and an SPA-navigation watcher for reacting to client-side route changes.

## Usage

### Single element

```ts
import { createShadowRootUi } from 'webext-content-ui';

const contentUi = createShadowRootUi({
  name: 'my-widget',
  anchor: '#target',
  css: '.btn { color: hotpink; }',
  onMount: ({ container }) => {
    container.innerHTML = '<button class="btn">Click</button>';
  },
});

contentUi.mount();
// later
contentUi.remove();
```

### Batch anchors, separate shadow roots, shared styles

```ts
const contentUi = createShadowRootUi({
  name: 'row-action',
  anchor: '.table-row', // selector, Element, or Element[]
  css: tailwindCss, // shared across every .table-row's shadow root
  sharedStyle: true, // default
  autoDetect: true, // auto-mount into rows added later
  onMount: ({ container, anchor, index }) => {
    container.innerHTML = `<button>Action ${index}</button>`;
  },
});

contentUi.mount();
```

### Batch anchors, one shared shadow root (Plasmo-overlay style)

```ts
const contentUi = createShadowRootUi({
  name: 'overlay',
  anchor: '.highlight-target',
  sharedRoot: true, // ONE shadow root for all matched anchors
  css: sharedCss,
  onMount: ({ container }) => {
    container.textContent = 'Highlighted';
  },
});

contentUi.mount();
```

Any `:root` selector in your `css` is automatically rewritten to `:host`,
since `:root` doesn't work inside a shadow tree.

By default, `keyup`/`keydown`/`keypress` events are stopped from bubbling
past the shadow boundary (`isolateEvents: true`). Pass a custom event-name
array, or `false` to disable, if your widget needs those events to reach
the host page.


### Integrated UI (no shadow root, light DOM)

```ts
import { createIntegratedUi } from 'webext-content-ui';

const contentUi = createIntegratedUi({
  name: 'inline-badge',
  anchor: '.item-title',
  onMount: ({ container }) => {
    container.textContent = 'New';
  },
});

contentUi.mount();
```

Content lands directly in the page's DOM — no shadow boundary. Page CSS
reaches your markup and vice versa, which is what you want when the
injected content should visually blend into the page (or reuse the page's
own classes) rather than stay isolated. `css` is injected once into the
page's own `<head>`, deduped by `styleKey`.

### Iframe UI (full isolation)

```ts
import { createIframeUi } from 'webext-content-ui';

const contentUi = createIframeUi({
  name: 'sandboxed-widget',
  anchor: '#target',
  css: '.btn { color: hotpink; }',
  onMount: ({ container }) => {
    container.innerHTML = '<button class="btn">Click</button>';
  },
});

contentUi.mount();
```

Each anchor gets an `<iframe>` — a separate `window`/`document`, so no CSS
or global JS leaks either direction. Heavier than a shadow root; use it
when isolation must survive things a shadow root doesn't stop (e.g. page
stylesheets targeting `*`, or global CSS resets). The iframe is never
navigated (no `src`/`srcdoc`) — its initial document is synchronously
forced into a stable html/head/body via `document.write` right after
insertion, so `contentDocument` is ready to use immediately, no load event
to wait for. `hostTag` doesn't apply here (the host is always `<iframe>`).

By default the iframe auto-resizes to match its injected content's
measured width/height (via `ResizeObserver`, watching the container inside
`contentDocument`). Set `autoSize: false` to keep a fixed size instead and
control `iframe` dimensions yourself in `onMount`.

### URL filtering with `matches`

`matches` scopes a UI to specific pages *within* an already-injected
content script — useful when one script covers a whole domain but a
particular widget should only mount on certain paths:

```ts
const contentUi = createShadowRootUi({
  name: 'order-panel',
  anchor: 'body',
  matches: [
    '*://*.youtube.com.com/*',
    '*://*.facebook.com/*',
  ],
  onMount: ({ container }) => { /* ... */ },
});

contentUi.mount(); // no-op unless location.href matches one of the patterns
```

Patterns use standard WebExtension match-pattern syntax (`*` scheme
matches http/https, `*.example.com` matches the bare domain and any
subdomain, `*` in the path matches any run of characters), plus
`<all_urls>`. This is a separate, finer-grained check than your manifest's
own `matches` — it doesn't affect whether the content script gets
injected, only whether this particular `mount()` call does anything.

### Reacting to SPA navigation

Sites like AliExpress load the order page via client-side routing, not a
full page load — `matches` alone won't re-evaluate on its own. Add
`watchLocationChange` and/or `onLocationChange`:

```ts
const contentUi = createShadowRootUi({
  name: 'order-panel',
  anchor: 'body',
  matches: ['*://*.facebook.com/*'],
  watchLocationChange: true, // mount/unmount as `matches` starts/stops applying
  onLocationChange: ({ url, oldUrl, matches }) => {
    console.log(`nav ${oldUrl} -> ${url}, matches: ${matches}`);
  },
  onMount: ({ container }) => { /* ... */ },
});

contentUi.mount();
```

- `watchLocationChange: true` alone gets you the mount/unmount reaction
  with no callback.
- `onLocationChange` implies `watchLocationChange` — setting it is enough
  to start the watcher on its own. It fires on every navigation (whether
  or not `matches` changed — check `detail.matches`), *after* this
  injector's own mount/unmount reaction, so `instances()` already reflects
  the new state by the time your callback runs.
- Works without `matches` too, if you just want the navigation callback.

Internally this prefers the Navigation API where available, falling back
to polling — see [`onLocationChange`](#onlocationchange) below if you want
the same watcher standalone, outside a `contentUi` instance.

## Utilities

Standalone helpers, usable on their own — not tied to `mount()`/`remove()`.

### `addStyleToDom` / `removeStyleFromDom`

Id-keyed style injection: add a `<style>` tied to an id, swap it out later
by calling again with the same id (no stacking duplicate stylesheets),
remove it explicitly.

```ts
import { addStyleToDom, removeStyleFromDom } from 'webext-content-ui';

const styles_override = addStyleToDom('my-override', '.foo { color: red }');
// later
styles_override.remove();

// or, from elsewhere, without keeping the handle around:
removeStyleFromDom('my-override');
```

Both accept an optional third argument — a `ShadowRoot` to inject into
instead of `document` (default). An id in a document and the same id in a
shadow root don't collide.

This dedupes by **id**, which is different from the `css`/`styleKey`
option on the injectors (that one dedupes by **content hash**, shared via
`adoptedStyleSheets`). Use `addStyleToDom` for something you'll swap at
runtime — a theme toggle, a per-page tweak; use `styleKey`/`sharedStyle`
for a big static stylesheet (like a bundled Tailwind build) you want
reused as-is across many mounts.

### `getSharedCssText`

Fetches CSS text once and caches the promise on `globalThis`, keyed by
URL — the first content script to call it does the `fetch`; every other
one (same page, same frame) calling it with the same URL reuses that same
promise instead of re-fetching. Meant for `cssInjectionMode: "manual"`
setups where multiple content scripts share one built CSS file:

```ts
import { createShadowRootUi, getSharedCssText } from 'webext-content-ui';

const css = await getSharedCssText(
  browser.runtime.getURL('content-scripts/shared-styles.css'),
);

createShadowRootUi({
  name: 'aliexpress-panel',
  styleKey: 'shared-tailwind', // same key on every script sharing this CSS —
  css,                          // this is what dedupes the CSSStyleSheet itself
  anchor: 'body',
  onMount: ({ container }) => { /* ... */ },
}).mount();
```

Pass the *same* `styleKey` on every injector sharing that CSS text, not just the same `getSharedCssText` URL — the URL cache saves the network fetch, `styleKey` is what dedupes the constructed `CSSStyleSheet` object across separate content-script bundles.

### `onLocationChange`

The same SPA-navigation watcher the `watchLocationChange`/`onLocationChange`
injector options use internally, exposed standalone. Multiple subscribers
share one underlying watcher (single interval or Navigation API listener),
started lazily on first subscribe and torn down when the last unsubscribes.

```ts
import { onLocationChange } from 'webext-content-ui';

const unsubscribe = onLocationChange(({ url, oldUrl }) => {
  console.log(`navigated ${oldUrl} -> ${url}`);
});
// later
unsubscribe();
```

### `matchesPattern` / `matchesAnyPattern`

The URL-matching logic behind the `matches` option, usable directly:

```ts
import { matchesPattern, matchesAnyPattern } from 'webext-content-ui';

matchesPattern(location.href, '*://*.youtube.com/*'); // boolean
matchesAnyPattern(location.href, [
  '*://*.youtube.com/*',
]); // boolean, OR semantics
```

## API

### `createShadowRootUi(options): ContentUi`
### `createIntegratedUi(options): ContentUi`
### `createIframeUi(options): ContentUi`

Same `ContentUiOptions` shape across all three — they differ only in where
content ends up:

| Function | Isolation | Host element |
|---|---|---|
| `createShadowRootUi` | Shadow DOM (style-isolated, same document) | `hostTag`, default `'div'` |
| `createIntegratedUi` | None — light DOM, inherits page styles | `hostTag`, default `'div'` |
| `createIframeUi` | Full — separate document/window | always `<iframe>`, `hostTag` ignored |

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Unique name, used as a `data-webext-content-ui` marker |
| `anchor` | `AnchorInput` | — | What to inject into — see [Anchors](#anchors) below |
| `position` | `'before' \| 'after' \| 'append' \| 'prepend' \| 'replace'` | `'append'` | Placement relative to each anchor |
| `sharedRoot` | `boolean` | `false` | Mount all anchors into one shared host (shadow root / light-DOM host / iframe) |
| `sharedStyle` | `boolean` | `true` | Dedupe CSS across hosts via `adoptedStyleSheets` |
| `styleKey` | `string` | `name` | Key used to dedupe styles across separate contentUi instances (and across separate content scripts sharing the same key — see [`getSharedCssText`](#getsharedcsstext)) |
| `css` | `string` | `''` | CSS text to inject |
| `matches` | `string[]` | — | WebExtension match patterns; `mount()` is a no-op unless `location.href` matches at least one — see [URL filtering](#url-filtering-with-matches) |
| `watchLocationChange` | `boolean` | `false` | Re-evaluate `matches` on SPA navigation and mount/unmount accordingly — see [Reacting to SPA navigation](#reacting-to-spa-navigation) |
| `onLocationChange` | `(detail: { url, oldUrl, matches }) => void` | — | Called on every SPA navigation; implies `watchLocationChange` on its own |
| `autoDetect` | `boolean` | `false` | Watch the DOM for new anchors matching the selector (string anchors only) |
| `hostTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the host element (`createShadowRootUi`/`createIntegratedUi` only) |
| `containerTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the inner container/slot element(s) |
| `isolateEvents` | `boolean \| string[]` | `true` | Shadow mode only. Stop propagation of events trying to bubble out the shadow root — `true` for default set (`keyup`, `keydown`, `keypress`), custom array for own list, `false` to disable |
| `autoSize` | `boolean` | `true` | Iframe mode only. Auto-resize the iframe host to match injected content's measured size via `ResizeObserver` |
| `onMount` | `(ctx: MountContext) => MountResult` | — | Called per matched anchor |
| `onRemove` | `(result, ctx) => void` | — | Called per anchor on removal |

`ContentUi` exposes `mount()`, `remove()`, and `instances()`.

`MountContext.host` and `MountContext.wrapper` (alias of `host`) are set
on every mode. `MountContext.shadowRoot` is only set by
`createShadowRootUi`; `MountContext.iframe` is only set by
`createIframeUi`. `createIntegratedUi` sets neither.

### Anchors

```ts
type AnchorValue =
  | Element
  | NodeListOf<Element>
  | HTMLCollectionOf<Element>
  | Element[]
  | null
  | undefined;

type AnchorResolver = (root: ParentNode) => AnchorValue;

type AnchorInput =
  | string
  | Element
  | AnchorResolver
  | Array<string | Element | AnchorResolver>;
```

Four ways to point `anchor` at something:

- **Selector string** (recommended default) — `anchor: '.table-row'`. Re-queried fresh every time anchors are resolved, so it never goes stale. Required for
  `autoDetect`.
- **Direct `Element` / `NodeList` / `HTMLCollection`** — `anchor: document.getElementById('foo')`. A snapshot taken at config time. Fine when you already know the element exists; won't pick up anything that appears later, and a `NodeList` from `querySelectorAll` is static, not live.
- **Resolver function** — called lazily each time anchors are resolved, so it stays fresh without needing a selector. Gives full control — first match only, `getElementById`, nth match, custom logic:

  ```ts
  anchor: (root) => root.querySelector('h2')          // first h2 only
  anchor: (root) => [...root.querySelectorAll('h2')]  // all h2s
  anchor: (root) => root.getElementById('foo')        // root must be Document
  ```

- **Array mixing any of the above** — e.g. `['.row', someElement, (root) =>
  root.querySelector('h2')]`; results are de-duplicated.

### Host/container tag

The host element gets `display: contents`, so the default `'div'` is
invisible either way — but if the anchor lives somewhere with strict child
rules (a `<table>`, a `<ul>`), set `hostTag`/`containerTag` to match:

```ts
createShadowRootUi({
  name: 'row-badge',
  anchor: 'tr.data-row',
  hostTag: 'td',
  onMount: ({ container }) => { container.textContent = '✓'; },
});
```

## License

MIT