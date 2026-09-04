import "@/assets/tailwind.css";

export default defineContentScript({
	matches: ["*://*.aliexpress.com/*", "*://*.example.com/*"],
	cssInjectionMode: "manual",
	main() {},
});
