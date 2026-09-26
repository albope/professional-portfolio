import { copyEs } from "@/data/copy";
import { getProject, projects } from "@/data/projects";
import { projectImage } from "@/lib/og";

/**
 * Las cinco imágenes se generan en el build, como la de la portada: incrustan
 * capturas reales y tardaban unos 0,6 s por petición, a riesgo de que la
 * vista previa de WhatsApp o LinkedIn se quede sin imagen en un arranque en
 * frío. Otro slug da 404.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

/**
 * Texto alternativo de respaldo. La ficha declara el suyo, con el nombre del
 * proyecto, en `generateMetadata`.
 */
export const alt = copyEs.ficha.og_alt_generico;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response(null, { status: 404 });
  return projectImage(project);
}
