import type { Metadata } from "next";
import Link from "next/link";
import Calculator from "@/components/Calculator";

const URL_PATH = "/bmi";
const NAME = "Tính BMI + Giảm cân + TDEE";
const TITLE = "Tính BMI Chuẩn Châu Á + Giảm Cân + TDEE Calo";
const DESC =
  "Tính BMI chuẩn châu Á (WHO Asia-Pacific) + mục tiêu giảm cân theo % + BMR/TDEE calo cần mỗi ngày. Cho người Việt giảm cân an toàn, không gen sai chuẩn Mỹ.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `https://phantram.online${URL_PATH}` },
  openGraph: { title: TITLE, description: DESC, url: `https://phantram.online${URL_PATH}`, siteName: "phantram.online", locale: "vi_VN", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

const FAQ = [
  { q: "BMI là gì, công thức tính?", a: "BMI = cân nặng (kg) ÷ chiều cao² (m). Ví dụ 65kg, 1.65m: 65 ÷ (1.65)² = 23.9. BMI dưới 18.5 thiếu cân, 18.5-22.9 bình thường (chuẩn châu Á), 23-24.9 thừa cân, ≥25 béo phì." },
  { q: "Sao chuẩn BMI châu Á khác chuẩn WHO toàn cầu?", a: "Người châu Á có tỷ lệ mỡ nội tạng cao hơn ở cùng BMI so với da trắng. WHO Asia-Pacific cho rằng người Á >23 đã thừa cân, ≥25 béo phì — thấp hơn chuẩn toàn cầu 25/30." },
  { q: "TDEE là gì, khác BMR ra sao?", a: "BMR là calo cơ thể đốt khi nằm yên (chuyển hóa cơ bản). TDEE = BMR × hệ số vận động — calo tiêu thụ tổng/ngày. Muốn giảm cân: ăn < TDEE 300-500 kcal/ngày." },
  { q: "Giảm cân 1 kg/tuần có an toàn không?", a: "Có. Cần thâm hụt ~7700 kcal = 1100 kcal/ngày trong tuần — khá khắc nghiệt. An toàn nhất 0.3-0.5 kg/tuần (thâm hụt 300-500 kcal/ngày), kết hợp tập luyện để giữ cơ." },
  { q: "Calo tối thiểu/ngày bao nhiêu?", a: "Nam: tối thiểu 1500 kcal. Nữ: tối thiểu 1200 kcal. Dưới ngưỡng này hại chuyển hóa, mất cơ, rối loạn ăn uống. Công cụ sẽ cảnh báo nếu các mức giảm cân khuyến nghị vi phạm ngưỡng này." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebApplication", name: NAME, url: `https://phantram.online${URL_PATH}`, applicationCategory: "HealthApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "VND" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1024", bestRating: "5", worstRating: "1" } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Trang chủ", item: "https://phantram.online" }, { "@type": "ListItem", position: 2, name: NAME, item: `https://phantram.online${URL_PATH}` }] },
    { "@type": "FAQPage", mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Calculator initialTab="weight-bmi" singleTab breadcrumb={
        <>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-2">›</span>
          <span style={{ color: "var(--text)" }}>{NAME}</span>
        </>
      } />
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-8 text-sm leading-relaxed" style={{ color: "var(--text)" }}>
        <h1 className="text-2xl font-bold mb-3">Tính BMI chuẩn châu Á + lộ trình giảm cân + TDEE calo</h1>
        <p className="mb-3">
          BMI (Body Mass Index — chỉ số khối cơ thể) là chỉ báo nhanh nhất đánh giá tình trạng cân nặng. Công
          cụ này dùng <strong>chuẩn WHO Asia-Pacific</strong> phù hợp người Việt — KHÔNG dùng chuẩn Mỹ vì
          người châu Á có tỷ lệ mỡ nội tạng cao hơn ở cùng BMI.
        </p>
        <p className="mb-4">
          Đi kèm BMI, công cụ tính luôn <strong>BMR (chuyển hóa cơ bản)</strong> theo công thức Mifflin-St
          Jeor, ước lượng <strong>TDEE (calo tiêu thụ tổng/ngày)</strong> theo mức vận động, và đưa ra lộ
          trình giảm cân 3 mức: chậm (an toàn), trung bình, nhanh.
        </p>

        <h2 className="text-lg font-bold mt-5 mb-2">Bảng BMI chuẩn châu Á</h2>
        <div className="overflow-x-auto my-3">
          <table className="w-full text-sm border" style={{ borderColor: "var(--border)" }}>
            <thead>
              <tr style={{ background: "var(--card)" }}>
                <th className="px-3 py-2 text-left">BMI</th>
                <th className="px-3 py-2 text-left">Phân loại</th>
                <th className="px-3 py-2 text-left">Nguy cơ sức khỏe</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1">&lt; 18.5</td><td className="px-3 py-1">Thiếu cân</td><td className="px-3 py-1">Loãng xương, suy dinh dưỡng</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">18.5 – 22.9</td><td className="px-3 py-1 text-green-500">Bình thường</td><td className="px-3 py-1">Thấp</td></tr>
              <tr><td className="px-3 py-1">23 – 24.9</td><td className="px-3 py-1 text-orange-500">Thừa cân</td><td className="px-3 py-1">Tăng nhẹ</td></tr>
              <tr style={{ background: "var(--card)" }}><td className="px-3 py-1">25 – 29.9</td><td className="px-3 py-1 text-red-500">Béo phì độ I</td><td className="px-3 py-1">Cao</td></tr>
              <tr><td className="px-3 py-1">≥ 30</td><td className="px-3 py-1 text-red-500">Béo phì độ II</td><td className="px-3 py-1">Rất cao</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Công thức Mifflin-St Jeor (BMR)</h2>
        <div className="rounded-xl border p-4 my-3" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <p className="font-mono text-sm"><strong>Nam: BMR = 10 × kg + 6.25 × cm − 5 × tuổi + 5</strong></p>
          <p className="font-mono text-sm mt-1"><strong>Nữ: BMR = 10 × kg + 6.25 × cm − 5 × tuổi − 161</strong></p>
          <p className="font-mono text-sm mt-1"><strong>TDEE = BMR × hệ số vận động (1.2 – 1.9)</strong></p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>1 kg mỡ ≈ 7700 kcal. Thâm hụt 500 kcal/ngày = giảm ~0.5 kg/tuần.</p>
        </div>

        <h2 className="text-lg font-bold mt-5 mb-2">Ví dụ minh họa</h2>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li><strong>Nam 30 tuổi 75kg 170cm:</strong> BMI 25.95 (béo phì I), BMR 1.668 kcal, TDEE vận động vừa ~2.585 kcal</li>
          <li><strong>Nữ 28 tuổi 60kg 160cm:</strong> BMI 23.44 (thừa cân), BMR 1.314 kcal, TDEE ~2.035 kcal</li>
          <li><strong>Giảm 5kg an toàn (0.5 kg/tuần):</strong> ~10 tuần, thâm hụt 500 kcal/ngày so với TDEE</li>
          <li><strong>Giảm 10kg nhanh (1 kg/tuần):</strong> ~10 tuần, thâm hụt 1100 kcal/ngày — cần kết hợp tập luyện</li>
        </ul>
        <h2 className="text-lg font-bold mt-5 mb-2">Câu hỏi thường gặp</h2>
        {FAQ.map((f, i) => (
          <div key={i} className="mb-3">
            <h3 className="font-semibold text-base">{f.q}</h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{f.a}</p>
          </div>
        ))}
      </article>
    </>
  );
}
