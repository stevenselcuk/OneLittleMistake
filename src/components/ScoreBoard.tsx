import React, { useState } from 'react';
import { Player } from '../utils/gameLogic';
import { RotateCcw, Palette } from 'lucide-react';
import { Theme, THEMES, ThemeName } from '../utils/theme';

interface ScoreBoardProps {
  scores: { P: number; C: number };
  turn: Player;
  gameOver: boolean;
  onReset: () => void;
  theme: Theme;
  themeName: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ scores, turn, gameOver, onReset, theme, themeName, onThemeChange }) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between mb-12 px-2">
      <div className="flex items-center gap-8 text-2xl font-light font-mono tracking-[0.2em] uppercase">
        <div className={`transition-opacity duration-300 ${turn === 'P' && !gameOver ? 'opacity-100' : 'opacity-30'}`}>
          <span className={`${theme.p1Text} mr-3 transition-colors duration-500`}>P</span>
          {scores.P}
        </div>
        <div className={`transition-opacity duration-300 flex items-center ${turn === 'C' && !gameOver ? 'opacity-100' : 'opacity-30'}`}>
          <span className={`${theme.p2Text} mr-3 relative transition-colors duration-500`}>
            C
            {turn === 'C' && !gameOver && (
              <span className={`absolute -top-1 -right-2 w-1.5 h-1.5 ${theme.p2Pulse} rounded-full animate-pulse transition-colors duration-500`} />
            )}
          </span>
          {scores.C}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {gameOver && (
          <span className={`text-[10px] tracking-[0.2em] font-mono uppercase ${theme.mutedText} transition-colors duration-500`}>
            {scores.P > scores.C ? 'Player Wins' : scores.C > scores.P ? 'Computer Wins' : 'Draw'}
          </span>
        )}
        
        <div className="relative flex items-center">
          <button
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className={`${theme.appText} opacity-50 hover:opacity-100 transition-opacity duration-300`}
            aria-label="Change Theme"
          >
            <Palette size={14} />
          </button>
          {isThemeOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
              <div className={`absolute right-0 top-full mt-4 py-2 w-32 rounded-lg shadow-xl ${theme.dropdownBg} border ${theme.dropdownBorder} flex flex-col overflow-hidden z-50`}>
                {(Object.keys(THEMES) as ThemeName[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { onThemeChange(t); setIsThemeOpen(false); }}
                    className={`text-left px-4 py-2 text-xs font-mono uppercase tracking-widest ${themeName === t ? theme.appText : theme.mutedText} ${theme.dropdownHover} transition-colors`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onReset}
          className={`${theme.appText} opacity-50 hover:opacity-100 transition-opacity duration-300`}
          aria-label="Reset Game"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
