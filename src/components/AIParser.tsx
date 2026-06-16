"use client";

import { useEffect, useRef, useState } from "react";

type Operation = { step: number; description: string; value: number };
type APIResponse = {
  operations: Operation[];
  result: number | null;
  result_formatted: string;
  explanation: string;
  warnings: string[];
  error?: string;
};

const EXAMPLES = [
  "30% của 25 triệu là bao nhiêu?",
  "Lương 18 triệu trừ 10.5% bảo hiểm còn bao nhiêu?",
  "Bill 850k tip 10% chia 4 người mỗi người trả bao nhiêu?",
  "Giảm 25% từ 1.2 triệu còn bao nhiêu?",
  "Tăng giá 15% rồi giảm 15% có về giá gốc không?",
  "Vay 500 triệu lãi 8.5%/năm trong 5 năm, lãi tổng bao nhiêu?",
];

const HISTORY_KEY = "ai-parser-history";
const MAX_HISTORY = 10;

function formatNumberVN(n: number): string {
  if (!isFinite(n)) return String(n);
  return n.toLocaleString("vi-VN");
}

export default function AIParser() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setHistory(arr.filter((x) => typeof x === "string").slice(0, MAX_HISTORY));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const saveHistory = (q: string) => {
    setHistory((prev) => {
      const next = [q, ...prev.filter((x) => x !== q)].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      /* ignore */
    }
  };

  const onSubmit = async () => {
    const q = query.trim();
    if (q.length < 5 || loading) return;
    setLoading(true);
    setError("");
    setData(null);
    setCopied(false);
    try {
      const res = await fetch("/api/ai-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const json = (await res.json()) as APIResponse;
      if (!res.ok || json.error) {
        setError(json.error || "Có lỗi xảy ra. Thử lại nhé.");
      } else {
        setData(json);
        saveHistory(q);
      }
    } catch {
      setError("Mất kết nối mạng. Kiểm tra wifi rồi thử lại nhé.");
    } finally {
      setLoading(false);
    }
  };

  const fillAndFocus = (s: string) => {
    setQuery(s);
    setError("");
    setData(null);
    taRef.current?.focus();
  };

  const onCopy = () => {
    if (!data?.result_formatted) return;
    navigator.clipboard?.writeText(data.result_formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  const canSubmit = query.trim().length >= 5 && !loading;
  const charCount = query.length;

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-6">
      {/* ── Input card ── */}
      <div
        className="rounded-2xl border p-5 shadow-sm"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <label className="text-sm font-semibold mb-2 block" style={{ color: "var(--text)" }}>
          Hỏi gì cũng được — AI sẽ tính giúp bạn 🤖
        </label>
        <textarea
          ref={taRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="VD: 30% lương 25 triệu trừ 10% bảo hiểm còn bao nhiêu?"
          maxLength={500}
          rows={3}
          className="w-full rounded-xl border px-4 py-3 text-base outline-none transition-all focus:ring-2 focus:ring-blue-400 resize-none"
          style={{
            background: "var(--bg)",
            borderColor: "var(--border)",
            color: "var(--text)",
          }}
        />
        <div className="flex items-center justify-between mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>Ctrl + Enter để gửi nhanh</span>
          <span>{charCount}/500</span>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="w-full mt-3 rounded-xl px-4 py-3 text-base font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--primary)", color: "#fff" }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Đang nghĩ...
            </span>
          ) : (
            "🤖 Tính bằng AI"
          )}
        </button>

        {/* ── Examples chips ── */}
        <div className="mt-4">
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
            💡 Ví dụ — bấm để dùng thử:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => fillAndFocus(ex)}
                className="text-xs rounded-full border px-3 py-1.5 transition-all hover:opacity-80 active:scale-95"
                style={{ background: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error card ── */}
      {error && (
        <div
          className="mt-4 rounded-2xl border p-4"
          style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
        >
          <p className="font-semibold text-sm">⚠️ {error}</p>
          <p className="text-xs mt-1 opacity-80">
            Mẹo: hãy diễn đạt rõ con số và đơn vị, ví dụ &quot;25 triệu&quot;, &quot;30%&quot;, &quot;giảm&quot;,
            &quot;trừ&quot;.
          </p>
        </div>
      )}

      {/* ── Result card ── */}
      {data && !error && (
        <div
          className="mt-4 rounded-2xl border p-5 shadow-sm"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                Kết quả
              </p>
              <p
                className="text-3xl md:text-4xl font-bold break-words"
                style={{ color: "var(--result-text, var(--primary))" }}
              >
                {data.result_formatted || (data.result != null ? formatNumberVN(data.result) : "—")}
              </p>
            </div>
            {data.result_formatted && (
              <button
                onClick={onCopy}
                className="shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition-all active:scale-95"
                style={{ background: copied ? "#22c55e" : "var(--primary)", color: "#fff" }}
              >
                {copied ? "✓ Copy" : "Copy"}
              </button>
            )}
          </div>

          {data.operations.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                📐 Các bước tính
              </p>
              <ol className="space-y-2">
                {data.operations.map((op, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border px-3 py-2 text-sm"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    <span
                      className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                      style={{ background: "var(--primary)", color: "#fff" }}
                    >
                      {op.step}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{op.description}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--text-muted)" }}>
                        = {formatNumberVN(op.value)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {data.explanation && (
            <div className="mt-4">
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                💬 Giải thích
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                {data.explanation}
              </p>
            </div>
          )}

          {data.warnings.length > 0 && (
            <div
              className="mt-4 rounded-xl border p-3"
              style={{ background: "#fffbeb", borderColor: "#fde68a", color: "#92400e" }}
            >
              <p className="text-xs font-semibold mb-1">⚠️ Lưu ý</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                {data.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── History ── */}
      {history.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
              🕘 Lịch sử ({history.length})
            </p>
            <button
              onClick={clearHistory}
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              Xóa hết
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((q, i) => (
              <button
                key={i}
                onClick={() => fillAndFocus(q)}
                className="text-xs rounded-full border px-3 py-1.5 transition-all hover:opacity-80 active:scale-95 max-w-full truncate"
                style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
                title={q}
              >
                {q.length > 60 ? q.slice(0, 60) + "…" : q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
