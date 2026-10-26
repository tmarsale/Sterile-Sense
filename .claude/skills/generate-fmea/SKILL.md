---
name: generate-fmea
description: AI-assisted quality risk assessment. Drafts a Failure Mode and Effects Analysis (FMEA) for a pharmaceutical manufacturing, sterile processing, or AI/software process, with severity, occurrence, and detection scores, RPN, and recommended controls. Use when the user invokes /generate-fmea or asks for an FMEA or risk assessment of a process.
argument-hint: "<process or system to assess>"
---

# Generate FMEA

Draft a process FMEA for the process named in the arguments: $ARGUMENTS

The output is a **draft for a cross-functional team to review**, not a final quality record. It should help people think, not replace QA judgment.

## 1. Scope

- If no process is named, ask for one, then stop.
- If the process is named but the scope is unclear (start and end points, equipment, product type), state your assumptions in a short **Scope & assumptions** list instead of asking. Ask only if the guess would make the whole analysis wrong.
- If the process involves Sterile Sense AI or any AI/ML component, include failure modes for the AI itself: wrong output, model drift, poor-quality input data, overreliance by operators, and loss of audit trail.

## 2. Break down the process

List 5–10 process steps in order. Each step should be something you can observe, such as "Load chamber" or "Review cycle printout," not a vague phase.

## 3. Identify failure modes

For each step, list the realistic ways it fails. For each failure mode, give:

- **Potential effect**: on product quality, patient safety, data integrity, or compliance
- **Potential cause**: the root mechanism (people, equipment, method, material, environment, or data)
- **Current controls**: split them into prevention and detection, and describe typical industry controls. Don't claim any specific site has them in place.

Aim for 10–20 rows in total. Prefer specific, credible failures over a long generic list.

## 4. Score

Use the 1–10 scales below. RPN = S × O × D.

| Score | Severity (S) | Occurrence (O) | Detection (D) |
|---|---|---|---|
| 9–10 | Possible patient harm or regulatory action | Very likely or recurring | Almost certainly not detected before release or use |
| 7–8 | Batch or lot rejected, major deviation | Frequent | Low chance of detection |
| 4–6 | Rework or minor deviation, partial loss | Occasional | Moderate chance of detection |
| 2–3 | Minor inconvenience, no quality impact | Rare | High chance of detection |
| 1 | No effect | Remote | Almost certainly detected |

Flag a row as **high priority** if RPN ≥ 100 **or** S ≥ 9, whatever the RPN. High severity is never averaged away.

## 5. Recommend actions

For each high-priority row, give a concrete recommended action, a suggested owner role (e.g., QA, Validation, Engineering, Data Science), and the S/O/D scores you expect after the action. Prefer actions that eliminate or prevent the failure over actions that only add inspection.

## 6. Output

Write the FMEA to `fmea/<process-slug>-fmea.md` in the project root, creating the folder if needed. Use these sections:

1. Title, date, and a "DRAFT — for team review" banner
2. Scope & assumptions
3. Process steps
4. FMEA table with columns: `ID | Step | Failure mode | Effect | Cause | Prevention controls | Detection controls | S | O | D | RPN | Priority`
5. Recommended actions table with columns: `ID | Action | Owner | New S | New O | New D | New RPN`
6. Top risks summary: the 3–5 highest risks, in plain language
7. Limitations

In chat, reply with the file path and the top risks summary only. Don't repeat the full table.

## Rules

- **Scores are estimates.** Say plainly that the S/O/D values are illustrative and must be confirmed with site data, deviation history, and the team's judgment.
- **No compliance claims.** Never state or imply that the process, Sterile Sense AI, or the FMEA itself is compliant, validated, FDA-approved, or audit-ready. Don't invent regulatory requirements. When you cite a standard, refer to it by name (e.g., ICH Q9(R1) for quality risk management) without quoting clause numbers you aren't sure of.
- **Be specific to the domain.** Use correct pharma and sterile-processing terms, but make the effects readable for engineers, founders, and business students.
- **Don't modify** any project files other than the FMEA output file.
