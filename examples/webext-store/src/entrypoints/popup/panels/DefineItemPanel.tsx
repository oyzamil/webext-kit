import { useEffect, useState } from 'react';
import { installIdItem, settingsItem, type Settings } from '@/utils/storage-items';
import { Button, Card, JsonBlock, LogList, Row } from '@/components/ui';
import { useLog } from '@/hooks/useLog';

export function DefineItemPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsMeta, setSettingsMeta] = useState<Record<string, unknown> | null>(null);
  const [installId, setInstallId] = useState<string | null>(null);
  const { entries, log } = useLog();

  useEffect(() => {
    settingsItem.getValue().then(setSettings);
    installIdItem.getValue().then(setInstallId);

    // StoreItem.watch() — same semantics as storage.watch(), scoped to
    // this one item.
    const unwatch = settingsItem.watch((newValue, oldValue) => {
      setSettings(newValue);
      log(`settingsItem.watch fired: ${JSON.stringify(oldValue)} -> ${JSON.stringify(newValue)}`);
    });
    return unwatch;
  }, []);

  const toggleTheme = async () => {
    const next: Settings = {
      ...(settings ?? settingsItem.fallback),
      theme: settings?.theme === 'dark' ? 'light' : 'dark',
    };
    await settingsItem.setValue(next);
    log(`settingsItem.setValue(${JSON.stringify(next)})`);
  };

  const renamePrompt = async () => {
    const name = `Guest-${Math.floor(Math.random() * 1000)}`;
    await settingsItem.setValue({ ...(settings ?? settingsItem.fallback), displayName: name });
    log(`settingsItem.setValue({ displayName: "${name}" })`);
  };

  const handleGetMeta = async () => {
    const meta = await settingsItem.getMeta();
    setSettingsMeta(meta);
    log(`settingsItem.getMeta() -> ${JSON.stringify(meta)}`);
  };

  const handleSetMeta = async () => {
    await settingsItem.setMeta({ lastChangedAt: Date.now() });
    log('settingsItem.setMeta({ lastChangedAt })');
  };

  const handleRemoveValue = async () => {
    await settingsItem.removeValue({ removeMeta: true });
    setSettings(null);
    setSettingsMeta(null);
    log('settingsItem.removeValue({ removeMeta: true }) — next getValue() returns the fallback');
  };

  const handleMigrate = async () => {
    await settingsItem.migrate();
    log('settingsItem.migrate() — runs pending migrations (no-op if already current)');
  };

  return (
    <Card
      title="defineItem() features"
      subtitle="fallback · version + migrations · init · debug · onMigrationComplete"
    >
      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
          settingsItem — key <code>sync:settings</code>, currently at v{3}
        </p>
        <Row>
          <Button variant="primary" onClick={toggleTheme}>
            Toggle theme
          </Button>
          <Button onClick={renamePrompt}>Random display name</Button>
          <Button onClick={handleGetMeta}>getMeta</Button>
          <Button onClick={handleSetMeta}>setMeta</Button>
          <Button onClick={handleMigrate}>migrate()</Button>
          <Button variant="danger" onClick={handleRemoveValue}>
            removeValue
          </Button>
        </Row>
        <JsonBlock value={{ value: settings, fallback: settingsItem.fallback, meta: settingsMeta }} />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
          installIdItem — key <code>local:installId</code>, set once via <code>init</code>
        </p>
        <JsonBlock value={installId} />
      </div>

      <LogList entries={entries} />
    </Card>
  );
}
