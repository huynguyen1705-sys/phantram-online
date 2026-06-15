import { ImageResponse } from "next/og";
import { headers } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const alt = "Soi sale chống fake giá — phantram.online";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };

function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function formatVND(n: number): string {
  if (!isFinite(n) || n <= 0) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(n >= 10_000_000_000 ? 0 : 1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return Math.round(n).toString();
}

export default async function Image() {
  const h_ = await headers();
  const qs = h_.get("x-search") || "";
  const sp: SP = Object.fromEntries(new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs).entries());

  const p = parseFloat(pick(sp, "p")); // giá hiện tại
  const o = parseFloat(pick(sp, "o")); // giá gốc gạch chéo
  const hasData = p > 0;

  // Verdict logic
  let verdict: { label: string; emoji: string; tone: "good" | "bad" | "warn" } = { label: "SOI SALE", emoji: "🛒", tone: "warn" };
  let realDiscount = 0;
  if (hasData) {
    if (o > 0 && o > p * 3) {
      verdict = { label: "NGHI FAKE SALE", emoji: "🚨", tone: "bad" };
    } else if (o > 0 && o > p) {
      realDiscount = ((o - p) / o) * 100;
      if (realDiscount >= 30) verdict = { label: "DEAL TỐT", emoji: "✅", tone: "good" };
      else if (realDiscount >= 15) verdict = { label: "OK MUA", emoji: "👍", tone: "good" };
      else verdict = { label: "BÌNH THƯỜNG", emoji: "🤔", tone: "warn" };
    } else {
      verdict = { label: "ĐANG KIỂM TRA", emoji: "🔍", tone: "warn" };
    }
  }

  // Theme by tone
  const themes = {
    good: { light: "#dcfce7", mid: "#22c55e", dark: "#15803d" },
    bad: { light: "#fee2e2", mid: "#ef4444", dark: "#b91c1c" },
    warn: { light: "#fed7aa", mid: "#f97316", dark: "#c2410c" },
  };
  const color = themes[verdict.tone];

  const numberDisplay = hasData && o > p
    ? `−${realDiscount.toFixed(0)}%`
    : hasData
    ? formatVND(p) + "đ"
    : "SOI";

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
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", display: "flex" }}>phantram.online</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex" }}>Tính phần trăm online</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.dark, color: "white", padding: "12px 20px", borderRadius: 999, fontSize: 16, fontWeight: 700, letterSpacing: 1, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize: 18, display: "flex" }}>🛒</span>
            <span style={{ display: "flex" }}>SOI SALE</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: 32, padding: "32px 60px", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: 900 }}>
            <div style={{ fontSize: 90, marginBottom: 4, display: "flex" }}>{verdict.emoji}</div>
            <div style={{ fontSize: hasData ? 180 : 130, fontWeight: 900, color: color.dark, lineHeight: 1, letterSpacing: -6, display: "flex" }}>{numberDisplay}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.dark, color: "white", padding: "14px 28px", borderRadius: 999, fontSize: 32, fontWeight: 800, marginTop: 16, letterSpacing: 1 }}>
              <span style={{ display: "flex" }}>{verdict.label}</span>
            </div>
            {hasData && o > p && (
              <div style={{ display: "flex", gap: 40, marginTop: 28, paddingTop: 20, borderTop: "2px solid #e2e8f0", width: "100%", justifyContent: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#94a3b8", textDecoration: "line-through", display: "flex" }}>{formatVND(o)}đ</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, display: "flex" }}>Giá gạch chéo</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: color.dark, display: "flex" }}>{formatVND(p)}đ</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, display: "flex" }}>Giá hiện tại</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#22c55e", display: "flex" }}>{formatVND(o - p)}đ</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, display: "flex" }}>Tiết kiệm</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(15,23,42,0.85)", color: "white", padding: "14px 32px", borderRadius: 999, fontSize: 22, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
            <span style={{ display: "flex" }}>👆</span>
            <span style={{ display: "flex" }}>Soi ngay tại phantram.online/soi-sale</span>
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
