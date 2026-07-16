import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/scale-cong-thuc";
const NAME = "Scale công thức nấu ăn";
const TITLE = "Scale Công Thức Nấu Ăn - Nhân/Chia Cho Số Người";
const DESC =
  "Scale công thức nấu ăn: công thức cho 4 người → nấu cho 8 hay 12 người. Tự động nhân/chia tất cả nguyên liệu theo tỷ lệ. Cho mẹ bếp, đầu bếp, tiệc.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://1phantram.com${URL_PATH}`, siteName: "1phantram.com", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Scale công thức là gì?", a: "Là điều chỉnh tỷ lệ nguyên liệu khi nấu cho nhiều/ít người hơn so với công thức gốc. Ví dụ công thức cho 4 người, muốn nấu cho 6 thì nhân tất cả nguyên liệu × 1.5." },
  { q: "Tỉ lệ scale có tuyến tính 100% không?", a: "Đa số có, nhưng gia vị (muối, tiêu, đường) và bột nở thường KHÔNG scale 100%. Khi nhân gấp đôi nên scale gia vị chỉ 1.7-1.8 lần để tránh quá mặn/ngọt." },
  { q: "Nướng bánh có scale dễ không?", a: "Khó hơn nấu canh/xào. Bánh phụ thuộc tỷ lệ chính xác bột-trứng-đường-bơ. Scale khác kích thước khuôn còn phải điều chỉnh nhiệt độ + thời gian. An toàn nhất là nhân ÷ 2 hoặc x 2, x 3." },
  { q: "Đi tiệc cần nấu 20 người, công thức gốc 4 người?", a: "Tỷ lệ scale = 20/4 = 5. Nhân tất cả nguyên liệu × 5. Lưu ý: nồi đủ to, thời gian nấu lâu hơn (không scale tuyến tính), gia vị nêm dần tránh quá đậm." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://1phantram.com${URL_PATH}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://1phantram.com" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://1phantram.com${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="recipe-scale" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Scale công thức nấu ăn theo số người ăn</h1>
        <p className="mb-3">
          Công thức trên YouTube hay sách hướng dẫn thường ghi “cho 4 người”. Khi nấu cho gia đình 6 người
          hoặc làm tiệc 12-20 người, bạn cần <strong>scale lại toàn bộ nguyên liệu</strong> theo tỷ lệ.
        </p>
        <p className="mb-4">
          Công cụ này nhập số người gốc + số người muốn nấu, sau đó tự động nhân/chia mọi nguyên liệu theo
          hệ số. Phù hợp cho mẹ bếp gia đình, chủ tiệm ăn, đầu bếp tiệc cưới, tiệc team building công ty.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Hệ số scale = Số người mới ÷ Số người gốc</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Lượng mới = Lượng gốc × Hệ số scale</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Gia vị nên scale 0.7-0.8 × hệ số gốc khi nhân &gt; 2 lần.</p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Bò kho cho 4 người → 8 người:</strong> hệ số 2. Bò 500g → 1kg, hành 2 củ → 4 củ</li>
          <li><strong>Bánh chiffon 1 khuôn 18cm → 2 khuôn 22cm:</strong> hệ số ~1.5. Trứng 4 → 6, đường 80g → 120g</li>
          <li><strong>Lẩu thái 4 người → 10 người:</strong> hệ số 2.5. Cốt me 100g → 250g, ớt scale chỉ 1.8 ×</li>
          <li><strong>Sữa chua nhà 1L → 2L:</strong> hệ số 2. Đường 100g → 200g, men cái 2 hộp → 4 hộp</li>
        </ul>
        <h2 className="text-lg font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-base">{f.q}</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
          </div>
        ))}
      </article>
      <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
        © 2026 1phantram.com — Công cụ tính % miễn phí
      </footer>
    </>
  );
}
