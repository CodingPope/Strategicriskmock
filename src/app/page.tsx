'use client';
import RiskSummary from '../components/RiskSummary';
import Exposures from '../components/Exposures';

export default function Home() {
  return (
    <main className='min-h-screen bg-zinc-900 text-zinc-100 p-4 grid gap-4 lg:grid-cols-2'>
      <RiskSummary />
      <Exposures />
    </main>
  );
}
