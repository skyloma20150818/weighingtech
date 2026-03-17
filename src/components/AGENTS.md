<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-17 | Updated: 2026-03-17 -->

# components

## Purpose
Reusable React components for the weighing technology website.

## Key Files

| File | Description |
|------|-------------|
| `Header.tsx` | Site header with navigation and language switcher |
| `Footer.tsx` | Site footer with contact information |
| `ClientLayout.tsx` | Client-side layout wrapper |
| `LanguageContext.tsx` | React context for bilingual (zh/en) support |
| `Product360Viewer.tsx` | 360-degree product image viewer |
| `ProductDetailModal.tsx` | Modal for displaying product details |

## For AI Agents

### Working In This Directory
- All UI components go here
- Use named exports
- Follow React 19 patterns
- Use Tailwind CSS for styling

### Styling Conventions
- Use `clsx` and `tailwind-merge` for conditional classes
- Follow mobile-first responsive design
- Use Tailwind CSS 4 features

### Testing
- Components can be tested with React Testing Library
- Run `npm run test` if tests exist

## Dependencies

### Internal
- `../i18n.ts` - i18n configuration
- `../data.json` - Static data

### External
- `lucide-react` - Icons
- `react` - UI library

<!-- MANUAL: -->
