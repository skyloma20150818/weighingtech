<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# api (API Routes)

## Purpose
Next.js Route Handlers providing backend API endpoints for the application.

## Key Files

| File | Description |
|------|-------------|
| `dev/save-data/route.ts` | Save product/category data to database |
| `dev/upload/route.ts` | Handle product image uploads |
| `dev/upload-360/route.ts` | Handle 360-degree image uploads |
| `dev/check-360/route.ts` | Check if product has 360 images |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `dev/` | Development/Admin API endpoints (see `dev/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Route handlers use Web Standard Request/Response
- Each file exports GET, POST, PUT, DELETE functions
- Routes are server-side only

### API Patterns
- Use Prisma client for database operations
- Validate input with Zod or manual checks
- Return proper HTTP status codes

## Dependencies

### Internal
- `../../../../prisma` - Database client

### External
- `@prisma/client` - Database ORM

<!-- MANUAL: -->
