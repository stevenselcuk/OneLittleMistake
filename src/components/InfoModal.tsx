import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';
import { Theme } from '../utils/theme';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, theme }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`w-full max-w-md overflow-hidden rounded-2xl border ${theme.dropdownBorder} ${theme.dropdownBg} pointer-events-auto p-8 shadow-2xl`}
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex flex-col">
                  <span
                    className={`mb-1 font-mono text-[10px] tracking-[0.4em] uppercase opacity-40 ${theme.appText}`}
                  >
                    One Little
                  </span>
                  <h2
                    className={`-ml-0.5 font-mono text-3xl font-light tracking-[0.2em] uppercase ${theme.appText}`}
                  >
                    Mistake
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`${theme.appText} mt-1 opacity-40 transition-opacity outline-none hover:opacity-100`}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className={`space-y-8 font-mono text-[11px] leading-relaxed tracking-wider ${theme.appText}`}
              >
                <section>
                  <p className="mb-4 opacity-70">
                    Take turns connecting two adjacent dots. When you complete the fourth side of a
                    1x1 box, you earn a point and get another turn. The player with the most boxes
                    at the end wins.
                  </p>
                </section>

                <hr className={`border-t ${theme.dropdownBorder} opacity-30`} />

                <section>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 uppercase opacity-80">
                    <div className="flex justify-between">
                      <span>Arrows/Tab</span>
                      <span className="opacity-40">Move</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Space/Enter</span>
                      <span className="opacity-40">Select</span>
                    </div>
                    <div className="flex justify-between">
                      <span>R</span>
                      <span className="opacity-40">Reset</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T</span>
                      <span className="opacity-40">Theme</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1-6</span>
                      <span className="opacity-40">Levels</span>
                    </div>
                  </div>
                </section>

                <hr className={`border-t ${theme.dropdownBorder} opacity-30`} />

                <section className="space-y-2 text-[9px] tracking-[0.2em] uppercase opacity-40">
                  <p>
                    Dude:{' '}
                    <a
                      href="https://github.com/stevenselcuk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-dotted transition-opacity hover:opacity-100"
                    >
                      Steven J. Selcuk
                    </a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
