"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HistoryItem {
  id: number;
  label: string;
  result: string;
  time: string;
}

const MAX_SELECT = 4;

export default function CompareCalculations() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [compared, setCompared] = useState<HistoryItem[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("calc-history") || "[]";
      const arr = JSON.parse(raw) as HistoryItem[];
      if (Array.isArray(arr)) setHistory(arr.slice().reverse());
    } catch {
      setHistory([]);
    }
    setLoaded(true);
  }, []);

  const toggle = (id: number) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, id];
    });
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setCompared(null);
    setCopied(false);
  };

  const doCompare = () => {
    const items = selectedIds
      .map(id => history.find(h => h.id === id))
      .filter((x): x is HistoryItem => Boolean(x));
    setCompared(items);
    setCopied(false);
    setTimeout(() => {
      document.getElementById("compare-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const copyTable = async () => {
    if (!compared || compared.length === 0) return;
    const lines: string[] = [];
    lines.push("So sánh phép tính — phantram.online");
    lines.push("=".repeat(40));
    compared.forEach((it, i) => {
      lines.push(`\n[${i + 1}] ${it.label}`);
      lines.push(`    Kết quả: ${it.result}`);
      lines.push(`    Thời gian: ${it.time}`);
    });
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const gridCols =
    !compared
      ? ""
      : compared.length === 2
      ? "md:grid-cols-2"
      : compared.length === 3
      ? "md:grid-cols-2 lg:grid-cols-3"
      : "md:grid-cols-2 lg:grid-cols-4";

  if (!loaded) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <div className="rounded-2xl border p-6 text-center text-sm" style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--text-muted)" }}>
          Đang tải lịch sử...
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
        <div className="rounded-2xl border p-8 text-center" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-5xl mb-3">📭</div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Chưa có lịch sử tính toán</h2>
          <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
            Hãy dùng các công cụ tính phần trăm trước. Mỗi phép tính sẽ tự động lưu lại để bạn so sánh sau.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/tinh-phan-tram" className="rounded-xl px-4 py-2 text-sm font-medium border hover:opacity-80" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              % của giá trị
            </Link>
            <Link href="/phan-tram-tang-giam" className="rounded-xl px-4 py-2 text-sm font-medium border hover:opacity-80" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              Tăng/Giảm %
            </Link>
            <Link href="/chia-bill-tip" className="rounded-xl px-4 py-2 text-sm font-medium border hover:opacity-80" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              Chia bill + tip
            </Link>
            <Link href="/lai-kep" className="rounded-xl px-4 py-2 text-sm font-medium border hover:opacity-80" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}>
              Lãi kép
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      {/* Toolbar */}
      <div className="rounded-2xl border p-4 mb-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Chọn phép tính để so sánh ({selectedIds.length}/{MAX_SELECT})
          </p>
          <div className="flex gap-2">
            <button
              onClick={clearSelection}
              disabled={selectedIds.length === 0}
              className="text-xs rounded-lg px-3 py-1.5 border disabled:opacity-40"
              style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
            >
              Xóa lựa chọn
            </button>
            <button
              onClick={doCompare}
              disabled={selectedIds.length < 2}
              className="text-xs rounded-lg px-3 py-1.5 font-semibold disabled:opacity-40"
              style={{ background: selectedIds.length >= 2 ? "#22c55e" : "var(--bg)", color: selectedIds.length >= 2 ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              🔍 So sánh ({selectedIds.length})
            </button>
          </div>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Chọn từ 2 đến 4 phép tính. Sau khi nhấn “So sánh”, các kết quả hiển thị cạnh nhau để dễ đối chiếu.
        </p>
      </div>

      {/* History list with checkboxes */}
      <div className="rounded-2xl border p-3 mb-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
          {history.map(item => {
            const checked = selectedIds.includes(item.id);
            const disabled = !checked && selectedIds.length >= MAX_SELECT;
            return (
              <label
                key={item.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer border ${disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"}`}
                style={{
                  background: checked ? "var(--card)" : "var(--bg)",
                  borderColor: checked ? "#22c55e" : "var(--border)",
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggle(item.id)}
                  className="w-4 h-4 accent-green-500 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{item.result}</p>
                </div>
                <p className="text-xs shrink-0" style={{ color: "var(--text-muted)" }}>{item.time}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Compare result */}
      {compared && compared.length > 0 && (
        <div id="compare-result" className="slide-in">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
              Bảng so sánh ({compared.length} phép tính)
            </h2>
            <button
              onClick={copyTable}
              className="text-xs rounded-lg px-3 py-1.5 border font-medium"
              style={{ background: copied ? "#22c55e" : "var(--bg)", color: copied ? "#fff" : "var(--text)", borderColor: copied ? "#22c55e" : "var(--border)" }}
            >
              {copied ? "✅ Đã copy" : "📋 Copy bảng so sánh"}
            </button>
          </div>
          <div className={`grid grid-cols-1 gap-3 ${gridCols}`}>
            {compared.map((it, i) => (
              <div key={it.id} className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>#{i + 1} · {it.time}</p>
                <p className="text-xs mb-2 break-words" style={{ color: "var(--text-muted)" }}>{it.label}</p>
                <p className="text-lg font-bold break-words" style={{ color: "var(--text)" }}>{it.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
