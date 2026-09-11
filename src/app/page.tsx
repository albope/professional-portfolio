import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/** El trabajo va antes que el discurso: proyectos es la segunda sección. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <Process />
      <About />
      <Contact />
    </>
  );
}
