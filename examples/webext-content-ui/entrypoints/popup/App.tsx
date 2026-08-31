import { useState } from "react";

export default function App() {
	const [status, setStatus] = useState<"idle" | "on" | "off">("idle");

	async function toggle(action: "mount" | "unmount") {
		const [tab] = await browser.tabs.query({
			active: true,
			currentWindow: true,
		});
		if (!tab?.id) return;

		try {
			await browser.tabs.sendMessage(tab.id, {
				type: "webext-content-ui-demo:toggle",
				action,
			});
			setStatus(action === "mount" ? "on" : "off");
		} catch {
			// Content script isn't injected on this page (e.g. chrome:// URLs).
			setStatus("idle");
		}
	}

	return (
		<div className="w-72 space-y-3 bg-slate-900 p-4 font-sans text-slate-100">
			<div>
				<h1 className="font-semibold text-sm text-white tracking-wide">
					webext-content-ui demo
				</h1>
				<p className="mt-1 text-slate-400 text-xs">
					Batch-injects a badge next to every{" "}
					<code className="text-teal-300">&lt;h2&gt;</code> on the page, all
					sharing one Tailwind stylesheet across their shadow roots.
				</p>
			</div>

			<div className="flex gap-2">
				<button
					type="button"
					onClick={() => toggle("mount")}
					className="flex-1 rounded-md bg-teal-500 px-3 py-2 font-medium text-slate-900 text-xs transition-colors hover:bg-teal-400"
				>
					Inject
				</button>
				<button
					type="button"
					onClick={() => toggle("unmount")}
					className="flex-1 rounded-md bg-slate-700 px-3 py-2 font-medium text-slate-100 text-xs transition-colors hover:bg-slate-600"
				>
					Remove
				</button>
			</div>

			<p className="text-[11px] text-slate-500">
				Status: <span className="font-medium text-slate-300">{status}</span>
			</p>
		</div>
	);
}
