import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/lai-kep";
const NAME = "Tính lãi kép online";
const TITLE = "Tính Lãi Kép Online - Compound Interest Calculator";
const DESC =
  "Tính lãi kép: vốn × (1+lãi)^kỳ. Cho gửi tiết kiệm dài hạn, đầu tư chứng khoán, vàng. Quy tắc 72: 72÷lãi = năm tăng gấp đôi. Miễn phí.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Lãi kép là gì? Khác lãi đơn ra sao?", a: "Lãi kép tính lãi trên cả vốn gốc + lãi đã sinh ra trước đó. Lãi đơn chỉ tính trên vốn gốc. Sau nhiều năm lãi kép > lãi đơn rất nhiều — gọi là sức mạnh kỳ diệu của lãi kép." },
  { q: "Công thức lãi kép?", a: "A = P × (1 + r)^n. Trong đó P là vốn gốc, r là lãi suất mỗi kỳ (thập phân), n là số kỳ. Ví dụ 100tr × (1 + 0.07)^10 = 196.7tr sau 10 năm với lãi 7%/năm." },
  { q: "Quy tắc 72 là gì?", a: "Quy tắc 72: số năm cần để gấp đôi vốn ≈ 72 ÷ lãi suất (%). Lãi 6% → cần 12 năm. Lãi 9% → 8 năm. Lãi 12% → 6 năm. Công thức nhẩm cực hữu ích." },
  { q: "Nên gửi tiết kiệm có nhận lãi hàng tháng hay cuối kỳ?", a: "Cuối kỳ + tái tục tự động cho lãi kép thật sự. Lãi hàng tháng rút ra tiêu = lãi đơn. Với 500tr gửi 7%/năm 10 năm: lãi đơn 350tr, lãi kép ~483tr — chênh 133tr." },
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
      <nav className="max-w-7xl mx-auto px-4 lg:px-6 pt-4 text-sm" style={{ color: "var(--text-muted)" }}>
        <Link href="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">›</span>
        <span style={{ color: "var(--text)" }}>{NAME}</span>
      </nav>
      <Calculator initialTab="compound" singleTab />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính lãi kép — sức mạnh kỳ diệu của đầu tư dài hạn</h1>
        <p className="mb-3">
          Lãi kép là khái niệm Einstein gọi là “kỳ quan thứ 8 của thế giới”. Khác lãi đơn, lãi kép cộng lãi
          vào vốn gốc rồi tính lãi tiếp cho kỳ sau — tạo hiệu ứng cấp số nhân theo thời gian.
        </p>
        <p className="mb-4">
          Ứng dụng: tính tiền gửi tiết kiệm tái tục tự động, lãi suất đầu tư cổ phiếu dài hạn, lãi suất các
          quỹ ETF, mục tiêu hưu trí, tiền học cho con sau 18 năm.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>A = P × (1 + r)^n</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>P: vốn gốc, r: lãi/kỳ (thập phân), n: số kỳ.</p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Quy tắc 72 — bao lâu gấp đôi vốn?</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">Lãi suất/năm</th>
                <th className="px-3 py-2 text-right">Số năm gấp đôi</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1">3%</td><td className="px-3 py-1 text-right">24 năm</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">6%</td><td className="px-3 py-1 text-right">12 năm</td></tr>
              <tr><td className="px-3 py-1">8%</td><td className="px-3 py-1 text-right">9 năm</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">10%</td><td className="px-3 py-1 text-right">7.2 năm</td></tr>
              <tr><td className="px-3 py-1">12%</td><td className="px-3 py-1 text-right">6 năm</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">15%</td><td className="px-3 py-1 text-right">4.8 năm</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>100tr gửi lãi 7%/năm tái tục 10 năm:</strong> 100 × 1.07^10 ≈ <strong>196.7tr</strong></li>
          <li><strong>500tr lãi 8%/năm tái tục 20 năm:</strong> 500 × 1.08^20 ≈ <strong>2.33 tỷ</strong></li>
          <li><strong>50tr đầu tư cổ phiếu lãi 12% 15 năm:</strong> 50 × 1.12^15 ≈ <strong>273.7tr</strong></li>
          <li><strong>1 triệu/tháng tích lũy 25 năm lãi 8%:</strong> ~<strong>940 triệu</strong> (lãi kép + dòng tiền đều)</li>
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
