import { defineConfig } from "tsdown";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/hook.ts",
		"src/relay.ts",
		"src/port.ts",
		"src/pub-sub.ts",
		"src/message.ts",
		"src/background.ts",
	],
	format: ["esm", "cjs"],
	outExtensions: ({ format }) =>
		format === "cjs"
			? { js: ".cjs", dts: ".d.cts" }
			: { js: ".js", dts: ".d.ts" },
	dts: true,
	clean: true,
	minify: true,
	sourcemap: false,
	deps: {
		neverBundle: ["react"],
	},
});
