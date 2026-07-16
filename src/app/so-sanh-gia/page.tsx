import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/so-sanh-gia";
const NAME = "So sánh 2 mức giá - chênh lệch và %";
const TITLE = "So Sánh 2 Mức Giá - Tính Chênh Lệch % Online";
const DESC =
  "So sánh 2 giá: chênh lệch tuyệt đối + tỷ lệ % chênh. Mua bán nhà đất, xe, điện thoại, ship hàng — quyết định nhanh hơn khi rõ con số.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://1phantram.com${URL_PATH}`, siteName: "1phantram.com", images: [{ url: "/og-image.jpg", width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Cách so sánh 2 giá nào đúng nhất?", a: "Tính cả chênh lệch tuyệt đối (số tiền) và tương đối (%). VD: chênh 500k với đơn 5tr là 10% — nhiều; chênh 500k với đơn 50tr là 1% — ít. % cho cảm giác tỷ trọng tốt hơn." },
  { q: "Khi so sánh giá nhà 2 lựa chọn nên xem gì?", a: "Ngoài chênh lệch giá, xem chênh diện tích, chênh thuế phí, chênh chi phí sửa chữa. Quy đổi về giá/m² để so sánh fair. Công cụ này lo phần chênh giá; phần còn lại bạn tự đánh giá." },
  { q: "Mua điện thoại Apple chính hãng vs VN/A có nên không?", a: "Tùy chênh lệch %. Chênh <5% → mua chính hãng. Chênh >15% → cân nhắc tùy nhu cầu bảo hành. Công cụ này tính nhanh chênh % để quyết định." },
  { q: "Có nên ship hàng nội địa khi rẻ hơn ship quốc tế?", a: "Tính tổng giá + ship + thuế. Nếu chênh tổng <10% thường nên ship nội cho nhanh; chênh >25% chấp nhận đợi ship quốc tế." },
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
      <Calculator initialTab="compare" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">So sánh 2 mức giá — chênh lệch tuyệt đối và %</h1>
        <p className="mb-3">
          Khi đứng giữa 2 lựa chọn — 2 căn nhà, 2 chiếc xe, 2 nơi mua iPhone — bạn cần biết chênh lệch bao
          nhiêu tiền VÀ chênh bao nhiêu phần trăm. Công cụ <strong>so sánh giá</strong> này trả cả 2 chỉ số
          để bạn ra quyết định nhanh.
        </p>
        <p className="mb-4">
          Một mẹo: nếu chênh lệch &lt; 5% giá trị thì thường không đáng để mất nhiều thời gian cân đo; nên ưu
          tiên trải nghiệm, bảo hành, dịch vụ. Chênh &gt; 15% thì nên cân kỹ.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Chênh tuyệt đối = |Giá 1 − Giá 2|</strong></p>
          <p className="font-mono text-sm mt-1"><strong>% chênh = Chênh ÷ min(Giá 1, Giá 2) × 100</strong></p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>iPhone chính hãng 28tr vs xách tay 24tr:</strong> chênh 4tr ≈ <strong>+16.7%</strong> (đáng cân nhắc)</li>
          <li><strong>Căn hộ A 3.2 tỷ vs B 3.5 tỷ:</strong> chênh 300tr ≈ <strong>+9.4%</strong></li>
          <li><strong>Bún bò 50k vs 60k:</strong> chênh 10k = <strong>+20%</strong> (nhiều cho 1 món ăn)</li>
          <li><strong>Voucher Shopee 500k đơn 2tr vs Lazada 350k đơn 1.8tr:</strong> tự tính giá net để so</li>
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
