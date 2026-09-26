import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Method } from "@/components/sections/Method";
import { About } from "@/components/sections/About";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

/**
 * Portada en el orden de la especificación (3): cada sección responde a una
 * duda del dueño de una pyme y todo lleva a hacer una consulta. Fondos:
 * `bg`, `bg`, `surface`, `dark`, `bg`, `surface` y `bg`. El contenido se
 * sirve completo y visible, también sin JS.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Work />
      <Method />
      <About />
      <Faq />
      <Contact />
    </>
  );
}
