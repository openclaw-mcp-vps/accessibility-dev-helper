import { load } from "cheerio";
import axe from "axe-core";
import { JSDOM } from "jsdom";
import { roles } from "aria-query";

const validRoles = new Set<string>(Array.from(roles.keys()).map((role) => String(role)));

export type Severity = "critical" | "serious" | "moderate" | "minor";

export type AccessibilityIssue = {
  id: string;
  severity: Severity;
  message: string;
  recommendation: string;
  selector: string;
};

export type AccessibilityReport = {
  score: number;
  issues: AccessibilityIssue[];
};

export type ScreenReaderSimulation = {
  announcements: string[];
};

function addIssue(
  issues: AccessibilityIssue[],
  issue: AccessibilityIssue,
  dedupe: Set<string>
) {
  const key = `${issue.id}:${issue.selector}`;

  if (!dedupe.has(key)) {
    dedupe.add(key);
    issues.push(issue);
  }
}

function getSeverity(impact: string | null | undefined): Severity {
  if (impact === "critical") return "critical";
  if (impact === "serious") return "serious";
  if (impact === "moderate") return "moderate";
  return "minor";
}

async function runAxe(html: string) {
  let dom: JSDOM | null = null;

  try {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    const { window } = dom;

    window.eval(axe.source);

    const axeRunner = (window as unknown as { axe?: { run: typeof axe.run } }).axe;

    if (!axeRunner) {
      return [] as AccessibilityIssue[];
    }

    const results = await axeRunner.run(window.document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa"]
      }
    });

    return results.violations.flatMap((violation) =>
      violation.nodes.slice(0, 5).map((node) => ({
        id: `axe-${violation.id}`,
        severity: getSeverity(violation.impact),
        message: violation.help,
        recommendation: violation.description,
        selector: node.target.join(" ") || "document"
      }))
    );
  } catch {
    return [] as AccessibilityIssue[];
  } finally {
    dom?.window.close();
  }
}

export async function analyzeAccessibility(html: string): Promise<AccessibilityReport> {
  const $ = load(html);
  const issues: AccessibilityIssue[] = [];
  const dedupe = new Set<string>();

  if (!$('html').attr('lang')) {
    addIssue(
      issues,
      {
        id: "missing-lang",
        severity: "serious",
        message: "Document language is missing.",
        recommendation: "Set a valid lang attribute on the html element, such as lang=\"en\".",
        selector: "html"
      },
      dedupe
    );
  }

  const headingLevels = $("h1, h2, h3, h4, h5, h6")
    .toArray()
    .map((element) => Number.parseInt(element.tagName.replace("h", ""), 10));

  for (let index = 1; index < headingLevels.length; index += 1) {
    const current = headingLevels[index];
    const previous = headingLevels[index - 1];

    if (current - previous > 1) {
      addIssue(
        issues,
        {
          id: "heading-order",
          severity: "moderate",
          message: "Heading levels skip hierarchy.",
          recommendation: "Do not jump from one heading level to another by more than one step.",
          selector: `h${current}`
        },
        dedupe
      );
    }
  }

  $("img").each((_, element) => {
    const alt = $(element).attr("alt");

    if (typeof alt !== "string") {
      addIssue(
        issues,
        {
          id: "img-alt",
          severity: "serious",
          message: "Image is missing alternative text.",
          recommendation:
            "Add meaningful alt text, or alt=\"\" for decorative images that should be ignored.",
          selector: "img"
        },
        dedupe
      );
    }
  });

  $("button, [role='button']").each((_, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    const ariaLabel = ($(element).attr("aria-label") ?? "").trim();
    const ariaLabelledBy = ($(element).attr("aria-labelledby") ?? "").trim();

    if (!text && !ariaLabel && !ariaLabelledBy) {
      addIssue(
        issues,
        {
          id: "button-name",
          severity: "critical",
          message: "Button has no accessible name.",
          recommendation:
            "Provide visible text, aria-label, or aria-labelledby so screen readers can announce the button purpose.",
          selector: element.tagName
        },
        dedupe
      );
    }
  });

  $("input:not([type='hidden']), textarea, select").each((_, element) => {
    const id = $(element).attr("id");
    const wrappedByLabel = $(element).closest("label").length > 0;
    const forLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    const ariaLabel = ($(element).attr("aria-label") ?? "").trim();
    const ariaLabelledBy = ($(element).attr("aria-labelledby") ?? "").trim();

    if (!wrappedByLabel && !forLabel && !ariaLabel && !ariaLabelledBy) {
      addIssue(
        issues,
        {
          id: "form-label",
          severity: "critical",
          message: "Form control is missing an accessible label.",
          recommendation:
            "Associate a label element or use aria-label / aria-labelledby to describe the control.",
          selector: element.tagName
        },
        dedupe
      );
    }
  });

  $("a[href]").each((_, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    const ariaLabel = ($(element).attr("aria-label") ?? "").trim();

    if (!text && !ariaLabel) {
      addIssue(
        issues,
        {
          id: "link-name",
          severity: "serious",
          message: "Link has no accessible text.",
          recommendation: "Add descriptive link text or aria-label so destination is announced clearly.",
          selector: "a"
        },
        dedupe
      );
    }
  });

  $("[role]").each((_, element) => {
    const role = ($(element).attr("role") ?? "").trim();

    if (role && !validRoles.has(role)) {
      addIssue(
        issues,
        {
          id: "aria-role",
          severity: "serious",
          message: `Invalid ARIA role "${role}" detected.`,
          recommendation:
            "Use a valid ARIA role from the specification or remove the role and rely on semantic HTML.",
          selector: `[role=\"${role}\"]`
        },
        dedupe
      );
    }
  });

  const axeIssues = await runAxe(html);

  for (const issue of axeIssues) {
    addIssue(issues, issue, dedupe);
  }

  const severityPenalty = {
    critical: 12,
    serious: 8,
    moderate: 5,
    minor: 2
  } as const;

  const penalty = issues.reduce((total, issue) => total + severityPenalty[issue.severity], 0);
  const score = Math.max(0, 100 - penalty);

  return {
    score,
    issues
  };
}
