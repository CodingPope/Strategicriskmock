'use client';

import { useStockFeed, Quote } from '@/hooks/useStockFeed';
import { useStockHistories } from '@/hooks/useStockHistories';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

type Props = { symbols: string[] };

export default function MarketOverview({ symbols }: Props) {
  const quotes = useStockFeed(symbols); // Record<string,Quote>
  const histories = useStockHistories(symbols); // Record<string,{history,loading}>

  return (
    <div className='space-y-4'>
      {symbols.map((sym) => {
        // now q is Quote | undefined
        const q: Quote | undefined = quotes[sym];
        const { history, loading } = histories[sym];

        if (
          loading ||
          !q ||
          typeof q.c !== 'number' ||
          typeof q.dp !== 'number'
        ) {
          return (
            <div key={sym} className='bg-zinc-800 rounded-xl p-4'>
              <div className='text-zinc-400'>Loading {sym}…</div>
            </div>
          );
        }

        const price = q.c;
        const pct = q.dp;
        const isUp = pct >= 0;
        const color = isUp ? 'text-emerald-400' : 'text-rose-400';

        return (
          <div key={sym} className='bg-zinc-800 rounded-xl p-4'>
            <div className='flex items-baseline justify-between'>
              <div>
                <div className='text-sm text-zinc-400'>{sym}</div>
                <div className={`text-2xl font-bold ${color}`}>
                  {price.toFixed(2)}{' '}
                  <span className='text-sm'>
                    ({isUp ? '+' : ''}
                    {pct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-3 h-12'>
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
