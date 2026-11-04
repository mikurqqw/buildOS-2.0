import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loginSchema,registerSchema} from '@/modules/company/auth';
import {sameOrigin,tokenHash} from '@/modules/company/session';
test('password boundaries include bcrypt UTF-8 byte limit',()=>{
 const base={email:'a@example.test',bin:'123456789012'};
 assert.equal(loginSchema.safeParse({...base,password:'short'}).success,false);
 assert.equal(loginSchema.safeParse({...base,password:'я'.repeat(40)}).success,false);
 assert.equal(registerSchema.safeParse({...base,password:'a-long-password',company:'Company',name:'Owner'}).success,true);
});
test('cross origin mutations and missing origins are denied',()=>{
 assert.throws(()=>sameOrigin(new Request('https://app.example/api',{headers:{Origin:'https://evil.example'}})));
 assert.throws(()=>sameOrigin(new Request('https://app.example/api')));
 assert.doesNotThrow(()=>sameOrigin(new Request('https://app.example/api',{headers:{Origin:'https://app.example'}})));
 assert.notEqual(tokenHash('secret'),'secret');assert.equal(tokenHash('secret').length,64);
});
