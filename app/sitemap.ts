import type { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const [subjects, deadlines] = await Promise.all([
    getSubjects(),
    getDeadlines(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const subjectRoutes: MetadataRoute.Sitemap = subjects.map((sub) => ({
    url: `${baseUrl}/subjects/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const deadlineRoutes: MetadataRoute.Sitemap = deadlines.map((item) => ({
    url: `${baseUrl}/deadlines/${item.id}`,
    lastModified: new Date(item.createdAt || item.dueDate),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...subjectRoutes, ...deadlineRoutes];
}
