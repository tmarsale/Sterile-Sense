// Converts the illustrative FMEA Markdown documents in fmea/ into structured
// JSON in data/fmea/. Text is copied verbatim; RPN and priority are NOT stored,
// because the app computes them from S/O/D and data/scoring-rules.json.
//
// The script checks its own output: every RPN and priority it can recompute
// must match the Markdown original, or it exits with an error.
//
// Usage: node scripts/convert-fmea.mjs

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const rules = JSON.parse(readFileSync(join(root, "data", "scoring-rules.json"), "utf8"));
const outDir = join(root, "data", "fmea");
mkdirSync(outDir, { recursive: true });

const stripBold = (s) => s.replace(/\*\*/g, "").trim();

function sections(md) {
  const out = {};
  let current = "_header";
  out[current] = [];
  for (const line of md.split(/\r?\n/)) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      current = h[1].trim();
      out[current] = [];
    } else {
      out[current].push(line);
    }
  }
  return out;
}

function table(lines) {
  const rows = lines.filter((l) => l.trim().startsWith("|"));
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const header = cells(rows[0]);
  return rows.slice(2).map((r) => Object.fromEntries(cells(r).map((c, i) => [header[i], c])));
}

const bullets = (lines) => lines.filter((l) => /^\s*-\s+/.test(l)).map((l) => l.replace(/^\s*-\s+/, ""));
const numbered = (lines) => lines.filter((l) => /^\d+\.\s+/.test(l)).map((l) => l.replace(/^\d+\.\s+/, ""));

function labelled(item) {
  const m = item.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (!m) return { label: null, text: stripBold(item) };
  return { label: m[1].replace(/[:.]$/, "").trim(), text: stripBold(m[2]) };
}

function priority(s, o, d) {
  const rpn = s * o * d;
  if (s >= rules.criticalSeverityThreshold) return "High";
  if (rpn >= rules.highRpnThreshold) return "High";
  if (rpn >= rules.mediumRpnThreshold) return "Medium";
  return "Low";
}

const errors = [];

for (const file of readdirSync(join(root, "fmea")).filter((f) => f.endsWith(".md"))) {
  const md = readFileSync(join(root, "fmea", file), "utf8");
  const sec = sections(md);
  const header = sec._header;
  const slug = basename(file, ".md").replace(/-fmea$/, "");

  const title = header.find((l) => l.startsWith("# ")).replace(/^#\s+FMEA:\s*/, "").trim();
  const date = header.find((l) => l.startsWith("**Date:**")).replace("**Date:**", "").trim();
  const disclaimer = stripBold(header.filter((l) => l.startsWith(">")).map((l) => l.replace(/^>\s*/, "")).join(" "));

  const steps = numbered(sec["Process steps"]).map((name, i) => ({ number: i + 1, name }));

  const failureModes = table(sec["FMEA table"]).map((r) => {
    const fm = {
      id: Number(r.ID),
      step: Number(r.Step),
      stepName: steps[Number(r.Step) - 1]?.name,
      failureMode: r["Failure mode"],
      effect: r.Effect,
      cause: r.Cause,
      preventionControls: r["Prevention controls"],
      detectionControls: r["Detection controls"],
      severity: Number(r.S),
      occurrence: Number(r.O),
      detection: Number(r.D),
    };
    const rpn = fm.severity * fm.occurrence * fm.detection;
    if (rpn !== Number(r.RPN)) errors.push(`${file} row ${fm.id}: computed RPN ${rpn} != ${r.RPN}`);
    const expected = stripBold(r.Priority).split(" ")[0];
    const got = priority(fm.severity, fm.occurrence, fm.detection);
    if (got !== expected) errors.push(`${file} row ${fm.id}: computed priority ${got} != ${expected}`);
    return fm;
  });

  const recommendedActions = table(sec["Recommended actions"]).map((r) => {
    const a = {
      failureModeId: Number(r.ID),
      action: r.Action,
      owner: r.Owner,
      proposedSeverity: Number(r["New S"]),
      proposedOccurrence: Number(r["New O"]),
      proposedDetection: Number(r["New D"]),
    };
    const rpn = a.proposedSeverity * a.proposedOccurrence * a.proposedDetection;
    if (rpn !== Number(r["New RPN"])) errors.push(`${file} action ${a.failureModeId}: computed RPN ${rpn} != ${r["New RPN"]}`);
    return a;
  });

  const notes = sec["Recommended actions"]
    .filter((l) => l.startsWith("Note:"))
    .map((l) => stripBold(l.replace(/^Note:\s*/, "")));

  const data = {
    id: slug,
    title,
    date,
    status: "DRAFT — illustrative, not validated or approved",
    origin: {
      generatedBy: "/generate-fmea Claude Code skill (pre-generated; no live AI in the prototype)",
      sourceDocument: `fmea/${file}`,
    },
    disclaimer,
    scopeAndAssumptions: bullets(sec["Scope & assumptions"]).map(labelled),
    processSteps: steps,
    failureModes,
    recommendedActions,
    notes,
    topRisksSummary: numbered(sec["Top risks summary"]).map(labelled),
    limitations: bullets(sec["Limitations"]).map(stripBold),
  };

  writeFileSync(join(outDir, `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
  console.log(`${file} -> data/fmea/${slug}.json (${failureModes.length} failure modes, ${recommendedActions.length} actions)`);
}

if (errors.length) {
  console.error("\nMismatches against the Markdown originals:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("All RPNs and priorities match the Markdown originals.");
