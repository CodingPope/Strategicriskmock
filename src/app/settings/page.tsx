'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

import type { ExposureItem } from '@/app/api/portfolio/route';

export default function SettingsPage() {
  const [portfolio, setPortfolio] = useState<ExposureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // load existing portfolio
  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data: ExposureItem[]) => {
        setPortfolio(data);
        setLoading(false);
      });
  }, []);

  function handleAdd() {
    setPortfolio([
      ...portfolio,
      { instrument: '', position: 0, entryPrice: 0 },
    ]);
  }

  function handleRemove(i: number) {
    setPortfolio(portfolio.filter((_, idx) => idx !== i));
  }

  function handleChange(i: number, field: keyof ExposureItem, value: string) {
    setPortfolio(
      portfolio.map((item, idx) =>
        idx !== i
          ? item
          : {
              ...item,
              [field]: field === 'instrument' ? value : Number(value),
            }
      )
    );
  }

  async function handleSave() {
    setSaving(true);
    await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolio),
    });
    setSaving(false);
  }

  if (loading) return <div>Loading settings…</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div className='p-6 space-y-4'>
        <h1 className='text-2xl font-semibold'>Settings</h1>
        <div className='space-y-4'>
          {portfolio.map((item, i) => (
            <div key={i} className='flex items-center space-x-2'>
              {/* Symbol */}
              <input
                type='text'
                placeholder='Symbol'
                value={item.instrument}
                onChange={(e) => handleChange(i, 'instrument', e.target.value)}
                className='flex-1 bg-zinc-700 text-zinc-100 p-2 rounded'
              />

              {/* Position (plain text numeric field) */}
              <input
                type='text'
                inputMode='numeric'
                placeholder='Position'
                value={item.position}
                onChange={(e) => handleChange(i, 'position', e.target.value)}
                className='w-24 bg-zinc-700 text-zinc-100 p-2 rounded'
              />

              {/* Entry Price (plain text numeric field) */}
              <input
                type='text'
                inputMode='decimal'
                placeholder='Entry Price'
                value={item.entryPrice}
                onChange={(e) => handleChange(i, 'entryPrice', e.target.value)}
                className='w-28 bg-zinc-700 text-zinc-100 p-2 rounded'
              />

              <button
                onClick={() => handleRemove(i)}
                className='text-rose-400 hover:underline'
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={handleAdd}
            className='bg-zinc-600 text-zinc-100 px-4 py-2 rounded hover:bg-zinc-500'
          >
            + Add Position
          </button>

          <div>
            <button
              onClick={handleSave}
              disabled={saving}
              className='bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-400 disabled:opacity-50'
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
