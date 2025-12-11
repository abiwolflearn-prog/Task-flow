import React from 'react';
import { Moon, Sun, CheckSquare } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
          <CheckSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          TaskFlow
        </h1>
      </div>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </header>
  );
};

export default Header;
