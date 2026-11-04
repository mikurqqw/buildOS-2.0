# Implementation status — 2026-11-04

Authentication now uses registered companies (12-digit BIN), bcrypt passwords (12+ characters, at most 72 UTF-8 bytes), database sessions and HttpOnly SameSite cookies. Production requires HTTPS for Secure cookies. API role and company identity are derived from the session; changing a request's role does not change privileges. Cross-origin mutations are rejected. Login attempts are limited per company/email in PostgreSQL.

Existing seed users have no password and cannot log in. Register a new company from the login screen. Demo localStorage flags no longer authenticate. Run `npm run db:prepare` before starting this version.

This iteration does not complete the original specification. Remaining: invitation acceptance/delivery, full read-level RBAC and financial filtering, company/user management, project membership, complete tender transitions, editable spatial hierarchy, binary document storage, task creation and issue lifecycle UI, approval decisions, dashboards, offline drafts, automated browser/a11y/performance checks. AI integration is deliberately last; the provided key was not stored or committed.

Security limitations: login limiting is per account, not per IP; registration needs deployment-level abuse controls; sessions have a seven-day absolute lifetime without rotation; audit events, password reset and email verification remain outstanding. The current role policies need full review before public deployment. Dependency audit still reports vulnerabilities. Do not deploy publicly as production-ready SaaS.

GitHub target: https://github.com/mikurqqw/buildOS-2.0 . Publication requires authenticated GitHub access. Publishing code is separate from hosting a running application.
