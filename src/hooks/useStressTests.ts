'use client';
import { useMemo } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';

export interface StressTestValues {
  name: string;
  impact: number;
}

export function useStressTests(portfolio: ExposureItem[]): StressTestValues[] {
  return useMemo(() => {
    // Demo: shock %age on stocks
    // e.g. -10% equity crash, +5% rate spike, -20% FX devaluation
    const shocks = [
      { name: 'Equity -10%', factor: -0.1 },
      { name: 'Rates +5%', factor: 0.05 },
      { name: 'FX -20%', factor: -0.2 },
    ];

    return shocks.map(({ name, factor }) => {
      // total notional = sum(position * entryPrice)
      const notional = portfolio.reduce(
        (sum, p) => sum + p.position * p.entryPrice,
        0
      );
      // impact = shock percent * notional
      const impact = +(factor * notional).toFixed(0);
      return { name, impact };
    });
  }, [portfolio]);
}
