# Free hosting: Render + Neon

Render hosts the full Next.js server; Neon hosts PostgreSQL. No paid resources are declared in render.yaml. Documents uploaded by this version are stored in PostgreSQL, so Render's ephemeral filesystem does not erase them. Legacy local uploads stay on the original computer until migrated; neither local database records nor files are automatically sent to the cloud.

## Account setup required

1. Sign in at https://console.neon.tech using your GitHub account. Create a **Free** project and a database `buildos` in an EU region.
2. Copy its **direct PostgreSQL connection string** with TLS (`sslmode=require`). Keep it private; do not put it in GitHub or chat.
3. Open https://dashboard.render.com/select-repo?type=blueprint and choose `mikurqqw/buildOS-2.0` / `main`.
4. Render reads render.yaml. Verify the web service plan is **Free**. Set `DATABASE_URL` to the Neon connection string in Render's secret environment field. Do not add a paid disk/database.
5. Deploy. Migrations run at startup. No seed is run against the cloud database.
6. Open the assigned HTTPS onrender.com URL. `/api/health` must report `status: ok`. Register a new company and verify upload/download.

First access after inactivity may be slow because free services sleep. Neon Free has storage/compute/transfer quotas, including uploaded files. Inspect the current dashboards before using real data; do not enable paid upgrades or autoscaling. This is free-tier hosting, not a production SLA.

Until the accounts are authenticated and DATABASE_URL is entered in Render, the application cannot be published from this workspace. A successful local build or Git push is not a verified deployment. Existing dependency advisories still need remediation before production use.
