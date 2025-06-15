'use client';
import { useEffect, useState } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';

export interface GreekValues {
  delta: number;
  gamma: number;
  vega: number;
}

export function useGreekFeed(portfolio: ExposureItem[]): GreekValues {
  const [greeks, setGreeks] = useState<GreekValues>({
    delta: 0,
    gamma: 0,
    vega: 0,
  });

  useEffect(() => {
    // For demo we’ll compute simple proxies off position
    const delta = portfolio.reduce((sum, p) => sum + p.position * 0.5, 0);
    const gamma = portfolio.reduce((sum, p) => sum + p.position * 0.1, 0);
    const vega = portfolio.reduce((sum, p) => sum + p.position * 0.05, 0);

    setGreeks({ delta, gamma, vega });
  }, [portfolio]);

  return greeks;
}
