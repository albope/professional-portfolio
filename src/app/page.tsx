import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Faq } from "@/components/sections/Faq";
import { Work } from "@/components/sections/Work";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/** Oferta, pruebas reales y contacto. El contenido principal se sirve visible. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <Process />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
