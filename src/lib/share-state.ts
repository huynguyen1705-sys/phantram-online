// Encode/decode shareable state for 5 priority calculators.
// URL key naming is tool-scoped + short to keep links compact.

export type ShareableTabId =
  | "weight-bmi"
  | "salary-tax"
  | "compound"
  | "discount"
  | "breakeven"
  | "tip";

export const SHAREABLE_TAB_URL: Record<ShareableTabId, string> = {
  "weight-bmi": "/bmi",
  "salary-tax": "/luong-net",
  "compound": "/lai-kep",
  "discount": "/tinh-giam-gia",
  "breakeven": "/break-even",
  "tip": "/chia-bill-tip",
};

export const SITE_ORIGIN = "https://phantram.online";

// ───────── Shape per tab (subset of state that has meaning to share) ─────────

export type ShareStateBMI = {
  tab: "weight-bmi";
  mode: "bmi" | "goal" | "calorie";
  sex: "male" | "female";
  height?: string;
  weight?: string;
  age?: string;
  activity?: string;
  goalMode?: "percent" | "absolute";
  goalPercent?: string;
  goalWeight?: string;
};

export type ShareStateSalaryTax = {
  tab: "salary-tax";
  gross: string;
  deps: string;
};

export type ShareStateCompound = {
  tab: "compound";
  principal: string;
  rate: string;
  period: string;
  periodUnit: "year" | "month";
  compFreq: "monthly" | "quarterly" | "yearly";
};

export type ShareStateDiscount = {
  tab: "discount";
  original: string;
  discountPercent: string;
};

export type ShareStateBreakeven = {
  tab: "breakeven";
  mode: "recovery" | "sales" | "invest";
  loss?: string;
  fc?: string;
  price?: string;
  vc?: string;
  capital?: string;
  monthlyProfit?: string;
};

export type ShareStateTip = {
  tab: "tip";
  mode: "equal" | "byItem" | "custom";
  // Mode equal
  total?: string;
  n?: string;       // số người
  tip?: string;     // tip %
  vat?: string;     // vat %
  tipOnVat?: "1" | "0";
  // Mode byItem & custom: compact encoded payload
  // p = pipe-separated names, e.g. "An|Binh|Chi"
  // d = pipe-separated dishes: "name:price:idxList" where idxList = comma indices, e.g. "Bia:200000:0,1|Coca:50000:2"
  // r = pipe-separated custom ratios (%) aligned with p: "50|25|25"
  p?: string;
  d?: string;
  r?: string;
};

export type ShareState =
  | ShareStateBMI
  | ShareStateSalaryTax
  | ShareStateCompound
  | ShareStateDiscount
  | ShareStateBreakeven
  | ShareStateTip;

// ───────── Encoders ─────────

function setIf(p: URLSearchParams, key: string, val: string | undefined) {
  if (val !== undefined && val !== "" && val !== null) p.set(key, val);
}

export function encodeShareState(s: ShareState): string {
  const p = new URLSearchParams();
  switch (s.tab) {
    case "weight-bmi":
      p.set("m", s.mode);
      p.set("s", s.sex);
      setIf(p, "h", s.height);
      setIf(p, "w", s.weight);
      setIf(p, "a", s.age);
      setIf(p, "act", s.activity);
      if (s.goalMode) p.set("gm", s.goalMode);
      setIf(p, "gp", s.goalPercent);
      setIf(p, "gw", s.goalWeight);
      break;
    case "salary-tax":
      setIf(p, "g", s.gross);
      setIf(p, "d", s.deps);
      break;
    case "compound":
      setIf(p, "p", s.principal);
      setIf(p, "r", s.rate);
      setIf(p, "t", s.period);
      p.set("u", s.periodUnit);
      p.set("f", s.compFreq);
      break;
    case "discount":
      setIf(p, "o", s.original);
      setIf(p, "d", s.discountPercent);
      break;
    case "breakeven":
      p.set("m", s.mode);
      setIf(p, "l", s.loss);
      setIf(p, "fc", s.fc);
      setIf(p, "pr", s.price);
      setIf(p, "vc", s.vc);
      setIf(p, "c", s.capital);
      setIf(p, "mp", s.monthlyProfit);
      break;
    case "tip":
      p.set("m", s.mode);
      setIf(p, "t", s.total);
      setIf(p, "n", s.n);
      setIf(p, "tip", s.tip);
      setIf(p, "vat", s.vat);
      if (s.tipOnVat) p.set("tov", s.tipOnVat);
      setIf(p, "p", s.p);
      setIf(p, "d", s.d);
      setIf(p, "r", s.r);
      break;
  }
  return p.toString();
}

