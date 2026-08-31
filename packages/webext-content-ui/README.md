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

## API

### `createShadowUi(options): Injector`

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | — | Unique name, used as a `data-webext-content-ui` marker |
| `anchor` | `AnchorInput` | — | What to inject into — see [Anchors](#anchors) below |
| `position` | `'before' \| 'after' \| 'append' \| 'prepend' \| 'replace'` | `'append'` | Placement relative to each anchor |
| `sharedRoot` | `boolean` | `false` | Mount all anchors into one shared shadow root |
| `sharedStyle` | `boolean` | `true` | Dedupe CSS across shadow roots via `adoptedStyleSheets` |
| `styleKey` | `string` | `name` | Key used to dedupe styles across separate injector instances |
| `css` | `string` | `''` | CSS text to inject |
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
