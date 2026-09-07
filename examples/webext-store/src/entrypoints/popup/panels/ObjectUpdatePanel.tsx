import { useStorage } from "webext-store/react";

import { type AppSetting, appSettingItem } from "@/utils/storage-items";

import { useLog } from "@/hooks/useLog";

import { Button, Card, JsonBlock, LogList, Row } from "@/components/ui";

/**
 * webext-store stores each item as ONE JSON value. There's no server-side
 * "patch just this field" — updating one key is always read-modify-write:
 * spread the current value, override the key you're changing, setValue()
 * the whole object back. Exactly like plain React `useState` with an
 * object.
 */
export function ObjectUpdatePanel() {
	const { entries, log } = useLog();

	const { value, loading, setValue, patchValue } = useStorage(appSettingItem, {
		onChange: (newValue, oldValue) => {
			// Diff the two objects so the log shows exactly which key changed —
			// this is on you to do; webext-store only tells you old vs. new,
			// both as whole objects.
			const before = oldValue ?? appSettingItem.fallback;
			const after = newValue ?? appSettingItem.fallback;
			const changedKeys = (
				Object.keys(after) as Array<keyof AppSetting>
			).filter((k) => before[k] !== after[k]);
			log(
				changedKeys.length
					? `changed: ${changedKeys.map((k) => `${k} ${JSON.stringify(before[k])} -> ${JSON.stringify(after[k])}`).join(", ")}`
					: "onChange fired, no keys actually differ",
			);
		},
	});

	// Update ONE key. Both do the same thing — patchValue is just the
	// shorthand, and re-reads the current value from storage itself instead
	// of trusting `value` from this render, so back-to-back calls can't
	// clobber each other.
	const toggleTheme = () =>
		patchValue({ theme: value.theme === "dark" ? "light" : "dark" });
	const toggleFree = () => setValue({ ...value, free: !value.free });

	return (
		<Card
			title="Updating one key in an object"
			subtitle={`const appSettingItem = storage.defineItem('local:appSetting', { fallback: { theme: 'dark', free: true } })`}
		>
			<JsonBlock value={value} />

			<Row>
				<Button variant="primary" onClick={toggleTheme} disabled={loading}>
					Toggle theme (patchValue)
				</Button>
				<Button variant="primary" onClick={toggleFree} disabled={loading}>
					Toggle free (setValue + spread)
				</Button>
			</Row>

			<div className="rounded-md bg-slate-900 p-2.5 text-[11px] text-slate-100 leading-relaxed">
				<p className="font-semibold text-slate-300">The pattern:</p>
				<pre className="mt-1 whitespace-pre-wrap text-emerald-300">{`const { value, setValue, patchValue } = useStorage(appSettingItem);

// shorthand — merges into whatever's currently stored:
await patchValue({ theme: 'light' });

// equivalent, done manually:
await setValue({ ...value, theme: 'light' });`}</pre>
				<p className="mt-2 font-semibold text-slate-300">
					Subscribing to changes:
				</p>
				<pre className="mt-1 whitespace-pre-wrap text-emerald-300">{`useStorage(appSettingItem, {
  onChange: (newValue, oldValue) => {
    // newValue/oldValue are the WHOLE object each time —
    // diff them yourself if you only care about one key:
    if (newValue.theme !== oldValue?.theme) { /* ... */ }
  },
});`}</pre>
				<p className="mt-2 text-slate-400">
					If two keys change independently and often, and you don't want every
					write to one to re-render/notify watchers of the other, give them
					separate items/keys instead of one object — that's the only way to get
					per-key granularity with a key-value store.
				</p>
			</div>

			<LogList entries={entries} />
		</Card>
	);
}
