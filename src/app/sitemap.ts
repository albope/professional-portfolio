import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `${site.url}/proyectos/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${site.url}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: `${site.url}/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];
}
