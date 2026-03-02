import { describe, expect, it } from 'vitest';
import {
  checkSquares,
  getAvailableLines,
  getBestAIMove,
  getLineSquares,
  getSquareLines,
  LinesState,
} from './gameLogic';

describe('gameLogic', () => {
  describe('getSquareLines', () => {
    it('should return correct line IDs for a square at (0,0)', () => {
      const lines = getSquareLines(0, 0);
      expect(lines).toEqual(['h-0-0', 'h-1-0', 'v-0-0', 'v-0-1']);
    });

    it('should return correct line IDs for a square at (1,1)', () => {
      const lines = getSquareLines(1, 1);
      expect(lines).toEqual(['h-1-1', 'h-2-1', 'v-1-1', 'v-1-2']);
    });
  });

  describe('getLineSquares', () => {
    it('should return adjacent squares for a horizontal line h-1-0 with dots=3 (gridSize=3)', () => {
      const squares = getLineSquares('h-1-0', 3);
      expect(squares).toEqual(['s-0-0', 's-1-0']);
    });

    it('should return adjacent squares for a vertical line v-0-1 with dots=3 (gridSize=3)', () => {
      const squares = getLineSquares('v-0-1', 3);
      expect(squares).toEqual(['s-0-0', 's-0-1']);
    });

    it('should return only one square for a boundary horizontal line h-0-0', () => {
      const squares = getLineSquares('h-0-0', 3);
      expect(squares).toEqual(['s-0-0']);
    });

    it('should return only one square for a boundary vertical line v-0-0', () => {
      const squares = getLineSquares('v-0-0', 3);
      expect(squares).toEqual(['s-0-0']);
    });
  });

  describe('checkSquares', () => {
    it('should identify a completed square', () => {
      const lines: LinesState = {
        'h-0-0': 'P',
        'h-1-0': 'P',
        'v-0-0': 'P',
        // 'v-0-1' is the line being drawn
      };
      const result = checkSquares(lines, 'v-0-1', 3, 'P');
      expect(result.completedCount).toBe(1);
      expect(result.newSquares).toEqual({ 's-0-0': 'P' });
    });

    it('should identify two completed squares with one line', () => {
      const lines: LinesState = {
        'h-0-0': 'P',
        'h-1-0': 'P',
        'v-0-0': 'P', // s-0-0
        'h-0-1': 'P',
        'h-1-1': 'P',
        'v-0-2': 'P', // s-0-1
      };
      // drawing v-0-1 which is right of s-0-0 and left of s-0-1
      const result = checkSquares(lines, 'v-0-1', 3, 'P');
      expect(result.completedCount).toBe(2);
      expect(result.newSquares).toEqual({ 's-0-0': 'P', 's-0-1': 'P' });
    });

    it('should return zero if no squares are completed', () => {
      const lines: LinesState = {
        'h-0-0': 'P',
      };
      const result = checkSquares(lines, 'v-0-0', 3, 'P');
      expect(result.completedCount).toBe(0);
      expect(result.newSquares).toEqual({});
    });
  });

  describe('getAvailableLines', () => {
    it('should return all lines for an empty grid (dots=2)', () => {
      const available = getAvailableLines({}, 2);
      // h-0-0, v-0-0, v-0-1, h-1-0
      expect(available.length).toBe(4);
      expect(available).toContain('h-0-0');
      expect(available).toContain('h-1-0');
      expect(available).toContain('v-0-0');
      expect(available).toContain('v-0-1');
    });

    it('should exclude already drawn lines', () => {
      const lines: LinesState = { 'h-0-0': 'P' };
      const available = getAvailableLines(lines, 2);
      expect(available.length).toBe(3);
      expect(available).not.toContain('h-0-0');
    });
  });

  describe('getBestAIMove', () => {
    it('should complete a square if possible', () => {
      const lines: LinesState = {
        'h-0-0': 'P',
        'h-1-0': 'P',
        'v-0-0': 'P',
      };
      // v-0-1 completes s-0-0
      const move = getBestAIMove(lines, 3);
      expect(move).toBe('v-0-1');
    });

    it('should avoid moves that let the opponent complete a square if safe moves exist', () => {
      // Scenario where s-0-0 is one line away from being completed (unsafe to draw 3rd line)
      // and s-1-1 has only one line (safe to draw 2nd line).
      const scenarioLines: LinesState = {
        'h-0-0': 'P',
        'h-1-0': 'P', // s-0-0 has 2 lines. v-0-0/v-0-1 are unsafe.
        'v-1-1': 'P', // s-1-1 has 1 line. h-1-1/h-2-1/v-1-2 are safe.
      };

      // Run multiple times due to probabilistic selection
      for (let i = 0; i < 20; i++) {
        const move = getBestAIMove(scenarioLines, 3);
        // v-0-0 and v-0-1 are unsafe because they would make s-0-0 have 3 lines
        expect(move).not.toBe('v-0-0');
        expect(move).not.toBe('v-0-1');
        expect(move).not.toBeNull();
      }
    });

    it('should return null if no moves are available', () => {
      // Smallest grid 2x2 has 4 lines
      const lines: LinesState = {
        'h-0-0': 'P',
        'h-1-0': 'P',
        'v-0-0': 'P',
        'v-0-1': 'P',
      };
      const move = getBestAIMove(lines, 2);
      expect(move).toBeNull();
    });
  });
});
