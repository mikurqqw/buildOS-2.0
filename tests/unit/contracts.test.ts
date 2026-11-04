import { test } from 'node:test';
import assert from 'node:assert/strict';
import { commandSchema, aiSchema, workspaceQuery } from '@/modules/workspace/contracts';
const projectId='10000000-0000-4000-8000-000000000001';
test('commands reject browser state and client tenant overrides',()=>{
 const input={action:'newTender',role:'DIRECTOR',payload:{title:'Alatau',client:'Client'}};
 assert.equal(commandSchema.parse(input).payload.language,'ru');
 assert.equal(commandSchema.safeParse({...input,state:{}}).success,false);
 assert.equal(commandSchema.safeParse({...input,companyId:projectId}).success,false);
 assert.equal(commandSchema.safeParse({...input,payload:{...input.payload,companyId:projectId}}).success,false);
});
test('unknown action, role, status and malformed identifiers are rejected',()=>{
 assert.equal(commandSchema.safeParse({action:'deleteAll',role:'DIRECTOR',payload:{}}).success,false);
 assert.equal(workspaceQuery.safeParse({role:'ADMIN'}).success,false);
 assert.equal(commandSchema.safeParse({action:'task',role:'FOREMAN',payload:{projectId,id:projectId,status:'CLOSED'}}).success,false);
 assert.equal(commandSchema.safeParse({action:'convert',role:'DIRECTOR',payload:{id:'invalid'}}).success,false);
});
test('report calendar dates and labor count are validated',()=>{
 const report=(date:string,labor:string)=>commandSchema.safeParse({action:'report',role:'FOREMAN',payload:{projectId,date,labor,weather:'Rain'}}).success;
 assert.equal(report('2026-02-29','24'),false);
 assert.equal(report('2028-02-29','24'),true);
 assert.equal(report('2026-10-10','-1'),false);
 assert.equal(report('2026-10-10','10001'),false);
});
test('photos disallow remote URLs and SVG while document names enforce allowed extensions',()=>{
 const issue=(imageUrl:string)=>commandSchema.safeParse({action:'issue',role:'FOREMAN',payload:{projectId,title:'Mesh',description:'Inspect',imageUrl}}).success;
 assert.equal(issue('https://example.com/photo.jpg'),false);
 assert.equal(issue('data:image/svg+xml;base64,AAAA'),false);
 assert.equal(issue('data:image/png;base64,AAAA'),true);
 assert.equal(commandSchema.safeParse({action:'document',role:'PTO',payload:{projectId,name:'drawing.exe'}}).success,false);
});
test('assistant only accepts a project reference, not invented live counts',()=>{
 const input={role:'FOREMAN',question:'Main risks?',projectId,language:'kk'};
 assert.equal(aiSchema.safeParse(input).success,true);
 assert.equal(aiSchema.safeParse({...input,openIssues:999}).success,false);
 assert.equal(aiSchema.safeParse({...input,question:'  '}).success,false);
 assert.equal(aiSchema.safeParse({...input,language:'de'}).success,false);
});