// ───────── Decoders → Partial<state> per tab ─────────

export type DecodedBMI = Partial<Omit<ShareStateBMI, "tab">>;
export type DecodedSalaryTax = Partial<Omit<ShareStateSalaryTax, "tab">>;
export type DecodedCompound = Partial<Omit<ShareStateCompound, "tab">>;
export type DecodedDiscount = Partial<Omit<ShareStateDiscount, "tab">>;
export type DecodedBreakeven = Partial<Omit<ShareStateBreakeven, "tab">>;
export type DecodedTip = Partial<Omit<ShareStateTip, "tab">>;

function getStr(p: URLSearchParams, k: string): string | undefined {
  const v = p.get(k);
  return v === null ? undefined : v;
}

export function decodeBMI(p: URLSearchParams): DecodedBMI {
  const out: DecodedBMI = {};
  const m = p.get("m");
  if (m === "bmi" || m === "goal" || m === "calorie") out.mode = m;
  const s = p.get("s");
  if (s === "male" || s === "female") out.sex = s;
  out.height = getStr(p, "h");
  out.weight = getStr(p, "w");
  out.age = getStr(p, "a");
  out.activity = getStr(p, "act");
  const gm = p.get("gm");
  if (gm === "percent" || gm === "absolute") out.goalMode = gm;
  out.goalPercent = getStr(p, "gp");
  out.goalWeight = getStr(p, "gw");
  return out;
}

export function decodeSalaryTax(p: URLSearchParams): DecodedSalaryTax {
  return {
    gross: getStr(p, "g"),
    deps: getStr(p, "d"),
  };
}

export function decodeCompound(p: URLSearchParams): DecodedCompound {
  const out: DecodedCompound = {
    principal: getStr(p, "p"),
    rate: getStr(p, "r"),
    period: getStr(p, "t"),
  };
  const u = p.get("u");
  if (u === "year" || u === "month") out.periodUnit = u;
  const f = p.get("f");
  if (f === "monthly" || f === "quarterly" || f === "yearly") out.compFreq = f;
  return out;
}

export function decodeDiscount(p: URLSearchParams): DecodedDiscount {
  return {
    original: getStr(p, "o"),
    discountPercent: getStr(p, "d"),
  };
}

export function decodeBreakeven(p: URLSearchParams): DecodedBreakeven {
  const out: DecodedBreakeven = {};
  const m = p.get("m");
  if (m === "recovery" || m === "sales" || m === "invest") out.mode = m;
  out.loss = getStr(p, "l");
  out.fc = getStr(p, "fc");
  out.price = getStr(p, "pr");
  out.vc = getStr(p, "vc");
  out.capital = getStr(p, "c");
  out.monthlyProfit = getStr(p, "mp");
  return out;
}

export function decodeTip(p: URLSearchParams): DecodedTip {
  const out: DecodedTip = {};
  const m = p.get("m");
  if (m === "equal" || m === "byItem" || m === "custom") out.mode = m;
  out.total = getStr(p, "t");
  out.n = getStr(p, "n");
  out.tip = getStr(p, "tip");
  out.vat = getStr(p, "vat");
  const tov = p.get("tov");
  if (tov === "1" || tov === "0") out.tipOnVat = tov;
  out.p = getStr(p, "p");
  out.d = getStr(p, "d");
  out.r = getStr(p, "r");
  return out;
}

// ───────── Build URL / title / text / OG image URL ─────────

export function buildShareUrl(s: ShareState): string {
  const path = SHAREABLE_TAB_URL[s.tab];
  const qs = encodeShareState(s);
  return `${SITE_ORIGIN}${path}${qs ? "?" + qs : ""}`;
}

export function buildOgImageUrl(s: ShareState): string {
  const path = SHAREABLE_TAB_URL[s.tab];
  const qs = encodeShareState(s);
  // Next.js auto-mounts opengraph-image at `<route>/opengraph-image`.
  return `${SITE_ORIGIN}${path}/opengraph-image${qs ? "?" + qs : ""}`;
}
