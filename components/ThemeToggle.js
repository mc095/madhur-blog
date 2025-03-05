"use client";

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../app/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 bg-[var(--button-bg)] rounded-full hover:bg-[var(--button-hover-bg)] transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="text-[var(--text-primary)]" size={20} />
      ) : (
        <Sun className="text-[var(--text-primary)]" size={20} />
      )}
    </button>
  );
}