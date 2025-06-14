'use client';

import { useState } from 'react';
import { useRiskFeed } from '@/hooks/useRiskFeed';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

type Row = {
  instrument: string;
  position: number;
  pnl: number;
};

export default function Exposures() {
  /* 1. Build a small row array from the latest 20 ticks */
  const ticks = useRiskFeed();
  const rows: Row[] = ticks.data.slice(-20).map((t) => ({
    instrument: t.instrument,
    position: t.position,
    pnl: t.pnl,
  }));

  /* 2. Define columns (same as before) */
  const columns: ColumnDef<Row>[] = [
    { header: 'Instrument', accessorKey: 'instrument' },
    { header: 'Pos', accessorKey: 'position' },
    {
      header: 'P&L',
      accessorKey: 'pnl',
      cell: (c) => (
        <span
          className={
            +c.getValue<number>() >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }
        >
          {c.getValue<number>().toLocaleString()}
        </span>
      ),
    },
  ];

  /* 3. Local sort state so TanStack can reorder rows */
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'pnl', desc: true }, // start sorted by P&L descending
  ]);

  /* 4. Create the table instance */
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    /* enables built-in sorting */
    getSortedRowModel: getSortedRowModel(),
  });

  /* 5. Render */
  return (
    <table role='grid' aria-label='Exposures' className='min-w-full text-sm'>
      {/* HEADER */}
      <thead className='text-zinc-400'>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id} className='border-b border-zinc-700/60'>
            {hg.headers.map((h) => {
              /* examine sort status for this column */
              const sort = h.column.getIsSorted(); // false | 'asc' | 'desc'
              return (
                <th
                  key={h.id}
                  scope='col'
                  className='px-2 py-1 text-left cursor-pointer select-none'
                  /* tell TanStack to toggle sort when clicked */
                  onClick={h.column.getToggleSortingHandler()}
                >
                  <div className='flex items-center gap-1'>
                    {/* original header label */}
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {/* chevrons */}
                    {sort === 'asc' && <span>▲</span>}
                    {sort === 'desc' && <span>▼</span>}
                  </div>
                </th>
              );
            })}
          </tr>
        ))}
      </thead>

      {/* BODY */}
      <tbody>
        {table.getRowModel().rows.map((r) => (
          <tr key={r.id} className='hover:bg-zinc-700/40'>
            {r.getVisibleCells().map((c) => (
              <td
                key={c.id}
                tabIndex={0}
                className='px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-400'
              >
                {flexRender(
                  c.column.columnDef.cell ?? (() => c.getValue()),
                  c.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
