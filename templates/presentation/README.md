# Sistema corporativo de presentaciones BPM Tech

Biblioteca editorial 16:9 para propuestas, presentaciones de proyecto, demos, kick-offs, reuniones ejecutivas, arquitectura, casos de éxito y decks internos. Los contenidos, layouts, componentes y tokens están desacoplados para poder producir nuevos PPTX sin rediseñar cada página.

## Entregables principales

- `output/Plantilla_Corporativa_BPM_Tech_2026.pptx`: catálogo editable con los 21 layouts.
- `output/Plantilla_Corporativa_BPM_Tech_2026.potx`: versión instalable como plantilla de PowerPoint.
- `output/Deck_Corporativo_BPM_Tech_2026.pptx`: deck corporativo de ejemplo con 16 diapositivas.
- `output/Deck_Corporativo_BPM_Tech_2026.pdf`: exportación validada del deck.
- `output/contact-sheet-corporate-template.png`: revisión conjunta de los 21 layouts.
- `output/contact-sheet-corporate-deck.png`: revisión conjunta del deck corporativo.
- `output/qa-report-corporate-*.json`: formato, fuentes y control de desbordes.
- `theme/TOKENS.md`: sistema visual y decisiones tipográficas.

El sistema de propuestas anterior sigue disponible, incluidos el deck interno y el ejemplo ficticio de Río Turia.

## Arquitectura

```text
templates/presentation/
  theme/                  tokens de marca y documentación
  layouts/                narrativa, sistemas y negocio
  components/             primitivas, diagramas y componentes corporativos
  assets/                 fuentes y capturas verificadas
  examples/
    corporate_template/   catálogo de 21 layouts
    corporate_deck/       contenido corporativo real de BPM Tech
    bpm_system/            sistema de propuestas comerciales
    rio_turia/             propuesta ficticia completa
  output/                 PPTX, POTX, PDF, renders y QA
  build.py                generador de PowerPoint
  render_and_qa.ps1       render, PDF y control de overflow
  save_as_template.ps1    conversión PPTX → POTX
```

Todo salvo las capturas se compone con texto, formas y líneas editables. No hay degradados, sombras, bordes redondeados, iconografía decorativa ni mockups de dispositivos.

## Catálogo de layouts

| # | Layout | Uso principal |
|---:|---|---|
| 01 | `cover` | Portada corporativa, comercial o de proyecto |
| 02 | `section` | Separador narrativo |
| 03 | `editorial` | Gran mensaje + explicación breve |
| 04 | `standard` | Contenido + bloque visual |
| 05 | `split` | Antes/después, problema/solución |
| 06 | `pillars` | Tres o cuatro capacidades o principios |
| 07 | `process` | Método o timeline secuencial |
| 08 | `architecture` | Arquitectura técnica de alto nivel |
| 09 | `workflow` | Automatización, decisión y excepción |
| 10 | `product_showcase` | Captura real de producto |
| 11 | `case_study` | Contexto, problema, solución, resultado y stack |
| 12 | `scope_split` | Incluido / no incluido o versión / evolución |
| 13 | `phases` | Objetivo, entregable y duración por fase |
| 14 | `roadmap` | Meses, releases y frentes de trabajo |
| 15 | `table` | Alcance, estimación o comparación |
| 16 | `budget` | Fase, importe, pago y total |
| 17 | `conditions` | Validez, pagos, propiedad, cambios y soporte |
| 18 | `team` | Equipo por personas o roles, con o sin fotos |
| 19 | `stack` | Tecnología agrupada por responsabilidad |
| 20 | `next_steps` | Tres acciones de cierre |
| 21 | `corporate_closing` | Mensaje final y CTA |

Los layouts históricos `understanding`, `solution`, `evidence`, `scope`, `detail`, `gallery`, `roles`, `horizons`, `implementation`, `investment`, `exclusions` y `closing` continúan soportados para propuestas largas.

## Crear un deck nuevo

1. Copiar `examples/corporate_deck/content.py` a una carpeta nueva.
2. Completar `DECK["meta"]` y conservar solo las diapositivas que necesite la historia.
3. Sustituir contenido únicamente con datos validados. No inventar métricas, compatibilidades, resultados ni fechas.
4. Generar el PPTX:

```powershell
python templates\presentation\build.py `
  --content templates\presentation\examples\mi_deck\content.py `
  --output templates\presentation\output\Mi_Deck.pptx
```

5. Renderizar, comprobar overflow y exportar PDF:

```powershell
& templates\presentation\render_and_qa.ps1 `
  -PptxPath templates\presentation\output\Mi_Deck.pptx `
  -PdfPath templates\presentation\output\Mi_Deck.pdf `
  -RenderDir templates\presentation\output\rendered-mi-deck `
  -QaPath templates\presentation\output\qa-report-mi-deck.json
```

6. Revisar todos los PNG y volver a generar hasta que `text_overflow_issues` esté vacío.

## Usar la plantilla directamente en PowerPoint

- Abrir `Plantilla_Corporativa_BPM_Tech_2026.potx` crea una presentación nueva basada en el catálogo.
- Duplicar las páginas necesarias y eliminar el resto.
- Editar los objetos directamente: títulos, tablas, nodos, líneas, barras y pies siguen siendo editables.
- Para una composición reproducible y versionable, editar el archivo de contenido y regenerar con `build.py`.

## Identidad y tipografía

La fuente de verdad es `Identidad visual pending respuestas.pdf`; la web confirma la continuidad y FELT funciona solo como referencia de calidad. Aunque el briefing textual menciona Geist, la guía de identidad define Archivo Black, Archivo y Fragment Mono, y esa jerarquía prevalece. Los archivos de fuente y sus licencias se incluyen en `assets/fonts`.

Para editar en otro equipo, instalar las fuentes antes de abrir el PPTX. `render_and_qa.ps1` las carga de forma temporal durante la exportación automatizada.

Reglas principales:

- `paper #F7F6F2`, `ink #101013` y `cobalt #2743E0`;
- `cobalt_bright #6B83FF` sobre fondos oscuros;
- Archivo Black solo en titulares y mensajes clave;
- Archivo para lectura y Fragment Mono para microinformación;
- un cuadrado cobalt cierra el titular principal;
- hairlines para ordenar, sin sombras ni degradados.

## Requisitos y control de calidad

- Python 3.12 o compatible.
- `python-pptx` y Pillow, definidos en `requirements.txt`.
- Microsoft PowerPoint para render, PDF y creación de POTX.
- Poppler (`pdftoppm`) es útil para una comprobación independiente del PDF.

Antes de entregar: comprobar 16:9, fuentes, overflow, contraste, márgenes, densidad, coherencia del relato y fidelidad entre PPTX y PDF. El hecho de que el archivo se genere sin error no sustituye la revisión visual.
