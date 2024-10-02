// src/components/ui/NavBar.tsx

import React from 'react';
import { Home, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const NavBar: React.FC = () => {
  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = "albertobort@gmail.com";
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="inline-flex items-center space-x-6 border border-gray-300 dark:border-gray-600 rounded-full px-6 py-3">
      <a
        href="/"
        className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        <Home className="h-5 w-5" />
      </a>
      <a
        href="https://github.com/albope"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        href="https://www.linkedin.com/in/albertobort/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href="https://x.com/albertobort23"
        target="_blank"
        rel="noopener noreferrer"
        className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        <Twitter className="h-5 w-5" />
      </a>
      <a
        href="#"
        onClick={handleEmailClick}
        className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  );
};