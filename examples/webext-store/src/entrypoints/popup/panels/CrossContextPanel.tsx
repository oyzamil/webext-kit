import { useStorage } from "webext-store";

import { heartbeatItem } from "@/utils/storage-items";

import { Button, Card, Row } from "@/components/ui";

export function CrossContextPanel() {
	const { value, loading } = useStorage(heartbeatItem);

	const pingBackground = () => {
		browser.runtime.sendMessage({ type: "bump-heartbeat" });
	};

	return (
		<Card
			title="Cross-context reactivity"
			subtitle="The background service worker bumps local:heartbeat on its own every ~3s via browser.alarms. This value updates with no polling or refetch in this popup — just the same useStorage subscription as the previous tab."
		>
			<div className="font-bold text-3xl text-emerald-600 dark:text-emerald-400">
				{loading ? "…" : value}
			</div>
			<Row>
				<Button variant="primary" onClick={pingBackground}>
					Message background: bump now
				</Button>
			</Row>
			<p className="text-[11px] text-slate-500 dark:text-slate-400">
				Leave this tab open and watch the number climb on its own — that write
				is coming from a completely separate execution context (the service
				worker), not from this component.
			</p>
		</Card>
	);
}
