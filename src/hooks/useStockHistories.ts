'use client';
import { useState, useEffect } from 'react';

interface CandleResponse {
  c?: number[];
}

interface HistInfo {
  history: number[];
  loading: boolean;
}

export function useStockHistories(
  symbols: string[],
  windowMinutes = 60,
  resolution: '1' | '5' | '15' = '1'
): Record<string, HistInfo> {
  // Initialize each symbol as loading with empty history
  const [map, setMap] = useState<Record<string, HistInfo>>(
    symbols.reduce(
      (acc, s) => ({ ...acc, [s]: { history: [], loading: true } }),
      {}
    )
  );

  useEffect(() => {
    let alive = true;
    const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;

    async function fetchAll() {
      const now = Math.floor(Date.now() / 1000);
      const from = now - windowMinutes * 60;

      // Fetch each symbol one by one (or in parallel with Promise.all)
      await Promise.all(
        symbols.map(async (sym) => {
          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${sym}&resolution=${resolution}&from=${from}&to=${now}&token=${key}`;
          const data: CandleResponse = await fetch(url).then((r) => r.json());
          const closes = Array.isArray(data.c) ? data.c! : [];
          if (!alive) return;
          setMap((prev) => ({
            ...prev,
            [sym]: { history: closes, loading: false },
          }));
        })
      );
    }

    fetchAll();
    const iv = setInterval(fetchAll, 5 * 60 * 1000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [symbols.join(','), windowMinutes, resolution]);

  return map;
}
