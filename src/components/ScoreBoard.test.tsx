import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { THEMES } from '../utils/theme';
import { ScoreBoard } from './ScoreBoard';

describe('ScoreBoard', () => {
  const defaultProps = {
    scores: { P: 1, C: 2 },
    turn: 'P' as const,
    gameOver: false,
    onReset: vi.fn(),
    theme: THEMES.sepia,
    themeName: 'sepia' as const,
    onThemeChange: vi.fn(),
  };

  it('renders scores correctly', () => {
    render(<ScoreBoard {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    // Check for Player "P" and Computer "C" labels
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('shows active turn indicator for player', () => {
    const { container } = render(<ScoreBoard {...defaultProps} turn="P" />);
    const playerDiv = container.querySelector('.opacity-100');
    expect(playerDiv).toHaveTextContent('P');
    expect(playerDiv).toHaveTextContent('1');
  });

  it('shows active turn indicator for computer', () => {
    const { container } = render(<ScoreBoard {...defaultProps} turn="C" />);
    const computerDiv = container.querySelector('.opacity-100');
    expect(computerDiv).toHaveTextContent('C');
    expect(computerDiv).toHaveTextContent('2');
  });

  it('displays winner message when game is over', () => {
    render(<ScoreBoard {...defaultProps} gameOver={true} scores={{ P: 5, C: 2 }} />);
    expect(screen.getByText('Player Wins')).toBeInTheDocument();

    render(<ScoreBoard {...defaultProps} gameOver={true} scores={{ P: 2, C: 5 }} />);
    expect(screen.getByText('Computer Wins')).toBeInTheDocument();

    render(<ScoreBoard {...defaultProps} gameOver={true} scores={{ P: 3, C: 3 }} />);
    expect(screen.getByText('Draw')).toBeInTheDocument();
  });

  it('calls onReset when reset button is clicked', () => {
    render(<ScoreBoard {...defaultProps} />);
    const resetButton = screen.getByLabelText('Reset Game');
    fireEvent.click(resetButton);
    expect(defaultProps.onReset).toHaveBeenCalled();
  });

  it('opens theme dropdown and calls onThemeChange', () => {
    render(<ScoreBoard {...defaultProps} />);
    const themeButton = screen.getByLabelText('Change Theme');
    fireEvent.click(themeButton);

    // After clicking theme button, themes should be visible
    expect(screen.getByText('tron')).toBeInTheDocument();
    expect(screen.getByText('duotone')).toBeInTheDocument();

    fireEvent.click(screen.getByText('tron'));
    expect(defaultProps.onThemeChange).toHaveBeenCalledWith('tron');
  });
});
