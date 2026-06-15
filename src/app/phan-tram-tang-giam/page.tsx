import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/phan-tram-tang-giam";
const NAME = "Tính phần trăm tăng giảm giữa 2 số";
const TITLE = "Tính % Tăng Giảm Giữa 2 Số - Công Cụ Phần Trăm";
const DESC =
  "Tính phần trăm tăng giảm giữa giá trị cũ và mới. Dùng cho biến động giá xăng, giá vàng, doanh thu, KPI. Dương = tăng, âm = giảm. Miễn phí, không quảng cáo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://phantram.online${URL_PATH}`,
    siteName: "phantram.online",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Công thức tính % tăng giảm như thế nào?", a: "% thay đổi = (Giá trị mới − Giá trị cũ) ÷ Giá trị cũ × 100. Kết quả dương là tăng, âm là giảm. Mẫu số luôn là giá trị cũ." },
  { q: "Tại sao chia cho giá trị cũ chứ không phải giá trị mới?", a: "Vì giá trị cũ là điểm xuất phát (baseline). Chia cho cũ cho biết mức biến động so với gốc. Chia cho mới sẽ cho con số khác và thường gây hiểu sai." },
  { q: "Giá vàng từ 75 triệu lên 80 triệu/lượng là tăng bao nhiêu %?", a: "(80 − 75) ÷ 75 × 100 = 6.67%. Lưu ý không phải 5% như cách tính sai 5/100." },
  { q: "% giảm 50% rồi tăng 50% có về điểm gốc không?", a: "KHÔNG. 100 giảm 50% còn 50, 50 tăng 50% chỉ lên 75 — vẫn thiếu 25%. Đây là bẫy quen thuộc khi đọc tin sale ‘giảm rồi giảm thêm’." },
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
      <Calculator initialTab="change" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính phần trăm tăng giảm giữa 2 giá trị</h1>
        <p className="mb-3">
          Khi bạn cần biết một con số đã thay đổi bao nhiêu phần trăm so với trước — ví dụ giá xăng tuần này
          so với tuần trước, doanh thu quý này so với quý trước, hay điểm thi cuối kỳ so với giữa kỳ — công
          cụ <strong>tính % tăng giảm</strong> này sẽ cho ra kết quả ngay.
        </p>
        <p className="mb-4">
          Kết quả dương nghĩa là tăng, âm là giảm. Đây là phép tính nền tảng cho mọi báo cáo tài chính,
          phân tích biến động giá hàng hóa, đánh giá tăng trưởng kinh doanh.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>% thay đổi = (Mới − Cũ) ÷ Cũ × 100</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Dương = tăng. Âm = giảm. Luôn chia cho giá trị CŨ.</p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Giá xăng 22.000 → 24.000đ/lít:</strong> (24.000 − 22.000) ÷ 22.000 × 100 ≈ <strong>+9.09%</strong></li>
          <li><strong>Doanh thu 850 triệu → 1.2 tỷ:</strong> +<strong>41.18%</strong> (tăng mạnh)</li>
          <li><strong>Cân nặng 72kg → 68kg:</strong> <strong>−5.56%</strong> (giảm)</li>
          <li><strong>VN-Index 1.250 → 1.100:</strong> <strong>−12%</strong></li>
        </ul>
        <h2 className="text-lg font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-base">{f.q}</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
          </div>
        ))}
      </article>
    </>
  );
}
