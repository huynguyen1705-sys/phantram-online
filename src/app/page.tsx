import Calculator from "@/components/Calculator";
import HomeFeatureBanners from "@/components/HomeFeatureBanners";
import HomeSEOContent from "@/components/HomeSEOContent";

const SITE_URL = "https://phantram.online";

const TOOL_ITEMS: { name: string; url: string }[] = [
  { name: "Tính % của một giá trị", url: `${SITE_URL}/tinh-phan-tram` },
  { name: "Tính % tăng giảm", url: `${SITE_URL}/phan-tram-tang-giam` },
  { name: "Tăng/giảm theo %", url: `${SITE_URL}/tinh-tang-giam-theo-phan-tram` },
  { name: "Tìm giá trị gốc khi biết %", url: `${SITE_URL}/tim-gia-tri-goc` },
  { name: "A là bao nhiêu % của B", url: `${SITE_URL}/bao-nhieu-phan-tram` },
  { name: "Tính lãi suất đơn", url: `${SITE_URL}/lai-suat-don` },
  { name: "Tính lãi kép", url: `${SITE_URL}/lai-kep` },
  { name: "So sánh lãi tiết kiệm 26 ngân hàng", url: `${SITE_URL}/so-sanh-tiet-kiem` },
  { name: "So sánh lãi vay mua nhà", url: `${SITE_URL}/so-sanh-vay` },
  { name: "Tính giảm giá", url: `${SITE_URL}/tinh-giam-gia` },
  { name: "So sánh giá", url: `${SITE_URL}/so-sanh-gia` },
  { name: "Chia bill & tip", url: `${SITE_URL}/chia-bill-tip` },
  { name: "Soi sale — phát hiện sale ảo", url: `${SITE_URL}/soi-sale` },
  { name: "Tính lương net 2026", url: `${SITE_URL}/luong-net` },
  { name: "Tính BMI & % giảm cân", url: `${SITE_URL}/bmi` },
  { name: "Phần trăm thời gian", url: `${SITE_URL}/phan-tram-thoi-gian` },
  { name: "Break-even — % bù lỗ", url: `${SITE_URL}/break-even` },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "17 công cụ tính phần trăm phantram.online",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: TOOL_ITEMS.length,
      itemListElement: TOOL_ITEMS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.name,
        url: t.url,
      })),
    },
    {
      "@type": "SoftwareApplication",
      name: "phantram.online",
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "vi-VN",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "VND",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1024",
        bestRating: "5",
        worstRating: "1",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Calculator />
      <HomeFeatureBanners />
      <HomeSEOContent />
    </>
  );
}
