import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kết quả tính BMI — phantram.online";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };

function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function bmiColor(bmi: number) {
  if (bmi < 18.5) return { light: "#dbeafe", mid: "#3b82f6", dark: "#1d4ed8" };
  if (bmi < 23) return { light: "#dcfce7", mid: "#22c55e", dark: "#15803d" };
  if (bmi < 25) return { light: "#fef3c7", mid: "#eab308", dark: "#a16207" };
  if (bmi < 30) return { light: "#fed7aa", mid: "#f97316", dark: "#c2410c" };
  return { light: "#fecaca", mid: "#ef4444", dark: "#b91c1c" };
}

function bmiCategory(bmi: number) {
  if (bmi < 18.5) return "Thiếu cân";
  if (bmi < 23) return "Bình thường";
  if (bmi < 25) return "Thừa cân";
  if (bmi < 30) return "Béo phì độ I";
  return "Béo phì độ II+";
}

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const h = parseFloat(pick(searchParams, "h"));
  const w = parseFloat(pick(searchParams, "w"));

  const hasData = h > 0 && w > 0;
  let bmi = 0;
  let color = { light: "#fef3c7", mid: "#f59e0b", dark: "#b45309" };
  let statusLabel = "Bạn nặng bao nhiêu kg?";
  let numberDisplay = "BMI";
  let stats: Array<{ value: string; label: string }> = [];

  if (hasData) {
    bmi = Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
    color = bmiColor(bmi);
    statusLabel = bmiCategory(bmi);
    numberDisplay = bmi.toFixed(1);
    const idealLow = (18.5 * Math.pow(h / 100, 2)).toFixed(0);
    const idealHigh = (22.9 * Math.pow(h / 100, 2)).toFixed(0);
    stats = [
      { value: `${w}kg`, label: "Cân nặng" },
      { value: `${h}cm`, label: "Chiều cao" },
      { value: `${idealLow}–${idealHigh}kg`, label: "Cân lý tưởng" },
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
            <span style={{ fontSize: 18, display: "flex" }}>⚖️</span>
            <span style={{ display: "flex" }}>BMI CALCULATOR</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: 32, padding: "32px 60px", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: 900 }}>
            <div style={{ fontSize: 80, marginBottom: 8, display: "flex" }}>⚖️</div>
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
            <span style={{ display: "flex" }}>Tính ngay tại phantram.online/bmi</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
