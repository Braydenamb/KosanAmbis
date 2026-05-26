import React, { useEffect, useRef } from 'react';

export default function RainCanvas({ active = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Create rain drop particles
    const maxDrops = 120;
    const drops = Array.from({ length: maxDrops }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.15 + 0.05
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)'; // Emerald rain drops
        ctx.lineWidth = 1;

        drops.forEach(drop => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + (drop.speed * 0.05), drop.y + drop.length);
          ctx.stroke();

          // Move down
          drop.y += drop.speed;
          
          // Reset when exceeding screen height
          if (drop.y > canvas.height) {
            drop.x = Math.random() * canvas.width;
            drop.y = Math.random() * -50;
            drop.speed = Math.random() * 8 + 4;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      style={{ opacity: 0.8 }}
    />
  );
}
