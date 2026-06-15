import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/luong-net";
const NAME = "Tính lương Net sau thuế TNCN 2026";
const TITLE = "Tính Lương Net 2026 Sau Thuế TNCN + BHXH - Online";
const DESC =
  "Tính lương Net 2026 từ lương Gross. Trừ BHXH 8% + BHYT 1.5% + BHTN 1% + thuế TNCN lũy tiến 7 bậc. Kèm giảm trừ gia cảnh 11 triệu + 4.4 triệu/người phụ thuộc.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  { q: "Cách tính lương Net từ Gross 2026?", a: "Net = Gross − BHXH (8%) − BHYT (1.5%) − BHTN (1%) − Thuế TNCN. Thuế TNCN tính lũy tiến 7 bậc trên thu nhập chịu thuế = Gross − bảo hiểm − 11tr (bản thân) − 4.4tr × số người phụ thuộc." },
  { q: "7 bậc thuế TNCN Việt Nam là gì?", a: "Bậc 1: ≤5tr/tháng = 5%. Bậc 2: 5-10tr = 10%. Bậc 3: 10-18tr = 15%. Bậc 4: 18-32tr = 20%. Bậc 5: 32-52tr = 25%. Bậc 6: 52-80tr = 30%. Bậc 7: >80tr = 35%." },
  { q: "Mức giảm trừ gia cảnh 2026?", a: "Bản thân: 11 triệu/tháng (132 triệu/năm). Mỗi người phụ thuộc: 4.4 triệu/tháng (52.8 triệu/năm). Áp dụng từ 1/7/2020 đến nay vẫn còn hiệu lực 2026." },
  { q: "Lương Gross 20 triệu thì Net bao nhiêu?", a: "BHXH+BHYT+BHTN = 20tr × 10.5% = 2.1tr. Thu nhập chịu thuế = 20 − 2.1 − 11 = 6.9tr. Thuế TNCN: 5tr × 5% + 1.9tr × 10% = 440k. Lương Net ≈ 17.46 triệu/tháng (chưa người phụ thuộc)." },
  { q: "Lương Gross 50 triệu Net khoảng bao nhiêu?", a: "Bảo hiểm: 50tr × 10.5% = 5.25tr. Chịu thuế: 50 − 5.25 − 11 = 33.75tr. Thuế ≈ 4.937tr. Net ≈ 39.81tr/tháng (chưa người phụ thuộc). Có 1 phụ thuộc Net ≈ 40.69tr." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "FinanceApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="salary-tax" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính lương Net 2026 sau thuế TNCN và BHXH</h1>
        <p className="mb-3">
          Lương Net là số tiền thực nhận sau khi đã trừ bảo hiểm bắt buộc và thuế thu nhập cá nhân (TNCN).
          Công cụ này áp dụng <strong>luật thuế TNCN hiện hành 2026</strong> tại Việt Nam với 7 bậc lũy tiến,
          mức giảm trừ gia cảnh 11 triệu cho bản thân + 4.4 triệu cho mỗi người phụ thuộc.
        </p>
        <p className="mb-4">
          Dùng khi đàm phán lương, so sánh offer giữa các công ty, kiểm tra phiếu lương cuối tháng, lên kế
          hoạch chi tiêu cá nhân.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Bảng 7 bậc thuế TNCN 2026</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">Bậc</th>
                <th className="px-3 py-2 text-left">Thu nhập tính thuế/tháng</th>
                <th className="px-3 py-2 text-right">Thuế suất</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1">1</td><td className="px-3 py-1">Đến 5 triệu</td><td className="px-3 py-1 text-right">5%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">2</td><td className="px-3 py-1">Trên 5 – 10 triệu</td><td className="px-3 py-1 text-right">10%</td></tr>
              <tr><td className="px-3 py-1">3</td><td className="px-3 py-1">Trên 10 – 18 triệu</td><td className="px-3 py-1 text-right">15%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">4</td><td className="px-3 py-1">Trên 18 – 32 triệu</td><td className="px-3 py-1 text-right">20%</td></tr>
              <tr><td className="px-3 py-1">5</td><td className="px-3 py-1">Trên 32 – 52 triệu</td><td className="px-3 py-1 text-right">25%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">6</td><td className="px-3 py-1">Trên 52 – 80 triệu</td><td className="px-3 py-1 text-right">30%</td></tr>
              <tr><td className="px-3 py-1">7</td><td className="px-3 py-1">Trên 80 triệu</td><td className="px-3 py-1 text-right">35%</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức tính Net từ Gross</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm">Bảo hiểm = Gross × 10.5% (BHXH 8 + BHYT 1.5 + BHTN 1)</p>
          <p className="font-mono text-sm mt-1">Thu nhập chịu thuế = Gross − Bảo hiểm − 11tr − 4.4tr × phụ thuộc</p>
          <p className="font-mono text-sm mt-1">Thuế TNCN: tính lũy tiến 7 bậc trên TNCT</p>
          <p className="font-mono text-sm mt-1"><strong>Net = Gross − Bảo hiểm − Thuế TNCN</strong></p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Gross 15tr, 0 phụ thuộc:</strong> Net ≈ <strong>13.43 triệu</strong></li>
          <li><strong>Gross 20tr, 0 phụ thuộc:</strong> Net ≈ <strong>17.46 triệu</strong></li>
          <li><strong>Gross 30tr, 1 phụ thuộc:</strong> Net ≈ <strong>25.05 triệu</strong></li>
          <li><strong>Gross 50tr, 2 phụ thuộc:</strong> Net ≈ <strong>41.57 triệu</strong></li>
          <li><strong>Gross 100tr, 0 phụ thuộc:</strong> Net ≈ <strong>72.48 triệu</strong></li>
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
