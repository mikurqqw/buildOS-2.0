# User-defined project structure and site observations

New tender conversions create only a project, preserving the tender name, budget and duration. They no longer create predefined buildings, floors, zones, procurement tasks or AI risks. Existing database records are preserved.

In Projects, authorized users add buildings, floors within those buildings, and zones within floors. These commands write to PostgreSQL. Building/floor IDs are returned in the workspace DTO and checked against the current tenant and project before creating child records. No external service or schema migration is required for this change.

Site observations now use user-entered titles and descriptions, an optional floor from the current project, an optional employee from the same company, priority and optional photo. The screen shows location, assignee, current status and open/all filtering. Users with issue permissions can update statuses. Status transition policies and separate reviewer permissions remain future work; this is not a certified inspection sign-off workflow.

The login screen was restyled with a bounded form, clear spacing, theme-aware surfaces and a compact mobile presentation. Registration is labelled “Create company”, rather than “Create demo company”.

Verified: TypeScript, unit tests, PostgreSQL integration tests and Playwright. Browser scenarios cover real structure creation, floor-bound observations, status updates and screenshots at 375/768/1280/1920 px in both themes. Screenshots/traces remain local and ignored by Git. Existing dependency advisories and unimplemented axe/Lighthouse checks remain unchanged.
