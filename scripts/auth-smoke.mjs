import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
const base=process.env.BUILDOS_URL||'http://127.0.0.1:3000';
const bin=String(Date.now()).slice(-12),password=randomBytes(24).toString('hex');
async function post(path,body,cookie){return fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json',Origin:base,...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)})}
const anonymous=await fetch(base+'/api/workspace');assert.equal(anonymous.status,401);
const account={bin,password,email:`test-${bin}@example.test`,name:'Auth test',company:'Auth smoke fixture'};
const created=await post('/api/auth/register',account);assert.equal(created.status,200);
const cookie=created.headers.get('set-cookie').split(';')[0];assert.ok(created.headers.get('set-cookie').includes('HttpOnly'));
const workspace=await fetch(base+'/api/workspace?role=FOREMAN',{headers:{Cookie:cookie}});assert.equal(workspace.status,200);
const data=await workspace.json();assert.equal(data.company.name,account.company);
const command=await post('/api/workspace/commands',{role:'FOREMAN',action:'newTender',payload:{title:'Session role test',client:'Test'}},cookie);
assert.equal(command.status,200); // Director identity wins over the client-supplied role.
const foreignOrigin=await fetch(base+'/api/workspace/commands',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example',Cookie:cookie},body:'{}'});assert.equal(foreignOrigin.status,403);
const bad=await post('/api/auth/login',{bin,email:account.email,password:'incorrect-password'});assert.equal(bad.status,401);
const logged=await post('/api/auth/login',{bin,email:account.email,password});assert.equal(logged.status,200);
const logout=await post('/api/auth/logout',{},cookie);assert.equal(logout.status,200);
const revoked=await fetch(base+'/api/workspace',{headers:{Cookie:cookie}});assert.equal(revoked.status,401);
console.log('Auth HTTP passed: registration, login, HttpOnly, tenant identity, server role, CSRF, logout/revocation.');
// Fixtures are preserved for inspection; no deletion of user data.
