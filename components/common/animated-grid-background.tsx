'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let DPR = Math.max(1, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;

    // Configuration
    const config = {
      dotColor: '#001158', // Leiden blue
      glowColor: '#0066ff', // Brighter Leiden blue glow
      lineRevealColor: '#00115830', // Revealed line color
      glowRadius: 30, // 30px glow radius around dots
    };

    // Grid lines and dots
    const gridSystem = {
      verticalLines: [] as Array<{ x: number; dots: Array<{ y: number; direction: 'up' | 'down'; speed: number; progress: number; lastY: number }> }>,
      horizontalLines: [] as Array<{ y: number; dots: Array<{ x: number; direction: 'left' | 'right'; speed: number; progress: number; lastX: number }> }>,
    };

    function getQRBounds() {
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;
      const qrSize = 250 + 32; // QR code width + padding
      return {
        left: centerX - qrSize / 2 - 100,
        right: centerX + qrSize / 2 + 100,
        top: centerY - qrSize / 2 - 100,
        bottom: centerY + qrSize / 2 + 100,
      };
    }

    function initGridSystem() {
      gridSystem.verticalLines = [];
      gridSystem.horizontalLines = [];

      const vw = canvas.clientWidth / 100;
      const vh = canvas.clientHeight / 100;
      const qrBounds = getQRBounds();

      // Left vertical lines (3 lines, 5vw apart)
      for (let i = 0; i < 3; i++) {
        const x = 10 * vw + i * 5 * vw; // Start at 10vw, then 15vw, 20vw
        if (x < qrBounds.left) {
          gridSystem.verticalLines.push({
            x,
            dots: [{
              y: canvas.clientHeight + 50, // Start from bottom
              direction: 'up',
              speed: 50 + Math.random() * 30,
              progress: Math.random() * 2,
              lastY: canvas.clientHeight + 50,
            }]
          });
        }
      }

      // Right vertical lines (3 lines, 5vw apart)
      for (let i = 0; i < 3; i++) {
        const x = canvas.clientWidth - (10 * vw + i * 5 * vw); // Mirror of left side
        if (x > qrBounds.right) {
          gridSystem.verticalLines.push({
            x,
            dots: [{
              y: -50, // Start from top
              direction: 'down',
              speed: 50 + Math.random() * 30,
              progress: Math.random() * 2,
              lastY: -50,
            }]
          });
        }
      }

      // Top horizontal lines (3 lines, 5vh apart)
      for (let i = 0; i < 3; i++) {
        const y = 10 * vh + i * 5 * vh; // Start at 10vh, then 15vh, 20vh
        if (y < qrBounds.top) {
          gridSystem.horizontalLines.push({
            y,
            dots: [{
              x: -50, // Start from left
              direction: 'right',
              speed: 50 + Math.random() * 30,
              progress: Math.random() * 2,
              lastX: -50,
            }]
          });
        }
      }

      // Bottom horizontal lines (3 lines, 5vh apart)
      for (let i = 0; i < 3; i++) {
        const y = canvas.clientHeight - (10 * vh + i * 5 * vh); // Mirror of top
        if (y > qrBounds.bottom) {
          gridSystem.horizontalLines.push({
            y,
            dots: [{
              x: canvas.clientWidth + 50, // Start from right
              direction: 'left',
              speed: 50 + Math.random() * 30,
              progress: Math.random() * 2,
              lastX: canvas.clientWidth + 50,
            }]
          });
        }
      }
    }

    function resize() {
      const { clientWidth, clientHeight } = canvas;
      W = clientWidth * DPR;
      H = clientHeight * DPR;
      canvas.width = W;
      canvas.height = H;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initGridSystem();
    }

    function drawGradientBackground() {
      const centerX = canvas.clientWidth / 2;
      const centerY = canvas.clientHeight / 2;
      const maxRadius = Math.max(canvas.clientWidth, canvas.clientHeight);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 200, centerX, centerY, maxRadius);
      gradient.addColorStop(0, '#f46e32'); // Leiden orange at center
      gradient.addColorStop(0.6, '#e55a1f'); // Slightly darker orange
      gradient.addColorStop(1, '#d4501a'); // Even darker at edges
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }

    function drawLineSegment(x1: number, y1: number, x2: number, y2: number, dotX: number, dotY: number) {
      const distance = Math.sqrt((dotX - x1) ** 2 + (dotY - y1) ** 2);
      const distance2 = Math.sqrt((dotX - x2) ** 2 + (dotY - y2) ** 2);
      const minDistance = Math.min(distance, distance2);
      
      if (minDistance < config.glowRadius) {
        const alpha = Math.max(0, 1 - minDistance / config.glowRadius);
        ctx.save();
        ctx.globalAlpha = alpha * 0.8;
        ctx.strokeStyle = config.lineRevealColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawDot(x: number, y: number) {
      ctx.save();
      
      // Outer glow
      ctx.shadowBlur = 25;
      ctx.shadowColor = config.glowColor;
      ctx.fillStyle = config.dotColor;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner bright core
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    function updateDots(dt: number) {
      const qrBounds = getQRBounds();
      
      // Update vertical line dots
      for (const line of gridSystem.verticalLines) {
        for (const dot of line.dots) {
          dot.lastY = dot.y;
          
          if (dot.direction === 'up') {
            dot.y -= dot.speed * dt;
            // Skip QR area
            if (dot.y <= qrBounds.bottom && dot.y >= qrBounds.top) {
              dot.y = qrBounds.top;
            }
            // Reset when reaching top
            if (dot.y < -50) {
              dot.y = canvas.clientHeight + 50 + Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
          } else {
            dot.y += dot.speed * dt;
            // Skip QR area
            if (dot.y >= qrBounds.top && dot.y <= qrBounds.bottom) {
              dot.y = qrBounds.bottom;
            }
            // Reset when reaching bottom
            if (dot.y > canvas.clientHeight + 50) {
              dot.y = -50 - Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
          }
        }
      }
      
      // Update horizontal line dots
      for (const line of gridSystem.horizontalLines) {
        for (const dot of line.dots) {
          dot.lastX = dot.x;
          
          if (dot.direction === 'right') {
            dot.x += dot.speed * dt;
            // Skip QR area
            if (dot.x >= qrBounds.left && dot.x <= qrBounds.right) {
              dot.x = qrBounds.right;
            }
            // Reset when reaching right edge
            if (dot.x > canvas.clientWidth + 50) {
              dot.x = -50 - Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
          } else {
            dot.x -= dot.speed * dt;
            // Skip QR area  
            if (dot.x <= qrBounds.right && dot.x >= qrBounds.left) {
              dot.x = qrBounds.left;
            }
            // Reset when reaching left edge
            if (dot.x < -50) {
              dot.x = canvas.clientWidth + 50 + Math.random() * 200;
              dot.speed = 50 + Math.random() * 30;
            }
          }
        }
      }
    }

    function render(dt: number) {
      // Draw gradient background
      drawGradientBackground();
      
      // Update dot positions
      updateDots(dt);
      
      // Draw vertical lines revealed by dots
      for (const line of gridSystem.verticalLines) {
        for (const dot of line.dots) {
          if (dot.y >= -50 && dot.y <= canvas.clientHeight + 50) {
            // Draw line segment around dot
            drawLineSegment(line.x, 0, line.x, canvas.clientHeight, line.x, dot.y);
            // Draw the dot
            drawDot(line.x, dot.y);
          }
        }
      }
      
      // Draw horizontal lines revealed by dots
      for (const line of gridSystem.horizontalLines) {
        for (const dot of line.dots) {
          if (dot.x >= -50 && dot.x <= canvas.clientWidth + 50) {
            // Draw line segment around dot
            drawLineSegment(0, line.y, canvas.clientWidth, line.y, dot.x, line.y);
            // Draw the dot
            drawDot(dot.x, line.y);
          }
        }
      }
    }

    let last = performance.now();
    function frame(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      
      render(dt);
      requestAnimationFrame(frame);
    }

    function fit() {
      resize();
    }

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    fit();
    requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-screen w-screen"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
  );
}
