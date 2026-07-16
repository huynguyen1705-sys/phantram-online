"use client";
import { useMemo, useState } from "react";

const SITE = "https://1phantram.com";

type Tool = { slug: string; label: string; icon: string };

// 16 embed tools — slug matches /embed/[slug]
const TOOLS: Tool[] = [
  { slug: "tinh-phan-tram", label: "Tính % của giá trị", icon: "%" },
  { slug: "bao-nhieu-phan-tram", label: "Bao nhiêu %", icon: "?" },
  { slug: "phan-tram-tang-giam", label: "% tăng/giảm", icon: "↕" },
  { slug: "tinh-tang-giam-theo-phan-tram", label: "Tăng/giảm theo %", icon: "→" },
  { slug: "tim-gia-tri-goc", label: "Tìm giá trị gốc", icon: "◎" },
  { slug: "tinh-giam-gia", label: "Tính giảm giá / Sale", icon: "🏷" },
  { slug: "so-sanh-gia", label: "So sánh 2 giá", icon: "⚡" },
  { slug: "chia-bill-tip", label: "Chia bill & Tip", icon: "🍽" },
  { slug: "lai-suat-don", label: "Lãi suất đơn", icon: "💰" },
  { slug: "lai-kep", label: "Lãi kép", icon: "📈" },
  { slug: "luong-net", label: "Lương Net (thuế TNCN)", icon: "💼" },
  { slug: "break-even", label: "Break-even / Hoàn vốn", icon: "📉" },
  { slug: "scale-cong-thuc", label: "Scale công thức", icon: "🍳" },
  { slug: "bmi", label: "BMI + giảm cân", icon: "⚖️" },
  { slug: "phan-tram-thoi-gian", label: "% thời gian", icon: "📅" },
  { slug: "soi-sale", label: "Soi sale Shopee/Lazada", icon: "🛒" },
];

type Theme = "auto" | "light" | "dark";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {}
      }}
      className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95"
      style={{ background: "var(--primary)", color: "#fff" }}
    >
      {copied ? "✓ Đã copy" : "📋 Copy code"}
    </button>
  );
}

export default function EmbedBuilder() {
  const [slug, setSlug] = useState<string>("bmi");
  const [theme, setTheme] = useState<Theme>("auto");
  const [width, setWidth] = useState<number>(400);
  const [autoHeight, setAutoHeight] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(600);
  const [tab, setTab] = useState<"simple" | "auto" | "wp">("simple");

  const tool = useMemo(() => TOOLS.find((t) => t.slug === slug) ?? TOOLS[0], [slug]);
  const src = `${SITE}/embed/${slug}?theme=${theme}`;
  const iframeId = `phantram-${slug}`;

  const simpleCode = `<iframe src="${src}" width="${width}" height="${autoHeight ? 600 : height}" style="border:0;max-width:100%;" loading="lazy" title="Máy tính ${tool.label} – 1phantram.com"></iframe>`;

  const autoCode = `<iframe id="${iframeId}" src="${src}" width="${width}" height="${autoHeight ? 600 : height}" style="border:0;max-width:100%;" loading="lazy" title="Máy tính ${tool.label} – 1phantram.com"></iframe>
<script>
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'phantram-embed') {
      var f = document.getElementById('phantram-' + e.data.slug);
      if (f && e.data.height) f.style.height = e.data.height + 'px';
    }
  });
</script>`;

  const wpInstructions = `[1] Mở bài viết / trang WordPress → bấm "+" để thêm Block.
[2] Chọn block "Custom HTML" (HTML tuỳ chỉnh).
[3] Dán đoạn code này vào:

${autoCode}

[4] Bấm "Xem trước" để kiểm tra. Lưu / Cập nhật bài.

Lưu ý: Một số theme WP chặn script — nếu iframe không tự resize, dùng tab "HTML iframe (đơn giản)" và đặt chiều cao cố định.`;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: configurator */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            1. Chọn công cụ muốn nhúng
          </label>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm"
            style={{ background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }}
          >
            {TOOLS.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            2. Giao diện (theme)
          </label>
          <div className="flex gap-2">
            {(["auto", "light", "dark"] as Theme[]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTheme(opt)}
                className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95"
                style={
                  theme === opt
                    ? { background: "var(--primary)", color: "#fff" }
                    : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
                }
              >
                {opt === "auto" ? "Tự động" : opt === "light" ? "Sáng" : "Tối"}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            <strong>Tự động</strong> = match màu sáng/tối của trang web đang nhúng.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            3. Chiều rộng: <span style={{ color: "var(--primary)" }}>{width}px</span>
          </label>
          <input
            type="range"
            min={300}
            max={800}
            step={10}
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text)" }}>
            <input
              type="checkbox"
              checked={autoHeight}
              onChange={(e) => setAutoHeight(e.target.checked)}
            />
            Chiều cao tự động (khuyên dùng)
          </label>
          {!autoHeight && (
            <div className="mt-2">
              <label className="block text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                Chiều cao cố định: {height}px
              </label>
              <input
                type="range"
                min={400}
                max={1200}
                step={20}
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="rounded-xl p-4" style={{ background: "var(--result-bg)", color: "var(--result-text)" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1">Xem trước trực tiếp</p>
          <p className="text-xs opacity-80">Widget bên phải đang render đúng tham số đã chọn.</p>
        </div>
      </div>

      {/* Right: preview + code */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            Xem trước widget
          </p>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: "var(--border)", background: "var(--bg)" }}
          >
            <iframe
              key={`${slug}-${theme}-${width}`}
              src={src}
              width={width}
              height={autoHeight ? 600 : height}
              style={{ border: 0, maxWidth: "100%", display: "block" }}
              loading="lazy"
              title={`Preview ${tool.label}`}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>
            Code nhúng
          </p>
          <div className="flex gap-1 mb-2 flex-wrap">
            <button
              type="button"
              onClick={() => setTab("simple")}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={
                tab === "simple"
                  ? { background: "var(--primary)", color: "#fff" }
                  : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
              }
            >
              HTML iframe
            </button>
            <button
              type="button"
              onClick={() => setTab("auto")}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={
                tab === "auto"
                  ? { background: "var(--primary)", color: "#fff" }
                  : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
              }
            >
              HTML + auto-resize
            </button>
            <button
              type="button"
              onClick={() => setTab("wp")}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold"
              style={
                tab === "wp"
                  ? { background: "var(--primary)", color: "#fff" }
                  : { background: "var(--card)", color: "var(--text)", border: "1px solid var(--border)" }
              }
            >
              WordPress
            </button>
          </div>

          <div
            className="rounded-xl p-3 relative"
            style={{ background: "#0f172a", color: "#e2e8f0", fontFamily: "monospace", fontSize: 12 }}
          >
            <div className="absolute top-2 right-2">
              <CopyButton text={tab === "simple" ? simpleCode : tab === "auto" ? autoCode : wpInstructions} />
            </div>
            <pre className="whitespace-pre-wrap break-all pr-24 max-h-72 overflow-auto">
              {tab === "simple" ? simpleCode : tab === "auto" ? autoCode : wpInstructions}
            </pre>
          </div>

          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            {tab === "simple" && "Đơn giản nhất — chỉ cần dán iframe vào bất kỳ trang HTML/CMS nào."}
            {tab === "auto" && "Khuyên dùng — iframe tự co giãn theo chiều cao nội dung. Không cuộn 2 lần."}
            {tab === "wp" && "Hướng dẫn cho WordPress block editor (Gutenberg). Classic editor: dán vào tab Text/HTML."}
          </p>
        </div>
      </div>
    </div>
  );
}
