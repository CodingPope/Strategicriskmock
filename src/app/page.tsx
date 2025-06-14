'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RiskSummary from '../components/RiskSummary';
import Exposures from '../components/Exposures';

export default function Home() {
  return (
    <div className='min-h-screen bg-zinc-900 text-zinc-100 flex'>
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <Header />
        <main className='p-4 grid gap-4 lg:grid-cols-2 flex-1 overflow-y-auto'>
          <RiskSummary />
          <Exposures />
        </main>
      </div>
    </div>
  );
}
