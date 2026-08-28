import { defineConfig } from "wxt";

export default defineConfig({
	manifest: {
		name: "webext-message Demo",
		version: "1.0.0",
		description: "Comprehensive demo of webext-message messaging library",
		permissions: ["tabs", "scripting"],
		host_permissions: ["<all_urls>"],
	},
	srcDir: "src",
	webExt: {
		disabled: true,
	},
});
