import type { MetadataRoute } from "next";

const BASE = "https://phantram.online";
const BLOG = "https://blog.phantram.online";

// 28 bài đã có trên blog WordPress
const BLOG_SLUGS = [
  // Cluster 1: Phần trăm cơ bản
  "tinh-phan-tram",
  "kinh-nghiem-tinh-phan-tram",
  "cong-thuc-tinh-phan-tram",
  "cach-tinh-phan-tram-tang-giam",
  "tinh-phan-tram-giam-gia",
  "tinh-lai-suat-ngan-hang",
  "tinh-phan-tram-diem-thi",
  "tinh-phan-tram-tren-may-tinh",
  "bai-tap-tinh-phan-tram-co-loi-giai",
  "lai-kep-la-gi",
  // Cluster 2: Thống kê
  "thong-ke-co-ban",
  "trung-binh-cong-la-gi",
  "trung-vi-median-la-gi",
  "mode-yeu-vi-la-gi",
  "phuong-sai-do-lech-chuan",
  "tan-suat-bang-tan-so",
  "ti-le-phan-tram-trong-thong-ke",
  // Cluster 3: Tài chính cá nhân
  "quan-ly-tai-chinh-ca-nhan",
  "quy-tac-50-30-20",
  "lai-kep-la-gi-tai-chinh",
  "roi-la-gi-cach-tinh",
  "cagr-la-gi",
  "quy-tac-72",
  "phan-tram-trong-tai-chinh",
];

// 14 standalone tool URLs
const TOOL_SLUGS = [
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const main: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
  const tools: MetadataRoute.Sitemap = TOOL_SLUGS.map((slug) => ({
    url: `${BASE}/${slug}`,
    lastModified: now,
    changeFrequency: slug === "phan-tram-thoi-gian" ? "daily" : "weekly",
    priority: 0.9,
  }));
  const blog: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BLOG}/${slug}/`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...main, ...tools, ...blog];
}
