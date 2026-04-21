import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE_NAME,
  createAccessCookie,
  hasPurchasedLicense
} from "@/lib/lemonsqueezy";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Enter the purchase email used during Stripe checkout." },
      { status: 400 }
    );
  }

  const purchased = await hasPurchasedLicense(email);

  if (!purchased) {
    return NextResponse.json(
      {
        error:
          "No completed purchase found for that email yet. Finish Stripe checkout first, then try again."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: createAccessCookie(email),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ACCESS_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
