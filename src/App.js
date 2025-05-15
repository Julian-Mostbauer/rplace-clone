import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://rplace-backend.fly.dev", {
  transports: ["websocket"], // Force WebSocket
  reconnectionAttempts: 5,   // Auto-retry if disconnected
  withCredentials: true
});

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize blank canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 256, 256);

    socket.on('init-canvas', ({ data }) => {
      // Draw initial canvas (pseudo-code)
      for (let i = 0; i < data.length; i += 3) {
        const x = (i / 3) % 256;
        const y = Math.floor((i / 3) / 256);
        ctx.fillStyle = `rgb(${data[i]}, ${data[i+1]}, ${data[i+2]})`;
        ctx.fillRect(x, y, 1, 1);
      }
    });

    socket.on('pixel-updated', ({ x, y, color }) => {
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(x, y, 1, 1);
    });

    return () => {
      socket.off('init-canvas');
      socket.off('pixel-updated');
    };
  }, []);

  // (Keep your existing click handler)
}