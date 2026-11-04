import assert from 'node:assert/strict';
const base=process.env.BUILDOS_URL||'http://127.0.0.1:3000';
const health=await fetch(`${base}/api/health`);
assert.equal(health.status,200);assert.equal((await health.json()).database,'postgresql');
const page=await fetch(base);assert.equal(page.status,200);const html=await page.text();assert.ok(html.includes('lang="ru"'));assert.ok(html.includes('data-theme="light"'));
const workspace=await fetch(`${base}/api/workspace?role=DIRECTOR`);assert.equal(workspace.status,401);
console.log('Anonymous workspace access rejected. Run npm run test:auth for authenticated HTTP coverage.');
