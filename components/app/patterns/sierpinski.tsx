'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';

const CANVAS_SIZE = 540;

const createVertices = (size: number) => {
  const height = (Math.sqrt(3) / 2) * size;
  return [
    { x: size / 2, y: 0 },
    { x: 0, y: height },
    { x: size, y: height },
  ];
};

export function SierpinskiSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pointRef = useRef<{ x: number; y: number }>({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
  const [pointsPerFrame, setPointsPerFrame] = useState(180);
  const [running, setRunning] = useState(true);
  const [pointCount, setPointCount] = useState(0);

  const vertices = useMemo(() => createVertices(CANVAS_SIZE - 40), []);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';

    for (let i = 0; i < pointsPerFrame; i++) {
      const target = vertices[Math.floor(Math.random() * vertices.length)];
      pointRef.current = {
        x: (pointRef.current.x + target.x) / 2,
        y: (pointRef.current.y + target.y) / 2,
      };
      ctx.fillRect(pointRef.current.x + 20, pointRef.current.y + 30, 1.2, 1.2);
    }

    setPointCount(prev => prev + pointsPerFrame);
    animationRef.current = window.requestAnimationFrame(drawFrame);
  }, [pointsPerFrame, vertices]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x + 20, vertices[0].y + 30);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x + 20, vertices[i].y + 30);
    }
    ctx.closePath();
    ctx.stroke();
  }, [vertices]);

  useEffect(() => {
    if (!running) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    animationRef.current = window.requestAnimationFrame(drawFrame);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [drawFrame, running]);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setRunning(false);
    setPointCount(0);
    pointRef.current = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(vertices[0].x + 20, vertices[0].y + 30);
    for (let i = 1; i < vertices.length; i++) {
      ctx.lineTo(vertices[i].x + 20, vertices[i].y + 30);
    }
    ctx.closePath();
    ctx.stroke();
  }, [vertices]);

  const handleResume = () => setRunning(true);

  return (
    <section className="relative flex min-h-[80vh] flex-col justify-between rounded-3xl border border-leiden/20 bg-white p-8 shadow-lg">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-leiden">Sierpiński Triangle</h2>
          <p className="max-w-2xl text-muted-foreground">
            Points fall halfway toward a randomly chosen vertex of an equilateral triangle. Over
            time the chaos game reveals the famous fractal.
          </p>
        </div>
        <div className="rounded-full border border-leiden/20 px-4 py-1 text-sm text-leiden">
          Points drawn: <span className="font-semibold">{pointCount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <canvas ref={canvasRef} className="rounded-3xl border border-leiden/10 shadow-2xl" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleResume}
            disabled={running}
            className="bg-leiden text-white hover:bg-leiden/90"
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button onClick={() => setRunning(false)} disabled={!running} variant="outline">
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <div className="w-full max-w-sm space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Points per frame: <span className="font-semibold text-leiden">{pointsPerFrame}</span>
          </label>
          <Slider
            value={[pointsPerFrame]}
            onValueChange={value => setPointsPerFrame(value[0])}
            min={60}
            max={360}
            step={20}
          />
        </div>
      </div>
    </section>
  );
}
