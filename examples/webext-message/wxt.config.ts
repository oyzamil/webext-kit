import { defineConfig } from "wxt";

export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/auto-icons"],
	autoIcons: {
		baseIconPath: "assets/icon.png",
	},
	manifest: {
		name: "webext-message Demo",
		version: "1.0.0",
		description: "Comprehensive demo of webext-message messaging library",
		permissions: ["tabs", "scripting"],
		host_permissions: ["<all_urls>"],
		options_ui: {
			page: "opts.html",
			open_in_tab: true,
		},
	},
	webExt: {
		disabled: true,
	},
});
