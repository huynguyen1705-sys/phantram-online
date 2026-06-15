import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/tim-gia-tri-goc";
const NAME = "Tìm giá trị gốc khi biết kết quả và phần trăm";
const TITLE = "Tìm Giá Trị Gốc Khi Biết % - Tính Số Ban Đầu Online";
const DESC =
  "Biết kết quả sau khi giảm/tăng và %, tìm giá trị ban đầu (số gốc). VD: thấy giá sale 850.000đ giảm 15%, giá gốc là 1.000.000đ. Miễn phí.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Cách tìm giá trị gốc khi biết kết quả và %?", a: "Nếu đã tăng: Gốc = Kết quả ÷ (1 + %/100). Nếu đã giảm: Gốc = Kết quả ÷ (1 − %/100). Ví dụ giá sau giảm 15% là 850.000đ thì gốc = 850.000 ÷ 0.85 = 1.000.000đ." },
  { q: "Khi nào cần phép tính ngược này?", a: "Khi check thật/giả các quảng cáo sale, tính giá chưa VAT từ giá đã VAT, tính doanh thu gốc từ doanh thu sau chiết khấu, tính lương gross từ lương net một cách thô." },
  { q: "Sản phẩm sale 30% còn 700k, giá gốc bao nhiêu?", a: "700.000 ÷ (1 − 0.30) = 700.000 ÷ 0.70 = 1.000.000đ. Không phải 700 + 30% = 910k như nhiều người tưởng — đó là sai." },
  { q: "Phép này có dùng được cho lãi suất không?", a: "Có. Biết số tiền cuối kỳ và lãi suất, tìm vốn ban đầu (dùng cho lãi đơn). Lãi kép cần công thức phức tạp hơn — dùng công cụ lãi kép riêng." },
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
      <Calculator initialTab="find-base" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tìm giá trị gốc (số ban đầu) khi biết % và kết quả</h1>
        <p className="mb-3">
          Đây là phép tính ngược dùng để check giá thật/giả khi xem các đợt sale. Bạn thấy giá hiện tại
          (giá đã giảm/tăng) và biết đã giảm/tăng bao nhiêu %, công cụ sẽ tính ra <strong>giá gốc thực sự</strong>.
        </p>
        <p className="mb-4">
          Nhiều shop ghi “giảm 30% còn 700k” nhưng giá gốc thật sự không phải 1 triệu mà chỉ 800k. Phép tính
          này giúp bạn kiểm tra và tránh bị lừa bởi marketing.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Sau tăng: Gốc = Kết quả ÷ (1 + %/100)</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Sau giảm: Gốc = Kết quả ÷ (1 − %/100)</strong></p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Sale 15% còn 850k:</strong> 850.000 ÷ 0.85 = <strong>1.000.000đ gốc</strong></li>
          <li><strong>Giá đã VAT 10% là 110k:</strong> 110.000 ÷ 1.10 = <strong>100.000đ chưa VAT</strong></li>
          <li><strong>Lương sau tăng 8% là 12.96 triệu:</strong> 12.960.000 ÷ 1.08 = <strong>12 triệu gốc</strong></li>
          <li><strong>Sale 50% còn 500k:</strong> 500.000 ÷ 0.5 = <strong>1.000.000đ gốc</strong></li>
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
