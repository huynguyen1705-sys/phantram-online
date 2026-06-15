"use client";
import { useState, useEffect, useMemo, Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import BlogSection from "./BlogSection";
import IntroSEO from "./IntroSEO";
import ShareModal from "./ShareModal";
import {
  buildShareUrl,
  buildOgImageUrl,
  decodeBMI,
  decodeSalaryTax,
  decodeCompound,
  decodeDiscount,
  decodeBreakeven,
  decodeTip,
  decodeTimeProgress,
  type DecodedBMI,
  type DecodedSalaryTax,
  type DecodedCompound,
  type DecodedDiscount,
  type DecodedBreakeven,
  type DecodedTip,
  type DecodedTimeProgress,
} from "@/lib/share-state";

function ShareButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 w-full rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
      style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" }}
    >
      📤 Share kết quả
    </button>
  );
}

export type TabId = "percent-of" | "what-percent" | "change" | "increase-decrease" | "find-base" | "discount" | "compare" | "tip" | "interest" | "compound" | "salary-tax" | "breakeven" | "recipe-scale" | "weight-bmi" | "time-progress";

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
};

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
};

interface HistoryItem {
  id: number;
  label: string;
  result: string;
  time: string;
}

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
];

export const TAB_GROUPS: { id: string; label: string; icon: string; tabs: TabId[] }[] = [
  { id: "basic", label: "Cơ bản", icon: "🧮", tabs: ["percent-of", "what-percent", "change", "increase-decrease", "find-base"] },
  { id: "finance", label: "Tài chính", icon: "💰", tabs: ["interest", "compound", "salary-tax", "breakeven"] },
  { id: "shopping", label: "Mua sắm", icon: "🛒", tabs: ["discount", "compare", "tip"] },
  { id: "daily", label: "Tiện ích", icon: "🛠", tabs: ["recipe-scale", "weight-bmi"] },
  { id: "time", label: "Thời gian", icon: "📅", tabs: ["time-progress"] },
];

function formatNum(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  if (abs >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " triệu";
  const s = n.toFixed(4).replace(/\.?0+$/, "");
  return parseFloat(s).toLocaleString("vi-VN");
}

function NumInput({
  value, onChange, placeholder, label, suffix,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; label?: string; suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>{label}</label>}
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder || "0"}
          className="w-full rounded-xl border px-4 py-3 text-lg font-semibold outline-none transition-all focus:ring-2 focus:ring-blue-400"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
          inputMode="decimal"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-bold text-blue-500">{suffix}</span>
        )}
      </div>
    </div>
  );
}

