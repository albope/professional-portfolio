// src/data/projects.ts

export interface Project {
  imageSrc: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  tools: string[];
  actionText: string;
  actionLink: string;
  repoLink?: string; // Opcional: enlace al repositorio
}

export const projectsData: Project[] = [

  {
    imageSrc: "project1.jpg",
    title: "Professional Profile",
    category: "Web Development",
    description: "An interactive portfolio showcasing professional skills and past work. Optimized for performance and accessibility, perfect for highlighting digital expertise.",
    techStack: ['HTML', 'CSS', 'JavaScript'],
    tools: ['GitHub Pages'],
    actionText: "Website",
    actionLink: "https://albope.github.io/perfil-profesional/"
  },
  {
    imageSrc: "project2.jpg",
    title: "Travel Map Generator",
    category: "Web Development",
    description: "A tool for creating interactive travel maps, ideal for travelers or businesses in the tourism sector. Built with React and Mapbox for real-time visualization.",
    techStack: ['React', 'Node.js'],
    tools: ['Mapbox'],
    actionText: "Website",
    actionLink: "https://travelmapgenerator.com/"
  },
  {
    imageSrc: "project3.jpg",
    title: "Padel App",
    category: "App Development",
    description: "A platform for organizing and managing padel games, offering match scheduling, results tracking, and tournament management. Built with React and Firebase.",
    techStack: ['React', 'Firebase'],
    tools: ['Material UI'],
    actionText: "Website",
    actionLink: "https://padel-app-96e21.web.app/"
  },
  {
    imageSrc: "project4.jpg",
    title: "Test Web Automation",
    category: "Test Automation",
    description: "Automated testing suite ensuring functionality and performance for the Travel Map Generator. Developed using Jest and React Testing Library.",
    techStack: ['Jest', 'React Testing Library'],
    tools: ['CI/CD'],
    actionText: "GitHub",
    actionLink: "https://github.com/albope/travel-map-tests"
  },
  {
    imageSrc: "project5.jpg",
    title: "JIRA Report Generator",
    category: "Internal Company Tool",
    description: "Web tool to standardize and optimize JIRA issue documentation, improving traceability and facilitating error reproduction for the development team.",
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    tools: ['JIRA', 'Markdown'],
    actionText: "Website",
    actionLink: "https://reportes-jira-eid.vercel.app/",
  },
  // ✅ PROYECTO CORREGIDO
  {

    imageSrc: "project6.jpg", 
    title: "Alberto's Digital Hub",
    category: "Web Development",
    description: "A personal digital hub showcasing my professional journey, skills, and projects. Built with Next.js and TypeScript for a modern, responsive design.",
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    tools: ['Vercel'],
    actionText: "Website", 
    actionLink: "https://albertobort-digital-hub.vercel.app/",
    repoLink: "https://github.com/albope/alberto-digital-hub",
  }
];