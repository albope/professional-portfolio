import { copyEs } from "@/data/copy";
import { getProject } from "@/data/projects";
import { projectImage } from "@/lib/og";

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
