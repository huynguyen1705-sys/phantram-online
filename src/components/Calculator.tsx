"use client";
import { useState, useEffect, useCallback } from "react";
import BlogSection from "./BlogSection";
import IntroSEO from "./IntroSEO";

type TabId = "percent-of" | "what-percent" | "change" | "increase-decrease" | "find-base" | "discount" | "compare" | "tip" | "interest" | "compound" | "salary-tax" | "breakeven";

interface HistoryItem {
  id: number;
  label: string;
  result: string;
  time: string;
}

const TABS: { id: TabId; label: string; icon: string }[] = [
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

function TabDiscount() {
  const [orig, setOrig] = useState(""); const [disc, setDisc] = useState(""); const [copied, setCopied] = useState(false);
  const salePrice = orig !== "" && disc !== "" ? parseFloat(orig) * (1 - parseFloat(disc) / 100) : NaN;
  const saved = !isNaN(salePrice) ? parseFloat(orig) - salePrice : NaN;
  const result = isNaN(salePrice) ? "" : `${formatNum(salePrice)} ₫`;
  const formula = result ? `Tiết kiệm: ${formatNum(saved)} ₫ | Giá gốc: ${formatNum(parseFloat(orig))} ₫` : "";
  const copy = () => { navigator.clipboard?.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
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
function BasicCalc() {
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
    <div className="max-w-lg mx-auto mt-4 rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      {/* Display */}
      <div className="px-5 pt-4 pb-3" style={{ background: "var(--card)" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--text-muted)" }}>MÁY TÍNH</p>
          <button onClick={copy} className="text-xs px-2 py-0.5 rounded-lg font-semibold transition-all" style={{ background: copied ? "#22c55e" : "var(--border)", color: copied ? "#fff" : "var(--text-muted)" }}>{copied ? "✓" : "copy"}</button>
        </div>
        <div className="min-h-[3rem] flex items-end justify-end">
          <p className="text-right font-bold leading-tight break-all" style={{ fontSize: display.length > 12 ? "1.4rem" : display.length > 8 ? "1.8rem" : "2.4rem", color: "var(--text)" }}>{display}</p>
        </div>
        {expr && !justCalc && <p className="text-right text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{expr}</p>}
      </div>
      {/* Buttons */}
      <div className="p-3 grid gap-2">
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
                  className="rounded-2xl py-4 text-xl font-bold transition-all active:scale-95 select-none"
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

function TabCompound() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [period, setPeriod] = useState("");
  const [periodUnit, setPeriodUnit] = useState<"month" | "year">("year");
  const [compFreq, setCompFreq] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [copied, setCopied] = useState(false);

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
function TabSalaryTax() {
  const [gross, setGross] = useState("");
  const [dependents, setDependents] = useState("0");
  const [showDetail, setShowDetail] = useState(false);
  const [copied, setCopied] = useState(false);

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
function TabBreakeven() {
  const [mode, setMode] = useState<"recovery" | "sales" | "invest">("recovery");
  const [copied, setCopied] = useState(false);

  // Mode A — Recovery (bù lỗ)
  const [loss, setLoss] = useState("");
  const lossNum = parseFloat(loss);
  const recovery = loss !== "" && !isNaN(lossNum) && lossNum < 100 && lossNum > 0
    ? (lossNum / (100 - lossNum)) * 100
    : NaN;

  // Mode B — Sales BEP
  const [fc, setFc] = useState("");
  const [price, setPrice] = useState("");
  const [vc, setVc] = useState("");
  const fcN = parseFloat(fc), priceN = parseFloat(price), vcN = parseFloat(vc);
  const margin = price !== "" && vc !== "" ? priceN - vcN : NaN;
  const marginPct = !isNaN(margin) && priceN > 0 ? (margin / priceN) * 100 : NaN;
  const bepUnits = fc !== "" && !isNaN(margin) && margin > 0 ? fcN / margin : NaN;
  const bepRevenue = !isNaN(bepUnits) ? bepUnits * priceN : NaN;

  // Mode C — Investment payback
  const [capital, setCapital] = useState("");
  const [monthlyProfit, setMonthlyProfit] = useState("");
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

      {mode === "recovery" && (
        <>
          <NumInput label="% đã lỗ" value={loss} onChange={setLoss} placeholder="VD: 20" suffix="%" />
          <ResultBox result={result} formula={formula} onCopy={copy} copied={copied} />
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

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  "percent-of": TabPercentOf,
  "what-percent": TabWhatPercent,
  "change": TabChange,
  "increase-decrease": TabIncreaseDecrease,
  "find-base": TabFindBase,
  "discount": TabDiscount,
  "compare": TabCompare,
  "tip": TabTip,
  "interest": TabInterest,
  "compound": TabCompound,
  "salary-tax": TabSalaryTax,
  "breakeven": TabBreakeven,
};

export default function Calculator() {
  const [activeTab, setActiveTab] = useState<TabId>("percent-of");
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
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
          <button onClick={() => setShowHistory(h => !h)} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95" style={{ background: "var(--border)" }} title="Lịch sử">🕐</button>
          <button onClick={toggleDark} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-95" style={{ background: "var(--border)" }}>{dark ? "☀️" : "🌙"}</button>
        </div>
      </header>

      {/* History panel */}
      {showHistory && (
        <div className="mx-4 mt-3 rounded-2xl border p-4 slide-in" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">Lịch sử tính ({history.length})</p>
            {history.length > 0 && (
              <button onClick={() => { setHistory([]); localStorage.setItem("calc-history", "[]"); }} className="text-xs text-red-400 hover:text-red-500">Xóa tất cả</button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>Chưa có lịch sử</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
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
      )}

      {/* Tab scroll */}
      <div className="overflow-x-auto px-4 py-3 flex gap-2 no-scrollbar" style={{ scrollbarWidth: "none" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition-all whitespace-nowrap active:scale-95 ${activeTab === tab.id ? "tab-active" : ""}`}
            style={activeTab === tab.id ? {} : { background: "var(--card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main card */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-lg mx-auto rounded-2xl p-5 shadow-sm border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <ActiveTab key={activeTab} />
        </div>

        <BasicCalc />

        {/* Info cards */}
        <div className="max-w-lg mx-auto mt-4 grid grid-cols-3 gap-3">
          {[
            { icon: "⚡", label: "Tính ngay", sub: "Không cần nhấn Enter" },
            { icon: "📱", label: "Mobile-first", sub: "Tối ưu điện thoại" },
            { icon: "🆓", label: "Miễn phí", sub: "100% không quảng cáo" },
          ].map(c => (
            <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p className="text-xl mb-1">{c.icon}</p>
              <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{c.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.sub}</p>
            </div>
          ))}
        </div>
      </main>

      <BlogSection />

      <IntroSEO />

      <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
        © 2026 phantram.online — Công cụ tính % miễn phí
      </footer>
    </div>
  );
}
