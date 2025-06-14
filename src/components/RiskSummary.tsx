/* src/components/RiskSummary.tsx */
'use client';
import { useRiskFeed } from '@/hooks/useRiskFeed';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function RiskSummary() {
  const feed = useRiskFeed();
  const latest = feed.data.at(-1);
  if (!latest) return null;

  const isGain = latest.pnl >= 0;
  const color = isGain ? '#34d399' : '#f43f5e';

  return (
    <div className='rounded-xl bg-zinc-800 p-6 h-full'>
      <h2 className='text-sm uppercase text-zinc-400 mb-2'>P&L</h2>
      <p
        className={`text-5xl font-bold mb-4 ${
          isGain ? 'text-emerald-400' : 'text-rose-400'
        }`}
      >
        {latest.pnl.toLocaleString()}
      </p>

      {/* 60-point rolling sparkline */}
      <ResponsiveContainer width='100%' height={60}>
        <LineChart data={feed.data.slice(-60)}>
          <Line
            type='monotone'
            dataKey='pnl'
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false} /* traders hate jitter */
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
