import { ImageResponse } from "next/og";
import { headers } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const alt = "Chia bill nhóm + Tip — 1phantram.com";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };

function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function formatShort(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return Math.round(n).toString();
}

export default async function Image(_props: { searchParams?: SP } = {}) {
  const h_ = await headers();
  const qs = h_.get("x-search") || "";
  const sp_: SP = Object.fromEntries(new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs).entries());
  const searchParams: SP = sp_;
  const total = parseFloat(pick(searchParams, "t"));
  const n = parseInt(pick(searchParams, "n"));
  const tip = parseFloat(pick(searchParams, "tip"));
  const vat = parseFloat(pick(searchParams, "vat"));

  const color = { light: "#fed7aa", mid: "#f97316", dark: "#c2410c" };
  const hasData = total > 0 && n > 0;

  const perPerson = hasData ? total / n : NaN;
  const stats: Array<{ value: string; label: string }> = hasData
    ? [
        { value: formatShort(perPerson) + "₫", label: "Mỗi người" },
        { value: (isFinite(vat) && !isNaN(vat) ? vat : 0) + "%", label: "VAT" },
        { value: (isFinite(tip) && !isNaN(tip) ? tip : 0) + "%", label: "Tip" },
      ]
    : [];

  const numberDisplay = hasData ? formatShort(total) + "₫" : "🍽";
  const pillLabel = hasData ? `Chia cho ${n} người` : "Chia bill cùng bạn bè";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${color.light} 0%, ${color.mid} 50%, ${color.dark} 100%)`,
          padding: 60,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: 200, background: "rgba(255,255,255,0.15)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, borderRadius: 250, background: "rgba(255,255,255,0.08)", display: "flex" }} />

        <div style={{ position: "absolute", top: 100, left: 140, fontSize: 36, display: "flex" }}>✨</div>
        <div style={{ position: "absolute", top: 120, right: 160, fontSize: 32, display: "flex" }}>⭐</div>
        <div style={{ position: "absolute", bottom: 120, left: 180, fontSize: 32, display: "flex" }}>💫</div>
        <div style={{ position: "absolute", bottom: 140, right: 140, fontSize: 36, display: "flex" }}>✨</div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.95)", padding: "12px 24px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.8)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color.dark, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900 }}>%</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", display: "flex" }}>1phantram.com</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex" }}>Tính phần trăm online</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.dark, color: "white", padding: "12px 20px", borderRadius: 999, fontSize: 16, fontWeight: 700, letterSpacing: 1, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize: 18, display: "flex" }}>🍽</span>
            <span style={{ display: "flex" }}>CHIA BILL + TIP</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: 32, padding: "32px 60px", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: 980 }}>
            <div style={{ fontSize: 90, marginBottom: 8, display: "flex" }}>🍽</div>
            <div style={{ fontSize: hasData ? 160 : 140, fontWeight: 900, color: color.dark, lineHeight: 1, letterSpacing: -6, display: "flex" }}>{numberDisplay}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.dark, color: "white", padding: "12px 24px", borderRadius: 999, fontSize: 28, fontWeight: 800, marginTop: 16 }}>
              <span style={{ display: "flex" }}>{pillLabel}</span>
            </div>
            {hasData && stats.length > 0 && (
              <div style={{ display: "flex", gap: 40, marginTop: 28, paddingTop: 20, borderTop: "2px solid #e2e8f0", width: "100%", justifyContent: "center" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: color.dark, display: "flex" }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, display: "flex" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(15,23,42,0.85)", color: "white", padding: "14px 32px", borderRadius: 999, fontSize: 22, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
            <span style={{ display: "flex" }}>👆</span>
            <span style={{ display: "flex" }}>Tính ngay tại 1phantram.com/chia-bill-tip</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
