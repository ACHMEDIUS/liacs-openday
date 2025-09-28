'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Cat, Play, Pause, RotateCcw } from 'lucide-react';
import {
  MazeGrid,
  computeBfsSteps,
  computeDfsSteps,
  computeFloodFillSteps,
  MazeStep,
  Position,
} from '@/lib/maze-algorithms';

const MAZE: MazeGrid = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0],
];

const START: Position = { row: 0, col: 0 };
const GOAL: Position = { row: 15, col: 15 };

interface AlgorithmConfig {
  id: 'bfs' | 'dfs' | 'flood';
  title: string;
  description: string;
  color: string;
  steps: MazeStep[];
}

const TILE = 40;

const MazeBoard = ({
  algorithm,
  step,
  label,
}: {
  algorithm: AlgorithmConfig;
  step: MazeStep;
  label: string;
}) => {
  const visitedKeys = new Set(step.visited.map((pos) => `${pos.row}-${pos.col}`));
  const pathKeys = new Set((step.path ?? []).map((pos) => `${pos.row}-${pos.col}`));
  const frontierKeys = new Set((step.frontier ?? []).map((pos) => `${pos.row}-${pos.col}`));
  const currentKey = step.current ? `${step.current.row}-${step.current.col}` : undefined;

  const pathLength = step.path?.length ?? 0;
  const statusMessage = step.done
    ? 'Traversal complete.'
    : step.current
      ? `Exploring row ${step.current.row + 1}, column ${step.current.col + 1}.`
      : 'Preparing traversal…';

  return (
    <Card className="flex h-full min-h-[60vh] flex-col overflow-hidden">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold" style={{ color: algorithm.color }}>
            {algorithm.title}
          </CardTitle>
          <Badge variant="outline" style={{ borderColor: algorithm.color, color: algorithm.color }}>
            {label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            Visited <span className="font-semibold text-foreground">{step.visited.length}</span>
          </span>
          {pathLength > 0 && (
            <span>
              Path length <span className="font-semibold text-foreground">{pathLength}</span>
            </span>
          )}
          {step.frontier && step.frontier.length > 0 && (
            <span>
              Frontier <span className="font-semibold text-foreground">{step.frontier.length}</span>
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        <div className="overflow-x-auto">
          <div
            className="grid shrink-0"
            style={{
              gridTemplateColumns: `repeat(${MAZE[0].length}, ${TILE}px)`,
              gridTemplateRows: `repeat(${MAZE.length}, ${TILE}px)`,
            }}
          >
            {MAZE.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isWall = cell === 1;
                const isStart = rowIndex === START.row && colIndex === START.col;
                const isGoal = rowIndex === GOAL.row && colIndex === GOAL.col;
                const isCurrent = currentKey === key;
                const inPath = pathKeys.has(key);
                const isVisited = visitedKeys.has(key);
                const inFrontier = frontierKeys.has(key);

                let className = 'flex items-center justify-center border border-white/15 bg-white transition-colors';
                if (isWall) className = 'flex items-center justify-center border border-slate-800 bg-slate-900';
                else if (inPath) className = 'flex items-center justify-center border text-white';
                else if (inFrontier) className = 'flex items-center justify-center border bg-amber-100 text-slate-900';
                else if (isVisited) className = 'flex items-center justify-center border bg-slate-100';

                const style = inPath
                  ? { backgroundColor: algorithm.color, color: '#fff' }
                  : isCurrent
                    ? { borderColor: algorithm.color, backgroundColor: 'rgba(255,255,255,0.85)' }
                    : isWall
                      ? { backgroundColor: '#0f172a', borderColor: '#1e293b' }
                      : inFrontier
                        ? { borderColor: algorithm.color }
                        : undefined;

                return (
                  <div key={key} className={className} style={style}>
                    {isCurrent ? <Cat className="h-5 w-5" strokeWidth={1.8} style={{ color: algorithm.color }} /> : null}
                    {isStart && !isCurrent ? (
                      <span className="text-xs font-medium text-emerald-600">START</span>
                    ) : null}
                    {isGoal && !isCurrent ? (
                      <span className="text-xs font-medium text-purple-600">GOAL</span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-lg border border-muted bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          {statusMessage}
        </div>
      </CardContent>
    </Card>
  );
};

export default function MazesPage() {
  const [compareMode, setCompareMode] = useState(false);
  const [primaryId, setPrimaryId] = useState<'bfs' | 'dfs' | 'flood'>('bfs');
  const [secondaryId, setSecondaryId] = useState<'bfs' | 'dfs' | 'flood'>('dfs');
  const [speed, setSpeed] = useState(320);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const algorithms = useMemo<Record<AlgorithmConfig['id'], AlgorithmConfig>>(
    () => ({
      bfs: {
        id: 'bfs',
        title: 'Breadth-First Search',
        description: 'Expands outward level by level, guaranteeing the shortest path to the goal.',
        color: '#2563eb',
        steps: computeBfsSteps(MAZE, START, GOAL),
      },
      dfs: {
        id: 'dfs',
        title: 'Depth-First Search',
        description: 'Dives deep down one corridor before backtracking to try alternatives.',
        color: '#9333ea',
        steps: computeDfsSteps(MAZE, START, GOAL),
      },
      flood: {
        id: 'flood',
        title: 'Flood Fill',
        description: 'Spreads through every reachable tile to map the maze interior.',
        color: '#0ea5e9',
        steps: computeFloodFillSteps(MAZE, START),
      },
    }),
    []
  );

  const primary = algorithms[primaryId];
  const secondary = algorithms[secondaryId];
  const activeAlgorithms = useMemo(() => (compareMode ? [primary, secondary] : [primary]), [compareMode, primary, secondary]);
  const maxSteps = useMemo(() => {
    const lengths = activeAlgorithms.map((algo) => algo.steps.length);
    return Math.max(...lengths);
  }, [activeAlgorithms]);

  const stepFor = useCallback(
    (algo: AlgorithmConfig): MazeStep => {
      const index = Math.min(stepIndex, algo.steps.length - 1);
      return algo.steps[index];
    },
    [stepIndex]
  );

  useEffect(() => {
    if (!running || paused) return;
    let last = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      if (now - last >= speed) {
        setStepIndex((prev) => {
          if (prev + 1 >= maxSteps) {
            setRunning(false);
            setPaused(false);
            return maxSteps - 1;
          }
          return prev + 1;
        });
        last = now;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [running, paused, speed, maxSteps]);

  const handleStart = () => {
    setStepIndex(0);
    setRunning(true);
    setPaused(false);
  };

  const handlePause = () => {
    if (!running) return;
    setPaused((prev) => !prev);
  };

  const handleReset = () => {
    setRunning(false);
    setPaused(false);
    setStepIndex(0);
  };

  const disableSecondarySelect = !compareMode;

  return (
    <div className="container mx-auto max-w-7xl space-y-10 px-4 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold text-leiden">Maze Explorer</h1>
        <p className="max-w-3xl text-muted-foreground">
          Watch our curious cat traverse the same maze with different strategies. Compare algorithms side by side or focus on a single explorer.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Simulation controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
            <div className="w-full max-w-xs space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Primary algorithm</label>
              <Select value={primaryId} onValueChange={(value) => setPrimaryId(value as AlgorithmConfig['id'])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">Breadth-First Search</SelectItem>
                  <SelectItem value="dfs">Depth-First Search</SelectItem>
                  <SelectItem value="flood">Flood Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full max-w-xs space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Secondary (compare)</label>
              <Select
                value={secondaryId}
                onValueChange={(value) => setSecondaryId(value as AlgorithmConfig['id'])}
                disabled={disableSecondarySelect}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">Breadth-First Search</SelectItem>
                  <SelectItem value="dfs">Depth-First Search</SelectItem>
                  <SelectItem value="flood">Flood Fill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <Switch checked={compareMode} onCheckedChange={setCompareMode} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compare two algorithms</p>
                <p className="text-xs text-muted-foreground">Toggle off for a single full-width view.</p>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Step interval: <span className="font-semibold text-leiden">{speed} ms</span>
              </label>
              <Slider value={[speed]} onValueChange={(value) => setSpeed(value[0])} min={80} max={800} step={20} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleStart} disabled={running && !paused} className="bg-leiden text-white hover:bg-leiden/90">
          <Play className="mr-2 h-4 w-4" /> Start
        </Button>
        <Button onClick={handlePause} disabled={!running} variant="outline">
          <Pause className="mr-2 h-4 w-4" /> {paused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Badge variant="outline" className="text-sm">
          Step {Math.min(stepIndex + 1, maxSteps)} / {maxSteps}
        </Badge>
      </div>

      <div className={`grid gap-6 ${compareMode ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {activeAlgorithms.map((algo, idx) => (
          <MazeBoard
            key={algo.id}
            algorithm={algo}
            step={stepFor(algo)}
            label={compareMode ? (idx === 0 ? 'Explorer A' : 'Explorer B') : 'Explorer'}
          />
        ))}
      </div>
    </div>
  );
}
