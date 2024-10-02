import React from 'react';
import { Badge } from "@/components/ui/Badge";
import { Globe } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  dates: string;
  description: string;
  techStack: string[];
  tools: string[];
  actionText: string;
  actionLink: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  imageSrc,
  title,
  dates,
  description,
  techStack,
  tools,
  actionText,
  actionLink,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md rounded-lg overflow-hidden">
      <Image src={`/Images/${imageSrc}`} alt={title} width={500} height={300} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{dates}</p>
        <p className="mt-2 text-gray-800 dark:text-gray-200">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {tools.map((tool) => (
            <Badge key={tool}>{tool}</Badge>
          ))}
        </div>
        <div className="mt-4">
          <a href={actionLink} target="_blank" rel="noopener noreferrer">
            <Badge className="inline-flex items-center cursor-pointer">
              {actionText} <Globe className="ml-1 h-4 w-4" />
            </Badge>
          </a>
        </div>
      </div>
    </div>
  );
};