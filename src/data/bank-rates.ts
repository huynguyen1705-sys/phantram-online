// Bank rates data — cập nhật thủ công định kỳ (hoặc qua cron weekly sau này).
// Last updated: 2026-06-15 (nguồn: cafef.vn 13/6, saigoneconomy.net 14/6, kenh14.vn 10/6, vn.investing.com 3/6, kinhtetieudung.vn 5/2026)
// Lưu ý: chỉ tham khảo, lãi suất thực tế khác theo chi nhánh + hồ sơ.

export interface SavingsRate {
  bank: string;
  shortName: string;
  logo?: string;     // emoji hoặc text fallback
  group: "big4" | "joint-stock-large" | "joint-stock-mid" | "joint-stock-small" | "foreign";
  rates: {
    m1: number | null;   // 1 tháng (%/năm)
    m3: number | null;
    m6: number | null;
    m9: number | null;
    m12: number;         // 12 tháng (chính, luôn có)
    m18: number | null;
    m24: number | null;
  };
  notes?: string;
}

export interface LoanRate {
  bank: string;
  shortName: string;
  logo?: string;
  group: "big4" | "joint-stock-large" | "joint-stock-mid" | "foreign";
  type: "home" | "consumer" | "business";
  initial: {
    rate: number;        // % ưu đãi
    months: number;      // số tháng cố định
  };
  afterPromo: {
    rateMin: number;     // % thả nổi min
    rateMax: number;     // % thả nổi max
    formula?: string;    // công thức tham chiếu
  };
  maxLoanPercent?: number;  // % giá trị tài sản
  maxTermYears?: number;
  notes?: string;
}

