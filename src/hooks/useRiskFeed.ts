'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { RiskTick } from '../types/RiskTick';

export const useRiskFeed = () => {
  const [data, setData] = useState<RiskTick[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const pendingData = useRef<RiskTick[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:4000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setLoading(false);
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
      setLoading(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setLoading(true);
    });

    socket.on('risk', (msg: RiskTick) => {
      // Batch updates to reduce re-renders
      pendingData.current.push(msg);
      if (!updateTimeout.current) {
        updateTimeout.current = setTimeout(() => {
          setData((prev) => [...prev.slice(-99), ...pendingData.current]);
          pendingData.current = [];
          updateTimeout.current = null;
        }, 200);
      }
    });

    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      socket.disconnect();
    };
  }, []);

  return { data, loading };
};
