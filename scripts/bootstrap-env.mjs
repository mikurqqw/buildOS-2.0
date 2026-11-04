import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (existsSync('.env')) {
  console.log('.env already exists; preserved without changes.');
} else {
  const password = randomBytes(24).toString('hex');
  writeFileSync('.env', `# Generated for local development. Do not commit.\nPOSTGRES_DB=buildos\nPOSTGRES_USER=buildos\nPOSTGRES_PORT=55432\nPOSTGRES_PASSWORD=${password}\nDATABASE_URL="postgresql://buildos:${password}@localhost:55432/buildos?schema=public"\nDEMO_MODE=true\nDEMO_COMPANY_ID=10000000-0000-4000-8000-000000000001\n`, { flag: 'wx' });
  console.log('Created .env with a random local database password.');
}
