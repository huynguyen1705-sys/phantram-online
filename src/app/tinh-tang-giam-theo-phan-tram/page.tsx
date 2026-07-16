import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/tinh-tang-giam-theo-phan-tram";
const NAME = "Tăng/giảm theo phần trăm cho trước";
const TITLE = "Tăng Giảm 1 Số Theo % Cho Trước - Tính Online";
const DESC =
  "Tăng hoặc giảm 1 số theo phần trăm cho trước. VD: 500.000đ tăng 15% = 575.000đ. Dùng tính giá sau VAT, lương sau thưởng, tăng KPI mục tiêu.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://1phantram.com${URL_PATH}`, siteName: "1phantram.com", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Cách tăng/giảm 1 số theo phần trăm?", a: "Tăng: Kết quả = Số gốc × (1 + %/100). Giảm: Kết quả = Số gốc × (1 − %/100). Ví dụ 500.000 tăng 15%: 500.000 × 1.15 = 575.000đ." },
  { q: "Phép tính này khác gì với ‘tính % của một số’?", a: "Ở đây bạn ra giá trị MỚI sau khi tăng/giảm — đã cộng/trừ phần %. Còn ‘% của một số’ chỉ ra riêng phần %, chưa cộng vào gốc." },
  { q: "Lương 12 triệu tăng 8% là bao nhiêu?", a: "12.000.000 × 1.08 = 12.960.000đ. Phần tăng thêm là 960.000đ. Đây là cách tính lương sau review thưởng cuối năm thường gặp." },
  { q: "Tính giá đã bao gồm VAT 10%?", a: "Nếu là giá chưa VAT 100.000đ thì giá đã VAT = 100.000 × 1.10 = 110.000đ. Đây là phép tăng theo %, không phải nhân chia thông thường." },
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
      <Calculator initialTab="increase-decrease" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tăng/giảm 1 số theo phần trăm cho trước</h1>
        <p className="mb-3">
          Cần tính giá sau khi tăng VAT 10%, lương sau khi tăng lương 8%, hay giá nhà sau khi giảm 5% thương
          lượng — đều dùng phép tính này. Nhập số gốc, chọn tăng hay giảm, nhập %, kết quả hiện ngay.
        </p>
        <p className="mb-4">
          Khác với ‘% của một số’ chỉ ra phần %, công cụ này trả về <strong>giá trị mới đã cộng/trừ</strong>.
          Nhanh, không cần nhẩm 2 bước.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Tăng: Mới = Cũ × (1 + %/100)</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Giảm: Mới = Cũ × (1 − %/100)</strong></p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>500.000đ tăng 15%:</strong> 500.000 × 1.15 = <strong>575.000đ</strong></li>
          <li><strong>Lương 12 triệu tăng 8%:</strong> 12.000.000 × 1.08 = <strong>12.96 triệu</strong></li>
          <li><strong>Giá nhà 3 tỷ giảm 5%:</strong> 3.000.000.000 × 0.95 = <strong>2.85 tỷ</strong></li>
          <li><strong>Giá chưa VAT 100k + 10%:</strong> 100.000 × 1.10 = <strong>110.000đ</strong></li>
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
