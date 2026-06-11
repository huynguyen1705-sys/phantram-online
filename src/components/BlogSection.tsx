"use client";
import { useEffect, useState } from "react";

interface WPPost {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string }>;
  };
}

interface Cluster {
  label: string;
  icon: string;
  color: string;
  slugs: string[];
  pillarSlug: string;
}

const CLUSTERS: Cluster[] = [
  {
    label: "Tính Phần Trăm",
    icon: "%",
    color: "#2563eb",
    pillarSlug: "tinh-phan-tram",
    slugs: [
      "tinh-phan-tram",
      "cong-thuc-tinh-phan-tram",
      "cach-tinh-phan-tram-tang-giam",
      "tinh-phan-tram-giam-gia",
      "tinh-phan-tram-tren-may-tinh",
      "bai-tap-tinh-phan-tram-co-loi-giai",
    ],
  },
  {
    label: "Thống Kê Cơ Bản",
    icon: "σ",
    color: "#7c3aed",
    pillarSlug: "thong-ke-co-ban",
    slugs: [
      "thong-ke-co-ban",
      "trung-binh-cong-la-gi",
      "trung-vi-median-la-gi",
      "mode-yeu-vi-la-gi",
      "phuong-sai-do-lech-chuan",
      "tan-suat-bang-tan-so",
    ],
  },
  {
    label: "Tài Chính Cá Nhân",
    icon: "₫",
    color: "#059669",
    pillarSlug: "quan-ly-tai-chinh-ca-nhan",
    slugs: [
      "quan-ly-tai-chinh-ca-nhan",
      "quy-tac-50-30-20",
      "lai-kep-la-gi-tai-chinh",
      "roi-la-gi-cach-tinh",
      "cagr-la-gi",
      "quy-tac-72",
    ],
  },
];

const BLOG_DOMAIN = "https://blog.phantram.online";
const WP_API = `${BLOG_DOMAIN}/wp-json/wp/v2`;

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export default function BlogSection() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${WP_API}/posts?per_page=6&status=publish&orderby=date&order=desc&_embed=wp:featuredmedia&_fields=id,slug,link,title,excerpt,featured_media,_embedded`)
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: "var(--bg)" }} className="pb-10">
      {/* Cluster sections */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>
          📚 Kiến thức theo chủ đề
        </h2>
        <div className="flex flex-col gap-4">
          {CLUSTERS.map((cluster) => (
            <div
              key={cluster.label}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              {/* Cluster header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: cluster.color + "15", borderBottom: `1px solid ${cluster.color}30` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: cluster.color }}
                  >
                    {cluster.icon}
                  </div>
                  <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    {cluster.label}
                  </span>
                </div>
                <a
                  href={`${BLOG_DOMAIN}/${cluster.pillarSlug}/`}
                  className="text-xs font-medium px-2 py-1 rounded-lg"
                  style={{ color: cluster.color, background: cluster.color + "15" }}
                >
                  Xem tất cả →
                </a>
              </div>
              {/* Article list */}
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {cluster.slugs.slice(0, 4).map((slug, i) => (
                  <a
                    key={slug}
                    href={`${BLOG_DOMAIN}/${slug}/`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: cluster.color + "20", color: cluster.color }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm leading-tight" style={{ color: "var(--text)" }}>
                      {SLUG_TITLES[slug] || slug}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bài mới nhất */}
      <div className="px-4 pt-6">
        <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>
          🆕 Bài viết mới nhất
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl h-24 animate-pulse" style={{ background: "var(--border)" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {posts.map((post) => {
              const imgUrl = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              const excerpt = stripHtml(post.excerpt?.rendered || "").slice(0, 80);
              return (
                <a
                  key={post.id}
                  href={post.link}
                  className="flex gap-3 rounded-2xl border p-3 hover:opacity-80 transition-opacity"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={stripHtml(post.title.rendered)}
                      className="w-20 h-16 rounded-xl object-cover shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex flex-col justify-center">
                    <p
                      className="text-sm font-semibold leading-tight line-clamp-2"
                      style={{ color: "var(--text)" }}
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    {excerpt && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                        {excerpt}
                      </p>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
        )}
        <div className="mt-4 text-center">
          <a
            href={`${BLOG_DOMAIN}/`}
            className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--primary)", color: "#fff" }}
          >
            📝 Xem tất cả bài viết
          </a>
        </div>
      </div>
    </div>
  );
}

// Friendly titles cho từng slug
const SLUG_TITLES: Record<string, string> = {
  "tinh-phan-tram": "Tính Phần Trăm: Hướng Dẫn Toàn Diện A-Z",
  "cong-thuc-tinh-phan-tram": "7 Công Thức Tính Phần Trăm Cần Biết",
  "cach-tinh-phan-tram-tang-giam": "Cách Tính Phần Trăm Tăng Giảm Chính Xác",
  "tinh-phan-tram-giam-gia": "Cách Tính % Giảm Giá Khi Mua Sắm",
  "tinh-phan-tram-tren-may-tinh": "Cách Tính % Trên Máy Tính, Excel, Điện Thoại",
  "bai-tap-tinh-phan-tram-co-loi-giai": "100 Bài Tập Tính Phần Trăm Có Lời Giải",
  "thong-ke-co-ban": "Thống Kê Cơ Bản: Hướng Dẫn A-Z",
  "trung-binh-cong-la-gi": "Trung Bình Cộng Là Gì? Công Thức Và Ví Dụ",
  "trung-vi-median-la-gi": "Trung Vị (Median) Là Gì? Cách Tính",
  "mode-yeu-vi-la-gi": "Mode (Yếu Vị) Là Gì? Cách Tìm",
  "phuong-sai-do-lech-chuan": "Phương Sai Và Độ Lệch Chuẩn: Công Thức",
  "tan-suat-bang-tan-so": "Tần Suất Là Gì? Cách Lập Bảng Tần Số",
  "quan-ly-tai-chinh-ca-nhan": "Quản Lý Tài Chính Cá Nhân: Hướng Dẫn A-Z",
  "quy-tac-50-30-20": "Quy Tắc 50/30/20: Quản Lý Chi Tiêu Thông Minh",
  "lai-kep-la-gi-tai-chinh": "Lãi Kép: Công Thức Và Sức Mạnh Theo Thời Gian",
  "roi-la-gi-cach-tinh": "ROI Là Gì? Cách Tính Tỷ Suất Sinh Lời",
  "cagr-la-gi": "CAGR Là Gì? Tốc Độ Tăng Trưởng Kép Hàng Năm",
  "quy-tac-72": "Quy Tắc 72: Bí Quyết Tính Nhanh Nhân Đôi Tiền",
};
