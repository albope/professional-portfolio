# BPM Tech — Web corporativa

Web corporativa de **BPM Tech**, estudio de software especializado en desarrollo a medida, automatización de procesos, integraciones e inteligencia artificial aplicada a negocio.

## Stack

- **Next.js 14** (App Router) + **TypeScript** estricto
- **Tailwind CSS 3** con tokens de la identidad BPM Tech (`src/app/globals.css` + `tailwind.config.ts`)
- **framer-motion** para motion (respeta `prefers-reduced-motion`)
- **Lenis** para smooth scroll (desactivado con `prefers-reduced-motion`)
- Tipografía (next/font/google): **Archivo Black** (display, caja alta), **Archivo** 400/500/600 (texto/UI) y **Fragment Mono** (etiquetas y datos)
- Marca: sin border-radius, sin sombras ni gradientes. Favicons y OG en `public/` (favicon-16/32/180.png, og-1200x630.png, avatar-512.png)

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de producción
npm run lint
```

## Estructura

```
src/
  app/                  # rutas: home, /proyectos/[slug], legales, SEO (sitemap, robots, OG)
  components/
    layout/             # Header, Footer, SmoothScroll
    sections/           # secciones de la home
    ui/                 # primitivos: Button, Reveal, SectionHeading, Wordmark, ProjectVisual
  data/                 # todo el contenido editable: site, services, projects, process, principles
  lib/                  # fonts, utils
```

Todo el copy y el contenido viven en `src/data/` — para cambiar textos no hace falta tocar componentes.

## Formulario de contacto

El email de contacto **no se publica en la web**: el formulario hace POST a
`/api/contact`, que envía el mensaje por [Resend](https://resend.com) desde el
servidor. Configuración (variables de entorno):

| Variable | Obligatoria | Descripción |
|---|---|---|
| `RESEND_API_KEY` | Sí | API key de Resend. Sin ella el formulario devuelve error 503. |
| `CONTACT_EMAIL` | No | Buzón de destino. Por defecto, el provisional del equipo. |
| `CONTACT_FROM` | No | Remitente. Por defecto `onboarding@resend.dev` (solo permite enviar al email de la propia cuenta de Resend; con dominio verificado, usar `hola@dominio.com`). |

## Pendiente antes de publicar (TODOs)

1. **Dominio**: definir el dominio real y configurar `NEXT_PUBLIC_SITE_URL` (usado en metadata, sitemap y robots). Fallback actual: `https://bpmtech.example`.
2. **Resend**: crear cuenta, configurar `RESEND_API_KEY` (y `CONTACT_EMAIL`/`CONTACT_FROM` si aplica) para que el formulario envíe de verdad.
3. **Proyectos**: revisar los textos de `src/data/projects.ts` y añadir nuevos casos cuando existan.
