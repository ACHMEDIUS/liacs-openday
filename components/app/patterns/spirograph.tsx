'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';

const SIZE = 520;
const CENTER = SIZE / 2;

export function SpirographSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const tRef = useRef(0);
  const prevPoint = useRef<{ x: number; y: number } | null>(null);

  const [speed, setSpeed] = useState(1.8);
  const [running, setRunning] = useState(true);

  const drawSegment = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const R = 140;
    const r = 35;
    const d = 90;
    const steps = Math.floor(120 * speed);

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.8;

    for (let i = 0; i < steps; i++) {
      tRef.current += 0.01;
      const x =
        CENTER + (R - r) * Math.cos(tRef.current) + d * Math.cos(((R - r) / r) * tRef.current);
      const y =
        CENTER + (R - r) * Math.sin(tRef.current) - d * Math.sin(((R - r) / r) * tRef.current);

      if (prevPoint.current) {
        ctx.beginPath();
        ctx.moveTo(prevPoint.current.x, prevPoint.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      prevPoint.current = { x, y };
    }

    animationRef.current = window.requestAnimationFrame(drawSegment);
  }, [speed]);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    tRef.current = 0;
    prevPoint.current = null;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, SIZE, SIZE);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 12, 0, Math.PI * 2);
    ctx.stroke();
  }, []);

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

    reset();
  }, [reset]);

  useEffect(() => {
    if (!running) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }
    animationRef.current = window.requestAnimationFrame(drawSegment);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [drawSegment, running]);

  const handleStart = () => setRunning(true);

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-between rounded-3xl border border-orange-300/40 bg-gradient-to-b from-slate-900 via-slate-900 to-black p-8 text-white shadow-2xl">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold">Spirograph</h2>
          <p className="max-w-2xl text-slate-200/80">
            A hypotrochoid curve traced by a point attached to a rolling circle. Adjust the drawing
            speed to reveal intricate harmonics.
          </p>
        </div>
        <div className="rounded-full border border-white/20 px-4 py-1 text-sm text-white/70">
          Parameter t: <span className="font-semibold text-white">{tRef.current.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <canvas
          ref={canvasRef}
          className="rounded-[2rem] border border-orange-400/30 shadow-[0_25px_120px_rgba(249,115,22,0.45)]"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleStart}
            disabled={running}
            className="bg-orange-500 text-white hover:bg-orange-500/90"
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button
            onClick={() => setRunning(false)}
            disabled={!running}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="w-full max-w-sm space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/70">
            Trace speed • <span className="font-semibold text-white">{speed.toFixed(1)}x</span>
          </label>
          <Slider
            value={[speed]}
            onValueChange={value => setSpeed(value[0])}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>
      </div>
    </section>
  );
}
