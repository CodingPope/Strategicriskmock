import { useRiskFeed } from '../hooks/useRiskFeed';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  CellContext,
} from '@tanstack/react-table';
import type { RiskTick } from '../types/RiskTick';

export default function Exposures() {
  const { data: feed, loading } = useRiskFeed();
  const rows = feed.slice(-20); // last 20 ticks

  const columns: ColumnDef<RiskTick, string | number>[] = [
    { header: 'Instrument', accessorFn: (row) => row.instrument },
    { header: 'Pos', accessorFn: (row) => row.position },
    {
      header: 'P&L',
      accessorFn: (row) => row.pnl as number,
      cell: (x: CellContext<RiskTick, string | number>) => {
        const value = x.getValue();
        const isPositive = typeof value === 'number' && value >= 0;
        return (
          <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {value}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>Loading...</div>;

  return (
    <table className='min-w-full text-sm'>
      <thead className='text-zinc-400'>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id} className='px-2 py-1 text-left'>
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((r) => (
          <tr key={r.id} className='hover:bg-zinc-700/40'>
            {r.getVisibleCells().map((c) => (
              <td key={c.id} className='px-2 py-0.5'>
                {flexRender(c.column.columnDef.cell, c.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
