'use client';

import { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shuffle, CircleHelp } from 'lucide-react';
import { SortVisualizer } from '@/components/app/sorting/visualizer';
import { createRandomArray } from '@/lib/sorting-algorithms';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SortingPage() {
  const [arraySize, setArraySize] = useState(24);
  const [speed, setSpeed] = useState(220);
  const [compareMode, setCompareMode] = useState(false);
  const [baseArray, setBaseArray] = useState<number[]>(() => createRandomArray(24));
  const [arrayVersion, setArrayVersion] = useState(0);
  const [leftRunning, setLeftRunning] = useState(false);
  const [rightRunning, setRightRunning] = useState(false);

  const anyRunning = leftRunning || rightRunning;

  const regenerateArray = useCallback(
    (size: number = arraySize) => {
      const next = createRandomArray(size);
      setBaseArray(next);
      setArrayVersion((v) => v + 1);
    },
    [arraySize]
  );

  const handleArraySizeChange = (value: number[]) => {
    const nextSize = value[0];
    setArraySize(nextSize);
  };

  const handleArraySizeCommit = (value: number[]) => {
    const nextSize = value[0];
    regenerateArray(nextSize);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const toggleCompareMode = (checked: boolean) => {
    if (anyRunning) return;
    setCompareMode(checked);
  };

  const helperSections = useMemo(
    () => [
      {
        title: 'How to use',
        points: [
          'Press Start to animate the selected algorithm. Pause or Stop to regain control.',
          'Shuffle regenerates a shared dataset so each run works on the same numbers.',
          'Adjust speed and array size to see how workload influences animation pacing.',
        ],
      },
      {
        title: 'Compare mode',
        points: [
          'Enable the toggle to place two visualizers side by side.',
          'Each panel can run a different algorithm but they share the same dataset.',
          'Great for contrasting strategies like Bubble vs Quick or Radix vs Sleep.',
        ],
      },
    ],
    []
  );

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-leiden">Sorting Algorithm Studio</h1>
        <p className="max-w-3xl text-muted-foreground">
          Experiment with classic sorting strategies, inspect their complexity, and compare two algorithms on
          the same input to see how their approaches differ in real time.
        </p>
      </header>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Shared Controls</CardTitle>
          </div>
          <TooltipProvider>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-leiden" aria-label="How to use">
                      <CircleHelp className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">How does this work?</TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader className="space-y-2">
                  <DialogTitle>Sorting Studio Tips</DialogTitle>
                  <DialogDescription>
                    Quick reminders for controlling the playground and comparing algorithms.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  {helperSections.map((section) => (
                    <div key={section.title} className="space-y-2">
                      <div className="font-medium text-foreground">{section.title}</div>
                      <ul className="list-disc space-y-1 pl-5">
                        {section.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <div className="w-full max-w-sm space-y-2">
              <Label className="text-sm font-medium">Array size: <span className="font-semibold">{arraySize}</span></Label>
              <Slider
                value={[arraySize]}
                onValueChange={handleArraySizeChange}
                onValueCommit={handleArraySizeCommit}
                min={6}
                max={80}
                step={1}
                disabled={anyRunning}
              />
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Label className="text-sm font-medium">Speed: <span className="font-semibold">{speed} ms</span></Label>
              <Slider value={[speed]} onValueChange={handleSpeedChange} min={40} max={1200} step={20} />
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <Switch checked={compareMode} onCheckedChange={toggleCompareMode} disabled={anyRunning} />
              <div>
                <Label className="text-sm font-medium">Compare algorithms</Label>
                <p className="text-xs text-muted-foreground">Toggle off to focus on a single visualizer.</p>
              </div>
            </div>
            <Button
              onClick={() => regenerateArray(arraySize)}
              disabled={anyRunning}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Shuffle className="mr-2 h-4 w-4" /> Shuffle dataset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-6 ${compareMode ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        <SortVisualizer
          label={compareMode ? 'Algorithm A' : 'Algorithm'}
          baseArray={baseArray}
          baseArrayVersion={arrayVersion}
          speed={speed}
          disabled={false}
          onRunningChange={setLeftRunning}
        />

        {compareMode && (
          <SortVisualizer
            label="Algorithm B"
            baseArray={baseArray}
            baseArrayVersion={arrayVersion}
            speed={speed}
            disabled={false}
            onRunningChange={setRightRunning}
            initialAlgorithm="quick"
          />
        )}
      </div>

      <div className="pb-12" />
    </div>
  );
}
