# Company management

This feature runs entirely inside BuildOS and PostgreSQL. It does not require email, cloud storage or an external identity provider.

## Director workflow

1. Register a company at `/` or sign in to your existing director account.
2. Open `/company` from Team & company → People & permissions.
3. Update the company name and address. BIN remains immutable in this screen.
4. Enter a colleague's name, email and one of the six roles to generate an invitation.
5. Copy the link and share it privately yourself. The app does not send messages.
6. The employee opens `/join#TOKEN`, chooses a password and joins the inviting company.
7. Revoke an outstanding invitation from the list when needed.

Invitation tokens are displayed only in the generation response, stored as SHA-256 hashes, expire after seven days and can be consumed once. A newly generated invitation for the same email invalidates the earlier token. The URL fragment is removed from the address bar when the join page loads, and is not sent in ordinary HTTP requests/referrers. Reloading the join page requires reopening the original link.

Links generated on localhost work only on the same computer. For remote employees, a reachable HTTPS deployment is required; no deployment or email service is configured by this feature.

## Roles and sessions

Only a session-verified director can read the management API or change a company, roles and invitations. All user and invitation identifiers are scoped to the director's company. Directors cannot change their own roles. Role changes revoke the employee's existing sessions. A company row lock serializes management changes; invitation acceptance uses an atomic conditional update to prevent replay.

## Verification

With the local app and database running:

```powershell
npm run test:company
npm run test:auth
npm run test:integration
npm test
npm run typecheck
npm run db:validate
npm run build
```

HTTP fixtures use generated test companies and are retained for inspection. No real email is sent. Verified cases include single-use acceptance, revocation, worker permission denial, role-change session revocation, own-role protection and company updates.

## Remaining limitations

The rest of the original MVP remains in progress. Complete per-role read filtering, project membership and audit-event persistence are not implemented by this feature. Production abuse protection and dependencies require further work. Visual multi-viewport screenshot checks, axe and Lighthouse were not run for these screens. No new dependencies were added.
