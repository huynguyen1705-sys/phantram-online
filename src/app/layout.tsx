import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

const SITE_URL = "https://phantram.online";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const GA_ID = "G-G2DJ5FC3FB";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Tính Phần Trăm Online - Máy Tính % Miễn Phí | phantram.online",
    template: "%s | phantram.online",
  },
  description:
    "Công cụ tính phần trăm online miễn phí, nhanh nhất Việt Nam. Tính % của giá trị, % tăng giảm, giảm giá, lãi suất ngân hàng, ROI, lãi kép. Tối ưu mobile.",
  keywords: [
    "tính phần trăm",
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
  ],
  authors: [{ name: "phantram.online" }],
  creator: "phantram.online",
  publisher: "phantram.online",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Tính Phần Trăm Online - Máy Tính % Miễn Phí",
    description: "Công cụ tính phần trăm online miễn phí, nhanh nhất Việt Nam. Tối ưu cho mobile.",
    url: SITE_URL,
    siteName: "phantram.online",
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
    title: "Tính Phần Trăm Online - Máy Tính % Miễn Phí",
    description: "Công cụ tính phần trăm online miễn phí, nhanh nhất Việt Nam.",
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
  name: "phantram.online",
  alternateName: "Phần Trăm Online",
  url: SITE_URL,
  inLanguage: "vi-VN",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://blog.phantram.online/?s={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
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
        text: "Có. phantram.online hoàn toàn miễn phí, không cần đăng ký, không quảng cáo, hoạt động trên mọi thiết bị.",
      },
    },
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
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
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('set','linker',{domains:['phantram.online','blog.phantram.online']});gtag('config','${GA_ID}',{anonymize_ip:true});`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
