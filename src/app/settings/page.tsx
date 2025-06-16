// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
    // reload to pick up new portfolio everywhere
    window.location.href = '/';
  }

  if (loading) {
    return <div className='p-8 text-zinc-400'>Loading settings…</div>;
  }

  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>Settings</h1>
      {portfolio.map((item, i) => (
        <div key={i} className='flex gap-2 items-center'>
          {/* Symbol */}
          <label htmlFor={`symbol-${i}`} className='sr-only'>
            Symbol #{i + 1}
          </label>
          <input
            type='text'
            placeholder='Symbol'
            value={item.instrument}
            onChange={(e) => handleChange(i, 'instrument', e.target.value)}
            className='flex-1 bg-zinc-700 text-zinc-100 p-2 rounded'
          />

          {/* Position */}
          <label htmlFor={`position-${i}`} className='sr-only'>
            Position #{i + 1}
          </label>
          <input
            type='number'
            placeholder='Position'
            value={item.position}
            onChange={(e) => handleChange(i, 'position', e.target.value)}
            className='w-24 bg-zinc-700 text-zinc-100 p-2 rounded'
          />

          {/* Entry Price */}
          <label htmlFor={`entryPrice-${i}`} className='sr-only'>
            Entry Price #{i + 1}
          </label>
          <input
            type='number'
            placeholder='Entry Price'
            value={item.entryPrice}
            onChange={(e) => handleChange(i, 'entryPrice', e.target.value)}
            className='w-28 bg-zinc-700 text-zinc-100 p-2 rounded'
          />
          <button
            onClick={() => handleRemove(i)}
            className='text-red-500 hover:underline'
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
  );
}
