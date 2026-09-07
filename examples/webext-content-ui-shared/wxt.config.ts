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
		name: "CSS Dup Demo",
		description:
			"Repro extension: popup + 2 content scripts all import the same tailwind.css. Inspect .output to see it duplicated per-entrypoint instead of shared once.",
		host_permissions: ["*://*.aliexpress.com/*", "*://*.ebay.com/*"],
	},
});
