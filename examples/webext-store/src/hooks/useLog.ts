import { useCallback, useState } from 'react';

export function useLog(limit = 20) {
  const [entries, setEntries] = useState<string[]>([]);

  const log = useCallback(
    (message: string) => {
      const stamp = new Date().toLocaleTimeString();
      setEntries((prev) => [`${stamp}  ${message}`, ...prev].slice(0, limit));
    },
    [limit],
  );

  return { entries, log };
}
