import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jsonBody } from '@/server/http/body';
import { AppError, endpoint } from '@/server/http/errors';
import { commandSchema } from '@/modules/workspace/contracts';
import { requirePermission } from '@/modules/company/context';

const request=(body:string,contentType='application/json')=>new Request('http://localhost/api',{method:'POST',headers:{'Content-Type':contentType},body});
test('malformed JSON and unsupported media types have distinct errors',async()=>{
 await assert.rejects(jsonBody(request('{')),e=>e instanceof AppError&&e.status===400);
 await assert.rejects(jsonBody(request('{}','text/plain')),e=>e instanceof AppError&&e.status===415);
});
test('body size is enforced even when Content-Length is absent',async()=>{
 await assert.rejects(jsonBody(request(JSON.stringify({a:'large'})),3),e=>e instanceof AppError&&e.status===413);
});
test('validation errors have a stable envelope, safe details and correlation id',async()=>{
 const response=await endpoint(async()=>commandSchema.parse({action:'invalid'}));
 assert.equal(response.status,422);
 const json=await response.json();assert.equal(json.error.code,'VALIDATION_ERROR');
 assert.ok(Array.isArray(json.error.details));assert.equal(json.requestId,response.headers.get('X-Request-Id'));
 assert.equal(response.headers.get('Cache-Control'),'no-store');
});
test('unexpected failures do not expose database credentials or exception messages',async()=>{
 const response=await endpoint(async()=>{throw new Error('postgresql://private:secret@host/db')});
 assert.equal(response.status,500);assert.ok(!(await response.text()).includes('secret'));
});
test('role checks execute on the server',()=>{
 assert.throws(()=>requirePermission({companyId:'fixture',role:'FOREMAN'},'purchase'),e=>e instanceof AppError&&e.status===403);
 assert.doesNotThrow(()=>requirePermission({companyId:'fixture',role:'FOREMAN'},'issue'));
 assert.doesNotThrow(()=>requirePermission({companyId:'fixture',role:'DIRECTOR'},'purchase'));
});
