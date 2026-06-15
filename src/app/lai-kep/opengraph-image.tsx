import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lãi kép — phantram.online";
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

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const p = parseFloat(pick(searchParams, "p"));
  const rate = parseFloat(pick(searchParams, "r"));
  const t = parseFloat(pick(searchParams, "t"));
  const unit = pick(searchParams, "u") === "month" ? "month" : "year";
  const freq = pick(searchParams, "f") || "monthly";
  const freqMap: Record<string, number> = { monthly: 12, quarterly: 4, yearly: 1 };
  const n = freqMap[freq] ?? 12;

  let amount = NaN, interest = NaN;
  if (isFinite(p) && p > 0 && isFinite(rate) && isFinite(t) && t > 0) {
    const r = rate / 100;
    const rYear = unit === "month" ? r * 12 : r;
    const tYear = unit === "month" ? t / 12 : t;
    amount = p * Math.pow(1 + rYear / n, n * tYear);
    interest = amount - p;
  }

  const periodLabel = isFinite(t) && t > 0
    ? `${t} ${unit === "month" ? "tháng" : "năm"}`
    : "—";
  const amountStr = isFinite(amount) ? formatVND(amount) + " ₫" : "—";
  const interestStr = isFinite(interest) ? "+ Lãi " + formatVND(interest) + " ₫" : "";
  const rateLabel = isFinite(rate)
    ? `${rate}% / ${unit === "month" ? "th" : "năm"}`
    : "—";
  const freqLabel = freq === "monthly" ? "Tháng" : freq === "quarterly" ? "Quý" : "Năm";

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
            <div style={{ fontSize: 16, opacity: 0.7 }}>Lãi kép — Compound interest</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", fontSize: 28, opacity: 0.8, marginBottom: 8 }}>Tổng tích lũy sau {periodLabel}</div>
          <div style={{ display: "flex", fontSize: 130, fontWeight: 900, color: "#22c55e", lineHeight: 1 }}>
            {amountStr}
          </div>
          {interestStr && (
            <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#fbbf24", marginTop: 16 }}>
              {interestStr}
            </div>
          )}
          {isFinite(p) && p > 0 && isFinite(rate) && (
            <div style={{ display: "flex", gap: 28, marginTop: 32, fontSize: 22, opacity: 0.85 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", opacity: 0.6, fontSize: 18 }}>Vốn gốc</div>
                <div style={{ display: "flex", fontWeight: 700 }}>{formatVND(p)} ₫</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", opacity: 0.6, fontSize: 18 }}>Lãi suất</div>
                <div style={{ display: "flex", fontWeight: 700 }}>{rateLabel}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", opacity: 0.6, fontSize: 18 }}>Ghép lãi</div>
                <div style={{ display: "flex", fontWeight: 700 }}>{freqLabel}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.6, marginTop: 20 }}>
          <div style={{ display: "flex" }}>Compound interest calculator</div>
          <div style={{ display: "flex" }}>phantram.online/lai-kep</div>
        </div>
      </div>
    ),
    size
  );
}
