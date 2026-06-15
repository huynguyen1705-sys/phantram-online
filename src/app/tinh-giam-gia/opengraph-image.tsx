import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Giảm giá / Sale — phantram.online";
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
  if (n >= 1e3) return Math.round(n).toLocaleString("vi-VN");
  return n.toLocaleString("vi-VN");
}

export default async function Image({ searchParams }: { searchParams?: SP } = {}) {
  const orig = parseFloat(pick(searchParams, "o"));
  const disc = parseFloat(pick(searchParams, "d"));

  let sale = NaN, saved = NaN;
  if (isFinite(orig) && orig > 0 && isFinite(disc)) {
    sale = orig * (1 - disc / 100);
    saved = orig - sale;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(135deg, #7c2d12 0%, #b91c1c 100%)",
          padding: 60, color: "white", fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div style={{ width: 56, height: 56, background: "#fff", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, marginRight: 18, color: "#b91c1c" }}>%</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>phantram.online</div>
            <div style={{ fontSize: 16, opacity: 0.85 }}>Tính giá sau giảm giá / Sale</div>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          {isFinite(disc) && (
            <div style={{ fontSize: 56, fontWeight: 900, marginBottom: 12, background: "#fff", color: "#b91c1c", padding: "8px 28px", borderRadius: 18 }}>
              − {disc}% SALE
            </div>
          )}
          <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 8, marginTop: 16 }}>Giá sau giảm</div>
          <div style={{ fontSize: 140, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
            {isFinite(sale) ? formatVND(sale) + " ₫" : "—"}
          </div>
          {isFinite(orig) && orig > 0 && (
            <div style={{ display: "flex", gap: 28, marginTop: 28, fontSize: 24, alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ opacity: 0.7, fontSize: 18 }}>Giá gốc</div>
                <div style={{ fontWeight: 700, textDecoration: "line-through", opacity: 0.7 }}>{formatVND(orig)} ₫</div>
              </div>
              {isFinite(saved) && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ opacity: 0.7, fontSize: 18 }}>Tiết kiệm</div>
                  <div style={{ fontWeight: 700, color: "#fde047" }}>{formatVND(saved)} ₫</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, opacity: 0.75, marginTop: 20 }}>
          <div>Discount calculator</div>
          <div>phantram.online/tinh-giam-gia</div>
        </div>
      </div>
    ),
    size
  );
}
