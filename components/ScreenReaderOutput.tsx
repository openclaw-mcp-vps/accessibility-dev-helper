"use client";

import { AlertCircle, CheckCircle2, Headphones, TriangleAlert } from "lucide-react";
import type { AccessibilityReport, ScreenReaderSimulation } from "@/lib/accessibility-analyzer";

type Props = {
  report: AccessibilityReport;
  simulation: ScreenReaderSimulation;
};

function severityColor(severity: string) {
  if (severity === "critical") return "text-[#f87171] border-[#7f1d1d] bg-[#450a0a]/30";
  if (severity === "serious") return "text-[#f59e0b] border-[#78350f] bg-[#451a03]/30";
  if (severity === "moderate") return "text-[#fbbf24] border-[#713f12] bg-[#422006]/30";
  return "text-[#93c5fd] border-[#1e3a8a] bg-[#172554]/30";
}

export function ScreenReaderOutput({ report, simulation }: Props) {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[#8b949e]">Accessibility Score</p>
          <p className="mt-2 text-3xl font-bold text-[#34d399]">{report.score}</p>
        </article>
        <article className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[#8b949e]">Issues Found</p>
          <p className="mt-2 text-3xl font-bold text-[#fbbf24]">{report.issues.length}</p>
        </article>
        <article className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-[#8b949e]">Simulated Announcements</p>
          <p className="mt-2 text-3xl font-bold text-[#60a5fa]">{simulation.announcements.length}</p>
        </article>
      </div>

      <article className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#c9d1d9]">
          <Headphones className="h-4 w-4" />
          Simulated Screen Reader Output
        </p>
        <div className="max-h-96 overflow-y-auto rounded-xl border border-[#1f2937] bg-[#020617] p-4 font-mono text-xs text-[#c9d1d9]">
          {simulation.announcements.map((line, index) => (
            <p key={`${line}-${index}`} className="mb-1 last:mb-0">
              {"> "}
              {line}
            </p>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-5">
        <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#c9d1d9]">
          <TriangleAlert className="h-4 w-4" />
          Findings
        </p>

        {report.issues.length === 0 ? (
          <p className="inline-flex items-center gap-2 rounded-lg border border-[#166534] bg-[#052e16]/40 px-3 py-2 text-sm text-[#bbf7d0]">
            <CheckCircle2 className="h-4 w-4" />
            No critical accessibility issues were detected in this snapshot.
          </p>
        ) : (
          <div className="space-y-3">
            {report.issues.map((issue) => (
              <div
                key={`${issue.id}-${issue.selector}`}
                className={`rounded-xl border px-4 py-3 ${severityColor(issue.severity)}`}
              >
                <p className="flex items-start gap-2 text-sm font-semibold">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {issue.message}
                </p>
                <p className="mt-1 text-xs opacity-90">{issue.recommendation}</p>
                <p className="mt-2 font-mono text-[11px] opacity-80">Selector: {issue.selector}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
