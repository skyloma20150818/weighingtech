<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# dev (Development API)

## Purpose
Development and admin API endpoints for content management, file uploads, and data synchronization.

## Key Files

| File | Description |
|------|-------------|
| `save-data/route.ts` | POST endpoint to save products, categories, albums to database |
| `upload/route.ts` | POST endpoint for product image uploads (multipart/form-data) |
| `upload-360/route.ts` | POST endpoint for 360-degree product image uploads |
| `check-360/route.ts` | GET endpoint to check if product has 360-degree images |

## For AI Agents

### Working In This Directory
- These are admin/development endpoints
- May require authentication in production
- File uploads saved to `public/uploads/products/{productCode}/`

### Upload Directories
- Product images: `public/uploads/products/{productCode}/`
- 360 images: `public/uploads/products/{productCode}/360/`
- Album images: `public/uploads/albums/`

## Dependencies

### Internal
- `../../../../prisma` - Database client

### External
- `@prisma/client` - Database ORM

<!-- MANUAL: -->
