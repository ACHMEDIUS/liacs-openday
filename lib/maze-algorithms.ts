export type MazeCell = 0 | 1;
export type MazeGrid = MazeCell[][];

export interface Position {
  row: number;
  col: number;
}

export interface MazeStep {
  visited: Position[];
  frontier?: Position[];
  path?: Position[];
  current?: Position;
  done?: boolean;
}

const directions: Position[] = [
  { row: 1, col: 0 },
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 0, col: -1 },
];

const toKey = (pos: Position) => `${pos.row}:${pos.col}`;

const fromKey = (key: string): Position => {
  const [row, col] = key.split(':').map(Number);
  return { row, col };
};

const getNeighbours = (maze: MazeGrid, pos: Position): Position[] => {
  const neighbours: Position[] = [];
  for (const dir of directions) {
    const next: Position = { row: pos.row + dir.row, col: pos.col + dir.col };
    if (
      next.row >= 0 &&
      next.row < maze.length &&
      next.col >= 0 &&
      next.col < maze[0].length &&
      maze[next.row][next.col] === 0
    ) {
      neighbours.push(next);
    }
  }
  return neighbours;
};

const cloneVisited = (visited: Set<string>): Position[] => Array.from(visited).map(fromKey);

export const computeBfsSteps = (maze: MazeGrid, start: Position, goal: Position): MazeStep[] => {
  const steps: MazeStep[] = [];
  const visited = new Set<string>();
  const queue: Array<{ pos: Position; path: Position[] }> = [];

  visited.add(toKey(start));
  queue.push({ pos: start, path: [start] });
  steps.push({ visited: cloneVisited(visited), frontier: [start], current: start, path: [start] });

  while (queue.length) {
    const { pos, path } = queue.shift()!;
    steps.push({
      visited: cloneVisited(visited),
      frontier: queue.map(item => item.pos),
      current: pos,
      path,
    });

    if (pos.row === goal.row && pos.col === goal.col) {
      steps.push({ visited: cloneVisited(visited), path, current: pos, done: true });
      return steps;
    }

    for (const neighbour of getNeighbours(maze, pos)) {
      const key = toKey(neighbour);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ pos: neighbour, path: [...path, neighbour] });
        steps.push({
          visited: cloneVisited(visited),
          frontier: queue.map(item => item.pos),
          current: neighbour,
          path: [...path, neighbour],
        });
      }
    }
  }

  steps.push({ visited: cloneVisited(visited), path: [], current: goal, done: true });
  return steps;
};

export const computeDfsSteps = (maze: MazeGrid, start: Position, goal: Position): MazeStep[] => {
  const steps: MazeStep[] = [];
  const visited = new Set<string>();

  type Node = { pos: Position; path: Position[] };
  const stack: Node[] = [];

  stack.push({ pos: start, path: [start] });
  visited.add(toKey(start));
  steps.push({
    visited: cloneVisited(visited),
    frontier: stack.map(s => s.pos),
    current: start,
    path: [start],
  });

  while (stack.length) {
    const node = stack[stack.length - 1];
    const { pos, path } = node;

    steps.push({
      visited: cloneVisited(visited),
      frontier: stack.map(s => s.pos),
      current: pos,
      path,
    });

    if (pos.row === goal.row && pos.col === goal.col) {
      steps.push({ visited: cloneVisited(visited), path, current: pos, done: true });
      return steps;
    }

    const neighbours = getNeighbours(maze, pos);
    let advanced = false;

    for (const neighbour of neighbours) {
      const key = toKey(neighbour);
      if (!visited.has(key)) {
        visited.add(key);
        stack.push({ pos: neighbour, path: [...path, neighbour] });
        steps.push({
          visited: cloneVisited(visited),
          frontier: stack.map(s => s.pos),
          current: neighbour,
          path: [...path, neighbour],
        });
        advanced = true;
        break;
      }
    }

    if (!advanced) {
      stack.pop();
      steps.push({
        visited: cloneVisited(visited),
        frontier: stack.map(s => s.pos),
        current: pos,
        path,
      });
    }
  }

  steps.push({ visited: cloneVisited(visited), path: [], current: goal, done: true });
  return steps;
};

export const computeFloodFillSteps = (maze: MazeGrid, start: Position): MazeStep[] => {
  const steps: MazeStep[] = [];
  const visited = new Set<string>();
  const queue: Position[] = [];

  queue.push(start);
  visited.add(toKey(start));
  steps.push({ visited: cloneVisited(visited), frontier: [start], current: start, path: [start] });

  while (queue.length) {
    const pos = queue.shift()!;
    steps.push({
      visited: cloneVisited(visited),
      frontier: queue.slice(),
      current: pos,
      path: cloneVisited(visited),
    });

    for (const neighbour of getNeighbours(maze, pos)) {
      const key = toKey(neighbour);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push(neighbour);
        steps.push({
          visited: cloneVisited(visited),
          frontier: queue.slice(),
          current: neighbour,
          path: cloneVisited(visited),
        });
      }
    }
  }

  steps.push({ visited: cloneVisited(visited), frontier: [], current: start, done: true });
  return steps;
};
