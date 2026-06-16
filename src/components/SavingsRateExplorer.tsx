"use client";

import { useMemo, useState } from "react";
import type { SavingsRate } from "@/data/bank-rates";

type TermKey = "m6" | "m9" | "m12" | "m18" | "m24";

const TERM_OPTIONS: { key: TermKey; label: string; months: number; years: number }[] = [
  { key: "m6", label: "6 tháng", months: 6, years: 0.5 },
  { key: "m9", label: "9 tháng", months: 9, years: 0.75 },
  { key: "m12", label: "12 tháng", months: 12, years: 1 },
  { key: "m18", label: "18 tháng", months: 18, years: 1.5 },
  { key: "m24", label: "24 tháng", months: 24, years: 2 },
];

const fmtVND = (n: number) => {
  if (!isFinite(n) || n <= 0) return "0 ₫";
  return Math.round(n).toLocaleString("vi-VN") + " ₫";
};

const parseAmount = (raw: string): number => {
  const cleaned = raw.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export default function SavingsRateExplorer({ rates }: { rates: SavingsRate[] }) {
  const [principalRaw, setPrincipalRaw] = useState("100,000,000");
  const [term, setTerm] = useState<TermKey>("m12");

  const principal = parseAmount(principalRaw);
  const termOpt = TERM_OPTIONS.find((t) => t.key === term)!;

  const top5 = useMemo(() => {
    const filtered = rates
      .filter((r) => r.rates[term] !== null)
      .map((r) => ({
        bank: r,
        rate: r.rates[term] as number,
      }))
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
    return filtered.map(({ bank, rate }) => ({
      bank,
      rate,
      interest: (principal * rate * termOpt.years) / 100,
      total: principal + (principal * rate * termOpt.years) / 100,
    }));
  }, [rates, term, principal, termOpt.years]);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="grid gap-4 sm:grid-cols-2 mb-5">
        <div>
          <label
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "var(--text)" }}
          >
            Số tiền gửi (VND)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={principalRaw}
            onChange={(e) => {
              const n = parseAmount(e.target.value);
              setPrincipalRaw(n ? n.toLocaleString("vi-VN") : "");
            }}
            className="w-full rounded-xl px-3 h-11 text-base border outline-none focus:ring-2"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          />
        </div>
        <div>
          <label
            className="block text-sm font-semibold mb-1.5"
            style={{ color: "var(--text)" }}
          >
            Kỳ hạn
          </label>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value as TermKey)}
            className="w-full rounded-xl px-3 h-11 text-base border outline-none focus:ring-2"
            style={{
              background: "var(--bg)",
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {TERM_OPTIONS.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        Top 5 ngân hàng lãi cao nhất kỳ hạn {termOpt.label} — gửi {fmtVND(principal)}:
      </p>

      <div className="space-y-2">
        {top5.length === 0 && (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Chưa có ngân hàng nào công bố rate cho kỳ hạn này.
          </p>
        )}
        {top5.map((row, i) => (
          <div
            key={row.bank.shortName}
            className="rounded-xl border p-3 flex items-center gap-3"
            style={{ background: "var(--bg)", borderColor: "var(--border)" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: i === 0 ? "#fbbf24" : "var(--card)",
                color: i === 0 ? "#000" : "var(--text)",
                border: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                {row.bank.logo} {row.bank.shortName}
                <span
                  className="ml-2 text-xs font-bold"
                  style={{ color: "#059669" }}
                >
                  {row.rate.toFixed(2)}%/năm
                </span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Lãi {termOpt.label}: <strong>{fmtVND(row.interest)}</strong> · Tổng nhận:{" "}
                <strong>{fmtVND(row.total)}</strong>
              </p>
            </div>
            <a
              href={`/lai-kep?p=${principal}&r=${row.rate}&u=year&f=yearly&t=${termOpt.years}`}
              className="rounded-lg px-3 h-9 inline-flex items-center text-xs font-semibold shrink-0 transition-all active:scale-95"
              style={{ background: "var(--primary)", color: "#fff" }}
            >
              Tính chi tiết →
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 italic" style={{ color: "var(--text-muted)" }}>
        Lưu ý: tính lãi đơn (gốc × rate × thời gian). Lãi kép thực tế cao hơn — xem trang Lãi kép.
      </p>
    </div>
  );
}
