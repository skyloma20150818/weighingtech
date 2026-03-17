# Task: SQLite + Prisma Integration & Admin Auth

## 1. Project Setup
- [ ] Install Prisma and initialize SQLite provider.
- [ ] Install NextAuth.js (Auth.js) for Admin authentication + bcryptjs.

## 2. Database Schema
- [ ] Design Prisma Schema (`schema.prisma`) identifying Category, Product, Album, Video, Contact, Consult, About, and Hero structures based on [data.ts](file:///i:/weighingtech_src/next-app/src/data.ts).
- [ ] Incorporate Prisma schema relations.
- [ ] Add `AdminUser` model to Prisma schema for admin credentials.
- [ ] Write a one-time migration script to populate SQLite from [data.json](file:///i:/weighingtech_src/next-app/metadata.json).

## 3. Auth Setup
- [ ] Configure `next-auth` options with Credentials provider.
- [ ] Create Login page for Admin.
- [ ] Update `/dev-editor` route to require authentication.

## 4. Frontend Migration
- [ ] Update [src/app/page.tsx](file:///i:/weighingtech_src/next-app/src/app/page.tsx) and other public pages to fetch data asynchronously via Prisma.
- [ ] Implement Next.js caching logic for these DB calls (using `unstable_cache` or route segment config).

## 5. API / Admin Editor Migration
- [ ] Update the `save-data` API to handle Prisma `update` / `upsert` queries instead of rewriting [data.json](file:///i:/weighingtech_src/next-app/metadata.json).
- [ ] Secure the API routes to only accept requests from authenticated Admin sessions.

## 6. Verification
- [ ] Verify that public pages load.
- [ ] Verify admin router redirects.
- [ ] Verify login flow.
- [ ] Test admin data saving logic to ensure DB handles updates.
