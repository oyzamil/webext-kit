import { useRef, useState } from 'react';
import { storage, type StorageArea } from 'webext-store';
import { Button, Card, Field, Input, JsonBlock, LogList, Row, Select } from '@/components/ui';
import { useLog } from '@/hooks/useLog';

const AREAS: StorageArea[] = ['local', 'session', 'sync'];

export function SnapshotPanel() {
  const [area, setArea] = useState<StorageArea>('local');
  const [excludeKeys, setExcludeKeys] = useState('');
  const [snapshot, setSnapshot] = useState<Record<string, unknown> | null>(null);
  const { entries, log } = useLog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSnapshot = async () => {
    const keys = excludeKeys
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const data = await storage.snapshot(area, keys.length ? { excludeKeys: keys } : undefined);
    setSnapshot(data);
    log(`snapshot('${area}'${keys.length ? `, { excludeKeys: [${keys.join(', ')}] }` : ''})`);
  };

  const handleRestore = async () => {
    if (!snapshot) {
      log('Nothing to restore — take a snapshot first.');
      return;
    }
    await storage.restoreSnapshot(area, snapshot);
    log(`restoreSnapshot('${area}', <snapshot>) — new keys since then are kept, not overwritten`);
  };

  const handleDownload = () => {
    if (!snapshot) {
      log('Nothing to download — take a snapshot first.');
      return;
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `webext-store-${area}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    log(`downloaded snapshot as JSON file`);
  };

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setSnapshot(parsed);
      log(`loaded "${file.name}" — click restoreSnapshot to write it into '${area}'`);
    } catch {
      log(`"${file.name}" is not valid JSON — not loaded`);
    }
  };

  return (
    <Card
      title="Snapshot & restore"
      subtitle="storage.snapshot / restoreSnapshot for a whole storage area, plus export/import as a file"
    >
      <Row>
        <Field label="Area">
          <Select options={AREAS} value={area} onChange={(e) => setArea(e.target.value as StorageArea)} />
        </Field>
        <Field label="excludeKeys (comma-separated, optional)">
          <Input value={excludeKeys} onChange={(e) => setExcludeKeys(e.target.value)} placeholder="batchA, batchB" />
        </Field>
      </Row>
      <Row>
        <Button variant="primary" onClick={handleSnapshot}>
          snapshot
        </Button>
        <Button onClick={handleRestore}>restoreSnapshot</Button>
        <Button onClick={handleDownload}>Download as JSON</Button>
        <Button onClick={() => fileInputRef.current?.click()}>Import from file</Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = '';
          }}
        />
      </Row>
      <JsonBlock value={snapshot} />
      <LogList entries={entries} />
    </Card>
  );
}
