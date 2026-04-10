# PrintEasy — Frontend Task

A print configuration interface demonstrating property-level state overrides using native React hooks only (`useReducer`, `useState`, `useContext`).

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or push to GitHub and import on vercel.com — it auto-detects Next.js.

---

## Architecture

### The Core Problem

Global settings should update all files, **but** if a file has a local override on a specific property, that property should remain locally controlled while other properties still follow global changes.

### Solution: Property-Level Override Tracking

Each file has an `overrides` object tracking which properties have been locally set:

```ts
overrides: {
  copies: boolean;  // true = this file manages its own copies
  sides: boolean;   // true = this file manages its own sides
}
```

When a global change fires:
- For each file, check `file.overrides[property]`
- If `false` → apply the global change
- If `true` → skip (local override wins)

When a file-level change fires:
- Update that file's setting
- Set `overrides[property] = true` → future global changes won't overwrite it

### Rule 2: Duplex Validation

`canUseDuplex(originalPages, copies)` checks: `originalPages × copies >= 2`

This is purely a UI warning — state is not blocked. The user must resolve conflicts manually.

### Key Files

| File | Purpose |
|------|---------|
| `components/usePrintState.ts` | Reducer, types, all business logic |
| `components/PrintConfig.tsx` | Main UI component ("smart" container) |
| `components/CopiesInput.tsx` | Reusable +/- stepper ("dumb" presentational) |
