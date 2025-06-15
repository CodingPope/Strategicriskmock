'use client';
import { useState, useMemo } from 'react';
import { useStockFeed, Quote } from '@/hooks/useStockFeed';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';
import type { ExposureItem } from '@/app/api/portfolio/route';

type Props = { portfolio: ExposureItem[] };

export default function Exposures({ portfolio }: Props) {
  const symbols = portfolio.map((p) => p.instrument);
  const quotes = useStockFeed(symbols);

  const rows = useMemo(() => {
    return portfolio.map(({ instrument, position, entryPrice }) => {
      const q = quotes[instrument] as Quote;
      const current = q?.c ?? entryPrice;
      const pnl = +(position * (current - entryPrice)).toFixed(2);
      return { instrument, position, entryPrice, current, pnl };
    });
  }, [portfolio, quotes]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'pnl', desc: true },
  ]);

  const columns: ColumnDef<(typeof rows)[0]>[] = [
    { header: 'Instrument', accessorKey: 'instrument' },
    { header: 'Pos', accessorKey: 'position' },
    {
      header: 'Entry',
      accessorKey: 'entryPrice',
      cell: (c) => c.getValue<number>().toFixed(2),
    },
    {
      header: 'Now',
      accessorKey: 'current',
      cell: (c) => c.getValue<number>().toFixed(2),
    },
    {
      header: 'P&L',
      accessorKey: 'pnl',
      cell: (c) => {
        const v = c.getValue<number>();
        return (
          <span className={v >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {v.toLocaleString()}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='rounded-xl bg-zinc-800 p-4 overflow-auto'>
      <div className='min-w-[24rem]'>
        <table role='grid' className='min-w-full text-sm'>
          <thead className='text-zinc-400'>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className='border-b border-zinc-700/60'>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      scope='col'
                      className='px-2 py-1 text-left cursor-pointer select-none'
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      <div className='flex items-center gap-1'>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {sort === 'asc' && ' ▲'}
                        {sort === 'desc' && ' ▼'}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='hover:bg-zinc-700/40'>
                {row.getVisibleCells().map((cell) => {
                  const CellRenderer = cell.column.columnDef.cell;
                  const value = cell.getValue();
                  return (
                    <td
                      key={cell.id}
                      tabIndex={0}
                      className='px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400'
                    >
                      {CellRenderer
                        ? flexRender(CellRenderer, cell.getContext())
                        : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
