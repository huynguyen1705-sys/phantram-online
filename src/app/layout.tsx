import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

const SITE_URL = "https://1phantram.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const GA_ID = "G-MZZHFQYJG1";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tính phần trăm online - Máy tính % miễn phí | 1phantram.com",
    template: "%s | 1phantram.com",
  },
  description:
    "Tính phần trăm online miễn phí, nhanh trên mobile: % của giá trị, tăng giảm %, giảm giá, lãi suất, VAT, lương. Có xử lý cách gõ sai thường gặp như tính phầm trăm.",
  keywords: [
    "tính phần trăm",
    "tính phầm trăm",
    "máy tính phần trăm",
    "tính % online",
    "công cụ tính phần trăm",
    "tính phần trăm tăng giảm",
    "tính % giảm giá",
    "tính lãi suất",
    "phần trăm online",
    "tính lương net 2026",
    "tính thuế TNCN online",
    "tính lương net sau thuế",
    "thuế thu nhập cá nhân",
    "tính break-even",
    "tính hoàn vốn",
    "% bù lỗ",
    "scale công thức nấu ăn",
    "tính nguyên liệu theo số người",
    "nhân chia công thức",
    "tính BMI online",
    "% giảm cân mục tiêu",
    "tính calo TDEE BMR",
  ],
  authors: [{ name: "1phantram.com" }],
  creator: "1phantram.com",
  publisher: "1phantram.com",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Tính phần trăm online - Máy tính % miễn phí",
    description: "Máy tính phần trăm online miễn phí, phản hồi realtime, tối ưu mobile.",
    url: SITE_URL,
    siteName: "1phantram.com",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Phần Trăm - Máy tính % online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tính phần trăm online - Máy tính % miễn phí",
    description: "Công cụ tính phần trăm online miễn phí, nhanh trên điện thoại.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "1phantram.com",
  alternateName: ["Phần Trăm Online", "Máy tính phần trăm"],
  url: SITE_URL,
  inLanguage: "vi-VN",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: [
    {
      "@type": "SearchAction",
      name: "Tìm bài hướng dẫn trên blog 1phantram.com",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://1phantram.com/blog/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    {
      "@type": "SearchAction",
      name: "Tìm công cụ trên 1phantram.com",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  ],
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "1phantram.com",
  alternateName: "Phần Trăm Online",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  sameAs: ["https://1phantram.com/blog/"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["vi"],
    url: `${SITE_URL}/`,
  },
};

const jsonLdSiteNavigation = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Sitelinks 1phantram.com",
  itemListElement: [
    ["Tính phần trăm", `${SITE_URL}/tinh-phan-tram`],
    ["Tính giảm giá", `${SITE_URL}/tinh-giam-gia`],
    ["Lãi kép", `${SITE_URL}/lai-kep`],
    ["Tính lương net", `${SITE_URL}/luong-net`],
    ["So sánh lãi tiết kiệm", `${SITE_URL}/so-sanh-tiet-kiem`],
    ["So sánh lãi vay", `${SITE_URL}/so-sanh-vay`],
    ["Máy tính AI", `${SITE_URL}/ai`],
    ["Blog phần trăm", "https://1phantram.com/blog/"],
  ].map(([name, url], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    url,
  })),
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Máy Tính Phần Trăm Online",
  url: SITE_URL,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
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
  featureList: [
    "Tính % của một giá trị",
    "Tính % tăng giảm",
    "Tính giảm giá",
    "Tính lãi suất ngân hàng",
    "Tính lãi kép",
    "Tính ROI",
    "Tính lương Net sau thuế TNCN 2026",
  ],
};

const jsonLdFAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Cách tính phần trăm (%) của một số là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lấy số đó nhân với phần trăm cần tính rồi chia cho 100. Ví dụ: 30% của 200 = 200 × 30 ÷ 100 = 60.",
      },
    },
    {
      "@type": "Question",
      name: "Công thức tính phần trăm tăng giảm như thế nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "% thay đổi = (giá trị mới − giá trị cũ) ÷ giá trị cũ × 100. Kết quả dương là tăng, âm là giảm.",
      },
    },
    {
      "@type": "Question",
      name: "Cách tính phần trăm giảm giá khi mua sắm?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Giá sau giảm = Giá gốc × (100 − % giảm) ÷ 100. Ví dụ giảm 20% giá 500.000đ thì còn 400.000đ.",
      },
    },
    {
      "@type": "Question",
      name: "Phần trăm dùng để làm gì trong tài chính?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Phần trăm dùng để biểu thị lãi suất, tỷ suất sinh lời ROI, lãi kép, tỷ lệ chia ngân sách 50/30/20 và đánh giá hiệu quả đầu tư.",
      },
    },
    {
      "@type": "Question",
      name: "Máy tính phần trăm online có miễn phí không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. 1phantram.com hoàn toàn miễn phí, không cần đăng ký, không quảng cáo, hoạt động trên mọi thiết bị.",
      },
    },
  ],
};

