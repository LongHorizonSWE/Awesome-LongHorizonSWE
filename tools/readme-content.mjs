// Survey content shown in the README, taken from the manuscript with the authors' approval.
// Keep wording in step with the manuscript; tools/render-readme.mjs lays it out.

export const SITE_URL = "https://longhorizonswe.github.io/";
export const REPO_URL = "https://github.com/LongHorizonSWE/Awesome-LongHorizonSWE";
export const WEBSITE_REPO_URL = "https://github.com/LongHorizonSWE/longhorizonswe.github.io";

export const SURVEY = {
  title: "Long-Horizon Software Engineering Agents",
  subtitle: "From Tasks to Projects",
  year: 2026,
  // [name, affiliation numbers, marks] — "*" equal contribution, "†" corresponding author
  authors: [
    ["Meng Luo", [1], "*"],
    ["Yanlin Li", [1], "*"],
    ["Kaixin Li", [1]],
    ["Yuchen Tian", [2]],
    ["Shidong Cao", [2]],
    ["Yanyu Chen", [3]],
    ["Xiangru Jian", [4]],
    ["Yan Yang", [5]],
    ["Pengfei Zhou", [1]],
    ["Ziyang Luo", [2]],
    ["Hongzhan Lin", [1], "†"],
  ],
  affiliations: ["NUS", "HKBU", "CUHK", "UWaterloo", "ANU"],
  contact: ["mluo@u.nus.edu", "danielhzlin@nus.edu.sg"],
  bibtexKey: "luo2026longhorizonswe",
};

export const ABOUT = [
  "Software engineering agents can now navigate repositories, run tests, and resolve many real GitHub issues. Most evaluations, however, " +
    "score each issue in isolation and discard the agent's patch afterward, whereas real projects accumulate: today's changes constrain " +
    "tomorrow's work. This survey examines what changes when an agent must keep working on software it has already produced.",
  "We compare evaluation protocols on two axes: who produces the state that the next request starts from, and whether behavior accepted " +
    "earlier is checked again. Along these axes, we organize runtime mechanisms, training methods, and evaluation practice, propose measures " +
    "of retained functionality and of conformance to active requirements, and outline open problems that center on *selective revision*: " +
    "keeping useful code and knowledge while correcting what later changes invalidate.",
];

export const FINDINGS = [
  ["Building on its own work is harder.", "Controlled comparisons show that agents succeed markedly less often when they build on their own earlier work, and retaining the earlier conversation does not close this gap."],
  ["Length alone is not continuity.", "Only agent-produced chains that recheck earlier obligations can show whether an agent stays responsible for its own earlier work."],
  ["Training stays within one request.", "Runtime mechanisms act on state that outlives a request, yet almost all training in the reviewed work stays within a single request."],
  ["Evaluation lacks a common report.", "Benchmarks do not yet report cross-stage retention, recovery, and cost in a common form; retained functionality and conformance to active requirements can anchor one."],
];

export const FIGURES = {
  1: ["From tasks to projects.", "In continuing work, each request starts from the state that earlier work left; the agent works from the current requirements and brings its retained knowledge, and selective revision corrects what later changes invalidate. Signposts 1–3 are the requests of the illustrative API example used throughout."],
  2: ["Organization of the survey and representative works.", "Each group within a column lists representative works discussed in the corresponding subsection."],
  3: ["Three settings and what each can show.", "Each setting is defined by what the next unit starts from; Figure 8 places named protocols on both comparison axes."],
  4: ["Three events that look alike in a test report.", "In the pagination example of Figure 1, a failing check after a later change can mark a regression, a new requirement, or an older defect. The last row shows how each event counts toward the retention and conformance measures."],
  5: ["From program repair to continuing projects.", "Each marker gives the year in which representative work first appeared, as a preprint where one exists. Marker spacing is not proportional to time."],
  6: ["State boundaries in sequential evaluation.", "ChainSWE runs the same issues in three modes that differ in the code and the conversation each issue starts from; in Seq+Mem, the form of the retained dialogue depends on the context configuration (Figure 7)."],
  7: ["Per-issue resolution by mode and context configuration.", "GPT-5.5 results reported by ChainSWE on 304 issues in 100 chains under its SWE-Edit agent scaffold. Oracle installs earlier reference fixes; Seq inherits agent patches; Seq+Mem also retains dialogue. Baseline retains the full transcript; Summarize compacts older messages; Sub-Agent delegates file viewing and editing to separate contexts."],
  8: ["Representative protocols on the two comparison axes.", "Columns give who produces the state that the next request starts from, and rows give whether the tests that earlier stages of the same run passed are systematically rerun after later changes. Pass-to-pass tests fixed in advance for each issue, as in SWE-bench and ChainSWE, may cover some earlier behavior but are not such a rerun."],
  9: ["Evaluation scopes and how far mechanisms have been tested.", "Each runtime mechanism appears at the widest scope at which it has been evaluated, and each training method at the scope of the episodes it trains on. Most mechanisms have been tested only on bounded requests, which cannot show whether they help in a continuing project. The last row gives what remains open at each scope."],
  10: ["A runtime for continuing projects.", "The dashed link denotes knowledge supplied to analysis; failed checks reopen editing. Subscripts count closed engineering units. In many protocols a unit also closes after failed checks, and the next unit inherits that state."],
  11: ["From training data to learned behavior.", "The pipeline that most training results follow, with the limits that keep almost all of them within a single request."],
  12: ["Equal stage success can conceal different chain outcomes.", "Each row is a constructed five-stage chain, and every stage is attempted after earlier failures. A chain counts as successful only when all five stages pass."],
  13: ["Four ways continuing work can fail.", "The badge in each card gives the type of study that has examined each failure."],
};
// file of each figure under assets/figures (Figure 1 is an illustration, kept as WebP)
export const FIGURE_FILE = (number) => `assets/figures/figure-${number}.${number === 1 ? "webp" : "png"}`;

