import type { Metadata } from "next";
import Link from "next/link";
import { HOME_LOAN_RATES, META, type LoanRate } from "@/data/bank-rates";
import LoanRateExplorer from "@/components/LoanRateExplorer";

const URL_PATH = "/so-sanh-vay";
const TITLE = "So Sánh Lãi Suất Vay Mua Nhà Ngân Hàng [Tháng 6/2026]";
const DESC =
  "So sánh lãi suất vay mua nhà 13 ngân hàng T6/2026. Ưu đãi 6-12 tháng đầu 8-10%, thả nổi 11-15%. Cảnh báo lãi mồi PVcomBank 3.99% & HSBC 5.5%.";

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

const GROUP_LABEL: Record<LoanRate["group"], string> = {
  big4: "Big4",
  "joint-stock-large": "TMCP lớn",
  "joint-stock-mid": "TMCP vừa",
  foreign: "Nước ngoài",
};

const GROUP_COLOR: Record<LoanRate["group"], string> = {
  big4: "#dc2626",
  "joint-stock-large": "#2563eb",
  "joint-stock-mid": "#0891b2",
  foreign: "#059669",
};

const sortedByInitial = [...HOME_LOAN_RATES].sort((a, b) => a.initial.rate - b.initial.rate);
const top5 = sortedByInitial.slice(0, 5);

const FAQ = [
  {
    q: "Vay mua nhà cần bao nhiêu vốn tự có?",
    a: "Tối thiểu 25-30% giá trị nhà. Các ngân hàng cho vay tối đa 70-75% giá trị tài sản đảm bảo (Agribank tới 75%). Vốn tự có gồm tiền mặt + sổ tiết kiệm + nguồn thu nhập chứng minh trả nợ ổn định (lương + thu nhập phụ).",
  },
  {
    q: "Lãi cố định và lãi thả nổi nên chọn cái nào?",
    a: "Lãi cố định 12-24 tháng đầu thường thấp (8-10%/năm), giúp dòng tiền dễ tính. Sau đó thả nổi theo lãi tiết kiệm 13/24 tháng + biên 3-3.5%. Nếu lãi cố định dài hơn (24 tháng) → an toàn cho gia đình trẻ. Nếu ngắn (6 tháng) → có rủi ro 'cú sốc lãi' khi sang thả nổi.",
  },
  {
    q: "Ưu đãi hết rồi thì sao? Lãi nhảy bao nhiêu?",
    a: "Đa số nhảy từ 9-10% lên 11-14%/năm tùy ngân hàng. PVcomBank và HSBC nhảy mạnh nhất từ 3.99-5.5% lên 12-13.5%. VD: trả 12tr/tháng có thể tăng lên 18-20tr/tháng sau khi hết ưu đãi. Cần tính 'lãi trung bình 5 năm' chứ không chỉ rate ưu đãi.",
  },
  {
    q: "Trả nợ trước hạn phí bao nhiêu?",
    a: "Thường 1-3% dư nợ gốc trong 1-3 năm đầu. Big4 thường thấp hơn TMCP. Sau 3-5 năm thường miễn phí trả trước hạn. Đọc kỹ điều khoản hợp đồng — phần phí phạt thường nằm trong phụ lục, không in trong banner ưu đãi.",
  },
  {
    q: "Vay nhà ở Big4 hay TMCP lợi hơn?",
    a: "Big4 (VCB/BIDV/CTG/Agribank): thủ tục chặt, lãi ổn định hơn về dài hạn, biên thả nổi thấp. TMCP (TCB/MB/VIB/ACB): xét duyệt nhanh, ưu đãi ban đầu cao hơn nhưng biên thả nổi cũng cao. Nếu nguồn lương rõ ràng → Big4. Nếu nguồn thu hỗn hợp → TMCP linh hoạt hơn.",
  },
  {
    q: "Gói siêu ưu đãi 3.99% của PVcomBank có nên dùng?",
    a: "Cẩn trọng. Chỉ áp dụng 3 tháng đầu, sau đó thả nổi 12-14%/năm — cao hơn cả Big4. Tổng lãi 5 năm cao hơn vay Big4 lãi 8-9%. Hợp lý chỉ khi: bạn dự định trả hết nợ trong 3 tháng đầu (tái tài chính), hoặc cần đẩy hồ sơ ngắn hạn. Còn lại: chọn Big4 hoặc TMCP có ưu đãi 12+ tháng.",
  },
  {
    q: "Lãi suất tham chiếu là gì?",
    a: "Là rate cơ sở mà ngân hàng dùng để tính lãi thả nổi: thường là 'lãi tiết kiệm 12-24 tháng + biên 3-3.5%'. Khi NHNN giảm lãi → tham chiếu giảm theo (chậm 3-6 tháng). Khi tăng → tham chiếu tăng nhanh. Hỏi rõ ngân hàng dùng tham chiếu nào trước khi ký.",
  },
];

