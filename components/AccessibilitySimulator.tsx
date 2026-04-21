"use client";

import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation } from "react-query";
import { Loader2, LogOut, Sparkles } from "lucide-react";
import { ScreenReaderOutput } from "@/components/ScreenReaderOutput";
import type { AccessibilityReport, ScreenReaderSimulation } from "@/lib/accessibility-analyzer";

type SimulationResponse = {
  sourceUrl: string | null;
  report: AccessibilityReport;
  simulation: ScreenReaderSimulation;
};

const starterHtml = `<!doctype html>
<html lang="en">
  <body>
    <main>
      <h1>Account Settings</h1>
      <a href="/billing">Manage billing</a>
      <form>
        <label for="name">Full name</label>
        <input id="name" type="text" />
        <input type="email" placeholder="Email" />
        <button></button>
      </form>
    </main>
  </body>
</html>`;

function SimulatorInner() {
  const [html, setHtml] = useState(starterHtml);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const mutation = useMutation<SimulationResponse, Error, { html: string; url: string }>(
    async (payload) => {
      const response = await fetch("/api/simulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const json = (await response.json().catch(() => null)) as
        | SimulationResponse
        | { error?: string }
        | null;

      if (!response.ok) {
        const errorMessage =
          json && typeof json === "object" && "error" in json
            ? json.error
            : "Simulation failed.";
        throw new Error(errorMessage ?? "Simulation failed.");
      }

      return json as SimulationResponse;
    },
    {
      onSuccess(data) {
        setErrorText(null);
        setResult(data);
      },
      onError(error) {
        setErrorText(error.message);
      }
    }
  );

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.assign("/");
  }

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-[#30363d] bg-[#111827] p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Accessibility Simulator</h2>
            <p className="mt-1 text-sm text-[#8b949e]">
              Paste rendered HTML or provide a URL. The simulator returns spoken output and prioritized fixes.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22] px-4 py-2 text-sm text-[#c9d1d9] transition hover:border-[#58a6ff]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div>
            <label htmlFor="audit-url" className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#93c5fd]">
              Public URL (Optional)
            </label>
            <input
              id="audit-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://staging.yourapp.com/checkout"
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm outline-none transition focus:border-[#58a6ff]"
            />
          </div>

          <div>
            <label htmlFor="audit-html" className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#93c5fd]">
              HTML Snapshot
            </label>
            <textarea
              id="audit-html"
              value={html}
              onChange={(event) => setHtml(event.target.value)}
              rows={16}
              className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] p-4 font-mono text-xs outline-none transition focus:border-[#58a6ff]"
            />
          </div>

          <button
            type="button"
            onClick={() => mutation.mutate({ html, url })}
            disabled={mutation.isLoading || (!html.trim() && !url.trim())}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f81f7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {mutation.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {mutation.isLoading ? "Running Simulation" : "Run Simulation"}
          </button>

          {errorText ? (
            <p className="rounded-lg border border-[#7f1d1d] bg-[#450a0a]/40 px-3 py-2 text-sm text-[#fecaca]">
              {errorText}
            </p>
          ) : null}
        </div>
      </article>

      {result ? <ScreenReaderOutput report={result.report} simulation={result.simulation} /> : null}
    </section>
  );
}

export function AccessibilitySimulator() {
  const client = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={client}>
      <SimulatorInner />
    </QueryClientProvider>
  );
}
