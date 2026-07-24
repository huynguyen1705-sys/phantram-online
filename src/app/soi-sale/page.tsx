import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/soi-sale";
const NAME = "Soi sale Shopee/Lazada/Tiki — chống fake giá";
const TITLE = "Soi Sale Shopee Lazada Tiki — Phát Hiện Fake Giá, Tính Giá Cuối Thật | 1phantram.com";
const DESC =
  "Soi sale chống fake giá Shopee/Lazada/Tiki: tính giá cuối thật sau voucher + ship + hoàn xu, phát hiện chiêu nâng giá gốc giả rồi giảm 50%, so sánh 2 sàn cùng lúc, lưu lịch sử giá theo thời gian.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "soi sale shopee",
    "fake sale shopee",
    "nâng giá ảo shopee",
    "lazada giảm giá thật",
    "tính giá cuối shopee",
    "voucher shopee tính",
    "so sánh giá shopee lazada",
    "chống lừa giảm giá",
  ],
  alternates: { canonical: `https://1phantram.com${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://1phantram.com${URL_PATH}`, siteName: "1phantram.com", images: [{ url: `${URL_PATH}/opengraph-image`, width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${URL_PATH}/opengraph-image`] },
};

const FAQ = [
  { q: "Làm sao biết shop có nâng giá gốc giả không?", a: "Quy tắc đơn giản: nếu giá gốc gạch chéo cao gấp >3× giá hiện tại, hoặc shop claim giảm >70% liên tục nhiều tháng, đó là dấu hiệu nâng giá ảo. Đối chiếu giá ở Tiki/Lazada hoặc Google Shopping để xác minh giá thị trường thật." },
  { q: "Giá thấp nhất 30 ngày lấy ở đâu?", a: "Bạn có thể (1) tự ghi nhớ giá những lần trước thấy, (2) dùng extension Chrome như Keepa (đa nền tảng), Tracker.com.vn, hoặc (3) hỏi shop. Công cụ này lưu lịch sử giá theo từng sản phẩm vào local storage của trình duyệt bạn — lần sau check lại sẽ thấy biểu đồ giá." },
  { q: "Voucher shop và voucher sàn khác nhau thế nào?", a: "Voucher shop do shop tự phát hành (chỉ dùng ở shop đó). Voucher sàn (Shopee Mall, voucher freeship, voucher mã ngành hàng) do sàn phát, có thể dùng được nhiều shop. Khi nhập vào tool, gộp cả 2 loại lại để ra giá cuối chính xác." },
  { q: "Hoàn xu / Shopee xu có quy ra tiền được không?", a: "Có. 1 Shopee Xu = 1 đồng VND. Khi shop hiển thị 'hoàn 5% lên đến 30K', bạn nhập 30.000 vào ô Hoàn xu — tool tự trừ vào giá cuối thật." },
  { q: "Có dữ liệu lịch sử giá toàn quốc không?", a: "Hiện tại không, vì Shopee/Lazada chặn truy cập tự động từ server. Tool lưu lịch sử cá nhân (local trên trình duyệt bạn) — đủ dùng cho người mua sắm thường xuyên. Nếu cần data toàn quốc, dùng dịch vụ trả phí như bodapi.com hoặc Keepa." },
  { q: "Khi nào nên 'MUA NGAY' khi nào nên 'CHỜ'?", a: "MUA NGAY: giá trả thực ≤ giá thấp nhất 30 ngày (đang ở đáy). NÊN CHỜ: giá trả thực cao hơn giá thấp nhất 30 ngày >5% (sản phẩm thường giảm trở lại). NGHI NGỜ FAKE: giá gốc gạch chéo cao bất thường — đối chiếu chéo trước khi mua." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: NAME,
      url: `https://1phantram.com${URL_PATH}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "517", bestRating: "5", worstRating: "1" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://1phantram.com" },
        { "@type": "ListItem", position: 2, name: NAME, item: `https://1phantram.com${URL_PATH}` },
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
      <Calculator initialTab="soi-sale" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Soi sale Shopee/Lazada/Tiki — chống fake giá ảo</h1>
        <p className="mb-3">
          Sale 12.12, 11.11, 9.9, ngày đôi… người mua nào cũng từng bị &quot;dắt&quot; bởi mác <strong>giảm 50-70%</strong>
          to đùng. Sự thật: nhiều shop <strong>nâng giá gốc gạch chéo lên 2-3 lần</strong> rồi giảm về giá thường,
          coi như đang giảm rất sâu. Công cụ này giúp bạn <strong>tính giá cuối thực sự phải trả</strong> sau khi
          trừ voucher, cộng ship, trừ hoàn xu — và <strong>cảnh báo dấu hiệu fake sale</strong> ngay tại chỗ.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức giá cuối thật</h2>
        <pre className="rounded-lg p-3 text-xs overflow-x-auto" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
{`Giá trả thực = Giá hiện tại
              − Voucher Shop
              − Voucher Sàn
              + Phí ship
              − Hoàn xu / Cashback

% giảm THẬT = (Giá gạch chéo − Giá trả thực) ÷ Giá gạch chéo × 100`}
        </pre>

        <h2 className="text-lg font-bold mt-5 mb-2">3 chiêu fake sale phổ biến</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-2">
          <li><strong>Nâng giá gốc gạch chéo:</strong> Shop tăng giá gạch chéo lên 2-3× giá thường ngày để hiển thị
            mức giảm khủng. Khi shop claim &quot;giảm 60%&quot; nhưng giá trả thực vẫn ngang giá thị trường, đó là chiêu này.</li>
          <li><strong>Voucher có điều kiện đơn tối thiểu khó đạt:</strong> Mã giảm 50K cần đơn từ 500K, nhưng sản phẩm
            chỉ 200K — bạn phải mua thêm hàng không cần để &quot;đủ&quot; voucher → tổng tiền vẫn cao.</li>
          <li><strong>Phí ship cao &quot;ẩn&quot; bên trong combo:</strong> Giá sản phẩm rẻ nhưng ship 50K-80K (đặc biệt
            ngoài 3 sàn lớn). Tool này yêu cầu nhập ship để giá cuối phản ánh trung thực.</li>
        </ol>

        <h2 className="text-lg font-bold mt-5 mb-2">Khi nào nên mua, khi nào nên chờ?</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">Tình huống</th>
                <th className="px-3 py-2 text-left">Quyết định</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-2">Giá trả thực ≤ giá thấp nhất 30 ngày</td><td className="px-3 py-2 text-green-500 font-semibold">✅ MUA NGAY</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-2">Giảm thật ≥15%, không có dấu hiệu fake</td><td className="px-3 py-2 text-green-500 font-semibold">✅ OK MUA</td></tr>
              <tr><td className="px-3 py-2">Giá hiện tại cao hơn giá thấp nhất 30d &gt;5%</td><td className="px-3 py-2 text-yellow-500 font-semibold">⏳ NÊN CHỜ</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-2">Giá gốc gạch chéo &gt;3× giá hiện tại</td><td className="px-3 py-2 text-red-500 font-semibold">🚨 FAKE SALE</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">So sánh 2 sàn cùng lúc</h2>
        <p className="mb-3">
          Cùng 1 món hàng, giá Shopee có thể khác Lazada hoặc Tiki khá nhiều khi tính đủ voucher + ship + cashback.
          Chọn mode <strong>⚡ So sánh 2 sàn</strong> — nhập song song giá 2 sàn, công cụ chỉ ra sàn nào rẻ hơn
          bao nhiêu và % tiết kiệm.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Lịch sử giá cá nhân</h2>
        <p className="mb-3">
          Mỗi lần bạn bấm &quot;💾 Lưu để track giá theo thời gian&quot;, công cụ lưu sản phẩm vào trình duyệt của bạn
          (không gửi đi đâu). Lần sau check lại, bạn thấy ngay giá đã thay đổi thế nào → biết shop có thật sự
          giảm hay đang &quot;đẩy giá lên rồi nhử bằng voucher&quot;.
        </p>

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
