/**
 * Diagnóstico en directo: contrato del resultado, prompt de sistema,
 * validación, limpieza y plantilla de respaldo. Es isomorfo: el servidor lo
 * usa para validar lo que devuelve la IA y el cliente para la plantilla
 * cuando la petición falla. No toca el DOM.
 */
export interface DiagnosticoFase {
  num: string;
  titulo: string;
  texto: string;
  entregable: string;
}

export interface Diagnostico {
  titular: string;
  lectura: string;
  construir: string[];
  conectar: string[];
  noHaceFalta: string[];
  fases: DiagnosticoFase[];
  pregunta: string;
}

export type DiagnosticoSource = "ia" | "plantilla";

export const DIAGNOSTICO_LIMITS = {
  /** Una frase, al menos. */
  minChars: 12,
  maxChars: 1_500,
  /** El texto en JSON con escapes de seis bytes cabe de sobra. */
  requestBytes: 12_288,
  /** Topes por campo del resultado, para que la IA no desborde la interfaz. */
  titular: 120,
  parrafo: 600,
  item: 240,
} as const;

export const DIAGNOSTICO_TIMEOUTS = { body: 5_000, provider: 30_000, client: 35_000 } as const;

/** Evento con el que «Enviarlo por escrito» rellena el formulario de contacto. */
export const DIAGNOSTICO_EVENT = "bpm:diagnostico";

/** Prompt de sistema del prototipo, tal cual. */
export const SYS = `Eres el equipo de BPM Tech, estudio de consultoría tecnológica y software a medida con base en Valencia. Trabajáis con pymes, empresas medianas y startups: software de gestión, integraciones, automatización, IA aplicada y webs.
Una persona describe su situación. Devuelve SOLO un objeto JSON válido, sin texto antes ni después, con esta forma exacta:
{"titular":"máximo 8 palabras, lo que resolveríamos","lectura":"dos frases: qué entendemos del problema y por dónde empezaríamos","construir":["2 o 3 cosas concretas"],"conectar":["1 a 3 cosas"],"noHaceFalta":["1 o 2 cosas que no haría falta desarrollar"],"fases":[{"num":"1.0","titulo":"Entendemos","texto":"una frase específica de su caso","entregable":"entregable breve"},{"num":"2.0","titulo":"Diseñamos",...},{"num":"3.0","titulo":"Construimos",...},{"num":"4.0","titulo":"Lanzamos",...},{"num":"5.0","titulo":"Evolucionamos",...}],"pregunta":"la pregunta clave que le haríamos en la llamada"}
Reglas: español de España. Habla al lector de tú y del estudio en nosotros. Frases cortas y concretas, sin jerga. Prohibido el punto y coma y las rayas. Sin emoji. No inventes precios, plazos, métricas ni clientes. Si algo no se puede saber, conviértelo en la pregunta. Si la IA no aporta, no la propongas.`;

const texto = (value: unknown, max: number) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

function lista(value: unknown, min: number, max: number): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.map((item) => texto(item, DIAGNOSTICO_LIMITS.item)).filter((item): item is string => item !== null);
  return items.length < min ? null : items.slice(0, max);
}

/** Comprueba la forma del resultado y acota cada campo. Devuelve null si no sirve. */
export function validateDiagnostico(raw: unknown): Diagnostico | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const titular = texto(r.titular, DIAGNOSTICO_LIMITS.titular);
  const lectura = texto(r.lectura, DIAGNOSTICO_LIMITS.parrafo);
  const pregunta = texto(r.pregunta, DIAGNOSTICO_LIMITS.parrafo);
  const construir = lista(r.construir, 1, 3);
  const conectar = lista(r.conectar, 1, 3);
  const noHaceFalta = lista(r.noHaceFalta, 1, 2);
  if (!titular || !lectura || !pregunta || !construir || !conectar || !noHaceFalta) return null;
  if (!Array.isArray(r.fases) || r.fases.length < 5) return null;
  const fases: DiagnosticoFase[] = [];
  for (const [index, item] of r.fases.slice(0, 5).entries()) {
    if (!item || typeof item !== "object") return null;
    const f = item as Record<string, unknown>;
    const titulo = texto(f.titulo, DIAGNOSTICO_LIMITS.titular);
    const cuerpo = texto(f.texto, DIAGNOSTICO_LIMITS.parrafo);
    const entregable = texto(f.entregable, DIAGNOSTICO_LIMITS.item);
    if (!titulo || !cuerpo || !entregable) return null;
    fases.push({ num: texto(f.num, 8) ?? `${index + 1}.0`, titulo, texto: cuerpo, entregable });
  }
  return { titular, lectura, construir, conectar, noHaceFalta, fases, pregunta };
}

/** Extrae el primer objeto JSON de la salida de la IA y lo valida. */
export function parseDiagnostico(out: unknown): Diagnostico | null {
  if (typeof out !== "string") return null;
  const a = out.indexOf("{"), b = out.lastIndexOf("}");
  if (a < 0 || b < a) return null;
  try {
    return validateDiagnostico(JSON.parse(out.slice(a, b + 1)));
  } catch {
    return null;
  }
}

