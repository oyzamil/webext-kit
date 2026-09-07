import { useState } from 'react';
import { storage } from 'webext-store';
import { Button, Card, Field, Input, JsonBlock, LogList, Row } from '@/components/ui';
import { useLog } from '@/hooks/useLog';

const KEY = 'local:batchA' as const;

export function MetadataPanel() {
  const [meta, setMeta] = useState<Record<string, unknown> | null>(null);
  const [propName, setPropName] = useState('editedBy');
  const [propValue, setPropValue] = useState('demo-user');
  const { entries, log } = useLog();

  const handleGetMeta = async () => {
    const value = await storage.getMeta(KEY);
    setMeta(value);
    log(`getMeta("${KEY}") -> ${JSON.stringify(value)}`);
  };

  const handleSetMeta = async () => {
    await storage.setMeta(KEY, { [propName]: propValue });
    log(`setMeta("${KEY}", { ${propName}: "${propValue}" })`);
  };

  const handleRemoveOne = async () => {
    await storage.removeMeta(KEY, propName);
    log(`removeMeta("${KEY}", "${propName}")`);
  };

  const handleRemoveAll = async () => {
    await storage.removeMeta(KEY);
    setMeta(null);
    log(`removeMeta("${KEY}") — cleared all metadata`);
  };

  return (
    <Card
      title="Metadata"
      subtitle={`storage.getMeta / setMeta / removeMeta on "${KEY}" (stored under "${KEY}$")`}
    >
      <Row>
        <Field label="Property name">
          <Input value={propName} onChange={(e) => setPropName(e.target.value)} />
        </Field>
        <Field label="Property value">
          <Input value={propValue} onChange={(e) => setPropValue(e.target.value)} />
        </Field>
      </Row>
      <Row>
        <Button variant="primary" onClick={handleSetMeta}>
          setMeta
        </Button>
        <Button onClick={handleGetMeta}>getMeta</Button>
        <Button variant="danger" onClick={handleRemoveOne}>
          removeMeta(prop)
        </Button>
        <Button variant="danger" onClick={handleRemoveAll}>
          removeMeta(all)
        </Button>
      </Row>
      <JsonBlock value={meta} />
      <LogList entries={entries} />
    </Card>
  );
}
