import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/lai-suat-don";
const NAME = "Tính lãi suất đơn";
const TITLE = "Tính Lãi Suất Đơn Online - Vốn × Lãi × Thời Gian";
const DESC =
  "Tính lãi suất đơn: tiền lãi = Vốn × % × Thời gian. Dùng cho cho vay ngắn hạn, gửi tiết kiệm dưới 1 năm, vay tín chấp đơn giản. Miễn phí.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Lãi đơn là gì, khác lãi kép thế nào?", a: "Lãi đơn chỉ tính lãi trên vốn gốc, không tính lãi trên lãi. Mỗi kỳ lãi như nhau. Lãi kép có thêm lãi trên lãi cũ, tăng theo cấp số nhân. Lãi đơn phù hợp khoản vay/gửi ngắn." },
  { q: "Công thức lãi đơn?", a: "Tiền lãi = Vốn × Lãi suất × Thời gian. Lãi suất tính theo năm thì thời gian cũng tính năm. Tổng tiền cuối = Vốn + Lãi." },
  { q: "Gửi 100tr lãi 6%/năm trong 6 tháng được bao nhiêu?", a: "100.000.000 × 0.06 × 0.5 = 3.000.000đ tiền lãi. Tổng tiền cuối kỳ = 103tr. Đó là cách ngân hàng tính kỳ hạn 6 tháng đơn giản." },
  { q: "Cho bạn vay 10tr 1%/tháng trong 3 tháng?", a: "Quy về cùng đơn vị: lãi 1%/tháng = 12%/năm. 10tr × 0.12 × 0.25 năm = 300k. Hoặc tính trực tiếp: 10tr × 1% × 3 tháng = 300k. Như nhau." },
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
      <Calculator initialTab="interest" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính lãi suất đơn — vốn × lãi × thời gian</h1>
        <p className="mb-3">
          Lãi suất đơn là phép tính đơn giản nhất trong tài chính: tiền lãi chỉ tính dựa trên vốn gốc ban
          đầu, không cộng dồn vào kỳ sau. Phù hợp cho khoản vay/gửi ngắn hạn, không tái đầu tư.
        </p>
        <p className="mb-4">
          Ngân hàng tại Việt Nam thường dùng lãi đơn cho các kỳ hạn ngắn (1, 3, 6 tháng) không gửi quay
          vòng. Cho vay tín chấp giữa cá nhân cũng đa số tính lãi đơn cho minh bạch.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Lãi = Vốn × Lãi suất × Thời gian</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Tổng cuối = Vốn + Lãi</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Lãi suất và thời gian phải cùng đơn vị (cùng theo năm hoặc tháng).</p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Gửi 200tr, lãi 6.5%/năm, 12 tháng:</strong> Lãi = 200tr × 0.065 × 1 = <strong>13 triệu</strong></li>
          <li><strong>Gửi 50tr, lãi 5%/năm, 3 tháng:</strong> 50tr × 0.05 × 0.25 = <strong>625.000đ</strong></li>
          <li><strong>Cho vay 100tr lãi 1%/tháng, 6 tháng:</strong> 100tr × 0.06 = <strong>6 triệu</strong> tiền lãi</li>
          <li><strong>Gửi USD 5.000$, lãi 0.5%/năm, 2 năm:</strong> 5.000 × 0.005 × 2 = <strong>50 USD</strong></li>
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