// ─── Savings rates ─── (đã sort theo m12 desc)
export const SAVINGS_RATES_12M: SavingsRate[] = [
  { bank: "MBV (MB Việt)", shortName: "MBV", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.5, m3: 4.5, m6: 7.0, m9: 7.0, m12: 7.0, m18: 7.0, m24: 7.0 },
    notes: "Cao nhất thị trường, áp đồng đều 6-18 tháng" },
  { bank: "VCBNeo", shortName: "VCBNeo", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.5, m3: 4.5, m6: 7.0, m9: 7.0, m12: 7.0, m18: 7.0, m24: null },
    notes: "Áp 7%/năm kỳ hạn 6-18 tháng" },
  { bank: "PGBank", shortName: "PGBank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.5, m3: 4.5, m6: 6.9, m9: 6.85, m12: 7.0, m18: 6.95, m24: null } },
  { bank: "VIB", shortName: "VIB", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.5, m3: 4.6, m6: 6.5, m9: 6.7, m12: 7.0, m18: 6.95, m24: null } },
  { bank: "LPBank", shortName: "LPBank", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.4, m3: 4.5, m6: 6.8, m9: 6.85, m12: 6.9, m18: 6.95, m24: null } },
  { bank: "Bac A Bank", shortName: "BacABank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.5, m3: 4.6, m6: 6.85, m9: 6.85, m12: 6.9, m18: 6.9, m24: null } },
  { bank: "BVBank", shortName: "BVBank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.5, m3: 4.6, m6: 6.7, m9: 6.8, m12: 6.9, m18: 6.9, m24: null } },
  { bank: "OCB", shortName: "OCB", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.4, m3: 4.5, m6: 6.5, m9: 6.7, m12: 6.9, m18: 6.85, m24: null } },
  { bank: "Nam A Bank", shortName: "NamABank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.4, m3: 4.5, m6: 6.5, m9: 6.6, m12: 6.85, m18: 6.9, m24: null } },
  { bank: "Vietcombank", shortName: "VCB", logo: "🏛️", group: "big4",
    rates: { m1: 4.75, m3: 4.75, m6: 6.6, m9: 6.6, m12: 6.8, m18: 6.8, m24: 6.8 },
    notes: "Big4 — đồng nhất 4 ngân hàng quốc doanh" },
  { bank: "BIDV", shortName: "BIDV", logo: "🏛️", group: "big4",
    rates: { m1: 4.75, m3: 4.75, m6: 6.6, m9: 6.6, m12: 6.8, m18: 6.8, m24: 6.8 } },
  { bank: "VietinBank", shortName: "VietinBank", logo: "🏛️", group: "big4",
    rates: { m1: 4.75, m3: 4.75, m6: 6.6, m9: 6.6, m12: 6.8, m18: 6.8, m24: 6.8 } },
  { bank: "Agribank", shortName: "Agribank", logo: "🏛️", group: "big4",
    rates: { m1: 4.75, m3: 4.75, m6: 6.6, m9: 6.6, m12: 6.8, m18: 6.8, m24: 6.8 } },
  { bank: "Techcombank", shortName: "TCB", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.5, m3: 4.6, m6: 6.3, m9: 6.5, m12: 6.75, m18: 6.7, m24: null } },
  { bank: "Sacombank", shortName: "Sacombank", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.4, m3: 4.5, m6: 6.3, m9: 6.4, m12: 6.6, m18: 6.6, m24: null } },
  { bank: "SHB", shortName: "SHB", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.4, m3: 4.5, m6: 6.2, m9: 6.3, m12: 6.5, m18: 6.5, m24: null } },
  { bank: "MB", shortName: "MB", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.3, m3: 4.4, m6: 6.0, m9: 6.2, m12: 6.35, m18: 6.4, m24: null } },
  { bank: "VPBank", shortName: "VPBank", logo: "🏦", group: "joint-stock-large",
    rates: { m1: 4.3, m3: 4.4, m6: 5.9, m9: 6.1, m12: 6.3, m18: 6.3, m24: null } },
  { bank: "TPBank", shortName: "TPBank", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.3, m3: 4.4, m6: 5.8, m9: 6.0, m12: 6.25, m18: 6.3, m24: null } },
  { bank: "Eximbank", shortName: "EIB", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.2, m3: 4.3, m6: 5.0, m9: 5.2, m12: 5.6, m18: 5.6, m24: null } },
  { bank: "HDBank", shortName: "HDBank", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.2, m3: 4.3, m6: 4.8, m9: 5.0, m12: 5.3, m18: 5.4, m24: null } },
  { bank: "SeABank", shortName: "SeABank", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 4.2, m3: 4.3, m6: 4.9, m9: 5.0, m12: 5.4, m18: 5.5, m24: null } },
  { bank: "KienlongBank", shortName: "KLB", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.2, m3: 4.3, m6: 4.8, m9: 5.0, m12: 5.3, m18: 5.4, m24: null } },
  { bank: "GPBank", shortName: "GPBank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.2, m3: 4.3, m6: 4.8, m9: 5.0, m12: 5.3, m18: 5.4, m24: null } },
  { bank: "PVcomBank", shortName: "PVcomBank", logo: "🏦", group: "joint-stock-small",
    rates: { m1: 4.2, m3: 4.3, m6: 4.9, m9: 5.0, m12: 5.5, m18: 5.5, m24: null } },
  { bank: "SCB", shortName: "SCB", logo: "🏦", group: "joint-stock-mid",
    rates: { m1: 3.5, m3: 3.5, m6: 3.6, m9: 3.6, m12: 3.7, m18: 3.7, m24: null },
    notes: "Thấp nhất thị trường — đang tái cơ cấu" },
];

