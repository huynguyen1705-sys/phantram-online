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
  type DecodedBMI,
  type DecodedSalaryTax,
  type DecodedCompound,
  type DecodedDiscount,
  type DecodedBreakeven,
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

export type TabId = "percent-of" | "what-percent" | "change" | "increase-decrease" | "find-base" | "discount" | "compare" | "tip" | "interest" | "compound" | "salary-tax" | "breakeven" | "recipe-scale" | "weight-bmi";

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
];

export const TAB_GROUPS: { id: string; label: string; icon: string; tabs: TabId[] }[] = [
  { id: "basic", label: "Cơ bản", icon: "🧮", tabs: ["percent-of", "what-percent", "change", "increase-decrease", "find-base"] },
  { id: "finance", label: "Tài chính", icon: "💰", tabs: ["interest", "compound", "salary-tax", "breakeven"] },
  { id: "shopping", label: "Mua sắm", icon: "🛒", tabs: ["discount", "compare", "tip"] },
  { id: "daily", label: "Tiện ích", icon: "🛠", tabs: ["recipe-scale", "weight-bmi"] },
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

function TabTip() {
  const [bill, setBill] = useState(""); const [tipPct, setTipPct] = useState("10"); const [people, setPeople] = useState("2"); const [copied, setCopied] = useState(false);
  const billNum = parseFloat(bill); const tipNum = parseFloat(tipPct); const peopleNum = parseInt(people) || 1;
  const tipAmt = bill !== "" ? billNum * tipNum / 100 : NaN;
  const total = !isNaN(tipAmt) ? billNum + tipAmt : NaN;
  const perPerson = !isNaN(total) ? total / peopleNum : NaN;
  const result = isNaN(perPerson) ? "" : `${formatNum(perPerson)} ₫/người`;
  const formula = result ? `Tip: ${formatNum(tipAmt)} ₫ | Tổng: ${formatNum(total)} ₫` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const TIP_PRESETS = ["5", "10", "15", "20"];
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tính tip nhà hàng & chia bill</p>
      <NumInput label="Tổng bill (₫)" value={bill} onChange={setBill} placeholder="VD: 500000" />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>Tip %</label>
        <div className="flex gap-2 flex-wrap">
          {TIP_PRESETS.map(t => (
            <button key={t} onClick={() => setTipPct(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${tipPct === t ? "tab-active" : ""}`} style={tipPct === t ? {} : { background: "var(--border)", color: "var(--text)" }}>{t}%</button>
          ))}
          <input type="number" value={tipPct} onChange={e => setTipPct(e.target.value)} className="w-20 rounded-lg border px-2 py-1.5 text-sm font-semibold" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text)" }} placeholder="Tùy chỉnh" inputMode="decimal" />
        </div>
      </div>
      <NumInput label="Số người" value={people} onChange={setPeople} placeholder="VD: 2" />
      <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
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
  "tip": TabTip,
  "interest": TabInterest,
  "compound": TabCompound as unknown as React.FC,
  "salary-tax": TabSalaryTax as unknown as React.FC,
  "breakeven": TabBreakeven as unknown as React.FC,
  "recipe-scale": TabRecipeScale,
  "weight-bmi": TabWeightBMI as unknown as React.FC,
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
