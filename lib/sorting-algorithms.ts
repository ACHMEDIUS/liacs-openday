export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'radix'
  | 'bogo'
  | 'miracle'
  | 'sleep';

export type AlgorithmCategory = 'comparison' | 'non-comparison' | 'fun';

export interface SortStep {
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
}

export interface SortAlgorithm {
  id: AlgorithmId;
  name: string;
  description: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  category: AlgorithmCategory;
  generateSteps: (array: number[]) => SortStep[];
}

const clone = (arr: number[]): number[] => [...arr];

const finalizeSteps = (array: number[], steps: SortStep[]): SortStep[] => {
  steps.push({ array: clone(array), comparing: [], swapping: [], sorted: array.map((_, idx) => idx) });
  return steps;
};

const bubbleSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ array: clone(array), comparing: [j, j + 1], swapping: [], sorted: [] });
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swapped = true;
        steps.push({ array: clone(array), comparing: [], swapping: [j, j + 1], sorted: [] });
      }
    }
    if (!swapped) break;
  }

  return finalizeSteps(array, steps);
};

const selectionSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: clone(array), comparing: [minIdx, j], swapping: [], sorted: [] });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({ array: clone(array), comparing: [], swapping: [i, minIdx], sorted: [] });
    }
  }

  return finalizeSteps(array, steps);
};

const insertionSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];

  for (let i = 1; i < array.length; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({ array: clone(array), comparing: [i], swapping: [], sorted: [] });

    while (j >= 0 && array[j] > key) {
      steps.push({ array: clone(array), comparing: [j, j + 1], swapping: [], sorted: [] });
      array[j + 1] = array[j];
      steps.push({ array: clone(array), comparing: [], swapping: [j, j + 1], sorted: [] });
      j--;
    }
    array[j + 1] = key;
  }

  return finalizeSteps(array, steps);
};

const mergeSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];
  const temp = clone(array);

  const mergeSort = (left: number, right: number) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(left, mid);
    mergeSort(mid + 1, right);
    merge(left, mid, right);
  };

  const merge = (left: number, mid: number, right: number) => {
    for (let i = left; i <= right; i++) {
      temp[i] = array[i];
    }
    let i = left;
    let j = mid + 1;
    let k = left;

    while (i <= mid && j <= right) {
      steps.push({ array: clone(array), comparing: [i, j], swapping: [], sorted: [] });
      if (temp[i] <= temp[j]) {
        array[k] = temp[i];
        i++;
      } else {
        array[k] = temp[j];
        j++;
      }
      steps.push({ array: clone(array), comparing: [], swapping: [k], sorted: [] });
      k++;
    }

    while (i <= mid) {
      array[k] = temp[i];
      steps.push({ array: clone(array), comparing: [], swapping: [k], sorted: [] });
      i++;
      k++;
    }

    while (j <= right) {
      array[k] = temp[j];
      steps.push({ array: clone(array), comparing: [], swapping: [k], sorted: [] });
      j++;
      k++;
    }
  };

  mergeSort(0, array.length - 1);
  return finalizeSteps(array, steps);
};

const quickSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  const partition = (low: number, high: number): number => {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({ array: clone(array), comparing: [j, high], swapping: [], sorted: [] });
      if (array[j] <= pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        steps.push({ array: clone(array), comparing: [], swapping: [i, j], sorted: [] });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({ array: clone(array), comparing: [], swapping: [i + 1, high], sorted: [] });
    return i + 1;
  };

  quickSort(0, array.length - 1);
  return finalizeSteps(array, steps);
};

const radixSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];
  const max = Math.max(...array, 0);

  const countingSort = (exp: number) => {
    const output = new Array(array.length).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < array.length; i++) {
      const index = Math.floor(array[i] / exp) % 10;
      count[index]++;
      steps.push({ array: clone(array), comparing: [i], swapping: [], sorted: [] });
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
      const index = Math.floor(array[i] / exp) % 10;
      output[count[index] - 1] = array[i];
      count[index]--;
      steps.push({ array: clone(array), comparing: [], swapping: [Math.max(count[index], 0)], sorted: [] });
    }

    for (let i = 0; i < array.length; i++) {
      array[i] = output[i];
      steps.push({ array: clone(array), comparing: [], swapping: [i], sorted: [] });
    }
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSort(exp);
  }

  return finalizeSteps(array, steps);
};

