// Render README.md from tools/readme-content.mjs and data/references.json.
//
//   node tools/render-readme.mjs            write README.md
//   node tools/render-readme.mjs --check    fail if README.md is out of date
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  ABOUT,
  CHAINSWE,
  CLOSING,
  CONTRIBUTIONS,
  FIGURES,
  FIGURE_FILE,
  FINDINGS,
  GUIDANCE,
  MEASURES,
  OUTLINE,
  PROBLEMS,
  QUESTIONS,
  REPO_URL,
  SITE_URL,
  SURVEY,
  TEASER_ALT,
  WEBSITE_REPO_URL,
  surveyBibtex,
} from "./readme-content.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = "data/references.json";

const COLORS = { conference: "356887", journal: "176b69", preprint: "a74743", book: "9a682d", other: "596367" };
const LABELS = { conference: "Conference", journal: "Journal", preprint: "Preprint", book: "Book", other: "Other" };
// Short labels for the venues that recur in the bibliography
const VENUES = [
  [/Neural Information Processing Systems|\bNeurIPS\b/i, "NeurIPS"],
  [/International Conference on Machine Learning|\bICML\b/i, "ICML"],
  [/International Conference on Learning Representations|\bICLR\b/i, "ICLR"],
  [/Findings of the Association for Computational Linguistics: (\w+)/i, (m) => `Findings of ${m[1]}`],
  [/Association for Computational Linguistics|\bACL\b/i, "ACL"],
  [/Empirical Methods in Natural Language Processing|\bEMNLP\b/i, "EMNLP"],
  [/International Conference on Computational Linguistics/i, "COLING"],
  [/Software Engineering in Practice/i, "ICSE SEIP"],
  [/International Conference on Software Engineering|\bICSE\b/i, "ICSE"],
  [/Foundations of Software Engineering|\bFSE\b|ACM on Software Engineering/i, "FSE"],
  [/Automated Software Engineering|\bASE\b/i, "ASE"],
  [/Software Testing and Analysis|\bISSTA\b/i, "ISSTA"],
  [/Mining Software Repositories/i, "MSR"],
  [/Transactions on Software Engineering/i, "IEEE TSE"],
  [/ACM on Programming Languages/i, "PACMPL"],
  [/USENIX Security/i, "USENIX Security"],
  [/\bNDSS\b|Distributed System Security/i, "NDSS"],
  [/Web Conference/i, "WWW"],
  [/Artificial Intelligence and Statistics/i, "AISTATS"],
  [/Fairness, Accountability, and Transparency/i, "FAccT"],
  [/CHI Conference/i, "CHI"],
  [/Requirements Engineering/i, "RE"],
  [/arXiv|\bCoRR\b/i, "arXiv"],
];
// Section icons (assets/readme/icons, drawn by tools/draw-readme-art.mjs)
const ICON = {
  "About the survey": "about",
  "Research questions": "questions",
  "Repository guide": "guide",
  "From tasks to projects": "projects",
  "Tasks and benchmarks": "benchmarks",
  "Harness and training": "harness",
  Evaluation: "evaluation",
  "Open problems": "problems",
  References: "references",
  Contributing: "contribute",
  Contributors: "contributors",
  "Star history": "star",
  Citation: "cite",
  "Repository layout": "layout",
};
// Section cards (assets/readme/card-*.svg): [file key, section linked to, alt text]
const CARDS = [
  ["about", "About the survey", "Overview: from tasks to projects"],
  ["questions", "Research questions", "Research questions: what must persist?"],
  ["benchmarks", "Tasks and benchmarks", "Tasks and benchmarks: two axes for protocols"],
  ["harness", "Harness and training", "Harness and training: what each mechanism keeps"],
  ["evaluation", "Evaluation", "Evaluation: retention and conformance"],
  ["problems", "Open problems", "Open problems: toward selective revision"],
];

export function venueLabel(reference) {
  const venue = reference.venue || LABELS[reference.type] || "Other";
  for (const [pattern, label] of VENUES) {
    const match = venue.match(pattern);
    if (match) return typeof label === "function" ? label(match) : /workshop/i.test(venue) ? `${label} Workshop` : label;
  }
  return venue;
}

