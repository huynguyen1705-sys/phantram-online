import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/bao-nhieu-phan-tram";
const NAME = "Tính A là bao nhiêu phần trăm của B";
const TITLE = "Tính A Là Bao Nhiêu Phần Trăm Của B - Công Cụ %";
const DESC =
  "Tính số A bằng bao nhiêu % của số B. Nhập 2 số, ra ngay tỉ lệ phần trăm. VD: 80 là 40% của 200. Dùng cho điểm thi, tỷ lệ hoàn thành KPI, % chi tiêu.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `https://1phantram.com${URL_PATH}`,
    siteName: "1phantram.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/og-image.jpg"] },
};

const FAQ = [
  { q: "Cách tính A bằng bao nhiêu phần trăm của B?", a: "Lấy A chia B rồi nhân 100. Công thức: % = (A ÷ B) × 100. Ví dụ A = 80, B = 200 thì 80/200 × 100 = 40%." },
  { q: "Khi nào cần phép tính này?", a: "Tính tỷ lệ đỗ kỳ thi, % hoàn thành KPI tháng, tỷ lệ chi phí so với doanh thu, tỷ lệ khách quay lại, tỷ lệ hàng tồn kho so với hàng nhập." },
  { q: "Kết quả ra số thập phân thì làm sao?", a: "Tự nhiên — không phải lúc nào cũng tròn số. VD 7/15 = 46.67%. Bạn có thể làm tròn 1–2 chữ số tùy báo cáo, riêng tài chính nên giữ 2 số sau dấu phẩy." },
  { q: "A lớn hơn B thì có tính được không?", a: "Có. Kết quả sẽ lớn hơn 100%. Ví dụ A = 250, B = 200 thì 250/200 × 100 = 125% — nghĩa là A bằng 1.25 lần B." },
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
      <Calculator initialTab="what-percent" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính A là bao nhiêu phần trăm của B</h1>
        <p className="mb-3">
          Khi bạn biết 2 con số và cần biết số nhỏ chiếm bao nhiêu phần trăm số lớn — ví dụ tháng này
          chi 7 triệu trên thu nhập 15 triệu là bao nhiêu %, hay điểm thi 28/40 là bao nhiêu phần trăm —
          công cụ <strong>tính A là bao nhiêu % của B</strong> sẽ cho bạn đáp án tức thì.
        </p>
        <p className="mb-4">
          Đây là dạng tính ngược lại với “tính % của một số”. Ở đây bạn có sẵn kết quả và muốn biết tỷ lệ.
          Phù hợp khi làm báo cáo doanh thu, tính tỷ lệ chuyển đổi (conversion rate), hoặc đánh giá hoàn
          thành mục tiêu cá nhân.
        </p>
        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>% = (A ÷ B) × 100</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>A là phần, B là tổng. Kết quả là tỷ lệ phần trăm A chiếm trong B.</p>
        </div>
        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Điểm 28/40:</strong> 28 ÷ 40 × 100 = <strong>70%</strong></li>
          <li><strong>Chi 7 triệu / thu nhập 15 triệu:</strong> 7/15 × 100 ≈ <strong>46.67%</strong></li>
          <li><strong>Hoàn thành 850/1000 KPI:</strong> 850/1000 × 100 = <strong>85%</strong></li>
          <li><strong>50 khách / 1200 lượt xem (CR):</strong> 50/1200 × 100 ≈ <strong>4.17%</strong></li>
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
