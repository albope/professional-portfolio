// src/components/ProjectCard.tsx

import React from 'react';
import { Badge } from "@/components/ui/Badge";
import { Globe, Github } from 'lucide-react'; // 1. Importa el icono de Github
import Image from 'next/image';

// 2. Añade 'repoLink' como una prop opcional
interface ProjectCardProps {
  imageSrc: string;
  title: string;
  dates: string;
  description: string;
  techStack: string[];
  tools: string[];
  actionText: string;
  actionLink:string;
  repoLink?: string; 
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  imageSrc,
  title,
  dates, // Esto ahora es la categoría
  description,
  techStack,
  tools,
  actionText,
  actionLink,
  repoLink, // 3. Recibe la nueva prop
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
       <div className="relative w-full h-48">
        <Image src={`/Images/${imageSrc}`} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 mb-1">{dates}</p>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">Technologies & Tools</h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
            {tools.map((tool) => (
              <Badge key={tool}>{tool}</Badge>
            ))}
          </div>
        </div>
        {/* 4. Muestra la sección de enlaces, incluyendo el de GitHub solo si existe */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
          <a href={actionLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-500">
            {actionText} <Globe className="ml-1.5 h-4 w-4" />
          </a>
          {repoLink && (
            <a href={repoLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-slate-800 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-500">
              Repository <Github className="ml-1.5 h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};