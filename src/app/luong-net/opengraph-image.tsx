import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Tính lương NET — phantram.online";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };
function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function formatVND(n: number): string {
  if (!isFinite(n)) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " tr";
  return Math.round(n).toLocaleString("vi-VN");
}

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
  let tax = 0, prev = 0, remaining = income;
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

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const g = parseFloat(pick(searchParams, "g"));
  const dep = parseInt(pick(searchParams, "d") || "0", 10) || 0;

  let net = NaN, netPct = NaN, tax = NaN;
  if (g > 0) {
    const CAP_BHXH = 46_800_000;
    const CAP_BHTN = 99_200_000;
    const baseBHXH = Math.min(g, CAP_BHXH);
    const baseBHTN = Math.min(g, CAP_BHTN);
    const totalInsurance = baseBHXH * 0.08 + baseBHXH * 0.015 + baseBHTN * 0.01;
    const beforeTax = g - totalInsurance;
    const taxable = Math.max(0, beforeTax - 11_000_000 - dep * 4_400_000);
    tax = calcTNCN(taxable);
    net = beforeTax - tax;
    netPct = (net / g) * 100;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 60, color: "white", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 56, height: 56, background: "#2563eb", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, marginRight: 18 }}>%</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>phantram.online</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>Tính lương NET sau thuế TNCN 2026</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 8 }}>Lương NET / tháng</div>
          <div style={{ fontSize: 140, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>
            {isFinite(net) && net > 0 ? formatVND(net) : "—"}
          </div>
          {isFinite(netPct) && (
            <div style={{ fontSize: 36, fontWeight: 700, color: "#22c55e", marginTop: 16 }}>
              ≈ {netPct.toFixed(1)}% Gross
            </div>
          )}
          {g > 0 && (
            <div
              style={{
                display: "flex", gap: 28, marginTop: 32, fontSize: 22, opacity: 0.85,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ opacity: 0.6, fontSize: 18 }}>Gross</div>
                <div style={{ fontWeight: 700 }}>{formatVND(g)} ₫</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ opacity: 0.6, fontSize: 18 }}>Thuế TNCN</div>
                <div style={{ fontWeight: 700, color: "#f87171" }}>{formatVND(tax)} ₫</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ opacity: 0.6, fontSize: 18 }}>Phụ thuộc</div>
                <div style={{ fontWeight: 700 }}>{dep}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.6, marginTop: 20 }}>
          <div>BHXH 8% • BHYT 1.5% • BHTN 1% • TNCN 7 bậc</div>
          <div>phantram.online/luong-net</div>
        </div>
      </div>
    ),
    size
  );
}
