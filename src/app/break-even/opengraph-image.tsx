import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Hoàn vốn / Break-even — phantram.online";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type SP = { [k: string]: string | string[] | undefined };
function pick(sp: SP | undefined, k: string): string {
  const v = sp?.[k];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function formatNum(n: number): string {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2).replace(/\.?0+$/, "") + " tr";
  return Math.round(n * 10) / 10 + "";
}

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const mode = pick(searchParams, "m") || "recovery";
  const loss = parseFloat(pick(searchParams, "l"));
  const fc = parseFloat(pick(searchParams, "fc"));
  const price = parseFloat(pick(searchParams, "pr"));
  const vc = parseFloat(pick(searchParams, "vc"));
  const capital = parseFloat(pick(searchParams, "c"));
  const profit = parseFloat(pick(searchParams, "mp"));

  let headline = "Tính hoàn vốn & BEP";
  let bigNumber = "—";
  let bigSuffix = "";
  let sub = "";
  let bg = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
  let accent = "#fbbf24";

  if (mode === "recovery") {
    headline = "Bù lỗ — cần tăng";
    bg = "linear-gradient(135deg, #7f1d1d 0%, #b45309 100%)";
    accent = "#fde047";
    if (isFinite(loss) && loss > 0 && loss < 100) {
      const need = (loss / (100 - loss)) * 100;
      bigNumber = "+" + (Math.round(need * 10) / 10);
      bigSuffix = "%";
      sub = `để bù lại mức lỗ −${loss}%`;
    }
  } else if (mode === "sales") {
    headline = "Điểm hoà vốn (BEP)";
    bg = "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)";
    accent = "#22c55e";
    if (isFinite(fc) && isFinite(price) && isFinite(vc) && price - vc > 0) {
      const units = fc / (price - vc);
      bigNumber = formatNum(units);
      bigSuffix = "sản phẩm";
      const rev = units * price;
      sub = `Doanh thu BEP: ${formatNum(rev)} ₫`;
    }
  } else {
    headline = "Thời gian hoàn vốn";
    bg = "linear-gradient(135deg, #064e3b 0%, #065f46 100%)";
    accent = "#fbbf24";
    if (isFinite(capital) && isFinite(profit) && profit > 0) {
      const months = capital / profit;
      bigNumber = formatNum(months);
      bigSuffix = "tháng";
      const roi = ((profit * 12) / capital) * 100;
      sub = `ROI/năm: ${Math.round(roi * 10) / 10}%`;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: bg, padding: 60, color: "white", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 56, height: 56, background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, marginRight: 18, color: "#0f172a" }}>%</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>phantram.online</div>
            <div style={{ fontSize: 16, opacity: 0.85 }}>Bù lỗ • BEP bán hàng • Hoàn vốn đầu tư</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 32, opacity: 0.9, marginBottom: 12 }}>{headline}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <div style={{ fontSize: 180, fontWeight: 900, color: accent, lineHeight: 1 }}>{bigNumber}</div>
            {bigSuffix && (
              <div style={{ fontSize: 48, fontWeight: 700, color: accent }}>{bigSuffix}</div>
            )}
          </div>
          {sub && (
            <div style={{ fontSize: 28, opacity: 0.85, marginTop: 20 }}>{sub}</div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.75, marginTop: 20 }}>
          <div>Break-even & ROI calculator</div>
          <div>phantram.online/break-even</div>
        </div>
      </div>
    ),
    size
  );
}
