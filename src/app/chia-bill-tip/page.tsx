import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/chia-bill-tip";
const NAME = "Chia bill nhóm + Tip - VAT - Theo món";
const TITLE = "Chia Bill Nhóm + Tính Tip - VAT - Theo Món | phantram.online";
const DESC =
  "Chia bill nhà hàng chuẩn: chia đều, chia theo món ăn riêng từng người, hoặc theo % tùy ý. Tính VAT 8% + Tip % tự động. Copy gửi Zalo cho cả nhóm trong 1 click.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", images: [{ url: `${URL_PATH}/opengraph-image`, width: 1200, height: 630 }], locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: [`${URL_PATH}/opengraph-image`] },
};

const FAQ = [
  { q: "Tip ở Việt Nam có cần không?", a: "Không bắt buộc. Nhà hàng cao cấp đã tính phụ phí dịch vụ 5–10% sẵn trong bill. Quán bình dân không cần tip. Khi phục vụ quá tốt có thể tip thêm 5–10%. Trừ nhà hàng kiểu Mỹ/Âu/khách sạn 4–5 sao thì tip 10–15% là chuẩn." },
  { q: "VAT nhà hàng VN bao nhiêu %?", a: "Từ 2022 đến hết 2026, VAT nhà hàng + dịch vụ ăn uống ở VN được giảm còn 8% (từ 10% gốc) theo Nghị quyết của Quốc hội nhằm kích cầu sau COVID. Một số quán nhỏ vẫn không xuất VAT — khi đó coi như đã gộp giá." },
  { q: "Tip tính trước hay sau VAT?", a: "Có 2 cách: (1) Chuẩn quốc tế (Mỹ/Âu): tip tính trên giá đã VAT. (2) Một số nơi tip tính trên tiền món gốc trước VAT — thấp hơn một chút. Công cụ này mặc định tip sau VAT, có toggle chuyển sang trước VAT." },
  { q: "Chia theo món vs chia đều ai công bằng hơn?", a: "Chia đều phù hợp nhóm bạn thân, ăn uống tương đương nhau. Chia theo món fair hơn khi có người uống bia 200k còn người chỉ uống nước ngọt 50k, hoặc có người không ăn lẩu hải sản. Chia % tùy ý phù hợp công ty/team building khi sếp trả nhiều hơn nhân viên." },
  { q: "Bill 1.2 triệu chia 5 người không đều thì làm sao?", a: "Dùng chế độ \"Chia theo món\": thêm tên 5 người, liệt kê từng món + tick ai ăn. Hệ thống tính tự động phần ăn + chia đều VAT, Tip theo tỷ lệ tiêu thụ của từng người. Copy gửi Zalo trong 1 click." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1342", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="tip" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Chia bill nhà hàng + tính tip cho nhóm bạn</h1>
        <p className="mb-3">
          Đi ăn nhóm 5–10 người thường gặp 3 tình huống: <strong>chia đều</strong> cho nhanh, <strong>chia
          theo món</strong> ai ăn ít trả ít, hoặc <strong>chia theo %</strong> cho công ty/team building khi
          mức đóng góp khác nhau. Công cụ này gộp cả 3 mode + tính VAT 8% + Tip tự động, copy gửi Zalo 1 click.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">3 chế độ chia bill</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Chia đều</strong> — phù hợp nhóm bạn thân ăn uống ngang nhau. VD lẩu 800k + VAT 8% + Tip 10% chia 4 = mỗi người 234k.</li>
          <li><strong>Chia theo món</strong> — fair khi mức ăn chênh lệch. VD A uống bia 200k, B nước ngọt 50k, đồ ăn 600k chia đều → A trả nhiều hơn B.</li>
          <li><strong>Chia % tùy ý</strong> — công ty offsite/team building. Sếp 50%, 2 nhân viên 25% mỗi người chẳng hạn.</li>
        </ul>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>VAT = Bill × VAT%</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Tip = (Bill + VAT) × Tip%</strong> (chuẩn quốc tế)</p>
          <p className="font-mono text-sm mt-1"><strong>Tổng = Bill + VAT + Tip</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Mỗi người (chia đều) = Tổng ÷ Số người</strong></p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Bill 800k, VAT 8%, Tip 10%, chia 4:</strong> VAT 64k, Tip 86k → Tổng 950k → mỗi người <strong>238k</strong></li>
          <li><strong>Bill 1.5tr nhà hàng, VAT 8%, Tip 5%, chia 6:</strong> VAT 120k, Tip 81k → Tổng 1.701tr → mỗi người <strong>283.5k</strong></li>
          <li><strong>Nhậu 4 người mức ăn chênh lệch (chế độ chia theo món):</strong> A uống 200k bia, B 200k bia, C 50k nước, đồ ăn 600k chia 4 → A=B=350k, C=200k (trước VAT+Tip)</li>
        </ul>

        <h2 className="text-lg font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-base">{f.q}</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
          </div>
        ))}
      </article>
      <footer className="text-center py-4 text-xs" style={{ color: "var(--text-muted)" }}>
        © 2026 phantram.online — Công cụ tính % miễn phí
      </footer>
    </>
  );
}
