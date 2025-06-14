import { useRiskFeed } from '../hooks/useRiskFeed';
export default function RiskSummary() {
  const { data: feed, loading } = useRiskFeed();
  const latest = feed[feed.length - 1];
  if (loading) return <div>Loading...</div>;
  if (!latest) return null;
  const color = latest.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400';
  return (
    <div className='p-6 rounded-xl bg-zinc-800'>
      <h2 className='text-sm text-zinc-400 uppercase'>P&L</h2>
      <p className={`text-5xl font-bold ${color}`}>
        {latest.pnl.toLocaleString()}
      </p>
      {/* TODO sparkline */}
    </div>
  );
}