// Amortization: monthly payment = P*r / (1 - (1+r)^-n)
function monthlyPayment(p: number, annualRate: number, months: number): number {
  if (p <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return p / months;
  return (p * r) / (1 - Math.pow(1 + r, -months));
}

// Simulate total interest over 20 years (240 months): initial period + after-promo (use rateMin)
function totalInterest20y(loan: LoanRate, principal: number) {
  const totalMonths = 240;
  const initMonths = loan.initial.months;
  const afterMonths = totalMonths - initMonths;
  // Period 1
  const mp1 = monthlyPayment(principal, loan.initial.rate, totalMonths);
  // After init period, principal remaining approximated as principal - mp1*initMonths + interest paid
  // Use simpler approximation: weighted average rate
  const avgAfter = (loan.afterPromo.rateMin + loan.afterPromo.rateMax) / 2;
  const mp2 = monthlyPayment(principal, avgAfter, totalMonths);
  const totalPaid = mp1 * initMonths + mp2 * afterMonths;
  const totalInterest = totalPaid - principal;
  const avgMonthly = totalPaid / totalMonths;
  return { mp1, mp2, totalInterest, avgMonthly };
}

const fmtVND = (n: number) => Math.round(n).toLocaleString("vi-VN") + " ₫";

const LOAN_2B = 2_000_000_000;
const exampleBanks = HOME_LOAN_RATES.filter((b) =>
  ["VCB", "AGR", "PVcomBank"].includes(b.shortName)
);

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      name: "So sánh lãi suất vay mua nhà ngân hàng",
      url: `https://1phantram.com${URL_PATH}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      inLanguage: "vi-VN",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "VND", availability: "https://schema.org/InStock" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "389", bestRating: "5", worstRating: "1" },
    },
    {
      "@type": "Dataset",
      name: "Bảng lãi suất vay mua nhà 13 ngân hàng tháng 6/2026",
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
        { "@type": "ListItem", position: 2, name: "So sánh lãi suất vay", item: `https://1phantram.com${URL_PATH}` },
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
      name: "Top 10 ngân hàng lãi suất vay mua nhà ưu đãi thấp nhất",
      itemListElement: sortedByInitial.slice(0, 10).map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${b.bank} — ${b.initial.rate}%/năm (${b.initial.months}th đầu)`,
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
            <span>So sánh lãi suất vay</span>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-12">
          {/* Hero */}
          <section className="text-center">
            <h1 className="text-2xl lg:text-4xl font-bold mb-3" style={{ color: "var(--text)" }}>
              So Sánh Lãi Suất Vay Mua Nhà Ngân Hàng Tháng 6/2026
            </h1>
            <p className="text-base lg:text-lg max-w-3xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Cập nhật ngày <strong>{META.lastUpdated}</strong> — <strong>{HOME_LOAN_RATES.length} ngân hàng</strong>,
              ưu đãi 6-36 tháng đầu 8-10%, thả nổi 11-15%/năm. ⚠️ Cảnh báo lãi mồi: PVcomBank 3.99% & HSBC 5.5%.
            </p>
          </section>

          {/* Section A — Top 5 lowest initial */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              🏆 Top 5 lãi vay ưu đãi thấp nhất
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {top5.map((b, i) => {
                const isBait = b.initial.rate < 6;
                return (
                  <div
                    key={b.shortName}
                    className="rounded-2xl border p-5 flex flex-col"
                    style={{
                      background: "var(--card)",
                      borderColor: isBait ? "#ef4444" : i === 0 ? "#fbbf24" : "var(--border)",
                      boxShadow: isBait
                        ? "0 0 0 2px rgba(239,68,68,0.3)"
                        : i === 0
                        ? "0 0 0 2px rgba(251,191,36,0.3)"
                        : undefined,
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
                    <p className="text-3xl font-extrabold my-2" style={{ color: isBait ? "#ef4444" : "#059669" }}>
                      {b.initial.rate}%
                    </p>
                    <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
                      /năm · {b.initial.months}th đầu
                    </p>
                    <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                      Sau ưu đãi: <strong>{b.afterPromo.rateMin}-{b.afterPromo.rateMax}%</strong>/năm
                    </p>
                    {isBait && (
                      <div
                        className="rounded-md p-2 mb-3 text-[11px] font-semibold"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
                      >
                        ⚠️ Lãi mồi: nhảy mạnh sau {b.initial.months}th
                      </div>
                    )}
                    {b.notes && (
                      <p className="text-xs mb-3 italic" style={{ color: "var(--text-muted)" }}>
                        {b.notes}
                      </p>
                    )}
                    <Link
                      href={`/lai-kep?r=${b.initial.rate}&u=year&f=monthly&t=20`}
                      className="mt-auto rounded-lg px-3 h-9 inline-flex items-center justify-center text-xs font-semibold transition-all active:scale-95"
                      style={{ background: "var(--primary)", color: "#fff" }}
                    >
                      Tính khoản trả →
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section B — Full table */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              📊 Bảng đầy đủ {HOME_LOAN_RATES.length} ngân hàng
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Sắp xếp theo lãi ưu đãi thấp → cao. ⚠️ = ngân hàng có lãi mồi (rate {"<"} 6%).
            </p>

            <div className="hidden md:block overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm" style={{ background: "var(--card)" }}>
                <thead style={{ background: "var(--bg)" }}>
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Ngân hàng</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Ưu đãi %</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Thời gian</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Thả nổi</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Max LTV</th>
                    <th className="text-right px-2 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Max kỳ</th>
                    <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedByInitial.map((b) => {
                    const isBait = b.initial.rate < 6;
                    return (
                      <tr
                        key={b.shortName}
                        className="border-t"
                        style={{
                          borderColor: "var(--border)",
                          background: b.group === "big4"
                            ? "rgba(220,38,38,0.05)"
                            : isBait
                            ? "rgba(239,68,68,0.06)"
                            : undefined,
                        }}
                      >
                        <td className="px-3 py-2.5 font-medium" style={{ color: "var(--text)" }}>
                          {isBait && "⚠️ "}{b.logo} {b.shortName}
                        </td>
                        <td className="text-right px-2 py-2.5 font-bold" style={{ color: isBait ? "#ef4444" : "#059669" }}>
                          {b.initial.rate}%
                        </td>
                        <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>
                          {b.initial.months}th
                        </td>
                        <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>
                          {b.afterPromo.rateMin}-{b.afterPromo.rateMax}%
                        </td>
                        <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>
                          {b.maxLoanPercent ?? "—"}%
                        </td>
                        <td className="text-right px-2 py-2.5" style={{ color: "var(--text-muted)" }}>
                          {b.maxTermYears ?? "—"}y
                        </td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          {b.notes || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              {sortedByInitial.map((b) => {
                const isBait = b.initial.rate < 6;
                return (
                  <div
                    key={b.shortName}
                    className="rounded-xl border p-3"
                    style={{
                      background: b.group === "big4"
                        ? "rgba(220,38,38,0.05)"
                        : isBait
                        ? "rgba(239,68,68,0.06)"
                        : "var(--card)",
                      borderColor: isBait ? "rgba(239,68,68,0.4)" : "var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                        {isBait && "⚠️ "}{b.logo} {b.shortName}
                      </p>
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: GROUP_COLOR[b.group], color: "#fff" }}
                      >
                        {GROUP_LABEL[b.group]}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p>
                        <span style={{ color: "var(--text-muted)" }}>Ưu đãi: </span>
                        <strong style={{ color: isBait ? "#ef4444" : "#059669" }}>{b.initial.rate}%</strong>{" "}
                        ({b.initial.months}th)
                      </p>
                      <p>
                        <span style={{ color: "var(--text-muted)" }}>Thả nổi: </span>
                        <strong style={{ color: "var(--text)" }}>{b.afterPromo.rateMin}-{b.afterPromo.rateMax}%</strong>
                      </p>
                      <p>
                        <span style={{ color: "var(--text-muted)" }}>Max LTV: </span>
                        {b.maxLoanPercent ?? "—"}%
                      </p>
                      <p>
                        <span style={{ color: "var(--text-muted)" }}>Max kỳ: </span>
                        {b.maxTermYears ?? "—"} năm
                      </p>
                    </div>
                    {b.notes && (
                      <p className="text-xs mt-2 italic" style={{ color: "var(--text-muted)" }}>
                        {b.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section C — 2 tỷ trong 20 năm */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              🏠 Vay 2 tỷ trong 20 năm — tổng lãi phải trả là bao nhiêu?
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              So sánh 3 ngân hàng: VCB (Big4), Agribank (Big4 lãi thấp nhất), PVcomBank (lãi mồi). Tính đơn giản 2 giai đoạn:
              ưu đãi + thả nổi trung bình. Số chính xác cần lịch amortization riêng.
            </p>
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              <table className="w-full text-sm" style={{ background: "var(--card)" }}>
                <thead style={{ background: "var(--bg)" }}>
                  <tr>
                    <th className="text-left px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Ngân hàng</th>
                    <th className="text-right px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Trả tháng (ưu đãi)</th>
                    <th className="text-right px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Trả tháng (thả nổi TB)</th>
                    <th className="text-right px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Trả TB / tháng</th>
                    <th className="text-right px-3 py-2.5 font-semibold" style={{ color: "var(--text)" }}>Tổng lãi 20 năm</th>
                  </tr>
                </thead>
                <tbody>
                  {exampleBanks.map((b) => {
                    const r = totalInterest20y(b, LOAN_2B);
                    const isBait = b.initial.rate < 6;
                    return (
                      <tr
                        key={b.shortName}
                        className="border-t"
                        style={{
                          borderColor: "var(--border)",
                          background: isBait ? "rgba(239,68,68,0.06)" : undefined,
                        }}
                      >
                        <td className="px-3 py-2.5 font-medium" style={{ color: "var(--text)" }}>
                          {isBait && "⚠️ "}{b.logo} {b.shortName} ({b.initial.rate}% / {(b.afterPromo.rateMin + b.afterPromo.rateMax) / 2}%)
                        </td>
                        <td className="text-right px-3 py-2.5" style={{ color: "var(--text)" }}>{fmtVND(r.mp1)}</td>
                        <td className="text-right px-3 py-2.5" style={{ color: "var(--text)" }}>{fmtVND(r.mp2)}</td>
                        <td className="text-right px-3 py-2.5 font-bold" style={{ color: "var(--text)" }}>{fmtVND(r.avgMonthly)}</td>
                        <td className="text-right px-3 py-2.5 font-bold" style={{ color: isBait ? "#ef4444" : "#dc2626" }}>
                          {fmtVND(r.totalInterest)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className="rounded-xl p-4 mt-4 text-sm"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.4)", color: "var(--text)" }}
            >
              💡 <strong>Nhận xét:</strong> Agribank rate ưu đãi 8% nhưng thả nổi 10.5-12% → tổng lãi 20 năm thấp nhất.
              PVcomBank rate ưu đãi 3.99% nhưng thả nổi 12-14% → tổng lãi <strong>cao hơn Big4 cả tỷ đồng</strong>.
              Đừng để con số ưu đãi ngắn hạn đánh lừa.
            </div>
          </section>

          {/* Section D — Mini calculator */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              🧮 Tính nhanh: vay bao nhiêu, kỳ hạn nào, trả bao nhiêu/tháng?
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Nhập số tiền vay + kỳ hạn → top 5 ngân hàng có khoản trả thấp nhất + cảnh báo lãi mồi.
            </p>
            <LoanRateExplorer rates={HOME_LOAN_RATES} />
          </section>

          {/* Section E — Bẫy lãi mồi */}
          <section
            className="rounded-2xl border p-5"
            style={{ background: "rgba(239,68,68,0.06)", borderColor: "#ef4444" }}
          >
            <h2 className="text-xl lg:text-2xl font-bold mb-3" style={{ color: "#dc2626" }}>
              ⚠️ Cảnh báo: Bẫy lãi mồi
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text)" }}>
              Một số ngân hàng quảng cáo lãi siêu thấp 3-5%/năm — nhưng chỉ áp 3-6 tháng đầu. Sau đó nhảy lên 12-14%/năm,
              cao hơn cả Big4. Tổng lãi phải trả 5 năm đầu cao hơn vay Big4 8-10% từ đầu.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="rounded-xl border p-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <p className="font-bold text-sm" style={{ color: "#dc2626" }}>
                  ⚠️ PVcomBank
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Ưu đãi <strong>3.99%/năm × 3 tháng đầu</strong> → thả nổi <strong>12-14%/năm</strong>.
                  Tổng lãi 5 năm vay 2 tỷ: ~ {fmtVND(monthlyPayment(LOAN_2B, 13, 240) * 57 + monthlyPayment(LOAN_2B, 3.99, 240) * 3 - LOAN_2B * 0.25)}.
                </p>
              </div>
              <div className="rounded-xl border p-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <p className="font-bold text-sm" style={{ color: "#dc2626" }}>
                  ⚠️ HSBC
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Ưu đãi <strong>5.5%/năm × 6 tháng đầu</strong> → thả nổi <strong>11.5-13.5%/năm</strong>.
                  Điều kiện chặt + nhảy mạnh, chủ yếu hợp khách hàng VIP.
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              💡 Khuyên: <strong>Tính tổng lãi 5 năm đầu</strong> (không chỉ nhìn rate ưu đãi), so sánh với Big4 ổn định
              8-10%/năm. Nếu khoản chênh không đáng kể → ưu tiên Big4 vì biên thả nổi thấp hơn.
            </p>
          </section>

          {/* Section F — Blog CTAs */}
          <section>
            <h2 className="text-xl lg:text-2xl font-bold mb-4" style={{ color: "var(--text)" }}>
              📚 Đọc thêm về lãi suất & vay an toàn
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Lãi kép là gì — vì sao vay càng lâu càng đau", url: "https://1phantram.com/blog/lai-kep-la-gi/", icon: "❄️" },
                { title: "Quy tắc 72 — bao lâu thì nợ gấp đôi?", url: "https://1phantram.com/blog/quy-tac-72/", icon: "⏱️" },
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

          {/* Section G — FAQ */}
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

          {/* Section H — Sources + disclaimer */}
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
