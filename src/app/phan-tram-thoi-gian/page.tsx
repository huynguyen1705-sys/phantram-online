import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/phan-tram-thoi-gian";
const NAME = "Phần trăm thời gian đã qua";
const TITLE = "Năm 2026 Đã Qua Bao Nhiêu Phần Trăm? — Tính Live | phantram.online";
const DESC =
  "Hôm nay là ngày bao nhiêu? Năm 2026 đã trôi qua bao nhiêu %? Tính live % đã qua của năm, tháng, ngày, deadline dự án. Cập nhật mỗi giây, share Facebook đẹp.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "năm 2026 đã qua bao nhiêu",
    "% của năm",
    "% đã qua",
    "thời gian còn lại 2026",
    "deadline tracker",
    "phần trăm thời gian",
    "hôm nay là ngày bao nhiêu",
  ],
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  { q: "Năm 2026 có phải năm nhuận?", a: "Không. Năm nhuận gần nhất là 2024 (366 ngày). Năm nhuận tiếp theo là 2028. Năm 2026 có 365 ngày bình thường." },
  { q: "Tính % đến một ngày cụ thể được không?", a: "Có. Chọn mode Tùy chỉnh, nhập ngày bắt đầu và ngày kết thúc (vd ngày khởi động dự án và deadline) — công cụ tính ngay % đã qua và số ngày còn lại." },
  { q: "Tool có cập nhật real-time không?", a: "Có. Mode Năm và Tháng cập nhật mỗi 60 giây, Mode Ngày cập nhật mỗi 1 giây để bạn thấy giây chạy live, Mode Tùy chỉnh tính ngay khi nhập đủ 2 ngày." },
  { q: "Công thức tính % của năm là gì?", a: "% = (số ngày đã qua trong năm ÷ tổng số ngày của năm) × 100. VD ngày 15/6/2026: đã qua 166 ngày trên 365 ngày → 166 ÷ 365 × 100 ≈ 45.5%." },
  { q: "Tại sao số % lại tăng nhanh ở mode Ngày?", a: "Vì một ngày chỉ có 24 giờ = 1440 phút, nên mỗi phút trôi qua tương đương 0.07% của ngày. Mode Ngày dùng đơn vị giây nên bạn thấy con số nhảy liên tục." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "812", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="time-progress" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Năm 2026 đã qua bao nhiêu phần trăm?</h1>
        <p className="mb-3">
          Công cụ <strong>tính % thời gian đã qua</strong> giúp bạn biết ngay <strong>năm 2026 đã trôi qua bao nhiêu %</strong>,
          tháng hiện tại đã đi được mấy phần, hôm nay đã qua bao nhiêu phần trăm của 24 giờ, hoặc một mốc deadline bất kỳ
          còn lại bao nhiêu ngày. Cập nhật <strong>live</strong> theo timezone Việt Nam (UTC+7).
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Năm 2026 đã trôi qua bao lâu?</h2>
        <p className="mb-3">
          Người Việt ngày càng quen với việc <strong>track thời gian</strong> để planning: kiểm tra OKR/KPI giữa năm,
          đánh giá lại mục tiêu cá nhân, tạo cảm giác cấp bách để hoàn thành dự án. Một con số đơn giản như
          &quot;đã qua 45%&quot; có sức nặng tâm lý lớn — nhắc nhở rằng nửa năm đã trôi qua, đừng để mục tiêu
          treo trên giấy.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức tính % thời gian đã qua</h2>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li><strong>Năm:</strong> % = (ngày hiện tại trong năm − 1) ÷ tổng số ngày năm × 100</li>
          <li><strong>Tháng:</strong> % = ngày hiện tại trong tháng ÷ số ngày của tháng × 100</li>
          <li><strong>Ngày:</strong> % = (giờ × 60 + phút) ÷ (24 × 60) × 100</li>
          <li><strong>Tùy chỉnh:</strong> % = (hôm nay − ngày bắt đầu) ÷ (ngày kết thúc − ngày bắt đầu) × 100</li>
        </ul>

        <h2 className="text-lg font-bold mt-5 mb-2">Tại sao nên track % thời gian?</h2>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li><strong>Tạo cảm giác cấp bách</strong> — biết &quot;còn 198 ngày&quot; khác xa &quot;còn nửa năm&quot;.</li>
          <li><strong>Kiểm tra OKR/KPI giữa năm</strong> — nếu đã qua 50% năm mà mục tiêu mới đạt 20%, cần đẩy ga.</li>
          <li><strong>Đánh giá lại mục tiêu cá nhân</strong> — quyết tâm đầu năm có còn được nhớ không?</li>
          <li><strong>Share lên Facebook/Zalo</strong> — kéo bạn bè cùng nhìn lại năm qua.</li>
        </ul>

        <h2 className="text-lg font-bold mt-5 mb-2">Cột mốc % năm</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">Ngày</th>
                <th className="px-3 py-2 text-left">% năm</th>
                <th className="px-3 py-2 text-left">Mốc</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1">1/1</td><td className="px-3 py-1 text-green-500">0%</td><td className="px-3 py-1">Năm mới</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">31/3</td><td className="px-3 py-1">24.7%</td><td className="px-3 py-1">Hết Q1</td></tr>
              <tr><td className="px-3 py-1">30/6</td><td className="px-3 py-1 text-orange-500">49.6%</td><td className="px-3 py-1">Giữa năm</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">30/9</td><td className="px-3 py-1 text-orange-500">74.5%</td><td className="px-3 py-1">Hết Q3</td></tr>
              <tr><td className="px-3 py-1">31/12</td><td className="px-3 py-1 text-red-500">100%</td><td className="px-3 py-1">Hết năm</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">FAQ</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((f, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="font-semibold mb-1">{f.q}</p>
              <p style={{ color: "var(--text-muted)" }}>{f.a}</p>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
