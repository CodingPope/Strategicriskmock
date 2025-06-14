'use client';
import { useRiskFeed } from '@/hooks/useRiskFeed';
import { useVaRFeed } from '@/hooks/useVaRFeed';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function RiskSummary() {
  const pnlFeed = useRiskFeed(); // your existing P&L feed
  const varFeed = useVaRFeed('AAPL', 1000); // adjust symbol & position size as needed

  const latestPnl = pnlFeed.data[pnlFeed.data.length - 1];
  const latestVar = varFeed.at(-1);

  if (!latestPnl && latestPnl !== 0) return null;

  const pnlGain =
    (typeof latestPnl === 'number' ? latestPnl : latestPnl?.pnl) >= 0;
  const pnlColor = pnlGain ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className='rounded-xl bg-zinc-800 p-6'>
      {/* P&L */}
      <h2 className='text-sm text-zinc-400'>P&L</h2>
      <p role='status' className={`text-5xl font-bold ${pnlColor}`}>
        {latestPnl?.toLocaleString()}
      </p>
      <ResponsiveContainer width='100%' height={40}>
        <LineChart data={pnlFeed.data.slice(-60).map((v) => ({ v }))}>
          <Line
            dataKey='v'
            stroke={pnlGain ? '#34d399' : '#f43f5e'}
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* VaR */}
      <h2 className='mt-4 text-sm text-zinc-400'>VaR (95%)</h2>
      {latestVar !== undefined && (
        <p className='text-xl font-medium text-amber-400'>
          {Math.round(latestVar).toLocaleString()}
        </p>
      )}
      <ResponsiveContainer width='100%' height={40}>
        <LineChart data={varFeed.map((v) => ({ v }))}>
          <Line
            dataKey='v'
            stroke='#facc15'
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
