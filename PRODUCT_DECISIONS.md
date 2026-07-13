# Complete Your Work Record
## Product insights and decision rationale

**Candidate:** Matt Ghoreishi  
**Assignment:** Toggl Focus individual-user experience  
**Prototype type:** Frontend-only interactive prototype using deterministic mock data

---

## Executive summary

I focused on independent contractors working inside client organizations.

This is close to my current working context, and I also use Hubstaff. That gave me the initial hypothesis: the primary task is often tracked, while supporting work such as reviewing guidelines, calibration, coordination, corrections, and waiting for client input can disappear from the final record.

I did not rely on that experience alone. User feedback and competitive research showed a recurring demand for recovering missed work, while also exposing a weakness in broad automatic categorization: activity data without context can create noise, false positives, and mistrust.

During product exploration, I found that Toggl already has many of the necessary building blocks:

- desktop activity capture
- Activity and Logged Time shown together
- task suggestions
- manual conversion of activity into time entries
- task planning and estimates

I therefore chose not to add another AI assistant or redesign the product broadly.

The opportunity is to complete the existing loop:

**captured activity → understandable evidence → user decision → complete work record → better future estimate**

---

## Target user

The primary user is an independent contractor embedded inside a client organization on a longer engagement.

They may work across client tools, meetings, documentation, messaging, evaluation platforms, and internal coordination. Their challenge is not simply starting and stopping a timer. It is producing a trustworthy record of the complete effort behind the result.

Their needs include:

- proving contribution
- reducing manual reconstruction
- capturing supporting work
- preserving contractual boundaries
- learning from actual effort
- improving future estimates
- retaining control over what becomes part of the official record

---

## Problem

The main task may be tracked while valuable supporting work remains outside the final work record.

Examples include:

- reviewing updated client guidelines
- calibration and quality discussions
- Slack coordination
- reviewing feedback
- corrections and rework
- waiting for required client input

This creates two related problems:

1. The contractor cannot fully demonstrate the effort behind the outcome.
2. Future estimates are based on incomplete actual-effort data.

The result is not only lost or invisible time. It is a weaker evidence base for future planning.

---

## Product and competitive insight

Competitor research reinforced two opposing signals.

First, products built around passive activity capture validate the demand for reducing the burden of manual time reconstruction. Users value recovering work they would otherwise forget.

Second, broad automatic categorization can create mistrust when the system infers intent from weak signals. An application name or idle period does not reliably explain what the user was doing or whether the time belongs to a client.

Toggl has a strategic advantage because it can combine:

- captured app and window activity
- existing task and project context
- intentional logged time
- estimates and planning history

The opportunity is not to categorize everything automatically. It is to help the user make a small number of better, faster decisions.

---

## Opportunity areas considered

I considered six directions:

1. Generic missing-time recovery
2. Automatic work categorization
3. Earnings and capacity summaries
4. Scope-creep warnings
5. Tomorrow-planning suggestions
6. Completing the work record and improving future estimates

I compared them using:

- W0 retention potential
- pain severity
- evidence strength
- frequency
- strategic fit with time intelligence
- persona fit
- trust and privacy risk
- differentiation
- cold-open clarity
- prototype feasibility

### Directional prioritization

| Opportunity | W0 value | Pain / evidence | Strategic fit | Trust | Differentiation | Prototype fit |
|---|---|---|---|---|---|---|
| Missing-time recovery | High | High | High | Medium | Medium-low | High |
| Automatic categorization | High | Medium-high | High | Low-medium | Medium | Medium |
| Earnings summary | Medium | Medium | Medium | High | Low | High |
| Scope-creep warning | Medium | High | High | High | Medium-high | Medium |
| Tomorrow planning | Medium | Medium | Medium | High | Low-medium | Medium |
| **Complete record + future estimate** | **High** | **High** | **High** | **High with confirmation** | **High** | **High** |

Missing-time recovery had the strongest immediate evidence, but a standard review-and-categorize flow risked being generic.

I retained recovery as the mechanism and changed the outcome:

> Make invisible contribution visible, then use the richer actual-effort record to improve future planning.

---

## Proposed experience

The prototype adds a bounded review flow inside **My Activity**.

### High-confidence case

Toggl identifies a 35-minute activity gap outside the existing timer.

It shows the evidence:

- a client-specific Slack channel
- client guidelines open in Chrome
- a calibration call
- similarity to a previous user choice

It then prepares a time entry while preserving user control over:

- description
- task
- project
- tags
- duration
- billable status

Nothing is logged automatically.

After confirmation, the supporting work becomes a separate time entry linked to the main task.

The product then shows:

- 2h 35m of execution
- 35m of supporting work
- 3h 10m of complete effort
- an average across three similar completed records
- a suggested estimate of 3h 15m for the next similar task

The estimate is suggested, not imposed.

### Low-confidence case

Toggl detects a 40-minute gap after a client message but lacks enough evidence to classify it.

