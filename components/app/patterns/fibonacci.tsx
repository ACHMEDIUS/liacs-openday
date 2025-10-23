'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';

const SIZE = 520;
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34];

type Orientation = 0 | 1 | 2 | 3;

interface Square {
  index: number;
  size: number;
  x: number;
  y: number;
}

const buildSquares = () => {
  const squares: Square[] = [];
  let orientation: Orientation = 0;
  let x = 0;
  let y = 0;
  let width = FIB[0];
  let height = FIB[0];

  squares.push({ index: 0, size: FIB[0], x, y });
  squares.push({ index: 1, size: FIB[1], x: 1, y: 0 });

  width = FIB[0] + FIB[1];
  height = FIB[0];
  x = 0;
  y = 0;
  orientation = 1;

  for (let i = 2; i < FIB.length; i++) {
    const size = FIB[i];
    switch (orientation) {
      case 0:
        squares.push({ index: i, size, x: x + width, y });
        width += size;
        orientation = 1;
        break;
      case 1:
        squares.push({ index: i, size, x, y: y - size });
        height += size;
        y -= size;
        orientation = 2;
        break;
      case 2:
        squares.push({ index: i, size, x: x - size, y });
        width += size;
        x -= size;
        orientation = 3;
        break;
      case 3:
        squares.push({ index: i, size, x, y: y + height });
        height += size;
        orientation = 0;
        break;
    }
  }

  // Normalise to positive coordinates
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  squares.forEach(sq => {
    minX = Math.min(minX, sq.x);
    minY = Math.min(minY, sq.y);
    maxX = Math.max(maxX, sq.x + sq.size);
    maxY = Math.max(maxY, sq.y + sq.size);
  });

  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const scale = (SIZE * 0.8) / Math.max(spanX, spanY);
  const offsetX = (SIZE - spanX * scale) / 2 - minX * scale;
  const offsetY = (SIZE - spanY * scale) / 2 - minY * scale;

  return squares.map(sq => ({
    index: sq.index,
    size: sq.size * scale,
    x: offsetX + sq.x * scale,
    y: offsetY + sq.y * scale,
  }));
};

export function FibonacciSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const [speed, setSpeed] = useState(0.8);

  const squares = useMemo(buildSquares, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    canvas.style.width = `${SIZE}px`;
    canvas.style.height = `${SIZE}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, SIZE, SIZE);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    indexRef.current = 0;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, SIZE, SIZE);

    const drawNext = () => {
      if (indexRef.current >= squares.length) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return;
      }
      const sq = squares[indexRef.current];
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(sq.x, sq.y, sq.size, sq.size);

      ctx.beginPath();
      switch (indexRef.current % 4) {
        case 0:
          ctx.arc(sq.x + sq.size, sq.y + sq.size, sq.size, Math.PI, Math.PI * 1.5);
          break;
        case 1:
          ctx.arc(sq.x, sq.y + sq.size, sq.size, Math.PI * 1.5, Math.PI * 2);
          break;
        case 2:
          ctx.arc(sq.x, sq.y, sq.size, 0, Math.PI / 2);
          break;
        case 3:
          ctx.arc(sq.x + sq.size, sq.y, sq.size, Math.PI / 2, Math.PI);
          break;
      }
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
      ctx.fillRect(sq.x, sq.y, sq.size, sq.size);

      indexRef.current++;
      timeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(drawNext);
      }, 600 / speed);
    };

    drawNext();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [squares, speed]);

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-between rounded-3xl border border-rose-300/40 bg-white p-8 shadow-lg">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-rose-600">Fibonacci Spiral</h2>
          <p className="max-w-2xl text-muted-foreground">
            Squares sized by consecutive Fibonacci numbers tile the plane. Connecting quarter arcs
            reveals the golden spiral.
          </p>
        </div>
        <div className="rounded-full border border-rose-200 px-4 py-1 text-sm text-rose-500">
          Step {Math.min(indexRef.current, squares.length)} / {squares.length}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-[2rem] border border-rose-200 shadow-[0_25px_80px_rgba(244,114,182,0.25)]"
        />
      </div>

      <div className="mt-6 w-full max-w-sm space-y-2 self-end text-left text-sm">
        <label className="text-xs uppercase tracking-wide text-rose-500">
          Reveal pace • <span className="font-semibold text-rose-600">{speed.toFixed(1)}x</span>
        </label>
        <Slider
          value={[speed]}
          onValueChange={value => setSpeed(value[0])}
          min={0.4}
          max={3}
          step={0.1}
        />
      </div>
    </section>
  );
}
