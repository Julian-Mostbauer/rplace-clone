import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://rplace-backend.fly.dev');
const SIZE = 256;

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialize blank white canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Listen for pixel updates
    socket.on('init-canvas', ({ data }) => {
      // Draw initial canvas (omitted for brevity)
    });

    socket.on('pixel-updated', ({ x, y, color }) => {
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(x, y, 1, 1);
    });
  }, []);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);
    const color = { r: 255, g: 0, b: 0 }; // Red
    socket.emit('place-pixel', { x, y, color }, (res) => {
      if (res.error) alert(res.error);
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      onClick={handleClick}
      style={{ border: '1px solid black', cursor: 'pointer' }}
    />
  );
}

export default App;