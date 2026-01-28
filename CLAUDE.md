# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AD Tool is a quick reference web app for Antimatter Dimensions Eternity Challenges. It helps players look up which Time Study splits to use for each challenge.

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production (runs tsc then vite build)
pnpm lint     # Run ESLint
pnpm preview  # Preview production build
```

## Architecture

- **React + TypeScript + Vite** - Single page application
- **Tailwind CSS v4** - Styling via `@tailwindcss/vite` plugin
- Data is statically defined in `src/data/challenges.ts`

## Key Domain Concepts

### Eternity Challenges (ECs)
- 12 challenges (EC1-EC12), each completed 5 times (x1-x5)
- Each completion has recommended Time Studies (TS)

### Splits (the core feature)
The app displays which split path to use for each EC:

**Dimension Split** (TS 71-103):
- Antimatter: 71, 81, 91, 101 (green)
- Infinity: 72, 82, 92, 102 (orange)
- Time: 73, 83, 93, 103 (purple)

**Pace Split** (TS 121-141):
- Active: 121, 131, 141 (red)
- Passive: 122, 132, 142 (purple)
- Idle: 123, 133, 143 (blue)

### Data Structure
`src/data/challenges.ts` contains:
- Raw data extracted from the community spreadsheet CSV
- `getChallenges()` parses raw data and detects splits from time study arrays
- Exported `challenges` array of 12 `EternityChallenge` objects

## UI Pattern
- ECs with consistent splits across all 5 completions show compact (single row)
- ECs with varying splits expand to show each completion level
