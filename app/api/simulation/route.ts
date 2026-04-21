import { NextRequest, NextResponse } from "next/server";
import { analyzeAccessibility } from "@/lib/accessibility-analyzer";
import { simulateScreenReader } from "@/lib/screen-reader-engine";
import { ACCESS_COOKIE_NAME, verifyAccessCookie } from "@/lib/lemonsqueezy";

export const runtime = "nodejs";

type SimulationRequestBody = {
  html?: string;
  url?: string;
};

function sanitizeHtml(html: string) {
  return html.trim().slice(0, 500_000);
}

async function fetchHtmlFromUrl(url: string) {
  const parsed = new URL(url);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "accessibility-dev-helper-audit-bot"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Could not fetch URL (${response.status})`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) {
      throw new Error("URL did not return HTML content.");
    }

    return sanitizeHtml(await response.text());
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  const accessCookie = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessCookie || !verifyAccessCookie(accessCookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as SimulationRequestBody | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  let sourceHtml = typeof body.html === "string" ? sanitizeHtml(body.html) : "";
  let sourceUrl: string | null = null;

  if (!sourceHtml && typeof body.url === "string" && body.url.trim()) {
    sourceUrl = body.url.trim();
    sourceHtml = await fetchHtmlFromUrl(sourceUrl);
  }

  if (!sourceHtml) {
    return NextResponse.json(
      { error: "Provide HTML content or a publicly reachable URL." },
      { status: 400 }
    );
  }

  const [report, simulation] = await Promise.all([
    analyzeAccessibility(sourceHtml),
    simulateScreenReader(sourceHtml)
  ]);

  return NextResponse.json({
    sourceUrl,
    report,
    simulation
  });
}
