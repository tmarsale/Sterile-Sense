# Sterile Sense AI: October 30 Prototype Plan

**Goal:** demonstrate one working, end-to-end workflow: **select a process → review an AI-drafted FMEA with transparent scoring → record human decisions → export a reviewed draft.**
**Constraints:** no paid API, no live AI generation, no backend or database. Fictional and illustrative data only. Nothing is presented as validated or approved.
**Assumptions** (adjust if wrong): live demo on my laptop (localhost), a slot of about 5 minutes, React + Vite frontend.

## 1. The one capability: the FMEA Review Workspace

A browser app that loads the two pre-generated FMEAs (steam sterilization, aseptic filling) and makes **the human review step** the product. The app **computes RPN live** (S × O × D) and shows why each row is prioritized. Any row with **S ≥ 9 is flagged critical regardless of RPN.** The reviewer adjusts scores, accepts or rejects each row, and exports a reviewed draft. The AI drafts; a person decides.

## 2–3. Tasks and acceptance criteria

| # | Task | Acceptance criterion |
|---|---|---|
| 1 | *(Prep)* Clone `github.com/tmarsale/Sterile-Sense` locally, copy in `.claude/skills/`, `fmea/`, and `PLAN.md`, then commit and push. | GitHub `main` shows the original README unchanged, plus both skills, both FMEA files, and this plan. |
| 2 | *(Prep)* Convert both FMEA Markdown files into JSON (`data/*.json`) holding S/O/D but **no stored RPN**. | Both files load; row counts (14 and 15) and scores match the Markdown. |
| 3 | *(Prep)* Scaffold a Vite + React app with a permanent "DRAFT: illustrative, not validated or approved" banner. | `npm run dev` opens a page showing the banner. |
| 4 | Add a process selector and a short context form (equipment, product type, reviewer name). | Choosing "Aseptic filling" loads its 15 rows, and the entered context appears in the header. |
| 5 | Show the FMEA table with RPN computed in the browser, plus a priority badge and its reason ("Critical: S ≥ 9" or "RPN ≥ 100"). | Aseptic row 5 (S10 O2 D3, RPN 60) shows **Critical** even though its RPN is below 100, and a "Critical only" filter shows it. |
| 6 | Add reviewer controls: edit S/O/D, set the status (Accepted / Needs change / Rejected), and add a comment. | Changing O updates RPN and priority instantly, and a counter shows how many rows are still unreviewed. |
| 7 | Export the reviewed draft as Markdown, including context, reviewer decisions, changed scores, and the "not approved" status. | The downloaded file contains the edits made during the demo and the draft banner. |
| 8 | Add a "Today vs. Roadmap" panel (live AI drafting, FDA 483 / warning letter intelligence with sources, CAPA support). | Roadmap items are clearly labeled "Future" and none of them is clickable. |

## 4. Deliberately NOT building before the showcase

- **Live AI generation or API calls.** The skill-generated examples are the "AI draft." Say so honestly.
- **The FDA 483 feature.** At most, one roadmap slide. Nothing goes on screen without a verified source link and date.
- **Login, a database, a backend, or cloud deployment.**
- **E-signatures, audit trail, or any 21 CFR Part 11 or "validated" claim.**
- **PDF export, editing failure mode text, or adding new processes.**
- *Nice to have if time permits:* sorting by RPN, a JSON export, and GitHub Pages hosting.

## 5. Workshop sequence (2.5 hours; tasks 1–3 done beforehand)

| Time | Work |
|---|---|
| 0:00–0:10 | Pull the repo, run `npm run dev`, and confirm the banner and data load |
| 0:10–0:35 | Task 4: selector and context form |
| 0:35–1:20 | Task 5: table, computed RPN, critical flags (**the core; protect this time**) |
| 1:20–1:50 | Task 6: reviewer controls |
| 1:50–2:10 | Task 7: export |
| 2:10–2:20 | Task 8: Today vs. Roadmap panel |
| 2:20–2:30 | Commit, push, and rehearse the demo twice |

**Cut order if behind:** drop task 8, then reduce task 7 to copy-to-clipboard. Never cut task 5.

## 6. Demo scenario (about 3 minutes)

1. **Problem (30 s):** "FMEAs take a cross-functional team days to write, and teams that rank by RPN can bury critical sterility risks."
2. **Select "Aseptic filling"** and enter "RABS line, small-volume injectable, reviewer: T. Marsale." 15 draft failure modes appear under the DRAFT banner.
3. **Click "Critical only."** Point at the airflow-loss row: RPN 60, but flagged critical because S = 10. "A plain RPN ranking would put this near the bottom. We don't let that happen."
4. **Act as the reviewer:** lower one occurrence score with a comment ("site has interlock"), so its RPN updates live. Reject one row and accept the rest. The unreviewed counter reaches 0.
5. **Export** and open the Markdown: the decisions are recorded, and it's still marked "not approved."
6. **Roadmap (30 s):** "Next: live AI drafting from equipment details, and source-linked FDA 483 intelligence feeding these risks."
