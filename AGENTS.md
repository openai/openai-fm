# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router entry; `page.tsx`, `layout.tsx`, global styles, and API routes under `api/` for generate/share features.
- `src/components`: Feature and UI components (`TTSPage`, controls, dialogs) plus primitives in `components/ui`.
- `src/hooks`: Custom hooks for audio, clipboard, scrolling, and service worker behavior.
- `src/lib`: Shared state (`store.ts` with Zustand), prompt/voice data, utilities, and types.
- `public`: Static assets including `screenshot.jpg`. Add new static files here.

## Build, Test, and Development Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start the dev server (Turbopack) at `http://localhost:3000`.
- `npm run build`: Produce a production build.
- `npm run start`: Serve the production build.
- `npm run lint`: Run ESLint (Next.js config); fix style issues before opening a PR.

## Coding Style & Naming Conventions
- TypeScript + React function components; add `"use client"` to client components that touch browser APIs.
- Use 2-space indentation; keep imports ordered: core libs, third-party, internal modules.
- Naming: `PascalCase` for components, `useX` for hooks, `camelCase` for variables/functions, and descriptive file names (e.g., `DownloadButton.tsx`).
- Styling via Tailwind utility classes; prefer existing UI primitives over ad-hoc inline styles.

## Testing Guidelines
- No automated test suite is defined yet. Run `npm run lint` and manually verify key flows: generate, play/pause, download, share (with Postgres configured), and fallback handling when service workers are missing.
- If you add tests, colocate them near the feature or under `__tests__`, and cover store updates, API route behavior, and UI states. Document new commands in this file.

## Commit & Pull Request Guidelines
- Use short, imperative commit messages (e.g., `add voice picker guard`). Keep commits focused.
- Before a PR: `npm run lint`; for larger changes also run `npm run build`.
- PR description should include: summary, linked issue (if any), notes on env/config changes, and screenshots or recordings for UI changes. Mention manual verification steps taken.

## Security & Configuration Tips
- Required env: `OPENAI_API_KEY` for text-to-speech. Sharing features need Postgres connection strings (`POSTGRES_URL`, etc.) as in `.env.example`. Do not commit secrets.
- Avoid logging API keys or responses that include sensitive data. Validate inputs on API routes to prevent misuse.
