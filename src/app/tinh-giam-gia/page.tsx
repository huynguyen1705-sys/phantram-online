import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/tinh-giam-gia";
const NAME = "Tính phần trăm giảm giá / Sale";
const TITLE = "Tính % Giảm Giá Sale Shopping - Máy Tính Discount";
const DESC =
  "Tính giá sau khi giảm hoặc tính % giảm khi shopping sale. Check black friday, sale 11.11, voucher kép. Tránh bị marketing lừa giá ảo. Miễn phí, nhanh.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  { q: "Cách tính % giảm giá đúng nhất?", a: "% giảm = (Giá gốc − Giá sale) ÷ Giá gốc × 100. Hoặc dùng công cụ: nhập giá gốc + % giảm sẽ ra giá sau giảm, hoặc nhập 2 giá ra % giảm." },
  { q: "Voucher giảm 50.000đ khác gì giảm 5%?", a: "Voucher cố định tốt hơn cho đơn nhỏ, % tốt hơn cho đơn lớn. Đơn 1 triệu: voucher 50k = 5%; nhưng đơn 200k thì voucher 50k = 25% — lợi hơn." },
  { q: "Sale ‘giảm 50% rồi giảm thêm 30%’ tổng giảm bao nhiêu?", a: "KHÔNG phải 80%. Tính: 100 × 0.5 × 0.7 = 35. Tức giá còn 35% giá gốc, tương đương GIẢM 65% — không phải 80%. Bẫy quen thuộc." },
  { q: "Có nên săn sale 11.11, Black Friday không?", a: "Nên check lịch sử giá 30 ngày trước trên các app theo dõi giá. Nhiều shop tăng giá rồi gắn mác sale để giả tạo ‘giảm sâu’ — dùng công cụ này check ngược giá gốc thật." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="discount" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính phần trăm giảm giá khi shopping sale</h1>
        <p className="mb-3">
          Mùa sale 11.11, 12.12, Black Friday, Tết — đâu là deal thật, đâu là chiêu marketing? Công cụ
          <strong> tính % giảm giá</strong> giúp bạn check ngay tại quầy hoặc khi xem online: nhập giá gốc
          + giá sale ra % giảm thật, hoặc nhập giá gốc + % giảm ra giá sau giảm.
        </p>
        <p className="mb-4">
          Đặc biệt hữu ích khi gặp các kiểu giảm chồng giảm (giảm % rồi giảm thêm voucher), giảm + tặng kèm,
          hoặc giảm chỉ áp dụng phần dư.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Giá sau giảm = Giá gốc × (1 − %/100)</strong></p>
          <p className="font-mono text-sm mt-1"><strong>% giảm = (Gốc − Sale) ÷ Gốc × 100</strong></p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>iPhone 25 triệu giảm 12%:</strong> 25.000.000 × 0.88 = <strong>22 triệu</strong></li>
          <li><strong>Áo 450k còn 270k:</strong> (450 − 270) ÷ 450 × 100 = <strong>40% giảm</strong></li>
          <li><strong>Sale 50% + voucher 100k cho đơn 1tr:</strong> 1.000.000 × 0.5 − 100.000 = <strong>400.000đ</strong> (giảm 60% tổng)</li>
          <li><strong>Combo sale 30% giảm 30%:</strong> 100 × 0.7 × 0.7 = 49 → giảm tổng <strong>51%</strong></li>
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
        © 2026 phantram.online — Công cụ tính % miễn phí
      </footer>
    </>
  );
}