export const QUESTIONS = [
  ["RQ1", "What must persist for an agent to continue a software project?", "Which artifacts, requirements, and retained knowledge connect earlier decisions to later work, and which benchmark protocols preserve those connections?"],
  ["RQ2", "How do agents preserve useful progress while revising invalidated work?", "How do context, execution, planning, verification, and learning interact, and under what conditions do memory, coordination, or feedback help?"],
  ["RQ3", "How can reliable progress across changes be measured?", "How can evaluation separate local success from retained functionality, conformance to active requirements, successful recovery, operational cost, and handoff quality?"],
];

export const CONTRIBUTIONS = [
  ["A vocabulary for continuing projects", "and a comparison of benchmark protocols built on it. Length alone does not make a benchmark a test of continuing work."],
  ["A mapping from runtime and training mechanisms", "to the persistent state they manage. Recovering knowledge and repairing inherited code turn out to be separate problems."],
  ["A reporting framework", "that separates retained behavior from new progress, with rates for retained functionality and for conformance to active requirements."],
];

export const OUTLINE = [
  ["1", "Introduction", "Motivation and scope · Research questions · Related surveys and contributions"],
  ["2", "Background and Definitions", "Software engineering agents · Task length and dependencies · Project state and task formulation · From program repair to continuing projects"],
  ["3", "Tasks and Benchmarks", "Repository issue resolution · Feature and project development · Operations and security · Software maintenance and evolution · Interaction and external change · Benchmark comparison and selection"],
  ["4", "Harness Design", "Execution and environment management · Context and memory management · Planning and multi-agent coordination · Verification and failure recovery · Security and access control"],
  ["5", "Training and Adaptation", "Training tasks and environments · Trajectory generation and curation · Supervised fine-tuning and distillation · Preference optimization and RL · Memory and skill learning"],
  ["6", "Evaluation", "Task and evaluator validity · Reliability across repeated runs · Retention and conformance · Trajectory analysis, recovery, and handoff · Cost and resource accounting · Developer impact"],
  ["7", "Discussion and Open Challenges", "State consistency, feedback, and revision · Design and evaluation guidance · Open challenges"],
  ["8", "Conclusion", ""],
  ["A", "Additional Benchmark Settings", ""],
];

export const CHAINSWE =
  "In ChainSWE, GPT-5.5's per-issue resolution is 69.1%, 49.0%, and 47.4% when each issue starts from earlier reference fixes (Oracle), " +
  "from the agent's own patches (Seq), and from its own patches plus the earlier dialogue (Seq+Mem). All 21 combinations of the seven models " +
  "and three configurations that ChainSWE reports lose accuracy from Oracle to Seq, by 29% to 48% in relative terms.";

// The manuscript's table of design priorities and evaluation targets: [work condition, design priority, what to measure]
export const GUIDANCE = [
  ["Bounded request", "Localization, execution, bounded repair", "Resolved cases and complete attempt cost"],
  ["Long single request", "Context selection and continuation", "Overflow, early stopping, information loss"],
  ["Continuing work", "Revision-aware retrieval, regression tests, recovery", "Agent-produced chains; earlier obligations rechecked"],
  ["Parallel implementation", "Dependency agreement; isolation", "Integration and coordination cost"],
  ["Interrupted work", "Checkpoint with handoff notes", "Matched takeover and recovery"],
  ["Shared or deployed project", "Integrating outside edits; bounded authority", "Edits, review, service effects"],
];

