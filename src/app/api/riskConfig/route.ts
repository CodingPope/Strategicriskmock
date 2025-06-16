// server-side risk configuration
import { NextResponse } from 'next/server';

export interface StressScenario {
  name: string;
  factor: number;
}

export interface GreekFactors {
  delta: number;
  gamma: number;
  vega: number;
}

const CONFIG = {
  greekFactors: {
    delta: 0.5,
    gamma: 0.1,
    vega: 0.05,
  } as GreekFactors,

  stressScenarios: [
    { name: 'Equity -10%', factor: -0.1 },
    { name: 'Rates +5%', factor: 0.05 },
    { name: 'FX -20%', factor: -0.2 },
  ] as StressScenario[],
};

export async function GET() {
  return NextResponse.json(CONFIG);
}
