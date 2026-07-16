import { ImageResponse } from "next/og";
import { headers } from "next/headers";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const alt = "Phần trăm thời gian đã qua — 1phantram.com";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };

function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

// Theme per mode
function themeFor(mode: string) {
  if (mode === "month") {
    return { light: "#ddd6fe", mid: "#a78bfa", dark: "#7c3aed", barFrom: "#a78bfa", barTo: "#7c3aed" };
  }
  if (mode === "day") {
    return { light: "#fef3c7", mid: "#fb923c", dark: "#f97316", barFrom: "#fbbf24", barTo: "#f97316" };
  }
  if (mode === "custom") {
    return { light: "#cffafe", mid: "#22d3ee", dark: "#0891b2", barFrom: "#22d3ee", barTo: "#0891b2" };
  }
  // year (default)
  return { light: "#e0e7ff", mid: "#818cf8", dark: "#4f46e5", barFrom: "#818cf8", barTo: "#4f46e5" };
}

function iconFor(mode: string) {
  if (mode === "month") return "📆";
  if (mode === "day") return "🕐";
  if (mode === "custom") return "🎯";
  return "📅";
}

function labelFor(mode: string) {
  if (mode === "month") return "% THÁNG";
  if (mode === "day") return "% NGÀY";
  if (mode === "custom") return "% MỐC";
  return "% NĂM";
}

