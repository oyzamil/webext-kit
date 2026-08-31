import { createRoot, type Root } from "react-dom/client";
import { createShadowUi, type Injector } from "webext-content-ui";

// `?inline` gives us the compiled Tailwind CSS as a plain string (Vite feature),
// so webext-content-ui can hand it to `adoptedStyleSheets` itself instead of
// relying on WXT's own per-shadow-root CSS injection.
import tailwindCss from "@/assets/tailwind.css?inline";
import Badge from "./Badge";

export default defineContentScript({
	matches: ["*://*/*"],
	cssInjectionMode: "manual", // we inject CSS ourselves, via webext-content-ui's sharedStyle
	main() {
		let injector: Injector | null = null;

		function mount() {
			if (injector) return;

			injector = createShadowUi({
				name: "webext-content-ui-demo-badge",
				anchor: "h2",
				position: "after",
				// sharedRoot: false, // each h2 gets its own shadow root...
				sharedStyle: true, // ...but they all share ONE Tailwind stylesheet
				css: tailwindCss,
				autoDetect: true, // pick up <h2>s added later (SPA navigation, infinite scroll, etc.)
				onMount: ({ container, index }) => {
					const root: Root = createRoot(container);
					root.render(<Badge index={index} />);
					return root; // handed back to onRemove
				},
				onRemove: (root) => {
					(root as Root).unmount();
				},
			});

			injector.mount();
		}

		function unmount() {
			injector?.remove();
			injector = null;
		}

		mount();

		browser.runtime.onMessage.addListener((message) => {
			if (
				typeof message === "object" &&
				message !== null &&
				"type" in message &&
				message.type === "webext-content-ui-demo:toggle"
			) {
				if (message.action === "mount") mount();
				if (message.action === "unmount") unmount();
			}
		});
	},
});
