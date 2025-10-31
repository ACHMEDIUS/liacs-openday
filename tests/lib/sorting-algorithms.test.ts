import { describe, it, expect } from 'vitest';
import { sortingAlgorithms } from '@/lib/sorting-algorithms';

describe('Sorting Algorithms', () => {
  const testArray = [5, 2, 8, 1, 9];
  const expectedSorted = [1, 2, 5, 8, 9];

  describe('Bubble Sort', () => {
    it('should sort array correctly', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      expect(bubbleSort).toBeDefined();

      const steps = bubbleSort!.generateSteps([...testArray]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual(expectedSorted);
    });

    it('should generate steps with comparing and swapping indices', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const steps = bubbleSort!.generateSteps([3, 1, 2]);

      // Should have at least one step with comparing indices
      const hasComparingStep = steps.some(step => step.comparing && step.comparing.length > 0);
      expect(hasComparingStep).toBe(true);
    });

    it('should mark all elements as sorted in final step', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const steps = bubbleSort!.generateSteps([...testArray]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.sorted).toHaveLength(testArray.length);
      expect(finalStep.sorted).toEqual([0, 1, 2, 3, 4]);
    });

    it('should handle already sorted array', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const sortedInput = [1, 2, 3, 4, 5];
      const steps = bubbleSort!.generateSteps([...sortedInput]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual(sortedInput);
    });
  });

  describe('Selection Sort', () => {
    it('should sort array correctly', () => {
      const selectionSort = sortingAlgorithms.find(algo => algo.id === 'selection');
      expect(selectionSort).toBeDefined();

      const steps = selectionSort!.generateSteps([...testArray]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual(expectedSorted);
    });

    it('should generate valid steps', () => {
      const selectionSort = sortingAlgorithms.find(algo => algo.id === 'selection');
      const steps = selectionSort!.generateSteps([4, 2, 1, 3]);

      // All steps should have valid array
      steps.forEach(step => {
        expect(Array.isArray(step.array)).toBe(true);
        expect(step.array.length).toBe(4);
      });
    });
  });

  describe('Algorithm Metadata', () => {
    it('should have correct algorithm properties', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');

      expect(bubbleSort).toHaveProperty('id', 'bubble');
      expect(bubbleSort).toHaveProperty('name');
      expect(bubbleSort).toHaveProperty('description');
      expect(bubbleSort).toHaveProperty('best');
      expect(bubbleSort).toHaveProperty('average');
      expect(bubbleSort).toHaveProperty('worst');
      expect(bubbleSort).toHaveProperty('space');
      expect(bubbleSort).toHaveProperty('category');
      expect(bubbleSort).toHaveProperty('code');
      expect(typeof bubbleSort!.generateSteps).toBe('function');
    });

    it('should categorize algorithms correctly', () => {
      const comparisonAlgos = sortingAlgorithms.filter(algo => algo.category === 'comparison');
      const nonComparisonAlgos = sortingAlgorithms.filter(
        algo => algo.category === 'non-comparison'
      );

      expect(comparisonAlgos.length).toBeGreaterThan(0);
      expect(nonComparisonAlgos.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty array', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const steps = bubbleSort!.generateSteps([]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual([]);
    });

    it('should handle single element array', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const steps = bubbleSort!.generateSteps([42]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual([42]);
    });

    it('should handle array with duplicates', () => {
      const bubbleSort = sortingAlgorithms.find(algo => algo.id === 'bubble');
      const steps = bubbleSort!.generateSteps([3, 1, 2, 1, 3]);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.array).toEqual([1, 1, 2, 3, 3]);
    });
  });
});
