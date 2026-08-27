# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then build for production
- `pnpm lint` — run ESLint over the project
- `pnpm preview` — preview the production build locally

There is no test suite configured in this project (no test runner, no test files).

Package manager: pnpm (see `pnpm-lock.yaml`). The project briefly used npm (`package-lock.json`) but reverted back to pnpm.

## Architecture

Single-page React app that splits 12 players into two balanced 6 vs 6 football teams, with optional "similar player" grouping so grouped players get split across teams rather than stacked on one.

- `src/App.tsx` — shell, renders `TeamOrganizer`.
- `src/components/TeamOrganizer.tsx` — the only stateful component. Owns `players`, `groups`, and `teams` state and passes handlers down; all other components are presentational/controlled.
- `src/components/PlayerForm.tsx` — add a player (capped at 12 total, enforced in `TeamOrganizer`).
- `src/components/GroupPlayers.tsx` — form to tag 2+ players as a "group" (e.g. "Delanteros"); a player can only belong to one group at a time.
- `src/components/PlayerList.tsx` — lists current players and their group tag, if any.
- `src/utils/teamBalancer.ts` — `balanceTeams(players, groups)`: the core algorithm. It shuffles each group internally and alternates members across `team1`/`team2` so grouped players are split, then fills remaining ungrouped players until `team1` reaches 6. Pure function, no side effects — this is the natural place to add new balancing strategies.
- `src/types/index.ts` — `Player` and `PlayerGroup` shapes. A `PlayerGroup` references player IDs, not `Player` objects; `Player.groupId` exists in the type but group membership is actually resolved via `PlayerGroup.players`, not `Player.groupId` (that field is currently unused by the app logic).

State is entirely in-memory (React `useState` in `TeamOrganizer`) — nothing is persisted, so a page refresh clears all players/groups/teams.

Styling is Tailwind CSS v4 via the `@tailwindcss/postcss` PostCSS plugin (see `postcss.config.js`); there is no separate Tailwind theme customization beyond `tailwind.config.js`'s `content` globs.
