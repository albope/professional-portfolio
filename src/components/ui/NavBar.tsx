// src/components/ui/NavBar.tsx

import React from 'react';
import { Home, Github, Linkedin, Twitter, Mail, Sun, Moon } from 'lucide-react';

interface NavBarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="inline-flex items-center space-x-6 border border-gray-300 dark:border-gray-600 rounded-full px-6 py-3">
      <a href="/" className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
        <Home className="h-5 w-5" />
      </a>
      <a href="https://github.com/albope" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
        <Github className="h-5 w-5" />
      </a>
      <a href="https://www.linkedin.com/in/albertobort/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
        <Linkedin className="h-5 w-5" />
      </a>
      <a href="https://x.com/albertobort23" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
        <Twitter className="h-5 w-5" />
      </a>
      <a href="mailto:albertobort@gmail.com" className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
        <Mail className="h-5 w-5" />
      </a>
      <button onClick={toggleDarkMode} className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300 focus:outline-none">
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
    </div>
  );
};