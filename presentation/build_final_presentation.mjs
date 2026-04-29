import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const artifactToolPath = require.resolve("@oai/artifact-tool");
const { Presentation, PresentationFile } = await import(artifactToolPath);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "presentation");
const previewDir = path.join(outDir, "previews");
const figDir = path.join(root, "reports", "figures");
const artifactDir = path.join(root, "reports", "artifacts");

const W = 1920;
const H = 1080;

const C = {
  bg: "#F8F5EF",
  bg2: "#FFFDF8",
  ink: "#111827",
  muted: "#5B6472",
  line: "#D9D0C1",
  red: "#9B1B30",
  teal: "#087E7A",
  blue: "#315C9E",
  gold: "#C69214",
  green: "#2F7D46",
  dark: "#111827",
  white: "#FFFFFF",
};

const figures = [
  "dataset_overview_final.png",
  "temporal_patterns_final.png",
  "feature_association_views_final.png",
  "feature_importance_final.png",
  "threshold_sweep_final.png",
  "rank_diagnostics_final.png",
  "model_diagnostics_final.png",
];

await fs.mkdir(previewDir, { recursive: true });

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((v) => v.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const figureData = Object.fromEntries(await Promise.all(figures.map(async (name) => {
  const bytes = await fs.readFile(path.join(figDir, name));
  return [name, `data:image/png;base64,${bytes.toString("base64")}`];
})));

const splitMetrics = parseCsv(await fs.readFile(path.join(artifactDir, "split_metrics.csv"), "utf8"));
const candidates = parseCsv(await fs.readFile(path.join(artifactDir, "candidate_results.csv"), "utf8"));
const metrics = JSON.parse(await fs.readFile(path.join(artifactDir, "metrics.json"), "utf8"));

function f(x, n = 4) {
  return Number.parseFloat(x).toFixed(n);
}

function pct(x, n = 1) {
  return `${(Number.parseFloat(x) * 100).toFixed(n)}%`;
}

function rect(slide, x, y, w, h, color, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry ?? "rect",
    position: { left: x, top: y, width: w, height: h, rotation: opts.rotation ?? 0 },
    fill: color ? { type: "solid", color } : null,
    line: opts.line ?? { style: "none" },
  });
}

function text(slide, value, x, y, w, h, style = {}) {
  const box = slide.shapes.add({
    geometry: "rect",
    position: { left: x, top: y, width: w, height: h },
    fill: null,
    line: { style: "none" },
  });
  box.text.style = {
    fontFamily: style.fontFamily ?? "Aptos",
    fontSize: style.fontSize ?? 26,
    color: style.color ?? C.ink,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.alignment ?? "left",
    verticalAlignment: style.verticalAlignment ?? "top",
  };
  box.text = value;
  return box;
}

function line(slide, x, y, w, color = C.red, h = 6) {
  rect(slide, x, y, w, h, color);
}

function dot(slide, x, y, color) {
  rect(slide, x, y, 14, 14, color, { geometry: "ellipse" });
}

function figure(slide, name, x, y, w, h, alt) {
  return slide.images.add({
    dataUrl: figureData[name],
    alt,
    position: { left: x, top: y, width: w, height: h },
    fit: "contain",
  });
}

function base(presentation, bg = C.bg) {
  const slide = presentation.slides.add();
  rect(slide, 0, 0, W, H, bg);
  return slide;
}

function header(slide, section, num) {
  text(slide, "BU CS 506 DS", 88, 42, 300, 28, { fontSize: 18, bold: true, color: C.red });
  text(slide, section, 1510, 42, 260, 28, { fontSize: 18, color: C.muted, alignment: "right" });
  text(slide, String(num).padStart(2, "0"), 1798, 42, 60, 28, { fontSize: 18, bold: true, color: C.red, alignment: "right" });
}

function title(slide, titleText, subText, section, num) {
  header(slide, section, num);
  text(slide, titleText, 92, 98, 1480, 68, {
    fontFamily: "Aptos Display",
    fontSize: 46,
    bold: true,
    color: C.ink,
  });
  if (subText) text(slide, subText, 96, 176, 1350, 48, { fontSize: 25, color: C.muted });
  line(slide, 96, 238, 196, C.red, 6);
}

