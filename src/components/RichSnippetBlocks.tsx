import Link from "next/link";

const TOOLS = [
  { href: "/tinh-phan-tram", name: "Tính % của một giá trị", desc: "Tính nhanh A% của B, ví dụ 30% của 200.000đ." },
  { href: "/phan-tram-tang-giam", name: "Tính % tăng giảm", desc: "So sánh giá trị cũ và mới để biết tăng/giảm bao nhiêu %." },
  { href: "/tinh-giam-gia", name: "Tính giảm giá", desc: "Tính giá sau sale, số tiền tiết kiệm và kiểm tra deal mua sắm." },
  { href: "/so-sanh-tiet-kiem", name: "So sánh lãi tiết kiệm", desc: "Lọc lãi suất 26 ngân hàng theo kỳ hạn và số tiền gửi." },
  { href: "/so-sanh-vay", name: "So sánh vay mua nhà", desc: "Tính chi phí vay thực sau ưu đãi, tránh bẫy lãi mồi." },
  { href: "/ai", name: "Máy tính AI", desc: "Gõ câu tiếng Việt tự nhiên, hệ thống tự nhận dạng phép tính %." },
];

const SITELINKS = [
  { href: "/tinh-phan-tram", label: "Tính phần trăm" },
  { href: "/tinh-giam-gia", label: "Tính giảm giá" },
  { href: "/lai-kep", label: "Lãi kép" },
  { href: "/luong-net", label: "Lương net" },
  { href: "/so-sanh-tiet-kiem", label: "Lãi tiết kiệm" },
  { href: "/so-sanh-vay", label: "Lãi vay" },
  { href: "/ai", label: "AI parser" },
  { href: "/widget-embed", label: "Widget embed" },
];

const FAQ = [
  ["Tính phần trăm nhanh nhất bằng công thức nào?", "Dùng công thức giá trị × phần trăm ÷ 100. Ví dụ 30% của 200.000đ = 60.000đ."],
  ["Google có thể hiện FAQ và sitelinks của phantram.online không?", "Trang đã có FAQPage, WebSite SearchAction, ItemList, WebApplication, BreadcrumbList và các link điều hướng rõ ràng để tăng cơ hội rich results."],
  ["Nên dùng công cụ nào khi mua sắm?", "Dùng Tính giảm giá để ra giá sau sale, Soi sale để kiểm tra sale ảo và So sánh giá để chọn cửa hàng rẻ hơn."],
  ["Có thể tìm bài blog từ main web không?", "Có. Ô tìm kiếm bên dưới trỏ thẳng sang blog.phantram.online và toàn bộ link blog được render sẵn để Googlebot đọc được."],
];

export default function RichSnippetBlocks() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-8" aria-label="Rich snippets và điều hướng nhanh">
      <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        <h2 id="tim-kiem" className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Tìm kiếm công thức, công cụ và bài hướng dẫn</h2>
        <form action="https://blog.phantram.online/" method="get" role="search" className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="rich-search" className="sr-only">Tìm kiếm trên blog phantram.online</label>
          <input
            id="rich-search"
            name="s"
            type="search"
            placeholder="Ví dụ: cách tính phần trăm lợi nhuận, lãi kép, GPA..."
            className="flex-1 rounded-xl border px-4 py-3 text-sm"
            style={{ borderColor: "var(--border)", background: "var(--bg)", color: "var(--text)" }}
          />
          <button type="submit" className="rounded-xl px-5 py-3 text-sm font-semibold" style={{ background: "var(--primary)", color: "#fff" }}>
            Tìm trên blog
          </button>
        </form>
      </div>

      <h2 id="sitelinks" className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Liên kết nhanh được tìm nhiều</h2>
      <nav aria-label="Sitelinks phantram.online" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {SITELINKS.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border px-4 py-3 text-sm font-semibold hover:opacity-80" style={{ borderColor: "var(--border)", color: "var(--text)", background: "var(--card)" }}>
            {item.label}
          </Link>
        ))}
      </nav>

      <h2 id="bang-cong-cu" className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Bảng chọn công cụ theo nhu cầu</h2>
      <div className="overflow-x-auto rounded-2xl border mb-8" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead style={{ background: "var(--card)", color: "var(--text)" }}>
            <tr>
              <th className="text-left p-3">Nhu cầu</th>
              <th className="text-left p-3">Công cụ nên dùng</th>
              <th className="text-left p-3">Kết quả nhận được</th>
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((tool) => (
              <tr key={tool.href} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="p-3" style={{ color: "var(--text)" }}>{tool.desc}</td>
                <td className="p-3"><Link href={tool.href} style={{ color: "var(--primary)" }}>{tool.name}</Link></td>
                <td className="p-3" style={{ color: "var(--text-muted)" }}>Công thức, kết quả tức thì, ví dụ và FAQ.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="faq-rich" className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>FAQ ngắn cho featured snippet</h2>
      <div className="space-y-3">
        {FAQ.map(([q, a]) => (
          <details key={q} className="rounded-xl border p-4" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            <summary className="font-semibold cursor-pointer" style={{ color: "var(--text)" }}>{q}</summary>
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
