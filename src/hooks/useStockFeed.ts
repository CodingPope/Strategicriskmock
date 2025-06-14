'use client';
import { useEffect, useState } from 'react';

export type Quote = {
  c: number; // current price
  d: number; // high price
  dp: number; // low price
  t: number; // open price
};

export function useStockFeed(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      const key = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
      const results = await Promise.all(
        symbols.map((sym) =>
          fetch(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=${key}`)
            .then((r) => r.json() as Promise<Quote>)
            .then((q) => ({ sym, q }))
        )
      );
      if (!mounted) return;
      setQuotes((qs) => {
        const copy = { ...qs };
        for (const { sym, q } of results) copy[sym] = q;
        return copy;
      });
    }

    // initial fetch + interval
    fetchAll();
    const iv = setInterval(fetchAll, 5000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [symbols.join(',')]);

  return quotes; // object keyed by symbol
}
