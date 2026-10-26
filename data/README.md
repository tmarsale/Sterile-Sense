# Sample data

**Everything in this folder is illustrative sample data for a prototype demonstration.** It is not a validated, approved, or site-specific risk assessment, and it contains no confidential employer or customer information.

| File | What it is |
|---|---|
| `fmea/aseptic-filling-ai-em-review.json` | Structured copy of `fmea/aseptic-filling-ai-em-review-fmea.md` (15 failure modes) |
| `fmea/steam-sterilization-ai-cycle-review.json` | Structured copy of `fmea/steam-sterilization-ai-cycle-review-fmea.md` (14 failure modes) |
| `scoring-rules.json` | Configurable demonstration scoring thresholds and 1–10 scales |

## How the data was made

- The FMEAs were drafted with the `/generate-fmea` Claude Code skill and saved as Markdown in `fmea/`. The Markdown files remain the original documents.
- `scripts/convert-fmea.mjs` copies their text **verbatim** into JSON. To regenerate after editing the Markdown, run `node scripts/convert-fmea.mjs`.
- **RPN and priority are not stored.** The app computes them from S/O/D and `scoring-rules.json`, so the scoring logic is visible and changeable. The script checks that the computed values match the Markdown originals.

## Assumptions to keep in mind

- **The scores are illustrative estimates.** They don't come from site data, deviation history, or EM records.
- **The AI use cases are hypothetical.** Each FMEA's `scopeAndAssumptions` describes Sterile Sense AI reviewing records for a human decision-maker. That's a scenario for analysis, not a description of current product capability.
- **Severity ≥ 9 = high priority** is a configurable **demonstration rule** (`criticalSeverityThreshold`), not a universal regulatory requirement. It shows how high-severity risks can be kept from hiding behind a low RPN.
- **High = RPN ≥ 100** comes from the original FMEAs. **Medium = RPN ≥ 50** was added during conversion as a demonstration threshold, chosen so it reproduces the Medium/Low split in the originals.
- **"Recommended actions" give proposed post-action scores.** These are projections for discussion, not verified results.
