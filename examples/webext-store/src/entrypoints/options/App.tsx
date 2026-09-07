import { useStorage } from "webext-store/react";

import { settingsItem } from "@/utils/storage-items";

import { Button, Card, Field, Input, Row } from "@/components/ui";

/**
 * Real settings page, not a toy — this is the same `settingsItem` the popup
 * reads. Change something here, then open the popup's "defineItem" tab: it
 * updates live via the same `watch()` subscription, no messaging required.
 */
function App() {
	const { value, loading, setValue } = useStorage(settingsItem);

	if (loading) return null;

	return (
		<div className="mx-auto max-w-md space-y-4 bg-slate-50 p-6 dark:bg-slate-950">
			<header>
				<h1 className="font-bold text-lg text-slate-900 dark:text-slate-100">
					webext-store demo — Options
				</h1>
				<p className="text-slate-500 text-xs dark:text-slate-400">
					A full extension page (not the popup) reading/writing the exact same{" "}
					<code>sync:settings</code> item.
				</p>
			</header>

			<Card
				title="Settings"
				subtitle="Backed by storage.defineItem('sync:settings', ...)"
			>
				<Field label="Display name">
					<Input
						value={value.displayName}
						onChange={(e) =>
							setValue({ ...value, displayName: e.target.value })
						}
					/>
				</Field>
				<Row>
					<span className="text-slate-600 text-xs dark:text-slate-300">
						Theme: <strong>{value.theme}</strong>
					</span>
					<Button
						variant="primary"
						onClick={() =>
							setValue({
								...value,
								theme: value.theme === "dark" ? "light" : "dark",
							})
						}
					>
						Toggle theme
					</Button>
				</Row>
			</Card>
		</div>
	);
}

export default App;
