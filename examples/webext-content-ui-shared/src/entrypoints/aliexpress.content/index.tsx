import ReactDOM, { type Root } from "react-dom/client";
import { createShadowRootUi } from "webext-content-ui";

import { SharedPanel } from "@/components/SharedPanel";

import tailwindCss from "@/assets/tailwind.css?inline";

export default defineContentScript({
	matches: ["*://*.aliexpress.com/*"],
	cssInjectionMode: "manual",

	async main() {
		const ui = createShadowRootUi({
			name: "css-dup-demo-aliexpress",
			position: "after",
			anchor: "body",
			css: tailwindCss,
			onMount: ({ container }) => {
				const root = ReactDOM.createRoot(container);
				root.render(<SharedPanel label="aliexpress.content" />);
				return root;
			},
			onRemove: (root) => {
				(root as Root).unmount();
			},
		});

		ui.mount();
	},
});
