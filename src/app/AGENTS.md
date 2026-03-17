<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# app (Next.js App Router)

## Purpose
Next.js 15 App Router directory containing pages, layouts, API routes, and static assets.

## Key Files

| File | Description |
|------|-------------|
| `layout.tsx` | Root layout with providers (LanguageContext) |
| `page.tsx` | Homepage |
| `globals.css` | Global Tailwind CSS styles |
| `dev-editor/page.tsx` | Developer editor for managing content |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `product/[id]/` | Dynamic product detail pages (see `product/[id]/AGENTS.md`) |
| `api/` | API route handlers (see `api/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- App Router uses directory-based routing
- `layout.tsx` provides shared UI shell
- Dynamic routes use `[folder]` syntax

### File Conventions
- `page.tsx` - Route component
- `layout.tsx` - Layout wrapper
- `loading.tsx` - Loading UI
- `error.tsx` - Error boundary
- `not-found.tsx` - 404 page

## Dependencies

### Internal
- `../components/` - Reusable UI components

<!-- MANUAL: -->
