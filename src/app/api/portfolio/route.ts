// server-side API for your positions
import { NextResponse } from 'next/server';

export interface ExposureItem {
  instrument: string;
  position: number;
  entryPrice: number;
}

const PORTFOLIO: ExposureItem[] = [
  { instrument: 'AAPL', position: 100, entryPrice: 190 },
  { instrument: 'MSFT', position: 50, entryPrice: 480 },
  { instrument: 'GOOG', position: 10, entryPrice: 180 },
];

export async function GET() {
  return NextResponse.json(PORTFOLIO);
}
