import React, { useEffect, useRef } from 'react';

/**
 * AtmosphereCanvas — A high-performance, GPU-accelerated particle engine
 * Renders beautiful responsive effects based on active atmosphere mode:
 * - 'sunrays': Gentle diagonal golden rays and warm floating dust particles.
 * - 'rain': Sleek vertical green-tinted rain shower.
 * - 'stars': Elegant twinkling calm stars.
 * - 'heavy-rain': Denser rain particles + dramatic occasional ambient lightning flashes.
 * - 'sparkles': Cozy warm bubbles rising slowly from the bottom of the screen.
 * 
 * Includes Accessibility (prefers-reduced-motion) system detection to freeze all particles.
 */
export default function AtmosphereCanvas({ mode = 'sunrays' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Detect system reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // ─── INITIALIZE PARTICLE SETS ───
    const maxParticles = prefersReducedMotion ? 0 : 90;
    const particles = [];

    // Create particles based on the current mode
    const initParticles = () => {
      particles.length = 0;
      if (prefersReducedMotion) return;

      for (let i = 0; i < maxParticles; i++) {
        if (mode === 'rain' || mode === 'heavy-rain') {
          // Rain streaks
          const density = mode === 'heavy-rain' ? 1.5 : 1.0;
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            length: Math.random() * 25 + 15,
            speed: (Math.random() * 8 + 6) * density,
            opacity: Math.random() * 0.16 + 0.05
          });
        } else if (mode === 'sunrays') {
          // Warm floating dust
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.8,
            speedX: Math.random() * 0.3 - 0.15,
            speedY: Math.random() * -0.4 - 0.1,
            opacity: Math.random() * 0.25 + 0.08
          });
        } else if (mode === 'stars') {
          // Twinkling stars
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.8 + 0.5,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            phase: Math.random() * Math.PI,
            opacity: Math.random() * 0.6 + 0.2
          });
        } else if (mode === 'sparkles') {
          // Floating cozy sparkles
          particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            radius: Math.random() * 4 + 1.5,
            speedY: Math.random() * -0.8 - 0.4,
            wobble: Math.random() * 100,
            wobbleSpeed: Math.random() * 0.02 + 0.01,
            opacity: Math.random() * 0.4 + 0.1
          });
        }
      }
    };

    initParticles();

    // Lightning parameters for heavy-rain
    let lightningFlash = 0;
    let nextLightning = Math.random() * 600 + 400; // frames until next petir

    // ─── RENDER LOOP ───
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (prefersReducedMotion) {
        // Accessibility safety: stop drawing completely
        return;
      }

      // ─── RENDER SPECIFIC ATMOSPHERICS ───

      // 1. SUNRAYS BEAMS DRAWING
      if (mode === 'sunrays') {
        ctx.fillStyle = 'rgba(253, 224, 71, 0.02)'; // very faint warm gold
        ctx.beginPath();
        // Top right sun source beam shapes
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width * 0.3, canvas.height);
        ctx.lineTo(canvas.width * 0.5, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.8, 0);
        ctx.lineTo(canvas.width * 0.1, canvas.height);
        ctx.lineTo(canvas.width * 0.25, canvas.height);
        ctx.lineTo(canvas.width * 0.9, 0);
        ctx.fill();

        // Update & Render floating golden dust
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${p.opacity})`;
          ctx.fill();

          p.x += p.speedX;
          p.y += p.speedY;

          // Recycle
          if (p.y < -10) {
            p.y = canvas.height + 10;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      // 2. RAIN OR HEAVY RAIN SHOWERS
      else if (mode === 'rain' || mode === 'heavy-rain') {
        const strokeColor = mode === 'heavy-rain' ? 'rgba(226, 232, 240, 0.10)' : 'rgba(16, 185, 129, 0.08)';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;

        particles.forEach(p => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + (p.speed * 0.04), p.y + p.length);
          ctx.stroke();

          p.y += p.speed;

          // Recycle when offscreen
          if (p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * -50;
          }
        });

        // ⛈️ STORM PETIR LIGHTNING ENGINE
        if (mode === 'heavy-rain') {
          nextLightning--;
          if (nextLightning <= 0) {
            lightningFlash = Math.random() * 8 + 4; // Flash frames duration
            nextLightning = Math.random() * 800 + 600; // Schedule next
          }

          if (lightningFlash > 0) {
            lightningFlash--;
            // Rapid ambient flashes
            if (Math.random() > 0.4) {
              ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.08 + 0.02})`;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }
        }
      }

      // 3. TWINKLING CLEAR NIGHT STARS
      else if (mode === 'stars') {
        particles.forEach(p => {
          p.phase += p.twinkleSpeed;
          const currentOpacity = p.opacity * (0.4 + Math.sin(p.phase) * 0.6);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
          ctx.fill();

          // Sparkle extra cross lines for very bright stars
          if (p.radius > 2.0 && Math.sin(p.phase) > 0.85) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x - 3, p.y);
            ctx.lineTo(p.x + 3, p.y);
            ctx.moveTo(p.x, p.y - 3);
            ctx.lineTo(p.x, p.y + 3);
            ctx.stroke();
          }
        });
      }

      // 4. FLOATING SPARKLING SUNSET ORANGE GLOWS
      else if (mode === 'sparkles') {
        particles.forEach(p => {
          p.wobble += p.wobbleSpeed;
          p.x += Math.sin(p.wobble) * 0.25;
          p.y += p.speedY;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          // Sunset orange/pink gradient bubbles
          ctx.fillStyle = `rgba(244, 63, 94, ${p.opacity})`;
          ctx.fill();

          // Outer cozy aura
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity * 0.2})`;
          ctx.fill();

          // Recycle when float off-screen
          if (p.y < -20) {
            p.y = canvas.height + Math.random() * 80;
            p.x = Math.random() * canvas.width;
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
  }, [mode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0" 
      style={{ opacity: 0.8 }}
      aria-hidden="true"
    />
  );
}
