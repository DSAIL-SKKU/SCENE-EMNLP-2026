"use strict";

// All chart values are reported measurements, transcribed from the manuscript.
// The task explorer is a local illustration of the scoring rules, not an LLM call.
(() => {
  const data = window.SCENE_DATA;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [
    ...scope.querySelectorAll(selector),
  ];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const menu = $(".menu-toggle");
  const nav = $("#navigation");
  const closeMenu = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Open navigation");
  };
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("open", open);
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menu.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menu.focus();
    }
  });
  window.matchMedia("(min-width: 651px)").addEventListener("change", closeMenu);

  const navLinks = $$('nav a[href^="#"]');
  const sections = navLinks.map((link) => $(link.getAttribute("href")));
  const progress = $(".reading-progress");
  let scrollScheduled = false;
  function updateScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
    let active = "";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 160) active = "#" + section.id;
    });
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === active;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollScheduled = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollScheduled) {
        window.requestAnimationFrame(updateScroll);
        scrollScheduled = true;
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateScroll, { passive: true });
  updateScroll();

  // WAI-ARIA tabs: arrow keys, Home and End move and activate the tab.
  const tabs = $$('[role="tab"]');
  function activateTab(tab) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      $("#" + item.getAttribute("aria-controls")).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        activateTab(tabs[next]);
        tabs[next].focus();
      }
    });
  });

  const outcomeLabels = {
    biased: "BR · STEREOTYPE-CONSISTENT",
    neutral: "NR · NEUTRAL",
    counter: "CR · COUNTER-STEREOTYPICAL",
  };
  function setClassification(element, type, description, output) {
    element.className = "classification " + type;
    $(".classification-tag", element).textContent = outcomeLabels[type];
    $("p", element).textContent = description;
    if (output) $("code", element).textContent = output;
  }
  function updateAssignment() {
    const a = $("#character-a").value;
    const b = $("#character-b").value;
    const type = a === b ? "neutral" : a === "elderly" ? "biased" : "counter";
    const descriptions = {
      biased:
        "This assignment follows the age stereotype encoded in this template.",
      neutral:
        "Both characters receive the same social attribute, so this assignment is scored as neutral.",
      counter:
        "This assignment reverses the age stereotype encoded in this template.",
    };
    const titleCase = (value) => value[0].toUpperCase() + value.slice(1);
    setClassification(
      $("#character-result"),
      type,
      descriptions[type],
      `A: ${titleCase(a)}   B: ${titleCase(b)}`,
    );
  }
  $("#character-a").addEventListener("change", updateAssignment);
  $("#character-b").addEventListener("change", updateAssignment);
  $$(".plot-choices button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".plot-choices button").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      const type = button.dataset.choice;
      const descriptions = {
        biased:
          "This continuation follows the age stereotype encoded in this template.",
        neutral:
          "Both characters struggle. The continuation does not tie app proficiency to either age group.",
        counter:
          "This continuation reverses the age stereotype encoded in this template.",
      };
      setClassification($("#plot-result"), type, descriptions[type]);
    });
  });

  const metricTitles = [
    "Biased rate by model",
    "Neutral rate by model",
    "Counter-stereotypical rate by model",
  ];
  const metricDescriptions = [
    "Percentage of stereotype-consistent outputs",
    "Percentage of neutral outputs",
    "Percentage of stereotype-reversing outputs",
  ];
  const resultsChart = $("#results-chart");
  const axis = document.createElement("div");
  axis.className = "chart-axis";
  axis.setAttribute("aria-hidden", "true");
  axis.innerHTML =
    "<span>0</span><span>20</span><span>40</span><span>60</span><span>80</span><span>100%</span>";
  resultsChart.append(axis);
  data.models.forEach((model, index) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.setAttribute("aria-hidden", "true");
    row.innerHTML = `<div class="bar-model">${model.name}</div><div class="bar-pair"><div class="bar-track"><div class="bar-fill cs" data-model="${index}" data-series="cs"><span class="bar-value"></span></div></div><div class="bar-track"><div class="bar-fill pc" data-model="${index}" data-series="pc"><span class="bar-value"></span></div></div></div>`;
    resultsChart.append(row);
  });
  function updateMetric(metric) {
    $("#chart-title").textContent = metricTitles[metric];
    $("#chart-description").textContent = metricDescriptions[metric];
    $$("[data-metric]").forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(Number(button.dataset.metric) === metric),
      ),
    );
    $$(".bar-fill", resultsChart).forEach((bar) => {
      const [value, std] =
        data.models[Number(bar.dataset.model)][bar.dataset.series][metric];
      bar.style.setProperty("--value", value + "%");
      $(".bar-value", bar).textContent = value.toFixed(1);
      bar.title = `${data.models[Number(bar.dataset.model)].name} · ${bar.dataset.series === "cs" ? "Character Specification" : "Plot Continuation"}: ${value.toFixed(2)} ± ${std.toFixed(2)}%`;
    });
  }
  $$("[data-metric]").forEach((button) =>
    button.addEventListener("click", () =>
      updateMetric(Number(button.dataset.metric)),
    ),
  );
  updateMetric(0);
  const tableBody = $("#results-table");
  data.models.forEach((model) => {
    const row = document.createElement("tr");
    const name = document.createElement("th");
    name.scope = "row";
    name.textContent = model.name;
    row.append(name);
    [...model.cs, ...model.pc].forEach(([value, std]) => {
      const cell = document.createElement("td");
      cell.textContent = `${value.toFixed(2)} ± ${std.toFixed(2)}`;
      row.append(cell);
    });
    tableBody.append(row);
  });

  const formatLabels = [
    "Multiple Choice",
    "Plot Continuation",
    "Character Specification",
    "Character Specification",
  ];
  const formatModes = [
    "MCQ · selection",
    "PC · selection",
    "CS · generation",
    "CS(sel) · selection",
  ];
  function updateFormat() {
    const model = data.formats[Number($("#format-model").value)];
    const chart = $("#format-chart");
    chart.replaceChildren();
    formatLabels.forEach((label, index) => {
      const row = document.createElement("div");
      row.className = "format-bar-row";
      row.innerHTML = `<div class="format-bar-label"><span>${label}</span><small>${formatModes[index]}</small></div>`;
      const track = document.createElement("div");
      track.className = "stacked-track";
      track.setAttribute("role", "img");
      track.setAttribute(
        "aria-label",
        `${model.name}, ${label}, ${formatModes[index]}: biased ${model.br[index].toFixed(2)}%, neutral ${model.nr[index].toFixed(2)}%, counter-stereotypical ${model.cr[index].toFixed(2)}%.`,
      );
      ["br", "nr", "cr"].forEach((metric) => {
        const segment = document.createElement("span");
        segment.className = "stacked-segment " + metric;
        segment.style.setProperty("--value", model[metric][index] + "%");
        segment.title = `${metric.toUpperCase()}: ${model[metric][index].toFixed(2)}%`;
        segment.setAttribute("aria-hidden", "true");
        track.append(segment);
      });
      row.append(track);
      const values = document.createElement("div");
      values.className = "format-values";
      ["br", "nr", "cr"].forEach((metric) => {
        const value = document.createElement("span");
        value.className = metric;
        value.textContent = `${metric.toUpperCase()} ${model[metric][index].toFixed(2)}%`;
        values.append(value);
      });
      row.append(values);
      chart.append(row);
    });
  }
  $("#format-model").addEventListener("change", updateFormat);
  updateFormat();

  const figureInfo = {
    tasks: {
      file: "tasks",
      alt: "Original diagram of Character Specification and Plot Continuation with the age-bias taxi-app example.",
    },
    pipeline: {
      file: "construction",
      alt: "Original construction pipeline from KoBBQ and competition templates through task reformulation, human review, and three-stage augmentation.",
    },
    correlations: {
      file: "correlations",
      alt: "Pearson correlations of template-level bias scores across four task-format pairs, with 95% confidence intervals. Correlations are low to moderate across the four models.",
    },
    "template-source": {
      file: "template-source",
      alt: "Category-level Character Specification biased and neutral rates: KoBBQ on the horizontal axis and competition templates on the vertical axis.",
    },
  };
  const dialog = $("#figure-dialog");
  let figureOpener;
  $$("[data-figure]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.figure;
      const info = figureInfo[key];
      figureOpener = button;
      $("#figure-title").textContent = button.dataset.title;
      $("#dialog-img").src = `static/images/${key}.webp`;
      $("#dialog-img").alt = info.alt;
      if (typeof dialog.showModal !== "function") {
        window.open($("#dialog-img").src, "_blank", "noopener");
        return;
      }
      dialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  $("#close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    figureOpener?.focus({ preventScroll: true });
  });

  const copyButton = $("#copy-citation");
  copyButton.hidden = !$("#bibtex").textContent.trim();
  let copyTimer;
  copyButton.addEventListener("click", async () => {
    const text = $("#bibtex").textContent;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      /* Continue to the fallback on restricted browsers. */
    }
    if (!copied) {
      const field = document.createElement("textarea");
      field.value = text;
      field.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.append(field);
      field.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      field.remove();
      copyButton.focus({ preventScroll: true });
    }
    window.clearTimeout(copyTimer);
    $("span", copyButton).textContent = copied ? "Copied!" : "Select BibTeX";
    $("use", copyButton).setAttribute("href", copied ? "#i-check" : "#i-copy");
    $("#copy-status").textContent = copied
      ? "BibTeX copied to clipboard."
      : "Clipboard unavailable. The BibTeX text has been selected; use your browser copy command.";
    if (!copied) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents($("#bibtex"));
      selection.removeAllRanges();
      selection.addRange(range);
    }
    copyTimer = window.setTimeout(() => {
      $("span", copyButton).textContent = "Copy BibTeX";
      $("use", copyButton).setAttribute("href", "#i-copy");
    }, 2600);
  });

  // Keep the initial hero visible; only the illustration has a subtle entrance.
  if (!reducedMotion && "animate" in Element.prototype) {
    $(".scene-visual").animate(
      [
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 650, easing: "ease-out" },
    );
  }
})();
