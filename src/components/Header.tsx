'use client';
import { useRiskFeed } from '@/hooks/useRiskFeed';

export default function Header() {
  const { data } = useRiskFeed();
  const latest = data.at(-1);

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-zinc-900 border-b border-zinc-700">
      <h2 className="text-lg font-medium">Risk Dashboard</h2>
      {latest && (
        <div className="text-sm">
          <span className="text-zinc-400 mr-2">Last P&amp;L:</span>
          <span className={latest.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {latest.pnl.toLocaleString()}
          </span>
        </div>
      )}
    </header>
  );
}
