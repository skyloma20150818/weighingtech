<!-- Parent: ../../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# product/[id] (Product Detail Page)

## Purpose
Dynamic route for individual product detail pages.

## Key Files

| File | Description |
|------|-------------|
| `page.tsx` | Main product page component |
| `ProductDetail.tsx` | Product detail content component |
| `code.html` | Static HTML for product code display |
| `screen.png` | Product screenshot image |

## Route Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Product code/ID |

## For AI Agents

### Working In This Directory
- Dynamic route with `[id]` parameter
- Product ID corresponds to product code from database
- Uses 360 viewer component if product has 360 images

### Data Fetching
- Product data loaded from Prisma database
- Falls back to static data if not in DB
- Supports both Chinese and English content

## Dependencies

### Internal
- `../../../components/Product360Viewer.tsx` - 360 viewer
- `../../../components/ProductDetailModal.tsx` - Detail modal

<!-- MANUAL: -->
