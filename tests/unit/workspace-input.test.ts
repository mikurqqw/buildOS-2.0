import {test} from 'node:test';
import assert from 'node:assert/strict';
import {commandSchema} from '@/modules/workspace/contracts';
const projectId='10000000-0000-4000-8000-000000000001';
test('custom tender validates budget and duration',()=>{
 const tender=(budget:string,durationMonths:string)=>commandSchema.safeParse({action:'newTender',role:'DIRECTOR',payload:{title:'My tender',client:'My client',budget,durationMonths}}).success;
 assert.equal(tender('123456.78','24'),true);assert.equal(tender('-1','18'),false);assert.equal(tender('1','0'),false);assert.equal(tender('1','121'),false);assert.equal(tender('1.001','18'),false);
});
test('task creation requires title, valid date and priority',()=>{
 const payload={projectId,title:'Install windows',dueDate:'2026-11-10',priority:'HIGH',assigneeId:''};
 assert.equal(commandSchema.safeParse({action:'createTask',role:'FOREMAN',payload}).success,true);
 assert.equal(commandSchema.safeParse({action:'createTask',role:'FOREMAN',payload:{...payload,title:' '}}).success,false);
 assert.equal(commandSchema.safeParse({action:'createTask',role:'FOREMAN',payload:{...payload,dueDate:'2026-02-30'}}).success,false);
});
test('manual temperature accepts negative decimals and rejects impossible values',()=>{
 const report=(temperature:string)=>commandSchema.safeParse({action:'report',role:'FOREMAN',payload:{projectId,date:'2026-11-04',weather:'Snow',temperature,labor:'12'}}).success;
 assert.equal(report('-12.5'),true);assert.equal(report('60'),true);assert.equal(report('61'),false);assert.equal(report('-61'),false);assert.equal(report('warm'),false);
});
