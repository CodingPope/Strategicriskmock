'use client';
import { useStockFeed } from '@/hooks/useStockFeed';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

type Props = { symbols: string[] };

export default function MarketOverview({ symbols }: Props) {
  const quotes = useStockFeed(symbols);

  return (
    <div className='space-y-4'>
      {symbols.map((sym) => {
        const q = quotes[sym];
        if (!q)
          return (
            <div key={sym} className='text-zinc-400'>
              Loading {sym}…
            </div>
          );

        const isUp = q.d >= 0;
        const color = isUp ? 'text-emerald-400' : 'text-rose-400';

        return (
          <div
            key={sym}
            className='bg-zinc-800 rounded-xl p-4 flex items-center justify-between'
          >
            <div>
              <div className='text-sm text-zinc-400'>{sym}</div>
              <div className={`text-2xl font-bold ${color}`}>
                {q.c.toFixed(2)}{' '}
                <span className='text-sm'>
                  ({isUp ? '+' : ''}
                  {q.dp.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className='w-32 h-12'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={[q].map((pt) => ({ x: pt.t, y: pt.c }))}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <Line
                    dataKey='y'
                    stroke={isUp ? '#34d399' : '#f43f5e'}
                    dot={false}
                    isAnimationActive={false}
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
