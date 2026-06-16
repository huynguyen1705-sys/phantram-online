import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Calculator from "@/components/Calculator";
import { TAB_URL_MAP, TABS, type TabId } from "@/lib/tabs";

// Slug (URL path used by tool pages) → TabId
const SLUG_TO_TAB: Record<string, TabId> = {
  "tinh-phan-tram": "percent-of",
  "bao-nhieu-phan-tram": "what-percent",
  "phan-tram-tang-giam": "change",
  "tinh-tang-giam-theo-phan-tram": "increase-decrease",
  "tim-gia-tri-goc": "find-base",
  "tinh-giam-gia": "discount",
  "so-sanh-gia": "compare",
  "chia-bill-tip": "tip",
  "lai-suat-don": "interest",
  "lai-kep": "compound",
  "luong-net": "salary-tax",
  "break-even": "breakeven",
  "scale-cong-thuc": "recipe-scale",
  "bmi": "weight-bmi",
  "phan-tram-thoi-gian": "time-progress",
  "soi-sale": "soi-sale",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SLUG_TO_TAB).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tabId = SLUG_TO_TAB[slug];
  if (!tabId) return { robots: { index: false, follow: false } };
  const tab = TABS.find((t) => t.id === tabId);
  const name = tab?.label ?? "phần trăm";
  const toolPath = TAB_URL_MAP[tabId];
  return {
    title: `Máy tính ${name} – phantram.online`,
    description: `Widget máy tính ${name} của phantram.online — nhúng miễn phí vào website của bạn.`,
    alternates: { canonical: `https://phantram.online${toolPath}` },
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const tabId = SLUG_TO_TAB[slug];
  if (!tabId) notFound();

  const rawTheme = (Array.isArray(sp.theme) ? sp.theme[0] : sp.theme) ?? "auto";
  const theme: "auto" | "light" | "dark" =
    rawTheme === "light" || rawTheme === "dark" ? rawTheme : "auto";

  return <Calculator initialTab={tabId} singleTab embed embedTheme={theme} />;
}