export default async function Image(_props: { searchParams?: SP } = {}) {
  const h_ = await headers();
  const qs = h_.get("x-search") || "";
  const sp_: SP = Object.fromEntries(new URLSearchParams(qs.startsWith("?") ? qs.slice(1) : qs).entries());
  const searchParams: SP = sp_;
  const mode = (pick(searchParams, "m") || "year").toLowerCase();
  const startStr = pick(searchParams, "s");
  const endStr = pick(searchParams, "e");
  const customTitle = pick(searchParams, "t");

  // Server "now" in VN time (UTC+7)
  const now = new Date(Date.now() + VN_OFFSET_MS);
  const Y = now.getUTCFullYear();
  const M = now.getUTCMonth();
  const D = now.getUTCDate();
  const hh = now.getUTCHours();
  const mm = now.getUTCMinutes();

  const theme = themeFor(mode);
  const icon = iconFor(mode);
  const badge = labelFor(mode);

  let pct = 0;
  let pill = "";
  let stats: Array<{ value: string; label: string }> = [];
  let valid = true;

  if (mode === "month") {
    const monthStart = Date.UTC(Y, M, 1);
    const monthEnd = Date.UTC(Y, M + 1, 1);
    const monthDays = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
    pct = ((now.getTime() - monthStart) / (monthEnd - monthStart)) * 100;
    pill = `Tháng ${M + 1}/${Y}`;
    stats = [
      { value: `${D}/${monthDays}`, label: "ngày" },
      { value: `Th ${M + 1}`, label: "tháng" },
      { value: `${monthDays - D}`, label: "ngày còn" },
    ];
  } else if (mode === "day") {
    const dayMin = hh * 60 + mm;
    pct = (dayMin / 1440) * 100;
    pill = `${pad2(hh)}:${pad2(mm)} • ${pad2(D)}/${pad2(M + 1)}`;
    const minsLeft = 1440 - dayMin;
    const hLeft = Math.floor(minsLeft / 60);
    const mLeft = minsLeft % 60;
    stats = [
      { value: `${pad2(hh)}:${pad2(mm)}`, label: "hiện tại" },
      { value: `${Math.floor(dayMin / 60)}h${pad2(dayMin % 60)}`, label: "đã qua" },
      { value: `${hLeft}h${pad2(mLeft)}`, label: "còn lại" },
    ];
  } else if (mode === "custom") {
    if (startStr && endStr) {
      const s = new Date(startStr + "T00:00:00Z").getTime();
      const e = new Date(endStr + "T00:00:00Z").getTime();
      if (e > s) {
        const totalDays = Math.round((e - s) / 86_400_000);
        pct = ((now.getTime() - s) / (e - s)) * 100;
        const elapsed = Math.max(0, Math.min(totalDays, Math.floor((now.getTime() - s) / 86_400_000)));
        const left = Math.max(0, totalDays - elapsed);
        pill = customTitle || "Cột mốc";
        stats = [
          { value: `${elapsed}`, label: "đã qua" },
          { value: `${totalDays}`, label: "tổng ngày" },
          { value: `${left}`, label: "còn lại" },
        ];
      } else {
        valid = false;
      }
    } else {
      valid = false;
    }
  } else {
    // year (default)
    const yearStart = Date.UTC(Y, 0, 1);
    const yearEnd = Date.UTC(Y + 1, 0, 1);
    const yearDaysTotal = isLeap(Y) ? 366 : 365;
    const dayIndex = Math.floor((now.getTime() - yearStart) / 86_400_000) + 1;
    pct = ((now.getTime() - yearStart) / (yearEnd - yearStart)) * 100;
    const quarter = Math.floor(M / 3) + 1;
    pill = `Năm ${Y}`;
    stats = [
      { value: `${dayIndex}/${yearDaysTotal}`, label: "ngày" },
      { value: `Th ${M + 1}/12`, label: "tháng" },
      { value: `Q${quarter}/4`, label: "quý" },
    ];
  }

  const pctClamp = Math.max(0, Math.min(100, pct));
  const bigNum = valid ? pct.toFixed(1) + "%" : "—";
  if (!valid) {
    pill = "Nhập ngày bắt đầu + kết thúc";
    stats = [];
  }

  // Card width / progress bar inside
  const cardWidth = 940;
  const barOuterWidth = 720;
  const barFillWidth = Math.round((pctClamp / 100) * barOuterWidth);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${theme.light} 0%, ${theme.mid} 50%, ${theme.dark} 100%)`,
          padding: 50,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: 200, background: "rgba(255,255,255,0.15)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -150, left: -150, width: 500, height: 500, borderRadius: 250, background: "rgba(255,255,255,0.08)", display: "flex" }} />

        {/* Sparkles */}
        <div style={{ position: "absolute", top: 90, left: 130, fontSize: 36, display: "flex" }}>✨</div>
        <div style={{ position: "absolute", top: 110, right: 150, fontSize: 32, display: "flex" }}>⭐</div>
        <div style={{ position: "absolute", bottom: 120, left: 170, fontSize: 32, display: "flex" }}>💫</div>
        <div style={{ position: "absolute", bottom: 130, right: 130, fontSize: 36, display: "flex" }}>✨</div>

        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.95)", padding: "10px 22px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.8)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.dark, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900 }}>%</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", display: "flex" }}>1phantram.com</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex" }}>Tính phần trăm online</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.dark, color: "white", padding: "10px 18px", borderRadius: 999, fontSize: 16, fontWeight: 700, letterSpacing: 1, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}>
            <span style={{ fontSize: 18, display: "flex" }}>{icon}</span>
            <span style={{ display: "flex" }}>{badge}</span>
          </div>
        </div>

        {/* Main glass card */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.95)", borderRadius: 32, padding: "28px 50px", border: "2px solid rgba(255,255,255,0.6)", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", width: cardWidth }}>
            <div style={{ fontSize: 70, marginBottom: 4, display: "flex" }}>{icon}</div>
            <div style={{ fontSize: valid ? 180 : 110, fontWeight: 900, color: theme.dark, lineHeight: 1, letterSpacing: -6, display: "flex" }}>{bigNum}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.dark, color: "white", padding: "10px 22px", borderRadius: 999, fontSize: 26, fontWeight: 800, marginTop: 14 }}>
              <span style={{ display: "flex" }}>{pill}</span>
            </div>

            {/* Inline progress bar */}
            {valid && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 22, width: barOuterWidth }}>
                <div style={{ display: "flex", width: barOuterWidth, height: 16, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ display: "flex", width: barFillWidth, height: 16, background: `linear-gradient(90deg, ${theme.barFrom}, ${theme.barTo})`, borderRadius: 999 }} />
                </div>
              </div>
            )}

            {/* Stats row */}
            {stats.length > 0 && (
              <div style={{ display: "flex", gap: 60, marginTop: 22, paddingTop: 16, borderTop: "2px solid #e2e8f0", width: "100%", justifyContent: "center" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: theme.dark, display: "flex" }}>{s.value}</div>
                    <div style={{ fontSize: 14, color: "#64748b", marginTop: 4, display: "flex" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA pill */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(15,23,42,0.85)", color: "white", padding: "12px 30px", borderRadius: 999, fontSize: 22, fontWeight: 700, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
            <span style={{ display: "flex" }}>👆</span>
            <span style={{ display: "flex" }}>Tính ngay tại 1phantram.com/phan-tram-thoi-gian</span>
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
