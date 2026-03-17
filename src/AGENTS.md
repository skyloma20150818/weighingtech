<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# src

## Purpose
Main application source directory containing React components, Next.js pages, API routes, and configuration files.

## Key Files

| File | Description |
|------|-------------|
| `data.json` | Static configuration data (categories, albums, solutions, contact info) |
| `data.ts` | TypeScript types and helpers for data |
| `i18n.ts` | Internationalization configuration |
| `middleware.ts` | Next.js middleware for routing/headers |
| `update_data.cjs` | Script to update product data from JSON to database |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `app/` | Next.js App Router pages and API routes (see `app/AGENTS.md`) |
| `components/` | Reusable React components (see `components/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Primary source code location
- All TypeScript/TSX files go here
- Shared utilities and types at root level

### Common Patterns
- Use named exports for components
- Follow React 19 conventions
- Use TypeScript strict mode

## Dependencies

### Internal
- `components/` - UI components
- `app/` - Pages and API routes

### External
- next - Framework
- react - UI library

<!-- MANUAL: -->
