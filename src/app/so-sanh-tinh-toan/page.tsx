import type { Metadata } from "next";
import Link from "next/link";
import CompareCalculations from "@/components/CompareCalculations";

const URL_PATH = "/so-sanh-tinh-toan";
const NAME = "So sánh nhiều phép tính cùng lúc";
const TITLE = "So Sánh Nhiều Phép Tính Cùng Lúc - Lịch Sử Tính %";
const DESC =
  "So sánh side-by-side đến 4 phép tính phần trăm đã lưu trong lịch sử: gói vay, tip nhà hàng, giảm giá, lãi kép — đặt cạnh nhau, copy bảng so sánh trong 1 nhấp.";

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
  {
    q: "So sánh nhiều phép tính cùng lúc để làm gì?",
    a: "Khi bạn phân vân giữa nhiều phương án, đặt kết quả cạnh nhau dễ ra quyết định hơn. Ví dụ: so sánh 2 gói vay 8%/năm vs 9%/năm trong 5 năm xem chênh lệch tổng tiền lãi bao nhiêu, hay so sánh tip 10% cho nhóm 4 người vs 15% cho nhóm 6 người để biết suất ăn nào phải trả nhiều hơn.",
  },
  {
    q: "Lịch sử tính toán được lưu ở đâu?",
    a: "Toàn bộ phép tính bạn thực hiện trên phantram.online được lưu cục bộ trong trình duyệt (localStorage, key “calc-history”). Không gửi lên server, không tài khoản — bạn dùng xong xóa lúc nào cũng được. Đổi máy/đổi trình duyệt thì lịch sử không theo qua.",
  },
  {
    q: "Tại sao tôi không thấy phép tính cũ trong danh sách?",
    a: "Có 3 lý do thường gặp: (1) bạn đang dùng trình duyệt khác hoặc chế độ ẩn danh, (2) bạn đã nhấn “Xóa tất cả” trong khung lịch sử, (3) trình duyệt tự dọn dữ liệu khi đầy bộ nhớ. Mỗi tool sẽ lưu thêm vào lịch sử ngay khi có kết quả mới.",
  },
  {
    q: "Tối đa so sánh được bao nhiêu phép tính?",
    a: "4 phép tính cùng lúc. Giới hạn này để bảng so sánh vẫn rõ ràng trên màn hình điện thoại và desktop. Nếu cần đối chiếu nhiều hơn, hãy copy bảng so sánh sang note rồi chạy thêm vòng so sánh khác.",
  },
  {
    q: "Trường hợp nào hữu ích nhất khi dùng tính năng này?",
    a: "Một số tình huống phổ biến: so sánh 2 căn nhà có giảm giá khác nhau, đối chiếu mức lương net sau thuế của 2 công ty, so sánh lãi kép tiết kiệm vs đầu tư chứng khoán cùng kỳ hạn, hoặc kiểm tra giảm giá Shopee vs Lazada cho cùng món hàng. Copy bảng và gửi cho người thân để cùng quyết định.",
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
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "612",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" },
        { "@type": "ListItem", position: 2, name: "So sánh tính toán", item: `https://phantram.online${URL_PATH}` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header + Breadcrumb */}
      <header className="border-b sticky top-0 z-30" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: "var(--text)" }}>
            phantram.online
          </Link>
          <Link href="/" className="text-xs px-3 py-1.5 rounded-lg border" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
            ← Trang chủ
          </Link>
        </div>
      </header>
      <div className="border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>So sánh tính toán</span>
        </div>
      </div>

      <main>
        <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-8 pb-2">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
            So sánh nhiều phép tính cùng lúc
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Chọn từ 2 đến 4 phép tính trong lịch sử để đặt kết quả cạnh nhau. Copy bảng so sánh trong 1 nhấp.
          </p>
        </div>

        <CompareCalculations />

        <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
          <h2 className="text-lg font-bold mt-2 mb-2">Cách dùng nhanh</h2>
          <ol className="list-decimal list-inside space-y-1 mb-4">
            <li>Vào một công cụ bất kỳ (VD: <Link href="/lai-kep" className="underline">lãi kép</Link>, <Link href="/chia-bill-tip" className="underline">chia bill</Link>) và bấm tính — kết quả tự động lưu vào lịch sử.</li>
            <li>Quay lại trang này, tick chọn 2–4 phép tính bạn muốn đối chiếu.</li>
            <li>Bấm <strong>“So sánh”</strong> — các kết quả hiển thị side-by-side ngay phía dưới.</li>
            <li>Bấm <strong>“Copy bảng so sánh”</strong> để paste vào Zalo/Messenger gửi cho người thân.</li>
          </ol>

          <h2 className="text-lg font-bold mt-5 mb-2">Trường hợp dùng phổ biến</h2>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li><strong>So sánh 2 gói vay:</strong> lãi 8%/năm vs 9%/năm trong cùng kỳ hạn — chênh tổng tiền lãi bao nhiêu.</li>
            <li><strong>Tip cho 2 nhóm khác nhau:</strong> nhóm 4 người tip 10% vs nhóm 6 người tip 15% — ai trả nhiều hơn/đầu người.</li>
            <li><strong>Sale Shopee vs Lazada:</strong> cùng món, giảm khác nhau — giá net bên nào rẻ hơn.</li>
            <li><strong>Lương 2 công ty:</strong> đối chiếu lương net sau bảo hiểm/thuế của 2 offer.</li>
            <li><strong>Đầu tư:</strong> so sánh lãi kép tiết kiệm 6%/năm vs chứng khoán 12%/năm cùng kỳ.</li>
          </ul>

          <h2 className="text-lg font-bold mt-5 mb-2">Lưu ý quan trọng</h2>
          <div className="rounded-xl border p-4 my-3 text-sm" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            Dữ liệu lịch sử chỉ lưu trong trình duyệt hiện tại (localStorage). Nếu xóa cookies/cache hoặc đổi máy, lịch sử sẽ mất. Trước khi xóa, nhớ <strong>copy bảng so sánh</strong> ra ngoài.
          </div>

          <h2 className="text-lg font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
          {FAQ.map((f, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-base">{f.q}</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
            </div>
          ))}
        </article>
      </main>

      <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
        © 2026 phantram.online — Công cụ tính % miễn phí
      </footer>
    </>
  );
}
