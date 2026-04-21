(() => {
  const PANEL_ID = "adh-screen-reader-panel";
  let enabled = true;
  let panel = null;
  let observer = null;
  let timer = null;

  function getNodeText(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function isHidden(element) {
    let current = element;

    while (current && current instanceof Element) {
      if (current.hasAttribute("hidden")) return true;
      if (current.getAttribute("aria-hidden") === "true") return true;
      const style = current.getAttribute("style") || "";
      if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) return true;
      current = current.parentElement;
    }

    return false;
  }

  function labelFor(el) {
    const ariaLabel = (el.getAttribute("aria-label") || "").trim();
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = (el.getAttribute("aria-labelledby") || "").trim();
    if (ariaLabelledBy) {
      const text = ariaLabelledBy
        .split(/\s+/)
        .map((id) => {
          const ref = document.getElementById(id);
          return ref ? getNodeText(ref) : "";
        })
        .join(" ")
        .trim();
      if (text) return text;
    }

    const id = el.getAttribute("id");
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        const text = getNodeText(label);
        if (text) return text;
      }
    }

    const wrappingLabel = el.closest("label");
    if (wrappingLabel) {
      const text = getNodeText(wrappingLabel);
      if (text) return text;
    }

    if (el.tagName.toLowerCase() === "img") {
      const alt = (el.getAttribute("alt") || "").trim();
      if (alt) return alt;
    }

    const text = getNodeText(el);
    if (text) return text;

    return "Unlabeled element";
  }

  function buildSimulationLines() {
    const lines = [];

    if (document.title) {
      lines.push(`Page title, ${document.title}`);
    }

    const all = Array.from(document.body.querySelectorAll("*"));

    for (const el of all) {
      if (!(el instanceof Element) || isHidden(el)) continue;

      const tag = el.tagName.toLowerCase();

      if (/^h[1-6]$/.test(tag)) {
        lines.push(`Heading level ${tag.slice(1)}, ${labelFor(el)}`);
        continue;
      }

      if (tag === "a" && el.getAttribute("href")) {
        lines.push(`Link, ${labelFor(el)}`);
        continue;
      }

      if (tag === "button" || el.getAttribute("role") === "button") {
        lines.push(`Button, ${labelFor(el)}`);
        continue;
      }

      if (["input", "textarea", "select"].includes(tag)) {
        const type = tag === "input" ? el.getAttribute("type") || "text" : tag;
        lines.push(`Form field, ${labelFor(el)}, ${type}`);
        continue;
      }

      if (tag === "img") {
        const alt = (el.getAttribute("alt") || "").trim();
        lines.push(alt ? `Image, ${alt}` : "Image, missing alt text");
      }
    }

    if (lines.length === 0) {
      lines.push("No announceable content was detected on this page.");
    }

    return lines.slice(0, 120);
  }

  function ensurePanel() {
    if (panel) return panel;

    panel = document.createElement("aside");
    panel.id = PANEL_ID;
    panel.style.position = "fixed";
    panel.style.right = "16px";
    panel.style.bottom = "16px";
    panel.style.width = "360px";
    panel.style.maxHeight = "50vh";
    panel.style.zIndex = "2147483647";
    panel.style.background = "#020617";
    panel.style.color = "#e2e8f0";
    panel.style.border = "1px solid #334155";
    panel.style.borderRadius = "12px";
    panel.style.boxShadow = "0 12px 32px rgba(0,0,0,0.45)";
    panel.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    panel.style.fontSize = "12px";

    const header = document.createElement("div");
    header.textContent = "accessibility-dev-helper";
    header.style.padding = "10px 12px";
    header.style.borderBottom = "1px solid #334155";
    header.style.fontWeight = "700";
    header.style.letterSpacing = "0.05em";
    header.style.textTransform = "uppercase";

    const content = document.createElement("div");
    content.setAttribute("data-adh-content", "true");
    content.style.padding = "10px 12px";
    content.style.overflow = "auto";
    content.style.maxHeight = "calc(50vh - 42px)";

    panel.appendChild(header);
    panel.appendChild(content);
    document.documentElement.appendChild(panel);

    return panel;
  }

  function render() {
    if (!enabled) return;

    const host = ensurePanel();
    const content = host.querySelector("[data-adh-content]");
    if (!content) return;

    const lines = buildSimulationLines();
    content.innerHTML = lines
      .map((line) => `<p style="margin:0 0 6px 0; line-height:1.4;">&gt; ${line}</p>`)
      .join("");
  }

  function scheduleRender() {
    if (!enabled) return;
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(render, 450);
  }

  function startObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(scheduleRender);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  function stopObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function setEnabled(nextValue) {
    enabled = nextValue;

    if (!enabled) {
      stopObserver();
      if (panel) {
        panel.remove();
        panel = null;
      }
      return;
    }

    startObserver();
    render();
  }

  chrome.runtime.sendMessage({ type: "ADH_GET_STATE" }, () => {
    chrome.storage.local.get(["adhEnabled"], (data) => {
      setEnabled(!(data.adhEnabled === false));
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.type === "ADH_TOGGLE") {
      setEnabled(Boolean(message.enabled));
    }
  });
})();
