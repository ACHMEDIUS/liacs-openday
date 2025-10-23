'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';

const SIZE = 520;
const GRID = 41;
const TILE = Math.floor(SIZE / GRID);
const TOTAL = GRID * GRID;

interface Cell {
  index: number;
  x: number;
  y: number;
  prime: boolean;
}

const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  const limit = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

const buildSpiral = (): Cell[] => {
  const cells: Cell[] = [];
  let x = 0;
  let y = 0;
  let dx = 1;
  let dy = 0;
  let segmentLength = 1;
  let segmentPassed = 0;
  let steps = 0;

  for (let n = 1; n <= TOTAL; n++) {
    const cx = Math.floor(GRID / 2) + x;
    const cy = Math.floor(GRID / 2) - y;
    cells.push({
      index: n,
      x: cx,
      y: cy,
      prime: isPrime(n),
    });

    x += dx;
    y += dy;
    segmentPassed++;
    if (segmentPassed === segmentLength) {
      segmentPassed = 0;
      const temp = dx;
      dx = -dy;
      dy = temp;
      steps++;
      if (steps % 2 === 0) {
        segmentLength++;
      }
    }
  }

  return cells;
};

export function UlamSpiralSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const indexRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [speed, setSpeed] = useState(40);
  const [latestPrime, setLatestPrime] = useState<number | null>(null);

  const cells = useMemo(buildSpiral, []);

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

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, SIZE, SIZE);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      for (let i = 0; i < speed; i++) {
        if (indexRef.current >= cells.length) break;
        const cell = cells[indexRef.current];
        const px = cell.x * TILE + (SIZE - GRID * TILE) / 2;
        const py = cell.y * TILE + (SIZE - GRID * TILE) / 2;

        if (cell.prime) {
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(px, py, TILE, TILE);
          setLatestPrime(cell.index);
        } else {
          ctx.fillStyle = 'rgba(148, 163, 184, 0.2)';
          ctx.fillRect(px, py, TILE, TILE);
        }

        indexRef.current++;
      }
      animationRef.current = window.requestAnimationFrame(draw);
    };

    animationRef.current = window.requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [cells, speed]);

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-between rounded-3xl border border-sky-400/30 bg-slate-900 p-8 text-white shadow-xl">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Ulam Spiral</h2>
          <p className="max-w-2xl text-slate-200/80">
            Natural numbers arranged in a spiral highlight prime constellations clustering along
            diagonal lines.
          </p>
        </div>
        <div className="rounded-full border border-white/20 px-4 py-1 text-sm text-white/80">
          Latest prime: <span className="font-semibold text-white">{latestPrime ?? '—'}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-3xl border border-cyan-400/30 shadow-[0_25px_120px_rgba(56,189,248,0.45)]"
        />
      </div>

      <div className="mt-6 w-full max-w-sm space-y-2 self-end text-left text-sm">
        <label className="text-xs uppercase tracking-wide text-white/70">
          Numbers per frame • <span className="font-semibold text-white">{speed}</span>
        </label>
        <Slider
          value={[speed]}
          onValueChange={value => setSpeed(value[0])}
          min={10}
          max={120}
          step={5}
        />
      </div>
    </section>
  );
}
