'use client';
import { useRiskFeed } from '@/hooks/useRiskFeed';
import { useVaRFeed } from '@/hooks/useVaRFeed';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function RiskSummary() {
  // 1) Destructure the data arrays
  const { data: riskTicks, loading } = useRiskFeed(); // RiskTick[]
  const varSeries = useVaRFeed('AAPL', 1000); // number[]

  // 2) Early return on load
  if (loading || riskTicks.length === 0) {
    return (
      <div className='rounded-xl bg-zinc-800 p-6 min-w-0 …'>
        <div className='text-zinc-400'>Loading risk data…</div>
      </div>
    );
  }

  // 3) Build numeric series for P&L
  const pnlSeries = riskTicks.map((t) => t.pnl);
  const latestPnl = pnlSeries[pnlSeries.length - 1]!;
  const latestVar = varSeries.length
    ? varSeries[varSeries.length - 1]
    : undefined;

  const pnlGain = latestPnl >= 0;
  const pnlColor = pnlGain ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className='rounded-xl bg-zinc-800 p-6'>
      {/* P&L */}
      <h2 className='text-sm text-zinc-400'>P&L</h2>
      <p role='status' className={`text-5xl font-bold ${pnlColor}`}>
        {latestPnl.toLocaleString()}
      </p>
      <ResponsiveContainer width='100%' height={40}>
        <LineChart data={pnlSeries.slice(-60).map((v) => ({ v }))}>
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
        <>
          <p className='text-xl font-medium text-amber-400'>
            {Math.round(latestVar).toLocaleString()}
          </p>
          <ResponsiveContainer width='100%' height={40}>
            <LineChart data={varSeries.slice(-60).map((v) => ({ v }))}>
              <Line
                dataKey='v'
                stroke='#facc15'
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
