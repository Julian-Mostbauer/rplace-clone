import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { getPixel, setPixel, saveToRedis, loadFromRedis } from './canvas.js';

const app = express();
const httpServer = createServer(app);

// Key Change: Explicit CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://rplace-clone-test.vercel.app/",
      "http://localhost:3000",            // Local dev
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"] // Force WebSocket-only
});

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Pixel Place Backend Running');
});

(async () => {
  await loadFromRedis(redis);
  
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);
    
    socket.emit('init-canvas', { 
      width: 256, 
      height: 256, 
      data: Array(256 * 256 * 3).fill(255) // White canvas
    });

    socket.on('place-pixel', async ({ x, y, color }, callback) => {
      // (Keep your existing pixel logic here)
    });
  });

  httpServer.listen(3000, () => {
    console.log('Server running on :3000');
  });
})();