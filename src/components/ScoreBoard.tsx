import { HelpCircle, Palette, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import { Player } from '../utils/gameLogic';
import { Theme, ThemeName, THEMES } from '../utils/theme';

interface ScoreBoardProps {
  scores: { P: number; C: number };
  turn: Player;
  gameOver: boolean;
  onReset: () => void;
  theme: Theme;
  themeName: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  onInfoOpen: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  turn,
  gameOver,
  onReset,
  theme,
  themeName,
  onThemeChange,
  onInfoOpen,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  return (
    <div
      className="mb-12 flex w-full items-center justify-between px-2"
      role="region"
      aria-label="Game Stats and Settings"
    >
      <div
        className="flex items-center gap-8 font-mono text-2xl font-light tracking-[0.2em] uppercase"
        aria-live="polite"
      >
        <div
          className={`transition-opacity duration-300 ${turn === 'P' && !gameOver ? 'opacity-100' : 'opacity-30'}`}
          aria-label={`Player score: ${scores.P}`}
        >
          <span
            className={`${theme.p1Text} mr-3 transition-colors duration-500`}
            aria-hidden="true"
          >
            P
          </span>
          {scores.P}
        </div>
        <div
          className={`flex items-center transition-opacity duration-300 ${turn === 'C' && !gameOver ? 'opacity-100' : 'opacity-30'}`}
          aria-label={`Computer score: ${scores.C}`}
        >
          <span
            className={`${theme.p2Text} relative mr-3 transition-colors duration-500`}
            aria-hidden="true"
          >
            C
            {turn === 'C' && !gameOver && (
              <span
                className={`absolute -top-1 -right-2 h-1.5 w-1.5 ${theme.p2Pulse} animate-pulse rounded-full transition-colors duration-500`}
              />
            )}
          </span>
          {scores.C}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {gameOver && (
          <span
            className={`font-mono text-[10px] tracking-[0.2em] uppercase ${theme.mutedText} transition-colors duration-500`}
          >
            {scores.P > scores.C ? 'Player Wins' : scores.C > scores.P ? 'Computer Wins' : 'Draw'}
          </span>
        )}

        <div className="relative flex items-center">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className={`${theme.appText} opacity-50 transition-opacity duration-300 outline-none hover:opacity-100 focus:opacity-100`}
            aria-label="Change Theme"
            aria-haspopup="listbox"
            aria-expanded={isThemeOpen}
          >
            <Palette size={14} />
          </button>
          {isThemeOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
              <div
                className={`absolute top-full right-0 mt-4 w-32 rounded-lg py-2 shadow-xl ${theme.dropdownBg} border ${theme.dropdownBorder} z-50 flex flex-col overflow-hidden`}
                role="listbox"
                aria-label="Select Theme"
              >
                {(Object.keys(THEMES) as ThemeName[]).map((t) => (
                  <button
                    key={t}
                    role="option"
                    aria-selected={themeName === t}
                    onClick={() => {
                      onThemeChange(t);
                      setIsThemeOpen(false);
                    }}
                    className={`px-4 py-2 text-left font-mono text-xs tracking-widest uppercase ${themeName === t ? theme.appText : theme.mutedText} ${theme.dropdownHover} transition-colors outline-none focus:bg-white/5`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onInfoOpen}
          className={`${theme.appText} opacity-50 transition-opacity duration-300 outline-none hover:opacity-100 focus:opacity-100`}
          aria-label="Show Game Information"
        >
          <HelpCircle size={14} />
        </button>

        <button
          onClick={onReset}
          className={`${theme.appText} opacity-50 transition-opacity duration-300 outline-none hover:opacity-100 focus:opacity-100`}
          aria-label="Reset Game"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
