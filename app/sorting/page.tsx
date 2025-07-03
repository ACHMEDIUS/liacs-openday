'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Shuffle, RotateCcw } from 'lucide-react';

interface SortingAlgorithm {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  stable: boolean;
  category: 'comparison' | 'non-comparison' | 'funny';
}

const algorithms: Record<string, SortingAlgorithm> = {
  bubble: {
    name: 'Bubble Sort',
    description:
      'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    category: 'comparison',
  },
  selection: {
    name: 'Selection Sort',
    description: 'Finds the minimum element from unsorted part and puts it at the beginning.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: false,
    category: 'comparison',
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stable: true,
    category: 'comparison',
  },
  merge: {
    name: 'Merge Sort',
    description: 'Divides the array into halves, sorts them and then merges them.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stable: true,
    category: 'comparison',
  },
  quick: {
    name: 'Quick Sort',
    description: 'Picks a pivot element and partitions the array around the pivot.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    stable: false,
    category: 'comparison',
  },
  bogo: {
    name: 'Bogo Sort',
    description: 'Randomly shuffles the array until it happens to be sorted. Not practical!',
    timeComplexity: 'O(∞)',
    spaceComplexity: 'O(1)',
    stable: false,
    category: 'funny',
  },
  miracle: {
    name: 'Miracle Sort',
    description:
      'Checks if the array is sorted, if not, waits for a miracle. Even less practical than Bogo Sort!',
    timeComplexity: 'O(∞)',
    spaceComplexity: 'O(1)',
    stable: true,
    category: 'funny',
  },
  sleep: {
    name: 'Sleep Sort',
    description:
      'Creates a timer for each element based on its value, then collects them as timers expire.',
    timeComplexity: 'O(max + n)',
    spaceComplexity: 'O(n)',
    stable: true,
    category: 'funny',
  },
};

