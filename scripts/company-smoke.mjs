import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const base=process.env.BUILDOS_URL||'http://127.0.0.1:3000';
const bin=String(Date.now()).slice(-12),password=randomBytes(24).toString('hex');
async function post(path,body,cookie){return fetch(base+path,{method:'POST',headers:{Origin:base,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)})}
const owner=await post('/api/auth/register',{bin,password,email:`owner-${bin}@example.test`,name:'Owner',company:'Company management test'});assert.equal(owner.status,200);
const cookie=owner.headers.get('set-cookie').split(';')[0];
const invitation=await post('/api/company',{action:'invite',email:`worker-${bin}@example.test`,name:'Worker',role:'FOREMAN'},cookie);assert.equal(invitation.status,200);
const {token}=await invitation.json();assert.ok(token);
const initial=await fetch(base+'/api/company',{headers:{Cookie:cookie}});const snapshot=await initial.json();assert.ok(!JSON.stringify(snapshot).includes(token));
const accept=await post('/api/invitations/accept',{token,password});assert.equal(accept.status,200);const workerCookie=accept.headers.get('set-cookie').split(';')[0];
const reused=await post('/api/invitations/accept',{token,password});assert.equal(reused.status,410);
const forbidden=await post('/api/company',{action:'company',name:'Hijacked',address:''},workerCookie);assert.equal(forbidden.status,403);
const workerWorkspace=await fetch(base+'/api/workspace',{headers:{Cookie:workerCookie}});const workerData=await workerWorkspace.json();assert.equal(workerData.company.id,(await owner.json()).user.companyId);
const worker=workerData.state.users.find(u=>u.email===`worker-${bin}@example.test`);
async function workspaceCommand(action,payload){const response=await post('/api/workspace/commands',{role:'DIRECTOR',action,payload},cookie);assert.equal(response.status,200);return (await response.json()).state}
let state=await workspaceCommand('newTender',{title:'Access test project',client:'Access client'});
const tenderId=state.tenders[0].id;await workspaceCommand('analyze',{id:tenderId});state=await workspaceCommand('convert',{id:tenderId});const projectId=state.projects[0].id;
async function employeeWorkspace(){return (await (await fetch(base+'/api/workspace',{headers:{Cookie:workerCookie}})).json()).state}
assert.equal((await employeeWorkspace()).projects.length,0);
assert.equal((await post('/api/company',{action:'membership',userId:worker.id,projectId,enabled:'true'},cookie)).status,200);
let assigned=await employeeWorkspace();assert.equal(assigned.projects.length,1);assert.equal(assigned.projects[0].budget,0);assert.equal(assigned.tenders.length,0);
assert.equal((await post('/api/company',{action:'membership',userId:worker.id,projectId,enabled:'false'},cookie)).status,200);
assert.equal((await employeeWorkspace()).projects.length,0);
const deniedWrite=await post('/api/workspace/commands',{action:'issue',role:'DIRECTOR',payload:{projectId,title:'Denied issue',description:'No membership'}},workerCookie);assert.equal(deniedWrite.status,404);
const change=await post('/api/company',{action:'role',userId:worker.id,role:'PTO'},cookie);assert.equal(change.status,200);
const revokedSession=await fetch(base+'/api/workspace',{headers:{Cookie:workerCookie}});assert.equal(revokedSession.status,401);
const selfChange=await post('/api/company',{action:'role',userId:snapshot.viewerId,role:'FOREMAN'},cookie);assert.equal(selfChange.status,409);
const second=await post('/api/company',{action:'invite',email:`second-${bin}@example.test`,name:'Second',role:'PTO'},cookie);const secondToken=(await second.json()).token;
const updated=await fetch(base+'/api/company',{headers:{Cookie:cookie}});const pending=(await updated.json()).invitations.find(i=>i.email===`second-${bin}@example.test`);
assert.equal((await post('/api/company',{action:'revoke',id:pending.id},cookie)).status,200);
assert.equal((await post('/api/invitations/accept',{token:secondToken,password})).status,410);
assert.equal((await post('/api/company',{action:'company',name:'Updated company',address:'Almaty'},cookie)).status,200);
console.log('Company HTTP passed: invite/accept/replay prevention, role checks, revocation, session invalidation, company update.');
