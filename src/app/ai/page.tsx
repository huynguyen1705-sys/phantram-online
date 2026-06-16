import type { Metadata } from "next";
import Link from "next/link";
import AIParser from "@/components/AIParser";

const URL_PATH = "/ai";
const NAME = "Máy tính phần trăm AI";
const TITLE = "Máy Tính Phần Trăm AI - Hỏi Bằng Tiếng Việt | phantram.online";
const DESC =
  "Máy tính phần trăm bằng AI. Gõ câu hỏi tự nhiên bằng tiếng Việt như 'lương 25 triệu trừ 10% bảo hiểm còn bao nhiêu', AI tự hiểu, tự tính, tự giải thích từng bước.";

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
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-image.jpg"],
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Máy tính phần trăm AI hoạt động như thế nào?",
    a: "Bạn gõ câu hỏi bằng tiếng Việt tự nhiên, ví dụ 'lương 25 triệu trừ 10% bảo hiểm còn bao nhiêu'. AI phân tích câu, nhận diện các con số và phép tính, rồi trả về kết quả kèm giải thích từng bước. Không cần điền form, không cần chọn tab.",
  },
  {
    q: "AI Parser có miễn phí không?",
    a: "Có. Hoàn toàn miễn phí, không cần đăng ký. Có giới hạn 10 yêu cầu/phút mỗi IP để chống lạm dụng. Đủ dùng cho cá nhân và công việc hàng ngày.",
  },
  {
    q: "AI có chính xác không, có thể tin được số tiền nó tính?",
    a: "AI rất tốt với các câu hỏi phần trăm thông thường (giảm giá, lương net, tip, lãi suất đơn). Với phép tính phức tạp như lãi kép nhiều năm hoặc thuế lũy tiến, bạn nên dùng máy tính chuyên dụng (xem mục Tài chính trên trang chủ). AI luôn hiển thị các bước để bạn kiểm tra.",
  },
  {
    q: "Có thể hỏi gì với AI Parser?",
    a: "Tính % của số bất kỳ, % tăng/giảm, giảm giá, tip nhà hàng, chia bill nhóm, lương net sau trừ bảo hiểm, lãi đơn ngân hàng, mục tiêu giảm cân theo %, scale công thức nấu ăn. Hỏi càng rõ con số càng dễ trúng đáp án.",
  },
  {
    q: "Dữ liệu câu hỏi của tôi có được lưu lại không?",
    a: "Câu hỏi được gửi tới mô hình AI (Google Gemini qua OpenRouter) để xử lý và không lưu trên máy chủ phantram.online. Lịch sử 10 câu hỏi gần nhất chỉ lưu trong localStorage trên trình duyệt của bạn — bạn có thể xóa bất cứ lúc nào.",
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
      inLanguage: "vi-VN",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      featureList: [
        "Hiểu tiếng Việt tự nhiên",
        "Tính tổ hợp nhiều bước phần trăm",
        "Giải thích từng bước",
        "Cảnh báo cách diễn đạt mơ hồ",
      ],
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
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function AIPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        className="max-w-2xl mx-auto px-4 lg:px-6 pt-5 text-xs"
        style={{ color: "var(--text-muted)" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2">›</span>
        <span style={{ color: "var(--text)" }}>{NAME}</span>
      </nav>

      <header className="max-w-2xl mx-auto px-4 lg:px-6 pt-3 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>
          🤖 Máy Tính Phần Trăm Bằng AI
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Gõ câu hỏi tiếng Việt — AI phân tích, tính và giải thích từng bước.
        </p>
      </header>

      <AIParser />

      {/* ── Article SEO ── */}
      <article
        className="max-w-2xl mx-auto px-4 lg:px-6 py-10 text-sm leading-relaxed"
        style={{ color: "var(--text)" }}
      >
        <h2 className="text-xl font-bold mb-3">Tính phần trăm bằng AI — khi câu hỏi quá rắc rối cho form</h2>
        <p className="mb-3">
          Các máy tính phần trăm truyền thống yêu cầu bạn chọn đúng loại phép tính (tính %, tính tăng giảm,
          giảm giá&hellip;) rồi điền số vào ô. Nhưng đời sống thật không gọn như vậy: bạn muốn biết{" "}
          <strong>lương 18 triệu trừ 10.5% bảo hiểm rồi đóng thuế thu nhập thì cầm về bao nhiêu</strong>, hoặc{" "}
          <strong>bill ăn 850k tip 10% chia 4 người mỗi người trả bao nhiêu</strong> — chuyển hết những câu đó
          thành form thì mệt.
        </p>
        <p className="mb-4">
          AI Parser ra đời để giải quyết đúng phần đó: bạn cứ gõ câu hỏi bằng tiếng Việt tự nhiên, hệ thống dùng
          mô hình ngôn ngữ Google Gemini phân tích từng cụm số &amp; phép tính, trả về kết quả kèm các bước
          trung gian để bạn kiểm tra.
        </p>

        <h2 className="text-lg font-bold mt-6 mb-2">6 kiểu câu hỏi AI Parser xử lý tốt</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>
            <strong>Tính % của một số:</strong> &quot;30% của 25 triệu là bao nhiêu?&quot;
          </li>
          <li>
            <strong>Trừ % liên tiếp:</strong> &quot;Lương 18 triệu trừ 10.5% bảo hiểm còn bao nhiêu?&quot;
          </li>
          <li>
            <strong>Tip &amp; chia bill:</strong>{" "}
            &quot;Bill 850k tip 10% chia 4 người mỗi người trả bao nhiêu?&quot;
          </li>
          <li>
            <strong>Giảm giá:</strong> &quot;Giảm 25% từ 1.2 triệu còn bao nhiêu?&quot;
          </li>
          <li>
            <strong>Bẫy logic:</strong> &quot;Tăng giá 15% rồi giảm 15% có về giá gốc không?&quot;
          </li>
          <li>
            <strong>Lãi suất đơn:</strong> &quot;Vay 500 triệu lãi 8.5%/năm trong 5 năm, lãi tổng bao nhiêu?&quot;
          </li>
        </ul>

        <h2 className="text-lg font-bold mt-6 mb-2">Mẹo để AI hiểu đúng nhanh hơn</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Ghi rõ đơn vị: dùng &quot;triệu&quot;, &quot;tỷ&quot;, &quot;k&quot; thay vì gõ cả dãy số 0.</li>
          <li>Nói rõ phép toán: &quot;trừ&quot;, &quot;giảm&quot;, &quot;tăng&quot;, &quot;chia&quot;.</li>
          <li>
            Câu càng cụ thể, kết quả càng đúng. Câu mơ hồ (&quot;tính giúp tao&quot;) AI sẽ hỏi lại.
          </li>
          <li>Với bài toán nhiều bước, AI sẽ tách từng bước rõ ràng để bạn kiểm tra.</li>
        </ul>

        <h2 className="text-lg font-bold mt-6 mb-2">Khi nào nên dùng máy tính chuyên dụng thay vì AI?</h2>
        <p className="mb-3">
          AI Parser tiện cho câu hỏi đời thường. Với các trường hợp cần độ chính xác cao và tham số phức tạp
          (thuế TNCN lũy tiến 2026, lãi kép nhiều kỳ, ROI dài hạn), nên dùng các máy tính chuyên dụng:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>
            <Link href="/luong-net" className="text-blue-500 hover:underline">
              Tính lương Net sau thuế TNCN
            </Link>
          </li>
          <li>
            <Link href="/lai-kep" className="text-blue-500 hover:underline">
              Tính lãi kép
            </Link>
          </li>
          <li>
            <Link href="/lai-suat-don" className="text-blue-500 hover:underline">
              Tính lãi suất đơn
            </Link>
          </li>
          <li>
            <Link href="/chia-bill-tip" className="text-blue-500 hover:underline">
              Chia bill &amp; tip
            </Link>
          </li>
        </ul>

        <h2 className="text-lg font-bold mt-6 mb-2">Câu hỏi thường gặp</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-base">{f.q}</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {f.a}
            </p>
          </div>
        ))}
      </article>

      <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
        © 2026 phantram.online — Máy tính phần trăm bằng AI
      </footer>
    </>
  );
}
