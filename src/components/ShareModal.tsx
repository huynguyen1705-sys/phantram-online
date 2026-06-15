"use client";
import { useState, useEffect } from "react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  url: string;        // URL with query string
  title: string;      // e.g. "Kết quả tính BMI"
  text: string;       // multi-line summary
  ogImageUrl: string; // dynamic OG image URL
}

function QRCodeSVG({ value, size = 200 }: { value: string; size?: number }) {
  // External QR provider — no extra deps.
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
  return (
    <img
      src={src}
      alt="QR code"
      width={size}
      height={size}
      loading="lazy"
      style={{ display: "block" }}
    />
  );
}

export default function ShareModal({ open, onClose, url, title, text, ogImageUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const downloadImage = async () => {
    setDownloading(true);
    try {
      const res = await fetch(ogImageUrl);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objUrl;
      link.download = "phantram-result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objUrl), 1500);
    } catch (e) {
      console.error("download failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // user cancel or unsupported — ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chia sẻ kết quả"
    >
      <div
        className="w-full lg:max-w-md rounded-t-3xl lg:rounded-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{ background: "var(--card)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar mobile */}
        <div className="lg:hidden w-12 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--border)" }} />

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>📤 Chia sẻ kết quả</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all active:scale-95"
            style={{ color: "var(--text-muted)", background: "var(--bg)" }}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {/* Preview text */}
        <div className="rounded-xl p-3 mb-3 text-sm" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <p className="font-semibold mb-1">{title}</p>
          <p className="text-xs whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{text}</p>
        </div>

        {/* OG image preview */}
        <div className="rounded-xl overflow-hidden mb-3 border" style={{ borderColor: "var(--border)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImageUrl}
            alt="Preview ảnh chia sẻ"
            className="w-full block"
            style={{ aspectRatio: "1200/630", background: "var(--bg)", objectFit: "cover" }}
            loading="lazy"
          />
        </div>

        {/* QR code toggle */}
        <button
          type="button"
          onClick={() => setShowQR(s => !s)}
          className="w-full text-sm font-semibold py-2.5 px-3 rounded-xl mb-2 transition-all active:scale-95"
          style={{ background: "var(--bg)", color: "var(--text)" }}
        >
          {showQR ? "▲ Ẩn mã QR" : "📱 Hiện mã QR"}
        </button>
        {showQR && (
          <div className="flex justify-center py-4 bg-white rounded-xl mb-3">
            <QRCodeSVG value={url} size={200} />
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={copyLink}
            className="rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
            style={{ background: copied ? "#22c55e" : "var(--primary)", color: "#fff" }}
          >
            {copied ? "✓ Đã copy" : "🔗 Copy link"}
          </button>
          <button
            onClick={downloadImage}
            disabled={downloading}
            className="rounded-xl py-3 text-sm font-semibold transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "var(--border)", color: "var(--text)" }}
          >
            {downloading ? "Đang tải…" : "🖼 Tải ảnh"}
          </button>
          {canNativeShare && (
            <button
              onClick={nativeShare}
              className="col-span-2 rounded-xl py-3 text-sm font-semibold transition-all active:scale-95"
              style={{ background: "var(--border)", color: "var(--text)" }}
            >
              📤 Mở menu chia sẻ thiết bị
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
