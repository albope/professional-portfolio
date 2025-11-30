'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Github, Linkedin, Twitter, Mail, User, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

// Definimos los items de navegación
const navItems = [
  { name: 'Home', icon: Home, href: '/' },
  // { name: 'Projects', icon: Briefcase, href: '#projects' }, // Descomenta cuando tengas la sección
  { name: 'Github', icon: Github, href: 'https://github.com/albope', external: true },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/albertobort/', external: true },
  { name: 'Twitter', icon: Twitter, href: 'https://x.com/albertobort23', external: true },
  { name: 'Contact', icon: Mail, href: 'mailto:albertobort@gmail.com', external: true },
];

export const NavBar: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      <nav className="pointer-events-auto flex items-center gap-2 px-3 py-3 rounded-full border border-white/20 bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 hover:scale-[1.02]">
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <a
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative flex items-center justify-center p-2.5 rounded-full text-slate-600 dark:text-slate-300 transition-colors",
                "hover:text-black dark:hover:text-white"
              )}
            >
              {/* Background Hover Pill Animation */}
              {hoveredIndex === index && (
                <motion.div
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full z-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10">
                <Icon className="w-5 h-5" />
              </span>

              {/* Tooltip Label */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 20 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 px-2 py-1 bg-slate-900 text-white dark:bg-white dark:text-black text-xs rounded-md whitespace-nowrap z-20 pointer-events-none"
                  >
                    {item.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          );
        })}
      </nav>
    </motion.div>
  );
};