import type { MetadataRoute } from "next";

const BASE = "https://1phantram.com";
const BLOG = "https://1phantram.com/blog";
const WP_API = "https://1phantram.com/blog/wp-json/wp/v2";

const TOOL_SLUGS = [
  "ai",
  "widget-embed",
  "so-sanh-vay",
  "so-sanh-tiet-kiem",
  "tinh-phan-tram",
  "bao-nhieu-phan-tram",
  "phan-tram-tang-giam",
  "tinh-tang-giam-theo-phan-tram",
  "tim-gia-tri-goc",
  "tinh-giam-gia",
  "so-sanh-gia",
  "chia-bill-tip",
  "lai-suat-don",
  "lai-kep",
  "luong-net",
  "break-even",
  "scale-cong-thuc",
  "bmi",
  "phan-tram-thoi-gian",
  "soi-sale",
  "so-sanh-tinh-toan",
];

async function fetchBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=100&status=publish&orderby=modified&order=desc&_fields=slug`,
      { next: { revalidate: 21600 } }
    );
    if (!res.ok) return [];
    const posts = (await res.json()) as { slug: string }[];
    return posts.map((p) => p.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogSlugs = await fetchBlogSlugs();
  const main: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BLOG}/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BLOG}/category/tinh-huong/`, lastModified: now, changeFrequency: "daily", priority: 0.85 },
  ];
  const HIGH_PRIORITY_WEEKLY = new Set(["so-sanh-vay", "so-sanh-tiet-kiem"]);
  const tools: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: now,
    changeFrequency: slug === "phan-tram-thoi-gian" ? "daily" : "weekly",
    priority: HIGH_PRIORITY_WEEKLY.has(slug) ? 0.8 : 0.9,
  }));
  const blog: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BLOG}/${slug}/`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...main, ...tools, ...blog];
}
