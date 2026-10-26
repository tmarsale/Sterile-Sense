import './App.css'
import scoringRules from '@data/scoring-rules.json'
import asepticFilling from '@data/fmea/aseptic-filling-ai-em-review.json'
import steamSterilization from '@data/fmea/steam-sterilization-ai-cycle-review.json'

const fmeas = [asepticFilling, steamSterilization]

function DraftBanner() {
  return (
    <div className="draft-banner" role="alert">
      <strong>DRAFT: illustrative, not validated or approved.</strong> Sample FMEAs for
      demonstration only. AI drafts; qualified people review and decide.
    </div>
  )
}

function App() {
  return (
    <>
      <DraftBanner />
      <main>
        <h1>Sterile Sense AI</h1>
        <p className="subtitle">FMEA Review Workspace (prototype)</p>

        {/* Prep check: confirms the sample data loads. The workshop replaces this
            with the process selector, scoring table, and reviewer controls. */}
        <section className="data-check">
          <h2>Sample data loaded</h2>
          <ul>
            {fmeas.map((f) => (
              <li key={f.id}>
                {f.title}: {f.failureModes.length} failure modes,{' '}
                {f.recommendedActions.length} recommended actions
              </li>
            ))}
          </ul>
          <p className="rule-note">
            Demonstration rule: Severity ≥ {scoringRules.criticalSeverityThreshold} is
            high priority regardless of RPN. This is a configurable example, not a
            universal regulatory requirement.
          </p>
        </section>
      </main>
    </>
  )
}

export default App