const bogoSortSteps = (input: number[]): SortStep[] => {
  const array = clone(input);
  const steps: SortStep[] = [];

  const isSorted = (arr: number[]) => arr.every((value, index) => index === 0 || arr[index - 1] <= value);
  const shuffle = (arr: number[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const maxAttempts = Math.min(80, array.length * 6);
  let attempt = 0;

  while (!isSorted(array) && attempt < maxAttempts) {
    shuffle(array);
    steps.push({ array: clone(array), comparing: [], swapping: [], sorted: [] });
    attempt++;
  }

  const sorted = [...array].sort((a, b) => a - b);
  steps.push({ array: sorted, comparing: [], swapping: [], sorted: sorted.map((_, idx) => idx) });
  return steps;
};

const miracleSortSteps = (input: number[]): SortStep[] => {
  const original = clone(input);
  const sorted = [...original].sort((a, b) => a - b);
  const steps: SortStep[] = [];

  steps.push({ array: original, comparing: [], swapping: [], sorted: [] });
  steps.push({ array: original, comparing: [], swapping: [], sorted: [] });
  steps.push({ array: original, comparing: [], swapping: [], sorted: [] });
  steps.push({ array: sorted, comparing: [], swapping: [], sorted: sorted.map((_, idx) => idx) });
  return steps;
};

const sleepSortSteps = (input: number[]): SortStep[] => {
  const original = clone(input);
  const sorted = [...original].sort((a, b) => a - b);
  const steps: SortStep[] = [];
  const partial: number[] = [];

  steps.push({ array: original, comparing: [], swapping: [], sorted: [] });

  sorted.forEach((value, index) => {
    partial.push(value);
    const animationArray = [...partial, ...original.slice(partial.length)];
    steps.push({
      array: animationArray,
      comparing: [],
      swapping: [index],
      sorted: Array.from({ length: partial.length }, (_, idx) => idx),
    });
  });

  steps.push({ array: sorted, comparing: [], swapping: [], sorted: sorted.map((_, idx) => idx) });
  return steps;
};

export const sortingAlgorithms: SortAlgorithm[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    description:
      'Repeatedly compares adjacent items and swaps them if they are out of order, bubbling the largest values to the end.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    category: 'comparison',
    generateSteps: bubbleSortSteps,
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    description: 'Selects the smallest remaining item and places it at the current position.',
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    category: 'comparison',
    generateSteps: selectionSortSteps,
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Builds a sorted list by inserting each new element into its proper place.',
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    category: 'comparison',
    generateSteps: insertionSortSteps,
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    description: 'Divides the list into halves, recursively sorts them, and merges the results.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    category: 'comparison',
    generateSteps: mergeSortSteps,
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    description: 'Partitions the list around a pivot and recursively sorts the partitions.',
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    category: 'comparison',
    generateSteps: quickSortSteps,
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    description: 'Sorts numbers by processing individual digits from least to most significant.',
    best: 'O(d(n + k))',
    average: 'O(d(n + k))',
    worst: 'O(d(n + k))',
    space: 'O(n + k)',
    category: 'non-comparison',
    generateSteps: radixSortSteps,
  },
  {
    id: 'bogo',
    name: 'Bogo Sort',
    description: 'Randomly shuffles the array until it happens to be sorted. Educational chaos.',
    best: 'Lucky',
    average: 'Unbounded',
    worst: 'Heat death of the universe',
    space: 'O(1)',
    category: 'fun',
    generateSteps: bogoSortSteps,
  },
  {
    id: 'miracle',
    name: 'Miracle Sort',
    description: 'Checks once, waits for a miracle, and suddenly the array is sorted.',
    best: 'O(1)',
    average: 'You wish',
    worst: '☺',
    space: 'O(1)',
    category: 'fun',
    generateSteps: miracleSortSteps,
  },
  {
    id: 'sleep',
    name: 'Sleep Sort',
    description: 'Schedules each value to “wake up” proportional to its magnitude.',
    best: 'O(n)',
    average: 'O(max + n)',
    worst: 'Alarm clock fails',
    space: 'O(n)',
    category: 'fun',
    generateSteps: sleepSortSteps,
  },
];

export const getAlgorithmById = (id: AlgorithmId): SortAlgorithm => {
  const algorithm = sortingAlgorithms.find((algo) => algo.id === id);
  if (!algorithm) {
    throw new Error(`Unknown algorithm: ${id}`);
  }
  return algorithm;
};

export const defaultAlgorithmId: AlgorithmId = 'bubble';

export const createRandomArray = (size: number, min = 10, max = 400): number[] => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};
