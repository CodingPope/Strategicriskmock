'use client';
import { usePnlFeed } from '../hooks/usePnlFeed';
import { usePortfolio } from '../hooks/usePortfolio';

export default function Header() {
  const { data: portfolio } = usePortfolio();
  const pnlSeries = usePnlFeed(portfolio);
  const latest = pnlSeries[pnlSeries.length - 1] ?? 0;

  return (
    <header className='flex items-center justify-between py-4 px-6 bg-zinc-900 border-b border-zinc-700'>
      <h2 className='text-lg font-medium'>Risk Dashboard</h2>
      {latest && (
        <div className='text-sm'>
          <span className='text-zinc-400 mr-2'>Last P&amp;L:</span>
          <span className={latest >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            Last P&L:{' '}
            {latest.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </header>
  );
}
