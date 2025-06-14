export interface RiskTick {
  pnl: number; // mark-to-market P&L
  instrument: string; // “AAPL”, “ES-U24” …
  position: number; // current size
  ts?: number; // optional timestamp
}
