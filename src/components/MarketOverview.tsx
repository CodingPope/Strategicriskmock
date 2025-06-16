// src/components/MarketOverview.tsx
'use client';

import React from 'react';
import { useStockFeed, Quote } from '@/hooks/useStockFeed';
import { useStockHistories } from '@/hooks/useStockHistories';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { createUseStyles } from 'react-jss';

type Props = { symbols: string[] };

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#27272a', // bg-zinc-800
    borderRadius: '0.75rem', // rounded-xl
    padding: '1rem', // p-4
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  symbol: {
    fontSize: '0.875rem', // text-sm
    color: '#a1a1aa', // text-zinc-400
  },
  price: {
    fontSize: '1.5rem', // text-2xl
    fontWeight: 700,
  },
  percent: {
    fontSize: '0.875rem', // text-sm
    marginLeft: '0.25rem',
  },
  chartWrapper: {
    marginTop: '0.75rem', // mt-3
    height: '3rem', // h-12
  },
  loadingText: {
    color: '#a1a1aa',
  },
});

export default function MarketOverview({ symbols }: Props) {
  const classes = useStyles();
  const quotes = useStockFeed(symbols);
  const histories = useStockHistories(symbols);

  return (
    <div className={classes.container}>
      {symbols.map((sym) => {
        const q: Quote | undefined = quotes[sym];
        const { history, loading } = histories[sym] || {};

        if (
          loading ||
          !q ||
          typeof q.c !== 'number' ||
          typeof q.dp !== 'number'
        ) {
          return (
            <div key={sym} className={classes.card}>
              <div className={classes.loadingText}>Loading {sym}…</div>
            </div>
          );
        }

        const price = q.c;
        const pct = q.dp;
        const isUp = pct >= 0;

        return (
          <div key={sym} className={classes.card}>
            <div className={classes.header}>
              <div className={classes.symbol}>{sym}</div>
              <div className={classes.price}>
                {price.toFixed(2)}
                <span
                  className={classes.percent}
                  style={{ color: isUp ? '#34d399' : '#f43f5e' }}
                >
                  ({isUp ? '+' : ''}
                  {pct.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className={classes.chartWrapper}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={history.slice(-60).map((c) => ({ price: c }))}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <Line
                    dataKey='price'
                    stroke={isUp ? '#34d399' : '#f43f5e'}
                    dot={false}
                    isAnimationActive={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
