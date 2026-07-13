# Complete Your Work Record

## Overview

This is a frontend-only prototype for a Toggl Focus Senior Product Manager take-home assignment.

The concept helps Toggl review credible gaps between captured activity and intentional logged time. It shows the evidence behind a suggestion, lets the user confirm or correct it, and uses the completed work record to suggest a better estimate for similar future work.

## Prototype Flow

1. Review a high-confidence activity gap.
2. Inspect the evidence.
3. Confirm or edit the proposed entry.
4. Add supporting work to the record.
5. Review the improved future estimate.
6. Resolve a lower-confidence waiting-time example.

## Trust Model

Strong evidence leads to a suggestion. Weak evidence leads to a question. Irrelevant activity stays silent.

Nothing is logged automatically.

## Technology

- React
- TypeScript
- Vite
- ESLint
- Lucide React
- npm

## Run Locally

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## Prototype Limitations

- Frontend only
- Deterministic mock data
- No backend
- No real activity capture
- No production classification model
- No persistent storage
- No real Toggl integration

## Reset

Use **Reset demo** in the prototype toolbar to restore the initial state. Refreshing the page also resets the demo.

## Product Decisions

See [PRODUCT_DECISIONS.md](./PRODUCT_DECISIONS.md) for the research, product rationale, tradeoffs, and validation plan.

## Live Prototype

[https://toggl-work-evidence-review.vercel.app](https://toggl-work-evidence-review.vercel.app)
