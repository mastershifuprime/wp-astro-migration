# Branching Strategy

We use **GitHub Flow** — a lightweight, single-trunk workflow suited for continuous deployment.

## Branch Layout

```
main                    ← always deployable; protected
  └─ feat/THEA-42-auth  ← feature branch off main
  └─ fix/THEA-55-login  ← bug-fix branch off main
  └─ chore/update-deps  ← non-functional change
```

## Rules

| Rule | Detail |
|---|---|
| `main` is protected | Direct pushes are blocked; all changes via PR |
| Branch names | `feat/TICKET-slug`, `fix/TICKET-slug`, `chore/slug`, `docs/slug` |
| PRs require 1 review | And CI green before merge |
| Squash-merge | Keeps `main` history linear and bisectable |
| Delete on merge | Branch is deleted after merge (GitHub setting) |

## Deployment

- Every merge to `main` triggers a Vercel production deployment automatically.
- Every open PR gets a Vercel preview URL for isolated testing.

## Release

No versioned releases at v1 — we ship continuously. If we ever need versioned releases,
we'll add `release/x.y.z` branches at that time (YAGNI).
