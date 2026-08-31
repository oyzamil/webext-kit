# webext-content-ui-demo

Example WXT extension (React 19 + TypeScript + Tailwind CSS v4) showing
`webext-content-ui` in real use.

## What it does

- Popup has **Inject** / **Remove** buttons.
- **Inject** messages the active tab's content script, which calls
  `createShadowUi` (from `webext-content-ui`) to batch-inject a small React
  badge after every `<h2>` on the page — each badge gets its own shadow
  root, but all of them share **one** Tailwind stylesheet via
  `adoptedStyleSheets` (see `entrypoints/example.content/index.tsx`).
- `autoDetect: true` means badges also appear on `<h2>`s added after the
  initial injection (SPA navigation, infinite scroll, etc.).
- **Remove** unmounts everything and cleans up.

## Where the integration lives

`entrypoints/example.content/index.tsx` is the whole point of this repo:

```ts
const tailwindCss = await import('./style.css?inline'); // compiled CSS as a string

injector = createShadowUi({
  name: 'webext-content-ui-demo-badge',
  anchor: 'h2',
  sharedStyle: true,
  css: tailwindCss,
  autoDetect: true,
  onMount: ({ container, index }) => {
    const root = createRoot(container);
    root.render(<Badge index={index} />);
    return root;
  },
  onRemove: (root) => root.unmount(),
});
```

Because `webext-content-ui` does its own style injection, the content script
sets `cssInjectionMode: 'manual'` in `defineContentScript` — WXT's own CSS
pipeline is not used for the injected badges.

## Run it

```bash
npm install
npm run dev        # Chrome, with HMR — loads .output/chrome-mv3-dev as an unpacked extension
npm run dev:firefox
```

Then open `chrome://extensions`, enable Developer Mode, and "Load unpacked"
pointing at the printed `.output/...` directory if it isn't auto-loaded by
`wxt`'s dev server.

## Build

```bash
npm run build          # -> .output/chrome-mv3
npm run build:firefox  # -> .output/firefox-mv2
npm run zip             # -> .output/*.zip, ready for store upload
```

## Stack

- [WXT](https://wxt.dev) `0.21` — extension framework
- React 19 + `@wxt-dev/module-react`
- Tailwind CSS v4 via `@tailwindcss/vite`
- [`webext-content-ui`](../webext-content-ui) — linked as a local `file:` dependency here;
  swap for the published npm version once you publish it.
