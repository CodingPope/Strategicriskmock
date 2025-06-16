'use client';
import { useMemo } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';
import { useRiskConfig } from './useRiskConfig';

export interface StressTestValues {
  name: string;
  impact: number;
}

export function useStressTests(
  portfolio: ExposureItem[]
): StressTestValues[] | null {
  const { stressScenarios, loading } = useRiskConfig();

  return useMemo(() => {
    if (loading || !stressScenarios) return null;
    // If no portfolio, return empty array
    const notional = portfolio.reduce(
      (sum, p) => sum + p.position * p.entryPrice,
      0
    );

    return stressScenarios.map(({ name, factor }) => ({
      name,
      impact: Math.round(factor * notional),
    }));
  }, [loading, stressScenarios, portfolio]);
}
