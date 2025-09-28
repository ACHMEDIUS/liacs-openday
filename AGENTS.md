# Repository Guidelines

## Project Structure & Module Organization
UI routes live under `app/` using the App Router (e.g., `questions`, `wheel`, `presentation`). Shared components split into domain-specific directories inside `components/`, and reusable hooks sit in `hooks/`. Firebase, i18n, and utility helpers reside in `lib/`, static fixtures in `data/`, assets in `public/`, Cloud Functions in `functions/src`, and Vitest suites mirror their targets under `test/`.

## Build, Test, and Development Commands
- `npm run dev`: start the Next.js dev server with hot reload.
- `npm run build`: generate a production bundle before deploys or analytics.
- `npm run start`: serve the compiled build locally.
- `npm run lint` / `npm run lint:fix`: enforce or auto-fix ESLint rules.
- `npm run format` / `npm run format:check`: apply or verify Prettier formatting with Tailwind ordering.
- `npm run test`, `npm run test:run`, `npm run test:coverage`: run Vitest in watch, CI, or coverage mode.

## Coding Style & Naming Conventions
Code is TypeScript-first with two-space indentation and explicit return types when they aid readability. Components and hooks use PascalCase filenames, Tailwind remains the primary styling layer, and shared helpers live in `lib/utils.ts`. Run lint and format scripts before pushing; Prettier manages quoting and import sorting.

## Testing Guidelines
Vitest with Testing Library is configured via `vitest.config.ts` and `test/setup.ts`. Add new specs under `test/` using `*.test.ts[x]` names that mirror the source tree (`test/components/app/question-box.test.tsx`). Run `npm run test:coverage` on significant changes and address failures or coverage drops before review.

## Commit & Pull Request Guidelines
Commits follow the conventional prefix pattern seen in history (`feat`, `style`, `enhance`). Keep messages imperative and limit each commit to a focused change. Pull requests should describe the intent, link relevant issues, and include screenshots or clips for UI updates plus notes about data or config migrations.

## Firebase & Deployment Notes
Firebase client config initializes in `lib/firebase.ts`; override sensitive values with `.env.local` when needed. Cloud Functions live in `functions/src/index.ts` and require their own `npm install` before deploying with Firebase tools. Use `npm run analyze` for bundle insights and ensure hosting settings in `firebase.json` remain aligned with static exports.
