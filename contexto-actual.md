# Contexto Actual

**Actualizado:** 20260830-184500
**Fase:** Primera versión completa de la web BPM Tech — implementada y verificada visualmente

---

## AHORA MISMO (<10 lineas)
- 20260830-202000 : TODO pusheado a GitHub main (250bf71). Árbol = web BPM Tech. Prompt Claude Design reescrito NO autocontenido (referencia repo) en docs/prompt-claude-design.md.
- 20260830-202000 : origin/main tenía rediseño previo del portfolio (ene-ago 2026, Telegram, PWAs) → integrado con merge -s ours, historia preservada en b3f0313 y anteriores.
- 20260830-202000 : Pendiente: usuario ejecuta el prompt en Claude Design con el repo enlazado → implementar identidad resultante. OJO: posible autodeploy Vercel del repo (avisar hecho).
- 20260830-195000 : v2 completa tras feedback. Build ✓, lint ✓, API contacto probada ✓, capturas ✓. Servidor en :3017.
- 20260830-195000 : Artifact de revisión actualizado (v2): https://claude.ai/code/artifact/df329107-dd5e-4459-85b1-4ab484524d0d
- 20260830-195000 : Pendiente: usuario revisa → commit cuando lo pida. Resend API key para que el form envíe.

## Completado Recientemente (sin limite)
- 20260830-184500 : Home completa: Hero (+diagrama con pulso), Propuesta (tinta), Servicios (6 filas), Proyectos (4 conceptuales), Método (5 pasos sticky), Principios+Stack (tinta), Nosotros, Contacto+form (tinta), Footer.
- 20260830-184500 : Case studies /proyectos/[slug] (4), /aviso-legal, /privacidad (noindex), 404, sitemap, robots, OG image (edge, verificado 200), icon.svg.
- 20260830-184500 : Design system: paper/ink/cobalt(+bright) en globals.css, text-display-* y text-lead en tailwind, label-mono, container-editorial, link-underline.
- 20260830-184500 : Limpieza: eliminados i18n, [lang], dictionaries, splash, next-themes, assets personales; deps podadas; package renombrado bpm-tech-web; README reescrito con TODOs.
- 20260830-184500 : Fix clave: extendTailwindMerge en src/lib/utils.ts (text-display-* se descartaba como color en cn()).
- 20260830-184500 : noscript fallback para wrappers de animación con opacity 0.

## Decisiones Tomadas (sin limite)
- 20260830-195000 : v2 — Proyectos reales sin datos de cliente: plataforma-clubes-padel (padel-club-os), wms-almacen (felt-wms, sin nombrar FELT), web-evento-personal (web-boda, sin nombres), web-programa-radio (sin-tregua-radio, sin nombrar programa). Badges "Proyecto real"/"Concepto". Sin enlaces externos a demos (ofrecido añadirlos).
- 20260830-195000 : v2 — Servicio 03 "Webs a medida" + bloque webs en Proyectos + target pymes/particulares/startups (filtro honesto en About y lista en Contacto).
- 20260830-195000 : v2 — Email oculto en toda la web: form → POST /api/contact → Resend REST (env RESEND_API_KEY, CONTACT_EMAIL fallback gmail solo en servidor). Honeypot "web". 503 controlado sin key.
- 20260830-195000 : v2 — cofounder.co revisado: adoptada numeración método 1.0–5.0; descartado marquee/mockups/gradientes.
- 20260830-162700 : Solo español v1; tema único light editorial (papel/tinta/cobalto); Geist + Geist Mono + Instrument Serif itálica como acento quirúrgico.
- 20260830-162700 : Proyectos conceptuales marcados "Concepto"; sin clientes/métricas inventadas.
- 20260830-162700 : Email provisional albertobort@gmail.com y dominio fallback bpmtech.example como TODOs en src/data/site.ts.
- 20260830-184500 : Formulario contacto = mailto compuesto; backend documentado en README (Resend + /api/contact).
- 20260830-184500 : Research subagente validó dirección: light editorial > dark (dark = cliché AI startup 2024); mono como voz técnica; hero tipográfico.

## Siguiente Paso Logico (<10 lineas)
- Usuario revisa en local (npm run dev o :3017) → feedback → commit cuando lo pida.
- Si valida: decidir dominio + email corporativo + datos legales reales.

## Decisiones Pendientes (<15 lineas)
- 20260830-184500 : Dominio definitivo (NEXT_PUBLIC_SITE_URL), email corporativo, datos registrales para legales.
- 20260830-184500 : ¿Versión EN más adelante? (i18n eliminado a propósito en v1).

## Blockers Activos (<10 lineas)
- (ninguno)

## No Olvidar (<15 lineas)
- 20260830-162700 : NO inventar clientes, métricas, testimonios, teléfonos ni direcciones.
- 20260830-184500 : Legales en noindex hasta tener datos reales.
- 20260830-184500 : NO commitear sin petición del usuario. Todo el contenido editable vive en src/data/.
- 20260830-184500 : Edge headless tiene ancho mínimo ~500px: capturas "390px" salen recortadas, no es overflow real.
