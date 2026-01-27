'use client';

import Image from 'next/image';
import { ArrowUpRight, Code2, Smartphone, Layout, Github, ArrowRight, Sparkles, Zap, Globe, Shield, Clock, CheckCircle2, Linkedin, Mail } from 'lucide-react';
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from '@/components/ContactForm';
import { projectsData } from '@/data/projects';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// --- INTERFACES ---
interface DictionaryProject {
  id: string;
  title: string;
  category: string;
  description: string;
  actionText: string;
}

interface PWABenefit {
  stat: string;
  title: string;
  description: string;
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
  buttons: { my_work: string; services_pricing: string; contact_cta: string; };
  stats: { years: string; years_label: string; projects: string; projects_label: string; clients: string; clients_label: string; };
  sections: {
    about_me: string; about_me_text: string; latest_work: string; latest_work_subtitle: string;
    services_pricing_title: string; services_pricing_description: string;
    why_pwa_title: string; why_pwa_subtitle: string;
    core_skills: string; get_in_touch: string; get_in_touch_description: string;
    availability: string; availability_desc: string;
  };
  pwa_benefits: PWABenefit[];
  service_cards: {
    dev_title: string; dev_desc: string; dev_features: string[]; dev_price: string; dev_time: string;
    pwa_title: string; pwa_desc: string; pwa_features: string[]; pwa_price: string; pwa_time: string; pwa_badge: string;
    landing_title: string; landing_desc: string; landing_features: string[]; landing_price: string; landing_time: string;
  };
  footer: { rights_reserved: string; made_with: string; };
  contact_form: { name: string; email: string; message: string; send: string; sending: string; success: string; error: string; };
  projects: DictionaryProject[];
  skills_section: DictionarySkillsSection;
}

// --- UTILS ---
const resolveImagePath = (src: string) => {
  if (src.startsWith('http')) return src;
  if (src.startsWith('/Images')) return src;
  if (src.startsWith('/')) return src;
  return `/Images/${src}`;
};