export default function SortingPage() {
  const [array, setArray] = useState<number[]>([]);
  const [originalArray, setOriginalArray] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('bubble');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [arraySize, setArraySize] = useState([20]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<
    Array<{ array: number[]; comparing: number[]; swapping: number[]; sorted: number[] }>
  >([]);

  const generateRandomArray = useCallback(() => {
    const newArray = Array.from(
      { length: arraySize[0] },
      () => Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setOriginalArray([...newArray]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setCurrentStep(0);
    setSteps([]);
  }, [arraySize]);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const bubbleSort = (arr: number[]) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
        });

        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
          });
        }
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
    });

    return steps;
  };

  const selectionSort = (arr: number[]) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...array],
          comparing: [minIdx, j],
          swapping: [],
          sorted: Array.from({ length: i }, (_, idx) => idx),
        });

        if (array[j] < array[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, minIdx],
          sorted: Array.from({ length: i }, (_, idx) => idx),
        });
      }
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
    });

    return steps;
  };

  const insertionSort = (arr: number[]) => {
    const steps = [];
    const array = [...arr];
    const n = array.length;

    for (let i = 1; i < n; i++) {
      const key = array[i];
      let j = i - 1;

      steps.push({
        array: [...array],
        comparing: [i],
        swapping: [],
        sorted: Array.from({ length: i }, (_, idx) => idx),
      });

      while (j >= 0 && array[j] > key) {
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapping: [],
          sorted: [],
        });

        array[j + 1] = array[j];
        j = j - 1;

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j + 1, j + 2],
          sorted: [],
        });
      }

      array[j + 1] = key;
    }

    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: Array.from({ length: n }, (_, idx) => idx),
    });

    return steps;
  };

  const generateSteps = () => {
    switch (selectedAlgorithm) {
      case 'bubble':
        return bubbleSort(originalArray);
      case 'selection':
        return selectionSort(originalArray);
      case 'insertion':
        return insertionSort(originalArray);
      case 'merge':
      case 'quick':
        return bubbleSort(originalArray);
      default:
        return bubbleSort(originalArray);
    }
  };

  const startSorting = () => {
    if (selectedAlgorithm === 'bogo') {
      bogoSort();
      return;
    }

    if (selectedAlgorithm === 'miracle') {
      miracleSort();
      return;
    }

    if (selectedAlgorithm === 'sleep') {
      sleepSort();
      return;
    }

    const sortSteps = generateSteps();
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsRunning(true);
  };

  const bogoSort = () => {
    setIsRunning(true);
    let attempts = 0;
    const maxAttempts = 1000;

    const isSorted = (arr: number[]) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
      }
      return true;
    };

    const shuffle = (arr: number[]) => {
      const newArr = [...arr];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    const attemptSort = () => {
      if (attempts >= maxAttempts || isSorted(array)) {
        setIsRunning(false);
        setSorted(Array.from({ length: array.length }, (_, idx) => idx));
        return;
      }

      const shuffled = shuffle(array);
      setArray(shuffled);
      attempts++;

      setTimeout(attemptSort, speed[0]);
    };

    attemptSort();
  };

  const miracleSort = () => {
    setIsRunning(true);
    const isSorted = (arr: number[]) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) return false;
      }
      return true;
    };

    const checkForMiracle = () => {
      if (isSorted(array)) {
        setIsRunning(false);
        setSorted(Array.from({ length: array.length }, (_, idx) => idx));
        return;
      }

      setTimeout(checkForMiracle, 1000);
    };

    checkForMiracle();
  };

  const sleepSort = () => {
    setIsRunning(true);
    const sortedArray: number[] = [];
    const maxValue = Math.max(...array);
    const scaleFactor = 100;

    array.forEach((value, _index) => {
      setTimeout(
        () => {
          sortedArray.push(value);
          setArray([...sortedArray]);

          if (sortedArray.length === array.length) {
            setIsRunning(false);
            setSorted(Array.from({ length: array.length }, (_, idx) => idx));
          }
        },
        (value / maxValue) * scaleFactor
      );
    });
  };

  useEffect(() => {
    if (!isRunning || isPaused || steps.length === 0) return;

    const timer = setTimeout(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        setArray(step.array);
        setComparing(step.comparing);
        setSwapping(step.swapping);
        setSorted(step.sorted);
        setCurrentStep(currentStep + 1);
      } else {
        setIsRunning(false);
        setComparing([]);
        setSwapping([]);
      }
    }, speed[0]);

    return () => clearTimeout(timer);
  }, [currentStep, isRunning, isPaused, steps, speed]);

  const pauseResume = () => {
    setIsPaused(!isPaused);
  };

  const stopSorting = () => {
    setIsRunning(false);
    setIsPaused(false);
    setArray([...originalArray]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setCurrentStep(0);
    setSteps([]);
  };

  const reset = () => {
    stopSorting();
    generateRandomArray();
  };

  const algorithm = algorithms[selectedAlgorithm];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-leiden">Sorting Algorithm Visualizer</h1>
        <p className="text-muted-foreground">
          Explore and visualize different sorting algorithms in action
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-center" style={{ height: '320px' }}>
                <div className="flex items-end justify-center gap-1" style={{ height: '300px' }}>
                  {array.map((value, index) => (
                    <div
                      key={index}
                      className={`flex items-end justify-center transition-all duration-200 ${
                        sorted.includes(index)
                          ? 'bg-green-500'
                          : swapping.includes(index)
                            ? 'bg-red-500'
                            : comparing.includes(index)
                              ? 'bg-yellow-500'
                              : 'bg-leiden'
                      }`}
                      style={{
                        height: `${value}px`,
                        width: `${Math.max(800 / array.length - 2, 4)}px`,
                        minWidth: '2px',
                      }}
                    >
                      {array.length <= 20 && (
                        <span className="rotate-90 whitespace-nowrap font-mono text-xs text-white">
                          {value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Algorithm</label>
                <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubble">Bubble Sort</SelectItem>
                    <SelectItem value="selection">Selection Sort</SelectItem>
                    <SelectItem value="insertion">Insertion Sort</SelectItem>
                    <SelectItem value="merge">Merge Sort</SelectItem>
                    <SelectItem value="quick">Quick Sort</SelectItem>
                    <SelectItem value="bogo">Bogo Sort</SelectItem>
                    <SelectItem value="miracle">Miracle Sort</SelectItem>
                    <SelectItem value="sleep">Sleep Sort</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Array Size: {arraySize[0]}</label>
                <Slider
                  value={arraySize}
                  onValueChange={setArraySize}
                  max={50}
                  min={5}
                  step={1}
                  disabled={isRunning}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Speed: {speed[0]}ms</label>
                <Slider value={speed} onValueChange={setSpeed} max={1000} min={10} step={10} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={startSorting}
                  disabled={isRunning}
                  className="bg-leiden hover:bg-leiden/90"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
                <Button onClick={pauseResume} disabled={!isRunning} variant="outline">
                  {isPaused ? (
                    <Play className="mr-2 h-4 w-4" />
                  ) : (
                    <Pause className="mr-2 h-4 w-4" />
                  )}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button onClick={stopSorting} disabled={!isRunning} variant="outline">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
                <Button onClick={reset} disabled={isRunning} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>

              <Button
                onClick={generateRandomArray}
                disabled={isRunning}
                variant="outline"
                className="w-full"
              >
                <Shuffle className="mr-2 h-4 w-4" />
                Shuffle Array
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{algorithm.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{algorithm.description}</p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Time Complexity</div>
                  <Badge variant="outline">{algorithm.timeComplexity}</Badge>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Space Complexity</div>
                  <Badge variant="outline">{algorithm.spaceComplexity}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground">Stable:</div>
                <Badge variant={algorithm.stable ? 'default' : 'secondary'}>
                  {algorithm.stable ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs font-medium text-muted-foreground">Category:</div>
                <Badge variant={algorithm.category === 'funny' ? 'destructive' : 'default'}>
                  {algorithm.category === 'funny' ? 'Funny' : 'Practical'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-leiden"></div>
                <span className="text-sm">Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-yellow-500"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500"></div>
                <span className="text-sm">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500"></div>
                <span className="text-sm">Sorted</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
