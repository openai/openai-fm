# Contributor Guide

This document provides guidelines and instructions for contributors new to the OpenAI.fm codebase.

## Repository Structure

- **src/**
  - **app/** Next.js App Router directory; contains pages (`page.tsx`, `layout.tsx`), global styles, and API routes (`api/`).
  - **components/** Reusable React components.
  - **hooks/** Custom React hooks.
  - **lib/** Utility functions and helpers.
- **public/** Static assets (images, icons, etc.).
- **node_modules/** Installed dependencies.
- **package.json** Project metadata, dependencies, and scripts.
- **tsconfig.json** TypeScript configuration.
- **eslint.config.mjs** ESLint configuration.
- **postcss.config.mjs**, **tailwind.config.mjs** CSS build configuration.
- **next.config.ts** Next.js configuration.
- **global.d.ts** Custom type declarations.
- **README.md** Project overview and environment variables.
- **AGENTS.md** This contributor guide.

## How to Test / Check Your Work

### Programmatic Checks

- **Lint:** `npm run lint` (runs `next lint`) to check JavaScript/TypeScript and JSX.
- **Type-check:** `npx tsc --noEmit` to ensure TypeScript types are valid.
- TODO: Add automated tests and test runner; update this section when tests are introduced.

### Manual Testing

- Start development server: `npm run dev`.
- Interact with the application in the browser to verify UI behavior.
- TODO: Document manual test cases for key user flows.

## Repo-specific Utilities

- `npm run dev` — Runs Next.js in development mode with TurboPack.
- `npm run build` — Builds the application for production.
- `npm run start` — Starts the production server.
- `npm run lint` — Runs ESLint to enforce code style.

## Pull Request (PR) Guidelines

- Ensure all programmatic checks pass before submitting: lint and type-check.
- Provide a clear, descriptive PR title and body that includes:
  - What changed and why.
  - How to test the change.
  - Any relevant screenshots for UI updates.
- Keep PRs focused and avoid unrelated changes.
- TODO: Add PR template for consistent submissions.

## Commit Message Guidelines

- Use Conventional Commits style prefixes: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`.
- Write commit messages in the imperative present tense.
- Limit the subject line to 50 characters when possible; wrap body at 72 characters.
- Provide additional context in the commit body if necessary.

## Reviewer Checklist

- [ ] Code compiles without errors.
- [ ] Programmatic checks (lint, type-check) pass.
- [ ] Manual testing verifies behavior.
- [ ] Documentation and comments are up to date.
- [ ] Commit messages and PR description follow guidelines.
- [ ] No lingering `console.log` or debug code.
- [ ] Comments end with a period.

## Style and Conventions

- Follow ESLint rules defined in `eslint.config.mjs`.
- Use Tailwind CSS classes for styling; refer to `tailwind.config.mjs` for theme.
- Prefer small, focused components in `src/components/`.
- Write full sentences in comments and doc blocks; end with a period.
- TODO: Enforce comment style via linting when supported.
