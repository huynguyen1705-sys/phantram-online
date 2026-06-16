// Shared tab metadata — importable từ cả server + client component.
// File này KHÔNG có "use client" để server component (page.tsx) đọc được TABS array thực, không bị Next 15 serialize-reference proxy.

export type TabId =
  | "percent-of"
  | "what-percent"
  | "change"
  | "increase-decrease"
  | "find-base"
  | "discount"
  | "compare"
  | "tip"
  | "interest"
  | "compound"
  | "salary-tax"
  | "breakeven"
  | "recipe-scale"
  | "weight-bmi"
  | "time-progress"
  | "soi-sale";

export const TAB_URL_MAP: Record<TabId, string> = {
  "percent-of": "/tinh-phan-tram",
  "what-percent": "/bao-nhieu-phan-tram",
  "change": "/phan-tram-tang-giam",
  "increase-decrease": "/tinh-tang-giam-theo-phan-tram",
  "find-base": "/tim-gia-tri-goc",
  "discount": "/tinh-giam-gia",
  "compare": "/so-sanh-gia",
  "tip": "/chia-bill-tip",
  "interest": "/lai-suat-don",
  "compound": "/lai-kep",
  "salary-tax": "/luong-net",
  "breakeven": "/break-even",
  "recipe-scale": "/scale-cong-thuc",
  "weight-bmi": "/bmi",
  "time-progress": "/phan-tram-thoi-gian",
  "soi-sale": "/soi-sale",
};

export const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "percent-of", label: "% của giá trị", icon: "%" },
  { id: "what-percent", label: "Bao nhiêu %", icon: "?" },
  { id: "change", label: "Tăng/Giảm %", icon: "↕" },
  { id: "increase-decrease", label: "Tăng/Giảm theo %", icon: "→" },
  { id: "find-base", label: "Tìm giá trị gốc", icon: "◎" },
  { id: "discount", label: "Giảm giá / Sale", icon: "🏷" },
  { id: "compare", label: "So sánh 2 giá", icon: "⚡" },
  { id: "tip", label: "Tip & Chia bill", icon: "🍽" },
  { id: "interest", label: "Lãi suất đơn", icon: "💰" },
  { id: "compound", label: "Lãi kép", icon: "📈" },
  { id: "salary-tax", label: "Lương Net (Thuế TNCN)", icon: "💼" },
  { id: "breakeven", label: "Hoàn vốn / Break-even", icon: "📉" },
  { id: "recipe-scale", label: "Scale công thức", icon: "🍳" },
  { id: "weight-bmi", label: "Giảm cân & BMI", icon: "⚖️" },
  { id: "time-progress", label: "% Thời gian", icon: "📅" },
  { id: "soi-sale", label: "Soi sale Shopee/Lazada", icon: "🛒" },
];

export const TAB_DESCRIPTIONS: Record<TabId, string> = {
  "percent-of": "Tính nhanh X% của một số bất kỳ. VD: 30% của 200.000đ = 60.000đ",
  "what-percent": "Số A là bao nhiêu phần trăm của số B. VD: 80/200 = 40%",
  "change": "Tính % tăng giảm giữa 2 giá trị mới và cũ",
  "increase-decrease": "Tăng hoặc giảm 1 số theo % cho trước",
  "find-base": "Biết kết quả và %, tìm giá trị ban đầu (số gốc)",
  "discount": "Tính giá sau giảm hoặc % giảm giá khi shopping sale",
  "compare": "So sánh 2 mức giá — chênh lệch tuyệt đối và %",
  "tip": "Chia bill nhà hàng theo nhóm + tính tip %",
  "interest": "Tính lãi suất đơn theo vốn × lãi × thời gian",
  "compound": "Tính lãi kép — vốn × (1+lãi)^kỳ — đầu tư, tiết kiệm",
  "salary-tax": "Tính lương Net sau BHXH + thuế TNCN lũy tiến 2026",
  "breakeven": "Tính % cần lãi để bù lỗ, BEP bán hàng, thời gian hoàn vốn đầu tư",
  "recipe-scale": "Scale công thức nấu ăn cho nhiều/ít người ăn",
  "weight-bmi": "Tính BMI chuẩn châu Á + mục tiêu giảm cân + TDEE calo",
  "time-progress": "Tính % đã qua của năm, tháng, ngày — share Facebook",
  "soi-sale": "Soi sale Shopee/Lazada/Tiki — phát hiện fake giá, tính giá cuối thực sự",
};

export const TAB_GROUPS: { id: string; label: string; icon: string; tabs: TabId[] }[] = [
  { id: "basic", label: "Cơ bản", icon: "🧮", tabs: ["percent-of", "what-percent", "change", "increase-decrease", "find-base"] },
  { id: "finance", label: "Tài chính", icon: "💰", tabs: ["interest", "compound", "salary-tax", "breakeven"] },
  { id: "shopping", label: "Mua sắm", icon: "🛒", tabs: ["discount", "compare", "tip", "soi-sale"] },
  { id: "daily", label: "Tiện ích", icon: "🛠", tabs: ["recipe-scale", "weight-bmi"] },
  { id: "time", label: "Thời gian", icon: "📅", tabs: ["time-progress"] },
];