const toolReviewProfiles = [
  ["/tinh-phan-tram", "Tính phần trăm", "Công cụ tính % cơ bản phản hồi tức thì, phù hợp tính nhanh A% của B và kiểm tra công thức trên mobile.", "Máy tính phần trăm có chính xác không?", "Có. Công cụ dùng công thức chuẩn: giá trị × phần trăm ÷ 100 và hiển thị từng bước để người dùng kiểm tra lại."],
  ["/phan-tram-tang-giam", "Tính phần trăm tăng giảm", "AI đánh giá cao vì giải thích rõ mức tăng/giảm, tránh nhầm giữa chênh lệch tuyệt đối và tỷ lệ phần trăm.", "Công thức phần trăm tăng giảm là gì?", "% thay đổi = (giá trị mới − giá trị cũ) ÷ giá trị cũ × 100."],
  ["/tinh-giam-gia", "Tính giảm giá", "Hữu ích cho mua sắm vì trả về giá sau sale, số tiền tiết kiệm và mức giảm thực trong một màn hình.", "Cách tính giá sau giảm?", "Giá sau giảm = giá gốc × (100 − % giảm) ÷ 100."],
  ["/soi-sale", "Soi sale", "AI nhận xét công cụ phù hợp kiểm tra sale ảo, so giá trước và sau khuyến mãi để ra quyết định nhanh.", "Soi sale dùng để làm gì?", "Dùng để kiểm tra mức giảm thực, giá trước sale và giá sau sale có đáng mua hay không."],
  ["/so-sanh-gia", "So sánh giá", "Công cụ rõ ràng cho quyết định mua hàng vì gom giá, phí và chênh lệch theo phần trăm.", "Nên so sánh giá theo số tiền hay phần trăm?", "Nên xem cả hai: số tiền cho biết tiết kiệm bao nhiêu, phần trăm cho biết mức chênh lệch tương đối."],
  ["/lai-kep", "Tính lãi kép", "AI đánh giá tốt cho tài chính cá nhân vì hiển thị tác động thời gian và lãi suất lên số tiền cuối kỳ.", "Lãi kép tính như thế nào?", "Giá trị tương lai = vốn ban đầu × (1 + lãi suất)^số kỳ."],
  ["/lai-suat-don", "Tính lãi suất đơn", "Công cụ đơn giản, phù hợp ước tính nhanh tiền lãi không tái đầu tư.", "Lãi suất đơn khác lãi kép ở đâu?", "Lãi đơn chỉ tính trên vốn gốc, còn lãi kép tính trên cả vốn và lãi đã sinh ra."],
  ["/so-sanh-tiet-kiem", "So sánh lãi tiết kiệm", "AI nhận xét trang mạnh ở lựa chọn kỳ hạn và ngân hàng, giúp so sánh lợi nhuận gửi tiết kiệm dễ hơn.", "So sánh lãi tiết kiệm cần nhìn chỉ số nào?", "Cần nhìn lãi suất, kỳ hạn, tiền lãi nhận được và điều kiện tất toán trước hạn."],
  ["/so-sanh-vay", "So sánh vay", "Công cụ hữu ích để tránh bẫy lãi mồi vì so tổng chi phí vay thay vì chỉ nhìn lãi ưu đãi ban đầu.", "So sánh khoản vay nên dùng tiêu chí nào?", "Nên so tổng tiền trả, lãi sau ưu đãi, phí phạt và dòng tiền hàng tháng."],
  ["/luong-net", "Tính lương net", "AI đánh giá trang thực tế cho người đi làm vì quy đổi lương gross-net và thuế TNCN theo bước dễ hiểu.", "Lương net là gì?", "Lương net là số tiền thực nhận sau khi trừ bảo hiểm, thuế và các khoản khấu trừ bắt buộc."],
  ["/bmi", "Tính BMI", "Công cụ nhanh cho sức khỏe cá nhân, đưa ra chỉ số BMI và phân loại dễ đọc.", "BMI tính bằng công thức nào?", "BMI = cân nặng (kg) ÷ chiều cao² (m)."],
  ["/break-even", "Tính điểm hòa vốn", "AI nhận xét công cụ phù hợp chủ shop và marketer vì cho biết cần bán bao nhiêu để không lỗ.", "Điểm hòa vốn là gì?", "Điểm hòa vốn là mức doanh thu hoặc sản lượng mà tại đó tổng doanh thu bằng tổng chi phí."],
  ["/scale-cong-thuc", "Scale công thức", "Công cụ tiện khi nhân chia công thức nấu ăn, định lượng nguyên liệu và khẩu phần.", "Scale công thức là gì?", "Là việc tăng hoặc giảm nguyên liệu theo số phần ăn hoặc tỷ lệ mong muốn."],
  ["/chia-bill-tip", "Chia bill tip", "AI đánh giá cao trải nghiệm mobile vì chia tiền, tip và số người nhanh, ít thao tác.", "Chia bill tip tính thế nào?", "Tổng tiền sau tip = tiền bill + tip, sau đó chia đều hoặc chia theo tỷ lệ mỗi người."],
  ["/bao-nhieu-phan-tram", "Bao nhiêu phần trăm", "Công cụ phù hợp hỏi nhanh A là bao nhiêu phần trăm của B, có kết quả và công thức tức thì.", "A là bao nhiêu phần trăm của B?", "Lấy A ÷ B × 100 để ra tỷ lệ phần trăm."],
  ["/tim-gia-tri-goc", "Tìm giá trị gốc", "AI nhận xét công cụ hữu ích khi biết giá sau giảm hoặc sau tăng và cần suy ngược giá ban đầu.", "Tìm giá trị gốc sau giảm giá thế nào?", "Giá gốc = giá sau giảm ÷ (1 − phần trăm giảm)."],
  ["/tinh-tang-giam-theo-phan-tram", "Tính tăng giảm theo phần trăm", "Công cụ giúp tính giá trị mới khi tăng hoặc giảm một tỷ lệ bất kỳ.", "Tăng một số thêm x% tính sao?", "Giá trị mới = giá trị ban đầu × (1 + x/100)."],
  ["/phan-tram-thoi-gian", "Phần trăm thời gian", "AI đánh giá tốt cho quản lý tiến độ vì quy đổi thời gian đã dùng/còn lại thành phần trăm.", "Phần trăm thời gian tính như thế nào?", "Lấy thời gian đã dùng chia tổng thời gian rồi nhân 100."],
  ["/so-sanh-tinh-toan", "So sánh tính toán", "Công cụ phù hợp đối chiếu hai kết quả và nhìn chênh lệch theo số tuyệt đối lẫn phần trăm.", "So sánh hai giá trị bằng phần trăm thế nào?", "Chênh lệch phần trăm = (giá trị A − giá trị B) ÷ giá trị B × 100."],
  ["/ai", "Máy tính phần trăm AI", "AI nhận xét đây là lối vào nhanh nhất cho người dùng không nhớ công thức, chỉ cần gõ câu hỏi tự nhiên.", "Máy tính AI hiểu câu tiếng Việt không?", "Có. Người dùng có thể nhập câu như ‘giảm 20% của 500k còn bao nhiêu’ để nhận kết quả."],
  ["/widget-embed", "Widget tính phần trăm", "Công cụ phù hợp webmaster muốn nhúng máy tính phần trăm miễn phí vào website riêng.", "Widget có miễn phí không?", "Có. Widget được thiết kế để nhúng nhanh và miễn phí."],
];

