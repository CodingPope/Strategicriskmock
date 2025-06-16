'use client';
import { useEffect, useState } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';
import { useRiskConfig } from './useRiskConfig';

export interface GreekValues {
  delta: number;
  gamma: number;
  vega: number;
}

export function useGreekFeed(portfolio: ExposureItem[]): GreekValues | null {
  const { greekFactors, loading } = useRiskConfig();
  const [greeks, setGreeks] = useState<GreekValues | null>(null);

  useEffect(() => {
    if (loading || !greekFactors) return;

    const { delta: df, gamma: gf, vega: vf } = greekFactors;
    const delta = portfolio.reduce((sum, p) => sum + p.position * df, 0);
    const gamma = portfolio.reduce((sum, p) => sum + p.position * gf, 0);
    const vega = portfolio.reduce((sum, p) => sum + p.position * vf, 0);

    setGreeks({ delta, gamma, vega });
  }, [loading, greekFactors, portfolio]);

  return greeks;
}
