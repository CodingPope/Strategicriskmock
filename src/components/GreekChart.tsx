'use client';
import { GreekValues, useGreekFeed } from '@/hooks/useGreekFeed';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ExposureItem } from '@/app/api/portfolio/route';

type Props = { portfolio: ExposureItem[] };

export default function GreekChart({ portfolio }: Props) {
  const greeks: GreekValues = useGreekFeed(portfolio);

  const data = [
    { name: 'Delta', value: greeks.delta },
    { name: 'Gamma', value: greeks.gamma },
    { name: 'Vega', value: greeks.vega },
  ];

  return (
    <div className='rounded-xl bg-zinc-800 p-6'>
      <h2 className='text-sm text-zinc-400 mb-2'>Greek Exposures</h2>
      <div className='h-32'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke='#333' strokeDasharray='3 3' />
            <XAxis dataKey='name' tick={{ fill: '#aaa' }} />
            <YAxis tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey='value' fill='#34d399' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
