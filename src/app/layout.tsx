import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Phần Trăm - Máy tính % online nhanh nhất | phantram.online",
  description:
    "Công cụ tính phần trăm online miễn phí, nhanh chóng. Tính % của giá trị, tăng/giảm %, so sánh, giảm giá, lãi suất. Tối ưu trên mobile.",
  keywords: "tính phần trăm, máy tính %, percent calculator, tính %, phần trăm online",
  openGraph: {
    title: "Phần Trăm - Máy tính % online",
    description: "Công cụ tính phần trăm online miễn phí, nhanh nhất Việt Nam",
    url: "https://phantram.online",
    siteName: "phantram.online",
    locale: "vi_VN",
    type: "website",
  },
  robots: "index, follow",
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>{children}</body>
    </html>
  );
}
