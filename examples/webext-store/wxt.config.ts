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
		name: "webext-store Demo",
		description: "Every webext-store feature, across every extension context: background, popup, options, content script.",
		permissions: ["storage", "alarms"],
		options_ui: {
			page: "options.html",
			open_in_tab: true,
		},
	},
	webExt: {
		disabled: true,
	},
});
