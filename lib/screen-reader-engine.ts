import { JSDOM } from "jsdom";
import type { ScreenReaderSimulation } from "@/lib/accessibility-analyzer";

function getElementText(element: Element) {
  return (element.textContent ?? "").replace(/\s+/g, " ").trim();
}

function isHidden(element: Element | null): boolean {
  let current: Element | null = element;

  while (current) {
    if (current.hasAttribute("hidden")) return true;
    if (current.getAttribute("aria-hidden") === "true") return true;

    const style = current.getAttribute("style") ?? "";

    if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

function resolveLabel(element: Element, document: Document) {
  const ariaLabel = element.getAttribute("aria-label")?.trim();

  if (ariaLabel) return ariaLabel;

  const labelledBy = element.getAttribute("aria-labelledby")?.trim();

  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const text = ids
      .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
      .join(" ")
      .trim();

    if (text) return text;
  }

  if (element.tagName.toLowerCase() === "img") {
    const alt = element.getAttribute("alt")?.trim();
    if (alt) return alt;
  }

  const id = element.getAttribute("id");

  if (id) {
    const labelByFor = document.querySelector(`label[for="${id}"]`);

    if (labelByFor) {
      const text = getElementText(labelByFor);
      if (text) return text;
    }
  }

  const wrappingLabel = element.closest("label");

  if (wrappingLabel) {
    const text = getElementText(wrappingLabel);
    if (text) return text;
  }

  if (element.tagName.toLowerCase() === "input") {
    const placeholder = element.getAttribute("placeholder")?.trim();
    if (placeholder) return placeholder;
  }

  const text = getElementText(element);
  if (text) return text;

  return "Unlabeled element";
}

export async function simulateScreenReader(html: string): Promise<ScreenReaderSimulation> {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const announcements: string[] = [];

  const title = document.querySelector("title")?.textContent?.trim();

  if (title) {
    announcements.push(`Page title, ${title}`);
  }

  const lang = document.documentElement.getAttribute("lang");

  if (lang) {
    announcements.push(`Language, ${lang}`);
  }

  const elements = Array.from(document.body.querySelectorAll("*"));

  for (const element of elements) {
    if (isHidden(element)) {
      continue;
    }

    const tag = element.tagName.toLowerCase();

    if (/^h[1-6]$/.test(tag)) {
      const level = tag.replace("h", "");
      const text = resolveLabel(element, document);
      announcements.push(`Heading level ${level}, ${text}`);
      continue;
    }

    if (tag === "main") {
      announcements.push("Main landmark");
      continue;
    }

    if (tag === "nav") {
      announcements.push("Navigation landmark");
      continue;
    }

    if (tag === "header") {
      announcements.push("Banner landmark");
      continue;
    }

    if (tag === "footer") {
      announcements.push("Contentinfo landmark");
      continue;
    }

    if (tag === "a" && element.getAttribute("href")) {
      announcements.push(`Link, ${resolveLabel(element, document)}`);
      continue;
    }

    if (tag === "button" || element.getAttribute("role") === "button") {
      announcements.push(`Button, ${resolveLabel(element, document)}`);
      continue;
    }

    if (tag === "img") {
      const alt = element.getAttribute("alt")?.trim();
      if (alt) {
        announcements.push(`Image, ${alt}`);
      } else {
        announcements.push("Image, missing alt text");
      }
      continue;
    }

    if (["input", "textarea", "select"].includes(tag)) {
      const inputType = tag === "input" ? element.getAttribute("type") ?? "text" : tag;
      const required = element.hasAttribute("required") ? ", required" : "";
      announcements.push(`Form field, ${resolveLabel(element, document)}, ${inputType}${required}`);
      continue;
    }

    if (tag === "li") {
      const text = getElementText(element);
      if (text) {
        announcements.push(`List item, ${text}`);
      }
      continue;
    }

    if (element.getAttribute("role") === "alert") {
      const alertText = getElementText(element);
      if (alertText) {
        announcements.push(`Alert, ${alertText}`);
      }
    }
  }

  if (announcements.length === 0) {
    announcements.push(
      "No announceable content found. Check if your HTML snapshot includes semantic elements and visible text."
    );
  }

  dom.window.close();

  return {
    announcements
  };
}
