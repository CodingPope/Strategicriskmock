'use client';
import { useState, useEffect } from 'react';
import type { StressScenario, GreekFactors } from '@/app/api/riskConfig/route';

export function useRiskConfig() {
  const [greekFactors, setGreekFactors] = useState<GreekFactors | null>(null);
  const [stressScenarios, setStressScenarios] = useState<
    StressScenario[] | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/riskConfig')
      .then((res) => res.json())
      .then(
        (cfg: {
          greekFactors: GreekFactors;
          stressScenarios: StressScenario[];
        }) => {
          setGreekFactors(cfg.greekFactors);
          setStressScenarios(cfg.stressScenarios);
        }
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { greekFactors, stressScenarios, loading };
}
