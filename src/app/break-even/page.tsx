import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/break-even";
const NAME = "Tính điểm hoàn vốn (Break-even)";
const TITLE = "Tính Điểm Hoàn Vốn Break-even - BEP & % Bù Lỗ";
const DESC =
  "Tính break-even: số lượng bán cần để hoà vốn, % cần lãi để bù lỗ, thời gian hoàn vốn đầu tư. Cho người kinh doanh, đầu tư cổ phiếu, mở quán cafe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  { q: "Break-even point (BEP) là gì?", a: "Điểm hoà vốn — mức doanh số mà tổng doanh thu = tổng chi phí (cố định + biến đổi). Trên BEP bắt đầu có lãi, dưới BEP đang lỗ. Là KPI sống còn của mọi mô hình kinh doanh." },
  { q: "Lỗ 50% thì cần lãi bao nhiêu % để bù?", a: "Cần lãi 100% — không phải 50% như nhiều người nghĩ. Ví dụ 100 → giảm 50% còn 50 → muốn về 100 phải tăng 50/50 = 100%. Đây là bẫy đầu tư chứng khoán quen thuộc." },
  { q: "Công thức BEP cho kinh doanh?", a: "BEP (số lượng) = Chi phí cố định ÷ (Giá bán − Chi phí biến đổi/sp). Ví dụ quán cafe chi phí cố định 30tr/tháng, mỗi ly bán 35k chi phí 15k → BEP = 30tr ÷ 20k = 1.500 ly/tháng = 50 ly/ngày." },
  { q: "Thời gian hoàn vốn đầu tư tính sao?", a: "Đơn giản: Thời gian = Vốn đầu tư ÷ Lợi nhuận/năm. Mở quán đầu tư 500tr, lãi 15tr/tháng → 500/180 ≈ 2.78 năm. Tính kỹ hơn cần thêm chiết khấu dòng tiền (DCF)." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "BusinessApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="breakeven" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính điểm hoàn vốn Break-even cho kinh doanh & đầu tư</h1>
        <p className="mb-3">
          Break-even point (BEP) là cột mốc tài chính quan trọng nhất khi khởi nghiệp: dưới điểm đó bạn đang
          đốt vốn, vượt qua nó mới bắt đầu sinh lời. Công cụ này tính 3 dạng phổ biến: <strong>BEP bán
          hàng</strong>, <strong>% bù lỗ chứng khoán</strong>, và <strong>thời gian hoàn vốn</strong>.
        </p>
        <p className="mb-4">
          Đặc biệt hữu ích cho người chuẩn bị mở quán cafe, trà sữa, shop online, hoặc đang lỗ cổ phiếu cần
          biết phải lãi bao nhiêu % mới về vốn.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>BEP (số lượng) = CP cố định ÷ (Giá bán − CP biến đổi/sp)</strong></p>
          <p className="font-mono text-sm mt-1"><strong>% bù lỗ = (Lỗ% ÷ (100 − Lỗ%)) × 100</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Thời gian hoàn vốn = Vốn ÷ Lợi nhuận/kỳ</strong></p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Bảng % cần lãi để bù lỗ</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">Đã lỗ</th>
                <th className="px-3 py-2 text-right">Cần lãi để hoà vốn</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1">10%</td><td className="px-3 py-1 text-right">11.1%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">20%</td><td className="px-3 py-1 text-right">25%</td></tr>
              <tr><td className="px-3 py-1">30%</td><td className="px-3 py-1 text-right">42.9%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">50%</td><td className="px-3 py-1 text-right">100%</td></tr>
              <tr><td className="px-3 py-1">70%</td><td className="px-3 py-1 text-right">233%</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">90%</td><td className="px-3 py-1 text-right">900%</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Quán cafe CP cố định 30tr, ly 35k - 15k:</strong> BEP = 1.500 ly/tháng = <strong>50 ly/ngày</strong></li>
          <li><strong>Cổ phiếu lỗ 30%:</strong> Cần lãi <strong>42.9%</strong> để về vốn</li>
          <li><strong>Mở shop đầu tư 200tr, lãi 8tr/tháng:</strong> Hoàn vốn <strong>25 tháng (~2.1 năm)</strong></li>
          <li><strong>Đầu tư BĐS 3 tỷ, cho thuê 25tr/tháng:</strong> 3.000 ÷ 300 = <strong>10 năm</strong> hoàn vốn</li>
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
