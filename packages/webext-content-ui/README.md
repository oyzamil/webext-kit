# webext-content-ui

Inject elements into Shadow DOM — single element or batch of anchors, with
optional shared styles across shadow roots. Combines Plasmo's batch-anchor
injection with WXT's clean UI API and CSS deduplication neither has
built-in.

## Install

```bash
npm install webext-content-ui
```

## Why

- **Plasmo** can batch multiple anchors into one shared shadow root
  (`getOverlayAnchorList`), but each inline anchor still gets its own
  separate shadow + style injection.
- **WXT** has a cleaner `createShadowRootUi` / `createIntegratedUi` API, but
  no built-in batching, and duplicates the same CSS (e.g. Tailwind output)
  once per shadow root / entrypoint.

This package gives you both: batch or single anchors, a `sharedRoot` mode
for Plasmo-overlay-style single-shadow injection, and a `sharedStyle` mode
that dedupes CSS text across shadow roots via `adoptedStyleSheets` (falling
back to a plain `<style>` tag per root on runtimes without constructible
stylesheets).

## Usage

### Single element

```ts
import { createShadowUi } from 'webext-content-ui';

const injector = createShadowUi({
  name: 'my-widget',
  anchor: '#target',
  css: '.btn { color: hotpink; }',
  onMount: ({ container }) => {
    container.innerHTML = '<button class="btn">Click</button>';
  },
});

injector.mount();
// later
injector.remove();
```

### Batch anchors, separate shadow roots, shared styles

```ts
const injector = createShadowUi({
  name: 'row-action',
  anchor: '.table-row', // selector, Element, or Element[]
  css: tailwindCss, // shared across every .table-row's shadow root
  sharedStyle: true, // default
  autoDetect: true, // auto-mount into rows added later
  onMount: ({ container, anchor, index }) => {
    container.innerHTML = `<button>Action ${index}</button>`;
  },
});

injector.mount();
```

### Batch anchors, one shared shadow root (Plasmo-overlay style)

```ts
const injector = createShadowUi({
  name: 'overlay',
  anchor: '.highlight-target',
  sharedRoot: true, // ONE shadow root for all matched anchors
  css: sharedCss,
  onMount: ({ container }) => {
    container.textContent = 'Highlighted';
  },
});

injector.mount();
```

### Integrated UI (no shadow root, light DOM)

```ts
import { createIntegratedUi } from 'webext-content-ui';

const injector = createIntegratedUi({
  name: 'inline-badge',
  anchor: '.item-title',
  onMount: ({ container }) => {
    container.textContent = 'New';
  },
});

injector.mount();
```

Content lands directly in the page's DOM — no shadow boundary. Page CSS
reaches your markup and vice versa, which is what you want when the
injected content should visually blend into the page (or reuse the page's
own classes) rather than stay isolated. `css` is injected once into the
page's own `<head>`, deduped by `styleKey`.

### Iframe UI (full isolation)

```ts
import { createIframeUi } from 'webext-content-ui';

const injector = createIframeUi({
  name: 'sandboxed-widget',
  anchor: '#target',
  css: '.btn { color: hotpink; }',
  onMount: ({ container }) => {
    container.innerHTML = '<button class="btn">Click</button>';
  },
});

injector.mount();
```

Each anchor gets an `<iframe>` — a separate `window`/`document`, so no CSS
or global JS leaks either direction. Heavier than a shadow root; use it
when isolation must survive things a shadow root doesn't stop (e.g. page
stylesheets targeting `*`, or global CSS resets). The iframe is never
navigated (no `src`/`srcdoc`) — its initial document is synchronously
forced into a stable html/head/body via `document.write` right after
insertion, so `contentDocument` is ready to use immediately, no load event
to wait for. `hostTag` doesn't apply here (the host is always `<iframe>`).

## API

### `createShadowUi(options): Injector`
### `createIntegratedUi(options): Injector`
### `createIframeUi(options): Injector`

Same `InjectOptions` shape across all three — they differ only in where
content ends up:

| Function | Isolation | Host element |
|---|---|---|
| `createShadowUi` | Shadow DOM (style-isolated, same document) | `hostTag`, default `'div'` |
| `createIntegratedUi` | None — light DOM, inherits page styles | `hostTag`, default `'div'` |
| `createIframeUi` | Full — separate document/window | always `<iframe>`, `hostTag` ignored |

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Unique name, used as a `data-webext-content-ui` marker |
| `anchor` | `AnchorInput` | — | What to inject into — see [Anchors](#anchors) below |
| `position` | `'before' \| 'after' \| 'append' \| 'prepend' \| 'replace'` | `'append'` | Placement relative to each anchor |
| `sharedRoot` | `boolean` | `false` | Mount all anchors into one shared host (shadow root / light-DOM host / iframe) |
| `sharedStyle` | `boolean` | `true` | Dedupe CSS across hosts via `adoptedStyleSheets` |
| `styleKey` | `string` | `name` | Key used to dedupe styles across separate injector instances |
| `css` | `string` | `''` | CSS text to inject |
| `autoDetect` | `boolean` | `false` | Watch the DOM for new anchors matching the selector (string anchors only) |
| `hostTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the host element (`createShadowUi`/`createIntegratedUi` only) |
| `containerTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the inner container/slot element(s) |
| `onMount` | `(ctx: MountContext) => MountResult` | — | Called per matched anchor |
| `onRemove` | `(result, ctx) => void` | — | Called per anchor on removal |

`Injector` exposes `mount()`, `remove()`, and `instances()`.

`MountContext.shadowRoot` is only set by `createShadowUi`; `MountContext.iframe`
is only set by `createIframeUi`. `createIntegratedUi` sets neither.
| `autoDetect` | `boolean` | `false` | Watch the DOM for new anchors matching the selector (string anchors only) |
| `hostTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the shadow host element |
| `containerTag` | `keyof HTMLElementTagNameMap` | `'div'` | Tag name for the inner container/slot element(s) |
| `onMount` | `(ctx: MountContext) => MountResult` | — | Called per matched anchor |
| `onRemove` | `(result, ctx) => void` | — | Called per anchor on removal |

`Injector` exposes `mount()`, `remove()`, and `instances()`.

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

- **Selector string** (recommended default) — `anchor: '.table-row'`. Re-queried
  fresh every time anchors are resolved, so it never goes stale. Required for
  `autoDetect`.
- **Direct `Element` / `NodeList` / `HTMLCollection`** — `anchor:
  document.getElementById('foo')`. A snapshot taken at config time. Fine when
  you already know the element exists; won't pick up anything that appears
  later, and a `NodeList` from `querySelectorAll` is static, not live.
- **Resolver function** — called lazily each time anchors are resolved, so it
  stays fresh without needing a selector. Gives full control — first match
  only, `getElementById`, nth match, custom logic:

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
createShadowUi({
  name: 'row-badge',
  anchor: 'tr.data-row',
  hostTag: 'td',
  onMount: ({ container }) => { container.textContent = '✓'; },
});
```

## Development

```bash
npm install
npm run build       # tsdown -> dist/ (ESM + CJS + .d.ts)
npm test            # vitest
npm run test:coverage
npm run lint         # biome check
npm run typecheck    # tsc --noEmit
```

## License

MIT