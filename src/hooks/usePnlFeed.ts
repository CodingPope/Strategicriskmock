'use client';
import { useEffect, useState } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';
import { useStockFeed } from './useStockFeed';

export function usePnlFeed(portfolio: ExposureItem[]) {
  const symbols = portfolio.map((p) => p.instrument);
  const quotes = useStockFeed(symbols);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    // whenever quotes update, recompute total P&L
    const totalPnl = portfolio.reduce((sum, p) => {
      const q = quotes[p.instrument];
      if (q?.c != null) {
        return sum + p.position * (q.c - p.entryPrice);
      }
      return sum;
    }, 0);

    setHistory((h) => [...h.slice(-59), totalPnl]);
  }, [quotes, portfolio]);

  return history;
}
