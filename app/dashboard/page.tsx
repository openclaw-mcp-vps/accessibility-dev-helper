import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AccessibilitySimulator } from "@/components/AccessibilitySimulator";
import { ACCESS_COOKIE_NAME, verifyAccessCookie } from "@/lib/lemonsqueezy";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!accessCookie || !verifyAccessCookie(accessCookie)) {
    redirect("/#pricing");
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10 md:py-14">
        <header className="flex flex-col gap-4 rounded-2xl border border-[#30363d] bg-[#111827] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Simulation Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#8b949e]">
              Paste HTML or audit a public URL to preview screen-reader narration and detect accessibility defects before merge.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-[#c9d1d9] transition hover:border-[#58a6ff] hover:text-white"
            >
              Back to Site
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
          <h2 className="text-xl font-semibold">Browser Extension Setup</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-[#8b949e]">
            <li>Open Chrome extensions and enable developer mode.</li>
            <li>Load the <code className="font-mono">extension/</code> directory as an unpacked extension.</li>
            <li>Open your local app and keep the simulator panel visible while building UI.</li>
            <li>Use this dashboard for deeper audits and share issue output in pull requests.</li>
          </ol>
        </section>

        <AccessibilitySimulator />
      </div>
    </main>
  );
}
