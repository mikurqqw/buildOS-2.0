# Friendly workspace update

Stack: Next.js 15.5.29 App Router, React 19, strict TypeScript, Tailwind 3, Lucide, PostgreSQL 16 and Prisma 6.19.3. Playwright 1.64.1 is a development-only dependency approved for local browser verification.

## Changes

- Added a Home page with clear entry points and a brief description for every workspace section.
- Adjusted navigation spacing, company identity, profile name, collapsed avatar sizing and mobile navigation.
- Fixed the management link's display and vertical spacing. Links and buttons use a consistent minimum height.
- Removed database success notices and technical database labels from workspace UI. Errors remain visible; purchase generation still confirms pending approval.
- Added custom tender title, client, budget and duration. Budget uses Decimal in PostgreSQL; duration is validated from 1 to 120 months. Conversion preserves the entered title, budget and duration.
- Added task creation with title, notes, deadline, priority and an optional assignee belonging to the same company.
- Added manual temperature from −60 to +60 °C with one decimal place. Existing report data remains readable.
- Replaced text-tree characters with expandable building sections, floor cards and zone labels.
- Added an inline project chat with message history during the current visit, loading/errors, Enter to send and Shift+Enter for a newline. Switching projects clears chat context. The backend remains explicitly mocked; no AI service was connected.
- Kept Russian, Kazakh and English UI labels and both themes.

## Verification

```powershell
npm run test:workspace
npm run test:e2e
npm run test:integration
npm run test:company
npm run test:auth
npm test
npm run typecheck
npm run db:validate
npm run build
```

The browser test creates its own account and project, exercises the actual forms and chat, and captures screenshots at 375/768/1280/1920 px in light/dark themes. It asserts no page-level horizontal overflow and at least 44px height for the management link. Screenshots are local under `test-results/` and excluded from Git because traces can contain test session cookies. They must not be published.

## Security and limits

New write operations use the existing verified session, server-side role policy and tenant context. Assignees are checked against the current company, with composite foreign keys as a second boundary. Server schemas validate money, dates, duration, temperatures and priorities; migration adds a database constraint for duration. No secrets were added.

No live weather service, external AI or mail provider is required. Chat history is not persisted. Report weather/temperature is stored in the existing weather string to keep old reports compatible. Full production RBAC, document binary storage and the remaining original MVP work are outside this UI iteration. Existing npm advisories remain. Automated axe/Lighthouse and a dedicated linter were not added in this change.
