import { ROBOTS } from "@/lib/robots";
import { CONFIG } from "@/lib/config";

export const dynamic = "force-static";

export default function sitemap() {
  const base = CONFIG.SITE_URL || "https://example.github.io/humanoid-hub";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...ROBOTS.map((r) => ({
      url: `${base}/robots/${r.slug}/`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