Instead of guessing, it asks whether the time was:

- client waiting
- a break
- unrelated
- something to ignore

Client waiting may be added as billable or non-billable, depending on the contract. Breaks and unrelated activity do not become logged work.

---

## Trust model

The concept follows a simple rule:

**Strong evidence leads to a suggestion. Weak evidence leads to a question. Irrelevant activity stays silent.**

Additional guardrails:

- evidence is shown before the recommendation
- no fake confidence percentages
- nothing is logged without confirmation
- every important field remains editable
- uncertain waiting time is never inferred as fact
- future estimates are recommended, not automatically changed
- personal time is deliberately left unflagged

---

## W0 retention hypothesis

The first-week value is not another report.

The user experiences Toggl actively:

- reducing reconstruction effort
- recovering meaningful supporting work
- making contribution more visible
- improving a decision they are likely to make again

The return loop is:

**capture activity → review credible gaps → complete the record → improve the next estimate**

### Hypothesis

If Toggl surfaces a small number of credible work gaps, explains the evidence, and turns confirmed records into better estimates, exposed users will be more likely to return for another review during W0.

---

## Assumptions

The concept assumes:

- activity recording is enabled
- the desktop app has permission to capture app and window context
- the user has created at least one project or task
- the user has completed enough similar work before an estimate recommendation is shown
- the user understands that captured activity is private until confirmed
- the browser-hosted prototype represents an improved desktop experience

---

## Scope

### Included

- My Activity review entry point
- high-confidence evidence review
- editable time-entry confirmation
- separate supporting-work entry
- complete-effort calculation
- future-estimate recommendation
- low-confidence waiting case
- billable and non-billable resolution
- distinct outcomes for break, unrelated, and ignore
- resettable end-to-end demo

### Deliberately excluded

- real activity capture
- production inference or classification models
- automatic logging
- backend and synchronization
- client-facing reporting
- chatbot assistant
- broad dashboard redesign
- full profitability system
- complete scope-creep detection
- automatic daily planning
- mobile experience

---

## Measurement

### Primary outcome

- W0 return rate among users exposed to the review experience

### Leading indicators

- review-open rate
- high-confidence suggestion acceptance rate
- edit rate
- ignore rate
- recovered work minutes per active user
- percentage reaching the estimate recommendation
- estimate adoption rate
- completion of a second review session during W0

### Trust guardrails

- incorrect-suggestion rate
- repeated ignores
- “do not suggest again” actions
- activity-recording opt-out rate
- privacy-related support contacts
- proportion of low-confidence cases incorrectly presented as suggestions

---

## Validation plan

A first experiment could expose the review experience to new individual users who:

- enable activity recording
- create at least one task
- record activity on at least two days

Compare exposed and control cohorts on:

- W0 return
- number of completed time records
- review completion
- estimate creation or adoption
- activity-recording retention

Qualitative follow-up should test:

- whether users understand why a suggestion was made
- whether they distinguish Activity from Logged Time
- whether the estimate payoff feels credible
- whether waiting-time treatment matches contractual reality
- whether the review feels helpful rather than intrusive

---

## Key tradeoffs

### Automation versus trust

Full automation could reduce more effort, but false positives would weaken trust. The concept favors transparent suggestions and user confirmation.

### Recovery versus distinctiveness

Missing-time recovery has strong evidence, but by itself risks becoming a generic cleanup flow. Connecting the completed record to future estimates creates a stronger time-intelligence payoff.

### Richness versus W0 setup

Profitability and scope tools may create larger long-term value, but require more rates, budgets, and historical data. The selected experience can create value with much lighter setup.

### Visibility versus surveillance

Captured activity is useful only when the user understands what is collected and remains in control of what becomes an official record.

---

## AI usage and human decisions

AI supported:

- research synthesis
- competitor pattern comparison
- opportunity generation
- prioritization alternatives
- copy exploration
- frontend implementation
- QA iteration

Human judgment determined:

- the primary persona
- the personal problem to pursue
- the distinction between activity and intentional work records
- rejecting broad automatic categorization
- requiring visible evidence
- never logging automatically
- treating waiting as an uncertain case
- using missing-time recovery as the mechanism rather than the final value
- linking complete actual effort to better estimates
- keeping the prototype narrow

---

## Prototype limitations

This is a frontend-only prototype using deterministic mock data.

It does not implement:

- real desktop monitoring
- a classification model
- historical similarity calculations
- data synchronization
- account permissions
- persistent storage
- production privacy controls

The purpose is to demonstrate the interaction, trust model, and user value.

---

## Reference material reviewed

- Toggl Focus time-tracking and desktop-app documentation
- Toggl project time-estimate documentation
- Toggl community requests related to Timeline and activity conversion
- competitor patterns across Memtime, Timely, RescueTime, Harvest, Sunsama, Clockify, and related tools
- firsthand Toggl product exploration
- firsthand contractor experience using Hubstaff
