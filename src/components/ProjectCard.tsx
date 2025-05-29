// src/components/ProjectCard.tsx
import React from 'react';
import { Badge } from "@/components/ui/Badge";
import { Globe, Github } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  category: string; // ANTES ERA 'dates', AHORA ES 'category'
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
  category, // ANTES ERA 'dates'
  description,
  techStack,
  tools,
  actionText,
  actionLink,
  repoLink,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
       <div className="relative w-full h-48">
        <Image src={`/Images/${imageSrc}`} alt={title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        {/* USA 'category' AQUÍ */}
        <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 mb-1">{category}</p>
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