# Prompt para Claude Design — Identidad + rediseño web de BPM Tech

> **Referencia histórica del encargo inicial.** No es un prompt vigente para
> volver a diseñar o modificar la web. Desde el 9 de septiembre de 2026, la
> identidad, el recorrido comercial, los cuatro proyectos reales, la
> accesibilidad y la separación entre contacto comercial y legal se describen
> en [contexto-actual.md](contexto-actual.md) y en el [README](../README.md).
> Las indicaciones posteriores sobre tipografías provisionales, conservación de
> conceptos, ocultación de todo email o secciones obligatorias han quedado
> superadas. Se conserva el texto original para consultar la evolución del diseño.

> Copiar desde aquí hacia abajo y pegarlo en Claude Design, enlazando el repositorio
> https://github.com/albope/professional-portfolio

---

Eres el director creativo de un estudio de branding y diseño digital de primer nivel. Tu cliente es **BPM Tech** y el encargo tiene dos tareas encadenadas: primero crear su identidad corporativa completa, después rediseñar su web aplicando esa identidad. Trabaja las dos con el mismo rigor.

Tienes enlazado el repositorio de la web actual (**albope/professional-portfolio**). Antes de diseñar nada, revísalo a fondo:

- Todo el copy y el contenido viven en `src/data/` (site, services, projects, process, principles).
- Las secciones de la home están en `src/components/sections/` y las páginas en `src/app/` (home, case studies en `proyectos/[slug]`, legales, 404).
- El sistema visual provisional está en `src/app/globals.css` y `tailwind.config.ts`.
- El `README.md` explica el proyecto y lo que queda pendiente.

## Quién es BPM Tech

Estudio de software con base en Valencia, España. Hace software a medida, aplicaciones web, webs a medida con identidad propia, automatización de procesos, inteligencia artificial aplicada a negocio, integraciones entre sistemas y consultoría tecnológica. Acompaña al cliente desde la idea hasta el producto en producción.

Clientes objetivo: pymes, particulares con un proyecto propio y startups. Explícitamente NO grandes corporaciones. La sensación que debe transmitir todo: "esta gente sabe construir software de verdad y podría construir algo serio para mí". Cercanía sin perder solvencia técnica.

La identidad actual del repo es provisional y puedes evolucionarla o sustituirla por completo si lo justificas: papel cálido, tinta, cobalto como único acento, Geist Sans y Geist Mono con Instrument Serif itálica como acento editorial, hairlines, microetiquetas monoespaciadas tipo "§01 / Servicios" y el wordmark "BPM" en bold + "Tech" en serif itálica + cuadrado cobalto.

## Tarea 1 — Identidad corporativa completa

Diseña la identidad entera de BPM Tech en artboards dedicados:

1. **Logo**: wordmark principal, versión compacta e isotipo que funcione como favicon de 16px y avatar de redes. Construcción, área de respeto, tamaño mínimo, versiones sobre fondo claro y oscuro, versión monocroma.
2. **Color**: paleta completa con valores hex exactos, proporciones de uso (dominante, soporte, acento), combinaciones permitidas y prohibidas, y contraste AA garantizado en texto.
3. **Tipografía**: sistema completo con rol display, rol texto y rol técnico o de datos. Solo fuentes disponibles en Google Fonts, porque la web se implementará con next/font. Define escala, pesos y reglas de uso.
4. **Lenguaje visual**: los motivos gráficos propios de la marca (retícula, marcas de registro, estilo de diagramas o ilustración técnica, iconografía), el estilo de los visuales de proyectos y las reglas de espaciado. Debe existir UN gesto gráfico memorable y propio que haga la marca reconocible sin leer el nombre.
5. **Aplicaciones**: avatar de redes, plantilla de imagen OG para compartir enlaces, firma de email, tarjeta y una diapositiva de presentación tipo.

Restricciones estrictas para la identidad:

- Prohibido el imaginario tecnológico de saldo: gradientes morado a azul, glassmorphism, partículas, hexágonos, circuitos, cerebros, rayos, redes de nodos, robots, cohetes.
- Prohibidos también los looks que ya se reconocen como "hechos con IA": crema con serif y acento terracota, dark navy con acento neón, Inter o Space Grotesk como elección por defecto, tarjetas redondeadas con barrita de acento.
- Busca un ángulo poco visto pero sobrio. Puede salir de la tipografía, de un sistema gráfico propio, de un uso inesperado del color o de la retícula. Un solo gesto excelente vale más que diez efectos.
- Tiene que poder llevarlo una empresa real española que trata con pymes: sofisticada sin pretensión, técnica sin frialdad. Nada demasiado juvenil ni demasiado corporativo.

## Tarea 2 — Rediseño de la web a nivel de referencia del sector

Con la identidad de la Tarea 1 ya definida, rediseña la web del repositorio para situarla al nivel de basement.studio, Significa, Instrument, Monogram o Linear, sin copiar a ninguno. Idioma: español.

Respeta la arquitectura de información actual del repo (header, hero, propuesta, servicios, proyectos con software y webs a medida, método 1.0 a 5.0, principios y stack, nosotros, contacto, footer, case studies, 404). Puedes refinarla pero no empobrecerla. Reglas duras que ya cumple la web y no se pueden romper:

- Los proyectos reales se muestran sin nombres de clientes y todos se presentan como ejemplos adaptables a cualquier negocio. Los badges "Proyecto real" y "Concepto" se mantienen.
- El email de BPM Tech no aparece jamás en ninguna pantalla. El contacto es solo por formulario.
- Prohibido inventar clientes, métricas, testimonios, premios o datos de contacto.

Artboards esperados como mínimo: home desktop completa, home móvil completa, case study desktop y móvil, 404, menú móvil abierto y formulario en estado de éxito. Anota en los artboards la intención de motion (entradas, hovers, un elemento animado en el hero) sin convertir la web en una demo de animaciones.

### Reescritura completa del copy

Revisa y reescribe TODO el copy que encuentres en `src/data/` y en las secciones. El actual funciona pero tiene tics de redacción de IA que hay que eliminar. Reglas estrictas e innegociables:

1. Prohibido el punto y coma en todo el copy.
2. Prohibidas las rayas y guiones como pausa dentro de la frase (—, – o " - "). Puntúa solo con puntos, comas y algún dos puntos ocasional.
3. Elimina los tics de IA: la estructura "No X: Y" repetida, las triadas constantes ("diseño, ingeniería y negocio"), el paralelismo en cada frase, las muletillas tipo "no vendemos X, resolvemos Y" cuando se repiten, y los adjetivos vacíos (innovador, disruptivo, robusto, escalable sin contexto).
4. Frases cortas y concretas, con hechos verificables. Debe sonar a personas que construyen software, no a una landing generada.
5. Tono profesional, directo y cercano, comprensible para alguien no técnico. Anglicismos solo los imprescindibles.
6. Prohibidos los clichés: "transformamos ideas en realidad", "llevamos tu negocio al siguiente nivel", "soluciones innovadoras", "tecnología que transforma", "tu partner digital", "impulsamos la transformación digital".

Empieza por la identidad, resume en un artboard inicial las decisiones de marca (el porqué en una frase cada una) y construye después las pantallas. Prefiero pocas decisiones excelentes y coherentes que muchas ideas a medias.
