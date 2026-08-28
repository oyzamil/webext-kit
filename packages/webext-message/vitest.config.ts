import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(import.meta.dirname, "./src"),
		},
	},
	test: {
		environment: "jsdom",
		include: ["tests/**/*.test.ts"],
		coverage: {
			include: ["src/**/*.ts"],
			exclude: ["src/**/*.d.ts", "src/**/index.ts"],
		},
	},
});
