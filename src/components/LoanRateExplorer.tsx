"use client";

import { useMemo, useState } from "react";
import type { LoanRate } from "@/data/bank-rates";

const fmtVND = (n: number) => {
  if (!isFinite(n) || n <= 0) return "0 ₫";
  return Math.round(n).toLocaleString("vi-VN") + " ₫";
};

const parseAmount = (raw: string): number => {
  const cleaned = raw.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

// PMT: P * r / (1 - (1+r)^-n) ; r = annual/12, n = months
function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export default function LoanRateExplorer({ rates }: { rates: LoanRate[] }) {
  const [amountRaw, setAmountRaw] = useState("2,000,000,000");
  const [termYears, setTermYears] = useState(20);

  const amount = parseAmount(amountRaw);
  const months = termYears * 12;

  const top5 = useMemo(() => {
    return rates
      .map((bank) => {
        const monthly = monthlyPayment(amount, bank.initial.rate, months);
        const totalInitial = monthly * bank.initial.months;
        const interestInitial = totalInitial - (amount / months) * bank.initial.months;
        return { bank, monthly, interestInitial };
      })
      .sort((a, b) => a.monthly - b.monthly)
      .slice(0, 5);
  }, [rates, amount, months]);

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
            Số tiền vay (VND)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={amountRaw}
            onChange={(e) => {
              const n = parseAmount(e.target.value);
              setAmountRaw(n ? n.toLocaleString("vi-VN") : "");
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
            Thời hạn vay (năm): <strong>{termYears}</strong>
          </label>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={termYears}
            onChange={(e) => setTermYears(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <span>5 năm</span>
            <span>30 năm</span>
          </div>
        </div>
      </div>

      <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
        Top 5 ngân hàng có khoản trả hàng tháng thấp nhất (theo lãi ưu đãi){" "}
        — vay {fmtVND(amount)} trong {termYears} năm:
      </p>

      <div className="space-y-2">
        {top5.map((row, i) => {
          const isBait = row.bank.initial.rate < 6;
          return (
            <div
              key={row.bank.shortName}
              className="rounded-xl border p-3 flex items-center gap-3"
              style={{
                background: isBait ? "rgba(239,68,68,0.06)" : "var(--bg)",
                borderColor: isBait ? "rgba(239,68,68,0.3)" : "var(--border)",
              }}
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
                  <span className="ml-2 text-xs font-bold" style={{ color: "#059669" }}>
                    {row.bank.initial.rate}%/năm
                  </span>
                  <span className="ml-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    ({row.bank.initial.months}th đầu)
                  </span>
                  {isBait && (
                    <span
                      className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#ef4444", color: "#fff" }}
                    >
                      ⚠️ LÃI MỒI
                    </span>
                  )}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Trả hàng tháng: <strong>{fmtVND(row.monthly)}</strong> · Sau ưu đãi:{" "}
                  {row.bank.afterPromo.rateMin}-{row.bank.afterPromo.rateMax}%/năm
                </p>
              </div>
              <a
                href={`/lai-kep?p=${amount}&r=${row.bank.initial.rate}&u=year&f=monthly&t=${termYears}`}
                className="rounded-lg px-3 h-9 inline-flex items-center text-xs font-semibold shrink-0 transition-all active:scale-95"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                Chi tiết →
              </a>
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-3 italic" style={{ color: "var(--text-muted)" }}>
        ⚠️ Tính theo lãi <strong>ưu đãi ban đầu</strong>. Sau {top5[0]?.bank.initial.months || 6}-12 tháng,
        lãi thả nổi 10-15% → trả hàng tháng <strong>tăng 30-50%</strong>. Đừng chỉ nhìn rate ưu đãi.
      </p>
    </div>
  );
}
