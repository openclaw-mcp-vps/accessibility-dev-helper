import Link from "next/link";
import { AlertTriangle, CheckCircle2, Ear, EyeOff, Zap } from "lucide-react";
import { PricingTable } from "@/components/PricingTable";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-10 md:px-10 md:py-14">
        <header className="flex flex-col gap-8 rounded-3xl border border-[#30363d] bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#0d1117] p-8 shadow-2xl shadow-black/30 md:p-12">
          <nav className="flex items-center justify-between">
            <p className="text-lg font-semibold tracking-tight">accessibility-dev-helper</p>
            <Link
              href="/dashboard"
              className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-[#c9d1d9] transition hover:border-[#58a6ff] hover:text-white"
            >
              Open Dashboard
            </Link>
          </nav>

          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#2f81f7]/40 bg-[#172554] px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[#93c5fd]">
                <EyeOff className="h-3.5 w-3.5" />
                Screen reader simulation for blind developers
              </p>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                Ship interfaces blind users can trust before your code reaches production.
              </h1>
              <p className="max-w-2xl text-lg text-[#8b949e]">
                accessibility-dev-helper captures your DOM in real time, simulates spoken output, and flags actionable WCAG issues so your team can fix accessibility bugs while the pull request is still open.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#pricing"
                  className="rounded-xl bg-[#2f81f7] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1d4ed8]"
                >
                  Start for $15/month
                </a>
                <a
                  href="#solution"
                  className="rounded-xl border border-[#30363d] px-6 py-3 text-center text-sm font-semibold text-[#c9d1d9] transition hover:border-[#58a6ff]"
                >
                  See How It Works
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#0f172a]/80 p-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#93c5fd]">Live Simulation Preview</p>
              <div className="space-y-2 rounded-xl bg-[#020617] p-4 font-mono text-xs text-[#c9d1d9]">
                <p>{"> Heading level 1, Checkout"}</p>
                <p>{"> Link, Back to cart"}</p>
                <p className="text-[#fbbf24]">{"> Form field, Email address, required"}</p>
                <p className="text-[#f87171]">{"> Alert: Button has no accessible name"}</p>
                <p>{"> Button, Place order"}</p>
              </div>
            </div>
          </div>
        </header>

        <section id="problem" className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">Why teams miss accessibility bugs</h2>
            <p className="text-lg text-[#8b949e]">
              Most engineering teams only test visual behavior. Screen-reader behavior is invisible during regular QA, so blockers stay hidden until customer complaints, expensive audits, or legal escalation.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <AlertTriangle className="mb-3 h-6 w-6 text-[#fbbf24]" />
              <h3 className="mb-2 text-xl font-semibold">Late-stage fixes are expensive</h3>
              <p className="text-sm text-[#8b949e]">
                Reworking inaccessible forms and navigation after release burns sprint capacity and forces urgent hotfixes.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <Ear className="mb-3 h-6 w-6 text-[#60a5fa]" />
              <h3 className="mb-2 text-xl font-semibold">Blind users face broken journeys</h3>
              <p className="text-sm text-[#8b949e]">
                Nearly 285 million visually impaired users rely on spoken cues. Missing labels and structure blocks essential tasks.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <Zap className="mb-3 h-6 w-6 text-[#34d399]" />
              <h3 className="mb-2 text-xl font-semibold">Compliance pressure keeps rising</h3>
              <p className="text-sm text-[#8b949e]">
                Startups shipping customer-facing products need evidence of accessibility coverage without hiring a full specialist team.
              </p>
            </article>
          </div>
        </section>

        <section id="solution" className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">Built for fast-moving frontend teams</h2>
            <p className="text-lg text-[#8b949e]">
              Use the browser extension during local development, then run deeper audits in the dashboard before merge.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-xl font-semibold">Real-time spoken output simulation</h3>
              <p className="text-sm text-[#8b949e]">
                Understand reading order, landmark announcements, link context, and form labeling exactly as a screen reader would narrate it.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-xl font-semibold">Actionable issue reports</h3>
              <p className="text-sm text-[#8b949e]">
                Each finding includes severity, affected selector, and practical remediation guidance your developers can apply immediately.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-xl font-semibold">Paywalled team dashboard</h3>
              <p className="text-sm text-[#8b949e]">
                Secure cookie-based access keeps premium simulation tooling restricted to paying teams while supporting fast onboarding.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-xl font-semibold">Fits current workflow</h3>
              <p className="text-sm text-[#8b949e]">
                Keep using your existing stack. Paste HTML snapshots or audit public staging URLs, then hand results directly to your PR owners.
              </p>
            </article>
          </div>
        </section>

        <section id="pricing" className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">Simple pricing for shipping teams</h2>
            <p className="text-lg text-[#8b949e]">
              One plan, one workflow: extension + dashboard + simulation API for individual developers and QA engineers.
            </p>
          </div>
          <PricingTable />
        </section>

        <section id="faq" className="space-y-8 pb-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold md:text-4xl">FAQ</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-lg font-semibold">Do I need real screen reader software?</h3>
              <p className="text-sm text-[#8b949e]">
                No. The simulator mirrors core screen-reader interpretation patterns so developers can catch most structural issues before manual assistive-tech QA.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-lg font-semibold">How do I unlock dashboard access?</h3>
              <p className="text-sm text-[#8b949e]">
                Complete Stripe checkout, then enter the same purchase email on this page. Your access cookie is issued immediately when the purchase exists.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-lg font-semibold">Can QA engineers use it without coding?</h3>
              <p className="text-sm text-[#8b949e]">
                Yes. QA can paste rendered HTML from staging pages and review the spoken transcript plus structured issue report with clear severity labels.
              </p>
            </article>
            <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
              <h3 className="mb-2 text-lg font-semibold">What standards are covered?</h3>
              <p className="text-sm text-[#8b949e]">
                The analyzer surfaces WCAG-aligned concerns with rule support from axe-core plus additional semantic checks for labels, headings, and ARIA role usage.
              </p>
            </article>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1f6feb]/40 bg-[#0b2542] px-4 py-1 text-xs uppercase tracking-[0.16em] text-[#93c5fd]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Built for frontend teams at accessibility-sensitive startups
          </div>
        </section>
      </div>
    </main>
  );
}
