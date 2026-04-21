import crypto from "node:crypto";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";

export const ACCESS_COOKIE_NAME = "adh_access";

type PurchaseRecord = {
  email: string;
  checkoutId: string;
  amountTotal?: number;
  currency?: string;
  createdAt: string;
};

type PurchaseData = {
  purchases: PurchaseRecord[];
};

const PURCHASE_FILE = path.join(process.cwd(), "data", "purchases.json");

function normalized(email: string) {
  return email.trim().toLowerCase();
}

async function ensurePurchaseFile() {
  await mkdir(path.dirname(PURCHASE_FILE), { recursive: true });

  try {
    await readFile(PURCHASE_FILE, "utf8");
  } catch {
    const initial: PurchaseData = { purchases: [] };
    await writeFile(PURCHASE_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

async function readPurchaseData(): Promise<PurchaseData> {
  await ensurePurchaseFile();

  const raw = await readFile(PURCHASE_FILE, "utf8");
  const parsed = JSON.parse(raw) as PurchaseData;

  if (!parsed.purchases || !Array.isArray(parsed.purchases)) {
    return { purchases: [] };
  }

  return parsed;
}

async function writePurchaseData(data: PurchaseData) {
  await ensurePurchaseFile();
  await writeFile(PURCHASE_FILE, JSON.stringify(data, null, 2), "utf8");
}

function accessSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || "local-development-secret";
}

export function createAccessCookie(email: string) {
  const payload = {
    email: normalized(email),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", accessSecret())
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

export function verifyAccessCookie(token: string) {
  const [payloadString, signature] = token.split(".");

  if (!payloadString || !signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", accessSecret())
    .update(payloadString)
    .digest("base64url");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(payloadString, "base64url").toString("utf8")
    ) as { exp?: number };

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function recordPurchaseFromStripe(record: {
  email: string;
  checkoutId: string;
  amountTotal?: number;
  currency?: string;
}) {
  const data = await readPurchaseData();
  const email = normalized(record.email);

  const existing = data.purchases.find(
    (entry) => entry.checkoutId === record.checkoutId || entry.email === email
  );

  if (existing) {
    existing.amountTotal = record.amountTotal;
    existing.currency = record.currency;
    existing.createdAt = new Date().toISOString();
  } else {
    data.purchases.push({
      email,
      checkoutId: record.checkoutId,
      amountTotal: record.amountTotal,
      currency: record.currency,
      createdAt: new Date().toISOString()
    });
  }

  await writePurchaseData(data);
}

export async function hasPurchasedLicense(email: string) {
  const data = await readPurchaseData();
  return data.purchases.some((entry) => entry.email === normalized(email));
}

export function verifyStripeSignature(payload: string, signatureHeader: string, secret: string) {
  const pairs = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = pairs.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = pairs
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  const timestampAge = Math.floor(Date.now() / 1000) - Number(timestamp);

  if (!Number.isFinite(timestampAge) || Math.abs(timestampAge) > 300) {
    return false;
  }

  return signatures.some((candidate) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}
