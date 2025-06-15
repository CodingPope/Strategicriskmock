'use client';
import { useState, useEffect } from 'react';
import type { ExposureItem } from '@/app/api/portfolio/route';

export function usePortfolio() {
  const [data, setData] = useState<ExposureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json() as Promise<ExposureItem[]>)
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  return { data, loading };
}
