import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
	autoIcons: {
		baseIconPath: "assets/icon.png",
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	manifest: {
		name: "webext-content-ui demo",
		description:
			"Injects a batch-anchored React UI into a page via webext-content-ui, with deduped Tailwind styles.",
		permissions: [],
	},
	webExt: {
		disabled: true,
	},
});
