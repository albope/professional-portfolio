'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun, ArrowDown, UserCircle, DollarSign } from 'lucide-react'; 
import Image from 'next/image';

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { NavBar } from "@/components/ui/NavBar";
import { projectsData } from '@/data/projects';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel";

// Componente reutilizable para las secciones con padding y ancla opcional
const Section = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`max-w-6xl mx-auto px-4 py-16 sm:py-24 ${className}`}>
    {children}
  </section>
);

// Componente reutilizable para los títulos de sección
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
        {children}
    </h2>
);

export default function Portfolio() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen"> 
      <header className="container mx-auto p-4 flex justify-end items-center sticky top-0 z-50 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </header>

      <main>
        {/* SECCIÓN DE INTRODUCCIÓN (HERO) */}
        <section className="container mx-auto px-4 pt-8 pb-16 sm:pt-16 sm:pb-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* COLUMNA IZQUIERDA: Intro y Acciones */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
              Alberto Bort
            </h1>
            <p className="text-2xl font-medium text-blue-600 dark:text-blue-500">
              Web Developer & Travel Planner
            </p>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
              I build intuitive digital solutions and craft unique travel itineraries. From complex web applications to perfectly planned trips, I turn ideas into reality.
            </p>
            <NavBar />
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <a href="#projects">
                <Button size="lg">
                  <ArrowDown className="mr-2 h-5 w-5" />
                  My Work
                </Button>
              </a>
              <a href="#pricing">
                <Button size="lg" variant="outline">
                   <DollarSign className="mr-2 h-5 w-5" />
                  Services & Pricing
                </Button>
              </a>
            </div>
          </div>

          {/* COLUMNA DERECHA: Promoción de Itinerarios */}
          <div className="h-full">
             <Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <CardHeader>
                    <Badge className="mb-2">New Service</Badge>
                    <CardTitle className="text-2xl">Personalized Travel Itineraries</CardTitle>
                    <CardDescription>Custom travel itineraries designed for you to discover cities like a local. Organized, detailed, and ready to enjoy.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Image 
                        src="/Images/ny-itinerary.jpg"
                        alt="Itinerario de Nueva York"
                        width={1200}
                        height={800}
                        className="rounded-lg shadow-md"
                    />
                </CardContent>
                <CardFooter>
                  <a href="/itinerario-nueva-york.pdf" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full">
                      See Example (New York, PDF)
                    </Button>
                  </a>
                </CardFooter>
             </Card>
          </div>
        </section>

        {/* Sección "About Me" */}
        <Section id="about" className="bg-slate-100 dark:bg-slate-800/50">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">About Me</h2>
            <p className="text-slate-800 dark:text-slate-300 text-lg">
              Passionate developer with extensive experience, I deliver comprehensive end-to-end solutions tailored to businesses, ensuring that each project is not only functional but also optimized for user experience and performance. My expertise lies in leveraging the latest web technologies to help clients transform their digital ideas into reality.
            </p>
          </div>
        </Section>
        
        {/* Sección "My Projects" */}
        <Section id="projects">
           <SectionTitle>My Latest Work</SectionTitle>
           <div className="w-full max-w-4xl mx-auto">
              <Carousel 
                opts={{ align: "start", loop: true }}
              >
                <CarouselContent className="-ml-2">
                  {projectsData.map((project, index) => (
                    <CarouselItem key={index} className="pl-2 md:basis-1/2">
                      <div className="p-1 h-full">
                        <ProjectCard
                          imageSrc={project.imageSrc}
                          title={project.title}
                          dates={project.category}
                          description={project.description}
                          techStack={project.techStack}
                          tools={project.tools}
                          actionText={project.actionText}
                          actionLink={project.actionLink}
                          repoLink={project.repoLink}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:inline-flex" />
                <CarouselNext className="hidden sm:inline-flex" />
              </Carousel>
           </div>
        </Section>
        
        {/* SECCIÓN DE PRECIOS Y SERVICIOS CON LA NUEVA TARJETA */}
        <Section id="pricing" className="bg-slate-100 dark:bg-slate-800/50">
          <SectionTitle>Services & Pricing</SectionTitle>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            I offer flexible solutions for both your digital and travel needs. Find the perfect plan for your next project.
          </p>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Web & App Development</CardTitle>
                <CardDescription>Custom digital solutions, from concept to deployment.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  <li>Frontend & Backend Development</li>
                  <li>Mobile-First & Responsive Design</li>
                  <li>API Integration & Automation</li>
                  <li>Performance Optimization & Testing</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">Starting at $45/hour</p>
              </CardFooter>
            </Card>

            <Card className="flex flex-col border-2 border-blue-500 shadow-xl">
              <CardHeader>
                <Badge className="mb-2">Most Popular</Badge>
                <CardTitle>Personalized Itineraries</CardTitle>
                <CardDescription>Your perfect trip, planned to the last detail.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  <li>Custom day-by-day routes</li>
                  <li>Restaurant & activity recommendations</li>
                  <li>Transportation & booking logistics</li>
                  <li>Digital map & offline PDF guide</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">From $50 / travel day</p>
              </CardFooter>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Landing Page Development</CardTitle>
                <CardDescription>High-impact pages that convert visitors into customers.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  <li>Custom design based on your brand</li>
                  <li>Fast, responsive, and mobile-first</li>
                  <li>Integration with marketing tools</li>
                  <li>Optimized for quick loading</li>
                </ul>
              </CardContent>
              <CardFooter>
                <p className="text-lg font-bold">From $150 (one-time)</p>
              </CardFooter>
            </Card>
          </div>
        </Section>

        {/* Sección Skills con categorías */}
        <Section>
          <SectionTitle>Core Skills & Technologies</SectionTitle>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Frontend</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>React</Badge>
                <Badge>Next.js</Badge>
                <Badge>TypeScript</Badge>
                <Badge>HTML5 & CSS3</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>Material UI</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Backend & Database</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>Node.js</Badge>
                <Badge>Firebase</Badge>
                <Badge>API REST</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Testing & DevOps</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>Jest</Badge>
                <Badge>React Testing Library</Badge>
                <Badge>Cypress</Badge>
                <Badge>Docker</Badge>
                <Badge>CI/CD</Badge>
                <Badge>Vercel</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Tools & Planning</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>JIRA</Badge>
                <Badge>Content Creation</Badge>
                <Badge>Travel Planning</Badge>
                <Badge>Web development</Badge>
                <Badge>App development</Badge>
                <Badge>Tech Consultancy</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* Información de Contacto */}
        <Section className="text-center bg-slate-100 dark:bg-slate-800/50">
            <SectionTitle>Get in Touch</SectionTitle>
          <p className="text-lg mb-6 text-slate-600 dark:text-slate-400">
            Ready to start a project?{' '}
            <a 
              href="mailto:albertobort@gmail.com"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Contact me
            </a> for a free consultation or a custom travel itinerary.
          </p>
          <NavBar />
        </Section>
      </main>

      <footer className="text-center p-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Alberto Bort. All rights reserved.
      </footer>
    </div>
  );
}