'use client';
import { useState, useEffect } from 'react';

export interface Quote {
  c: number; // current price
  d: number; // absolute change
  dp: number; // percent change
  t: number; // timestamp
}

export function useStockFeed(symbols: string[]): Record<string, Quote> {
  // initialize an empty map of quotes
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let alive = true;
    const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY!;

    async function fetchQuotes() {
      const entries = await Promise.all(
        symbols.map(async (sym) => {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${sym}&token=${key}`
          );
          const q = (await res.json()) as Quote;
          return [sym, q] as const;
        })
      );

      if (!alive) return;
      // turn [[sym, quote], ...] into { sym: quote, ... }
      setQuotes(Object.fromEntries(entries));
    }

    fetchQuotes();
    const iv = setInterval(fetchQuotes, 5000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [symbols.join(',')]);

  return quotes;
}
