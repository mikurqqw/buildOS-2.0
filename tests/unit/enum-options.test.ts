import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { EnumOptions } from '@/components/enum-options';
import { roles } from '@/modules/shared/types';

test('translated role and status labels never change submitted form values',()=>{
 for(const language of ['ru','kk','en'] as const){
  const html=renderToStaticMarkup(createElement('select',{},createElement(EnumOptions,{values:roles,language})));
  for(const role of roles)assert.ok(html.includes(`value="${role}"`));
  const statuses=renderToStaticMarkup(createElement('select',{},createElement(EnumOptions,{values:['TODO','IN_PROGRESS','DONE'],language})));
  assert.ok(statuses.includes('value="IN_PROGRESS"'));
 }
});
