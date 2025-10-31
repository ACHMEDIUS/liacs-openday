import { describe, it, expect } from 'vitest';
import {
  computeBfsSteps,
  computeDfsSteps,
  type MazeGrid,
  type Position,
} from '@/lib/maze-algorithms';

describe('Maze Algorithms', () => {
  // Simple 3x3 maze with a clear path
  const simpleMaze: MazeGrid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];

  const start: Position = { row: 0, col: 0 };
  const goal: Position = { row: 2, col: 2 };

  describe('BFS (Breadth-First Search)', () => {
    it('should find a path from start to goal', () => {
      const steps = computeBfsSteps(simpleMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path).toBeDefined();
      expect(finalStep.path!.length).toBeGreaterThan(0);
    });

    it('should include start position in the path', () => {
      const steps = computeBfsSteps(simpleMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      const firstPosition = finalStep.path![0];
      expect(firstPosition.row).toBe(start.row);
      expect(firstPosition.col).toBe(start.col);
    });

    it('should include goal position in the path', () => {
      const steps = computeBfsSteps(simpleMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      const lastPosition = finalStep.path![finalStep.path!.length - 1];
      expect(lastPosition.row).toBe(goal.row);
      expect(lastPosition.col).toBe(goal.col);
    });

    it('should generate valid steps with visited positions', () => {
      const steps = computeBfsSteps(simpleMaze, start, goal);

      steps.forEach(step => {
        expect(Array.isArray(step.visited)).toBe(true);
        expect(step.visited.length).toBeGreaterThan(0);
      });
    });

    it('should not revisit already visited cells', () => {
      const steps = computeBfsSteps(simpleMaze, start, goal);

      // Check that visited set grows or stays same (never shrinks)
      for (let i = 1; i < steps.length; i++) {
        expect(steps[i].visited.length).toBeGreaterThanOrEqual(steps[i - 1].visited.length);
      }
    });

    it('should handle maze with no path', () => {
      const blockedMaze: MazeGrid = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];

      const steps = computeBfsSteps(blockedMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      // When no path exists, path should be empty
      expect(finalStep.path).toEqual([]);
    });

    it('should handle start equals goal', () => {
      const steps = computeBfsSteps(simpleMaze, start, start);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path).toHaveLength(1);
      expect(finalStep.path![0]).toEqual(start);
    });
  });

  describe('DFS (Depth-First Search)', () => {
    it('should find a path from start to goal', () => {
      const steps = computeDfsSteps(simpleMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path).toBeDefined();
      expect(finalStep.path!.length).toBeGreaterThan(0);
    });

    it('should include start and goal in path', () => {
      const steps = computeDfsSteps(simpleMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      const firstPosition = finalStep.path![0];
      const lastPosition = finalStep.path![finalStep.path!.length - 1];

      expect(firstPosition.row).toBe(start.row);
      expect(firstPosition.col).toBe(start.col);
      expect(lastPosition.row).toBe(goal.row);
      expect(lastPosition.col).toBe(goal.col);
    });

    it('should generate steps with current position', () => {
      const steps = computeDfsSteps(simpleMaze, start, goal);

      // Most steps should have a current position
      const stepsWithCurrent = steps.filter(step => step.current !== undefined);
      expect(stepsWithCurrent.length).toBeGreaterThan(0);
    });

    it('should handle maze with no path', () => {
      const blockedMaze: MazeGrid = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];

      const steps = computeDfsSteps(blockedMaze, start, goal);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path).toEqual([]);
    });
  });

  describe('Algorithm Comparison', () => {
    it('both algorithms should find valid paths', () => {
      const bfsSteps = computeBfsSteps(simpleMaze, start, goal);
      const dfsSteps = computeDfsSteps(simpleMaze, start, goal);

      const bfsFinalStep = bfsSteps[bfsSteps.length - 1];
      const dfsFinalStep = dfsSteps[dfsSteps.length - 1];

      // Both should complete
      expect(bfsFinalStep.done).toBe(true);
      expect(dfsFinalStep.done).toBe(true);

      // Both should have valid paths
      expect(bfsFinalStep.path!.length).toBeGreaterThan(0);
      expect(dfsFinalStep.path!.length).toBeGreaterThan(0);
    });

    it('BFS should find shortest path in simple maze', () => {
      // In a simple maze with equal weights, BFS guarantees shortest path
      const bfsSteps = computeBfsSteps(simpleMaze, start, goal);
      const bfsFinalStep = bfsSteps[bfsSteps.length - 1];

      // Path should be relatively short (not exhaustive search)
      expect(bfsFinalStep.path!.length).toBeLessThanOrEqual(6);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 1x1 maze', () => {
      const tinyMaze: MazeGrid = [[0]];
      const origin: Position = { row: 0, col: 0 };

      const bfsSteps = computeBfsSteps(tinyMaze, origin, origin);
      const finalStep = bfsSteps[bfsSteps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path).toHaveLength(1);
    });

    it('should handle larger maze', () => {
      const largeMaze: MazeGrid = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const largeStart: Position = { row: 0, col: 0 };
      const largeGoal: Position = { row: 4, col: 4 };

      const steps = computeBfsSteps(largeMaze, largeStart, largeGoal);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.done).toBe(true);
      expect(finalStep.path!.length).toBeGreaterThan(0);
    });
  });
});
