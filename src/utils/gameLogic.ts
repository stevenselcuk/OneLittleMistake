export type Player = 'P' | 'C';

export interface GridSize {
  dots: number;
}

export type LinesState = Record<string, Player>;
export type SquaresState = Record<string, Player>;

export const getSquareLines = (r: number, c: number): string[] => [
  `h-${r}-${c}`,
  `h-${r + 1}-${c}`,
  `v-${r}-${c}`,
  `v-${r}-${c + 1}`,
];

export const getLineSquares = (lineId: string, gridSize: number): string[] => {
  const parts = lineId.split('-');
  const type = parts[0];
  const r = parseInt(parts[1], 10);
  const c = parseInt(parts[2], 10);
  const squares: string[] = [];

  if (type === 'h') {
    if (r > 0) squares.push(`s-${r - 1}-${c}`);
    if (r < gridSize - 1) squares.push(`s-${r}-${c}`);
  } else if (type === 'v') {
    if (c > 0) squares.push(`s-${r}-${c - 1}`);
    if (c < gridSize - 1) squares.push(`s-${r}-${c}`);
  }

  return squares;
};

export const checkSquares = (
  lines: LinesState,
  lineId: string,
  gridSize: number,
  player: Player
): { newSquares: SquaresState; completedCount: number } => {
  const squaresToCheck = getLineSquares(lineId, gridSize);
  const newSquares: SquaresState = {};
  let completedCount = 0;

  for (const sq of squaresToCheck) {
    const parts = sq.split('-');
    const r = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);
    const sqLines = getSquareLines(r, c);

    const isComplete = sqLines.every((l) => lines[l] || l === lineId);
    if (isComplete) {
      newSquares[sq] = player;
      completedCount++;
    }
  }

  return { newSquares, completedCount };
};

export const getAvailableLines = (lines: LinesState, gridSize: number): string[] => {
  const available: string[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const hId = `h-${r}-${c}`;
      if (!lines[hId]) available.push(hId);
    }
  }
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize; c++) {
      const vId = `v-${r}-${c}`;
      if (!lines[vId]) available.push(vId);
    }
  }
  return available;
};

export const getBestAIMove = (lines: LinesState, gridSize: number): string | null => {
  const squareDrawnCounts = new Int8Array((gridSize - 1) * (gridSize - 1));
  
  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      let count = 0;
      if (lines[`h-${r}-${c}`]) count++;
      if (lines[`h-${r + 1}-${c}`]) count++;
      if (lines[`v-${r}-${c}`]) count++;
      if (lines[`v-${r}-${c + 1}`]) count++;
      squareDrawnCounts[r * (gridSize - 1) + c] = count;
      
      if (count === 3) {
        if (!lines[`h-${r}-${c}`]) return `h-${r}-${c}`;
        if (!lines[`h-${r + 1}-${c}`]) return `h-${r + 1}-${c}`;
        if (!lines[`v-${r}-${c}`]) return `v-${r}-${c}`;
        if (!lines[`v-${r}-${c + 1}`]) return `v-${r}-${c + 1}`;
      }
    }
  }

  let safeLine: string | null = null;
  let availableLine: string | null = null;
  let safeLinesCount = 0;
  let availableLinesCount = 0;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize - 1; c++) {
      const hId = `h-${r}-${c}`;
      if (!lines[hId]) {
        availableLinesCount++;
        if (Math.random() < 1 / availableLinesCount) availableLine = hId;

        let isSafe = true;
        if (r > 0 && squareDrawnCounts[(r - 1) * (gridSize - 1) + c] === 2) isSafe = false;
        if (r < gridSize - 1 && squareDrawnCounts[r * (gridSize - 1) + c] === 2) isSafe = false;
        
        if (isSafe) {
          safeLinesCount++;
          if (Math.random() < 1 / safeLinesCount) safeLine = hId;
        }
      }
    }
  }

  for (let r = 0; r < gridSize - 1; r++) {
    for (let c = 0; c < gridSize; c++) {
      const vId = `v-${r}-${c}`;
      if (!lines[vId]) {
        availableLinesCount++;
        if (Math.random() < 1 / availableLinesCount) availableLine = vId;

        let isSafe = true;
        if (c > 0 && squareDrawnCounts[r * (gridSize - 1) + (c - 1)] === 2) isSafe = false;
        if (c < gridSize - 1 && squareDrawnCounts[r * (gridSize - 1) + c] === 2) isSafe = false;
        
        if (isSafe) {
          safeLinesCount++;
          if (Math.random() < 1 / safeLinesCount) safeLine = vId;
        }
      }
    }
  }

  return safeLine || availableLine;
};
