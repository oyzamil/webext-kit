import { useState } from "react";
import { storage } from "webext-store";

import { BATCH_KEYS } from "@/utils/storage-items";

import { useLog } from "@/hooks/useLog";

import { Button, Card, JsonBlock, LogList, Row } from "@/components/ui";

export function BatchPanel() {
	const [items, setItems] = useState<Array<{ key: string; value: unknown }>>(
		[],
	);
	const [metas, setMetas] = useState<Array<{ key: string; meta: unknown }>>([]);
	const { entries, log } = useLog();

	const handleSetAll = async () => {
		await storage.setItems(
			BATCH_KEYS.map((key) => ({
				key,
				value: Math.round(Math.random() * 1000),
			})),
		);
		log(`setItems([...${BATCH_KEYS.length} keys]) with random numbers`);
	};

	const handleGetAll = async () => {
		const values = await storage.getItems([...BATCH_KEYS]);
		setItems(values);
		log(`getItems([...${BATCH_KEYS.length} keys])`);
	};

	const handleGetMetas = async () => {
		const values = await storage.getMetas([...BATCH_KEYS]);
		setMetas(values);
		log(`getMetas([...${BATCH_KEYS.length} keys])`);
	};

	const handleSetMetas = async () => {
		await storage.setMetas(
			BATCH_KEYS.map((key) => ({ key, meta: { touchedAt: Date.now() } })),
		);
		log("setMetas([...]) — stamped touchedAt on every batch key");
	};

	const handleRemoveAll = async () => {
		await storage.removeItems([...BATCH_KEYS]);
		setItems([]);
		setMetas([]);
		log(`removeItems([...${BATCH_KEYS.length} keys])`);
	};

	const handleClearArea = async () => {
		await storage.clear("local");
		setItems([]);
		setMetas([]);
		log("clear('local') — wiped the ENTIRE local storage area");
	};

	return (
		<Card
			title="Batch operations"
			subtitle={`storage.setItems / getItems / setMetas / getMetas / removeItems / clear over ${BATCH_KEYS.join(", ")}`}
		>
			<Row>
				<Button variant="primary" onClick={handleSetAll}>
					setItems (random)
				</Button>
				<Button onClick={handleGetAll}>getItems</Button>
				<Button onClick={handleSetMetas}>setMetas</Button>
				<Button onClick={handleGetMetas}>getMetas</Button>
				<Button variant="danger" onClick={handleRemoveAll}>
					removeItems
				</Button>
				<Button variant="danger" onClick={handleClearArea}>
					clear('local')
				</Button>
			</Row>
			<JsonBlock value={{ items, metas }} />
			<LogList entries={entries} />
		</Card>
	);
}
