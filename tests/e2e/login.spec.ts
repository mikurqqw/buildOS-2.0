import {test,expect} from '@playwright/test';
test('login screen remains readable in both themes',async({page},info)=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Добро пожаловать в BuildOS'})).toBeVisible();
 for(const width of [375,768,1280,1920]){await page.setViewportSize({width,height:1000});for(const theme of ['light','dark']){
  if(await page.locator('html').getAttribute('data-theme')!==theme)await page.getByRole('button',{name:theme==='dark'?'Тёмная тема':'Светлая тема',exact:true}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:info.outputPath(`${width}-${theme}.png`),fullPage:true});
 }}
});
