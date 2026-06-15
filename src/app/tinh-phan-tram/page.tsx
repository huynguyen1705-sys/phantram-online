import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/tinh-phan-tram";
const NAME = "Tính phần trăm của một số";
const TITLE = "Tính Phần Trăm Của Một Số Online Nhanh - Máy Tính %";
const DESC =
  "Công cụ tính phần trăm online miễn phí. Nhập % và giá trị, ra kết quả ngay. VD: 30% của 200.000đ = 60.000đ. Chạy trên mobile, không quảng cáo.";

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

const FAQ: { q: string; a: string }[] = [
  {
    q: "Cách tính phần trăm của một số như thế nào?",
    a: "Lấy số gốc nhân với phần trăm rồi chia 100. Công thức: Kết quả = (% × Số) ÷ 100. Ví dụ 30% của 200.000đ = 200.000 × 30 ÷ 100 = 60.000đ.",
  },
  {
    q: "Làm sao tính nhanh 10%, 20%, 50% trong đầu?",
    a: "10% = chia 10 (200.000 → 20.000). 20% = lấy 10% nhân đôi (40.000). 50% = chia 2 (100.000). Các mức khác dùng công cụ này để chính xác.",
  },
  {
    q: "Có thể tính phần trăm số tiền lớn hàng tỷ đồng không?",
    a: "Có. Công cụ này hỗ trợ số rất lớn và tự động hiển thị theo định dạng triệu/tỷ cho dễ đọc, ví dụ 8% của 1.500.000.000đ = 120 triệu.",
  },
  {
    q: "Phần trăm dùng nhiều nhất trong tình huống nào?",
    a: "Tính tiền cọc nhà đất 10–20%, tiền hoa hồng môi giới 1–3%, chiết khấu shop bán hàng, tiền thưởng KPI theo % lương, lãi suất tiết kiệm hàng tháng.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: NAME,
      url: `https://phantram.online${URL_PATH}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" },
        { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="percent-of" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính phần trăm của một số online</h1>
        <p className="mb-3">
          Tính phần trăm (%) là phép toán thường gặp nhất trong đời sống hằng ngày: từ chi tiêu, cọc nhà,
          tiền boa, đến lãi ngân hàng và thưởng KPI. Công cụ <strong>tính phần trăm của một số</strong> này
          cho phép bạn nhập % và giá trị, kết quả hiển thị ngay khi gõ, không cần nút Submit. Toàn bộ tính
          toán chạy ngay trên trình duyệt, không gửi dữ liệu đi đâu cả.
        </p>
        <p className="mb-4">
          Phù hợp cho mọi tình huống cần nhanh: tính tiền cọc thuê nhà (thường 10% giá hợp đồng năm), tiền
          hoa hồng môi giới bất động sản (1–2%), giảm giá flash sale, chia tiền tip nhà hàng theo nhóm,
          hoặc đơn giản là kiểm tra hóa đơn điện nước có đúng giá điều chỉnh không.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức tính phần trăm</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Kết quả = (Phần trăm × Số gốc) ÷ 100</strong></p>
          <p className="font-mono text-sm mt-1">hoặc: <strong>Kết quả = Số gốc × (Phần trăm / 100)</strong></p>
        </div>
        <p className="mb-3">
          Cả 2 cách đều cho ra kết quả như nhau. Trong thực tế nhiều người chia trước cho 100 ra số thập phân
          (ví dụ 30% = 0.3) rồi nhân với số gốc — nhanh hơn khi tính nhẩm.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>30% của 200.000đ:</strong> 200.000 × 30 ÷ 100 = <strong>60.000đ</strong></li>
          <li><strong>15% tiền tip cho bill 850.000đ:</strong> 850.000 × 0.15 = <strong>127.500đ</strong></li>
          <li><strong>10% tiền cọc thuê nhà 8 triệu/tháng:</strong> 8.000.000 × 0.1 = <strong>800.000đ</strong></li>
          <li><strong>6.5% lãi tiết kiệm 500 triệu/năm:</strong> 500.000.000 × 0.065 = <strong>32.5 triệu</strong></li>
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
