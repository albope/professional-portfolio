// src/app/[lang]/page.tsx

import Image from 'next/image';
import { ArrowDown, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/ProjectCard";
import { NavBar } from "@/components/ui/NavBar";
import { projectsData } from '@/data/projects'; // Interfaz actualizada
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Carousel";
import PortfolioHeader from '@/components/portfolio/PortfolioHeader';
import { promises as fs } from 'fs';
import path from 'path';
import { i18n } from '../../../i18n-config';

interface DictionaryProject {
  id: string;
  title: string;
  category: string;
  description: string;
  actionText: string;
}

interface DictionarySkillsSection {
  frontend_title: string;
  frontend_skills: string[];
  backend_db_title: string;
  backend_db_skills: string[];
  testing_devops_title: string;
  testing_devops_skills: string[];
  tools_planning_title: string;
  tools_planning_skills: string[];
}

interface DictionaryType {
  hero: { greeting: string; title: string; description: string; };
  buttons: { my_work: string; services_pricing: string; view_example_pdf: string; };
  itinerary_card: { badge: string; title: string; description: string; };
  sections: {
    about_me: string; about_me_text: string; latest_work: string;
    services_pricing_title: string; services_pricing_description: string;
    core_skills: string; get_in_touch: string; get_in_touch_description: string;
  };
  service_cards: {
    dev_title: string; dev_desc: string; dev_features: string[]; dev_price: string;
    itinerary_title: string; itinerary_desc: string; itinerary_features: string[]; itinerary_price: string; itinerary_badge: string;
    landing_title: string; landing_desc: string; landing_features: string[]; landing_price: string;
  };
  footer: { rights_reserved: string; };
  projects: DictionaryProject[];
  skills_section: DictionarySkillsSection;
}


const getDictionary = async (lang: string): Promise<DictionaryType> => {
  const currentLocale = i18n.locales.includes(lang as 'es' | 'en') ? lang : i18n.defaultLocale;
  try {
    const filePath = path.join(process.cwd(), 'dictionaries', `${currentLocale}.json`);
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file) as DictionaryType;
  } catch (error) {
    console.error(`Error reading dictionary for ${currentLocale}:`, error);
    // Fallback al diccionario por defecto (inglés en este caso, o el que definas)
    const fallbackLocale = i18n.defaultLocale;
    console.warn(`Falling back to ${fallbackLocale} dictionary.`);
    const filePathFallback = path.join(process.cwd(), 'dictionaries', `${fallbackLocale}.json`);
    const fileFallback = await fs.readFile(filePathFallback, 'utf8');
    return JSON.parse(fileFallback) as DictionaryType;
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

export default async function PortfolioPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang);

  const localizedProjects = projectsData.map(projectBase => {
    const localizedInfo = dict.projects.find((p: DictionaryProject) => p.id === projectBase.id);
    return {
      ...projectBase,
      title: localizedInfo?.title || projectBase.id, // Fallback al ID si no hay título
      category: localizedInfo?.category || 'N/A',
      description: localizedInfo?.description || 'No description available.',
      actionText: localizedInfo?.actionText || 'View',
    };
  });

  return (
    <div className="min-h-screen">
      <PortfolioHeader />

      <main>
        {/* SECCIÓN DE INTRODUCCIÓN (HERO) - ORDEN CAMBIADO */}
        <section className="container mx-auto px-4 pt-8 pb-16 sm:pt-16 sm:pb-24 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 items-center">
          {/* COLUMNA IZQUIERDA: INFO ALBERTO */}
          <div className="flex flex-col gap-6 text-center md:text-left order-1">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left mb-2">
              <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0">
                <Image
                  src="/Images/alberto-bort-profile.jpg" // <-- NUEVO NOMBRE/FORMATO
                  alt={dict.hero.greeting}
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

          {/* COLUMNA DERECHA: TARJETA ITINERARIO */}
          <div className="h-full order-2">
            <Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
              <CardHeader>
                <Badge className="mb-2">{dict.itinerary_card.badge}</Badge>
                <CardTitle className="text-2xl">{dict.itinerary_card.title}</CardTitle>
                <CardDescription>{dict.itinerary_card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src="/Images/ny-itinerary.jpg"
                  alt={dict.itinerary_card.title}
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
                {localizedProjects.map((project) => (
                  <CarouselItem key={project.id} className="pl-2 md:basis-1/2">
                    <div className="p-1 h-full">
                      <ProjectCard
                        imageSrc={project.imageSrc}
                        title={project.title}
                        category={project.category}
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
              {/* Flechas del carrusel visibles en móvil */}
              <CarouselPrevious className="inline-flex" />
              <CarouselNext className="inline-flex" />
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
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">{dict.skills_section.frontend_title}</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {dict.skills_section.frontend_skills.map((skill: string, i: number) => <Badge key={i}>{skill}</Badge>)}
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">{dict.skills_section.backend_db_title}</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {dict.skills_section.backend_db_skills.map((skill: string, i: number) => <Badge key={i}>{skill}</Badge>)}
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">{dict.skills_section.testing_devops_title}</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {dict.skills_section.testing_devops_skills.map((skill: string, i: number) => <Badge key={i}>{skill}</Badge>)}
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold mb-4">{dict.skills_section.tools_planning_title}</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {dict.skills_section.tools_planning_skills.map((skill: string, i: number) => <Badge key={i}>{skill}</Badge>)}
              </div>
            </div>
          </div>
        </Section>

        <SectionSeparator />

        <Section>
          <SectionTitle>{dict.sections.get_in_touch}</SectionTitle>
          <div className="max-w-xl mx-auto text-center">
            <p className="text-lg mb-6 text-slate-600 dark:text-slate-400">
              {/* Asumiendo que 'Contact me' es la frase literal para dividir */}
              {dict.sections.get_in_touch_description.includes('Contact me')
                ? (
                  <>
                    {dict.sections.get_in_touch_description.split('Contact me')[0]}
                    <a
                      href="mailto:albertobort@gmail.com"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      Contact me {/* Esto podría necesitar traducción si 'Contact me' cambia */}
                    </a>
                    {dict.sections.get_in_touch_description.split('Contact me')[1]}
                  </>
                )
                : dict.sections.get_in_touch_description.includes('Contáctame') // Para español
                  ? (
                    <>
                      {dict.sections.get_in_touch_description.split('Contáctame')[0]}
                      <a
                        href="mailto:albertobort@gmail.com"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      >
                        Contáctame
                      </a>
                      {dict.sections.get_in_touch_description.split('Contáctame')[1]}
                    </>
                  )
                  : ( // Fallback si ninguna de las frases clave está presente
                    <a
                      href="mailto:albertobort@gmail.com"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      {dict.sections.get_in_touch_description}
                    </a>
                  )
              }
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