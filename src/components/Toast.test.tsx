import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { THEMES } from '../utils/theme';
import { Toast } from './Toast';

// Mock motion/react to avoid issues with animations in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Toast', () => {
  const defaultProps = {
    message: 'Test Message',
    isVisible: true,
    onClose: vi.fn(),
    theme: THEMES.sepia,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders message when visible', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test Message')).toBeInTheDocument();
  });

  it('does not render message when not visible', () => {
    render(<Toast {...defaultProps} isVisible={false} />);
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
  });

  it('calls onClose after 5 seconds', () => {
    render(<Toast {...defaultProps} />);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('clears timer on unmount', () => {
    const { unmount } = render(<Toast {...defaultProps} />);
    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });
});
