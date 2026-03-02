import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';
import { Theme } from '../utils/theme';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  theme: Theme;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, theme }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="pointer-events-none fixed bottom-12 z-50 flex w-full items-center justify-center"
        >
          <div
            className={`rounded-full border px-6 py-3 shadow-2xl ${theme.dropdownBorder} ${theme.dropdownBg} ${theme.appText} pointer-events-auto font-mono text-xs tracking-widest uppercase backdrop-blur-md`}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
