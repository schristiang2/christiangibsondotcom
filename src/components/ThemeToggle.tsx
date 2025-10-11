import { Sunrise } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed left-4 md:left-12 bottom-4 md:bottom-12 z-[2] focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded transition-all duration-200 ${
        isDark
          ? 'text-[#2A2A2A] opacity-90 hover:opacity-60 focus:ring-white'
          : 'text-white opacity-90 hover:opacity-60 focus:ring-black'
      }`}
      aria-label="Toggle theme"
    >
      <Sunrise className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}
