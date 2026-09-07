import { useState } from "react";

import { BatchPanel } from "./panels/BatchPanel";
import { CrossContextPanel } from "./panels/CrossContextPanel";
import { DefineItemPanel } from "./panels/DefineItemPanel";
import { HookPanel } from "./panels/HookPanel";
import { MetadataPanel } from "./panels/MetadataPanel";
import { ObjectUpdatePanel } from "./panels/ObjectUpdatePanel";
import { RawApiPanel } from "./panels/RawApiPanel";
import { SnapshotPanel } from "./panels/SnapshotPanel";
import { StorageAreasPanel } from "./panels/StorageAreasPanel";

const TABS = [
	{ id: "raw", label: "Raw API", render: () => <RawApiPanel /> },
	{ id: "areas", label: "Areas", render: () => <StorageAreasPanel /> },
	{ id: "batch", label: "Batch", render: () => <BatchPanel /> },
	{ id: "meta", label: "Metadata", render: () => <MetadataPanel /> },
	{ id: "snapshot", label: "Snapshot", render: () => <SnapshotPanel /> },
	{ id: "define", label: "defineItem", render: () => <DefineItemPanel /> },
	{ id: "object", label: "Update 1 key", render: () => <ObjectUpdatePanel /> },
	{ id: "hook", label: "React hook", render: () => <HookPanel /> },
	{ id: "cross", label: "Cross-context", render: () => <CrossContextPanel /> },
] as const;

function App() {
	const [activeId, setActiveId] = useState<(typeof TABS)[number]["id"]>("raw");
	const active = TABS.find((t) => t.id === activeId) ?? TABS[0];

	return (
		<div className="flex h-[560px] w-[440px] flex-col bg-slate-50 dark:bg-slate-950">
			<header className="border-slate-200 border-b bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
				<h1 className="font-bold text-slate-900 text-sm dark:text-slate-100">
					webext-store — feature demo
				</h1>
				<p className="text-[11px] text-slate-500 dark:text-slate-400">
					Every API surface, exercised live against real extension storage. Also
					runs in the options page and as a badge on every tab (content script)
					— same package, three different contexts.
				</p>
			</header>

			<nav className="flex flex-wrap gap-1 border-slate-200 border-b bg-white px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900">
				{TABS.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveId(tab.id)}
						className={`rounded px-2 py-1 font-medium text-[11px] transition-colors ${
							tab.id === activeId
								? "bg-indigo-600 text-white"
								: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
						}`}
					>
						{tab.label}
					</button>
				))}
			</nav>

			<main className="flex-1 overflow-y-auto p-3">{active.render()}</main>

			<footer className="border-slate-200 border-t bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
				<button
					className="text-[11px] text-indigo-600 hover:underline dark:text-indigo-400"
					onClick={() => browser.runtime.openOptionsPage()}
				>
					Open options page →
				</button>
			</footer>
		</div>
	);
}

export default App;
