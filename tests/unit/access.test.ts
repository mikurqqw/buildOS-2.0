import {test} from 'node:test';
import assert from 'node:assert/strict';
import {projectFilter,financialAccess,tenderAccess} from '@/modules/company/access';
import {tenderTransitions} from '@/modules/tenders/transitions';
test('project filter requires membership except for director/accountant',()=>{
 const worker={companyId:'company',userId:'worker',role:'FOREMAN' as const};
 assert.deepEqual(projectFilter(worker),{companyId:'company',members:{some:{userId:'worker'}}});
 assert.deepEqual(projectFilter({...worker,role:'DIRECTOR'}),{companyId:'company'});
 assert.equal(financialAccess(worker),false);assert.equal(tenderAccess(worker),false);
});
test('tender lifecycle has all stages and no direct new-to-won transition',()=>{
 assert.equal(Object.keys(tenderTransitions).length,7);assert.deepEqual(tenderTransitions.NEW,['ANALYSIS','LOST']);
 assert.deepEqual(tenderTransitions.WON,[]);assert.deepEqual(tenderTransitions.LOST,['NEW']);
});
