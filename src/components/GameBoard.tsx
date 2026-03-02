import { motion } from 'motion/react';
import React from 'react';
import { LinesState, Player, SquaresState } from '../utils/gameLogic';
import { Theme } from '../utils/theme';

interface GameBoardProps {
  gridSize: number;
  lines: LinesState;
  squares: SquaresState;
  onLineClick: (lineId: string) => void;
  turn: Player;
  theme: Theme;
  lastLineId: string | null;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  lines,
  squares,
  onLineClick,
  theme,
  lastLineId,
}) => {
  const boardRef = React.useRef<HTMLDivElement>(null);

  const dotClass = gridSize <= 12 ? 'w-2 h-2' : 'w-1.5 h-1.5';
  const hLineClass = gridSize <= 12 ? 'h-2' : 'h-1.5';
  const vLineClass = gridSize <= 12 ? 'w-2' : 'w-1.5';

  const handleKeyDown = (e: React.KeyboardEvent, lineId: string) => {
    const [type, rStr, cStr] = lineId.split('-');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);

    let nextId: string | null = null;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (type === 'h') {
          if (r > 0) nextId = `v-${r - 1}-${c}`;
        } else {
          nextId = `h-${r}-${c}`;
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (type === 'h') {
          nextId = `v-${r}-${c}`;
        } else {
          if (r < gridSize - 1) nextId = `h-${r + 1}-${c}`;
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (type === 'v') {
          if (c > 0) nextId = `h-${r}-${c - 1}`;
        } else {
          nextId = `v-${r}-${c}`;
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (type === 'v') {
          nextId = `h-${r}-${c}`;
        } else {
          if (c < gridSize - 1) nextId = `v-${r}-${c + 1}`;
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!lines[lineId]) onLineClick(lineId);
        break;
    }

    if (nextId) {
      const nextEl = boardRef.current?.querySelector(`[data-line-id="${nextId}"]`) as HTMLElement;
      nextEl?.focus();
    }
  };

  const renderDotsAndLines = () => {
    const elements = [];

    for (let r = 0; r < gridSize; r++) {
      // Row of dots and horizontal lines
      for (let c = 0; c < gridSize; c++) {
        // Dot
        elements.push(
          <motion.div
            key={`dot-${r}-${c}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: (r + c) * 0.01 }}
            className={`${dotClass} rounded-full ${theme.dot} transition-colors duration-500`}
          />,
        );

        // Horizontal Line
        if (c < gridSize - 1) {
          const lineId = `h-${r}-${c}`;
          const owner = lines[lineId];
          const isLast = lineId === lastLineId;

          elements.push(
            <div
              key={lineId}
              data-line-id={lineId}
              role="button"
              tabIndex={0}
              aria-label={`Horizontal line at row ${r + 1}, column ${c + 1}`}
              aria-pressed={!!owner}
              className={`${hLineClass} group relative flex w-full cursor-pointer items-center justify-center rounded-sm outline-none`}
              onClick={() => !owner && onLineClick(lineId)}
              onKeyDown={(e) => handleKeyDown(e, lineId)}
            >
              {/* Invisible expanded hit area */}
              <div className="absolute -top-3 right-0 -bottom-3 left-0 z-10" />

              {!owner && (
                <div
                  className={`absolute h-[2px] w-full bg-transparent ${theme.hoverLine} transition-colors duration-300 group-focus:scale-x-110 group-focus:bg-current group-focus:opacity-40`}
                />
              )}
              {owner && (
                <>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`absolute h-[2px] w-full ${
                      owner === 'P' ? theme.p1Line : theme.p2Line
                    } z-20 transition-colors duration-500`}
                  />
                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 1 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scaleY: [1, 3.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className={`absolute h-[2px] w-full ${
                        owner === 'P' ? theme.p1Pulse : theme.p2Pulse
                      } z-10 blur-[3px]`}
                    />
                  )}
                </>
              )}
            </div>,
          );
        }
      }

      // Row of vertical lines and squares
      if (r < gridSize - 1) {
        for (let c = 0; c < gridSize; c++) {
          // Vertical Line
          const lineId = `v-${r}-${c}`;
          const owner = lines[lineId];
          const isLast = lineId === lastLineId;

          elements.push(
            <div
              key={lineId}
              data-line-id={lineId}
              role="button"
              tabIndex={0}
              aria-label={`Vertical line at row ${r + 1}, column ${c + 1}`}
              aria-pressed={!!owner}
              className={`${vLineClass} group relative flex h-full cursor-pointer items-center justify-center rounded-sm outline-none`}
              onClick={() => !owner && onLineClick(lineId)}
              onKeyDown={(e) => handleKeyDown(e, lineId)}
            >
              {/* Invisible expanded hit area */}
              <div className="absolute top-0 -right-3 bottom-0 -left-3 z-10" />

              {!owner && (
                <div
                  className={`absolute h-full w-[2px] bg-transparent ${theme.hoverLine} transition-colors duration-300 group-focus:scale-y-110 group-focus:bg-current group-focus:opacity-40`}
                />
              )}
              {owner && (
                <>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`absolute h-full w-[2px] ${
                      owner === 'P' ? theme.p1Line : theme.p2Line
                    } z-20 transition-colors duration-500`}
                  />
                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0, scaleX: 1 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scaleX: [1, 3.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className={`absolute h-full w-[2px] ${
                        owner === 'P' ? theme.p1Pulse : theme.p2Pulse
                      } z-10 blur-[3px]`}
                    />
                  )}
                </>
              )}
            </div>,
          );

          // Square
          if (c < gridSize - 1) {
            const sqId = `s-${r}-${c}`;
            const sqOwner = squares[sqId];
            elements.push(
              <div
                key={sqId}
                className="relative flex h-full w-full items-center justify-center p-[1px]"
              >
                {sqOwner && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`h-full w-full rounded-[1px] ${
                      sqOwner === 'P' ? theme.p1Square : theme.p2Square
                    } transition-colors duration-500`}
                  />
                )}
              </div>,
            );
          }
        }
      }
    }

    return elements;
  };

  return (
    <div
      ref={boardRef}
      role="grid"
      aria-label="Dots and Boxes Game Board"
      className="grid h-full w-full gap-0"
      style={{
        gridTemplateColumns: `repeat(${gridSize - 1}, max-content 1fr) max-content`,
        gridTemplateRows: `repeat(${gridSize - 1}, max-content 1fr) max-content`,
      }}
    >
      {renderDotsAndLines()}
    </div>
  );
};
