'use client';

import { useEffect, useState } from 'react';

interface CandleResponse {
  c: number[]; // closing prices
  // you can add other fields if you like (t, h, l, o, v) but we only need c[]
}

export function useVaRFeed(
  symbol: string,
  positionSize: number,
  windowDays = 1,
  resolution = '1'
): number[] {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    let alive = true;
    const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;
    const z95 = 1.65; // 95% VaR z-score

    async function fetchVaR(): Promise<void> {
      const now = Math.floor(Date.now() / 1000);
      const from = now - windowDays * 24 * 3600;
      const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${key}`;

      // 1) Tell TS the shape of the JSON
      const apiRes = await fetch(url);
      const data: CandleResponse = await apiRes.json();

      // 2) Extract closes and guard
      const closes: number[] = data.c;
      if (!closes || closes.length < 2) return;

      // 3) Compute returns with typed parameters
      const rets: number[] = closes
        .slice(1)
        .map((price: number, idx: number) => {
          const prev = closes[idx];
          return (price - prev) / prev;
        });

      // 4) Compute mean and sigma with typed accumulators
      const mean: number =
        rets.reduce((acc: number, curr: number) => acc + curr, 0) / rets.length;

      const variance: number =
        rets.reduce(
          (acc: number, curr: number) => acc + (curr - mean) ** 2,
          0
        ) /
        (rets.length - 1);

      const sigma: number = Math.sqrt(variance);

      // 5) Latest price for VaR formula
      const latestPrice: number = closes[closes.length - 1];
      const varVal: number = z95 * sigma * latestPrice * positionSize;

      // 6) Push into history
      if (alive) {
        setHistory((h: number[]) => [...h.slice(-59), varVal]);
      }
    }

    fetchVaR();
    const iv = setInterval(fetchVaR, 60_000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [symbol, positionSize, windowDays, resolution]);

  return history;
}
