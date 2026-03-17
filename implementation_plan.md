# SQLite + Prisma + Admin Auth Implementation Plan

The objective is to replace the static [data.json](file:///i:/weighingtech_src/next-app/metadata.json) with a dynamic SQLite database using Prisma, and secure the admin capabilities to prevent unauthorized modifications, while ensuring the site remains highly performant and SEO-friendly.

## User Review Required

- **Admin Account Creation**: I will seed a default admin user (`admin` / `password123`) which you should change immediately after deployment, or we can use an environment variable to define it.
- **NextAuth (Auth.js) Secret**: A new environment variable `AUTH_SECRET` will be required for the production deployment on your cloud server.

## Proposed Changes

### Setup and Configuration
#### [NEW] [prisma/schema.prisma](file:///i:/weighingtech_src/next-app/prisma/schema.prisma)
Initializes Prisma. Replicates the types from [src/data.ts](file:///i:/weighingtech_src/next-app/src/data.ts) (Categories, Products, Albums, Videos, Contacts) into SQLite relational tables. Adds an `AdminUser` model.
#### [NEW] [.env](file:///i:/weighingtech_src/next-app/.env)
Adds `DATABASE_URL="file:./dev.db"` and `AUTH_SECRET` (if not present).
#### [MODIFY] [package.json](file:///i:/weighingtech_src/next-app/package.json)
Installs dependencies: `prisma`, `@prisma/client`, `next-auth@beta` (Auth.js v5), `bcryptjs`, and `@types/bcryptjs`.

### Authentication
#### [NEW] [src/auth.ts](file:///i:/weighingtech_src/next-app/src/auth.ts)
Configures NextAuth v5 with a Credentials provider. It will verify the login against the `AdminUser` table using `bcrypt`.
#### [NEW] [src/middleware.ts](file:///i:/weighingtech_src/next-app/src/middleware.ts)
Adds Next.js middleware to protect the `/dev-editor` (or `/admin`) routes and `/api/dev/*` routes, redirecting unauthenticated users to `/login`.
#### [NEW] [src/app/login/page.tsx](file:///i:/weighingtech_src/next-app/src/app/login/page.tsx)
A secure admin login page.

### Data Migration
#### [NEW] [prisma/seed.ts](file:///i:/weighingtech_src/next-app/prisma/seed.ts)
A script that reads the current [src/data.json](file:///i:/weighingtech_src/next-app/src/data.json) and inserts all the categories, products, albums, etc., into the new SQLite database. It will also create the default admin user.

### Next.js Integration Migration
#### [MODIFY] [src/app/page.tsx](file:///i:/weighingtech_src/next-app/src/app/page.tsx) (and other frontend pages)
Replaces `import { products } from '@/data'` with `await prisma.product.findMany()`. Wraps these calls with Next.js App Router caching mechanism (e.g., Data Cache) to ensure the initial load speed matches static files, preserving SEO.
#### [MODIFY] [src/app/api/dev/save-data/route.ts](file:///i:/weighingtech_src/next-app/src/app/api/dev/save-data/route.ts)
Replaces the `fs.writeFileSync` logic (which overwrites [data.json](file:///i:/weighingtech_src/next-app/metadata.json)) with fine-grained Prisma `update` and `create` operations.
#### [MODIFY] [src/app/dev-editor/page.tsx](file:///i:/weighingtech_src/next-app/src/app/dev-editor/page.tsx)
Reads current data from Prisma instead of [data.json](file:///i:/weighingtech_src/next-app/metadata.json) for the editor layout, and handles form submission to the updated API.

## Verification Plan

### Automated Tests
1. **Prisma Validation**: Run `npx prisma validate` and `npx prisma db push` to verify the schema and SQLite database creation.
2. **Seed Execution**: Run `npx tsx prisma/seed.ts` and check the database using Prisma Studio (`npx prisma studio`) to ensure [data.json](file:///i:/weighingtech_src/next-app/metadata.json) was properly migrated.
3. **Build Check**: Run `npm run build` to verify that Next.js successfully pre-renders pages fetching from the database.

### Manual Verification
1. Open the application locally and verify that the homepage and product pages display the correct content.
2. Navigate to `/dev-editor`. The middleware should redirect to `/login`.
3. Log in using the seeded admin credentials. It should redirect back to `/dev-editor`.
4. Modify a product in the editor and save it. Verify that the database is updated (via Prisma Studio) and the frontend reflects the change.
