import { useCallback, useEffect, useState } from 'react';
import type { Category, Headline } from '../types';
import { fetchCategory } from '../lib/feedService';

interface UseFeedsResult {
  headlines: Map<string, Headline[]>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFeeds(categories: Category[]): UseFeedsResult {
  const [headlines, setHeadlines] = useState<Map<string, Headline[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const results = await Promise.allSettled(
          categories.map(async (cat) => {
            const items = await fetchCategory(cat);
            return { id: cat.id, items };
          })
        );

        if (cancelled) return;

        const map = new Map<string, Headline[]>();
        let anyFailed = false;

        for (const result of results) {
          if (result.status === 'fulfilled') {
            map.set(result.value.id, result.value.items);
          } else {
            anyFailed = true;
          }
        }

        setHeadlines(map);
        if (anyFailed && map.size === 0) {
          setError('Failed to load any feeds. Check your connection.');
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load feeds.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [categories, refreshKey]);

  return { headlines, loading, error, refresh };
}
