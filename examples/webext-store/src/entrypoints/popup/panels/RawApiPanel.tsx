import { useEffect, useRef, useState } from "react";
import { type StorageArea, storage } from "webext-store";

import { useLog } from "@/hooks/useLog";

import {
	Button,
	Card,
	Field,
	Input,
	JsonBlock,
	LogList,
	Row,
	Select,
	Textarea,
} from "@/components/ui";

const AREAS: StorageArea[] = ["local", "session", "sync"];

export function RawApiPanel() {
	const [area, setArea] = useState<StorageArea>("local");
	const [key, setKey] = useState("demoKey");
	const [valueJson, setValueJson] = useState('"hello world"');
	const [result, setResult] = useState<unknown>(undefined);
	const [watching, setWatching] = useState(false);
	const { entries, log } = useLog();
	const unwatchRef = useRef<(() => void) | null>(null);

	const fullKey = `${area}:${key}` as const;

	useEffect(() => () => unwatchRef.current?.(), []);

	const handleGet = async () => {
		const value = await storage.getItem(fullKey);
		setResult(value);
		log(`getItem("${fullKey}") -> ${JSON.stringify(value)}`);
	};

	const handleSet = async () => {
		let parsed: unknown;
		try {
			parsed = JSON.parse(valueJson);
		} catch {
			log("Invalid JSON — not written.");
			return;
		}
		await storage.setItem(fullKey, parsed);
		log(`setItem("${fullKey}", ${valueJson})`);
	};

	const handleRemove = async () => {
		await storage.removeItem(fullKey, { removeMeta: true });
		setResult(null);
		log(`removeItem("${fullKey}", { removeMeta: true })`);
	};

	const toggleWatch = () => {
		if (watching) {
			unwatchRef.current?.();
			unwatchRef.current = null;
			setWatching(false);
			log(`unwatch() for "${fullKey}"`);
			return;
		}
		unwatchRef.current = storage.watch(fullKey, (newValue, oldValue) => {
			setResult(newValue);
			log(
				`watch fired: ${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`,
			);
		});
		setWatching(true);
		log(`watch("${fullKey}") subscribed`);
	};

	return (
		<Card
			title="Raw API playground"
			subtitle="storage.getItem / setItem / removeItem / watch / unwatch"
		>
			<Row>
				<Field label="Area">
					<Select
						options={AREAS}
						value={area}
						onChange={(e) => setArea(e.target.value as StorageArea)}
					/>
				</Field>
				<Field label="Key (without area prefix)">
					<Input value={key} onChange={(e) => setKey(e.target.value)} />
				</Field>
			</Row>
			<Field label="Value (JSON)">
				<Textarea
					rows={2}
					value={valueJson}
					onChange={(e) => setValueJson(e.target.value)}
				/>
			</Field>
			<Row>
				<Button variant="primary" onClick={handleSet}>
					setItem
				</Button>
				<Button onClick={handleGet}>getItem</Button>
				<Button variant="danger" onClick={handleRemove}>
					removeItem
				</Button>
				<Button
					variant={watching ? "danger" : "secondary"}
					onClick={toggleWatch}
				>
					{watching ? "unwatch" : "watch"}
				</Button>
			</Row>
			<JsonBlock value={result} />
			<LogList entries={entries} />
		</Card>
	);
}
