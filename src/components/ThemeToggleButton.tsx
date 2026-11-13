import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';

export const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      aria-label={isDark ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
      title={isDark ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
      className={`relative inline-flex items-center w-12 h-7 sm:w-14 sm:h-8 rounded-full p-0.5 transition-colors duration-300 cursor-pointer border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#00D2FF] ${
        isDark
          ? 'justify-end bg-[#0F1E36] border-[#1E3A5F] shadow-inner'
          : 'justify-start bg-sky-100 border-sky-200 shadow-inner'
      }`}
    >
      {/* Background Sun & Moon Track Icons */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none"
      >
        <Sun
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-amber-300/60 opacity-80' : 'text-amber-500 opacity-0'
          }`}
        />
        <Moon
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-opacity duration-200 ${
            isDark ? 'text-sky-300 opacity-0' : 'text-slate-500/75 opacity-85'
          }`}
        />
      </span>

      {/* Animated Sliding Switch Thumb */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 480, damping: 32 }}
        className={`relative z-10 w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center shadow-sm border ${
          isDark
            ? 'bg-[#00D2FF] border-[#38BDF8] text-[#060D17]'
            : 'bg-white border-amber-200 text-amber-500'
        }`}
      >
        {isDark ? (
          <Moon className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
        ) : (
          <Sun className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        )}
      </motion.span>
    </button>
  );
};