// ─── Home loan rates ─── (vay mua nhà)
export const HOME_LOAN_RATES: LoanRate[] = [
  { bank: "Vietcombank", shortName: "VCB", logo: "🏛️", group: "big4", type: "home",
    initial: { rate: 9.6, months: 6 },
    afterPromo: { rateMin: 11.0, rateMax: 12.5, formula: "Lãi tiết kiệm 24th + 3.3%" },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Hoặc 10.5%/năm cố định 12 tháng đầu" },
  { bank: "BIDV", shortName: "BIDV", logo: "🏛️", group: "big4", type: "home",
    initial: { rate: 9.7, months: 6 },
    afterPromo: { rateMin: 11.5, rateMax: 13.5 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Gói 18 tháng cố định có thể lên 13.5%/năm" },
  { bank: "VietinBank", shortName: "CTG", logo: "🏛️", group: "big4", type: "home",
    initial: { rate: 10.5, months: 12 },
    afterPromo: { rateMin: 12.0, rateMax: 13.0 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Cố định 24 tháng > 12%/năm" },
  { bank: "Agribank", shortName: "AGR", logo: "🏛️", group: "big4", type: "home",
    initial: { rate: 8.0, months: 6 },
    afterPromo: { rateMin: 10.5, rateMax: 12.0 },
    maxLoanPercent: 75, maxTermYears: 30,
    notes: "Lãi thấp nhất nhóm Big4; 8.5% (12th) / 9.8% (18th)" },
  { bank: "Techcombank", shortName: "TCB", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 9.5, months: 12 },
    afterPromo: { rateMin: 11.5, rateMax: 13.5, formula: "Lãi tiết kiệm 13th + 3.5%" },
    maxLoanPercent: 70, maxTermYears: 30 },
  { bank: "MB Bank", shortName: "MB", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 9.0, months: 12 },
    afterPromo: { rateMin: 10.5, rateMax: 12.5 },
    maxLoanPercent: 75, maxTermYears: 25,
    notes: "Gói cạnh tranh nhất khối tư nhân" },
  { bank: "ACB", shortName: "ACB", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 9.5, months: 12 },
    afterPromo: { rateMin: 11.0, rateMax: 12.5 },
    maxLoanPercent: 70, maxTermYears: 25 },
  { bank: "VIB", shortName: "VIB", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 9.5, months: 6 },
    afterPromo: { rateMin: 11.0, rateMax: 13.0 },
    maxLoanPercent: 70, maxTermYears: 30,
    notes: "Lên tới 12%/năm tùy kỳ cố định" },
  { bank: "TPBank", shortName: "TPBank", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 10.5, months: 12 },
    afterPromo: { rateMin: 11.5, rateMax: 13.0 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Hoặc 11.5%/năm cố định 18 tháng" },
  { bank: "OCB", shortName: "OCB", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 10.75, months: 6 },
    afterPromo: { rateMin: 11.5, rateMax: 13.5, formula: "Lãi cơ sở 13th + 3.25-3.5%" },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Hoặc 11.5%/năm cố định 12 tháng" },
  { bank: "UOB", shortName: "UOB", logo: "🌐", group: "foreign", type: "home",
    initial: { rate: 8.7, months: 12 },
    afterPromo: { rateMin: 11.0, rateMax: 12.5 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Ngân hàng nước ngoài — điều kiện chặt" },
  { bank: "HSBC", shortName: "HSBC", logo: "🌐", group: "foreign", type: "home",
    initial: { rate: 5.5, months: 6 },
    afterPromo: { rateMin: 11.5, rateMax: 13.5 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "Ưu đãi cực thấp 6 tháng đầu, điều kiện chặt + nhảy mạnh sau ưu đãi" },
  { bank: "PVcomBank", shortName: "PVcomBank", logo: "🏦", group: "joint-stock-large", type: "home",
    initial: { rate: 3.99, months: 3 },
    afterPromo: { rateMin: 12.0, rateMax: 14.0 },
    maxLoanPercent: 70, maxTermYears: 25,
    notes: "⚠️ Lãi mồi cực thấp 3 tháng đầu — cẩn trọng" },
];

export const META = {
  lastUpdated: "2026-06-15",
  sources: [
    { name: "cafef.vn", url: "https://cafef.vn", date: "2026-06-13" },
    { name: "saigoneconomy.net", url: "https://saigoneconomy.net", date: "2026-06-14" },
    { name: "vn.investing.com", url: "https://vn.investing.com", date: "2026-06-03" },
    { name: "kinhtetieudung.vn", url: "https://kinhtetieudung.vn", date: "2026-06-04" },
  ],
  disclaimer:
    "Dữ liệu lãi suất chỉ mang tính tham khảo, cập nhật từ báo cáo công khai. Lãi suất thực tế có thể khác tùy chi nhánh, hồ sơ khách hàng, kỳ hạn cụ thể và thời điểm. Vui lòng liên hệ ngân hàng để xác nhận chính xác trước khi quyết định.",
};
