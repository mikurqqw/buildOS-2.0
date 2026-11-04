import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const base='http://127.0.0.1:3000',bin=String(Date.now()).slice(-12);
const registration=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({bin,password:randomBytes(24).toString('hex'),name:'Workflow QA',company:'Workflow QA',email:`qa-${bin}@example.test`})});assert.equal(registration.status,200);
const cookie=registration.headers.get('set-cookie').split(';')[0];
async function command(action,payload){const r=await fetch(base+'/api/workspace/commands',{method:'POST',headers:{'Content-Type':'application/json',Origin:base,Cookie:cookie},body:JSON.stringify({role:'DIRECTOR',action,payload})});assert.equal(r.status,200,await r.clone().text());return (await r.json()).state}
let s=await command('newTender',{title:'Custom residential project',client:'My customer',budget:'123456789.50',durationMonths:'24'});
const tender=s.tenders[0];assert.equal(tender.budget,123456789.5);assert.equal(tender.durationMonths,24);
await command('analyze',{id:tender.id});s=await command('convert',{id:tender.id});const projectId=s.projects[0].id;assert.equal(s.projects[0].name,'Custom residential project');
const foreign=await command('createTask',{projectId,title:'My field task',description:'Custom notes',dueDate:'2026-11-20',priority:'HIGH',assigneeId:s.users[0].id});assert.ok(foreign.tasks.some(t=>t.title==='My field task'&&t.priority==='HIGH'));
s=await command('report',{projectId,date:'2026-11-04',weather:'Snow',temperature:'-12.5',labor:'15',notes:'Cold weather'});assert.equal(s.reports[0].weather,'Snow · -12.5°C');
const reload=await fetch(base+'/api/workspace',{headers:{Cookie:cookie}});const persisted=(await reload.json()).state;assert.equal(persisted.reports[0].weather,'Snow · -12.5°C');assert.ok(persisted.tasks.some(t=>t.title==='My field task'));
console.log('Custom workflow passed: tender budget/duration, converted name, assigned task, manual temperature and persistence.');
