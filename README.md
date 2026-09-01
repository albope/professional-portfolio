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
| `CONTACT_EMAIL` | Sí | Buzón de destino. Sin él el formulario devuelve error 503. |
| `CONTACT_FROM` | No | Remitente. Por defecto `onboarding@resend.dev`, que solo entrega al email de la propia cuenta de Resend. |

Las tres están configuradas en Vercel (Production) como Sensitive.

## Infraestructura

| Pieza | Estado |
|---|---|
| Dominio | `bpmtechstudio.com` en Cloudflare. El apex redirige con 308 a `www`, que es el canónico. |
| Hosting | Vercel, proyecto `albertobort`, con `NEXT_PUBLIC_SITE_URL` a `https://www.bpmtechstudio.com`. |
| Envío de email | Resend con el dominio verificado (región EU). Sus registros MX, SPF y DKIM cuelgan de `send.bpmtechstudio.com`. |
| Recepción de email | Cloudflare Email Routing. `contacto@bpmtechstudio.com` reenvía al buzón del equipo. Sus MX van en el dominio raíz, así que no chocan con los de Resend. |

## Pendiente

1. **Proyectos**: revisar los textos de `src/data/projects.ts` y añadir nuevos casos cuando existan.
2. **Capturas de proyecto**: las de `public/screenshots/` muestran marcas de cliente, lo que choca con la regla de mostrar los proyectos reales sin nombre. Decidir si se recortan o se vuelve a los visuales abstractos.
3. **Limpieza**: en Vercel quedan `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` del portfolio anterior, que ya no usa nadie.
