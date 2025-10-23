'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

const SIZE = 520;
const TILE = 40;
const GRID = Math.floor(SIZE / TILE);

const drawTile = (ctx: CanvasRenderingContext2D, x: number, y: number, orientation: number) => {
  ctx.save();
  ctx.translate(x + TILE / 2, y + TILE / 2);
  ctx.rotate((Math.PI / 2) * orientation);
  ctx.translate(-TILE / 2, -TILE / 2);

  ctx.strokeStyle = '#0b7285';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, TILE / 2, 0, Math.PI / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(TILE, TILE, TILE / 2, Math.PI, (3 * Math.PI) / 2);
  ctx.stroke();

  ctx.restore();
};

export function TruchetSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [speed, setSpeed] = useState(1.5);
  const [frame, setFrame] = useState(0);

  const orientations = useMemo(() => {
    const matrix: number[][] = [];
    for (let row = 0; row < GRID; row++) {
      const columns: number[] = [];
      for (let col = 0; col < GRID; col++) {
        columns.push(Math.floor(Math.random() * 4));
      }
      matrix.push(columns);
    }
    return matrix;
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, SIZE, SIZE);

    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        const orientation = orientations[row][col];
        drawTile(ctx, col * TILE, row * TILE, orientation);
      }
    }
  }, [orientations]);

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

    redraw();
  }, [redraw]);

  useEffect(() => {
    const animate = () => {
      const changes = Math.ceil(speed * 4);
      for (let i = 0; i < changes; i++) {
        const row = Math.floor(Math.random() * GRID);
        const col = Math.floor(Math.random() * GRID);
        orientations[row][col] = (orientations[row][col] + 1) % 4;
      }
      redraw();
      setFrame(prev => prev + 1);
      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [orientations, redraw, speed]);

  const shuffle = () => {
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        orientations[row][col] = Math.floor(Math.random() * 4);
      }
    }
    redraw();
  };

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-between rounded-3xl border border-leiden/20 bg-slate-900 p-8 text-white shadow-xl">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Truchet Tiles</h2>
          <p className="max-w-2xl text-slate-200/80">
            Each tile is a quarter-circle motif rotated randomly. The mosaic shifts over time,
            producing emergent labyrinths.
          </p>
        </div>
        <div className="rounded-full border border-white/20 px-4 py-1 text-sm text-white/80">
          Frames evolved: <span className="font-semibold text-white">{frame.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(15,23,42,0.4)]"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <Button
          type="button"
          variant="outline"
          onClick={shuffle}
          className="border-white/30 text-white hover:bg-white/10"
        >
          <RotateCw className="mr-2 h-4 w-4" /> Remap mosaic
        </Button>

        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/70">
            Mutation speed • <span className="font-semibold text-white">{speed.toFixed(1)}x</span>
          </label>
          <Slider
            value={[speed]}
            onValueChange={value => setSpeed(value[0])}
            min={0.5}
            max={4}
            step={0.1}
          />
        </div>
      </div>
    </section>
  );
}