function ResultBox({ result, formula, onCopy, copied }: { result: string; formula?: string; onCopy: () => void; copied: boolean }) {
  if (!result || result === "—") return null;
  return (
    <div className="mt-4 rounded-2xl p-4 slide-in" style={{ background: "var(--result-bg)" }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Kết quả</p>
          <p className="text-2xl font-bold truncate" style={{ color: "var(--result-text)" }}>{result}</p>
          {formula && <p className="text-xs mt-1 opacity-70" style={{ color: "var(--text-muted)" }}>{formula}</p>}
        </div>
        <button
          onClick={onCopy}
          className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95"
          style={{ background: copied ? "#22c55e" : "var(--primary)", color: "#fff" }}
        >
          {copied ? "✓ Đã copy" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// ────────── Tabs ──────────

function TabPercentOf() {
  const [p, setP] = useState(""); const [v, setV] = useState(""); const [copied, setCopied] = useState(false);
  const result = p !== "" && v !== "" ? formatNum((parseFloat(p) / 100) * parseFloat(v)) : "";
  const formula = result !== "—" && result ? `${p}% × ${v} = ${result}` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính <strong>X%</strong> của một số</p>
      <NumInput label="Phần trăm (%)" value={p} onChange={setP} placeholder="VD: 20" suffix="%" />
      <NumInput label="Giá trị" value={v} onChange={setV} placeholder="VD: 80" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

function TabWhatPercent() {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [copied, setCopied] = useState(false);
  const pct = a !== "" && b !== "" && parseFloat(b) !== 0 ? (parseFloat(a) / parseFloat(b)) * 100 : NaN;
  const result = isNaN(pct) ? "" : formatNum(pct) + "%";
  const formula = result ? `${a} ÷ ${b} × 100 = ${result}` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>X là bao nhiêu % của Y?</p>
      <NumInput label="Số X" value={a} onChange={setA} placeholder="VD: 20" />
      <NumInput label="Số Y" value={b} onChange={setB} placeholder="VD: 80" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

function TabChange() {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [copied, setCopied] = useState(false);
  const pct = a !== "" && b !== "" && parseFloat(a) !== 0 ? ((parseFloat(b) - parseFloat(a)) / parseFloat(a)) * 100 : NaN;
  const dir = !isNaN(pct) ? (pct >= 0 ? "tăng" : "giảm") : "";
  const result = isNaN(pct) ? "" : `${dir} ${formatNum(Math.abs(pct))}%`;
  const formula = result ? `(${b} - ${a}) ÷ ${a} × 100 = ${pct >= 0 ? "+" : ""}${formatNum(pct)}%` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Giá trị thay đổi bao nhiêu %?</p>
      <NumInput label="Giá trị ban đầu" value={a} onChange={setA} placeholder="VD: 80" />
      <NumInput label="Giá trị mới" value={b} onChange={setB} placeholder="VD: 100" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

function TabIncreaseDecrease() {
  const [v, setV] = useState(""); const [p, setP] = useState(""); const [mode, setMode] = useState<"inc" | "dec">("inc"); const [copied, setCopied] = useState(false);
  const n = v !== "" && p !== "" ? parseFloat(v) * (1 + (mode === "inc" ? 1 : -1) * parseFloat(p) / 100) : NaN;
  const result = isNaN(n) ? "" : formatNum(n);
  const diff = !isNaN(n) ? formatNum(Math.abs(n - parseFloat(v))) : "";
  const formula = result ? `${v} ${mode === "inc" ? "+" : "-"} ${p}% = ${result} (${mode === "inc" ? "+" : "-"}${diff})` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tăng hoặc giảm một số theo %</p>
      <div className="flex gap-2">
        <button onClick={() => setMode("inc")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "inc" ? "tab-active" : ""}`} style={mode === "inc" ? {} : { background: "var(--border)", color: "var(--text)" }}>▲ Tăng</button>
        <button onClick={() => setMode("dec")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "dec" ? "tab-active" : ""}`} style={mode === "dec" ? {} : { background: "var(--border)", color: "var(--text)" }}>▼ Giảm</button>
      </div>
      <NumInput label="Giá trị ban đầu" value={v} onChange={setV} placeholder="VD: 100" />
      <NumInput label="Phần trăm (%)" value={p} onChange={setP} placeholder="VD: 10" suffix="%" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

function TabFindBase() {
  const [x, setX] = useState(""); const [pct, setPct] = useState(""); const [copied, setCopied] = useState(false);
  const base = x !== "" && pct !== "" && parseFloat(pct) !== 0 ? parseFloat(x) * 100 / parseFloat(pct) : NaN;
  const result = isNaN(base) ? "" : formatNum(base);
  const formula = result ? `${x} × 100 ÷ ${pct} = ${result}` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>X là Y% của số nào?</p>
      <NumInput label="Số X" value={x} onChange={setX} placeholder="VD: 10" />
      <NumInput label="Y %" value={pct} onChange={setPct} placeholder="VD: 5" suffix="%" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

function TabDiscount({ initial }: { initial?: DecodedDiscount } = {}) {
  const [orig, setOrig] = useState(initial?.original ?? "");
  const [disc, setDisc] = useState(initial?.discountPercent ?? "");
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const salePrice = orig !== "" && disc !== "" ? parseFloat(orig) * (1 - parseFloat(disc) / 100) : NaN;
  const saved = !isNaN(salePrice) ? parseFloat(orig) - salePrice : NaN;
  const result = isNaN(salePrice) ? "" : `${formatNum(salePrice)} ₫`;
  const formula = result ? `Tiết kiệm: ${formatNum(saved)} ₫ | Giá gốc: ${formatNum(parseFloat(orig))} ₫` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const shareData = useMemo(() => {
    if (isNaN(salePrice)) return null;
    const state = { tab: "discount" as const, original: orig, discountPercent: disc };
    return {
      url: buildShareUrl(state),
      ogImageUrl: buildOgImageUrl(state),
      title: "Kết quả tính giảm giá",
      text: `Giá gốc: ${formatNum(parseFloat(orig))} ₫
Giảm: ${disc}%
Giá sale: ${formatNum(salePrice)} ₫
Tiết kiệm: ${formatNum(saved)} ₫`,
    };
  }, [orig, disc, salePrice, saved]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Giá sale sau khi giảm %</p>
      <NumInput label="Giá gốc (₫)" value={orig} onChange={setOrig} placeholder="VD: 500000" />
      <NumInput label="Giảm giá (%)" value={disc} onChange={setDisc} placeholder="VD: 20" suffix="%" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
      {!isNaN(salePrice) && (
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Giá sale</p>
            <p className="font-bold text-green-500">{formatNum(salePrice)} ₫</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Tiết kiệm</p>
            <p className="font-bold text-red-400">{formatNum(saved)} ₫</p>
          </div>
        </div>
      )}
      {shareData && (
        <>
          <ShareButton onClick={() => setShareOpen(true)} />
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={shareData.url}
            title={shareData.title}
            text={shareData.text}
            ogImageUrl={shareData.ogImageUrl}
          />
        </>
      )}
    </div>
  );
}

function TabCompare() {
  const [a, setA] = useState(""); const [b, setB] = useState(""); const [copied, setCopied] = useState(false);
  const aNum = parseFloat(a); const bNum = parseFloat(b);
  const diff = a !== "" && b !== "" ? Math.abs(aNum - bNum) : NaN;
  const pct = !isNaN(diff) && aNum !== 0 ? (diff / aNum) * 100 : NaN;
  const higher = !isNaN(diff) ? (bNum > aNum ? "B cao hơn A" : bNum < aNum ? "A cao hơn B" : "Bằng nhau") : "";
  const result = isNaN(pct) ? "" : `${formatNum(pct)}%`;
  const formula = result ? `Chênh lệch: ${formatNum(diff)} | ${higher}` : "";
  const copy = () => { navigator.clipboard?.writeText(`${result} — ${formula}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>So sánh 2 giá trị — chênh lệch bao nhiêu %?</p>
      <NumInput label="Giá trị A (gốc)" value={a} onChange={setA} placeholder="VD: 100" />
      <NumInput label="Giá trị B (so sánh)" value={b} onChange={setB} placeholder="VD: 120" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

// ───────── TabTip: 3 modes ─────────
type TipPerson = { id: string; name: string };
type TipDish = { id: string; name: string; price: string; sharedBy: string[] };

const TIP_PRESETS = ["0", "5", "10", "15", "20"];
const VAT_PRESETS = ["0", "8", "10"];

function shortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

function encodePeople(people: TipPerson[]): string {
  return people.map(p => p.name.replaceAll("|", "/").replaceAll(":", "-")).join("|");
}
function encodeDishes(dishes: TipDish[], people: TipPerson[]): string {
  return dishes.map(d => {
    const idxList = d.sharedBy.map(pid => people.findIndex(p => p.id === pid)).filter(i => i >= 0).join(",");
    return `${d.name.replaceAll("|", "/").replaceAll(":", "-")}:${d.price || "0"}:${idxList}`;
  }).join("|");
}
function decodePeople(s: string | undefined): TipPerson[] | null {
  if (!s) return null;
  return s.split("|").map(name => ({ id: shortId(), name }));
}
function decodeDishes(s: string | undefined, people: TipPerson[]): TipDish[] | null {
  if (!s) return null;
  return s.split("|").map(raw => {
    const parts = raw.split(":");
    const name = parts[0] ?? "";
    const price = parts[1] ?? "";
    const idxList = (parts[2] ?? "").split(",").map(x => parseInt(x)).filter(n => !isNaN(n) && n >= 0 && n < people.length);
    return { id: shortId(), name, price, sharedBy: idxList.map(i => people[i].id) };
  });
}

function formatVND(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "—";
  return Math.round(n).toLocaleString("vi-VN") + " ₫";
}

function TabTip({ initial }: { initial?: DecodedTip } = {}) {
  const [mode, setMode] = useState<"equal" | "byItem" | "custom">(initial?.mode ?? "equal");
  const [copied, setCopied] = useState(false);
  const [tableCopied, setTableCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Common: VAT + Tip + tipOnVat
  const [vatPct, setVatPct] = useState(initial?.vat ?? "8");
  const [tipPct, setTipPct] = useState(initial?.tip ?? "0");
  const [tipOnVat, setTipOnVat] = useState<boolean>(initial?.tipOnVat ? initial.tipOnVat === "1" : true);

  // Mode A — equal
  const [bill, setBill] = useState(initial?.total ?? "");
  const [people, setPeople] = useState(initial?.n ?? "2");

  // Mode B — byItem (people list + dishes)
  const initialPeopleB = useMemo(() => {
    if (initial?.mode === "byItem" && initial.p) {
      const arr = decodePeople(initial.p);
      if (arr && arr.length) return arr;
    }
    return [
      { id: shortId(), name: "Người 1" },
      { id: shortId(), name: "Người 2" },
      { id: shortId(), name: "Người 3" },
    ];
  }, [initial]);
  const [bPeople, setBPeople] = useState<TipPerson[]>(initialPeopleB);
  const initialDishes = useMemo(() => {
    if (initial?.mode === "byItem" && initial.d && initialPeopleB.length) {
      const arr = decodeDishes(initial.d, initialPeopleB);
      if (arr && arr.length) return arr;
    }
    return [{ id: shortId(), name: "Món 1", price: "", sharedBy: initialPeopleB.map(p => p.id) }];
  }, [initial, initialPeopleB]);
  const [dishes, setDishes] = useState<TipDish[]>(initialDishes);

  // Mode C — custom %
  const initialPeopleC = useMemo(() => {
    if (initial?.mode === "custom" && initial.p) {
      const arr = decodePeople(initial.p);
      if (arr && arr.length) return arr;
    }
    return [
      { id: shortId(), name: "Người 1" },
      { id: shortId(), name: "Người 2" },
      { id: shortId(), name: "Người 3" },
    ];
  }, [initial]);
  const [cPeople, setCPeople] = useState<TipPerson[]>(initialPeopleC);
  const initialRatios = useMemo(() => {
    const out: Record<string, string> = {};
    if (initial?.mode === "custom" && initial.r) {
      const parts = initial.r.split("|");
      initialPeopleC.forEach((p, i) => { out[p.id] = parts[i] ?? ""; });
    } else {
      const ev = (100 / initialPeopleC.length).toFixed(2).replace(/\.?0+$/, "");
      initialPeopleC.forEach(p => { out[p.id] = ev; });
    }
    return out;
  }, [initial, initialPeopleC]);
  const [ratios, setRatios] = useState<Record<string, string>>(initialRatios);
  const [cBill, setCBill] = useState(initial?.mode === "custom" && initial.total ? initial.total : "");

  // Common compute helpers
  const vatN = parseFloat(vatPct) || 0;
  const tipN = parseFloat(tipPct) || 0;

  // ───── Mode A compute ─────
  const aBillN = parseFloat(bill);
  const aPeopleN = Math.max(1, parseInt(people) || 1);
  const aHasBill = bill !== "" && !isNaN(aBillN) && aBillN > 0;
  const aVatAmt = aHasBill ? aBillN * vatN / 100 : NaN;
  const aTipBase = tipOnVat ? aBillN + aVatAmt : aBillN;
  const aTipAmt = aHasBill ? aTipBase * tipN / 100 : NaN;
  const aTotal = aHasBill ? aBillN + aVatAmt + aTipAmt : NaN;
  const aPerPerson = aHasBill ? aTotal / aPeopleN : NaN;

  // ───── Mode B compute ─────
  const bPerPerson = useMemo(() => {
    const sub: Record<string, number> = {};
    bPeople.forEach(p => { sub[p.id] = 0; });
    let foodTotal = 0;
    for (const d of dishes) {
      const price = parseFloat(d.price);
      if (isNaN(price) || price <= 0 || d.sharedBy.length === 0) continue;
      foodTotal += price;
      const each = price / d.sharedBy.length;
      for (const pid of d.sharedBy) {
        if (sub[pid] !== undefined) sub[pid] += each;
      }
    }
    const rows = bPeople.map(p => {
      const food = sub[p.id] || 0;
      const ratio = foodTotal > 0 ? food / foodTotal : 0;
      const vatAmt = food * vatN / 100;
      const tipBaseLocal = tipOnVat ? food + vatAmt : food;
      const tipAmt = tipBaseLocal * tipN / 100;
      const totalPay = food + vatAmt + tipAmt;
      return { id: p.id, name: p.name, food, vat: vatAmt, tip: tipAmt, total: totalPay, ratio };
    });
    return { rows, foodTotal };
  }, [bPeople, dishes, vatN, tipN, tipOnVat]);
  const bGrandTotal = bPerPerson.rows.reduce((s, r) => s + r.total, 0);
  const bGrandVat = bPerPerson.rows.reduce((s, r) => s + r.vat, 0);
  const bGrandTip = bPerPerson.rows.reduce((s, r) => s + r.tip, 0);
  const bMaxTotal = Math.max(...bPerPerson.rows.map(r => r.total), 0);
  const bHasData = bPerPerson.foodTotal > 0;

  // ───── Mode C compute ─────
  const cBillN = parseFloat(cBill);
  const cHasBill = cBill !== "" && !isNaN(cBillN) && cBillN > 0;
  const cVatAmt = cHasBill ? cBillN * vatN / 100 : 0;
  const cTipBase = tipOnVat ? cBillN + cVatAmt : cBillN;
  const cTipAmt = cHasBill ? cTipBase * tipN / 100 : 0;
  const cTotal = cHasBill ? cBillN + cVatAmt + cTipAmt : NaN;
  const cSumRatio = cPeople.reduce((s, p) => s + (parseFloat(ratios[p.id] || "0") || 0), 0);
  const cRatioOk = Math.abs(cSumRatio - 100) < 0.01;
  const cRows = cPeople.map(p => {
    const r = parseFloat(ratios[p.id] || "0") || 0;
    const pay = cHasBill && cRatioOk ? cTotal * r / 100 : NaN;
    return { id: p.id, name: p.name, ratio: r, pay };
  });

  // ───── People/Dish editors ─────
  const addPersonB = () => {
    const newP = { id: shortId(), name: `Người ${bPeople.length + 1}` };
    setBPeople(arr => [...arr, newP]);
    // Mặc định người mới ăn món hiện có? Để false để tránh thay đổi data
  };
  const removePersonB = (id: string) => {
    if (bPeople.length <= 1) return;
    setBPeople(arr => arr.filter(p => p.id !== id));
    setDishes(arr => arr.map(d => ({ ...d, sharedBy: d.sharedBy.filter(pid => pid !== id) })));
  };
  const renamePersonB = (id: string, name: string) => setBPeople(arr => arr.map(p => p.id === id ? { ...p, name } : p));

  const addDish = () => {
    setDishes(arr => [...arr, { id: shortId(), name: `Món ${arr.length + 1}`, price: "", sharedBy: bPeople.map(p => p.id) }]);
  };
  const removeDish = (id: string) => setDishes(arr => arr.filter(d => d.id !== id));
  const updateDish = (id: string, patch: Partial<TipDish>) => setDishes(arr => arr.map(d => d.id === id ? { ...d, ...patch } : d));
  const toggleDishPerson = (dishId: string, pid: string) => {
    setDishes(arr => arr.map(d => {
      if (d.id !== dishId) return d;
      const has = d.sharedBy.includes(pid);
      return { ...d, sharedBy: has ? d.sharedBy.filter(x => x !== pid) : [...d.sharedBy, pid] };
    }));
  };

  const addPersonC = () => {
    const newP = { id: shortId(), name: `Người ${cPeople.length + 1}` };
    setCPeople(arr => [...arr, newP]);
    setRatios(r => ({ ...r, [newP.id]: "" }));
  };
  const removePersonC = (id: string) => {
    if (cPeople.length <= 1) return;
    setCPeople(arr => arr.filter(p => p.id !== id));
    setRatios(r => { const next = { ...r }; delete next[id]; return next; });
  };
  const renamePersonC = (id: string, name: string) => setCPeople(arr => arr.map(p => p.id === id ? { ...p, name } : p));
  const setRatio = (id: string, val: string) => setRatios(r => ({ ...r, [id]: val }));
  const fillEvenly = () => {
    if (cPeople.length === 0) return;
    const ev = (100 / cPeople.length).toFixed(2).replace(/\.?0+$/, "");
    const next: Record<string, string> = {};
    cPeople.forEach(p => { next[p.id] = ev; });
    setRatios(next);
  };

  // ───── Copy/Share text builder ─────
  let displayResult = "";
  let displaySub = "";
  let shareText = "";
  let shareTitle = "Chia bill nhóm";
  const buildHeader = () => `🧾 Chia bill phantram.online\n─────────────────`;
  const buildFooter = () => `─────────────────\n(VAT ${vatN}% + Tip ${tipN}%${tipOnVat ? " sau VAT" : " trước VAT"})`;

  if (mode === "equal" && aHasBill) {
    displayResult = `${formatVND(aPerPerson)} / người`;
    displaySub = `Tổng: ${formatVND(aTotal)} · VAT ${formatVND(aVatAmt)} · Tip ${formatVND(aTipAmt)}`;
    shareTitle = "Chia bill chia đều";
    shareText = `${buildHeader()}\nMỗi người: ${formatVND(aPerPerson)} × ${aPeopleN} người\n─────────────────\nMón gốc: ${formatVND(aBillN)}\nVAT ${vatN}%: ${formatVND(aVatAmt)}\nTip ${tipN}%: ${formatVND(aTipAmt)}\nTổng: ${formatVND(aTotal)}\n${buildFooter()}`;
  } else if (mode === "byItem" && bHasData) {
    displayResult = `Tổng: ${formatVND(bGrandTotal)}`;
    displaySub = `${bPeople.length} người · ${dishes.length} món · VAT ${formatVND(bGrandVat)} · Tip ${formatVND(bGrandTip)}`;
    shareTitle = "Chia bill theo món";
    const lines = bPerPerson.rows.map(r => `${r.name}: ${formatVND(r.total)}${r.total === bMaxTotal && bMaxTotal > 0 ? " 🏆" : ""}`).join("\n");
    shareText = `${buildHeader()}\n${lines}\n─────────────────\nTổng: ${formatVND(bGrandTotal)}\n${buildFooter()}`;
  } else if (mode === "custom" && cHasBill && cRatioOk) {
    displayResult = `Tổng: ${formatVND(cTotal)}`;
    displaySub = `${cPeople.length} người · tỉ lệ tùy ý`;
    shareTitle = "Chia bill theo %";
    const lines = cRows.map(r => `${r.name} (${r.ratio}%): ${isNaN(r.pay) ? "—" : formatVND(r.pay)}`).join("\n");
    shareText = `${buildHeader()}\n${lines}\n─────────────────\nTổng: ${formatVND(cTotal)}\n${buildFooter()}`;
  }
  const formula = displaySub;
  const copyResult = () => {
    if (!displayResult) return;
    navigator.clipboard?.writeText(displayResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const copyTable = () => {
    if (!shareText) return;
    navigator.clipboard?.writeText(shareText);
    setTableCopied(true);
    setTimeout(() => setTableCopied(false), 2000);
  };

  // ───── Share payload ─────
  const hasShareData =
    (mode === "equal" && aHasBill) ||
    (mode === "byItem" && bHasData) ||
    (mode === "custom" && cHasBill && cRatioOk);
  const sharePayload = useMemo(() => {
    if (!hasShareData) return null;
    if (mode === "equal") {
      return {
        tab: "tip" as const,
        mode,
        total: bill,
        n: people,
        tip: tipPct,
        vat: vatPct,
        tipOnVat: (tipOnVat ? "1" : "0") as "1" | "0",
      };
    }
    if (mode === "byItem") {
      return {
        tab: "tip" as const,
        mode,
        n: String(bPeople.length),
        total: String(Math.round(bGrandTotal)),
        tip: tipPct,
        vat: vatPct,
        tipOnVat: (tipOnVat ? "1" : "0") as "1" | "0",
        p: encodePeople(bPeople),
        d: encodeDishes(dishes, bPeople),
      };
    }
    return {
      tab: "tip" as const,
      mode,
      total: cBill,
      n: String(cPeople.length),
      tip: tipPct,
      vat: vatPct,
      tipOnVat: (tipOnVat ? "1" : "0") as "1" | "0",
      p: encodePeople(cPeople),
      r: cPeople.map(p => ratios[p.id] || "").join("|"),
    };
  }, [hasShareData, mode, bill, people, tipPct, vatPct, tipOnVat, bPeople, dishes, bGrandTotal, cBill, cPeople, ratios]);
  const shareUrl = sharePayload ? buildShareUrl(sharePayload) : "";
  const ogImageUrl = sharePayload ? buildOgImageUrl(sharePayload) : "";

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chia bill nhóm — chia đều, theo món, hoặc theo % tùy ý</p>
      <div className="flex gap-2">
        <button onClick={() => setMode("equal")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "equal" ? "tab-active" : ""}`} style={mode === "equal" ? {} : { background: "var(--border)", color: "var(--text)" }}>Chia đều</button>
        <button onClick={() => setMode("byItem")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "byItem" ? "tab-active" : ""}`} style={mode === "byItem" ? {} : { background: "var(--border)", color: "var(--text)" }}>Theo món</button>
        <button onClick={() => setMode("custom")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "custom" ? "tab-active" : ""}`} style={mode === "custom" ? {} : { background: "var(--border)", color: "var(--text)" }}>% tùy ý</button>
      </div>

      {/* VAT + Tip preset (chung cho mọi mode) */}
      <div className="flex flex-col gap-2 rounded-xl p-3" style={{ background: "var(--border)" }}>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>VAT (thuế GTGT) %</label>
          <div className="flex gap-2 flex-wrap items-center">
            {VAT_PRESETS.map(v => (
              <button key={v} onClick={() => setVatPct(v)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${vatPct === v ? "tab-active" : ""}`} style={vatPct === v ? {} : { background: "var(--card)", color: "var(--text)" }}>{v}%</button>
            ))}
            <input type="number" value={vatPct} onChange={e => setVatPct(e.target.value)} className="w-16 rounded-lg border px-2 py-1.5 text-xs font-semibold" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} placeholder="Custom" inputMode="decimal" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Tip %</label>
          <div className="flex gap-2 flex-wrap items-center">
            {TIP_PRESETS.map(t => (
              <button key={t} onClick={() => setTipPct(t)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${tipPct === t ? "tab-active" : ""}`} style={tipPct === t ? {} : { background: "var(--card)", color: "var(--text)" }}>{t}%</button>
            ))}
            <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} className="w-16 rounded-lg border px-2 py-1.5 text-xs font-semibold" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} placeholder="Custom" inputMode="decimal" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs cursor-pointer mt-1" style={{ color: "var(--text-muted)" }}>
          <input type="checkbox" checked={tipOnVat} onChange={e => setTipOnVat(e.target.checked)} />
          <span>Tip tính trên giá đã VAT (chuẩn quốc tế)</span>
        </label>
      </div>

      {/* ───── Mode A: equal ───── */}
      {mode === "equal" && (
        <>
          <NumInput label="Tổng bill (₫)" value={bill} onChange={setBill} placeholder="VD: 500000" />
          <NumInput label="Số người" value={people} onChange={setPeople} placeholder="VD: 4" />
          {aHasBill && (
            <>
              <div className="mt-2 rounded-2xl p-4 slide-in" style={{ background: "var(--result-bg)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Mỗi người trả</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-3xl font-bold" style={{ color: "var(--result-text)" }}>{formatVND(aPerPerson)}</p>
                  <button onClick={copyResult} className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95" style={{ background: copied ? "#22c55e" : "var(--primary)", color: "#fff" }}>{copied ? "✓ Đã copy" : "Copy"}</button>
                </div>
                <p className="text-xs mt-2 opacity-75" style={{ color: "var(--text-muted)" }}>{formula}</p>
              </div>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-sm">
                  <tbody>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Tiền món</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatVND(aBillN)}</td>
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>VAT ({vatN}%)</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatVND(aVatAmt)}</td>
                    </tr>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Tip ({tipN}% {tipOnVat ? "sau VAT" : "trước VAT"})</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatVND(aTipAmt)}</td>
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2 font-bold">Tổng phải trả</td>
                      <td className="px-3 py-2 text-right font-bold text-green-500">{formatVND(aTotal)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      {/* ───── Mode B: byItem ───── */}
      {mode === "byItem" && (
        <>
          {/* Section: People */}
          <div className="rounded-xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">👥 Người ({bPeople.length})</p>
              <button onClick={addPersonB} className="text-xs rounded-lg px-2.5 py-1 font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>+ Thêm</button>
            </div>
            <div className="flex flex-col gap-2">
              {bPeople.map(p => (
                <div key={p.id} className="flex gap-2 items-center">
                  <input value={p.name} onChange={e => renamePersonB(p.id, e.target.value)} className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  {bPeople.length > 1 && (
                    <button onClick={() => removePersonB(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "var(--border)", color: "#ef4444" }} title="Xóa">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Dishes */}
          <div className="rounded-xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">🍽 Món ({dishes.length})</p>
              <button onClick={addDish} className="text-xs rounded-lg px-2.5 py-1 font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>+ Thêm</button>
            </div>
            <div className="flex flex-col gap-3">
              {dishes.map(d => {
                const priceN = parseFloat(d.price);
                const hasPrice = !isNaN(priceN) && priceN > 0;
                const eaters = d.sharedBy.length;
                return (
                  <div key={d.id} className="rounded-lg p-2.5 border" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
                    <div className="flex gap-2">
                      <input value={d.name} onChange={e => updateDish(d.id, { name: e.target.value })} placeholder="Tên món" className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} />
                      <input type="number" value={d.price} onChange={e => updateDish(d.id, { price: e.target.value })} placeholder="Giá ₫" className="w-28 rounded-lg border px-3 py-2 text-sm font-semibold" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} inputMode="decimal" />
                      <button onClick={() => removeDish(d.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "var(--border)", color: "#ef4444" }} title="Xóa">✕</button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="text-xs mr-1 self-center" style={{ color: "var(--text-muted)" }}>Ai ăn:</span>
                      {bPeople.map(p => {
                        const on = d.sharedBy.includes(p.id);
                        return (
                          <button key={p.id} onClick={() => toggleDishPerson(d.id, p.id)} className="text-xs rounded-lg px-2 py-1 font-medium transition-all" style={{ background: on ? "var(--primary)" : "var(--card)", color: on ? "#fff" : "var(--text)", border: "1px solid var(--border)" }}>{on ? "☑" : "☐"} {p.name}</button>
                        );
                      })}
                    </div>
                    {hasPrice && eaters > 0 && (
                      <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>= {formatVND(priceN / eaters)} / người ({eaters} người ăn)</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Result table */}
          {bHasData && (
            <>
              <div className="mt-2 rounded-2xl p-4" style={{ background: "var(--result-bg)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Tổng phải trả</p>
                <p className="text-3xl font-bold" style={{ color: "var(--result-text)" }}>{formatVND(bGrandTotal)}</p>
                <p className="text-xs mt-2 opacity-75" style={{ color: "var(--text-muted)" }}>{bPeople.length} người · {dishes.length} món · VAT {formatVND(bGrandVat)} · Tip {formatVND(bGrandTip)}</p>
              </div>
              {/* Desktop: table */}
              <div className="hidden sm:block rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "var(--border)" }}>
                        <th className="px-3 py-2 text-left text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Tên</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Món</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-muted)" }}>VAT</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Tip</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Phải trả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bPerPerson.rows.map((r, i) => (
                        <tr key={r.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                          <td className="px-3 py-2 font-semibold">{r.name || "—"}</td>
                          <td className="px-3 py-2 text-right">{formatVND(r.food)}</td>
                          <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>{formatVND(r.vat)}</td>
                          <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>{formatVND(r.tip)}</td>
                          <td className="px-3 py-2 text-right font-bold text-green-500">
                            {formatVND(r.total)} {r.total === bMaxTotal && bMaxTotal > 0 && "🏆"}
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: "var(--border)" }}>
                        <td className="px-3 py-2 font-bold">Tổng</td>
                        <td className="px-3 py-2 text-right font-bold">{formatVND(bPerPerson.foodTotal)}</td>
                        <td className="px-3 py-2 text-right font-bold">{formatVND(bGrandVat)}</td>
                        <td className="px-3 py-2 text-right font-bold">{formatVND(bGrandTip)}</td>
                        <td className="px-3 py-2 text-right font-bold text-green-500">{formatVND(bGrandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Mobile: card stack */}
              <div className="sm:hidden flex flex-col gap-2">
                {bPerPerson.rows.map(r => (
                  <div key={r.id} className="rounded-xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold">{r.name || "—"} {r.total === bMaxTotal && bMaxTotal > 0 && "🏆"}</p>
                      <p className="font-bold text-green-500">{formatVND(r.total)}</p>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>Món {formatVND(r.food)} + VAT {formatVND(r.vat)} + Tip {formatVND(r.tip)}</p>
                  </div>
                ))}
                <div className="rounded-xl p-3" style={{ background: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <p className="font-bold">Tổng</p>
                    <p className="font-bold text-green-500">{formatVND(bGrandTotal)}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ───── Mode C: custom % ───── */}
      {mode === "custom" && (
        <>
          <NumInput label="Tổng bill (₫)" value={cBill} onChange={setCBill} placeholder="VD: 1000000" />
          <div className="rounded-xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">👥 Người + tỉ lệ % ({cPeople.length})</p>
              <div className="flex gap-2">
                <button onClick={fillEvenly} className="text-xs rounded-lg px-2.5 py-1 font-semibold" style={{ background: "var(--border)", color: "var(--text)" }}>Chia đều</button>
                <button onClick={addPersonC} className="text-xs rounded-lg px-2.5 py-1 font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>+ Thêm</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {cPeople.map(p => (
                <div key={p.id} className="flex gap-2 items-center">
                  <input value={p.name} onChange={e => renamePersonC(p.id, e.target.value)} className="flex-1 rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  <div className="relative w-24">
                    <input type="number" value={ratios[p.id] ?? ""} onChange={e => setRatio(p.id, e.target.value)} placeholder="%" className="w-full rounded-lg border px-3 py-2 text-sm font-semibold pr-7" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} inputMode="decimal" />
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-500">%</span>
                  </div>
                  {cPeople.length > 1 && (
                    <button onClick={() => removePersonC(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: "var(--border)", color: "#ef4444" }} title="Xóa">✕</button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span style={{ color: "var(--text-muted)" }}>Tổng tỉ lệ</span>
              <span className={`font-bold ${cRatioOk ? "text-green-500" : "text-red-500"}`}>{formatNum(cSumRatio)}% {cRatioOk ? "✓" : "⚠ ≠ 100%"}</span>
            </div>
          </div>
          {cHasBill && cRatioOk && (
            <>
              <div className="mt-2 rounded-2xl p-4" style={{ background: "var(--result-bg)" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Tổng phải trả</p>
                <p className="text-3xl font-bold" style={{ color: "var(--result-text)" }}>{formatVND(cTotal)}</p>
                <p className="text-xs mt-2 opacity-75" style={{ color: "var(--text-muted)" }}>Món {formatVND(cBillN)} + VAT {formatVND(cVatAmt)} + Tip {formatVND(cTipAmt)}</p>
              </div>
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--border)" }}>
                      <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Tên</th>
                      <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Tỉ lệ</th>
                      <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Phải trả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cRows.map((r, i) => (
                      <tr key={r.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                        <td className="px-3 py-2 font-semibold">{r.name || "—"}</td>
                        <td className="px-3 py-2 text-right">{r.ratio}%</td>
                        <td className="px-3 py-2 text-right font-bold text-green-500">{isNaN(r.pay) ? "—" : formatVND(r.pay)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {cHasBill && !cRatioOk && (
            <div className="rounded-xl p-3 text-sm border border-red-300" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
              ⚠ Tổng tỉ lệ {formatNum(cSumRatio)}% phải bằng 100% để tính chính xác.
            </div>
          )}
        </>
      )}

      {/* Action buttons */}
      {hasShareData && (
        <>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button onClick={copyTable} className="rounded-xl py-3 text-sm font-semibold transition-all active:scale-95" style={{ background: tableCopied ? "#22c55e" : "var(--card)", color: tableCopied ? "#fff" : "var(--text)", border: "1px solid var(--border)" }}>{tableCopied ? "✓ Đã copy" : "📋 Copy bảng"}</button>
            <button onClick={() => setShareOpen(true)} className="rounded-xl py-3 text-sm font-semibold transition-all active:scale-95" style={{ background: "var(--primary)", color: "#fff" }}>📤 Share kết quả</button>
          </div>
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={shareUrl}
            ogImageUrl={ogImageUrl}
            title={shareTitle}
            text={shareText}
          />
        </>
      )}
    </div>
  );
}

function TabInterest() {
  const [principal, setPrincipal] = useState(""); const [rate, setRate] = useState(""); const [period, setPeriod] = useState(""); const [unit, setUnit] = useState<"month" | "year">("month"); const [copied, setCopied] = useState(false);
  const p = parseFloat(principal); const r = parseFloat(rate) / 100; const t = parseFloat(period);
  const ratePerMonth = unit === "year" ? r / 12 : r;
  const interest = principal !== "" && rate !== "" && period !== "" ? p * ratePerMonth * (unit === "month" ? t : t * 12) : NaN;
  const total = !isNaN(interest) ? p + interest : NaN;
  const result = isNaN(interest) ? "" : `${formatNum(interest)} ₫`;
  const formula = result ? `Vốn: ${formatNum(p)} ₫ | Tổng cộng: ${formatNum(total)} ₫` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính lãi suất đơn giản</p>
      <NumInput label="Vốn gốc (₫)" value={principal} onChange={setPrincipal} placeholder="VD: 10000000" />
      <NumInput label="Lãi suất %/tháng hoặc %/năm" value={rate} onChange={setRate} placeholder="VD: 1" suffix="%" />
      <div className="flex gap-2">
        <button onClick={() => setUnit("month")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${unit === "month" ? "tab-active" : ""}`} style={unit === "month" ? {} : { background: "var(--border)", color: "var(--text)" }}>%/tháng</button>
        <button onClick={() => setUnit("year")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${unit === "year" ? "tab-active" : ""}`} style={unit === "year" ? {} : { background: "var(--border)", color: "var(--text)" }}>%/năm</button>
      </div>
      <NumInput label={`Kỳ hạn (${unit === "month" ? "tháng" : "năm"})`} value={period} onChange={setPeriod} placeholder={unit === "month" ? "VD: 12" : "VD: 1"} />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
    </div>
  );
}

// ────────── Basic Calculator ──────────
function BasicCalc({ compact = false }: { compact?: boolean }) {
  const [display, setDisplay] = useState("0");
  const [expr, setExpr] = useState("");
  const [justCalc, setJustCalc] = useState(false);
  const [copied, setCopied] = useState(false);

  const evalExpr = (e: string): number => {
    const raw = e.replace(/×/g, "*").replace(/÷/g, "/").replace(/,/g, ".");
    // eslint-disable-next-line no-new-func
    return new Function("return (" + raw + ")")() as number;
  };

  const handleBtn = (val: string) => {
    if (val === "C") { setDisplay("0"); setExpr(""); setJustCalc(false); return; }
    if (val === "⌫") {
      if (justCalc) { setDisplay("0"); setExpr(""); setJustCalc(false); return; }
      const next = display.length > 1 ? display.slice(0, -1) : "0";
      setDisplay(next); setExpr(e => e.slice(0, -1)); return;
    }
    if (val === "=") {
      try {
        const res = evalExpr(expr);
        const num = parseFloat(res.toFixed(10));
        const formatted = isFinite(num) ? num.toLocaleString("vi-VN", { maximumFractionDigits: 8 }) : "Lỗi";
        setDisplay(formatted);
        setExpr(String(num));
        setJustCalc(true);
      } catch { setDisplay("Lỗi"); setJustCalc(true); }
      return;
    }
    if (val === "%") {
      try {
        const res = evalExpr(expr) / 100;
        const num = parseFloat(res.toFixed(10));
        const formatted = num.toLocaleString("vi-VN", { maximumFractionDigits: 8 });
        setDisplay(formatted); setExpr(String(num)); setJustCalc(true);
      } catch { setDisplay("Lỗi"); }
      return;
    }
    const isOp = ["+", "-", "×", "÷"].includes(val);
    if (justCalc && !isOp) { setDisplay(val); setExpr(val); setJustCalc(false); return; }
    if (justCalc && isOp) { setJustCalc(false); setDisplay(display + val); setExpr(e => e + val); return; }
    if (val === "." && display.split(/[+\-×÷]/).pop()?.includes(".")) return;
    if (isOp && expr && ["+", "-", "×", "÷"].includes(expr.slice(-1))) {
      setExpr(e => e.slice(0, -1) + val);
      setDisplay(d => d.slice(0, -1) + val);
      return;
    }
    const newDisplay = (display === "0" && !isOp && val !== ".") ? val : display + val;
    setDisplay(newDisplay);
    setExpr(e => (e === "0" && !isOp && val !== ".") ? val : e + val);
  };

  const copy = () => { navigator.clipboard?.writeText(display.replace(/\./g, ",")); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const BUTTONS = [
    ["C", "⌫", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    [".", "0", "="],
  ];

  const isOp = (v: string) => ["+", "-", "×", "÷"].includes(v);
  const isAction = (v: string) => ["C", "⌫", "%"].includes(v);

  return (
    <div className={`${compact ? "" : "max-w-lg mx-auto mt-4"} rounded-2xl border shadow-sm overflow-hidden`} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {/* Display */}
      <div className={`${compact ? "px-3 pt-3 pb-2" : "px-5 pt-4 pb-3"}`} style={{ background: "var(--card)" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-muted)" }}>MÁY TÍNH</p>
          <button onClick={copy} className="text-xs px-2 py-0.5 rounded-lg font-semibold transition-all" style={{ background: copied ? "#22c55e" : "var(--border)", color: copied ? "#fff" : "var(--text-muted)" }}>{copied ? "✓" : "copy"}</button>
        </div>
        <div className={`${compact ? "min-h-[2.2rem]" : "min-h-[3rem]"} flex items-end justify-end`}>
          <p className="text-right font-bold leading-tight break-all" style={{ fontSize: compact ? (display.length > 10 ? "1.1rem" : "1.5rem") : (display.length > 12 ? "1.4rem" : display.length > 8 ? "1.8rem" : "2.4rem"), color: "var(--text)" }}>{display}</p>
        </div>
        {expr && !justCalc && <p className="text-right text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{expr}</p>}
      </div>
      {/* Buttons */}
      <div className={`${compact ? "p-2" : "p-3"} grid gap-2`}>
        {BUTTONS.map((row, ri) => (
          <div key={ri} className={`grid gap-2 ${row.length === 4 ? "grid-cols-4" : "grid-cols-[1fr_2fr_1fr]"}`}>
            {row.map(btn => {
              const eq = btn === "=";
              const op = isOp(btn);
              const ac = isAction(btn);
              return (
                <button
                  key={btn}
                  onClick={() => handleBtn(btn)}
                  className={`rounded-2xl ${compact ? "py-2.5 text-base" : "py-4 text-xl"} font-bold transition-all active:scale-95 select-none`}
                  style={{
                    background: eq ? "var(--primary)" : op ? "#dbeafe" : ac ? "var(--border)" : "var(--bg)",
                    color: eq ? "#fff" : op ? "var(--primary)" : ac ? "var(--text)" : "var(--text)",
                    boxShadow: eq ? "0 2px 12px rgba(37,99,235,0.3)" : "none",
                  }}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabCompound({ initial }: { initial?: DecodedCompound } = {}) {
  const [principal, setPrincipal] = useState(initial?.principal ?? "");
  const [rate, setRate] = useState(initial?.rate ?? "");
  const [period, setPeriod] = useState(initial?.period ?? "");
  const [periodUnit, setPeriodUnit] = useState<"month" | "year">(initial?.periodUnit ?? "year");
  const [compFreq, setCompFreq] = useState<"monthly" | "quarterly" | "yearly">(initial?.compFreq ?? "monthly");
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(period);

  const freqMap = { monthly: 12, quarterly: 4, yearly: 1 };
  const n = freqMap[compFreq];
  // Lãi suất năm
  const rYear = periodUnit === "month" ? r * 12 : r;
  // Số năm
  const tYear = periodUnit === "month" ? t / 12 : t;
  // A = P(1 + r/n)^(n*t)
  const amount = principal !== "" && rate !== "" && period !== "" && t > 0
    ? p * Math.pow(1 + rYear / n, n * tYear)
    : NaN;
  const interest = !isNaN(amount) ? amount - p : NaN;

  const result = isNaN(amount) ? "" : `${formatNum(amount)} ₫`;
  const formula = result
    ? `Lãi: ${formatNum(interest)} ₫ | Gốc: ${formatNum(p)} ₫ | Lãi/gốc: ${formatNum((interest/p)*100)}%`
    : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // Bảng lãi theo từng năm
  const yearRows: { year: number; amount: number; interest: number }[] = [];
  if (!isNaN(amount) && tYear > 0 && tYear <= 50) {
    const maxYear = Math.ceil(tYear);
    for (let y = 1; y <= Math.min(maxYear, 10); y++) {
      const a = p * Math.pow(1 + rYear / n, n * y);
      yearRows.push({ year: y, amount: a, interest: a - p });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính lãi kép — A = P(1 + r/n)ⁿᵗ</p>
      <NumInput label="Vốn gốc (₫)" value={principal} onChange={setPrincipal} placeholder="VD: 100000000" />
      <NumInput label="Lãi suất (% / năm)" value={rate} onChange={setRate} placeholder="VD: 8" suffix="%" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Kỳ hạn</label>
        <input type="number" value={period} onChange={e => setPeriod(e.target.value)} placeholder="VD: 5" inputMode="decimal"
          className="w-full rounded-xl border px-4 py-3 text-lg font-semibold outline-none focus:ring-2 focus:ring-blue-400"
          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} />
        <div className="flex gap-2 mt-1">
          <button onClick={() => setPeriodUnit("year")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${periodUnit === "year" ? "tab-active" : ""}`} style={periodUnit === "year" ? {} : { background: "var(--border)", color: "var(--text)" }}>Năm</button>
          <button onClick={() => setPeriodUnit("month")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${periodUnit === "month" ? "tab-active" : ""}`} style={periodUnit === "month" ? {} : { background: "var(--border)", color: "var(--text)" }}>Tháng</button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Tần suất ghép lãi</label>
        <div className="flex gap-2">
          {(["monthly", "quarterly", "yearly"] as const).map(f => {
            const label = f === "monthly" ? "Hàng tháng" : f === "quarterly" ? "Hàng quý" : "Hàng năm";
            return (
              <button key={f} onClick={() => setCompFreq(f)} className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${compFreq === f ? "tab-active" : ""}`} style={compFreq === f ? {} : { background: "var(--border)", color: "var(--text)" }}>{label}</button>
            );
          })}
        </div>
      </div>
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
      {!isNaN(amount) && (
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Tổng nhận</p>
            <p className="font-bold text-sm text-green-500">{formatNum(amount)} ₫</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Tiền lãi</p>
            <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatNum(interest)} ₫</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Tăng trưởng</p>
            <p className="font-bold text-sm text-orange-400">×{(amount/p).toFixed(2)}</p>
          </div>
        </div>
      )}
      {!isNaN(amount) && (
        <>
          <ShareButton onClick={() => setShareOpen(true)} />
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={buildShareUrl({ tab: "compound", principal, rate, period, periodUnit, compFreq })}
            ogImageUrl={buildOgImageUrl({ tab: "compound", principal, rate, period, periodUnit, compFreq })}
            title="Kết quả tính lãi kép"
            text={`Vốn gốc: ${formatNum(p)} ₫
Lãi suất: ${rate}% / ${periodUnit === "month" ? "tháng" : "năm"}
Kỳ hạn: ${period} ${periodUnit === "month" ? "tháng" : "năm"}
Tổng tích lũy: ${formatNum(amount)} ₫
Lãi: ${formatNum(interest)} ₫`}
          />
        </>
      )}
      {yearRows.length > 0 && (
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
          <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Lãi theo từng năm (tối đa 10 năm)</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Năm</th>
                  <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Tổng tích lũy</th>
                  <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Tiền lãi</th>
                </tr>
              </thead>
              <tbody>
                {yearRows.map((row, i) => (
                  <tr key={row.year} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                    <td className="px-3 py-2 font-semibold" style={{ color: "var(--text)" }}>Năm {row.year}</td>
                    <td className="px-3 py-2 text-right text-green-500 font-medium">{formatNum(row.amount)} ₫</td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: "var(--primary)" }}>+{formatNum(row.interest)} ₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────── Tab Tính lương Net sau thuế TNCN ──────────
function TabSalaryTax({ initial }: { initial?: DecodedSalaryTax } = {}) {
  const [gross, setGross] = useState(initial?.gross ?? "");
  const [dependents, setDependents] = useState(initial?.deps ?? "0");
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const g = parseFloat(gross);
  const dep = parseInt(dependents) || 0;

  // Cap BHXH/BHYT = 20 × lương cơ sở 2.34M = 46.8M
  // Cap BHTN = 20 × lương tối thiểu vùng I 4.96M = 99.2M
  const CAP_BHXH = 46_800_000;
  const CAP_BHTN = 99_200_000;

  const baseBHXH = !isNaN(g) ? Math.min(g, CAP_BHXH) : 0;
  const baseBHTN = !isNaN(g) ? Math.min(g, CAP_BHTN) : 0;

  const bhxh = baseBHXH * 0.08;      // 8%
  const bhyt = baseBHXH * 0.015;     // 1.5%
  const bhtn = baseBHTN * 0.01;      // 1%
  const totalInsurance = bhxh + bhyt + bhtn;

  const incomeBeforeTax = !isNaN(g) ? g - totalInsurance : NaN;

  const PERSONAL_DEDUCTION = 11_000_000;
  const DEPENDENT_DEDUCTION = 4_400_000;
  const totalDeduction = PERSONAL_DEDUCTION + dep * DEPENDENT_DEDUCTION;

  const taxableIncome = !isNaN(incomeBeforeTax) ? Math.max(0, incomeBeforeTax - totalDeduction) : NaN;

  // Thuế TNCN lũy tiến 7 bậc
  function calcTNCN(income: number): number {
    if (income <= 0) return 0;
    const brackets = [
      { limit: 5_000_000, rate: 0.05 },
      { limit: 10_000_000, rate: 0.10 },
      { limit: 18_000_000, rate: 0.15 },
      { limit: 32_000_000, rate: 0.20 },
      { limit: 52_000_000, rate: 0.25 },
      { limit: 80_000_000, rate: 0.30 },
      { limit: Infinity, rate: 0.35 },
    ];
    let tax = 0;
    let prev = 0;
    let remaining = income;
    for (const b of brackets) {
      const range = b.limit - prev;
      const amt = Math.min(remaining, range);
      tax += amt * b.rate;
      remaining -= amt;
      prev = b.limit;
      if (remaining <= 0) break;
    }
    return tax;
  }

  const tax = !isNaN(taxableIncome) ? calcTNCN(taxableIncome) : NaN;
  const net = !isNaN(incomeBeforeTax) && !isNaN(tax) ? incomeBeforeTax - tax : NaN;
  const netPct = !isNaN(net) && g > 0 ? (net / g) * 100 : NaN;

  const result = isNaN(net) ? "" : `${formatNum(net)} ₫/tháng`;
  const formula = result && !isNaN(netPct)
    ? `Bạn nhận về ${netPct.toFixed(1)}% lương gross | Thuế TNCN: ${formatNum(tax)} ₫ | BH: ${formatNum(totalInsurance)} ₫`
    : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính lương NET sau thuế TNCN 2026 (giảm trừ bản thân 11tr, phụ thuộc 4.4tr)</p>
      <NumInput label="Lương Gross (₫/tháng)" value={gross} onChange={setGross} placeholder="VD: 25000000" />
      <NumInput label="Số người phụ thuộc" value={dependents} onChange={setDependents} placeholder="VD: 0" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
      {!isNaN(net) && (
        <>
          <ShareButton onClick={() => setShareOpen(true)} />
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={buildShareUrl({ tab: "salary-tax", gross, deps: dependents })}
            ogImageUrl={buildOgImageUrl({ tab: "salary-tax", gross, deps: dependents })}
            title="Kết quả tính lương NET"
            text={`Lương Gross: ${formatNum(g)} ₫/tháng
Phụ thuộc: ${dep}
Thuế TNCN: ${formatNum(tax)} ₫
Bảo hiểm: ${formatNum(totalInsurance)} ₫
Lương NET: ${formatNum(net)} ₫ (≈ ${netPct.toFixed(1)}% Gross)`}
          />
        </>
      )}
      {!isNaN(net) && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Gross</p>
              <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{formatNum(g)} ₫</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Thuế + BH</p>
              <p className="font-bold text-sm text-red-400">{formatNum(tax + totalInsurance)} ₫</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>NET</p>
              <p className="font-bold text-sm text-green-500">{formatNum(net)} ₫</p>
            </div>
          </div>
          <button
            onClick={() => setShowDetail(s => !s)}
            className="rounded-xl py-2 text-sm font-semibold transition-all active:scale-95"
            style={{ background: "var(--border)", color: "var(--text)" }}
          >
            {showDetail ? "▲ Ẩn chi tiết" : "📊 Hiện chi tiết tính toán"}
          </button>
          {showDetail && (
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Chi tiết tính lương NET</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Lương Gross</td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: "var(--text)" }}>{formatNum(g)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>BHXH (8%)</td>
                      <td className="px-3 py-2 text-right text-red-400">− {formatNum(bhxh)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>BHYT (1.5%)</td>
                      <td className="px-3 py-2 text-right text-red-400">− {formatNum(bhyt)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>BHTN (1%)</td>
                      <td className="px-3 py-2 text-right text-red-400">− {formatNum(bhtn)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2 font-semibold" style={{ color: "var(--text)" }}>Thu nhập trước thuế</td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: "var(--text)" }}>{formatNum(incomeBeforeTax)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Giảm trừ bản thân</td>
                      <td className="px-3 py-2 text-right" style={{ color: "var(--text-muted)" }}>− {formatNum(PERSONAL_DEDUCTION)} ₫</td>
                    </tr>
                    {dep > 0 && (
                      <tr style={{ background: "var(--card)" }}>
                        <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Giảm trừ {dep} phụ thuộc</td>
                        <td className="px-3 py-2 text-right" style={{ color: "var(--text-muted)" }}>− {formatNum(dep * DEPENDENT_DEDUCTION)} ₫</td>
                      </tr>
                    )}
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2 font-semibold" style={{ color: "var(--text)" }}>Thu nhập chịu thuế</td>
                      <td className="px-3 py-2 text-right font-semibold" style={{ color: "var(--text)" }}>{formatNum(taxableIncome)} ₫</td>
                    </tr>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>Thuế TNCN (lũy tiến)</td>
                      <td className="px-3 py-2 text-right text-red-400 font-semibold">− {formatNum(tax)} ₫</td>
                    </tr>
                    <tr style={{ background: "#dcfce7" }}>
                      <td className="px-3 py-2 font-bold" style={{ color: "#166534" }}>Lương NET</td>
                      <td className="px-3 py-2 text-right font-bold" style={{ color: "#166534" }}>{formatNum(net)} ₫</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2 text-xs" style={{ background: "var(--border)", color: "var(--text-muted)" }}>
                * Áp dụng cap BHXH/BHYT 46.8M & BHTN 99.2M (lương cơ sở 2.34M, tối thiểu vùng I 4.96M). Thuế lũy tiến 7 bậc theo Luật Thuế TNCN.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ────────── Tab Hoàn vốn / Break-even ──────────
function TabBreakeven({ initial }: { initial?: DecodedBreakeven } = {}) {
  const [mode, setMode] = useState<"recovery" | "sales" | "invest">(initial?.mode ?? "recovery");
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Mode A — Recovery (bù lỗ)
  const [loss, setLoss] = useState(initial?.loss ?? "");
  const lossNum = parseFloat(loss);
  const recovery = loss !== "" && !isNaN(lossNum) && lossNum < 100 && lossNum > 0
    ? (lossNum / (100 - lossNum)) * 100
    : NaN;

  // Mode B — Sales BEP
  const [fc, setFc] = useState(initial?.fc ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [vc, setVc] = useState(initial?.vc ?? "");
  const fcN = parseFloat(fc), priceN = parseFloat(price), vcN = parseFloat(vc);
  const margin = price !== "" && vc !== "" ? priceN - vcN : NaN;
  const marginPct = !isNaN(margin) && priceN > 0 ? (margin / priceN) * 100 : NaN;
  const bepUnits = fc !== "" && !isNaN(margin) && margin > 0 ? fcN / margin : NaN;
  const bepRevenue = !isNaN(bepUnits) ? bepUnits * priceN : NaN;

  // Mode C — Investment payback
  const [capital, setCapital] = useState(initial?.capital ?? "");
  const [monthlyProfit, setMonthlyProfit] = useState(initial?.monthlyProfit ?? "");
  const capN = parseFloat(capital), profitN = parseFloat(monthlyProfit);
  const months = capital !== "" && monthlyProfit !== "" && profitN > 0 ? capN / profitN : NaN;
  const years = !isNaN(months) ? months / 12 : NaN;
  const roiYear = !isNaN(months) && capN > 0 ? ((profitN * 12) / capN) * 100 : NaN;

  let result = "";
  let formula = "";
  if (mode === "recovery") {
    result = isNaN(recovery) ? "" : `Cần tăng ${formatNum(recovery)}%`;
    formula = result ? `${loss}% ÷ (100 − ${loss}%) × 100 = ${formatNum(recovery)}%` : "";
  } else if (mode === "sales") {
    result = isNaN(bepUnits) ? "" : `${formatNum(bepUnits)} sản phẩm`;
    formula = result ? `Doanh thu hòa vốn: ${formatNum(bepRevenue)} ₫ | Margin: ${formatNum(margin)} ₫ (${formatNum(marginPct)}%)` : "";
  } else {
    result = isNaN(months) ? "" : `${formatNum(months)} tháng (~${formatNum(years)} năm)`;
    formula = result ? `ROI/năm: ${formatNum(roiYear)}% | Vốn: ${formatNum(capN)} ₫ | Lợi nhuận/tháng: ${formatNum(profitN)} ₫` : "";
  }
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // Share payload (mode-specific)
  const hasValidResult = (mode === "recovery" && !isNaN(recovery)) ||
    (mode === "sales" && !isNaN(bepUnits)) ||
    (mode === "invest" && !isNaN(months));
  const shareUrl = hasValidResult ? buildShareUrl({
    tab: "breakeven", mode,
    loss: mode === "recovery" ? loss : undefined,
    fc: mode === "sales" ? fc : undefined,
    price: mode === "sales" ? price : undefined,
    vc: mode === "sales" ? vc : undefined,
    capital: mode === "invest" ? capital : undefined,
    monthlyProfit: mode === "invest" ? monthlyProfit : undefined,
  }) : "";
  const ogImageUrl = hasValidResult ? buildOgImageUrl({
    tab: "breakeven", mode,
    loss: mode === "recovery" ? loss : undefined,
    fc: mode === "sales" ? fc : undefined,
    price: mode === "sales" ? price : undefined,
    vc: mode === "sales" ? vc : undefined,
    capital: mode === "invest" ? capital : undefined,
    monthlyProfit: mode === "invest" ? monthlyProfit : undefined,
  }) : "";
  let shareTitle = "Kết quả hoan vốn / BEP";
  let shareText = "";
  if (mode === "recovery" && !isNaN(recovery)) {
    shareTitle = "Kết quả bù lỗ";
    shareText = `Mức lỗ: -${loss}%
Cần lãi: +${formatNum(recovery)}% để hoà vốn`;
  } else if (mode === "sales" && !isNaN(bepUnits)) {
    shareTitle = "Điểm hoà vốn (BEP)";
    shareText = `Chi phí cố định: ${formatNum(fcN)} ₫
Giá bán: ${formatNum(priceN)} ₫ | Biến đổi: ${formatNum(vcN)} ₫
BEP: ${formatNum(bepUnits)} sản phẩm
Doanh thu BEP: ${formatNum(bepRevenue)} ₫
Margin: ${formatNum(marginPct)}%`;
  } else if (mode === "invest" && !isNaN(months)) {
    shareTitle = "Thời gian hoàn vốn";
    shareText = `Vốn đầu tư: ${formatNum(capN)} ₫
Lợi nhuận/tháng: ${formatNum(profitN)} ₫
Hoàn vốn: ${formatNum(months)} tháng (≈ ${formatNum(years)} năm)
ROI/năm: ${formatNum(roiYear)}%`;
  }

  const recoveryTable = [
    { loss: 10, need: 10 / 90 * 100 },
    { loss: 20, need: 20 / 80 * 100 },
    { loss: 30, need: 30 / 70 * 100 },
    { loss: 50, need: 50 / 50 * 100 },
    { loss: 70, need: 70 / 30 * 100 },
    { loss: 90, need: 90 / 10 * 100 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính % bù lỗ, điểm hòa vốn bán hàng, hoặc thời gian hoàn vốn đầu tư</p>
      <div className="flex gap-2">
        <button onClick={() => setMode("recovery")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "recovery" ? "tab-active" : ""}`} style={mode === "recovery" ? {} : { background: "var(--border)", color: "var(--text)" }}>Bù lỗ</button>
        <button onClick={() => setMode("sales")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "sales" ? "tab-active" : ""}`} style={mode === "sales" ? {} : { background: "var(--border)", color: "var(--text)" }}>BEP bán hàng</button>
        <button onClick={() => setMode("invest")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "invest" ? "tab-active" : ""}`} style={mode === "invest" ? {} : { background: "var(--border)", color: "var(--text)" }}>Đầu tư</button>
      </div>

      {hasValidResult && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          url={shareUrl}
          ogImageUrl={ogImageUrl}
          title={shareTitle}
          text={shareText}
        />
      )}
      {mode === "recovery" && (
        <>
          <NumInput label="% đã lỗ" value={loss} onChange={setLoss} placeholder="VD: 20" suffix="%" />
          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
          {!isNaN(recovery) && <ShareButton onClick={() => setShareOpen(true)} />}
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Bảng % cần tăng để hòa vốn</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--bg)" }}>
                    <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Lỗ</th>
                    <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Cần tăng</th>
                  </tr>
                </thead>
                <tbody>
                  {recoveryTable.map((row, i) => (
                    <tr key={row.loss} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                      <td className="px-3 py-2 font-semibold text-red-400">−{row.loss}%</td>
                      <td className="px-3 py-2 text-right font-medium text-green-500">+{formatNum(row.need)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Công thức: <strong>% bù = Lỗ% ÷ (100 − Lỗ%) × 100</strong>. Lỗ càng lớn cần tăng càng nhiều để hòa vốn.
          </p>
        </>
      )}

      {mode === "sales" && (
        <>
          <NumInput label="Chi phí cố định / tháng (₫)" value={fc} onChange={setFc} placeholder="VD: 50000000" />
          <NumInput label="Giá bán / sản phẩm (₫)" value={price} onChange={setPrice} placeholder="VD: 200000" />
          <NumInput label="Chi phí biến đổi / sản phẩm (₫)" value={vc} onChange={setVc} placeholder="VD: 120000" />
          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
          {!isNaN(bepUnits) && <ShareButton onClick={() => setShareOpen(true)} />}
          {!isNaN(bepUnits) && (
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Sản phẩm BEP</p>
                <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatNum(bepUnits)}</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Doanh thu BEP</p>
                <p className="font-bold text-sm text-green-500">{formatNum(bepRevenue)} ₫</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Margin</p>
                <p className="font-bold text-sm text-orange-400">{formatNum(marginPct)}%</p>
              </div>
            </div>
          )}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Công thức: <strong>BEP = FC ÷ (Giá bán − Chi phí biến đổi)</strong>. Bán đủ số SP này là hòa vốn.
          </p>
        </>
      )}

      {mode === "invest" && (
        <>
          <NumInput label="Vốn đầu tư ban đầu (₫)" value={capital} onChange={setCapital} placeholder="VD: 500000000" />
          <NumInput label="Lợi nhuận / tháng (₫)" value={monthlyProfit} onChange={setMonthlyProfit} placeholder="VD: 8000000" />
          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
          {!isNaN(months) && <ShareButton onClick={() => setShareOpen(true)} />}
          {!isNaN(months) && (
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Số tháng</p>
                <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatNum(months)}</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Số năm</p>
                <p className="font-bold text-sm text-orange-400">{formatNum(years)}</p>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>ROI / năm</p>
                <p className="font-bold text-sm text-green-500">{formatNum(roiYear)}%</p>
              </div>
            </div>
          )}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Công thức: <strong>Số tháng hoàn vốn = Vốn ÷ Lợi nhuận/tháng</strong>. ROI/năm = (Lợi nhuận × 12) ÷ Vốn × 100%.
          </p>
        </>
      )}
    </div>
  );
}

type Ingredient = { id: string; name: string; amount: string; unit: string };
const UNITS = ["g", "kg", "ml", "L", "cup", "tbsp", "tsp", "quả", "củ", "lá", "miếng", "gói"];
const WHOLE_UNITS = ["quả", "củ", "lá", "miếng", "gói"];
function isWholeUnit(u: string) { return WHOLE_UNITS.includes(u); }
function scaleAmount(amount: number, scale: number, unit: string): number {
  if (isWholeUnit(unit)) return Math.ceil(amount * scale);
  return Math.round(amount * scale * 10) / 10;
}

function TabRecipeScale() {
  const [from, setFrom] = useState("4");
  const [to, setTo] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", name: "", amount: "", unit: "g" },
    { id: "2", name: "", amount: "", unit: "g" },
    { id: "3", name: "", amount: "", unit: "g" },
  ]);
  const [copied, setCopied] = useState(false);

  const fromN = parseFloat(from);
  const toN = parseFloat(to);
  const scale = !isNaN(fromN) && fromN > 0 && !isNaN(toN) && toN > 0 ? toN / fromN : NaN;
  const scalePct = !isNaN(scale) ? (scale - 1) * 100 : NaN;

  const addIngredient = () => {
    setIngredients(prev => [...prev, { id: Date.now().toString() + Math.random().toString(36).slice(2, 6), name: "", amount: "", unit: "g" }]);
  };
  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  };
  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };
  const applyPreset = (factor: number) => {
    const base = parseFloat(from);
    if (!isNaN(base) && base > 0) setTo(String(Math.round(base * factor * 100) / 100));
  };

  const scaled = ingredients
    .map(ing => {
      const amt = parseFloat(ing.amount);
      if (!ing.name.trim() || isNaN(amt) || isNaN(scale)) return null;
      return { name: ing.name, original: amt, unit: ing.unit, newAmount: scaleAmount(amt, scale, ing.unit) };
    })
    .filter((x): x is { name: string; original: number; unit: string; newAmount: number } => x !== null);

  const copyList = () => {
    if (scaled.length === 0) return;
    const text = scaled.map(s => `${s.name}: ${s.newAmount}${s.unit === "quả" || s.unit === "củ" || s.unit === "lá" || s.unit === "miếng" || s.unit === "gói" ? " " + s.unit : s.unit}`).join("\n");
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Scale công thức nấu ăn / pha chế theo số phần ăn mới. Tự động nhân mọi nguyên liệu.</p>

      <div className="grid grid-cols-2 gap-3">
        <NumInput label="Phần ăn gốc" value={from} onChange={setFrom} placeholder="VD: 4" />
        <NumInput label="Muốn nấu cho" value={to} onChange={setTo} placeholder="VD: 7" />
      </div>

      {!isNaN(scale) && (
        <div className="rounded-xl px-4 py-3 text-center font-semibold" style={{ background: "var(--result-bg)", color: scale >= 1 ? "#22c55e" : "#f97316" }}>
          Hệ số scale: ×{formatNum(scale)} ({scalePct >= 0 ? "+" : ""}{formatNum(scalePct)}%)
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        <button onClick={() => applyPreset(0.5)} className="rounded-xl py-2 text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--border)", color: "var(--text)" }}>Nửa (÷2)</button>
        <button onClick={() => applyPreset(2)} className="rounded-xl py-2 text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--border)", color: "var(--text)" }}>Gấp đôi</button>
        <button onClick={() => applyPreset(3)} className="rounded-xl py-2 text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--border)", color: "var(--text)" }}>Gấp 3</button>
        <button onClick={() => applyPreset(4)} className="rounded-xl py-2 text-xs font-semibold transition-all active:scale-95" style={{ background: "var(--border)", color: "var(--text)" }}>Gấp 4</button>
      </div>

      <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Nguyên liệu gốc</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                <th className="px-2 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Tên</th>
                <th className="px-2 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>SL</th>
                <th className="px-2 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Đơn vị</th>
                <th className="px-2 py-2" style={{ width: 36 }}></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ing, i) => (
                <tr key={ing.id} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                  <td className="px-2 py-1.5">
                    <input type="text" value={ing.name} onChange={e => updateIngredient(ing.id, "name", e.target.value)} placeholder="Bột mì" className="w-full rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </td>
                  <td className="px-2 py-1.5">
                    <input type="number" inputMode="decimal" value={ing.amount} onChange={e => updateIngredient(ing.id, "amount", e.target.value)} placeholder="0" className="w-20 rounded-lg border px-2 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-400" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} />
                  </td>
                  <td className="px-2 py-1.5">
                    <select value={ing.unit} onChange={e => updateIngredient(ing.id, "unit", e.target.value)} className="rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button onClick={() => removeIngredient(ing.id)} className="text-red-400 hover:text-red-500 text-lg font-bold w-7 h-7 rounded-lg transition-all active:scale-90" aria-label="Xóa">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={addIngredient} className="w-full px-3 py-2.5 text-sm font-semibold transition-all hover:opacity-80" style={{ background: "var(--bg)", color: "var(--primary)", borderTop: "1px solid var(--border)" }}>+ Thêm nguyên liệu</button>
      </div>

      {scaled.length > 0 && (
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ background: "var(--border)" }}>
            <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Sau khi scale</span>
            <button onClick={copyList} className="rounded-lg px-3 py-1 text-xs font-semibold transition-all active:scale-95" style={{ background: copied ? "#22c55e" : "var(--primary)", color: "#fff" }}>
              {copied ? "✓ Đã copy" : "📋 Copy danh sách"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Tên</th>
                  <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Gốc</th>
                  <th className="px-2 py-2 text-center text-xs" style={{ color: "var(--text-muted)" }}>→</th>
                  <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Mới</th>
                </tr>
              </thead>
              <tbody>
                {scaled.map((s, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-right" style={{ color: "var(--text-muted)" }}>{formatNum(s.original)} {s.unit}</td>
                    <td className="px-2 py-2 text-center" style={{ color: "var(--text-muted)" }}>→</td>
                    <td className="px-3 py-2 text-right text-lg font-bold" style={{ color: "var(--primary)" }}>{formatNum(s.newAmount)} {s.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        💡 Mẹo: Nguyên liệu có đơn vị nguyên (quả, củ, lá, miếng, gói) sẽ được làm tròn lên gần nhất. Các đơn vị khác (g, ml, kg, L, cup…) giữ 1 chữ số thập phân.
      </p>
    </div>
  );
}

const ACTIVITY_OPTIONS: { value: 1.2 | 1.375 | 1.55 | 1.725 | 1.9; label: string; desc: string }[] = [
  { value: 1.2, label: "Ít vận động", desc: "ít/không tập" },
  { value: 1.375, label: "Nhẹ", desc: "1-3 buổi/tuần" },
  { value: 1.55, label: "Trung bình", desc: "3-5 buổi/tuần" },
  { value: 1.725, label: "Nhiều", desc: "6-7 buổi/tuần" },
  { value: 1.9, label: "Rất nhiều", desc: "2 buổi/ngày / lao động nặng" },
];

function bmiCategory(bmi: number): { label: string; color: string; textClass: string; bgClass: string } {
  if (bmi < 18.5) return { label: "Thiếu cân", color: "#3b82f6", textClass: "text-blue-500", bgClass: "bg-blue-500/10" };
  if (bmi < 23) return { label: "Bình thường", color: "#22c55e", textClass: "text-green-500", bgClass: "bg-green-500/10" };
  if (bmi < 25) return { label: "Thừa cân", color: "#eab308", textClass: "text-yellow-500", bgClass: "bg-yellow-500/10" };
  if (bmi < 30) return { label: "Béo phì độ I", color: "#f97316", textClass: "text-orange-500", bgClass: "bg-orange-500/10" };
  return { label: "Béo phì độ II+", color: "#ef4444", textClass: "text-red-500", bgClass: "bg-red-500/10" };
}

function TabWeightBMI({ initial }: { initial?: DecodedBMI } = {}) {
  const [mode, setMode] = useState<"bmi" | "goal" | "calorie">(initial?.mode ?? "bmi");
  const [sex, setSex] = useState<"male" | "female">(initial?.sex ?? "male");
  const [height, setHeight] = useState(initial?.height ?? "");
  const [weight, setWeight] = useState(initial?.weight ?? "");
  const [age, setAge] = useState(initial?.age ?? "");
  const initialActivity = (() => {
    const n = parseFloat(initial?.activity ?? "");
    if (n === 1.2 || n === 1.375 || n === 1.55 || n === 1.725 || n === 1.9) return n;
    return 1.55;
  })();
  const [activity, setActivity] = useState<1.2 | 1.375 | 1.55 | 1.725 | 1.9>(initialActivity);
  const [goalMode, setGoalMode] = useState<"percent" | "absolute">(initial?.goalMode ?? "percent");
  const [goalPercent, setGoalPercent] = useState(initial?.goalPercent ?? "");
  const [goalWeight, setGoalWeight] = useState(initial?.goalWeight ?? "");
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const hN = parseFloat(height);
  const wN = parseFloat(weight);
  const ageN = parseFloat(age);
  const hM = !isNaN(hN) && hN > 0 ? hN / 100 : NaN;
  const bmi = !isNaN(hM) && !isNaN(wN) && wN > 0 ? wN / (hM * hM) : NaN;
  const idealMin = !isNaN(hM) ? 18.5 * hM * hM : NaN;
  const idealMax = !isNaN(hM) ? 22.9 * hM * hM : NaN;
  const cat = !isNaN(bmi) ? bmiCategory(bmi) : null;

  // BMI position 0-100 on the bar (clamp 15..35)
  const bmiPos = !isNaN(bmi) ? Math.max(0, Math.min(100, ((bmi - 15) / (35 - 15)) * 100)) : NaN;

  // Mode B — Goal
  const goalPctN = parseFloat(goalPercent);
  const goalWN = parseFloat(goalWeight);
  let targetWeight = NaN;
  let lossKg = NaN;
  let effectivePct = NaN;
  if (!isNaN(wN) && wN > 0) {
    if (goalMode === "percent" && !isNaN(goalPctN) && goalPctN > 0) {
      targetWeight = wN * (100 - goalPctN) / 100;
      lossKg = wN - targetWeight;
      effectivePct = goalPctN;
    } else if (goalMode === "absolute" && !isNaN(goalWN) && goalWN > 0 && goalWN < wN) {
      targetWeight = goalWN;
      lossKg = wN - goalWN;
      effectivePct = (lossKg / wN) * 100;
    }
  }
  const weeksSlow = !isNaN(lossKg) && lossKg > 0 ? lossKg / 0.5 : NaN;
  const weeksFast = !isNaN(lossKg) && lossKg > 0 ? lossKg / 1 : NaN;
  const monthsSlow = !isNaN(weeksSlow) ? weeksSlow / 4.345 : NaN;
  const monthsFast = !isNaN(weeksFast) ? weeksFast / 4.345 : NaN;
  const goalTooHigh = !isNaN(effectivePct) && effectivePct > 15;
  const goalRisky = !isNaN(effectivePct) && effectivePct > 20;

  // Mode C — BMR + TDEE
  const bmr = !isNaN(wN) && !isNaN(hN) && !isNaN(ageN) && wN > 0 && hN > 0 && ageN > 0
    ? (sex === "male"
        ? 10 * wN + 6.25 * hN - 5 * ageN + 5
        : 10 * wN + 6.25 * hN - 5 * ageN - 161)
    : NaN;
  const tdee = !isNaN(bmr) ? bmr * activity : NaN;
  const cal300 = !isNaN(tdee) ? tdee - 300 : NaN;
  const cal500 = !isNaN(tdee) ? tdee - 500 : NaN;
  const cal750 = !isNaN(tdee) ? tdee - 750 : NaN;
  const minCal = sex === "male" ? 1500 : 1200;

  // Result strings
  let result = "";
  let formula = "";
  if (mode === "bmi") {
    if (!isNaN(bmi) && cat) {
      result = `BMI ${bmi.toFixed(1)} — ${cat.label}`;
      formula = `${weight} ÷ (${hM.toFixed(2)})² = ${bmi.toFixed(1)} | Cân lý tưởng: ${formatNum(idealMin)}–${formatNum(idealMax)} kg`;
    }
  } else if (mode === "goal") {
    if (!isNaN(targetWeight)) {
      result = `Đích: ${formatNum(targetWeight)} kg — giảm ${formatNum(lossKg)} kg (${formatNum(effectivePct)}%)`;
      formula = `Thời gian: ${formatNum(weeksFast)}–${formatNum(weeksSlow)} tuần (≈1–0.5 kg/tuần)`;
    }
  } else {
    if (!isNaN(tdee)) {
      result = `TDEE ${formatNum(tdee)} kcal/ngày — BMR ${formatNum(bmr)}`;
      formula = `Giảm chậm: ${formatNum(cal300)} | Trung bình: ${formatNum(cal500)} | Nhanh: ${formatNum(cal750)} kcal/ngày`;
    }
  }
  const copy = () => { navigator.clipboard?.writeText(`${result}\n${formula}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const hasBMIResult = mode === "bmi" && !isNaN(bmi);
  const hasGoalResult = mode === "goal" && !isNaN(targetWeight);
  const hasCalorieResult = mode === "calorie" && !isNaN(tdee);
  const hasShareableResult = hasBMIResult || hasGoalResult || hasCalorieResult;
  const bmiShareState = {
    tab: "weight-bmi" as const,
    mode,
    sex,
    height: height || undefined,
    weight: weight || undefined,
    age: age || undefined,
    activity: String(activity),
    goalMode,
    goalPercent: goalPercent || undefined,
    goalWeight: goalWeight || undefined,
  };
  const shareUrl = hasShareableResult ? buildShareUrl(bmiShareState) : "";
  const ogImageUrl = hasShareableResult ? buildOgImageUrl(bmiShareState) : "";
  let shareTitle = "Kết quả cân nặng / BMI";
  let shareText = "";
  if (hasBMIResult && cat) {
    shareTitle = "Kết quả BMI";
    shareText = `BMI: ${bmi.toFixed(1)} — ${cat.label}
Chiều cao: ${height}cm • Cân nặng: ${weight}kg
Cân lý tưởng: ${formatNum(idealMin)}–${formatNum(idealMax)} kg`;
  } else if (hasGoalResult) {
    shareTitle = "Mục tiêu giảm cân";
    shareText = `Cân hiện tại: ${weight}kg
Cân đích: ${formatNum(targetWeight)} kg
Cần giảm: ${formatNum(lossKg)} kg (${formatNum(effectivePct)}%)
Thời gian: ${formatNum(weeksFast)}–${formatNum(weeksSlow)} tuần`;
  } else if (hasCalorieResult) {
    shareTitle = "TDEE & calo giảm cân";
    shareText = `BMR: ${formatNum(bmr)} kcal/ngày
TDEE: ${formatNum(tdee)} kcal/ngày
Giảm chậm: ${formatNum(cal300)} kcal
Trung bình: ${formatNum(cal500)} kcal
Nhanh: ${formatNum(cal750)} kcal`;
  }

  const diffMsg = (() => {
    if (isNaN(bmi) || !cat || isNaN(idealMin) || isNaN(idealMax)) return "";
    if (bmi < 18.5) return `Tăng ${formatNum(idealMin - wN)} kg để vào ngưỡng bình thường`;
    if (bmi <= 22.9) return "Cân nặng đang ổn — trong ngưỡng bình thường 🎉";
    return `Cần giảm ${formatNum(wN - idealMax)} kg để vào ngưỡng bình thường`;
  })();

  const goalRefTable = [
    { pct: "5%", safe: "✅", time: "1–2 tháng" },
    { pct: "10%", safe: "✅", time: "2–5 tháng" },
    { pct: "15%", safe: "⚠️", time: "4–7 tháng" },
    { pct: ">20%", safe: "❌", time: "Cần tư vấn BS" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {hasShareableResult && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          url={shareUrl}
          ogImageUrl={ogImageUrl}
          title={shareTitle}
          text={shareText}
        />
      )}
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính BMI, mục tiêu giảm cân theo %, hoặc calo TDEE để giảm cân an toàn.</p>
      <div className="flex gap-2">
        <button onClick={() => setMode("bmi")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "bmi" ? "tab-active" : ""}`} style={mode === "bmi" ? {} : { background: "var(--border)", color: "var(--text)" }}>BMI</button>
        <button onClick={() => setMode("goal")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "goal" ? "tab-active" : ""}`} style={mode === "goal" ? {} : { background: "var(--border)", color: "var(--text)" }}>Giảm cân %</button>
        <button onClick={() => setMode("calorie")} className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${mode === "calorie" ? "tab-active" : ""}`} style={mode === "calorie" ? {} : { background: "var(--border)", color: "var(--text)" }}>Calo</button>
      </div>

      {/* Shared sex toggle */}
      <div className="flex gap-2">
        <button onClick={() => setSex("male")} className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${sex === "male" ? "tab-active" : ""}`} style={sex === "male" ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>♂ Nam</button>
        <button onClick={() => setSex("female")} className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${sex === "female" ? "tab-active" : ""}`} style={sex === "female" ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>♀ Nữ</button>
      </div>

      {mode === "bmi" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumInput label="Chiều cao (cm)" value={height} onChange={setHeight} placeholder="VD: 165" suffix="cm" />
            <NumInput label="Cân nặng (kg)" value={weight} onChange={setWeight} placeholder="VD: 60" suffix="kg" />
          </div>

          {!isNaN(bmi) && cat && (
            <>
              <div className={`rounded-2xl p-4 ${cat.bgClass}`}>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Chỉ số BMI</p>
                    <p className={`text-3xl font-bold ${cat.textClass}`}>{bmi.toFixed(1)}</p>
                  </div>
                  <p className={`text-base font-bold ${cat.textClass}`}>{cat.label}</p>
                </div>

                <div className="mt-4 relative">
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="flex-1 bg-blue-500" />
                    <div className="flex-1 bg-green-500" />
                    <div className="flex-1 bg-yellow-500" />
                    <div className="flex-1 bg-orange-500" />
                    <div className="flex-1 bg-red-500" />
                  </div>
                  <div
                    className="absolute -top-1 w-5 h-5 rounded-full border-2 border-white shadow-lg"
                    style={{ left: `calc(${bmiPos}% - 10px)`, background: cat.color }}
                  />
                  <div className="flex justify-between text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
                    <span>15</span><span>18.5</span><span>23</span><span>25</span><span>30</span><span>35</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Cân lý tưởng</p>
                  <p className="font-bold text-sm text-green-500">{formatNum(idealMin)}–{formatNum(idealMax)} kg</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Chênh lệch</p>
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{diffMsg.replace(/^(Tăng |Cần giảm |Cân nặng đang.*)/, (m) => m.length > 24 ? m.slice(0, 22) + "…" : m) || "—"}</p>
                </div>
              </div>

              {diffMsg && (
                <p className="text-sm font-medium px-2" style={{ color: "var(--text)" }}>{diffMsg}</p>
              )}
            </>
          )}

          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Phân loại BMI (WHO Asia-Pacific)</div>
            <table className="w-full text-sm">
              <tbody>
                <tr style={{ background: "var(--card)" }}><td className="px-3 py-1.5 text-blue-500 font-medium">&lt; 18.5</td><td className="px-3 py-1.5 text-right">Thiếu cân</td></tr>
                <tr style={{ background: "var(--bg)" }}><td className="px-3 py-1.5 text-green-500 font-medium">18.5 – 22.9</td><td className="px-3 py-1.5 text-right">Bình thường</td></tr>
                <tr style={{ background: "var(--card)" }}><td className="px-3 py-1.5 text-yellow-500 font-medium">23 – 24.9</td><td className="px-3 py-1.5 text-right">Thừa cân</td></tr>
                <tr style={{ background: "var(--bg)" }}><td className="px-3 py-1.5 text-orange-500 font-medium">25 – 29.9</td><td className="px-3 py-1.5 text-right">Béo phì độ I</td></tr>
                <tr style={{ background: "var(--card)" }}><td className="px-3 py-1.5 text-red-500 font-medium">≥ 30</td><td className="px-3 py-1.5 text-right">Béo phì độ II+</td></tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Công thức: <strong>BMI = Cân nặng (kg) ÷ (Chiều cao m)²</strong>. Chuẩn WHO Asia-Pacific cho người châu Á.
          </p>
          {hasBMIResult && <ShareButton onClick={() => setShareOpen(true)} />}
        </>
      )}

      {mode === "goal" && (
        <>
          <NumInput label="Cân nặng hiện tại (kg)" value={weight} onChange={setWeight} placeholder="VD: 70" suffix="kg" />
          <div className="flex gap-2">
            <button onClick={() => setGoalMode("percent")} className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${goalMode === "percent" ? "tab-active" : ""}`} style={goalMode === "percent" ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>Theo %</button>
            <button onClick={() => setGoalMode("absolute")} className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${goalMode === "absolute" ? "tab-active" : ""}`} style={goalMode === "absolute" ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>Theo cân đích</button>
          </div>
          {goalMode === "percent" ? (
            <NumInput label="% giảm mục tiêu" value={goalPercent} onChange={setGoalPercent} placeholder="VD: 10" suffix="%" />
          ) : (
            <NumInput label="Cân nặng đích (kg)" value={goalWeight} onChange={setGoalWeight} placeholder="VD: 63" suffix="kg" />
          )}

          {!isNaN(targetWeight) && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Cân đích</p>
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatNum(targetWeight)} kg</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Cần giảm</p>
                  <p className="font-bold text-sm text-orange-500">{formatNum(lossKg)} kg</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>% giảm</p>
                  <p className="font-bold text-sm text-green-500">{formatNum(effectivePct)}%</p>
                </div>
              </div>

              <div className="rounded-xl p-3" style={{ background: "var(--result-bg)" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Thời gian ước tính</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>0.5 kg/tuần (an toàn)</p>
                    <p className="font-bold text-green-500">{formatNum(weeksSlow)} tuần (~{formatNum(monthsSlow)} tháng)</p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>1 kg/tuần (nhanh)</p>
                    <p className="font-bold text-orange-500">{formatNum(weeksFast)} tuần (~{formatNum(monthsFast)} tháng)</p>
                  </div>
                </div>
              </div>

              {goalRisky && (
                <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/30">
                  <p className="text-sm font-semibold text-red-500">❌ Mục tiêu {formatNum(effectivePct)}% quá cao — cần tư vấn bác sĩ/chuyên gia dinh dưỡng.</p>
                </div>
              )}
              {!goalRisky && goalTooHigh && (
                <div className="rounded-xl p-3 bg-orange-500/10 border border-orange-500/30">
                  <p className="text-sm font-semibold text-orange-500">⚠️ Giảm &gt; 15% cần thời gian dài và kế hoạch rõ ràng — đừng vội.</p>
                </div>
              )}
            </>
          )}

          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>Bảng tham chiếu</div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>% giảm</th>
                  <th className="px-3 py-2 text-center text-xs" style={{ color: "var(--text-muted)" }}>An toàn</th>
                  <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Tốc độ khuyến nghị</th>
                </tr>
              </thead>
              <tbody>
                {goalRefTable.map((row, i) => (
                  <tr key={row.pct} style={{ background: i % 2 === 0 ? "var(--card)" : "var(--bg)" }}>
                    <td className="px-3 py-2 font-semibold">{row.pct}</td>
                    <td className="px-3 py-2 text-center">{row.safe}</td>
                    <td className="px-3 py-2 text-right" style={{ color: "var(--text-muted)" }}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 An toàn: <strong>0.5–1 kg/tuần</strong>. Tổng không quá 5–10% trong 6 tháng để duy trì lâu dài.
          </p>
          {hasGoalResult && <ShareButton onClick={() => setShareOpen(true)} />}
        </>
      )}

      {mode === "calorie" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <NumInput label="Chiều cao (cm)" value={height} onChange={setHeight} placeholder="VD: 165" suffix="cm" />
            <NumInput label="Cân nặng (kg)" value={weight} onChange={setWeight} placeholder="VD: 70" suffix="kg" />
          </div>
          <NumInput label="Tuổi" value={age} onChange={setAge} placeholder="VD: 28" suffix="tuổi" />

          <div>
            <p className="text-sm font-medium mb-2" style={{ color: "var(--text-muted)" }}>Mức vận động</p>
            <div className="grid grid-cols-1 gap-2">
              {ACTIVITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setActivity(opt.value)}
                  className={`rounded-xl px-3 py-2 text-left transition-all ${activity === opt.value ? "tab-active" : ""}`}
                  style={activity === opt.value ? {} : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold">{opt.label}</span>
                    <span className="text-xs opacity-70">×{opt.value} — {opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!isNaN(tdee) && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>BMR (chuyển hóa cơ bản)</p>
                  <p className="font-bold text-sm" style={{ color: "var(--primary)" }}>{formatNum(bmr)} kcal</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: "var(--border)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>TDEE (calo duy trì)</p>
                  <p className="font-bold text-sm text-green-500">{formatNum(tdee)} kcal</p>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                <div className="px-3 py-2 text-xs font-semibold" style={{ background: "var(--border)", color: "var(--text-muted)" }}>3 mốc calo để giảm cân</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--bg)" }}>
                      <th className="px-3 py-2 text-left text-xs" style={{ color: "var(--text-muted)" }}>Mức độ</th>
                      <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Calo/ngày</th>
                      <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Tốc độ</th>
                      {!isNaN(lossKg) && <th className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>Đạt mục tiêu</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2 text-green-500 font-medium">Chậm (an toàn)</td>
                      <td className={`px-3 py-2 text-right font-bold ${cal300 < minCal ? "text-red-500" : ""}`}>{formatNum(cal300)}</td>
                      <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>~0.3 kg/tuần</td>
                      {!isNaN(lossKg) && <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>{formatNum(lossKg / 0.3)} tuần</td>}
                    </tr>
                    <tr style={{ background: "var(--bg)" }}>
                      <td className="px-3 py-2 text-orange-500 font-medium">Trung bình</td>
                      <td className={`px-3 py-2 text-right font-bold ${cal500 < minCal ? "text-red-500" : ""}`}>{formatNum(cal500)}</td>
                      <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>~0.5 kg/tuần</td>
                      {!isNaN(lossKg) && <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>{formatNum(lossKg / 0.5)} tuần</td>}
                    </tr>
                    <tr style={{ background: "var(--card)" }}>
                      <td className="px-3 py-2 text-red-500 font-medium">Nhanh</td>
                      <td className={`px-3 py-2 text-right font-bold ${cal750 < minCal ? "text-red-500" : ""}`}>{formatNum(cal750)}</td>
                      <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>~0.7–1 kg/tuần</td>
                      {!isNaN(lossKg) && <td className="px-3 py-2 text-right text-xs" style={{ color: "var(--text-muted)" }}>{formatNum(lossKg / 0.85)} tuần</td>}
                    </tr>
                  </tbody>
                </table>
              </div>

              {(cal300 < minCal || cal500 < minCal || cal750 < minCal) && (
                <div className="rounded-xl p-3 bg-red-500/10 border border-red-500/30">
                  <p className="text-sm font-semibold text-red-500">❌ Một số mức calo &lt; {minCal} kcal — quá thấp cho {sex === "male" ? "nam" : "nữ"}. Đừng ăn dưới ngưỡng này.</p>
                </div>
              )}
            </>
          )}

          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />

          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            💡 Công thức Mifflin-St Jeor: <strong>Nam: 10×kg + 6.25×cm − 5×tuổi + 5</strong>. <strong>Nữ: −161</strong>. TDEE = BMR × hệ số vận động. 1 kg mỡ ≈ 7700 kcal.
          </p>
          {hasCalorieResult && <ShareButton onClick={() => setShareOpen(true)} />}
        </>
      )}
    </div>
  );
}

// ───────── TabTimeProgress: 4 modes (year/month/day/custom) ─────────

// Vietnam timezone offset (UTC+7)
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

function nowVN(): Date {
  // Return a Date whose UTC fields represent VN local time.
  // (Server/client safe: we read the elapsed real wall time and shift to VN.)
  return new Date(Date.now() + VN_OFFSET_MS);
}

function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

function daysInMonth(year: number, monthIdx0: number): number {
  return new Date(Date.UTC(year, monthIdx0 + 1, 0)).getUTCDate();
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function pctGradient(pct: number): string {
  if (pct < 30) return "linear-gradient(90deg, #22c55e, #4ade80)";
  if (pct < 60) return "linear-gradient(90deg, #22c55e, #eab308)";
  if (pct < 90) return "linear-gradient(90deg, #eab308, #f97316)";
  return "linear-gradient(90deg, #f97316, #ef4444)";
}

function pctTextColor(pct: number): string {
  if (pct < 30) return "#22c55e";
  if (pct < 60) return "#eab308";
  if (pct < 90) return "#f97316";
  return "#ef4444";
}

function motivational(pct: number): string {
  if (pct < 25) return "Năm vẫn còn rất dài, hãy bắt đầu kế hoạch lớn 🚀";
  if (pct < 50) return "Đã đi được 1/4 chặng đường — kiểm tra lại mục tiêu nhé 📋";
  if (pct < 75) return "Đã qua nửa năm — đẩy ga lên! 🏃";
  if (pct < 90) return "Quý 4 rồi — không còn nhiều thời gian ⏰";
  return "Sắp hết năm! Cảm ơn năm qua 🎉";
}

function dayPartEmoji(hour: number): string {
  if (hour < 5) return "🌙";
  if (hour < 11) return "🌅";
  if (hour < 14) return "☀️";
  if (hour < 18) return "🌤";
  if (hour < 21) return "🌆";
  return "🌙";
}

function TabTimeProgress({ initial }: { initial?: DecodedTimeProgress } = {}) {
  const [mode, setMode] = useState<"year" | "month" | "day" | "custom">(initial?.mode ?? "year");
  const [tick, setTick] = useState(0);
  const [startStr, setStartStr] = useState(initial?.start ?? "");
  const [endStr, setEndStr] = useState(initial?.end ?? "");
  const [customTitle, setCustomTitle] = useState(initial?.title ?? "");
  const [shareOpen, setShareOpen] = useState(false);

  // Live update — frequency depends on mode
  useEffect(() => {
    const intervalMs = mode === "day" ? 1000 : mode === "custom" ? 0 : 60_000;
    if (intervalMs === 0) return;
    const id = setInterval(() => setTick(t => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [mode]);

  // Force read of `tick` so React re-renders
  void tick;

  const now = nowVN();
  const Y = now.getUTCFullYear();
  const M = now.getUTCMonth(); // 0-indexed
  const D = now.getUTCDate();
  const hh = now.getUTCHours();
  const mm = now.getUTCMinutes();
  const ss = now.getUTCSeconds();

  // Year mode calcs
  const yearStart = Date.UTC(Y, 0, 1);
  const yearEnd = Date.UTC(Y + 1, 0, 1);
  const yearElapsed = now.getTime() - yearStart;
  const yearTotal = yearEnd - yearStart;
  const yearPct = (yearElapsed / yearTotal) * 100;
  const yearDaysTotal = isLeap(Y) ? 366 : 365;
  const yearDayIndex = Math.floor((now.getTime() - yearStart) / 86_400_000) + 1; // 1-based
  const yearDaysLeft = yearDaysTotal - yearDayIndex;
  const weekIndex = Math.ceil(yearDayIndex / 7);
  const quarter = Math.floor(M / 3) + 1; // 1..4
  const qStartMonth = (quarter - 1) * 3;
  const qStart = Date.UTC(Y, qStartMonth, 1);
  const qEnd = Date.UTC(Y, qStartMonth + 3, 1);
  const qPct = ((now.getTime() - qStart) / (qEnd - qStart)) * 100;

  // Month mode calcs
  const monthStart = Date.UTC(Y, M, 1);
  const monthEnd = Date.UTC(Y, M + 1, 1);
  const monthPct = ((now.getTime() - monthStart) / (monthEnd - monthStart)) * 100;
  const monthDays = daysInMonth(Y, M);
  let weekendCount = 0;
  for (let d = 1; d <= monthDays; d++) {
    const dow = new Date(Date.UTC(Y, M, d)).getUTCDay();
    if (dow === 0 || dow === 6) weekendCount++;
  }
  const weekdayCount = monthDays - weekendCount;

  // Day mode calcs
  const dayMinutes = hh * 60 + mm + ss / 60;
  const dayPct = (dayMinutes / 1440) * 100;
  const minsLeftInDay = 1440 - dayMinutes;
  const hLeft = Math.floor(minsLeftInDay / 60);
  const mLeft = Math.floor(minsLeftInDay % 60);

  // Custom mode calcs
  let customPct = NaN;
  let customDaysTotal = 0;
  let customDaysElapsed = 0;
  let customDaysLeft = 0;
  if (mode === "custom" && startStr && endStr) {
    const s = new Date(startStr + "T00:00:00Z").getTime();
    const e = new Date(endStr + "T00:00:00Z").getTime();
    if (e > s) {
      customDaysTotal = Math.round((e - s) / 86_400_000);
      customPct = ((now.getTime() - s) / (e - s)) * 100;
      customDaysElapsed = Math.max(0, Math.min(customDaysTotal, Math.floor((now.getTime() - s) / 86_400_000)));
      customDaysLeft = customDaysTotal - customDaysElapsed;
    }
  }

  // Active pct + display number
  let pct = 0;
  let bigNum = "—";
  let categoryPill = "";
  let subtitle = "";
  let detailCards: { label: string; value: string }[] = [];
  let canShare = true;

  const VN_MONTH = `Tháng ${M + 1}`;
  const VN_DATE = `${pad2(D)}/${pad2(M + 1)}`;
  const VN_TIME = `${pad2(hh)}:${pad2(mm)}`;

  if (mode === "year") {
    pct = yearPct;
    bigNum = pct.toFixed(1) + "%";
    categoryPill = `Năm ${Y}`;
    subtitle = `Hôm nay ${VN_DATE} — đã qua ${yearDayIndex} ngày, còn lại ${yearDaysLeft} ngày`;
    detailCards = [
      { label: "Ngày trong năm", value: `${yearDayIndex}/${yearDaysTotal}` },
      { label: "Tuần", value: `${Math.min(weekIndex, 53)}/${isLeap(Y) ? 53 : 52}` },
      { label: "Tháng", value: `${M + 1}/12` },
      { label: `Quý ${quarter}`, value: `${qPct.toFixed(0)}% của Q${quarter}` },
    ];
  } else if (mode === "month") {
    pct = monthPct;
    bigNum = pct.toFixed(1) + "%";
    categoryPill = `${VN_MONTH}/${Y}`;
    subtitle = `Tháng ${M + 1} — đã qua ${D}/${monthDays} ngày, còn ${monthDays - D} ngày`;
    detailCards = [
      { label: "Ngày", value: `${D}/${monthDays}` },
      { label: "Tuần", value: `${Math.ceil(D / 7)}/${Math.ceil(monthDays / 7)}` },
      { label: "Cuối tuần", value: `${weekendCount} ngày` },
      { label: "Ngày làm", value: `${weekdayCount} ngày` },
    ];
  } else if (mode === "day") {
    pct = dayPct;
    bigNum = pct.toFixed(1) + "%";
    categoryPill = `${VN_TIME} ngày ${VN_DATE}`;
    subtitle = `${pad2(hh)}:${pad2(mm)}:${pad2(ss)} — đã qua ${pct.toFixed(1)}% của ngày ${VN_DATE}`;
    detailCards = [
      { label: "Giờ hiện tại", value: `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}` },
      { label: "Buổi", value: dayPartEmoji(hh) },
      { label: "Còn lại", value: `${hLeft}h ${pad2(mLeft)}p` },
      { label: "Đã qua", value: `${Math.floor(dayMinutes / 60)}h ${pad2(Math.floor(dayMinutes % 60))}p` },
    ];
  } else {
    // custom
    if (!isNaN(customPct) && customDaysTotal > 0) {
      pct = Math.max(0, Math.min(100, customPct));
      bigNum = customPct.toFixed(1) + "%";
      categoryPill = customTitle || "Mốc tuỳ chỉnh";
      subtitle = `${customDaysElapsed}/${customDaysTotal} ngày — còn ${Math.max(0, customDaysLeft)} ngày`;
      detailCards = [
        { label: "Bắt đầu", value: startStr },
        { label: "Kết thúc", value: endStr },
        { label: "Đã qua", value: `${customDaysElapsed} ngày` },
        { label: "Còn lại", value: `${Math.max(0, customDaysLeft)} ngày` },
      ];
    } else {
      canShare = false;
      bigNum = "—";
      subtitle = "Nhập ngày bắt đầu và kết thúc để tính %";
    }
  }

  const pctClamped = Math.max(0, Math.min(100, pct));
  const barColor = pctGradient(pctClamped);
  const numColor = pctTextColor(pctClamped);

  const shareData = useMemo(() => {
    if (!canShare) return null;
    const state: import("@/lib/share-state").ShareStateTimeProgress = {
      tab: "time-progress",
      mode,
      ...(mode === "custom" ? { start: startStr, end: endStr, title: customTitle || undefined } : {}),
    };
    let title = "";
    let text = "";
    if (mode === "year") {
      title = `Năm ${Y} đã qua ${pct.toFixed(1)}%`;
      text = `📅 Năm ${Y} đã đi được ${pct.toFixed(1)}%! Còn ${yearDaysLeft} ngày để hoàn thành mục tiêu.`;
    } else if (mode === "month") {
      title = `${VN_MONTH} đã qua ${pct.toFixed(1)}%`;
      text = `📆 Tháng ${M + 1}/${Y} đã đi được ${pct.toFixed(1)}% — còn ${monthDays - D} ngày.`;
    } else if (mode === "day") {
      title = `Hôm nay ${VN_DATE} đã qua ${pct.toFixed(1)}%`;
      text = `🕐 ${VN_TIME} — ngày ${VN_DATE} đã qua ${pct.toFixed(1)}%. Còn ${hLeft}h ${pad2(mLeft)}p tới nửa đêm.`;
    } else {
      title = (customTitle || "Cột mốc") + ` — đã qua ${pct.toFixed(1)}%`;
      text = `📅 ${customTitle || "Mốc"}: ${customDaysElapsed}/${customDaysTotal} ngày (${pct.toFixed(1)}%)`;
    }
    return {
      url: buildShareUrl(state),
      ogImageUrl: buildOgImageUrl(state),
      title,
      text,
    };
    // Re-build on key state changes:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, startStr, endStr, customTitle, Math.round(pct * 10)]);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Hôm nay đã qua bao nhiêu phần trăm? Tính live năm / tháng / ngày / mốc tuỳ chỉnh.
      </p>

      {/* Mode buttons */}
      <div className="grid grid-cols-4 gap-2">
        {([
          { id: "year", label: "Năm", icon: "📅" },
          { id: "month", label: "Tháng", icon: "📆" },
          { id: "day", label: "Ngày", icon: "🕐" },
          { id: "custom", label: "Tuỳ chỉnh", icon: "🎯" },
        ] as const).map(b => (
          <button
            key={b.id}
            onClick={() => setMode(b.id)}
            className={`rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 ${mode === b.id ? "tab-active" : ""}`}
            style={mode === b.id ? {} : { background: "var(--border)", color: "var(--text)" }}
          >
            <span className="mr-1">{b.icon}</span>
            <span>{b.label}</span>
          </button>
        ))}
      </div>

      {/* Custom inputs */}
      {mode === "custom" && (
        <div className="flex flex-col gap-3 rounded-xl p-3" style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Tiêu đề (tuỳ chọn)</label>
            <input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="VD: Deadline dự án, Đám cưới..."
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Ngày bắt đầu</label>
              <input
                type="date"
                value={startStr}
                onChange={e => setStartStr(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Ngày kết thúc</label>
              <input
                type="date"
                value={endStr}
                onChange={e => setEndStr(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Category pill */}
      {categoryPill && (
        <div className="flex justify-center">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
            style={{ background: numColor, color: "#fff" }}
          >
            {categoryPill}
          </span>
        </div>
      )}

      {/* Big number */}
      <div className="text-center py-2">
        <p
          className="font-black leading-none"
          style={{ fontSize: "clamp(72px, 18vw, 160px)", color: numColor, letterSpacing: "-0.04em" }}
        >
          {bigNum}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full rounded-full overflow-hidden" style={{ height: 12, background: "var(--border)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pctClamped}%`, background: barColor }}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
          {subtitle}
        </p>
      )}

      {/* Detail cards */}
      {detailCards.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {detailCards.map((c, i) => (
            <div key={i} className="rounded-xl p-3" style={{ background: "var(--border)" }}>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.label}</p>
              <p className="font-bold text-base mt-0.5" style={{ color: "var(--text)" }}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Motivational note (year mode only) */}
      {mode === "year" && (
        <div className="rounded-xl p-3 text-center text-sm font-medium" style={{ background: "var(--result-bg)", color: "var(--result-text)" }}>
          {motivational(pctClamped)}
        </div>
      )}

      {shareData && (
        <>
          <ShareButton onClick={() => setShareOpen(true)} />
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            url={shareData.url}
            title={shareData.title}
            text={shareData.text}
            ogImageUrl={shareData.ogImageUrl}
          />
        </>
      )}
    </div>
  );
}

// TAB_COMPONENTS map kept for non-shareable tabs.
// Shareable tabs (discount, compound, salary-tax, breakeven, weight-bmi) accept an optional `initial` prop.
const TAB_COMPONENTS: Record<TabId, React.FC> = {
  "percent-of": TabPercentOf,
  "what-percent": TabWhatPercent,
  "change": TabChange,
  "increase-decrease": TabIncreaseDecrease,
  "find-base": TabFindBase,
  "discount": TabDiscount as unknown as React.FC,
  "compare": TabCompare,
  "tip": TabTip as unknown as React.FC,
  "interest": TabInterest,
  "compound": TabCompound as unknown as React.FC,
  "salary-tax": TabSalaryTax as unknown as React.FC,
  "breakeven": TabBreakeven as unknown as React.FC,
  "recipe-scale": TabRecipeScale,
  "weight-bmi": TabWeightBMI as unknown as React.FC,
  "time-progress": TabTimeProgress as unknown as React.FC,
};

// ────────── Shared UI pieces ──────────

function TabButton({ tab, isActive, onClick, fullWidth = false }: { tab: { id: TabId; label: string; icon: string }; isActive: boolean; onClick: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? "w-full text-center" : "shrink-0"} rounded-xl px-3 py-2 text-sm font-semibold transition-all whitespace-nowrap active:scale-95 ${isActive ? "tab-active" : ""}`}
      style={isActive ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
    >
      {tab.icon} {tab.label}
    </button>
  );
}

function HistoryPanel({ history, setHistory, compact = false }: { history: HistoryItem[]; setHistory: (h: HistoryItem[]) => void; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${compact ? "" : "slide-in"}`} style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-sm">🕐 Lịch sử ({history.length})</p>
        {history.length > 0 && (
          <button onClick={() => { setHistory([]); localStorage.setItem("calc-history", "[]"); }} className="text-xs text-red-400 hover:text-red-500">Xóa tất cả</button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>Chưa có lịch sử</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          {history.slice().reverse().map(h => (
            <div key={h.id} className="flex items-center justify-between gap-2 rounded-xl px-3 py-2" style={{ background: "var(--bg)" }}>
              <div className="min-w-0">
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{h.label}</p>
                <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{h.result}</p>
              </div>
              <p className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{h.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const INFO_CARDS = [
  { icon: "⚡", label: "Tính ngay", sub: "Không cần nhấn Enter" },
  { icon: "📱", label: "Mobile-first", sub: "Tối ưu điện thoại" },
  { icon: "🆓", label: "Miễn phí", sub: "100% không quảng cáo" },
];

function InfoCardsVertical() {
  return (
    <div className="flex flex-col gap-3">
      {INFO_CARDS.map(c => (
        <div key={c.label} className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-2xl shrink-0">{c.icon}</p>
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{c.label}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InfoCardsGrid() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {INFO_CARDS.map(c => (
        <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <p className="text-xl mb-1">{c.icon}</p>
          <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{c.label}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

function RelatedTools({ currentTab }: { currentTab: TabId }) {
  const group = TAB_GROUPS.find(g => g.tabs.includes(currentTab));
  const related = (group?.tabs ?? []).filter(id => id !== currentTab).slice(0, 4);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold uppercase mb-1 px-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
        🔗 Công cụ liên quan
      </p>
      {related.map(tabId => {
        const tab = TABS.find(t => t.id === tabId);
        if (!tab) return null;
        return (
          <Link
            key={tabId}
            href={TAB_URL_MAP[tabId]}
            className="block rounded-xl px-3 py-2 text-sm transition-all hover:opacity-80"
            style={{ background: "var(--card)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <p className="font-semibold">{tab.icon} {tab.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{TAB_DESCRIPTIONS[tabId]}</p>
          </Link>
        );
      })}
      <Link
        href="/"
        className="block rounded-xl px-3 py-2 text-sm font-semibold text-center mt-1 transition-all hover:opacity-80"
        style={{ background: "var(--primary)", color: "#fff" }}
      >
        ← Xem tất cả công cụ
      </Link>
    </div>
  );
}

interface CalculatorProps {
  initialTab?: TabId;
  singleTab?: boolean;
  breadcrumb?: ReactNode;
}

export default function Calculator(props: CalculatorProps = {}) {
  return (
    <Suspense fallback={null}>
      <CalculatorInner {...props} />
    </Suspense>
  );
}

function CalculatorInner({ initialTab, singleTab = false, breadcrumb }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab ?? "percent-of");
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchParams = useSearchParams();

  // Decode shareable state from URL once per (initialTab, searchParams) change.
  const decoded = useMemo(() => {
    if (!initialTab || !searchParams) return null;
    const p = searchParams;
    switch (initialTab) {
      case "weight-bmi":   return { tab: initialTab, data: decodeBMI(p) };
      case "salary-tax":   return { tab: initialTab, data: decodeSalaryTax(p) };
      case "compound":     return { tab: initialTab, data: decodeCompound(p) };
      case "discount":     return { tab: initialTab, data: decodeDiscount(p) };
      case "breakeven":    return { tab: initialTab, data: decodeBreakeven(p) };
      case "tip":          return { tab: initialTab, data: decodeTip(p) };
      case "time-progress": return { tab: initialTab, data: decodeTimeProgress(p) };
      default: return null;
    }
  }, [initialTab, searchParams]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") { setDark(true); document.documentElement.classList.add("dark"); }
    try {
      const h = JSON.parse(localStorage.getItem("calc-history") || "[]");
      setHistory(h);
    } catch {}
  }, []);

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const ActiveTab = TAB_COMPONENTS[activeTab];

  // Render helper: pass decoded initial when active tab matches decoded.tab
  const renderActiveTab = () => {
    if (decoded && decoded.tab === activeTab) {
      const Comp = ActiveTab as React.FC<{ initial?: unknown }>;
      return <Comp key={activeTab} initial={decoded.data} />;
    }
    return <ActiveTab key={activeTab} />;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:max-w-7xl lg:mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--primary)" }}>%</div>
            <div>
              <p className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>Phần Trăm</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>phantram.online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://blog.phantram.online/"
              className="flex items-center gap-1 rounded-xl px-3 h-9 text-sm font-semibold transition-all active:scale-95 hover:opacity-80"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              <span>📝</span>
              <span>Blog</span>
            </a>
            {/* Lịch sử chỉ hiện mobile/tablet (PC có sidekick) */}
            <button onClick={() => setShowHistory(h => !h)} className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95" style={{ background: "var(--border)" }} title="Lịch sử">🕐</button>
            <button onClick={toggleDark} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95" style={{ background: "var(--border)" }}>{dark ? "☀️" : "🌙"}</button>
          </div>
        </div>
      </header>

      {/* Breadcrumb (under header, non-sticky) */}
      {breadcrumb && (
        <div className="border-b" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 text-sm" style={{ color: "var(--text-muted)" }}>
            {breadcrumb}
          </div>
        </div>
      )}

      {/* History panel — chỉ mobile/tablet khi toggle */}
      {showHistory && (
        <div className="lg:hidden mx-4 mt-3">
          <HistoryPanel history={history} setHistory={setHistory} />
        </div>
      )}

      {/* ═══ MOBILE + TABLET LAYOUT ═══ */}
      <div className="lg:hidden">
        {!singleTab && (
          <>
            {/* Mobile: scroll ngang với gradient fade */}
            <div className="md:hidden relative">
              <div className="overflow-x-auto px-4 py-3 flex gap-2 no-scrollbar" style={{ scrollbarWidth: "none" }}>
                {TABS.map(tab => (
                  <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: "linear-gradient(to right, transparent, var(--bg))" }} />
              <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: "linear-gradient(to left, transparent, var(--bg))" }} />
            </div>
            {/* Tablet: grid 3 cột */}
            <div className="hidden md:grid grid-cols-3 gap-2 px-4 py-3">
              {TABS.map(tab => (
                <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} fullWidth />
              ))}
            </div>
          </>
        )}

        <main className="px-4 pb-8 pt-3">
          <div className="max-w-lg md:max-w-2xl mx-auto rounded-2xl p-5 shadow-sm border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            {renderActiveTab()}
          </div>

          <div className="max-w-lg md:max-w-2xl mx-auto">
            <BasicCalc />
          </div>

          {singleTab && (
            <div className="max-w-lg md:max-w-2xl mx-auto mt-4">
              <RelatedTools currentTab={activeTab} />
            </div>
          )}

          <div className="max-w-lg md:max-w-2xl mx-auto mt-4">
            <InfoCardsGrid />
          </div>
        </main>
      </div>

      {/* ═══ DESKTOP LAYOUT ═══ */}
      <div className="hidden lg:block w-full px-6 py-6 flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
          {/* Sidebar trái: groups (full) hoặc công cụ liên quan (singleTab) */}
          <aside className="col-span-3 sticky top-20 self-start">
            {singleTab ? (
              <RelatedTools currentTab={activeTab} />
            ) : (
              TAB_GROUPS.map(group => (
                <div key={group.id} className="mb-5">
                  <p className="text-xs font-bold uppercase mb-2 px-2 tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {group.icon} {group.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {group.tabs.map(tabId => {
                      const tab = TABS.find(t => t.id === tabId);
                      if (!tab) return null;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`text-left rounded-lg px-3 py-2 text-sm font-medium transition-all active:scale-95 ${isActive ? "tab-active" : "hover:opacity-80"}`}
                          style={isActive ? {} : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </aside>

          {/* Main calculator */}
          <section className="col-span-6">
            <div className="rounded-2xl p-6 shadow-sm border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              {renderActiveTab()}
            </div>
          </section>

          {/* Sidekick phải: lịch sử + basic calc + info */}
          <aside className="col-span-3 flex flex-col gap-4">
            <HistoryPanel history={history} setHistory={setHistory} compact />
            <BasicCalc compact />
            <InfoCardsVertical />
          </aside>
        </div>
      </div>

      {!singleTab && (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-xl lg:text-2xl font-bold" style={{ color: "var(--text)" }}>
              🔗 Mở từng công cụ trên trang riêng
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Mỗi tool có URL độc lập — chia sẻ link nhanh, bookmark dễ
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {TABS.map((tab) => (
              <Link
                key={tab.id}
                href={TAB_URL_MAP[tab.id]}
                className="rounded-xl border p-4 transition-all hover:opacity-80 hover:scale-[1.02] active:scale-95"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">{tab.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                      {tab.label}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      {TAB_DESCRIPTIONS[tab.id]}
                    </p>
                    <p className="text-xs mt-2 font-semibold text-blue-500">
                      Mở trang riêng →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!singleTab && <BlogSection />}

      {!singleTab && <IntroSEO />}

      {!singleTab && (
        <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 phantram.online — Công cụ tính % miễn phí
        </footer>
      )}
    </div>
  );
}
