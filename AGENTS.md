<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# next-app (唯英科技官网)

## Purpose
A Next.js 15 website for 唯英科技 (Weighing Technology Co., Ltd), a company specializing in industrial weighing equipment. The site showcases products including platform scales, junction boxes, digital indicators, digital modules, wireless terminals, and axle identification systems.

## Key Files

| File | Description |
|------|-------------|
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.*` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS 4 configuration |
| `prisma/schema.prisma` | Database schema with SQLite |
| `.env.example` | Environment variable template |
| `src/data.json` | Static site configuration data |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | Application source code (see `src/AGENTS.md`) |
| `prisma/` | Database schema and migrations (see `prisma/AGENTS.md`) |
| `public/` | Static assets (images, videos, fonts) |

## For AI Agents

### Working In This Project
- This is a Next.js 15 app using the App Router
- Uses Tailwind CSS 4 for styling
- Prisma with SQLite for data persistence
- Static data loaded from `src/data.json`
- Supports bilingual (Chinese/English) content via `LanguageContext`

### Development Commands
```bash
npm run dev    # Start dev server on port 3000
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Database
- SQLite database via Prisma
- Run `npx prisma db push` to sync schema
- Run `npx prisma studio` to open database GUI

### Common Patterns
- Use `clsx` and `tailwind-merge` for conditional class names
- Components in `src/components/` follow named export pattern
- API routes in `src/app/api/` use Next.js Route Handlers
- Static data centralized in `src/data.json`

## Dependencies

### External
- Next.js 15.x - React framework
- React 19.x - UI library
- Tailwind CSS 4.x - Styling
- Prisma 6.x - Database ORM
- NextAuth 5.x - Authentication
- Lucide React - Icons
- React Quill / React Simple WYSIWYG - Rich text editor

<!-- MANUAL: -->
