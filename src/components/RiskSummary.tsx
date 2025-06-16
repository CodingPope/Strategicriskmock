'use client';

import { usePortfolio } from '../hooks/usePortfolio';
import { usePnlFeed } from '../hooks/usePnlFeed';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function RiskSummary() {
  // 1) Load the editable portfolio
  const { data: portfolio, loading } = usePortfolio();

  // 2) Build a real P&L series whenever quotes update
  const pnlSeries = usePnlFeed(portfolio);

  // 3) Grab the latest value (or 0 if empty)
  const latestPnl = pnlSeries.length > 0 ? pnlSeries[pnlSeries.length - 1] : 0;

  // ← Fix: guard on portfolio-loading OR empty pnlSeries
  if (loading || pnlSeries.length === 0) {
    return (
      <div className='rounded-xl bg-zinc-800 p-6 min-w-0'>
        <div className='text-zinc-400'>Loading P&amp;L…</div>
      </div>
    );
  }

  const pnlGain = latestPnl >= 0;
  const pnlColor = pnlGain ? 'text-emerald-400' : 'text-rose-400';

  return (
    <section
      role='region'
      aria-labelledby='risk-summary-heading'
      className='rounded-xl bg-zinc-800 p-6 min-w-0'
    >
      <h2 id='risk-summary-heading' className='text-sm text-zinc-400 mb-2'>
        P&amp;L (USD)
      </h2>

      <p
        role='status'
        aria-live='polite'
        className={`text-5xl font-bold ${pnlColor} mb-4`}
      >
        {latestPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
    </section>
  );
}
