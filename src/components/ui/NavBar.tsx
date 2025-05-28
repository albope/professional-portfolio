// src/components/ui/NavBar.tsx

import React from 'react';
import { Home, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const NavBar: React.FC = () => {
  return (
    <nav className="inline-flex items-center space-x-2 border border-slate-300 dark:border-slate-700 rounded-full p-2">
      <a href="/" aria-label="Home Page" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
        <Home className="h-5 w-5" />
      </a>
      <a href="https://github.com/albope" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
        <Github className="h-5 w-5" />
      </a>
      <a href="https://www.linkedin.com/in/albertobort/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
        <Linkedin className="h-5 w-5" />
      </a>
      <a href="https://x.com/albertobort23" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
        <Twitter className="h-5 w-5" />
      </a>
      <a href="mailto:albertobort@gmail.com" aria-label="Send an Email" className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
        <Mail className="h-5 w-5" />
      </a>
    </nav>
  );
};