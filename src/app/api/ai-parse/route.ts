import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Simple in-memory rate limit: IP → 10 req / 60s ──
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function getIP(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anonymous";
}

function checkRate(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now >= b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (b.count >= RATE_LIMIT) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true };
}

// occasional cleanup so the map doesn't grow forever
if (typeof globalThis !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(ip);
    }
  }, 5 * 60_000).unref?.();
}

const SYSTEM_PROMPT = `Bạn là máy tính phần trăm thông minh cho người Việt. Phân tích câu hỏi bằng tiếng Việt của user và trả về DUY NHẤT một JSON object đúng schema sau, KHÔNG kèm markdown, KHÔNG giải thích ngoài JSON:

{
  "operations": [{"step": <số>, "description": "<mô tả ngắn bằng tiếng Việt>", "value": <số kết quả của bước đó>}],
  "result": <số cuối cùng>,
  "result_formatted": "<chuỗi đã format kiểu Việt Nam, kèm đơn vị nếu có, ví dụ '17.500.000 ₫' hoặc '7,5 triệu' hoặc '15%'>",
  "explanation": "<giải thích ngắn 1-3 câu, dễ hiểu, tiếng Việt>",
  "warnings": ["<lưu ý nếu có, mảng có thể rỗng>"]
}

Quy tắc:
- Tính chính xác, ưu tiên đơn vị tiền VND.
- "triệu" = 1.000.000, "tỷ" = 1.000.000.000, "k" hoặc "nghìn" = 1.000.
- Nếu user diễn đạt mơ hồ, chọn cách hiểu phổ biến nhất và ghi vào "warnings".
- Nếu KHÔNG hiểu câu hỏi hoặc không phải bài toán phần trăm, trả về JSON: {"error":"<lý do ngắn bằng tiếng Việt>"}.
- TUYỆT ĐỐI không bọc JSON trong code block, không thêm chữ ngoài JSON.`;

type ParsedResult = {
  operations?: { step: number; description: string; value: number }[];
  result?: number;
  result_formatted?: string;
  explanation?: string;
  warnings?: string[];
  error?: string;
};

function safeJsonParse(s: string): ParsedResult | null {
  try {
    return JSON.parse(s);
  } catch {
    // try to extract first {...} block
    const m = s.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(req: NextRequest) {
  // ── Rate limit ──
  const ip = getIP(req);
  const rl = checkRate(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Bạn gửi hơi nhanh. Đợi 1 phút rồi thử lại nhé." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter ?? 60) } },
    );
  }

  // ── Parse body ──
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ." }, { status: 400 });
  }
  const query =
    body && typeof body === "object" && "query" in body && typeof (body as { query: unknown }).query === "string"
      ? (body as { query: string }).query.trim()
      : "";
  if (!query) {
    return NextResponse.json({ error: "Bạn chưa nhập câu hỏi." }, { status: 400 });
  }
  if (query.length < 5) {
    return NextResponse.json({ error: "Câu hỏi quá ngắn (tối thiểu 5 ký tự)." }, { status: 400 });
  }
  if (query.length > 500) {
    return NextResponse.json({ error: "Câu hỏi quá dài (tối đa 500 ký tự)." }, { status: 400 });
  }

  // ── Check env ──
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Hệ thống chưa cấu hình AI. Vui lòng liên hệ admin." },
      { status: 500 },
    );
  }

  // ── Call OpenRouter ──
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 25_000);
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://1phantram.com",
        "X-Title": "1phantram.com AI Parser",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        temperature: 0.1,
        max_tokens: 600,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Câu hỏi: """${query}"""\n\nHãy phân tích và trả về JSON theo đúng schema.`,
          },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(t);

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      console.error("[ai-parse] OpenRouter HTTP", resp.status, txt.slice(0, 400));
      return NextResponse.json(
        { error: "Máy chủ AI đang bận, vui lòng thử lại sau ít phút." },
        { status: 502 },
      );
    }

    const data = (await resp.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(content);
    if (!parsed) {
      console.error("[ai-parse] JSON parse fail:", content.slice(0, 400));
      return NextResponse.json(
        { error: "AI trả về dữ liệu không đúng định dạng. Thử diễn đạt lại câu hỏi nhé." },
        { status: 500 },
      );
    }
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 200 });
    }

    return NextResponse.json({
      operations: Array.isArray(parsed.operations) ? parsed.operations : [],
      result: typeof parsed.result === "number" ? parsed.result : null,
      result_formatted: typeof parsed.result_formatted === "string" ? parsed.result_formatted : "",
      explanation: typeof parsed.explanation === "string" ? parsed.explanation : "",
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings.filter((w) => typeof w === "string") : [],
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[ai-parse] fetch error:", msg);
    const friendly =
      msg.includes("aborted") || msg.includes("AbortError")
        ? "AI phản hồi quá lâu. Thử lại nhé."
        : "Không kết nối được máy chủ AI. Thử lại sau ít phút.";
    return NextResponse.json({ error: friendly }, { status: 500 });
  }
}
