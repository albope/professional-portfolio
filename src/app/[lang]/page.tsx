// src/app/[lang]/page.tsx

// NO AÑADAS 'use client' AQUÍ, ESTE ES UN SERVER COMPONENT

import Image from 'next/image';
// Importa los iconos necesarios directamente aquí si los usas en este archivo
import { ArrowDown, DollarSign } from 'lucide-react'; 

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { NavBar } from "@/components/ui/NavBar";
import { projectsData } from '@/data/projects'; // Asumimos que los datos de proyectos no cambian por idioma
                                            // Si cambian, necesitarás diccionarios para ellos también.
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel";
import PortfolioHeader from '@/components/portfolio/PortfolioHeader'; // Importa el nuevo header

// Función para obtener el diccionario
// (En un proyecto real, esto iría en un archivo separado, ej: /lib/dictionaries.ts)
import { promises as fs } from 'fs';
import path from 'path';

const getDictionary = async (lang: string) => {
  try {
    const filePath = path.join(process.cwd(), 'dictionaries', `${lang}.json`);
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading dictionary:", error);
    // Fallback a un diccionario por defecto o un objeto vacío si es preferible
    const filePathEn = path.join(process.cwd(), 'dictionaries', `en.json`);
    const fileEn = await fs.readFile(filePathEn, 'utf8');
    return JSON.parse(fileEn);
  }
}

// Componente reutilizable para las secciones
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

const SectionSeparator = () => (
    <div className="max-w-3xl mx-auto">
        <hr className="border-slate-200 dark:border-slate-800" />
    </div>
);

