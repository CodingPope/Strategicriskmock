'use client';

import { useStressTests } from '../hooks/useStressTests';
import {
  ReferenceLine,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import type { ExposureItem } from '@/app/api/portfolio/route';

type Props = { portfolio: ExposureItem[] };

export default function StressTest({ portfolio }: Props) {
  const data = useStressTests(portfolio);
  if (!data) {
    return (
      <div className='rounded-xl bg-zinc-800 p-6 min-w-0'>
        <div className='text-zinc-400'>Loading stress scenarios…</div>
      </div>
    );
  }

  return (
    <section
      role='region'
      aria-labelledby='stress-test-heading'
      className='rounded-xl bg-zinc-800 p-6 min-w-0'
    >
      {/* visible heading, used for aria-labelledby */}
      <h2 id='stress-test-heading' className='text-sm text-zinc-400'>
        Stress Scenarios
      </h2>
      <div className='h-56 pt-2 pb-2'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            layout='vertical'
            data={data}
            margin={{ top: 40, right: 30, bottom: 20, left: 0 }}
            barCategoryGap='50%'
          >
            {/* add your category axis and pad it top/bottom */}
            <YAxis
              type='category'
              dataKey='name'
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#aaa', dy: -20 }}
              width={120}
              interval={0}
              tickMargin={20}
              padding={{ top: 20, bottom: 20 }}
            />
            <XAxis
              type='number'
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              stroke='#555'
            />
            <ReferenceLine x={0} stroke='#888' strokeDasharray='3 3' />
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey='impact' fill='#f97316' barSize={20}>
              <LabelList
                dataKey='impact'
                position='right'
                formatter={(v: number) => v.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
