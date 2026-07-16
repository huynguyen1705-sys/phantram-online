import type { Metadata } from "next";
import Link from "next/link";
import EmbedBuilder from "@/components/EmbedBuilder";

const URL_PATH = "/widget-embed";
const TITLE = "Nhúng Máy Tính Phần Trăm Vào Website Của Bạn Miễn Phí";
const DESC =
  "Nhúng widget máy tính phần trăm, BMI, lãi kép, lương net, giảm giá… vào blog/website của bạn miễn phí. Hỗ trợ WordPress, Wix, Squarespace, Webflow, auto-resize iframe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://1phantram.com${URL_PATH}`,
    siteName: "1phantram.com",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "https://1phantram.com/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  {
    q: "Nhúng widget 1phantram.com có mất phí không?",
    a: "Hoàn toàn miễn phí và không giới hạn. Chỉ cần copy đoạn code iframe và dán vào website của bạn. Không cần đăng ký tài khoản, không cần API key.",
  },
  {
    q: "Widget có ảnh hưởng tốc độ tải trang của tôi không?",
    a: "Rất nhỏ. Iframe có thuộc tính loading=\"lazy\" — chỉ tải khi người dùng cuộn tới. Lighthouse score của trang gốc gần như không đổi.",
  },
  {
    q: "Tôi có thể tuỳ biến màu sắc widget không?",
    a: "Có 3 chế độ: Tự động (theo prefers-color-scheme của trình duyệt), Sáng, Tối. Truyền qua tham số ?theme=auto|light|dark trong URL iframe. Widget sẽ tự đổi màu nền/chữ tương ứng.",
  },
  {
    q: "Widget có hoạt động trên mobile không?",
    a: "Có. Iframe có style max-width:100% nên tự co theo khung chứa. Calculator bên trong responsive đầy đủ cho mobile, tablet và desktop.",
  },
  {
    q: "Có cần ghi nguồn không? Backlink thế nào?",
    a: "Widget tự hiển thị dòng \"Powered by 1phantram.com\" link về trang công cụ gốc — không cần thao tác thêm. Đây là backlink dofollow tự nhiên, có lợi cho cả 2 bên.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Phantram Embed Widget",
      url: `https://1phantram.com${URL_PATH}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      description: DESC,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://1phantram.com" },
        { "@type": "ListItem", position: 2, name: "Nhúng widget", item: `https://1phantram.com${URL_PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>%</div>
              <div>
                <p className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>Phần Trăm</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>1phantram.com</p>
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-xl px-3 h-9 inline-flex items-center text-sm font-semibold transition-all active:scale-95"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              ← Về máy tính
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-1.5">›</span>
            <span>Nhúng widget</span>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-10">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold mb-3" style={{ color: "var(--text)" }}>
              🧩 Nhúng calculator 1phantram.com vào website của bạn
            </h1>
            <p className="text-base lg:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Chọn công cụ → tuỳ chỉnh giao diện → copy 1 đoạn code → dán vào blog, website, WordPress…
              Miễn phí, không giới hạn, không cần đăng ký.
            </p>
          </section>

          {/* Builder */}
          <section
            className="rounded-2xl p-5 lg:p-6 border shadow-sm"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <EmbedBuilder />
          </section>

          {/* Article SEO */}
          <article className="prose-content rounded-2xl p-5 lg:p-8 border" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}>
            <h2 className="text-xl lg:text-2xl font-bold mb-3">Tại sao nên nhúng widget tính phần trăm?</h2>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Nếu bạn đang viết blog về tài chính cá nhân, giáo dục, mua sắm hay sức khoẻ — một công cụ tính
              <strong> phần trăm</strong>, <strong>lãi kép</strong>, <strong>BMI</strong> hay
              <strong> giảm giá</strong> ngay trong bài viết giúp người đọc <strong>ở lại lâu hơn</strong>,
              tự thử số liệu thay vì bỏ trang đi tìm máy tính khác. Đây là tín hiệu engagement Google đánh giá rất cao.
            </p>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Phantram.online cung cấp 16 widget calculator miễn phí dưới dạng iframe — đã tối ưu mobile,
              hỗ trợ <strong>auto-resize chiều cao</strong> qua postMessage, có chế độ
              <strong> sáng/tối</strong> tự match màu trang gốc.
            </p>

            <h2 className="text-xl lg:text-2xl font-bold mb-3 mt-6">Hướng dẫn nhúng theo nền tảng</h2>

            <h3 className="text-lg font-semibold mb-2">📝 WordPress (Gutenberg / Block editor)</h3>
            <ol className="list-decimal pl-5 mb-4 space-y-1" style={{ color: "var(--text-muted)" }}>
              <li>Mở bài viết → bấm <strong>+ Add Block</strong>.</li>
              <li>Chọn block <strong>Custom HTML</strong> (HTML tuỳ chỉnh).</li>
              <li>Dán đoạn code iframe ở trên vào.</li>
              <li>Bấm <strong>Preview</strong> để xem trước → Update.</li>
            </ol>

            <h3 className="text-lg font-semibold mb-2">🎨 Wix</h3>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Editor Wix: <strong>Add → Embed Code → Embed HTML</strong> → dán code iframe. Kéo thả vị trí
              mong muốn. Phiên bản free cho phép tối đa 1 embed/trang.
            </p>

            <h3 className="text-lg font-semibold mb-2">🟦 Squarespace</h3>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Mở trang cần chèn → <strong>Add Block → Code Block</strong> → đặt mode <strong>HTML</strong>
              → dán iframe. Bỏ check &quot;Display Source&quot; → Apply.
            </p>

            <h3 className="text-lg font-semibold mb-2">⚡ Webflow</h3>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Drag <strong>Embed</strong> element từ Add Panel → paste iframe → Save &amp; Close → Publish.
              Webflow tự thêm preview ngay trong Designer.
            </p>

            <h3 className="text-lg font-semibold mb-2">🌐 HTML / static site</h3>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>
              Dán đoạn iframe vào bất kỳ vị trí nào trong file <code>.html</code>. Nếu muốn auto-resize,
              dùng tab <strong>HTML + auto-resize</strong> — đoạn script đi kèm sẽ lắng nghe sự kiện
              <code>message</code> và set <code>height</code> cho iframe.
            </p>

            <h2 className="text-xl lg:text-2xl font-bold mb-3 mt-6">Use case phổ biến</h2>
            <ul className="list-disc pl-5 mb-4 space-y-1" style={{ color: "var(--text-muted)" }}>
              <li><strong>Blog tài chính cá nhân:</strong> nhúng <em>Lãi kép</em>, <em>Lương net thuế TNCN</em> trong bài hướng dẫn tiết kiệm.</li>
              <li><strong>Trang giáo dục / luyện thi:</strong> nhúng <em>Tính %</em>, <em>Bao nhiêu %</em>, <em>% tăng giảm</em> để học sinh tự kiểm tra bài.</li>
              <li><strong>Shop online / affiliate site:</strong> nhúng <em>Tính giảm giá</em>, <em>Soi sale Shopee</em>, <em>So sánh 2 giá</em>.</li>
              <li><strong>Blog sức khoẻ / gym:</strong> nhúng <em>BMI + TDEE</em> trong bài về giảm cân an toàn.</li>
              <li><strong>Food blog / cookbook:</strong> nhúng <em>Scale công thức</em> trong recipe nhân/chia khẩu phần.</li>
            </ul>

            <h2 className="text-xl lg:text-2xl font-bold mb-3 mt-6">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details key={f.q} className="rounded-xl p-4 border" style={{ borderColor: "var(--border)" }}>
                  <summary className="font-semibold cursor-pointer">{f.q}</summary>
                  <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
                </details>
              ))}
            </div>
          </article>
        </main>

        <footer className="text-center py-6 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 1phantram.com — Công cụ tính % miễn phí
        </footer>
      </div>
    </>
  );
}
