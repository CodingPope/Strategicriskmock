'use client';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import RiskSummary from '../components/RiskSummary';
import GreekChart from '../components/GreekChart';
import MarketOverview from '../components/MarketOverview';
import Exposures from '../components/Exposures';
import { usePortfolio } from '../hooks/usePortfolio';
import StressTest from '../components/StressTest';

export default function Home() {
  const { data: portfolio, loading } = usePortfolio();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-zinc-400'>
        Loading portfolio…
      </div>
    );
  }

  const symbols = portfolio.map((p) => p.instrument);

  return (
    <div className='min-h-screen bg-zinc-900 text-zinc-100 flex'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='p-4 flex-1 overflow-y-auto'>
          <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[2fr_1fr_1fr]'>
            {/* Left stack: P&L, VaR, Greeks, Stress */}
            <div className='space-y-4'>
              <RiskSummary />
              <GreekChart portfolio={portfolio} />
              <StressTest portfolio={portfolio} />
            </div>

            {/* Middle column: Markets */}
            <div className='space-y-4'>
              <MarketOverview symbols={symbols} />
            </div>

            {/* Right column: Exposures */}
            <div className='space-y-4'>
              <Exposures portfolio={portfolio} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