// The two measures the survey proposes, both defined over an obligation record that the evaluator holds
export const MEASURES = [
  ["Retained functionality", "R_t", "Does behavior accepted earlier still work?", "The share of earlier obligations, still active under the current specification and with an eligible check, whose checks all still pass at checkpoint t."],
  ["Conformance to active requirements", "F_t", "Does the project now satisfy everything currently required of it?", "The share of requirements the record lists as active at t, including requests the agent failed, whose checks pass at t."],
];

// The manuscript's table of open problems: [group, [[problem, what is known, first experiment], ...]]
export const PROBLEMS = [
  ["Long-term maintenance benchmarks", [
    ["Measuring retention", "Per-issue and whole-chain success; earlier tests rerun; regressions inside precision scores", "Declared obligation record; state saved per checkpoint; rerun validated checks of still-active obligations"],
    ["Successor-task validity", "In ChainSWE, the later problem differs between Oracle and sequential modes, as inherited code differs", "Later requests classified on agent state; common predecessor states; split by earlier outcome"],
    ["Inherited code and external change", "Chain benchmarks carry the agent's own code; SWE-Touch injects outside edits in one task", "Outside edits injected into an agent-produced chain"],
    ["A common report for continuing work", "Each measurement is reported by some study; definitions differ across benchmarks", "One obligation split and one measurement set across several persistent protocols"],
    ["Transfer beyond one benchmark", "High scores can reflect one-benchmark adaptation; fresh task sets only partly help", "One configuration held fixed across independent benchmarks and freshly reconstructed repositories"],
  ]],
  ["Consistent revision of code and knowledge", [
    ["Selective revision", "Retained dialogue gives no consistent offset for inherited code; EvoMem revises under reference updates", "Hold the project change fixed; vary knowledge representation and repair actions under matched budgets"],
    ["Requirement status", "Agents can keep superseded behavior; no reviewed study isolates requirement status across requests", "Fixed code and notes; vary only whether a later request retires an earlier requirement"],
    ["Delivering experience", "Most tested solver–memory pairings do not beat memory-off", "Memory-off vs. revision-tagged retrieval vs. independently selected relevant records"],
    ["Repairing compromised memory", "Insertion, recall, effect, and repair are separable; repair fails mainly through collateral loss of benign memories", "Poisoned-record removal; check what derived summaries and code still carry from it"],
    ["Handoff and understanding", "Context reduces rediscovery; agents can weaken comprehension relative to a chatbot", "Matched takeovers with different handoff records; successor correctness and time"],
  ]],
  ["Learning from inherited state and delayed failures", [
    ["Learning from inherited state", "Chained pull-request data, gains not isolated; failed repair patches seed higher-order bugs", "Training with vs. without state carryover; matched data and compute"],
    ["Credit for delayed failures", "Process signals only within one task, e.g., guiding rollouts or a trajectory-level reward", "Later failures labeled as regressions, older defects, or new requirements before credit assignment"],
    ["Recovery from damaged states", "Guided retries in fresh rollouts; same-task resumption from earlier saved states", "Training from settled states left by earlier failed attempts"],
  ]],
  ["Verification coverage and reliability", [
    ["Checks for active obligations", "Spec writing limits proofs; variant-guided tests strengthen oracles given a reference patch", "Checks derived from accepted changes; later-regression detection"],
    ["Validated process judges", "Judges add design and process-quality information; their agreement must itself be measured", "Agreement, false positives, and robustness to alternative valid solutions on long trajectories"],
  ]],
  ["Coordination, oversight, and governance", [
    ["Coordination without shared specifications", "Full specifications restore accuracy; conflict reports alone do not", "Interface details omitted across parallel worktrees; detection before merge"],
    ["Spending review and verification", "Repository activity can outgrow review capacity; the benefit of running code is concentrated in some tasks", "Fixed-budget check allocation to high-dependency changes; human review time reported separately"],
  ]],
];

export const CLOSING =
  "Agents that revise in this way would let a team entrust a project to them and receive it back in better shape, with its history, its obligations, and the reasons behind its changes intact.";

export const TEASER_ALT =
  "An illustrated landscape: robots repair a single block, build a house from blocks, and maintain a growing village, while signposts mark the requests of a continuing project.";

// BibTeX entry for the survey
export function surveyBibtex() {
  const authors = SURVEY.authors
    .map(([name]) => {
      const parts = name.split(" ");
      return `${parts.at(-1)}, ${parts.slice(0, -1).join(" ")}`;
    })
    .join(" and ");
  return [
    `@misc{${SURVEY.bibtexKey},`,
    `  title        = {${SURVEY.title}: ${SURVEY.subtitle}},`,
    `  author       = {${authors}},`,
    `  year         = {${SURVEY.year}},`,
    `  howpublished = {\\url{${REPO_URL}}},`,
    "  note         = {Manuscript}",
    "}",
  ].join("\n");
}
