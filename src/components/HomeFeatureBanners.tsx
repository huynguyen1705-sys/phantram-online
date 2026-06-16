import Link from "next/link";

type Banner = {
  href: string;
  external?: boolean;
  icon: string;
  title: string;
  sub: string;
  gradient: string; // tailwind classes (from-... to-...)
  badge?: string;
};

const BANNERS: Banner[] = [
  {
    href: "/so-sanh-tinh-toan",
    icon: "🆕",
    title: "So sánh phép tính",
    sub: "Đặt 2–4 phép tính cạnh nhau, thấy chênh lệch tức thì.",
    gradient: "from-indigo-500 to-blue-600",
    badge: "Mới",
  },
  {
    href: "/ai",
    icon: "🤖",
    title: "Máy tính AI tiếng Việt",
    sub: "Hỏi tự nhiên: “30% của 200k là bao nhiêu?” — AI hiểu.",
    gradient: "from-purple-500 to-pink-600",
    badge: "AI",
  },
  {
    href: "/widget-embed",
    icon: "🧩",
    title: "Widget embed miễn phí",
    sub: "Nhúng máy tính phần trăm vào website của bạn bằng 1 dòng iframe.",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    href: "/so-sanh-tiet-kiem",
    icon: "💰",
    title: "Lãi tiết kiệm 26 ngân hàng",
    sub: "So sánh lãi suất gửi tiết kiệm cập nhật mới nhất 2026.",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    href: "/so-sanh-vay",
    icon: "🏠",
    title: "Lãi vay mua nhà",
    sub: "Tránh bẫy lãi mồi — tính chi phí thực sau ưu đãi.",
    gradient: "from-red-500 to-orange-600",
    badge: "Cảnh báo",
  },
  {
    href: "https://blog.phantram.online",
    external: true,
    icon: "📚",
    title: "Blog kiến thức",
    sub: "31+ bài về lãi kép, ROI, CAGR, quy tắc 72, tài chính cá nhân.",
    gradient: "from-slate-600 to-zinc-700",
  },
];

export default function HomeFeatureBanners() {
  return (
    <section
      aria-label="Tính năng nổi bật"
      className="max-w-5xl mx-auto px-4 py-10"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--text)" }}>
          ✨ Tính năng nổi bật
        </h2>
        <p className="mt-2 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
          5 công cụ mới ra mắt tháng 6/2026 + blog kiến thức tài chính
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {BANNERS.map((b) => {
          const inner = (
            <div
              className={`group h-full rounded-2xl p-5 md:p-6 text-white bg-gradient-to-br ${b.gradient} shadow-md transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl md:text-4xl" aria-hidden="true">
                  {b.icon}
                </span>
                {b.badge && (
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/25 backdrop-blur px-2 py-1 rounded-full">
                    {b.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-bold leading-tight mb-1.5">
                {b.title}
              </h3>
              <p className="text-sm md:text-[15px] text-white/90 leading-snug">
                {b.sub}
              </p>
              <div className="mt-4 text-sm font-semibold inline-flex items-center gap-1 opacity-90 group-hover:opacity-100">
                Khám phá <span aria-hidden="true">→</span>
              </div>
            </div>
          );

          if (b.external) {
            return (
              <a
                key={b.href}
                href={b.href}
                target="_blank"
                rel="noopener"
                aria-label={b.title}
                className="block focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl"
              >
                {inner}
              </a>
            );
          }
          return (
            <Link
              key={b.href}
              href={b.href}
              aria-label={b.title}
              className="block focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
