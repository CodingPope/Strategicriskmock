// src/app/api/portfolio/route.ts

import { NextResponse } from 'next/server';

export interface ExposureItem {
  instrument: string;
  position: number;
  entryPrice: number;
}

// Module-scope portfolio; POST will overwrite this in memory
let PORTFOLIO: ExposureItem[] = [
  { instrument: 'AAPL', position: 100, entryPrice: 190 },
  { instrument: 'MSFT', position: 50, entryPrice: 480 },
  { instrument: 'GOOG', position: 10, entryPrice: 180 },
];

export async function GET() {
  return NextResponse.json(PORTFOLIO);
}

export async function POST(request: Request) {
  try {
    const incoming = (await request.json()) as ExposureItem[];
    PORTFOLIO = incoming;
    return NextResponse.json(PORTFOLIO);
  } catch {
    return NextResponse.error();
  }
}
