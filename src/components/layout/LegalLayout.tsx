import type { ReactNode } from "react";

/**
 * Maqueta de las páginas legales (aviso legal y privacidad), con la piel de
 * la portada: desde 980 px, el titular en una columna izquierda de 4fr que
 * se queda fija al bajar, como en Preguntas, y el texto en la de 8fr con una
 * medida cómoda de lectura. Cada apartado (`h2`) abre con un filete. Por
 * debajo, apilados.
 *
 * El contenido jurídico se escribe en cada página tal cual, con párrafos y
 * `h2` como hijos directos: aquí solo se decide cómo se ven.
 */
export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article aria-labelledby="legal-titulo" className="wrap section">
      <div className="grid gap-y-10 980:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] 980:gap-x-16">
        <header className="980:sticky 980:top-[calc(var(--head-h)+32px)] 980:self-start">
          <h1 id="legal-titulo" className="max-w-[12em] text-h2">
            {title}
          </h1>
        </header>
        <div className="min-w-0 max-w-[40em] text-body text-ink-2 [&>*+*]:mt-4 [&>h2:first-child]:mt-0 [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0 [&>h2]:mt-12 [&>h2]:border-t [&>h2]:border-line [&>h2]:pt-8 [&>h2]:text-h3 [&>h2]:text-ink">
          {children}
        </div>
      </div>
    </article>
  );
}
