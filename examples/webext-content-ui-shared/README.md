# wxt-css-dup-demo

Repro for: **WXT emits duplicate CSS per-entrypoint instead of one shared chunk**, when multiple entrypoints import the same stylesheet (Tailwind v4 here).

## Stack

- wxt (latest, 0.21.x)
- tailwindcss v4 (`@tailwindcss/vite` plugin)
- react 19

## Structure

```
src/
├── assets/tailwind.css          ← ONE shared stylesheet
├── components/SharedPanel.tsx   ← ONE shared component, uses tailwind classes
└── entrypoints/
    ├── popup/main.tsx           ← imports "@/assets/tailwind.css"
    ├── aliexpress.content/      ← imports "@/assets/tailwind.css"
    └── ebay.content/            ← imports "@/assets/tailwind.css"
```

All three entrypoints import the exact same `tailwind.css` file and render the
same `SharedPanel` component.

## Run it

```bash
npm install
npm run build
```

## Result (measured on this build)

```
.output/chrome-mv3/assets/popup-BigEk5jR.css        12K
.output/chrome-mv3/content-scripts/aliexpress.css   8.0K
.output/chrome-mv3/content-scripts/ebay.css         12K
```

`diff` between `popup-*.css` and `content-scripts/ebay.css` → **empty**. Byte-identical
Tailwind output, emitted twice. `aliexpress.css` is slightly smaller only because
its shadow-root UI mode scopes some selectors differently — it's still the same
underlying stylesheet shipped a third time.

Expected/desired: one shared CSS asset (e.g. `assets/shared-[hash].css`) referenced
by all three entrypoints, instead of 3 independently-bundled copies of the same
Tailwind output.

## Why it matters

Small demo here shows ~20-30KB wasted from 3 entrypoints. In a real extension with
a full design system and 10+ content scripts targeting different sites, this scales
linearly — same shared stylesheet duplicated once per entrypoint, bloating `.output`
size and extension package size for zero benefit.
