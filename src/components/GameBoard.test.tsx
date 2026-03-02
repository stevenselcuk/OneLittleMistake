import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { THEMES } from '../utils/theme';
import { GameBoard } from './GameBoard';

// Mock motion/react to avoid animation issues
vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      className,
      style,
      onClick,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} style={style} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('GameBoard', () => {
  const defaultProps = {
    gridSize: 3,
    lines: {},
    squares: {},
    onLineClick: vi.fn(),
    turn: 'P' as const,
    theme: THEMES.sepia,
    lastLineId: null,
  };

  it('renders correct number of dots', () => {
    const { container } = render(<GameBoard {...defaultProps} />);
    // For gridSize 3, there should be 3x3 = 9 dots
    // Using a more specific selector might be better if there are other rounded-full elements
    // In GameBoard.tsx, dots use ${theme.dot} which is 'bg-[#d3c5a3]' in sepia
    const sepiaDots = container.querySelectorAll('.bg-\\[\\#d3c5a3\\]');
    expect(sepiaDots.length).toBe(9);
  });

  it('renders horizontal and vertical lines', () => {
    const { container } = render(<GameBoard {...defaultProps} />);
    // Grid 3x3 has 2 horizontal lines per row (3 rows) and 2 vertical lines per column (3 columns)
    // Actually, it's (gridSize * (gridSize - 1)) * 2 lines total
    // Horizontal: 3 rows * 2 lines each = 6
    // Vertical: 3 columns * 2 lines each = 6
    // Total lines: 12

    // Each line is a div with group relative flex cursor-pointer
    const lines = container.querySelectorAll('.cursor-pointer');
    expect(lines.length).toBe(12);
  });

  it('calls onLineClick when an available line is clicked', () => {
    render(<GameBoard {...defaultProps} />);
    // Find a line (they are the cursor-pointer divs with role="button")
    const lines = screen.getAllByRole('button', { name: /line/i });
    fireEvent.click(lines[0]);
    expect(defaultProps.onLineClick).toHaveBeenCalled();
  });

  it('displays owned lines with correct player color', () => {
    const linesState = { 'h-0-0': 'P' as const, 'v-0-0': 'C' as const };
    const { container } = render(<GameBoard {...defaultProps} lines={linesState} />);

    // P1 line (player) in sepia is bg-[#8c3a3a]
    const p1Line = container.querySelector('.bg-\\[\\#8c3a3a\\]');
    expect(p1Line).toBeInTheDocument();

    // P2 line (computer) in sepia is bg-[#3a6b58]
    const p2Line = container.querySelector('.bg-\\[\\#3a6b58\\]');
    expect(p2Line).toBeInTheDocument();
  });

  it('displays completed squares with correct player color', () => {
    const squaresState = { 's-0-0': 'P' as const };
    const { container } = render(<GameBoard {...defaultProps} squares={squaresState} />);

    // P1 square in sepia is bg-[#8c3a3a]/30
    const p1Square = container.querySelector('.bg-\\[\\#8c3a3a\\]\\/30');
    expect(p1Square).toBeInTheDocument();
  });

  it('marks the last line with a pulse effect', () => {
    const linesState = { 'h-0-0': 'P' as const };
    const { container } = render(
      <GameBoard {...defaultProps} lines={linesState} lastLineId="h-0-0" />,
    );

    // Pulse effect in sepia is bg-[#8c3a3a] with blur-[3px]
    const pulse = container.querySelector('.blur-\\[3px\\]');
    expect(pulse).toBeInTheDocument();
  });
});
