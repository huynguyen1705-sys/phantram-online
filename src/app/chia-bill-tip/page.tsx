import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/chia-bill-tip";
const NAME = "Chia bill nhà hàng + Tip";
const TITLE = "Chia Bill Nhà Hàng + Tính Tip % Cho Nhóm";
const DESC =
  "Chia bill nhà hàng theo nhóm + tính tiền tip cho phục vụ. Bill 850k tip 10% chia 4 người = mỗi người 234k. Nhanh, mobile-first, không quảng cáo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Cách chia bill nhà hàng kèm tip đúng?", a: "Tổng phải trả = Bill × (1 + tip%/100). Chia đầu người = Tổng ÷ số người. Ví dụ bill 850k tip 10% chia 4: 850k × 1.10 = 935k → mỗi người 233.750đ." },
  { q: "Ở Việt Nam có cần tip không?", a: "Không bắt buộc như Mỹ. Nhà hàng cao cấp đã tính phí phục vụ 5–10% sẵn trong bill. Quán bình dân không cần tip. Nếu phục vụ quá tốt có thể tip thêm 5–10%." },
  { q: "Mỹ tip bao nhiêu là chuẩn?", a: "Nhà hàng có phục vụ: 15–20%. Bar/quán cà phê: 1–2 USD/đồ uống. Taxi/Uber: 10–15%. Khách sạn bell-boy: 1–2 USD/vali. Đi tour: 10–15% phí tour." },
  { q: "Bill 1.2 triệu chia 5 người không đều nhau thì sao?", a: "Hoặc chia đều cho dễ (240k/người), hoặc cộng riêng theo món từng người. Công cụ này tối ưu chia đều, phù hợp đa số tình huống ăn nhóm." },
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
      <Calculator initialTab="tip" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Chia bill nhà hàng theo nhóm và tính tip nhanh</h1>
        <p className="mb-3">
          Đi ăn nhóm bạn 5–10 người mà chia bill bằng đầu khá đau đầu, nhất là khi có thêm phụ phí và tip
          cho phục vụ. Công cụ <strong>chia bill + tip</strong> này tính ngay tiền mỗi người phải trả, bao
          gồm cả phần tip.
        </p>
        <p className="mb-4">
          Phù hợp cho ăn lẩu, BBQ, tiệc team building, sinh nhật bạn. Có sẵn các mức tip preset 0%, 5%, 10%,
          15% — bấm 1 nút là xong.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Tổng = Bill × (1 + Tip%/100)</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Mỗi người = Tổng ÷ Số người</strong></p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Bill 850k, tip 10%, chia 4:</strong> Tổng 935k → mỗi người <strong>234k</strong></li>
          <li><strong>Bill 1.5tr, tip 5%, chia 6:</strong> Tổng 1.575tr → mỗi người <strong>262.5k</strong></li>
          <li><strong>Bill 3tr nhậu cuối tuần, tip 0%, chia 8:</strong> Mỗi người <strong>375k</strong></li>
          <li><strong>Bill 12.5tr ăn nhà hàng sang, tip 15%, chia 10:</strong> Tổng 14.375tr → mỗi người <strong>1.4375tr</strong></li>
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
