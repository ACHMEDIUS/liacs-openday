'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import {
  AlgorithmId,
  SortStep,
  getAlgorithmById,
  sortingAlgorithms,
  defaultAlgorithmId,
} from '@/lib/sorting-algorithms';

interface SortVisualizerProps {
  label: string;
  baseArray: number[];
  baseArrayVersion: number;
  speed: number;
  disabled?: boolean;
  onRunningChange?: (isRunning: boolean) => void;
  initialAlgorithm?: AlgorithmId;
  compactControls?: boolean;
}

const COLORS = {
  default: 'bg-leiden',
  comparing: 'bg-yellow-500',
  swapping: 'bg-red-500',
  sorted: 'bg-green-500',
};

const getBarHeightPercentages = (array: number[]) => {
  const max = Math.max(...array, 1);
  return array.map(value => (value / max) * 100);
};

export function SortVisualizer({
  label,
  baseArray,
  baseArrayVersion,
  speed,
  disabled = false,
  onRunningChange,
  initialAlgorithm = defaultAlgorithmId,
  compactControls = false,
}: SortVisualizerProps) {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>(initialAlgorithm);
  const [array, setArray] = useState<number[]>(baseArray);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

  const availableAlgorithms = useMemo(() => sortingAlgorithms, []);
  const algorithm = useMemo(() => getAlgorithmById(algorithmId), [algorithmId]);

  useEffect(() => {
    setArray([...baseArray]);
    setSteps([]);
    setStepIndex(0);
    setIsRunning(false);
    setIsPaused(false);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
  }, [baseArrayVersion, baseArray, algorithmId]);

  useEffect(() => {
    onRunningChange?.(isRunning);
  }, [isRunning, onRunningChange]);

  useEffect(() => {
    if (!isRunning || isPaused || steps.length === 0) return;
    if (stepIndex >= steps.length) {
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    const timer = setTimeout(() => {
      const step = steps[stepIndex];
      if (!step) {
        setIsRunning(false);
        setIsPaused(false);
        return;
      }

      applyStep(step);
      setStepIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, isPaused, steps, stepIndex, speed]);

  const applyStep = (step: SortStep) => {
    setArray(step.array);
    setComparing(step.comparing ?? []);
    setSwapping(step.swapping ?? []);
    setSortedIndices(step.sorted ?? []);
  };

  const handleStart = () => {
    if (isRunning || disabled) return;
    const generator = algorithm.generateSteps;
    const generatedSteps = generator([...baseArray]);
    setSteps(generatedSteps);
    setStepIndex(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    if (!isRunning) return;
    setIsPaused(prev => !prev);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSteps([]);
    setStepIndex(0);
    setArray([...baseArray]);
    setComparing([]);
    setSwapping([]);
    setSortedIndices([]);
  };

  const handleReset = () => {
    handleStop();
  };

  const barHeights = useMemo(() => getBarHeightPercentages(array), [array]);

  const widthPercentage = useMemo(() => {
    if (array.length === 0) return '0%';
    const width = 100 / array.length;
    return `${Math.max(width, 1)}%`;
  }, [array.length]);

  const legend = (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <div className={`h-3 w-3 rounded ${COLORS.default}`}></div>
        <span>Unsorted</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={`h-3 w-3 rounded ${COLORS.comparing}`}></div>
        <span>Comparing</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={`h-3 w-3 rounded ${COLORS.swapping}`}></div>
        <span>Transferring</span>
      </div>
      <div className="flex items-center gap-1">
        <div className={`h-3 w-3 rounded ${COLORS.sorted}`}></div>
        <span>Sorted</span>
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        {/* TODO: Fix later */}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xl font-semibold text-leiden">Algorithm</label>
              <Select
                value={algorithmId}
                onValueChange={value => {
                  const newValue = value as AlgorithmId;
                  setAlgorithmId(newValue);
                  setIsRunning(false);
                  setIsPaused(false);
                  setSteps([]);
                  setStepIndex(0);
                  setArray([...baseArray]);
                }}
                disabled={isRunning || disabled}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableAlgorithms.map(algo => (
                    <SelectItem key={algo.id} value={algo.id}>
                      {algo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-2">
                <span className="text-sm font-medium">Visualization</span>
                <span className="text-xs text-muted-foreground">{array.length} elements</span>
              </div>
              <div className="flex h-64 items-end justify-stretch gap-[2px] px-4 py-4 sm:h-72">
                {array.map((value, index) => {
                  const height = `${barHeights[index]}%`;
                  const isSorted = sortedIndices.includes(index);
                  const isSwapping = swapping.includes(index);
                  const isComparing = comparing.includes(index);
                  const barClass = isSorted
                    ? COLORS.sorted
                    : isSwapping
                      ? COLORS.swapping
                      : isComparing
                        ? COLORS.comparing
                        : COLORS.default;
                  return (
                    <div
                      key={`${baseArrayVersion}-${index}`}
                      className={`flex flex-col items-center justify-end rounded-sm transition-all duration-150 ${barClass}`}
                      style={{ width: widthPercentage, height }}
                    >
                      {array.length <= 24 && (
                        <span className="mb-1 rotate-90 transform whitespace-nowrap font-mono text-[10px] text-white">
                          {value}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleStart}
                disabled={isRunning || disabled}
                className="bg-leiden text-white hover:bg-leiden/90"
              >
                <Play className={compactControls ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
                {!compactControls && 'Start'}
              </Button>
              <Button onClick={handlePauseResume} disabled={!isRunning} variant="outline">
                {isPaused ? (
                  <Play className={compactControls ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
                ) : (
                  <Pause className={compactControls ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
                )}
                {!compactControls && (isPaused ? 'Resume' : 'Pause')}
              </Button>
              <Button onClick={handleStop} disabled={!isRunning} variant="outline">
                <Square className={compactControls ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
                {!compactControls && 'Stop'}
              </Button>
              <Button onClick={handleReset} disabled={isRunning} variant="outline">
                <RotateCcw className={compactControls ? 'h-4 w-4' : 'mr-2 h-4 w-4'} />
                {!compactControls && 'Reset'}
              </Button>
            </div>

            <div className="space-y-3 rounded-lg border bg-card px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Complexity
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground">Best</div>
                  <Badge variant="outline">{algorithm.best}</Badge>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground">Average</div>
                  <Badge variant="outline">{algorithm.average}</Badge>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground">Worst</div>
                  <Badge variant="outline">{algorithm.worst}</Badge>
                </div>
                <div>
                  <div className="text-[11px] uppercase text-muted-foreground">Space</div>
                  <Badge variant="outline">{algorithm.space}</Badge>
                </div>
              </div>
            </div>

            {legend}
          </div>
        </div>
      </CardContent>
      {algorithm.code ? (
        <div className="mx-6 mb-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            Reference Implementation
          </div>
          <pre className="max-h-64 overflow-auto whitespace-pre font-mono text-xs text-emerald-200">
            <code>{algorithm.code}</code>
          </pre>
        </div>
      ) : null}
    </Card>
  );
}
