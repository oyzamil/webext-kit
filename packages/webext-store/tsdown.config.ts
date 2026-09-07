import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/hook.ts"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	hash: false,
	deps: {
		alwaysBundle: ["dequal"],
		neverBundle: ["react", "@wxt-dev/browser", "superlock"],
	},
});
