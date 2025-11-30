'use client'; 

import Image from 'next/image';
import { ArrowUpRight, Code2, Map, Layout, Github, ArrowRight, MousePointer2 } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { projectsData } from '@/data/projects';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- INTERFACES ---
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

// --- UTILS IMÁGENES ---
const resolveImagePath = (src: string) => {
  if (src.startsWith('http')) return src;
  if (src.startsWith('/Images')) return src;
  if (src.startsWith('/')) return src;
  return `/Images/${src}`;
};

// --- COMPONENTES VISUALES ---
const SectionTitle = ({ children, subtitle, number }: { children: React.ReactNode, subtitle?: string, number: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    // Borde adaptable: Gris suave en Light, Blanco sutil en Dark
    className="mb-12 md:mb-24 border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 relative z-10"
  >
    <div className="flex items-baseline gap-4">
      <span className="font-mono text-xs text-indigo-600 dark:text-indigo-500 font-bold tracking-widest">({number})</span>
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-medium tracking-tight text-foreground leading-[0.9]">
        {children}
      </h2>
    </div>
    {subtitle && (
      <p className="text-muted-foreground text-sm md:text-base max-w-sm font-mono leading-relaxed text-left md:text-left mt-2 md:mt-0">
        // {subtitle}
      </p>
    )}
  </motion.div>
);

export default function PortfolioPage({ params: { lang } }: { params: { lang: string } }) {
  const [dict, setDict] = useState<DictionaryType | null>(null);
  
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await import(`../../../dictionaries/${lang}.json`);
        setDict(dictionary);
      } catch (e) {
        const fallback = await import(`../../../dictionaries/en.json`);
        setDict(fallback);
      }
    };
    loadDictionary();
  }, [lang]);

  if (!dict) return <div className="min-h-screen bg-background" />; 

  // --- TRADUCCIONES MANUALES (Para textos no incluidos en el diccionario) ---
  const projectsSubtitle = lang === 'es' 
    ? "Selección de proyectos que combinan ingeniería y diseño."
    : "Selected works combining engineering and design aesthetics.";

  const availableBadgeText = lang === 'es'
    ? "Disponible para nuevos proyectos"
    : "Available for new projects";

  const localizedProjects = projectsData.map(projectBase => {
    const localizedInfo = dict.projects.find((p: DictionaryProject) => p.id === projectBase.id);
    return {
      ...projectBase,
      title: localizedInfo?.title || projectBase.id,
      category: localizedInfo?.category || 'N/A',
      description: localizedInfo?.description || 'No description available.',
      actionText: localizedInfo?.actionText || 'View',
    };
  });

  return (
    // FIX MODO CLARO: Usamos variables semánticas (bg-background, text-foreground)
    <div className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-500">
      
      {/* Fondo Base Semántico */}
      <div className="fixed inset-0 w-full h-full bg-background z-0 pointer-events-none transition-colors duration-500" />
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] dark:opacity-[0.08] pointer-events-none mix-blend-overlay z-0 animate-pulse" />

      {/* Contenido Principal */}
      {/* CONFIRMADO: pb-40 para asegurar espacio extra en móvil para la barra inferior */}
      <div className="relative z-10 flex flex-col gap-20 md:gap-32 pb-40 md:pb-32 pt-24 md:pt-24 max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* HERO */}
        {/* Grid responsive: 1 col en móvil (flex-col implícito en grid-cols-1), 12 cols en desktop */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 min-h-[60vh] md:min-h-[50vh] items-end pb-12 border-b border-slate-200 dark:border-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 flex flex-col gap-6 md:gap-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {/* TRADUCCIÓN APLICADA: availableBadgeText */}
              <span className="font-mono text-[10px] md:text-xs text-emerald-600 dark:text-emerald-500 tracking-widest uppercase">
                {availableBadgeText}
              </span>
            </div>
            
            {/* Tipografía adaptativa: text-5xl en móvil, text-8xl en desktop */}
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.95] text-foreground">
              {dict.hero.greeting} <br />
              <span className="text-slate-500 italic font-light block mt-2">Digital Architect.</span>
            </h1>
            
            <p className="text-base md:text-xl text-muted-foreground font-light max-w-xl leading-relaxed">
              {dict.hero.description}
            </p>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5, duration: 1 }}
             className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end gap-6 pt-8 lg:pt-0"
          >
             <a href="#projects" className="group flex items-center gap-4 text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                <span className="text-sm font-mono uppercase tracking-widest">{dict.buttons.my_work}</span>
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                  <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" />
                </div>
             </a>
             <a href="#contact" className="group flex items-center gap-4 text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                <span className="text-sm font-mono uppercase tracking-widest">
                  {dict.sections.get_in_touch.length < 15 ? dict.sections.get_in_touch : 'Contact'}
                </span>
                <div className="w-8 h-8 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center group-hover:border-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                  <MousePointer2 className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
                </div>
             </a>
          </motion.div>
        </section>

        {/* PROYECTOS */}
        <section id="projects">
          <SectionTitle number="01" subtitle={projectsSubtitle}>
            {dict.sections.latest_work}
          </SectionTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localizedProjects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                // Fondo NEGRO fijo para evitar el flash blanco si la imagen falla
                className={`group relative overflow-hidden rounded-sm border border-slate-200 dark:border-white/10 bg-[#080808] hover:border-indigo-500/30 transition-all duration-500 flex flex-col shadow-sm dark:shadow-none ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
              >
                {/* Imagen: h-full en desktop para llenar la tarjeta grande */}
                <div className={`relative w-full overflow-hidden bg-[#111] ${index === 0 ? 'h-64 sm:h-96 lg:h-full' : 'h-64 sm:h-80'}`}>
                   <Image 
                      src={resolveImagePath(project.imageSrc)} 
                      alt={project.title} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                   />
                   <div className="absolute inset-0 bg-black/10 transition-colors duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end h-full z-20 pointer-events-none">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex justify-between items-end mb-3">
                      <Badge className="border border-white/20 text-white bg-white/10 backdrop-blur-md shadow-sm">
                        {project.category}
                      </Badge>
                      <div className="flex gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.repoLink && (
                           <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-black hover:scale-110 transition-transform">
                              <Github className="w-4 h-4" />
                           </a>
                        )}
                        {project.actionLink && (
                           <a href={project.actionLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white text-black hover:scale-110 transition-transform">
                              <ArrowUpRight className="w-4 h-4" />
                           </a>
                        )}
                      </div>
                    </div>
                    
                    <h3 className={`font-serif text-white mb-2 leading-tight drop-shadow-md ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                      {project.title}
                    </h3>
                    <p className="text-slate-200 text-sm leading-relaxed mb-4 line-clamp-2 drop-shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {project.techStack.slice(0, 4).map(tech => (
                        <span key={tech} className="text-[10px] font-mono uppercase tracking-wider text-slate-300 drop-shadow-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="services">
           <SectionTitle number="02" subtitle={dict.sections.services_pricing_description}>
              {dict.sections.services_pricing_title}
           </SectionTitle>

           <div className="grid grid-cols-1 border-t border-slate-200 dark:border-white/10">
              {[
                { 
                  icon: Code2, 
                  title: dict.service_cards.dev_title, 
                  desc: dict.service_cards.dev_desc, 
                  features: dict.service_cards.dev_features, 
                  price: dict.service_cards.dev_price,
                  color: "text-indigo-600 dark:text-indigo-400",
                  borderColor: "group-hover:border-indigo-500"
                },
                { 
                  icon: Map, 
                  title: dict.service_cards.itinerary_title, 
                  desc: dict.service_cards.itinerary_desc, 
                  features: dict.service_cards.itinerary_features, 
                  price: dict.service_cards.itinerary_price,
                  badge: dict.service_cards.itinerary_badge,
                  color: "text-emerald-600 dark:text-emerald-400",
                  borderColor: "group-hover:border-emerald-500",
                  special: true
                },
                { 
                  icon: Layout, 
                  title: dict.service_cards.landing_title, 
                  desc: dict.service_cards.landing_desc, 
                  features: dict.service_cards.landing_features, 
                  price: dict.service_cards.landing_price,
                  color: "text-sky-600 dark:text-sky-400",
                  borderColor: "group-hover:border-sky-500"
                }
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 py-12 md:py-16 border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all duration-500 px-4 lg:px-6 relative overflow-hidden ${service.special ? 'bg-indigo-50/50 dark:bg-indigo-900/[0.03]' : ''}`}
                >
                   <div className={`absolute left-0 top-0 bottom-0 w-1 bg-transparent ${service.borderColor.replace('border', 'bg')} transition-colors duration-300 opacity-0 group-hover:opacity-100`} />

                   <div className="lg:col-span-3 relative z-10">
                      {service.badge && (
                        <span className="inline-block text-[10px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 mb-3 animate-pulse">
                           {service.badge}
                        </span>
                      )}
                      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 mb-6 ${service.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-serif text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-100 transition-colors">{service.title}</h3>
                   </div>
                   
                   <div className="lg:col-span-6 relative z-10">
                      <p className="text-muted-foreground mb-8 font-light leading-relaxed text-base md:text-lg">{service.desc}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features.map((f, i) => (
                           <li key={i} className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${service.color.replace('text', 'bg')} shrink-0`} />
                              {f}
                           </li>
                        ))}
                     </ul>
                   </div>
                   
                   <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end relative z-10 mt-6 lg:mt-0">
                      <p className="text-2xl md:text-3xl font-serif text-foreground">{service.price}</p>
                      {service.special && (
                        <a href="/itinerario-nueva-york.pdf" target="_blank" className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:text-black dark:hover:text-white transition-colors mt-6 lg:mt-0 uppercase tracking-widest border-b border-indigo-400/30 pb-1 group-hover:border-indigo-400">
                          {dict.buttons.view_example_pdf} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      )}
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* SKILLS */}
        <section>
          <SectionTitle number="03">{dict.sections.core_skills}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 md:gap-y-16">
             {[
                { title: dict.skills_section.frontend_title, skills: dict.skills_section.frontend_skills },
                { title: dict.skills_section.backend_db_title, skills: dict.skills_section.backend_db_skills },
                { title: dict.skills_section.testing_devops_title, skills: dict.skills_section.testing_devops_skills },
                { title: dict.skills_section.tools_planning_title, skills: dict.skills_section.tools_planning_skills },
             ].map((group, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                   <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-500 mb-6 border-b border-indigo-500/20 pb-3 inline-block">
                     {group.title}
                   </h4>
                   <ul className="flex flex-col gap-3">
                      {group.skills.map(skill => (
                         <li key={skill} className="text-base md:text-lg font-serif text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors cursor-default flex items-center gap-3 group/skill">
                            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full group-hover/skill:bg-indigo-500 dark:group-hover/skill:bg-indigo-400 group-hover/skill:w-2 transition-all"></span>
                            {skill}
                         </li>
                      ))}
                   </ul>
                </motion.div>
             ))}
          </div>
        </section>

        {/* FOOTER */}
        <section id="contact" className="border-t border-slate-200 dark:border-white/10 pt-16 md:pt-24 mt-8 pb-8 md:pb-0">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                 <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 md:mb-8 leading-tight">{dict.sections.get_in_touch}</h2>
                 <p className="text-muted-foreground max-w-md mb-8 md:mb-10 leading-relaxed font-light text-lg">
                    {dict.sections.get_in_touch_description}
                 </p>
                 <a 
                    href="mailto:albertobort@gmail.com" 
                    className="text-2xl md:text-5xl font-serif text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors underline decoration-1 underline-offset-[16px] decoration-slate-300 dark:decoration-white/20 hover:decoration-indigo-500 break-all md:break-normal"
                 >
                    albertobort@gmail.com
                 </a>
              </motion.div>
              <div className="text-left md:text-right text-xs font-mono text-slate-500 dark:text-slate-600 uppercase tracking-widest mt-12 md:mt-0 w-full md:w-auto">
                 <p className="mb-2">© {new Date().getFullYear()} Alberto Bort.</p>
                 <p>{dict.footer.rights_reserved}</p>
                 <div className="mt-6 flex justify-start md:justify-end gap-6">
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
                    <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
                 </div>
              </div>
           </div>
        </section>
        
      </div>
    </div>
  );
}