'use client';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import RiskSummary from '../components/RiskSummary';
import MarketOverview from '../components/MarketOverview';
import Exposures from '../components/Exposures';

export default function Home() {
  return (
    <div className='min-h-screen bg-zinc-900 text-zinc-100 flex'>
      <Sidebar />

      <div className='flex-1 flex flex-col'>
        <Header />

        <main className='p-4 flex-1 overflow-y-auto'>
          {/* On lg+ show 3 panels, on md 2, on sm 1 */}
          <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {/* Panel 1: Live P&L + VaR sparkline */}
            <RiskSummary />

            {/* Panel 2: Live stock quotes / market overview */}
            <MarketOverview symbols={['AAPL', 'MSFT', 'GOOG']} />

            {/* Panel 3: Your exposures table */}
            <Exposures />
          </div>
        </main>
      </div>
    </div>
  );
}
