// SSR full blog index — fetch toàn bộ bài ở build time (ISR 6h).
// MỤC ĐÍCH SEO: render MỌI link bài blog dạng <a> THẬT trong HTML ban đầu
// → Googlebot đọc được hết → mỗi bài nhận 1 internal link từ domain authority
// cao hơn (calculator). Đây là "crawl bridge" giúp Google discover + crawl
// các URL blog đang "unknown to Google".
//
// KHÁC BlogSection (client-side useEffect → Google không thấy link).

type WPPost = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  categories: number[];
  date: string;
};

const WP_API = "https://1phantram.com/blog/wp-json/wp/v2";

// Map category WP → nhóm hiển thị
const CATEGORY_GROUPS: { ids: number[]; label: string; icon: string; color: string; href?: string }[] = [
  { ids: [1, 2, 3, 4], label: "Tính %, Thống Kê & Tài Chính Cá Nhân", icon: "📊", color: "#2563eb", href: "https://1phantram.com/blog/category/huong-dan/" },
  { ids: [31], label: "Phần Trăm Trong Kinh Doanh & Bán Hàng", icon: "💼", color: "#059669", href: "https://1phantram.com/blog/category/kinh-doanh-ban-hang/" },
  { ids: [32, 33, 34], label: "Học Tập & Thi Cử", icon: "🎓", color: "#16a34a", href: "https://1phantram.com/blog/category/hoc-tap-thi-cu/" },
  { ids: [35], label: "Giảm Giá & Khuyến Mãi", icon: "🏷️", color: "#dc2626", href: "https://1phantram.com/blog/category/giam-gia-khuyen-mai/" },
  { ids: [36], label: "Tình Huống Sử Dụng Công Cụ", icon: "🧭", color: "#7c3aed", href: "https://1phantram.com/blog/category/tinh-huong/" },
];

function decodeEntities(s: string): string {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8230;/g, "…");
}

function blogPublicUrl(link: string): string {
  return link.replace(/^https:\/\/blog\.phantram\.online/i, "https://1phantram.com/blog");
}

async function fetchAllPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_API}/posts?per_page=100&status=publish&orderby=date&order=desc&_fields=id,slug,link,title,categories,date`,
      { next: { revalidate: 21600 } } // 6h ISR
    );
    if (!res.ok) return [];
    return (await res.json()) as WPPost[];
  } catch {
    return [];
  }
}

export default async function BlogIndexFull() {
  const posts = await fetchAllPosts();
  if (posts.length === 0) return null;

  return (
    <section
      className="blog-index-full max-w-5xl mx-auto px-4 py-8"
      aria-label="Toàn bộ bài viết blog 1phantram.com theo chủ đề"
    >
      <h2 id="kho-bai-viet" className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        📚 Kho Bài Viết Blog Theo Chủ Đề
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        Toàn bộ {posts.length} bài hướng dẫn tính phần trăm, thống kê, tài chính, kinh doanh và tình huống dùng công cụ tại{" "}
        <a href="https://1phantram.com/blog/" rel="noopener" style={{ color: "var(--primary)" }}>
          1phantram.com/blog
        </a>
        .
      </p>

      <div className="flex flex-col gap-6">
        {CATEGORY_GROUPS.map((group) => {
          const groupPosts = posts.filter((p) =>
            p.categories.some((c) => group.ids.includes(c))
          );
          if (groupPosts.length === 0) return null;
          return (
            <div
              key={group.label}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            >
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: group.color + "15",
                  borderBottom: `1px solid ${group.color}30`,
                }}
              >
                <span className="text-lg">{group.icon}</span>
                <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                  {group.href ? (
                    <a href={group.href} rel="noopener" style={{ color: "inherit" }}>
                      {group.label}
                    </a>
                  ) : group.label}
                </span>
                <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                  {groupPosts.length} bài
                </span>
              </div>
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {groupPosts.map((post) => (
                  <li key={post.id}>
                    <a
                      href={blogPublicUrl(post.link)}
                      rel="noopener"
                      className="block px-4 py-2.5 text-sm hover:opacity-80 transition-opacity"
                      style={{ color: "var(--text)" }}
                    >
                      {decodeEntities(post.title.rendered)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center">
        <a
          href="https://1phantram.com/blog/muc-luc/"
          rel="noopener"
          className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          📚 Mục lục toàn bộ bài viết
        </a>
        <a
          href="https://1phantram.com/blog/category/tinh-huong/"
          rel="noopener"
          className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
          style={{ background: "#7c3aed", color: "#fff" }}
        >
          🧭 Danh mục Tình huống
        </a>
        <a
          href="https://1phantram.com/blog/"
          rel="noopener"
          className="inline-flex items-center gap-1 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-95"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          📝 Xem toàn bộ blog 1phantram.com
        </a>
      </div>
    </section>
  );
}