function html(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function markdown(value) {
  return String(value)
    .replace(/([\\`*_{}\[\]<>|])/g, "\\$1")
    .replace(/\s+/g, " ")
    .trim();
}

function badge(message, color, alt = message) {
  const query = new URLSearchParams({ label: "", message, color, style: "flat-square" });
  return `<img src="https://img.shields.io/static/v1?${html(query.toString())}" alt="${html(alt)}" height="18">`;
}

// An image that follows the reader's GitHub theme: `${stem}-dark.svg` / `${stem}-light.svg`, on one line.
function themed(stem, attributes) {
  return (
    `<picture><source media="(prefers-color-scheme: dark)" srcset="${stem}-dark.svg">` +
    `<source media="(prefers-color-scheme: light)" srcset="${stem}-light.svg"><img src="${stem}-light.svg" ${attributes}></picture>`
  );
}

// GitHub's heading anchor for the plain-text headings used here
function anchor(heading) {
  return heading.toLowerCase().replace(/[^a-z0-9 -]/g, "").replaceAll(" ", "-");
}

function figure(number, width = 900) {
  const [title, caption] = FIGURES[number];
  return [
    `<p align="center"><img src="${FIGURE_FILE(number)}" width="${width}" alt="Figure ${number}. ${html(title)}${caption ? ` ${html(caption)}` : ""}"></p>`,
    `<p align="center"><sub><b>Figure ${number}. ${html(title)}</b>${caption ? ` ${html(caption)}` : ""}</sub></p>`,
    "",
  ];
}

export function renderReadme(references) {
  const sorted = [...references].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "en") || a.id.localeCompare(b.id, "en"),
  );
  const years = [...new Set(sorted.map((reference) => reference.year))];
  const counts = Object.fromEntries(Object.keys(LABELS).map((type) => [type, references.filter((r) => r.type === type).length]));
  const slug = REPO_URL.replace("https://github.com/", "");
  const lines = [];
  const add = (...items) => lines.push(...items);
  let backLinks = false; // once the main sections start, each one is preceded by a link back to the guide
  const heading = (title) => {
    if (backLinks) add('<p align="right"><sub><a href="#repository-guide">↑ Back to guide</a></sub></p>', "");
    add(themed(`assets/readme/icons/${ICON[title]}`, 'alt="" width="36" align="left"'), "", `## ${title}`, "");
  };

  add(
    "<!-- Generated by tools/render-readme.mjs. Edit the renderer, tools/readme-content.mjs or data/references.json. -->",
    '<div align="center">',
    `  <a href="${SITE_URL}"><img src="assets/readme-banner.png" width="1200" alt="${html(`${SURVEY.title}: ${SURVEY.subtitle}. ${TEASER_ALT}`)}"></a>`,
    "",
    "  <p><strong><em>⭐ Star us if you find this useful!</em></strong></p>",
    "",
    `  <a href="${SITE_URL}">${badge("Project website", "176b69")}</a>`,
    `  <a href="#references">${badge(`${references.length} references`, "356887")}</a>`,
    '  <a href="https://awesome.re"><img src="https://awesome.re/badge-flat2.svg" alt="Awesome" height="18"></a>',
    "",
    "  <p>" +
      SURVEY.authors
        .map(([name, affiliations, mark]) => `${html(name).replaceAll(" ", "&nbsp;")}<sup>${affiliations.join(",")}${mark ?? ""}</sup>`)
        .join(" · ") +
      "</p>",
    `  <p><sub>${SURVEY.affiliations.map((name, i) => `<sup>${i + 1}</sup>&nbsp;${html(name).replaceAll(" ", "&nbsp;")}`).join(" &nbsp;·&nbsp; ")}</sub></p>`,
    `  <p><sub>* Equal contribution &nbsp;·&nbsp; † Corresponding author &nbsp;·&nbsp; ${SURVEY.contact.map((email) => `<a href="mailto:${email}">${email}</a>`).join(", ")}</sub></p>`,
    "</div>",
    "",
  );

  heading("About the survey");
  for (const paragraph of ABOUT) add(paragraph, "");
  add("> [!IMPORTANT]", "> **What the survey finds.**", ">");
  for (const [lead, text] of FINDINGS) add(`> - **${lead}** ${text}`);
  add("");
  add(...figure(1));

  heading("Research questions");
  add("| | Question | What it asks |", "| :-: | --- | --- |");
  for (const [id, question, detail] of QUESTIONS) add(`| **${id}** | **${question}** | ${detail} |`);
  add("", "The survey makes three contributions:", "");
  CONTRIBUTIONS.forEach(([lead, text], i) => add(`${i + 1}. **${lead}** ${text}`));
  add("");
  add(...figure(2));
  add("<details>", "<summary><b>Survey outline</b></summary>", "", "| § | Chapter | Covers |", "| :-: | --- | --- |");
  for (const [number, chapter, covers] of OUTLINE) add(`| ${number} | **${chapter}** | ${covers} |`);
  add("", "</details>", "");

  // The guide: the six section cards, then one centered line for the remaining sections and the repository links.
  const more = ["From tasks to projects", "References", "Contributing", "Contributors", "Citation", "Star history", "Repository layout"];
  heading("Repository guide");
  add('<p align="center">');
  for (const [i, [key, title, alt]] of CARDS.entries()) {
    if (i === 3) add("  <br>");
    add(`  <a href="#${anchor(title)}">${themed(`assets/readme/card-${key}`, `width="246" alt="${html(alt)}"`)}</a>`);
  }
  add(
    "</p>",
    "",
    `<p align="center">${more.map((title) => `<a href="#${anchor(title)}">${html(title)}</a>`).join(" &nbsp;·&nbsp; ")}</p>`,
    "",
    `<p align="center"><sub>Survey resources: <a href="${REPO_URL}">Awesome-LongHorizonSWE</a> &nbsp;·&nbsp; Website: <a href="${WEBSITE_REPO_URL}">longhorizonswe.github.io</a></sub></p>`,
    "",
    "---",
    "",
  );

  heading("From tasks to projects");
  backLinks = true;
  add(
    "Benchmarks moved from reproducible faults to repository issues and, recently, to continuing projects. What separates software engineering from long-horizon agent work in general is that the agent's code persists as the starting state of later requests, and the behavior it was accepted for can be checked again.",
    "",
  );
  add(...figure(5));
  add(...figure(3));
  add(...figure(4));

  heading("Tasks and benchmarks");
  add(
    "Two axes organize the comparison of benchmark protocols: **who produces the state that the next request starts from** (the agent itself, through its earlier changes, or a benchmark that prepares each snapshot or updates it with reference implementations), and **what is checked** (only the tests of the current request, or also the behavior that was accepted earlier).",
    "",
  );
  add(...figure(8));
  add("> [!NOTE]", `> **Building on its own work costs accuracy.** ${CHAINSWE}`, "");
  add(...figure(6));
  add(...figure(7, 760));

  heading("Harness and training");
  add(
    "Each mechanism acts on a different consequence of earlier work: context and memory carry information that a later change can make obsolete, planning and coordination track dependencies that stay active across changes, execution and verification reveal when earlier work has become invalid, and learning prepares agents to recover from states shaped by prior decisions.",
    "",
  );
  add(...figure(10));
  add(...figure(9));
  add(...figure(11));
  add(
    "**Design priorities and evaluation targets by work condition.** Choose the mechanism that addresses the observed failure, and evaluate it at the boundary where the failure arises.",
    "",
    "| Work condition | Design priority | What to measure |",
    "| --- | --- | --- |",
  );
  for (const [condition, priority, measure] of GUIDANCE) add(`| **${condition}** | ${priority} | ${measure} |`);
  add("");

  heading("Evaluation");
  add(
    "Regression, fail-stop termination, voluntary stopping, and unsuccessful submission have different denominators and meanings, and should not be combined into one generic failure rate. The survey proposes two measures, both defined over an obligation record that the evaluator holds:",
    "",
    "| Measure | Question | Definition |",
    "| --- | --- | --- |",
  );
  for (const [name, symbol, question, definition] of MEASURES) add(`| **${name}** (<i>${symbol[0]}</i><sub>${symbol.slice(2)}</sub>) | ${question} | ${definition} |`);
  add("");
  add(...figure(12));

  heading("Open problems");
  add(
    "The problems that no current method or benchmark solves, with what is known about each and a first experiment that could address it. Most of them return to **selective revision**: keeping useful code and knowledge while correcting what later changes invalidate.",
    "",
  );
  add(...figure(13));
  add("| Open problem | What is known | First experiment |", "| --- | --- | --- |");
  for (const [group, rows] of PROBLEMS) {
    add(`| **${group}** | | |`);
    for (const [problem, known, experiment] of rows) add(`| ${problem} | ${known} | ${experiment} |`);
  }
  add("", `> *${CLOSING}*`, "");

  heading("References");
  add(
    `${references.length} bibliographic records cited by the survey, ordered from newest to oldest. Badges give the venue or record type. Inclusion does not imply that a work evaluates continuing projects.`,
    "",
    `| ${Object.values(LABELS).join(" | ")} |`,
    `| ${Object.keys(LABELS).map(() => "---:").join(" | ")} |`,
    `| ${Object.keys(LABELS).map((type) => counts[type]).join(" | ")} |`,
    "",
    Object.entries(LABELS).map(([type, label]) => badge(label, COLORS[type])).join(" "),
    "",
    years.map((year) => `[${year ?? "Year unavailable"}](#year-${year ?? "unavailable"})`).join(" | "),
    "",
  );
  for (const year of years) {
    const records = sorted.filter((item) => item.year === year);
    const collapsed = year !== years[0];
    add(`<a id="year-${year ?? "unavailable"}"></a>`, "");
    if (collapsed)
      add("<details>", `<summary><strong>${year ?? "Year unavailable"}</strong> &middot; ${records.length} references</summary>`, "");
    else add(`### ${year ?? "Year unavailable"}`, "");
    for (const reference of records) {
      const link = reference.url ? ` [[paper](<${reference.url}>)]` : "";
      const title = markdown(reference.title);
      add(`- ${title}${/[.!?]$/.test(title) ? "" : "."}${link} ${badge(venueLabel(reference), COLORS[reference.type], reference.venue || LABELS[reference.type])}`);
    }
    add("");
    if (collapsed) add("</details>", "");
  }

  heading("Contributing");
  add(
    `Found incorrect metadata, a broken link, or a missing work on continuing projects? [Open an issue](${REPO_URL}/issues/new) or a pull request.`,
    "",
  );
  heading("Contributors");
  add(
    "Thanks to everyone who has improved the project.",
    "",
    `<a href="${REPO_URL}/graphs/contributors"><img src="https://contrib.rocks/image?repo=${slug}" alt="Contributors to ${slug}"></a>`,
    "",
  );
  heading("Star history");
  const chart = `https://api.star-history.com/svg?repos=${slug}&type=Date`;
  add(
    '<p align="center">',
    `  <a href="https://star-history.com/#${slug}&Date">`,
    "    <picture>",
    `      <source media="(prefers-color-scheme: dark)" srcset="${chart}&theme=dark">`,
    `      <source media="(prefers-color-scheme: light)" srcset="${chart}">`,
    `      <img alt="Star history of ${slug}" src="${chart}" width="800">`,
    "    </picture>",
    "  </a>",
    "</p>",
    "",
  );
  heading("Citation");
  add("If you find the survey or the reference list useful, please cite:", "", "```bibtex", surveyBibtex(), "```", "");
  heading("Repository layout");
  add(
    "| Path | Purpose |",
    "| --- | --- |",
    "| [`data/references.json`](data/references.json) | Bibliographic metadata of the works the survey cites |",
    "| [`assets/`](assets/) | Banner, section artwork, and survey figures |",
    "| [`tools/`](tools/) | README content and generation, artwork, and bibliography import |",
    "",
    "Edit `tools/readme-content.mjs` or the data, then run `node tools/render-readme.mjs`. The survey figures, illustrations, and summary text are © the authors and appear here with their approval.",
    "",
  );
  return lines.join("\n");
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const references = JSON.parse(await readFile(path.join(ROOT, DATA_FILE), "utf8"));
  const output = renderReadme(references);
  if (process.argv.includes("--check")) {
    const current = await readFile(path.join(ROOT, "README.md"), "utf8");
    if (current !== output) throw new Error("README is out of date. Run node tools/render-readme.mjs.");
    console.log(`README is synchronized with ${references.length} references.`);
  } else {
    await writeFile(path.join(ROOT, "README.md"), output);
    console.log(`README generated from ${references.length} references.`);
  }
}
