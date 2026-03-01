import React from 'react';
import { motion } from 'motion/react';
import { Player, LinesState, SquaresState } from '../utils/gameLogic';
import { Theme } from '../utils/theme';

interface GameBoardProps {
  gridSize: number;
  lines: LinesState;
  squares: SquaresState;
  onLineClick: (lineId: string) => void;
  turn: Player;
  theme: Theme;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gridSize,
  lines,
  squares,
  onLineClick,
  theme,
}) => {
  const dotClass = gridSize <= 12 ? 'w-1.5 h-1.5' : 'w-1 h-1';
  const hLineClass = gridSize <= 12 ? 'h-1.5' : 'h-1';
  const vLineClass = gridSize <= 12 ? 'w-1.5' : 'w-1';

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
          />
        );

        // Horizontal Line
        if (c < gridSize - 1) {
          const lineId = `h-${r}-${c}`;
          const owner = lines[lineId];
          elements.push(
            <div
              key={lineId}
              className={`${hLineClass} w-full flex items-center justify-center cursor-pointer group relative`}
              onClick={() => !owner && onLineClick(lineId)}
            >
              {/* Invisible expanded hit area */}
              <div className="absolute -top-3 -bottom-3 left-0 right-0 z-10" />
              
              {!owner && (
                <div className={`absolute h-[1px] w-full bg-transparent ${theme.hoverLine} transition-colors duration-300`} />
              )}
              {owner && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute h-[1px] w-full ${
                    owner === 'P' ? theme.p1Line : theme.p2Line
                  } transition-colors duration-500`}
                />
              )}
            </div>
          );
        }
      }

      // Row of vertical lines and squares
      if (r < gridSize - 1) {
        for (let c = 0; c < gridSize; c++) {
          // Vertical Line
          const lineId = `v-${r}-${c}`;
          const owner = lines[lineId];
          elements.push(
            <div
              key={lineId}
              className={`${vLineClass} h-full flex items-center justify-center cursor-pointer group relative`}
              onClick={() => !owner && onLineClick(lineId)}
            >
              {/* Invisible expanded hit area */}
              <div className="absolute -left-3 -right-3 top-0 bottom-0 z-10" />
              
              {!owner && (
                <div className={`absolute w-[1px] h-full bg-transparent ${theme.hoverLine} transition-colors duration-300`} />
              )}
              {owner && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`absolute w-[1px] h-full ${
                    owner === 'P' ? theme.p1Line : theme.p2Line
                  } transition-colors duration-500`}
                />
              )}
            </div>
          );

          // Square
          if (c < gridSize - 1) {
            const sqId = `s-${r}-${c}`;
            const sqOwner = squares[sqId];
            elements.push(
              <div
                key={sqId}
                className="w-full h-full flex items-center justify-center relative p-[1px]"
              >
                {sqOwner && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-full h-full rounded-[1px] ${
                      sqOwner === 'P' ? theme.p1Square : theme.p2Square
                    } transition-colors duration-500`}
                  />
                )}
              </div>
            );
          }
        }
      }
    }

    return elements;
  };

  return (
    <div
      className="grid gap-0 w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${gridSize - 1}, max-content 1fr) max-content`,
        gridTemplateRows: `repeat(${gridSize - 1}, max-content 1fr) max-content`,
      }}
    >
      {renderDotsAndLines()}
    </div>
  );
};
