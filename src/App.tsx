import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import {
  Player,
  LinesState,
  SquaresState,
  checkSquares,
  getBestAIMove,
} from './utils/gameLogic';
import {
  initAudio,
  playLineSound,
  playSquareSound,
  playGameOverSound,
} from './utils/audio';
import { THEMES, ThemeName } from './utils/theme';

const LEVELS = [6, 8, 12, 16, 24, 32];

export default function App() {
  const [gridSize, setGridSize] = useState<number>(6);
  const [maxUnlocked, setMaxUnlocked] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maxUnlockedSize');
      return saved ? parseInt(saved, 10) : 6;
    }
    return 6;
  });
  const [themeName, setThemeName] = useState<ThemeName>('dark');
  const theme = THEMES[themeName];

  const [lines, setLines] = useState<LinesState>({});
  const [squares, setSquares] = useState<SquaresState>({});
  const [turn, setTurn] = useState<Player>('P');
  const [scores, setScores] = useState({ P: 0, C: 0 });
  const [gameOver, setGameOver] = useState(false);
  
  const isProcessingRef = useRef(false);

  const resetGame = useCallback((newSize?: number) => {
    if (typeof newSize === 'number') {
      setGridSize(newSize);
    }
    setLines({});
    setSquares({});
    setTurn('P');
    setScores({ P: 0, C: 0 });
    setGameOver(false);
    isProcessingRef.current = false;
  }, []);

  const handleLineClick = useCallback(
    (lineId: string) => {
      if (gameOver || lines[lineId] || turn !== 'P' || isProcessingRef.current) return;

      isProcessingRef.current = true;
      initAudio(); // Unlock audio context on first user interaction

      setLines((prev) => {
        if (prev[lineId]) {
          isProcessingRef.current = false;
          return prev;
        }

        const newLines = { ...prev, [lineId]: 'P' as Player };
        const { newSquares, completedCount } = checkSquares(newLines, lineId, gridSize, 'P');

        if (completedCount > 0) {
          playSquareSound('P');
          setSquares((prevSq) => ({ ...prevSq, ...newSquares }));
          setScores((prevScores) => ({
            ...prevScores,
            P: prevScores.P + completedCount,
          }));
          // Player gets another turn
          isProcessingRef.current = false;
        } else {
          playLineSound('P');
          setTurn('C');
          isProcessingRef.current = false;
        }

        return newLines;
      });
    },
    [gameOver, lines, gridSize, turn]
  );

  // Check for game over
  useEffect(() => {
    const totalLines = 2 * gridSize * (gridSize - 1);
    const currentLines = Object.keys(lines).length;
    
    if (currentLines > 0 && currentLines === totalLines && !gameOver) {
      setGameOver(true);
      const winner = scores.P > scores.C ? 'P' : scores.C > scores.P ? 'C' : 'Draw';
      playGameOverSound(winner);

      if (winner === 'P') {
        const currentIndex = LEVELS.indexOf(gridSize);
        if (currentIndex !== -1 && currentIndex < LEVELS.length - 1) {
          const nextLevel = LEVELS[currentIndex + 1];
          if (nextLevel > maxUnlocked) {
            setMaxUnlocked(nextLevel);
            localStorage.setItem('maxUnlockedSize', nextLevel.toString());
          }
        }
      }
    }
  }, [lines, gridSize, gameOver, scores, maxUnlocked]);

  // AI Turn
  useEffect(() => {
    if (turn === 'C' && !gameOver) {
      // Faster delay for larger grids to keep the game moving
      const minDelay = gridSize > 12 ? 50 : 300;
      const maxDelay = gridSize > 12 ? 150 : 700;
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

      const timer = setTimeout(() => {
        const bestMove = getBestAIMove(lines, gridSize);
        if (bestMove) {
          setLines((prev) => {
            if (prev[bestMove]) return prev;
            
            const newLines = { ...prev, [bestMove]: 'C' as Player };
            const { newSquares, completedCount } = checkSquares(newLines, bestMove, gridSize, 'C');
            
            if (completedCount > 0) {
              playSquareSound('C');
              setSquares((prevSq) => ({ ...prevSq, ...newSquares }));
              setScores((prevScores) => ({
                ...prevScores,
                C: prevScores.C + completedCount,
              }));
            } else {
              playLineSound('C');
              setTurn('P');
            }
            return newLines;
          });
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, lines, gridSize]);

  return (
    <div className={`min-h-screen ${theme.appBg} ${theme.appText} flex flex-col items-center p-4 font-sans transition-colors duration-500`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[512px] flex flex-col items-center flex-1 justify-center pb-12"
      >
        <ScoreBoard 
          scores={scores} 
          turn={turn} 
          gameOver={gameOver} 
          onReset={() => resetGame()} 
          theme={theme}
          themeName={themeName}
          onThemeChange={setThemeName}
        />

        <div className="w-full max-w-[512px] aspect-square flex items-center justify-center mt-4">
          <GameBoard
            gridSize={gridSize}
            lines={lines}
            squares={squares}
            onLineClick={handleLineClick}
            turn={turn}
            theme={theme}
          />
        </div>

        <div className={`flex items-center justify-center gap-6 mt-8 text-xs font-mono ${theme.mutedText} transition-colors duration-500`}>
          {LEVELS.map((size) => {
            const isUnlocked = size <= maxUnlocked;
            return (
              <button
                key={size}
                onClick={() => isUnlocked && resetGame(size)}
                disabled={!isUnlocked}
                className={`transition-all duration-300 relative ${
                  !isUnlocked
                    ? 'opacity-30 cursor-not-allowed'
                    : gridSize === size
                    ? `${theme.appText} font-bold scale-110`
                    : 'hover:opacity-70'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
