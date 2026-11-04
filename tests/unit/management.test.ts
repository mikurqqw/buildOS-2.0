import {test} from 'node:test';
import assert from 'node:assert/strict';
import {managementSchema,acceptSchema} from '@/modules/company/management';
test('management rejects unknown roles, company overrides and invalid invitation tokens',()=>{
 assert.equal(managementSchema.safeParse({action:'invite',name:'Worker',email:'worker@example.test',role:'ADMIN'}).success,false);
 assert.equal(managementSchema.safeParse({action:'company',name:'Company',address:'',companyId:'foreign'}).success,false);
 assert.equal(acceptSchema.safeParse({token:'invalid',password:'a-long-password'}).success,false);
 assert.equal(acceptSchema.safeParse({token:'a'.repeat(64),password:'я'.repeat(40)}).success,false);
});
