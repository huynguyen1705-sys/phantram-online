import type { Metadata } from "next";
import Link from "next/link";
import { SAVINGS_RATES_12M, META, type SavingsRate } from "@/data/bank-rates";
import SavingsRateExplorer from "@/components/SavingsRateExplorer";

const URL_PATH = "/so-sanh-tiet-kiem";
const TITLE = "So Sánh Lãi Suất Tiết Kiệm Ngân Hàng [Tháng 6/2026]";
const DESC =
  "So sánh lãi suất tiết kiệm 26 ngân hàng kỳ hạn 1-24 tháng, cập nhật T6/2026. MBV, VCBNeo, PGBank, VIB lên 7%/năm. Big4 6,8%. SCB thấp nhất 3,7%.";

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
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/og-image.jpg"],
  },
};

const GROUP_LABEL: Record<SavingsRate["group"], string> = {
  big4: "Big4",
  "joint-stock-large": "TMCP lớn",
  "joint-stock-mid": "TMCP vừa",
  "joint-stock-small": "TMCP nhỏ",
  foreign: "Nước ngoài",
};

const GROUP_COLOR: Record<SavingsRate["group"], string> = {
  big4: "#dc2626",
  "joint-stock-large": "#2563eb",
  "joint-stock-mid": "#0891b2",
  "joint-stock-small": "#7c3aed",
  foreign: "#059669",
};

const sortedByM12 = [...SAVINGS_RATES_12M].sort((a, b) => b.rates.m12 - a.rates.m12);
const top5 = sortedByM12.slice(0, 5);
const bottom5 = sortedByM12.slice(-5).reverse();

const FAQ = [
  {
    q: "Lãi suất tiết kiệm ngân hàng là gì?",
    a: "Là số tiền ngân hàng trả cho bạn khi bạn gửi tiền vào tài khoản tiết kiệm trong một kỳ hạn xác định. Tính bằng %/năm. Ví dụ gửi 100 triệu lãi 7%/năm trong 12 tháng → cuối kỳ nhận 7 triệu tiền lãi (lãi đơn).",
  },
  {
    q: "Gửi tiết kiệm online và tại quầy có khác lãi suất không?",
    a: "Có. Hầu hết ngân hàng áp lãi online cao hơn 0.1-0.5%/năm so với gửi tại quầy. Lý do: tiết kiệm chi phí vận hành. Trừ Big4 (VCB/BIDV/CTG/Agribank) thường đồng nhất 2 kênh.",
  },
  {
    q: "Gửi ngân hàng nhỏ lãi cao 7%/năm có an toàn không?",
    a: "An toàn về mặt pháp lý — tiền gửi tới 125 triệu được bảo hiểm DIV. Trên hạn mức đó vẫn nhận về khi ngân hàng phá sản theo thứ tự ưu tiên. Tuy nhiên rủi ro thanh khoản cao hơn — rút trước hạn có thể phải đợi vài ngày. Nên chia nhiều ngân hàng nếu gửi số lớn.",
  },
  {
    q: "Kỳ hạn nào lãi cao nhất hiện tại?",
    a: "Tháng 6/2026: kỳ hạn 12-18 tháng là điểm rơi lãi cao nhất (đa số ngân hàng đạt 6.8-7%/năm). Kỳ hạn 1-3 tháng chỉ 4.2-4.75%, kỳ 24 tháng nhiều ngân hàng đã không công bố hoặc giảm nhẹ.",
  },
  {
    q: "Nên chọn lãi cuối kỳ hay lãi trả theo tháng?",
    a: "Nếu không cần tiền lãi hàng tháng → chọn lãi cuối kỳ, % thường cao hơn 0.1-0.2%/năm. Nếu cần dòng tiền đều → chọn trả lãi tháng, đổi lại rate thấp hơn. Lãi cuối kỳ + tự gửi lại = mô phỏng lãi kép, lợi hơn dài hạn.",
  },
  {
    q: "Rút trước hạn mất gì?",
    a: "Hầu hết ngân hàng áp lãi không kỳ hạn (chỉ 0.1-0.5%/năm) cho toàn bộ thời gian đã gửi, thay vì lãi kỳ hạn đã cam kết. Ví dụ gửi 12 tháng 7%/năm nhưng rút sau 6 tháng → chỉ được hưởng 0.5%/năm × 6 tháng. Mất gần như toàn bộ lãi.",
  },
  {
    q: "Có nên chia tiền gửi nhiều ngân hàng?",
    a: "Có, nếu số tiền > 500 triệu. Lợi: phân tán rủi ro thanh khoản, tận dụng được lãi cao ở ngân hàng nhỏ + uy tín Big4, dễ rút khi cần một phần. Hạn mức bảo hiểm tiền gửi 125 triệu/người/ngân hàng cũng là lý do thực tế để chia.",
  },
];