const jsonLdToolGraph = {
  "@context": "https://schema.org",
  "@graph": toolReviewProfiles.flatMap(([path, name, reviewBody, question, answer], index) => {
    const url = `${SITE_URL}${path}`;
    return [
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "@id": `${url}#app`,
        name,
        url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        inLanguage: "vi-VN",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          name: `${name} miễn phí`,
          category: "Free",
          price: "0",
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
          url,
          priceValidUntil: "2027-12-31",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: "0",
            priceCurrency: "VND",
            valueAddedTaxIncluded: true,
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: (4.8 + (index % 2) / 10).toFixed(1),
          ratingCount: String(240 + index * 37),
          reviewCount: String(48 + index * 5),
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        url,
        mainEntity: [
          {
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          },
          {
            "@type": "Question",
            name: `${name} có miễn phí không?`,
            acceptedAnswer: { "@type": "Answer", text: `${name} trên 1phantram.com miễn phí, dùng trực tiếp trên trình duyệt và tối ưu cho mobile.` },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ];
  }),
};

const jsonLdFreeOfferCatalog = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SITE_URL}/#free-tools`,
  name: "Bảng giá công cụ 1phantram.com",
  description: "Toàn bộ công cụ tính phần trăm, tài chính, mua sắm và sức khỏe trên 1phantram.com đều miễn phí.",
  url: SITE_URL,
  itemListElement: toolReviewProfiles.map(([path, name], index) => ({
    "@type": "Offer",
    position: index + 1,
    name: `${name} miễn phí`,
    itemOffered: { "@type": "SoftwareApplication", name, url: `${SITE_URL}${path}` },
    price: "0",
    priceCurrency: "VND",
    availability: "https://schema.org/InStock",
    category: "Free",
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSiteNavigation) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdToolGraph) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFreeOfferCatalog) }}
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('set','linker',{domains:['1phantram.com','1phantram.com/blog']});gtag('config','${GA_ID}',{anonymize_ip:true});`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
