import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/hook.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  // dequal/lite is tiny and has no runtime deps of its own — inline it so
  // consumers don't need to install it separately. Everything else
  // (including react, which is only ever pulled in via hook.ts) stays
  // external and resolved from the consumer's own node_modules.
  deps: {
    alwaysBundle: ['dequal'],
    neverBundle: ['react', '@wxt-dev/browser', 'superlock'],
  },
});
