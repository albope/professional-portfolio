import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
    },
    ...projects.map((project) => ({
      url: `${site.url}/proyectos/${project.slug}`,
    })),
  ];
}
