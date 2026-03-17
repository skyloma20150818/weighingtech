<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# prisma

## Purpose
Database schema and migrations using Prisma ORM with SQLite.

## Key Files

| File | Description |
|------|-------------|
| `schema.prisma` | Database schema definition |

## Database Schema

### Models

| Model | Description |
|-------|-------------|
| `AdminUser` | Administrator user accounts (username, password) |
| `Category` | Product categories (zh/en names) |
| `AlbumCategory` | Album/photo gallery categories |
| `SolutionCategory` | Solution/case study categories |
| `Product` | Product information with relations |
| `ProductImage` | Additional product images |
| `ProductSpec` | Product specifications (key-value) |
| `ProductDocument` | Product documentation/files |
| `AlbumItem` | Album/photo gallery items |
| `VideoItem` | Video items for video gallery |
| `Contact` | Contact information (single row) |
| `Consult` | Online consultation settings |
| `About` | About page content |
| `Hero` | Hero/landing section settings |

## For AI Agents

### Working In This Directory
- Run migrations with `npx prisma migrate`
- Sync schema with `npx prisma db push`
- Generate client with `npx prisma generate`

### Common Commands
```bash
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema to DB
npx prisma migrate dev   # Create and apply migration
```

## Dependencies

### External
- `@prisma/client` - Prisma client library
- `@prisma/adapter-libsql` - LibSQL adapter
- `@libsql/client` - LibSQL client

<!-- MANUAL: -->
