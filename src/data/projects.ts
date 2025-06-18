// src/data/projects.ts

export interface ProjectData {
  id: string; // Para enlazar con el diccionario
  imageSrc: string;
  techStack: string[];
  tools: string[];
  actionLink: string;
  repoLink?: string; // Opcional: enlace al repositorio
}

export const projectsData: ProjectData[] = [
  {
    id: "project1",
    imageSrc: "project1.jpg",
    techStack: ['HTML', 'CSS', 'JavaScript'],
    tools: ['GitHub Pages'],
    actionLink: "https://albope.github.io/perfil-profesional/"
  },
  {
    id: "project2",
    imageSrc: "project2.jpg",
    techStack: ['React', 'Node.js'],
    tools: ['Mapbox'],
    actionLink: "https://travelmapgenerator.com/"
  },
  {
    id: "project3",
    imageSrc: "project3.jpg",
    techStack: ['React', 'Firebase'],
    tools: ['Material UI'],
    actionLink: "https://padel-app-96e21.web.app/"
  },
  {
    id: "project4",
    imageSrc: "project4.jpg",
    techStack: ['Jest', 'React Testing Library'],
    tools: ['CI/CD'],
    actionLink: "https://github.com/albope/travel-map-tests"
  },
  {
    id: "project5",
    imageSrc: "project5.jpg",
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    tools: ['JIRA', 'Markdown'],
    actionLink: "https://reportes-jira-eid.vercel.app/",
  },
  {
    id: "project6",
    imageSrc: "project6.jpg",
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    tools: ['Vercel'],
    actionLink: "https://albertobort-digital-hub.vercel.app/",
    repoLink: "https://github.com/albope/alberto-digital-hub",
  },
    {
    id: "project7",
    imageSrc: "project7.jpg",
    techStack: ['Python', 'Tkinter', 'CustomTkinter'],
    tools: ['PyInstaller', 'Git'],
    actionLink: "https://github.com/albope/validador-csv-python/releases",
    repoLink: "https://github.com/albope/validador-csv-python",
  }
];