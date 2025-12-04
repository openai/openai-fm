# Repository Guidelines

## Project Structure & Module Organization
- Core Next.js App Router code lives in `src/app` (`page.tsx`, `layout.tsx`, API routes in `src/app/api`).
- Shared UI and logic sit in `src/components`, `src/hooks`, and `src/lib`.
- Global styles are in `src/app/globals.css`; static assets live under `public/`.
- Environment examples are in `.env.example`; runtime configuration is read from `.env`.

## Build, Test, and Development Commands
- `npm run dev` – start the dev server on http://localhost:3000 (Turbopack).
- `npm run build` – production build with Next.js.
- `npm run start` – serve the production build.
- `npm run lint` – run ESLint (uses `eslint-config-next`); fix issues before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript with Next.js 15; favor React Server Components unless client state or effects are required (`"use client"`).
- Components and hooks: `PascalCase.tsx` for components, `useSomething.ts` for hooks, colocate styles where possible.
- Prefer Tailwind utility classes; keep custom CSS in `globals.css` minimal.
- Keep functions small, pure where possible; prefer `const` over `let`; avoid default exports for shared components.
- Run `npm run lint` before committing; match existing formatting (ESLint + Next.js formatting rules).

## Testing Guidelines
- No dedicated test suite is present. Before pushing:
  - Run `npm run lint`.
  - Smoke test critical flows via `npm run dev` (text-to-speech playback, sharing, toast flows).
- If adding tests, colocate next to source files and use the file suffix `.test.ts`/`.test.tsx`.

## Commit & Pull Request Guidelines
- Commits: concise, present-tense summaries (e.g., `Add waveform zoom control`). Keep related changes together.
- PRs should include:
  - What changed and why (1–2 sentences).
  - Screenshots or short clips for UI updates.
  - Linked issue/Task ID if applicable.
  - Verification notes: commands run (`npm run lint`, manual checks) and any remaining TODOs.

## Security & Configuration Tips
- Required: `OPENAI_API_KEY` in `.env`; optional: `POSTGRES_URL` for sharing. Never commit secrets or `.env` files.
- Review `next.config.ts` and `tailwind.config.mjs` before altering build or styling defaults; keep bundle size in mind when adding dependencies.
