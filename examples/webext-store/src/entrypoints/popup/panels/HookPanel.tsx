import { useStorage, useStorageWatch } from 'webext-store/react';
import { heartbeatItem } from '@/utils/storage-items';
import { Button, Card, JsonBlock, LogList, Row } from '@/components/ui';
import { useLog } from '@/hooks/useLog';

export function HookPanel() {
  const { entries: onChangeLog, log: logOnChange } = useLog();
  const { entries: watchLog, log: logWatch } = useLog();

  // useStorage: full read/write/loading/error state, backed by a
  // defineItem() item. onChange fires for writes from ANY context.
  const { value, loading, error, setValue, removeValue } = useStorage(heartbeatItem, {
    onChange: (newValue, oldValue) => logOnChange(`onChange: ${oldValue} -> ${newValue}`),
  });

  // useStorageWatch: side-effect-only subscription, no render state of its
  // own — useful for logging/analytics/syncing without extra re-renders.
  useStorageWatch<number>('local:heartbeat', (newValue, oldValue) => {
    logWatch(`useStorageWatch: ${oldValue} -> ${newValue}`);
  });

  return (
    <Card
      title="React hook: useStorage / useStorageWatch"
      subtitle="webext-store/react — optional entrypoint, react is a peer dependency only here"
    >
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {loading ? 'Loading…' : error ? `Error: ${error.message}` : 'Loaded'}
        </p>
        <div className="mt-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {value}
        </div>
        <Row>
          <Button variant="primary" onClick={() => setValue(value + 1)} disabled={loading}>
            setValue(value + 1)
          </Button>
          <Button variant="danger" onClick={() => removeValue()} disabled={loading}>
            removeValue (reset to fallback)
          </Button>
        </Row>
      </div>

      <div>
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          onChange callback (passed to useStorage)
        </p>
        <LogList entries={onChangeLog} />
      </div>

      <div>
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          useStorageWatch (independent subscription, same key)
        </p>
        <LogList entries={watchLog} />
      </div>

      <JsonBlock value={{ value, loading, error: error?.message ?? null }} />
    </Card>
  );
}
