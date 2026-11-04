# Functional checkpoint: pre-AI workflows

This checkpoint implements the local MVP workflows requested before external AI integration. It is not a production readiness certification.

| Item | Implemented behavior |
|---|---|
| 1. Access | Session-based tenant/role identity; director-managed project membership; tenant-scoped reads/writes. Directors/accountants see all projects; other roles require membership. Project budgets: director/PM/accountant. Cash flow and tender margins: director/accountant. Tenders: director/PM/PTO. Invitations: director only. |
| 2. Tenders | Editing title/client/budget/duration, invalidation of outdated analysis, all seven stages with server-enforced transitions; won tenders are locked. The existing analysis shortcut remains for the investor flow. |
| 3. Projects | Manual creation, editing budget/dates/status, user-defined buildings/floors/zones, rename/level changes and removal of empty structure items. Foreign keys protect referenced data. Duplicate structure creation is rejected. |
| 4. Tasks | Creation/editing, priority/deadline/assignee, issue linkage within the same project, board status tracking. Project progress derives from completed tasks. No separate Gantt scheduling engine was added. |
| 5. Observations | In-progress → ready for review → resolved → closed, with return for correction and reopen. Only director/PM/PTO review. The reporter cannot approve their own observation. Status history is stored with actor/time/note. Legacy observations without reporter IDs cannot enforce this last identity comparison. |
| 6. Materials | Foreman material requests; manager approve/reject; procurement ordered/delivered states; timestamps, decision notes and history. Approval is a human action, not an automatic purchase/order to a supplier. |
| 7. Documents | Private local storage, extension/signature checks, 10 MB cap, versioning and authenticated downloads. Legacy metadata-only rows are labelled as missing files. No malware scanning or document parsing is performed. |
| 8. Overview | Role-aware operational KPIs, overdue work, project progress, approval counts; manual incoming/outgoing/net cash flow for finance roles. This is not accounting. There is no separate contractor registry or forecasting engine. |
| 9. Reports | Create/edit history, weather/manual temperature/workforce/notes and generated summary. |
| 10. Connection loss | Per-user/project local report drafts, new task/observation text drafts, offline submission blocking and manual resend when online. Report client IDs prevent duplicate successful retries. Photos are not persisted in drafts. The application shell is not cached for a fresh offline start; this is not a service-worker/PWA or background synchronization system. |

## Running

Apply all migrations with `npm run db:prepare`; start PostgreSQL (`npm run db:local`) and Next.js (`npm run dev`). Register a company, create a project, then invite staff and assign project access in `/company`. Existing staff outside director/accountant roles need explicit project assignment after this migration.

Documents live under `.data/uploads`; PostgreSQL data under `.data/postgres` for the embedded local setup. Both directories and `.env` must remain outside Git and need backups. Container/cloud deployments need persistent volumes and HTTPS; code publication to GitHub does not provide hosting.

## Checks

`npm test`, `npm run typecheck`, `npm run db:validate`, `npm run test:integration`, `npm run test:e2e`, `npm run test:auth`, `npm run test:company`, `npm run test:documents`, `npm run test:workspace`, `npm run build`.

Integration coverage includes membership grant/revoke, financial redaction, tenant foreign keys, tender stages/editing, manual projects, cross-project task rejection, issue reviews/self-approval rejection, procurement lifecycle, report editing/idempotency and cash-flow permissions. Browser coverage exercises the real forms, offline report restoration and screenshots in both themes at 375/768/1280/1920 pixels.

## Security review and remaining work

No new secrets or external services were connected. API request roles do not override session roles. Project membership is checked at data reads and command writes. Document downloads check membership and return attachments with nosniff; files never execute on the server. Local drafts are plain browser storage scoped by user/project; use trusted devices and do not put secrets in site notes. Report retries are idempotent; task/issue retries are still manual and may duplicate if a successful response is lost. Financial summaries use Decimal in storage and Number for display aggregates; they are not a financial reporting ledger.

Known dependency advisories remain (npm audit fails). Dedicated lint, axe and Lighthouse checks were not introduced. Full production hardening, cross-browser testing, request pagination, backup automation, comprehensive audit logs for access changes, password recovery/verification and full offline synchronization remain separate work. AI integration was deliberately left unchanged.
