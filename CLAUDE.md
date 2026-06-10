# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`react-compose-provider` is a tiny npm library published to npm. It exports a single function, `composeProvider`, which nests multiple React provider components into one (first argument becomes outermost). The entire implementation lives in `src/index.tsx`.

## Commands

- `npm run build`: production webpack build to `dist/` (UMD bundle + `.d.ts` declarations). `dist/` is gitignored; it's built locally and shipped to npm via the package.json `files` field, so always run a build before `npm publish`.
- `npm start`: webpack watch mode (development build).
- `npm run lint`: ESLint (airbnb-typescript config, 4-space indent).
- `npm test`: vitest (tests live in `src/*.test.tsx`, rendered with `react-dom/server`, no jsdom). Run a single test with `npx vitest run -t "<test name>"`.

## Architecture

- `src/index.tsx` is the only source file and the webpack entry point.
- Webpack outputs a UMD library with `react` and `react-dom` as externals (they are peer dependencies, never bundled). The build also runs ESLint via `eslint-webpack-plugin` and prepends the LICENSE as a banner.
- TypeScript declarations are emitted by `ts-loader` into `dist/` alongside the bundle. The build uses `tsconfig.build.json` (which excludes `*.test.tsx`) so test declarations never land in `dist/`; the root `tsconfig.json` includes tests for ESLint and the IDE.
- Peer deps allow React 18 and 19; keep changes compatible with both.

## Agent skills

### Issue tracker

Issues are tracked as local markdown files under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical defaults (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