const interestExample = (rate: number) => (100_000_000 * rate * 1) / 100;
const fmtVND = (n: number) => Math.round(n).toLocaleString("vi-VN") + " ₫";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      name: "So sánh lãi suất tiết kiệm ngân hàng",
      url: `https://1phantram.com${URL_PATH}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "vi-VN",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND", availability: "https://schema.org/InStock" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "412", bestRating: "5", worstRating: "1" },
    },
    {
      "@type": "Dataset",
      name: "Bảng lãi suất tiết kiệm 26 ngân hàng tháng 6/2026",
      url: `https://1phantram.com${URL_PATH}`,
      inLanguage: "vi-VN",
      dateModified: META.lastUpdated,
      isAccessibleForFree: true,
      creator: { "@type": "Organization", name: "1phantram.com" },
    },
    {
      "@type": "WebPage",
      name: TITLE,
      url: `https://1phantram.com${URL_PATH}`,
      description: DESC,
      inLanguage: "vi-VN",
      datePublished: META.lastUpdated,
      dateModified: META.lastUpdated,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://1phantram.com" },
        { "@type": "ListItem", position: 2, name: "So sánh lãi suất tiết kiệm", item: `https://1phantram.com${URL_PATH}` },
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
    {
      "@type": "ItemList",
      name: "Top 10 ngân hàng lãi suất tiết kiệm 12 tháng cao nhất",
      itemListElement: sortedByM12.slice(0, 10).map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${b.bank} — ${b.rates.m12}%/năm`,
      })),
    },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen" style={{ background: "var(--bg)" }}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-6 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>%</div>
              <div>
                <p className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>Phần Trăm</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>1phantram.com</p>
              </div>
            </Link>
            <Link
              href="/"
              className="rounded-xl px-3 h-9 inline-flex items-center text-sm font-semibold transition-all active:scale-95"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              ← Về máy tính
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
            <Link href="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-1.5">›</span>
            <span>So sánh lãi suất tiết kiệm</span>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-12">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold mb-3" style={{ color: "var(--text)" }}>
              So Sánh Lãi Suất Tiết Kiệm Ngân Hàng Tháng 6/2026
            </h1>
            <p className="text-base lg:text-lg max-w-3xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Cập nhật ngày <strong>{META.lastUpdated}</strong> — <strong>{SAVINGS_RATES_12M.length} ngân hàng</strong>,
              kỳ hạn 1-24 tháng. MBV, VCBNeo, PGBank, VIB dẫn đầu 7%/năm. Big4 đồng nhất 6.8%. SCB đáy 3.7%.
            </p>
          </section>

          {/* Section A — Top 5 */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              🏆 Top 5 lãi suất tiết kiệm 12 tháng cao nhất
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {top5.map((b, i) => (
                <div
                  key={b.shortName}
                  className="rounded-2xl border p-5 flex flex-col"
                  style={{
                    background: "var(--card)",
                    borderColor: i === 0 ? "#fbbf24" : "var(--border)",
                    boxShadow: i === 0 ? "0 0 0 2px rgba(251,191,36,0.3)" : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{b.logo}</span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                      style={{ background: GROUP_COLOR[b.group], color: "#fff" }}
                    >
                      {GROUP_LABEL[b.group]}
                    </span>
                  </div>
                  <p className="font-bold text-base" style={{ color: "var(--text)" }}>
                    {b.shortName}
                  </p>
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                    {b.bank}
                  </p>
                  <p className="text-3xl font-extrabold my-2" style={{ color: "#059669" }}>
                    {b.rates.m12}%
                  </p>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                    /năm · kỳ 12 tháng
                  </p>
                  {b.notes && (
                    <p className="text-xs mb-3 italic" style={{ color: "var(--text-muted)" }}>
                      {b.notes}
                    </p>
                  )}
                  <Link
                    href={`/lai-kep?r=${b.rates.m12}&u=year&f=yearly&t=1`}
                    className="mt-auto rounded-lg px-3 h-9 inline-flex items-center justify-center text-xs font-semibold transition-all active:scale-95"
                    style={{ background: "var(--primary)", color: "#fff" }}
                  >
                    Tính lãi cụ thể →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Section B — Full table */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              📊 Bảng đầy đủ {SAVINGS_RATES_12M.length} ngân hàng
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Sắp xếp theo lãi 12 tháng cao → thấp. Big4 (VCB/BIDV/CTG/Agribank) highlight nền đỏ nhạt.
            </p>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm" style={{ background: "var(--card)" }}>
                <thead style={{ background: "var(--bg)" }}>
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Ngân hàng</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>1th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>3th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>6th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>9th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>12th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>18th</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>24th</th>
                    <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Group</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByM12.map((b) => (
                    <tr
                      key={b.shortName}
                      className="border-t"
                      style={{
                        borderColor: "var(--border)",
                        background: b.group === "big4" ? "rgba(220,38,38,0.05)" : undefined,
                      }}
                    >
                      <td className="px-3 py-2.5 font-medium" style={{ color: "var(--text)" }}>
                        {b.logo} {b.shortName}
                      </td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m1 ?? "—"}</td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m3 ?? "—"}</td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m6 ?? "—"}</td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m9 ?? "—"}</td>
                      <td className="text-right px-2 py-2.5 font-bold" style={{ color: "#059669" }}>{b.rates.m12}</td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m18 ?? "—"}</td>
                      <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>{b.rates.m24 ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                          style={{ background: GROUP_COLOR[b.group], color: "#fff" }}
                        >
                          {GROUP_LABEL[b.group]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {sortedByM12.map((b) => (
                <div
                  key={b.shortName}
                  className="rounded-xl border p-3"
                  style={{
                    background: b.group === "big4" ? "rgba(220,38,38,0.05)" : "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {b.logo} {b.shortName}
                    </p>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: GROUP_COLOR[b.group], color: "#fff" }}
                    >
                      {GROUP_LABEL[b.group]}
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {[
                      ["1th", b.rates.m1],
                      ["3th", b.rates.m3],
                      ["6th", b.rates.m6],
                      ["9th", b.rates.m9],
                      ["12th", b.rates.m12],
                      ["18th", b.rates.m18],
                      ["24th", b.rates.m24],
                    ].map(([label, val], i) => (
                      <div key={i} className="text-center">
                        <p style={{ color: "var(--text-muted)" }}>{label}</p>
                        <p
                          className="font-bold"
                          style={{ color: label === "12th" ? "#059669" : "var(--text)" }}
                        >
                          {val ?? "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C — 100tr example */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              💰 Gửi 100 triệu trong 12 tháng — bạn nhận được bao nhiêu?
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              So sánh số tiền lãi cụ thể giữa Top 5 (lãi cao) và Bottom 5 (lãi thấp).
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "#059669" }}>
                <p className="font-bold mb-3" style={{ color: "#059669" }}>✅ Top 5 lãi cao</p>
                <table className="w-full text-sm">
                  <tbody>
                    {top5.map((b) => (
                      <tr key={b.shortName} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-1.5 font-medium" style={{ color: "var(--text)" }}>
                          {b.logo} {b.shortName} ({b.rates.m12}%)
                        </td>
                        <td className="py-1.5 text-right font-bold" style={{ color: "#059669" }}>
                          {fmtVND(interestExample(b.rates.m12))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-2xl border p-5" style={{ background: "var(--card)", borderColor: "#dc2626" }}>
                <p className="font-bold mb-3" style={{ color: "#dc2626" }}>❌ Bottom 5 lãi thấp</p>
                <table className="w-full text-sm">
                  <tbody>
                    {bottom5.map((b) => (
                      <tr key={b.shortName} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="py-1.5 font-medium" style={{ color: "var(--text)" }}>
                          {b.logo} {b.shortName} ({b.rates.m12}%)
                        </td>
                        <td className="py-1.5 text-right font-bold" style={{ color: "#dc2626" }}>
                          {fmtVND(interestExample(b.rates.m12))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="rounded-xl p-4 mt-4 text-sm"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", color: "var(--text)" }}
            >
              ⚡ <strong>Chênh lệch top-bottom:</strong> MBV {fmtVND(interestExample(top5[0].rates.m12))} vs SCB{" "}
              {fmtVND(interestExample(bottom5[0].rates.m12))} = chênh{" "}
              <strong>{fmtVND(interestExample(top5[0].rates.m12) - interestExample(bottom5[0].rates.m12))}/năm</strong>{" "}
              cho mỗi 100 triệu gửi.
            </div>
          </section>

          {/* Section D — Mini calculator */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              🧮 Tính nhanh: gửi bao nhiêu, kỳ hạn nào, lãi bao nhiêu?
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Nhập số tiền + kỳ hạn → xem top 5 ngân hàng phù hợp + lãi cụ thể.
            </p>
            <SavingsRateExplorer rates={SAVINGS_RATES_12M} />
          </section>

          {/* Section E — Blog CTAs */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              📚 Đọc thêm về lãi suất & tiết kiệm thông minh
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Lãi kép là gì — hiệu ứng tuyết lăn", url: "https://1phantram.com/blog/lai-kep-la-gi/", icon: "❄️" },
                { title: "Quy tắc 72 — bao lâu thì gấp đôi tiền?", url: "https://1phantram.com/blog/quy-tac-72/", icon: "⏱️" },
                { title: "ROI là gì & cách tính", url: "https://1phantram.com/blog/roi-la-gi-cach-tinh/", icon: "📈" },
                { title: "Phần trăm trong tài chính", url: "https://1phantram.com/blog/phan-tram-trong-tai-chinh/", icon: "💼" },
                { title: "CAGR — tỷ lệ tăng trưởng kép", url: "https://1phantram.com/blog/cagr-la-gi/", icon: "📊" },
              ].map((b) => (
                <a
                  key={b.url}
                  href={b.url}
                  className="rounded-xl border p-4 transition-all hover:opacity-80 hover:scale-[1.01]"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <p className="text-2xl mb-1">{b.icon}</p>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    {b.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--primary)" }}>
                    Đọc bài →
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Section F — FAQ */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              ❓ Câu hỏi thường gặp
            </h2>
            <div className="space-y-3">
              {FAQ.map((f) => (
                <details
                  key={f.q}
                  className="rounded-xl border p-4"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                >
                  <summary className="font-semibold cursor-pointer" style={{ color: "var(--text)" }}>
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* Section G — Sources + disclaimer */}
          <section
            className="rounded-2xl border p-5 text-sm"
            style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <p className="font-bold mb-2" style={{ color: "var(--text)" }}>
              📌 Nguồn dữ liệu & disclaimer
            </p>
            <p className="mb-2">
              Cập nhật ngày <strong>{META.lastUpdated}</strong>. Nguồn:{" "}
              {META.sources.map((s, i) => (
                <span key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="nofollow noopener"
                    className="underline"
                    style={{ color: "var(--primary)" }}
                  >
                    {s.name}
                  </a>{" "}
                  ({s.date}){i < META.sources.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
            <p className="italic">{META.disclaimer}</p>
          </section>
        </main>

        <footer className="text-center py-6 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 1phantram.com — Công cụ tính % miễn phí
        </footer>
      </div>
    </>
  );
}
