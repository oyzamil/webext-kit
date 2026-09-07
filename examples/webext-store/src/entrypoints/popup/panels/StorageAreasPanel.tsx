import { useState } from 'react';
import { storage, type StorageArea, type StorageItemKey } from 'webext-store';
import { Button, Card, JsonBlock, LogList, Row, Select } from '@/components/ui';
import { useLog } from '@/hooks/useLog';

const AREAS: Array<{ name: StorageArea; desc: string }> = [
  { name: 'local', desc: 'Persists until removed. Not synced. Largest quota.' },
  { name: 'session', desc: 'In memory only — cleared when the browser/extension restarts.' },
  { name: 'sync', desc: "Synced across the user's signed-in devices. Small quota (~100KB)." },
  { name: 'managed', desc: 'Read-only, set by enterprise policy. Writes here always fail.' },
];

export function StorageAreasPanel() {
  const [area, setArea] = useState<StorageArea>('local');
  const [items, setItems] = useState<Record<string, unknown>>({});
  const { entries, log } = useLog();

  const handleWriteSample = async () => {
    if (area === 'managed') {
      log('managed is read-only — write skipped (this is expected, not a bug)');
      return;
    }
    const key = `${area}:sample` as StorageItemKey;
    await storage.setItem(key, { writtenAt: Date.now() });
    log(`setItem("${key}", ...)`);
  };

  const handleLoad = async () => {
    // snapshot() is a quick way to see everything currently in one area.
    const data = await storage.snapshot(area);
    setItems(data);
    log(`snapshot('${area}') -> ${Object.keys(data).length} key(s)`);
  };

  return (
    <Card title="Storage areas" subtitle="Same API, four different persistence/sync behaviors">
      <ul className="space-y-1.5">
        {AREAS.map((a) => (
          <li key={a.name} className="text-xs text-slate-600 dark:text-slate-300">
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] dark:bg-slate-800">
              {a.name}
            </code>{' '}
            — {a.desc}
          </li>
        ))}
      </ul>

      <Row>
        <Select options={AREAS.map((a) => a.name)} value={area} onChange={(e) => setArea(e.target.value as StorageArea)} />
        <Button variant="primary" onClick={handleWriteSample}>
          Write sample to {area}
        </Button>
        <Button onClick={handleLoad}>Load all in {area}</Button>
      </Row>

      <JsonBlock value={items} />
      <LogList entries={entries} />
    </Card>
  );
}
