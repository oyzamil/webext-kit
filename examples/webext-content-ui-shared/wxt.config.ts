import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react"],
	vite: () => ({
		plugins: [tailwindcss()],
	}),
	srcDir: "src",
	manifest: {
		name: "CSS Dup Demo",
		description:
			"Repro extension: popup + 2 content scripts all import the same tailwind.css. Inspect .output to see it duplicated per-entrypoint instead of shared once.",
		permissions: [],
		icons: {
			16: "icon-16.png",
			32: "icon-32.png",
			48: "icon-48.png",
			128: "icon-128.png",
		},
		// matches used purely so the two content scripts have somewhere to inject
		host_permissions: ["*://*.aliexpress.com/*", "*://*.ebay.com/*"],
	},
});
