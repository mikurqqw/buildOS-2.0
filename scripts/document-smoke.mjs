import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
const base='http://127.0.0.1:3000',bin=String(Date.now()).slice(-12);
const signup=await fetch(base+'/api/auth/register',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({bin,password:randomBytes(24).toString('hex'),email:`docs-${bin}@example.test`,name:'Docs QA',company:'Docs QA'})});assert.equal(signup.status,200);const cookie=signup.headers.get('set-cookie').split(';')[0];
async function command(action,payload){const r=await fetch(base+'/api/workspace/commands',{method:'POST',headers:{Origin:base,Cookie:cookie,'Content-Type':'application/json'},body:JSON.stringify({role:'DIRECTOR',action,payload})});assert.equal(r.status,200);return (await r.json()).state}
const project=(await command('createProject',{name:'Docs project',budget:'50000',startDate:'2026-11-01',endDate:'2027-11-01',status:'PLANNING'})).projects[0];
async function upload(bytes){const f=new FormData();f.set('projectId',project.id);f.set('file',new File([bytes],'specification.pdf',{type:'application/pdf'}));return fetch(base+'/api/documents',{method:'POST',headers:{Origin:base,Cookie:cookie},body:f})}
assert.equal((await upload('fake PDF')).status,422);
const pdf='%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF';
const first=await upload(pdf);assert.equal(first.status,200);const data=await first.json();const doc=data.state.documents[0];
const second=await upload(pdf);assert.equal(second.status,200);assert.deepEqual((await second.json()).state.documents.map(d=>d.version),[1,2]);
const download=await fetch(base+'/api/documents/'+doc.id,{headers:{Cookie:cookie}});assert.equal(download.status,200);assert.equal(await download.text(),pdf);assert.ok(download.headers.get('content-disposition').startsWith('attachment;'));
const denied=await fetch(base+'/api/documents/'+doc.id);assert.equal(denied.status,401);
console.log('Document storage passed: signature check, private download, exact bytes and versioning.');
