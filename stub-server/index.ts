import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

// send a synthetic risk tick every 800 ms
const interval = setInterval(() => {
  const pnl = +(Math.random() * 200_000 - 100_000).toFixed(0);
  const position = Math.floor(Math.random() * 5000);
  const msg = {
    ts: Date.now(),
    instrument: 'AAPL',
    position,
    pnl,
  };
  io.emit('risk', msg);
}, 800);

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });

  socket.on('error', (error) => {
    console.error(`Socket error from client ${socket.id}:`, error);
  });
});

httpServer.listen(4000, () => {
  console.log('stub-server live on http://localhost:4000');
});

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down server...');
  clearInterval(interval);
  io.close(() => {
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
