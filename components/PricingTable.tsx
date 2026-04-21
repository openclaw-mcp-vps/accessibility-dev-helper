"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export function PricingTable() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  async function unlockDashboard() {
    setUnlockMessage(null);
    setUnlocking(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Could not unlock dashboard.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setUnlockMessage(error instanceof Error ? error.message : "Unlock failed.");
    } finally {
      setUnlocking(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <article className="rounded-3xl border border-[#1f6feb]/40 bg-gradient-to-b from-[#111827] to-[#0f172a] p-7 shadow-xl shadow-black/20">
        <p className="mb-3 inline-flex rounded-full border border-[#1f6feb]/40 bg-[#0b2542] px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-[#93c5fd]">
          Pro Plan
        </p>
        <h3 className="text-3xl font-bold">$15/mo</h3>
        <p className="mt-2 text-sm text-[#8b949e]">
          Built for frontend developers and QA engineers at startups shipping customer-facing products.
        </p>

        <ul className="mt-5 space-y-3 text-sm">
          {[
            "Screen-reader simulation dashboard",
            "Actionable issue severity scoring",
            "Browser extension for real-time DOM monitoring",
            "WCAG-aligned checks with remediation guidance",
            "Unlimited audits for your dev and staging pages"
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-[#c9d1d9]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34d399]" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <a
          href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#2f81f7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:pointer-events-none disabled:opacity-60"
          aria-disabled={!paymentLink}
        >
          Buy with Stripe Checkout
        </a>
      </article>

      <article className="rounded-3xl border border-[#30363d] bg-[#111827] p-7">
        <h3 className="text-xl font-semibold">Unlock Your Dashboard</h3>
        <p className="mt-2 text-sm text-[#8b949e]">
          After payment, enter the same email used at checkout. Access is granted by secure cookie.
        </p>

        <div className="mt-5 space-y-3">
          <label htmlFor="unlock-email" className="text-xs uppercase tracking-[0.16em] text-[#93c5fd]">
            Purchase Email
          </label>
          <input
            id="unlock-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm outline-none transition focus:border-[#58a6ff]"
          />
          <button
            type="button"
            onClick={unlockDashboard}
            disabled={unlocking || !email}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] px-4 py-3 text-sm font-semibold text-[#e6edf3] transition hover:border-[#58a6ff] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {unlocking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {unlocking ? "Verifying Purchase" : "Unlock Dashboard"}
          </button>
        </div>

        {unlockMessage ? (
          <p className="mt-4 rounded-lg border border-[#7f1d1d] bg-[#450a0a]/40 px-3 py-2 text-sm text-[#fecaca]">
            {unlockMessage}
          </p>
        ) : null}

        <p className="mt-4 text-xs text-[#6e7681]">
          Need help? Configure your Stripe webhook to send checkout events to
          <span className="ml-1 font-mono">/api/webhooks/lemonsqueezy</span>.
        </p>
      </article>
    </div>
  );
}