export default async function PortfolioPage({ params: { lang } }: { params: { lang: string }}) {
  const dict = await getDictionary(lang); // Carga el diccionario basado en 'lang'

  return (
    <div className="min-h-screen"> 
      <PortfolioHeader /> {/* USA EL NUEVO HEADER CLIENT COMPONENT */}

      <main>
        {/* SECCIÓN DE INTRODUCCIÓN (HERO) */}
        <section className="container mx-auto px-4 pt-8 pb-16 sm:pt-16 sm:pb-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-center">
          <div className="flex flex-col gap-6 text-center md:text-left order-2 md:order-1">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left mb-2">
              <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
                  <Image 
                      src="/Images/Alberto_Bort.jfif" 
                      alt="Foto de perfil de Alberto Bort"
                      fill
                      className="rounded-full object-cover shadow-md"
                      priority
                  />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">
                    {dict.hero.greeting}
                  </h1>
                  <p className="text-xl sm:text-2xl font-medium text-blue-600 dark:text-blue-500 mt-1">
                    {dict.hero.title}
                  </p>
              </div>
            </div>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
              {dict.hero.description}
            </p>
            <div className="mt-2 flex justify-center md:justify-start">
                <NavBar />
            </div>
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
              <a href="#projects">
                <Button size="lg">
                  <ArrowDown className="mr-2 h-5 w-5" />
                  {dict.buttons.my_work}
                </Button>
              </a>
              <a href="#pricing">
                <Button size="lg" variant="outline">
                   <DollarSign className="mr-2 h-5 w-5" />
                   {dict.buttons.services_pricing}
                </Button>
              </a>
            </div>
          </div>
          <div className="h-full">
             <Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                <CardHeader>
                    <Badge className="mb-2">{dict.itinerary_card.badge}</Badge>
                    <CardTitle className="text-2xl">{dict.itinerary_card.title}</CardTitle>
                    <CardDescription>{dict.itinerary_card.description}</CardDescription>
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
                      {dict.buttons.view_example_pdf}
                    </Button>
                  </a>
                </CardFooter>
             </Card>
          </div>
        </section>

        <SectionSeparator />

        <Section id="about">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{dict.sections.about_me}</h2>
            <p className="text-slate-800 dark:text-slate-300 text-lg">
              {dict.sections.about_me_text}
            </p>
          </div>
        </Section>

        <SectionSeparator />

        <Section id="projects">
           <SectionTitle>{dict.sections.latest_work}</SectionTitle>
           <div className="w-full max-w-4xl mx-auto">
              <Carousel opts={{ align: "start", loop: true }}>
                <CarouselContent className="-ml-2">
                  {projectsData.map((project, index) => ( // Suponiendo que projectData no necesita traducción
                    <CarouselItem key={index} className="pl-2 md:basis-1/2">
                      <div className="p-1 h-full">
                        <ProjectCard {...project} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:inline-flex" />
                <CarouselNext className="hidden sm:inline-flex" />
              </Carousel>
           </div>
        </Section>

        <SectionSeparator />

        <Section id="pricing">
          <SectionTitle>{dict.sections.services_pricing_title}</SectionTitle>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            {dict.sections.services_pricing_description}
          </p>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{dict.service_cards.dev_title}</CardTitle>
                <CardDescription>{dict.service_cards.dev_desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  {dict.service_cards.dev_features.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
                </ul>
              </CardContent>
              <CardFooter><p className="text-lg font-bold">{dict.service_cards.dev_price}</p></CardFooter>
            </Card>
            <Card className="flex flex-col border-2 border-blue-500 shadow-xl">
              <CardHeader>
                <Badge className="mb-2">{dict.service_cards.itinerary_badge}</Badge>
                <CardTitle>{dict.service_cards.itinerary_title}</CardTitle>
                <CardDescription>{dict.service_cards.itinerary_desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                   {dict.service_cards.itinerary_features.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
                </ul>
              </CardContent>
              <CardFooter><p className="text-lg font-bold">{dict.service_cards.itinerary_price}</p></CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>{dict.service_cards.landing_title}</CardTitle>
                <CardDescription>{dict.service_cards.landing_desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                   {dict.service_cards.landing_features.map((feature: string, i: number) => <li key={i}>{feature}</li>)}
                </ul>
              </CardContent>
              <CardFooter><p className="text-lg font-bold">{dict.service_cards.landing_price}</p></CardFooter>
            </Card>
          </div>
        </Section>

        <SectionSeparator />

        <Section>
          <SectionTitle>{dict.sections.core_skills}</SectionTitle>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* ... (Las skills también podrían venir de un diccionario si es necesario) ... */}
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Frontend</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>React</Badge> <Badge>Next.js</Badge> <Badge>TypeScript</Badge>
                <Badge>HTML5 & CSS3</Badge> <Badge>Tailwind CSS</Badge> <Badge>Material UI</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Backend & Database</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>Node.js</Badge> <Badge>Firebase</Badge> <Badge>API REST</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Testing & DevOps</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>Jest</Badge> <Badge>React Testing Library</Badge> <Badge>Cypress</Badge>
                <Badge>Docker</Badge> <Badge>CI/CD</Badge> <Badge>Vercel</Badge>
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">Tools & Planning</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge>JIRA</Badge> <Badge>Content Creation</Badge> <Badge>Travel Planning</Badge><Badge>Web development</Badge><Badge>App Development</Badge><Badge>Tech Consultancy</Badge>
              </div>
            </div>
          </div>
        </Section>

        <SectionSeparator />

        <Section>
            <SectionTitle>{dict.sections.get_in_touch}</SectionTitle>
          <div className="max-w-xl mx-auto text-center">
              <p className="text-lg mb-6 text-slate-600 dark:text-slate-400">
                {dict.sections.get_in_touch_description.split('Contact me')[0]}
                <a 
                  href="mailto:albertobort@gmail.com"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Contact me
                </a>
                {dict.sections.get_in_touch_description.split('Contact me')[1]}
              </p>
              <NavBar />
          </div>
        </Section>
      </main>

      <footer className="text-center p-8 text-sm text-slate-500 border-t border-slate-200 dark:border-slate-800 mt-16 sm:mt-24">
        © {new Date().getFullYear()} Alberto Bort. {dict.footer.rights_reserved}
      </footer>
    </div>
  );
}