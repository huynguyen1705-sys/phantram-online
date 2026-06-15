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

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const h = parseFloat(pick(searchParams, "h"));
  const w = parseFloat(pick(searchParams, "w"));
  const mode = pick(searchParams, "m") || "bmi";

  let bmi = 0;
  let cat = "";
  let color = "#3b82f6";
  let subline = "";

  if (h > 0 && w > 0) {
    bmi = Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
    if (bmi < 18.5) { cat = "Thiếu cân"; color = "#3b82f6"; }
    else if (bmi < 23) { cat = "Bình thường"; color = "#22c55e"; }
    else if (bmi < 25) { cat = "Thừa cân"; color = "#eab308"; }
    else if (bmi < 30) { cat = "Béo phì độ I"; color = "#f97316"; }
    else { cat = "Béo phì độ II+"; color = "#ef4444"; }
    subline = `${w}kg • ${h}cm`;
  }

  const modeLabel = mode === "goal" ? "Mục tiêu giảm cân" : mode === "calorie" ? "TDEE & Calo" : "Chỉ số BMI";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 60,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div
            style={{
              width: 56, height: 56, background: "#2563eb", borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 900, marginRight: 18,
            }}
          >
            %
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>phantram.online</div>
            <div style={{ fontSize: 16, opacity: 0.7 }}>Tính BMI chuẩn châu Á • TDEE • Mục tiêu giảm cân</div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 8 }}>{modeLabel}</div>
          <div style={{ fontSize: 200, fontWeight: 900, color, lineHeight: 1 }}>{bmi || "—"}</div>
          <div style={{ fontSize: 44, fontWeight: 700, color, marginTop: 16 }}>{cat || "Tính BMI miễn phí"}</div>
          {subline && (
            <div style={{ fontSize: 24, opacity: 0.7, marginTop: 24 }}>{subline}</div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            opacity: 0.6,
            marginTop: 20,
          }}
        >
          <div>WHO Asia-Pacific • Mifflin-St Jeor</div>
          <div>phantram.online/bmi</div>
        </div>
      </div>
    ),
    size
  );
}