// --- COMPONENTES VISUALES ---
const SectionTitle = ({ children, subtitle, number, center = false }: { children: React.ReactNode, subtitle?: string, number: string, center?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className={`mb-16 md:mb-24 ${center ? 'text-center' : ''}`}
  >
    <div className={`flex items-baseline gap-4 ${center ? 'justify-center' : ''} mb-4`}>
      <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-widest">({number})</span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium tracking-tight text-foreground leading-[0.95]">
        {children}
      </h2>
    </div>
    {subtitle && (
      <p className={`text-muted-foreground text-base md:text-lg max-w-2xl font-light leading-relaxed mt-4 ${center ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

// --- MAGNETIC BUTTON ---
function MagneticButton({ children, className, href, onClick }: { children: React.ReactNode; className?: string; href?: string; onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </Component>
  );
}

// --- PARALLAX IMAGE ---
function ParallaxImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function PortfolioPage({ params: { lang } }: { params: { lang: string } }) {
  const [dict, setDict] = useState<DictionaryType | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dictionary = await import(`../../../dictionaries/${lang}.json`);
        setDict(dictionary);
      } catch {
        const fallback = await import(`../../../dictionaries/en.json`);
        setDict(fallback);
      }
    };
    loadDictionary();
  }, [lang]);

  if (!dict) return <div className="min-h-screen bg-background" />;

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

  const services = [
    {
      icon: Code2,
      title: dict.service_cards.dev_title,
      desc: dict.service_cards.dev_desc,
      features: dict.service_cards.dev_features,
      price: dict.service_cards.dev_price,
      time: dict.service_cards.dev_time,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/10 text-blue-500 dark:text-blue-400",
    },
    {
      icon: Smartphone,
      title: dict.service_cards.pwa_title,
      desc: dict.service_cards.pwa_desc,
      features: dict.service_cards.pwa_features,
      price: dict.service_cards.pwa_price,
      time: dict.service_cards.pwa_time,
      badge: dict.service_cards.pwa_badge,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
      featured: true,
    },
    {
      icon: Layout,
      title: dict.service_cards.landing_title,
      desc: dict.service_cards.landing_desc,
      features: dict.service_cards.landing_features,
      price: dict.service_cards.landing_price,
      time: dict.service_cards.landing_time,
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/10 text-purple-500 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative transition-colors duration-500">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* ═══════════════════════════════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-8"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono uppercase tracking-widest">
                  {dict.sections.availability}
                </span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-muted-foreground font-light"
                >
                  {dict.hero.greeting}
                </motion.p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-medium tracking-tight leading-[0.95]">
                  <span className="text-foreground">Web Developer</span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    & PWA Architect
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl leading-relaxed">
                {dict.hero.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <MagneticButton
                  href="#contact"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative flex items-center gap-2">
                    {dict.buttons.contact_cta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </MagneticButton>

                <MagneticButton
                  href="#projects"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-slate-200 dark:border-white/10 rounded-full font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-300"
                >
                  {dict.buttons.my_work}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </MagneticButton>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-8 pt-8 mt-4 border-t border-slate-200 dark:border-white/10"
              >
                {[
                  { value: dict.stats.years, label: dict.stats.years_label },
                  { value: dict.stats.projects, label: dict.stats.projects_label },
                  { value: dict.stats.clients, label: dict.stats.clients_label },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-3xl md:text-4xl font-serif font-medium text-foreground">{stat.value}</span>
                    <span className="text-sm text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
                <div className="absolute inset-4 border border-white/10 rounded-3xl" />
                <div className="absolute inset-8 border border-white/5 rounded-2xl" />

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl flex items-center gap-2 z-10"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">Fast Loading</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute bottom-0 -left-6 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl flex items-center gap-2 z-10"
                >
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Works Offline</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-1/3 -right-6 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl flex items-center gap-2 z-10"
                >
                  <Shield className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-medium">Secure</span>
                </motion.div>

                {/* Center content */}
                <div className="absolute inset-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Code2 className="w-10 h-10 text-white" />
                    </div>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Building the future</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            PROJECTS SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="projects" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
          <SectionTitle number="01" subtitle={dict.sections.latest_work_subtitle}>
            {dict.sections.latest_work}
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localizedProjects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 hover:border-indigo-500/50 transition-all duration-500 ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className={`relative w-full overflow-hidden ${index === 0 ? 'h-80 md:h-full' : 'h-64'}`}>
                  <ParallaxImage
                    src={resolveImagePath(project.imageSrc)}
                    alt={project.title}
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex justify-between items-end mb-4">
                    <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                      {project.category}
                    </Badge>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {project.repoLink && (
                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition-transform">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.actionLink && (
                        <a href={project.actionLink} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition-transform">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className={`font-serif text-white mb-2 ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                    {project.title}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SERVICES SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="services" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
          <SectionTitle number="02" subtitle={dict.sections.services_pricing_description} center>
            {dict.sections.services_pricing_title}
          </SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className={`group relative p-8 rounded-3xl border transition-all duration-500 ${service.featured
                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30 hover:border-emerald-500/50 dark:from-emerald-500/5'
                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-white/10 hover:border-indigo-500/30'
                  }`}
              >
                {service.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      {service.badge}
                    </span>
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.iconBg}`}>
                  <service.icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-serif text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground font-light mb-6 leading-relaxed">{service.desc}</p>

                <ul className="space-y-3 mb-8">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <p className="text-3xl font-serif text-foreground">{service.price}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.time}
                      </p>
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className={`block w-full py-3 text-center rounded-xl font-medium transition-all duration-300 ${service.featured
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                        : 'bg-slate-100 dark:bg-white/5 text-foreground hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                  >
                    {dict.buttons.contact_cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            WHY PWA SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-[1600px] mx-auto">
            <SectionTitle number="03" subtitle={dict.sections.why_pwa_subtitle} center>
              {dict.sections.why_pwa_title}
            </SectionTitle>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {dict.pwa_benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-all duration-300 text-center"
                >
                  <p className="text-4xl md:text-5xl font-serif font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    {benefit.stat}
                  </p>
                  <p className="text-lg font-medium text-foreground mb-1">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SKILLS SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto">
          <SectionTitle number="04">{dict.sections.core_skills}</SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-6 pb-3 border-b border-indigo-500/20">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-3">
                  {group.skills.map(skill => (
                    <li key={skill} className="text-base md:text-lg font-serif text-muted-foreground hover:text-foreground transition-colors">
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CONTACT SECTION
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="contact" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold tracking-widest mb-4 block">(05)</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6">
                  {dict.sections.get_in_touch}
                </h2>
                <p className="text-lg text-muted-foreground font-light mb-8 max-w-md leading-relaxed">
                  {dict.sections.get_in_touch_description}
                </p>

                {/* Availability notice */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-8">
                  <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                    {dict.sections.availability_desc}
                  </p>
                </div>

                {/* Direct contact */}
                <div className="space-y-4">
                  <a
                    href="mailto:albertobort@gmail.com"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-indigo-500 transition-colors">albertobort@gmail.com</p>
                      <p className="text-sm text-muted-foreground">Email directo</p>
                    </div>
                  </a>

                  <div className="flex gap-4">
                    <a
                      href="https://www.linkedin.com/in/albertobort/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all group"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                    <a
                      href="https://github.com/albope"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 hover:border-slate-500/30 transition-all group"
                    >
                      <Github className="w-5 h-5" />
                      <span className="font-medium">GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-white/10"
              >
                <ContactForm dict={dict.contact_form} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════════ */}
        <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-slate-200 dark:border-white/10">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-serif font-bold">AB</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Alberto Bort. {dict.footer.rights_reserved}</p>
                <p className="text-xs">{dict.footer.made_with}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://github.com/albope" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/albertobort/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:albertobort@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