function footer(slide, value) {
  text(slide, value, 96, 1018, 1500, 28, { fontSize: 16, color: C.muted });
}

function metric(slide, value, label, x, y, color) {
  text(slide, value, x, y, 340, 66, {
    fontFamily: "Aptos Display",
    fontSize: 52,
    bold: true,
    color,
  });
  text(slide, label, x + 2, y + 66, 330, 52, { fontSize: 19, color: C.muted });
}

function labeledBlock(slide, label, body, x, y, w, color) {
  line(slide, x, y, 72, color, 6);
  text(slide, label, x, y + 20, w, 36, { fontSize: 28, bold: true, color });
  text(slide, body, x, y + 66, w, 96, { fontSize: 23, color: C.ink });
}

function simpleTable(slide, rows, x, y, colWidths, rowH = 54) {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  rows.forEach((row, r) => {
    const yy = y + r * rowH;
    rect(slide, x, yy, totalW, rowH, r === 0 ? C.red : null, {
      line: { style: "solid", fill: r === 0 ? C.red : C.line, width: 1 },
    });
    let xx = x;
    row.forEach((cell, c) => {
      if (c > 0) rect(slide, xx, yy, 1, rowH, r === 0 ? C.bg : C.line);
      text(slide, cell, xx + 12, yy + 14, colWidths[c] - 24, rowH - 18, {
        fontSize: r === 0 ? 18 : 19,
        bold: r === 0,
        color: r === 0 ? C.white : C.ink,
      });
      xx += colWidths[c];
    });
  });
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// 1. Cover
{
  const s = base(deck, C.dark);
  rect(s, 1260, -80, 520, 1260, C.teal, { rotation: -8 });
  rect(s, 1128, -80, 96, 1260, C.red, { rotation: -8 });
  text(s, "AML Risk Detection", 96, 220, 1020, 92, {
    fontFamily: "Aptos Display",
    fontSize: 70,
    bold: true,
    color: C.white,
  });
  text(s, "Ranking suspicious transactions with merged IBM + SAML-D data", 102, 342, 900, 72, {
    fontSize: 34,
    color: "#DCE3EC",
  });
  line(s, 104, 462, 240, "#E8D8B0", 8);
  text(s, "BU CS 506 Data Science Final Project", 104, 526, 760, 40, {
    fontSize: 27,
    bold: true,
    color: "#E8D8B0",
  });
  text(s, "A reproducible pipeline for cleaning public AML transaction data, engineering behavioral history, and prioritizing alerts for review.", 106, 642, 850, 112, {
    fontSize: 27,
    color: "#CED6E0",
  });
  text(s, "IBM AML + SAML-D\nsynthetic transaction monitoring data", 1360, 750, 390, 100, {
    fontSize: 30,
    bold: true,
    color: C.white,
    alignment: "right",
  });
  s.speakerNotes.append("Speaker 1: Introduce the project and goal. Do not discuss results yet.");
}

// 2. Problem and project goal
{
  const s = base(deck);
  title(s, "The core problem is rare-event triage", "AML systems need to find suspicious activity without overwhelming investigators.", "Problem", 2);
  labeledBlock(s, "Rare positives", "The laundering class is tiny, so accuracy is not a useful success measure by itself.", 112, 330, 460, C.red);
  labeledBlock(s, "Cost tradeoff", "False negatives create regulatory risk, while false positives waste analyst time.", 710, 330, 460, C.teal);
  labeledBlock(s, "Ranking matters", "The most useful model puts truly suspicious transactions at the top of a limited review queue.", 1308, 330, 460, C.blue);
  rect(s, 292, 700, 1336, 84, "#EEE7DA", { geometry: "roundRect" });
  text(s, "Project goal: build an end-to-end AML risk ranking pipeline and evaluate whether top-ranked alerts are actually useful.", 332, 722, 1250, 42, {
    fontSize: 30,
    bold: true,
    color: C.ink,
  });
  footer(s, "Evaluation focuses on PR-AUC, PR lift, precision/recall/F1, precision-at-k, and lift-at-k.");
  s.speakerNotes.append("Speaker 1: Explain why this is not a normal balanced classification problem.");
}

// 3. Data
{
  const s = base(deck, C.bg2);
  title(s, "Two public AML datasets become one modeling table", "We use IBM AML and SAML-D because both provide labeled synthetic transaction-monitoring data.", "Data", 3);
  figure(s, "dataset_overview_final.png", 112, 286, 1200, 330, "Dataset overview");
  labeledBlock(s, "What each row represents", "A transaction with timestamp, sender, receiver, banks, accounts, amount, currencies, payment format, and laundering label.", 124, 700, 600, C.red);
  labeledBlock(s, "Why the overview matters", "The sources differ in scale and prevalence, and transaction amounts are heavily skewed, so log views and imbalance-aware metrics are necessary.", 800, 700, 720, C.teal);
  text(s, "Synthetic labels make evaluation possible, but they also limit how far we can generalize.", 1266, 344, 430, 120, {
    fontSize: 30,
    bold: true,
    color: C.ink,
  });
  footer(s, "Raw data source links and KaggleHub download instructions are documented in README.md.");
  s.speakerNotes.append("Speaker 2: Present the two datasets and the key visual takeaways.");
}

// 4. Cleaning
{
  const s = base(deck);
  title(s, "Cleaning creates a fair shared schema", "The pipeline harmonizes both sources before feature engineering or modeling.", "Processing", 4);
  const steps = [
    ["1", "Standardize names", "Map both datasets to common sender, receiver, amount, currency, format, and label fields."],
    ["2", "Parse and coerce", "Convert timestamps and numeric amounts; drop rows without usable transaction amounts."],
    ["3", "Normalize text", "Clean bank, account, currency, and payment-format fields for consistent categorical handling."],
    ["4", "Prevent leakage", "Keep laundering_type and source_dataset for auditing only, not as model features."],
  ];
  steps.forEach(([n, head, body], i) => {
    const y = 310 + i * 142;
    text(s, n, 132, y, 54, 48, { fontSize: 30, bold: true, color: [C.red, C.teal, C.blue, C.gold][i], alignment: "center" });
    line(s, 204, y + 22, 84, [C.red, C.teal, C.blue, C.gold][i], 5);
    text(s, head, 320, y - 2, 460, 36, { fontSize: 31, bold: true, color: C.ink });
    text(s, body, 322, y + 48, 1120, 64, { fontSize: 24, color: C.muted });
  });
  rect(s, 1540, 330, 6, 520, C.line);
  text(s, "Chronological sorting comes before cumulative history features, so features reflect information available at scoring time.", 1600, 390, 230, 310, {
    fontSize: 27,
    bold: true,
    color: C.red,
  });
  footer(s, "Cleaning and harmonization are implemented in ds_final.ipynb and summarized in the final README report.");
  s.speakerNotes.append("Speaker 2: Keep this concise. The point is fair schema plus leakage control.");
}

// 5. Feature engineering
{
  const s = base(deck, C.bg2);
  title(s, "Features describe behavior around each transaction", "Raw metadata becomes more useful when it is compared against prior account and route history.", "Features", 5);
  const items = [
    ["Amount context", "raw amount, log amount, z-scores, pair amount share"],
    ["Time context", "hour, weekday, weekend, gaps since prior related transactions"],
    ["Relationship context", "sender, receiver, pair, and route counts"],
    ["Novelty context", "new counterparties, banks, currencies, first-seen flags"],
    ["Anomaly context", "Isolation Forest score appended before supervised training"],
  ];
  items.forEach(([head, body], i) => {
    const x = i < 3 ? 116 : 760;
    const y = i < 3 ? 316 + i * 152 : 392 + (i - 3) * 180;
    dot(s, x, y + 12, [C.red, C.teal, C.blue, C.gold, C.green][i]);
    text(s, head, x + 34, y, 520, 34, { fontSize: 30, bold: true, color: C.ink });
    text(s, body, x + 36, y + 44, 590, 58, { fontSize: 23, color: C.muted });
  });
  rect(s, 1368, 306, 380, 310, "#EEE7DA", { geometry: "roundRect" });
  text(s, "Leak-aware rule", 1410, 350, 300, 34, { fontSize: 28, bold: true, color: C.red });
  text(s, "For cumulative features, every row only uses transactions that happened earlier in time.", 1412, 404, 290, 128, {
    fontSize: 24,
    color: C.ink,
  });
  text(s, "Final feature set: 5 categorical features, 53 numeric features, plus one anomaly score.", 111, 864, 1100, 44, {
    fontSize: 29,
    bold: true,
    color: C.teal,
  });
  footer(s, "Feature families target structuring, layering, repeated pair behavior, cross-border novelty, and unusual transaction size.");
  s.speakerNotes.append("Speaker 2: Explain that the model sees transaction context, not just a single row.");
}

// 6. Temporal visualization
{
  const s = base(deck);
  title(s, "Visualization 1: laundering is not uniform over time", "The weekday-hour heatmap motivates calendar and time-window features.", "Visualization", 6);
  figure(s, "temporal_patterns_final.png", 126, 292, 1180, 440, "Temporal laundering heatmap");
  text(s, "What the heatmap tells us", 1390, 328, 380, 40, { fontSize: 32, bold: true, color: C.red });
  text(s, "The positive rate changes across weekday and hour. That does not prove causality, but it gives the model useful timing context.", 1392, 396, 390, 144, {
    fontSize: 26,
    color: C.ink,
  });
  line(s, 1392, 594, 210, C.teal, 6);
  text(s, "The visual also avoids overplotting millions of rows by aggregating rates into a readable heatmap.", 1392, 632, 390, 124, {
    fontSize: 25,
    color: C.muted,
  });
  footer(s, "Figure: reports/figures/temporal_patterns_final.png");
  s.speakerNotes.append("Speaker 3: Focus on what the visual motivates, not every cell in the heatmap.");
}

// 7. Feature signal visualization
{
  const s = base(deck, C.bg2);
  title(s, "Visualization 2: history features carry strong signal", "Association views support using behavioral and relational features.", "Visualization", 7);
  figure(s, "feature_association_views_final.png", 88, 298, 1040, 360, "Feature association views");
  figure(s, "feature_importance_final.png", 1218, 274, 520, 510, "Feature importance");
  text(s, "Main pattern", 114, 748, 260, 34, { fontSize: 30, bold: true, color: C.red });
  text(s, "Pair history, sender/receiver history, currency and route behavior rank highly. That matches the intuition that laundering is often a pattern across transactions, not one isolated amount.", 116, 800, 1050, 86, {
    fontSize: 25,
    color: C.ink,
  });
  footer(s, "Figures: feature association and feature importance exports from ds_final.ipynb.");
  s.speakerNotes.append("Speaker 3: Connect the visual evidence to the feature engineering choices.");
}

// 8. Modeling
{
  const s = base(deck);
  title(s, "Models are compared on validation, then frozen for test", "We benchmark tree-based classifiers and select the best validation performer.", "Modeling", 8);
  const top = candidates.slice(0, 6).map((r) => [
    r.candidate.replaceAll("_", " "),
    f(r.pr_auc, 4),
    f(r.best_f1, 4),
  ]);
  simpleTable(s, [["Candidate", "Validation PR-AUC", "Validation F1"], ...top], 106, 306, [510, 220, 190], 58);
  text(s, "Evaluation design", 1160, 322, 420, 42, { fontSize: 34, bold: true, color: C.red });
  const evalBullets = [
    "Chronological split: 64% train, 16% validation, 20% test",
    "Primary metrics: PR-AUC, PR lift, precision, recall, F1",
    "Operational diagnostics: precision-at-k and lift-at-k",
    "Selected model: weighted ensemble",
  ];
  evalBullets.forEach((b, i) => {
    dot(s, 1162, 392 + i * 78, [C.red, C.teal, C.blue, C.gold][i]);
    text(s, b, 1194, 376 + i * 78, 570, 56, { fontSize: 24, color: C.ink });
  });
  metric(s, "0.925", "selected validation threshold", 1162, 760, C.teal);
  footer(s, "Validation picks the model and operating threshold. Test metrics are reported only after that choice.");
  s.speakerNotes.append("Speaker 3: Explain model selection and why PR metrics are central.");
}

// 9. Results
{
  const s = base(deck, C.bg2);
  title(s, "Held-out test results are strong", "Results are reported on the later test window using the selected threshold.", "Results", 9);
  const tm = metrics.test_metrics;
  metric(s, f(tm.pr_auc, 4), "test PR-AUC", 108, 292, C.teal);
  metric(s, f(tm.precision, 4), "test precision", 476, 292, C.red);
  metric(s, f(tm.recall, 4), "test recall", 844, 292, C.blue);
  metric(s, f(tm.f1, 4), "test F1", 1212, 292, C.gold);
  figure(s, "model_diagnostics_final.png", 96, 470, 1060, 286, "Model diagnostics");
  figure(s, "threshold_sweep_final.png", 1220, 478, 520, 248, "Threshold sweep");
  const testRow = splitMetrics.find((r) => r.split === "test");
  text(s, `PR lift over baseline: ${Number.parseFloat(testRow.pr_lift).toFixed(2)}x`, 1226, 772, 520, 42, {
    fontSize: 31,
    bold: true,
    color: C.red,
  });
  text(s, "At threshold 0.925, precision remains high while recall still captures most positives.", 1228, 828, 520, 74, {
    fontSize: 24,
    color: C.ink,
  });
  footer(s, "Metrics read from reports/artifacts/split_metrics.csv and metrics.json.");
  s.speakerNotes.append("Speaker 4: Present the held-out numbers and threshold interpretation.");
}

// 10. Operational ranking and limitations
{
  const s = base(deck, C.dark);
  text(s, "What the results mean", 94, 78, 820, 64, {
    fontFamily: "Aptos Display",
    fontSize: 54,
    bold: true,
    color: C.white,
  });
  line(s, 98, 166, 220, "#E8D8B0", 8);
  figure(s, "rank_diagnostics_final.png", 96, 236, 860, 304, "Rank diagnostics");
  metric(s, "99.97%", "precision in the top 0.1% ranked alerts", 104, 622, "#E8D8B0");
  metric(s, "91.7%", "positives recovered in that same slice", 506, 622, C.teal);
  text(s, "The project succeeds as an alert-ranking workflow: the highest-risk slice is highly concentrated with positives.", 102, 828, 830, 68, {
    fontSize: 27,
    bold: true,
    color: C.white,
  });
  text(s, "Limitations", 1088, 244, 440, 42, { fontSize: 36, bold: true, color: "#E8D8B0" });
  const limits = [
    "Both final datasets are synthetic.",
    "The validation and test windows are effectively SAML-D-only.",
    "Real deployment would require calibrated costs, analyst capacity constraints, and monitoring for drift.",
  ];
  limits.forEach((b, i) => {
    dot(s, 1092, 320 + i * 96, [C.red, C.teal, C.blue][i]);
    text(s, b, 1126, 302 + i * 96, 600, 64, { fontSize: 25, color: "#DCE3EC" });
  });
  text(s, "Future work", 1088, 688, 440, 42, { fontSize: 34, bold: true, color: "#E8D8B0" });
  text(s, "Add graph features, validate on less synthetic data, and test robustness across later time windows.", 1090, 748, 620, 84, {
    fontSize: 26,
    color: C.white,
  });
  text(s, "Final report: README.md", 1090, 916, 520, 34, { fontSize: 24, bold: true, color: "#E8D8B0" });
  s.speakerNotes.append("Speaker 4: Close with operational meaning, limitations, and next work.");
}

const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(path.join(outDir, "final_presentation.pptx"));

const slides = deck.slides.items;
for (let i = 0; i < slides.length; i += 1) {
  const png = await slides[i].export("png");
  await fs.writeFile(path.join(previewDir, `slide_${String(i + 1).padStart(2, "0")}.png`), Buffer.from(await png.arrayBuffer()));
}

console.log(`Wrote ${path.join(outDir, "final_presentation.pptx")}`);
console.log(`Wrote ${slides.length} preview PNGs to ${previewDir}`);
