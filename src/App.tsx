import { motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { InfoModal } from './components/InfoModal';
import { ScoreBoard } from './components/ScoreBoard';
import { Toast } from './components/Toast';
import { initAudio, playGameOverSound, playLineSound, playSquareSound } from './utils/audio';
import { Player, checkSquares, getBestAIMove, getRandomStartingPlayer } from './utils/gameLogic';
import { THEMES, ThemeName } from './utils/theme';

const LEVELS = [6, 8, 12, 16, 24, 32];
const THEME_STORAGE_KEY = 'theme_selection';

const INITIAL_STARTER = getRandomStartingPlayer();
const SAVED_GAME_KEY = 'saved_game_state';

export default function App() {
  // Read saved game state once on mount
  const getInitialGameState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SAVED_GAME_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved game state', e);
        }
      }
    }
    return null;
  };

  const [initialGameState] = useState<{
    gridSize?: number;
    lines?: LinesState;
    squares?: SquaresState;
    turn?: Player;
    scores?: { P: number; C: number };
    lastLineId?: string | null;
  } | null>(getInitialGameState);

  const [gridSize, setGridSize] = useState<number>(() => initialGameState?.gridSize ?? 6);
  const [maxUnlocked, setMaxUnlocked] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maxUnlockedSize');
      return saved ? parseInt(saved, 10) : 6;
    }
    return 6;
  });
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && Object.keys(THEMES).includes(saved)) {
        return saved as ThemeName;
      }
    }
    return 'sepia';
  });
  const theme = THEMES[themeName];

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const [lines, setLines] = useState<LinesState>(() => initialGameState?.lines ?? {});
  const [squares, setSquares] = useState<SquaresState>(() => initialGameState?.squares ?? {});
  const [turn, setTurn] = useState<Player>(() => initialGameState?.turn ?? INITIAL_STARTER);
  const [scores, setScores] = useState(() => initialGameState?.scores ?? { P: 0, C: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [lastLineId, setLastLineId] = useState<string | null>(() => initialGameState?.lastLineId ?? null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>(() => {
    if (initialGameState) {
      return { message: 'Game loaded!', isVisible: true };
    }
    return {
      message: INITIAL_STARTER === 'P' ? 'You start!' : 'Computer starts!',
      isVisible: true,
    };
  });
  const [lastMoveTime, setLastMoveTime] = useState<number>(() => Date.now());
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Auto-save game state
  useEffect(() => {
    if (!gameOver && Object.keys(lines).length > 0) {
      const stateToSave = {
        gridSize,
        lines,
        squares,
        turn,
        scores,
        lastLineId,
      };
      localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(stateToSave));
    }
  }, [gridSize, lines, squares, turn, scores, gameOver, lastLineId]);

  const isProcessingRef = useRef(false);

  const resetGame = useCallback((newSize?: number) => {
    if (typeof newSize === 'number') {
      setGridSize(newSize);
    }
    setLines({});
    setSquares({});
    const starter = getRandomStartingPlayer();
    setTurn(starter);
    setScores({ P: 0, C: 0 });
    setGameOver(false);
    setLastLineId(null);
    setLastMoveTime(Date.now());
    isProcessingRef.current = false;
    setToast({ message: starter === 'P' ? 'You start!' : 'Computer starts!', isVisible: true });

    // Clear saved game on reset
    localStorage.removeItem(SAVED_GAME_KEY);
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
        setLastLineId(lineId);
        const { newSquares, completedCount } = checkSquares(newLines, lineId, gridSize, 'P');

        if (completedCount > 0) {
          playSquareSound('P');
          setSquares((prevSq) => ({ ...prevSq, ...newSquares }));
          setScores((prevScores) => ({
            ...prevScores,
            P: prevScores.P + completedCount,
          }));
          setLastMoveTime(Date.now());
          // Player gets another turn
          isProcessingRef.current = false;
        } else {
          playLineSound('P');
          setTurn('C');
          setLastMoveTime(Date.now());
          isProcessingRef.current = false;
        }

        return newLines;
      });
    },
    [gameOver, lines, gridSize, turn],
  );

  // Check for game over
  useEffect(() => {
    const totalLines = 2 * gridSize * (gridSize - 1);
    const currentLines = Object.keys(lines).length;

    if (currentLines > 0 && currentLines === totalLines && !gameOver) {
      setTimeout(() => {
        setGameOver(true);
        // Calculate winner locally to avoid dependency on state during update
        const winner = scores.P > scores.C ? 'P' : scores.C > scores.P ? 'C' : 'Draw';
        playGameOverSound(winner);

        // Show result toast
        const message = winner === 'P' ? 'YOU WON!' : winner === 'C' ? 'YOU LOST!' : "IT'S A DRAW!";
        setToast({ message, isVisible: true });

        // Clear saved game when game ends
        localStorage.removeItem(SAVED_GAME_KEY);

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
      }, 0);
    }
  }, [lines, gridSize, gameOver, scores.P, scores.C, maxUnlocked]);

  // AI Turn
  useEffect(() => {
    if (turn === 'C' && !gameOver) {
      // AI thinking delay: 800ms to 2000ms
      const minDelay = 800;
      const maxDelay = 2000;
      const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

      const timer = setTimeout(() => {
        const bestMove = getBestAIMove(lines, gridSize);
        if (bestMove) {
          setLines((prev) => {
            if (prev[bestMove]) return prev;

            const newLines = { ...prev, [bestMove]: 'C' as Player };
            setLastLineId(bestMove);
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
              setLastMoveTime(Date.now());
            }
            return newLines;
          });
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, lines, gridSize]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input (not currently applicable but good practice)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();

      if (key === 'r') {
        resetGame();
      } else if (key === 't') {
        const themeNames = Object.keys(THEMES) as ThemeName[];
        const currentIndex = themeNames.indexOf(themeName);
        const nextIndex = (currentIndex + 1) % themeNames.length;
        setThemeName(themeNames[nextIndex]);
      } else if (key >= '1' && key <= '6') {
        const levelIndex = parseInt(key, 10) - 1;
        if (levelIndex < LEVELS.length) {
          const selectedSize = LEVELS[levelIndex];
          if (selectedSize <= maxUnlocked) {
            resetGame(selectedSize);
          }
        }
      } else if (key === '?' || key === 'h') {
        setIsInfoOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetGame, themeName, maxUnlocked]);

  // Player move warning timer
  useEffect(() => {
    if (turn === 'P' && !gameOver) {
      const timer = setInterval(() => {
        const timeSinceLastMove = Date.now() - lastMoveTime;
        if (timeSinceLastMove >= 30000 && !toast.isVisible) {
          setToast({ message: 'Are you still there? Your turn!', isVisible: true });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [turn, gameOver, lastMoveTime, toast.isVisible]);

  return (
    <div
      className={`min-h-screen ${theme.appBg} ${theme.appText} flex flex-col items-center p-4 font-sans transition-colors duration-500`}
    >
      <h1 className="sr-only">One Little Mistake - Dots and Boxes Game</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex w-full max-w-[512px] flex-1 flex-col items-center justify-center pb-12"
      >
        <ScoreBoard
          scores={scores}
          turn={turn}
          gameOver={gameOver}
          onReset={() => resetGame()}
          theme={theme}
          themeName={themeName}
          onThemeChange={setThemeName}
          onInfoOpen={() => setIsInfoOpen(true)}
        />

        <div className="mt-4 flex aspect-square w-full max-w-[512px] items-center justify-center">
          <GameBoard
            gridSize={gridSize}
            lines={lines}
            squares={squares}
            onLineClick={handleLineClick}
            turn={turn}
            theme={theme}
            lastLineId={lastLineId}
          />
        </div>

        <div
          className={`mt-8 flex items-center justify-center gap-6 font-mono text-xs ${theme.mutedText} transition-colors duration-500`}
        >
          {LEVELS.map((size) => {
            const isUnlocked = size <= maxUnlocked;
            return (
              <button
                key={size}
                onClick={() => isUnlocked && resetGame(size)}
                disabled={!isUnlocked}
                aria-label={`Set grid size to ${size}x${size}${!isUnlocked ? ' (Locked)' : ''}`}
                aria-current={gridSize === size ? 'true' : 'false'}
                className={`relative transition-all duration-300 ${
                  !isUnlocked
                    ? 'cursor-not-allowed opacity-30'
                    : gridSize === size
                      ? `${theme.appText} scale-110 font-bold`
                      : 'hover:opacity-70'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </motion.div>
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
        theme={theme}
      />
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} theme={theme} />
    </div>
  );
}
