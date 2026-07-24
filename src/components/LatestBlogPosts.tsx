// Fetched at build time + revalidated every 6h (ISR).
// Fresh content tự động hiện trên homepage → Google thấy bridge giữa main domain
// và blog subdomain, tăng crawl frequency và authority distribution.

type WPPost = {
  title: { rendered: string };
  slug: string;
  link: string;
  date: string;
  excerpt?: { rendered: string };
};

async function fetchLatestPosts(): Promise<WPPost[]> {
  try {
    const res = await fetch(
      "https://1phantram.com/blog/wp-json/wp/v2/posts?per_page=8&_fields=title,slug,link,date,excerpt&orderby=date&order=desc",
      { next: { revalidate: 21600 } } // 6h
    );
    if (!res.ok) return [];
    return (await res.json()) as WPPost[];
  } catch {
    return [];
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function blogPublicUrl(link: string): string {
  return link.replace(/^https:\/\/blog\.phantram\.online/i, "https://1phantram.com/blog");
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function LatestBlogPosts() {
  const posts = await fetchLatestPosts();
  if (posts.length === 0) return null;

  return (
    <section
      className="latest-blog-posts max-w-5xl mx-auto px-4 py-8"
      aria-label="Bài viết mới nhất từ blog 1phantram.com"
    >
      <h2 id="bai-viet-moi">📰 Bài Viết Mới Nhất Từ Blog</h2>
      <p>
        Bộ kiến thức tài chính cá nhân, công thức % và case-study thực tế cập nhật liên tục tại{" "}
        <a href="https://1phantram.com/blog/" rel="noopener">
          1phantram.com/blog
        </a>
        :
      </p>
      <ul className="latest-posts-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <a href={blogPublicUrl(p.link)} rel="noopener">
              {decodeEntities(p.title.rendered)}
            </a>
            <span className="post-date"> — {formatDate(p.date)}</span>
          </li>
        ))}
      </ul>
      <p>
        Xem toàn bộ kho bài viết tại{" "}
        <a href="https://1phantram.com/blog/" rel="noopener">
          blog 1phantram.com
        </a>{" "}
        (hơn 30 bài, cập nhật liên tục).
      </p>
    </section>
  );
}
