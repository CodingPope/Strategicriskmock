'use client';

import { useStockFeed } from '../hooks/useStockFeed';
import { useStockHistories } from '../hooks/useStockHistories';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

type Props = { symbols: string[] };

export default function MarketOverview({ symbols }: Props) {
  // TOP-LEVEL HOOKS
  const quotes = useStockFeed(symbols); // price + dp
  const histories = useStockHistories(symbols, 60, '1'); // map of history + loading

  return (
    <div className='space-y-4'>
      {symbols.map((sym) => {
        const qInfo = quotes[sym];
        const { history, loading } = histories[sym];

        // GUARD until both price & history exist
        if (
          loading ||
          !qInfo ||
          typeof qInfo.c !== 'number' ||
          typeof qInfo.dp !== 'number' ||
          history.length === 0
        ) {
          return (
            <div key={sym} className='bg-zinc-800 rounded-xl p-4'>
              <div className='text-zinc-400'>Loading {sym}…</div>
            </div>
          );
        }

        const price = qInfo.c;
        const pct = qInfo.dp;
        const isUp = pct >= 0;
        const color = isUp ? 'text-emerald-400' : 'text-rose-400';

        return (
          <div key={sym} className='bg-zinc-800 rounded-xl p-4'>
            {/* Header */}
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

            {/* 60-point sparkline */}
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
