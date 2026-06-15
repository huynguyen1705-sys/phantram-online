import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const alt = "Tính break-even — phantram.online";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };

function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const loss = parseFloat(pick(searchParams, "loss"));

  const color = { light: "#e9d5ff", mid: "#a855f7", dark: "#6d28d9" };
  const hasData = loss > 0 && loss < 100;

  let numberDisplay = "📉?";
  let statusLabel = "Tính % bù lỗ";
  let stats: Array<{ value: string; label: string }> = [];

  if (hasData) {
    const recovery = (loss / (100 - loss)) * 100;
    const ratio = recovery / loss;
    numberDisplay = `+${Math.round(recovery)}%`;
    statusLabel = `Để bù lỗ ${Math.round(loss)}%`;
    stats = [
      { value: `${Math.round(loss)}%`, label: "% đã lỗ" },
      { value: `+${Math.round(recovery)}%`, label: "% cần lãi" },
      { value: `${ratio.toFixed(2)}x`, label: "Hệ số bù" },
    ];
  }

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
            <span style={{ fontSize: 18, display: "flex" }}>📉</span>
            <span style={{ display: "flex" }}>BREAK-EVEN</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: 32, padding: "32px 60px", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: 900 }}>
            <div style={{ fontSize: 80, marginBottom: 8, display: "flex" }}>📊</div>
            <div style={{ fontSize: hasData ? 200 : 140, fontWeight: 900, color: color.dark, lineHeight: 1, letterSpacing: -8, display: "flex" }}>{numberDisplay}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: color.dark, color: "white", padding: "12px 24px", borderRadius: 999, fontSize: 28, fontWeight: 800, marginTop: 16 }}>
              <span style={{ display: "flex" }}>{statusLabel}</span>
            </div>
            {hasData && (
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
            <span style={{ display: "flex" }}>Tính ngay tại phantram.online/break-even</span>
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