/** Reglas del sistema sobre lo que devuelve la IA: sin punto y coma ni rayas. */
export function clean<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/\s*;\s*/g, ". ").replace(/\s*[—–]\s*/g, ", ").trim() as T;
  }
  if (Array.isArray(value)) return value.map(clean) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[key] = clean(item);
    return out as T;
  }
  return value;
}

/** Plantilla por palabras clave cuando la IA no responde. */
export function fallback(text: string): Diagnostico {
  const s = text.toLowerCase();
  const has = (re: RegExp) => re.test(s);
  let c = {
    area: "tu operativa",
    titular: "Una herramienta hecha alrededor de cómo trabajas",
    construir: ["Una aplicación que centralice la información que hoy está repartida", "Permisos para que cada persona vea justo lo que necesita"],
    conectar: ["Las herramientas que ya usas y funcionan"],
    no: ["Rehacer lo que ya hace bien una herramienta existente"],
  };
  if (has(/stock|almac|inventar|existenc/)) {
    c = { area: "el inventario", titular: "Un stock que siempre cuadra", construir: ["Productos, ubicaciones y movimientos en una sola herramienta", "Un libro de movimientos que explique cada cifra"], conectar: ["Tu tienda o tu programa de facturación con el stock real"], no: ["Un ERP completo si lo que necesitas es controlar existencias"] };
  } else if (has(/reserv|cita|agenda|clase|pista|turno/)) {
    c = { area: "las reservas", titular: "Reservas, cobros y agenda en un mismo sitio", construir: ["Un portal de reservas que funcione desde el móvil", "Un panel para gestionar agenda, socios y cobros"], conectar: ["La pasarela de pago", "Los avisos por email"], no: ["Una app nativa si el navegador del móvil basta"] };
  } else if (has(/copi|a mano|manual|pedido|factur|excel|hoja/)) {
    c = { area: "el proceso manual", titular: "Que los datos pasen solos de un sitio a otro", construir: ["Una automatización que recoja y valide los datos", "Un registro de lo que se ha procesado y lo que falla"], conectar: ["La tienda online", "El programa de facturación"], no: ["Cambiar de herramientas si las actuales cumplen"] };
  } else if (has(/web|landing|tienda online|página|pagina/)) {
    c = { area: "la web", titular: "Una web que explique mejor tu negocio", construir: ["Una web a medida con un recorrido claro hacia el contacto", "Un gestor sencillo para publicar sin depender de nadie"], conectar: ["El formulario con tu email o tu CRM"], no: ["Funciones que nadie va a usar el primer año"] };
  } else if (has(/mvp|producto|plataforma|app|startup|idea/)) {
    c = { area: "el producto", titular: "Una primera versión delante de usuarios reales", construir: ["El recorrido principal del producto, nada más", "Un panel mínimo para operar el servicio"], conectar: ["Pagos y autenticación con servicios ya probados"], no: ["Todo lo que no valide la idea en la primera versión"] };
  } else if (has(/\bia\b|chatgpt|document|pdf|conocimiento/)) {
    c = { area: "la información interna", titular: "Un asistente con el contexto de tu empresa", construir: ["Un asistente que consulte tu documentación y cite sus fuentes"], conectar: ["Las carpetas y herramientas donde vive esa información"], no: ["IA donde una regla sencilla ya resuelve"] };
  }
  return {
    titular: c.titular,
    lectura: `Entendemos que ${c.area} depende hoy de pasos manuales y de información repartida. Empezaríamos por describir un recorrido concreto y decidir qué merece la pena construir primero.`,
    construir: c.construir,
    conectar: c.conectar,
    noHaceFalta: c.no,
    fases: [
      { num: "1.0", titulo: "Entendemos", texto: `Revisamos contigo cómo funciona hoy ${c.area} y dónde se pierde el tiempo.`, entregable: "Problema y siguiente paso" },
      { num: "2.0", titulo: "Diseñamos", texto: "Decidimos qué entra en la primera versión y qué puede esperar.", entregable: "Alcance y propuesta por escrito" },
      { num: "3.0", titulo: "Construimos", texto: "Desarrollamos por fases y revisas avances con datos reales.", entregable: "Versiones que puedes probar" },
      { num: "4.0", titulo: "Lanzamos", texto: "Probamos los recorridos importantes y lo dejamos listo para usar.", entregable: "Solución lista para su uso" },
      { num: "5.0", titulo: "Evolucionamos", texto: "Con el uso real decidimos qué mejorar, automatizar o ampliar.", entregable: "Continuidad acordada contigo" },
    ],
    pregunta: `¿Qué parte de ${c.area} te cuesta más coordinar hoy y quién la sufre?`,
  };
}

export interface DiagnosticoResponse {
  ok: true;
  source: "ia";
  result: Diagnostico;
}

/** Contrato de éxito de `POST /api/diagnostico`. */
export function isDiagnosticoResponse(payload: unknown): payload is DiagnosticoResponse {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Record<string, unknown>;
  return data.ok === true && data.source === "ia" && validateDiagnostico(data.result) !== null;
}
