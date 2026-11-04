import {test,expect} from '@playwright/test';
import {randomBytes} from 'node:crypto';
test('friendly workspace: forms, chat and responsive screens',async({page,context},testInfo)=>{
 const bin=String(Date.now()).slice(-12);
 const response=await context.request.post('/api/auth/register',{headers:{Origin:'http://127.0.0.1:3000'},data:{bin,password:randomBytes(24).toString('hex'),email:`ui-${bin}@example.test`,name:'Ирина Смирнова',company:'Строй Команда'}});
 expect(response.status()).toBe(200);
 await page.goto('/');await expect(page.getByRole('heading',{name:'Главная',exact:true})).toBeVisible();
 await page.locator('nav').getByRole('button',{name:'Тендеры',exact:true}).click();
 await page.getByRole('button',{name:'Новый тендер',exact:true}).click();
 await page.locator('input[name=title]').fill('ЖК Солнечный');await page.locator('input[name=client]').fill('Наш заказчик');
 await page.locator('input[name=budget]').fill('42000000');await page.locator('input[name=durationMonths]').fill('24');
 await page.getByRole('button',{name:'Создать тендер',exact:true}).click();await expect(page.getByRole('heading',{name:'ЖК Солнечный'})).toBeVisible();
 await expect(page.getByText('Сохранено в PostgreSQL.',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Проанализировать тендер',exact:true}).click();
 await page.getByRole('button',{name:'Отметить победу → Создать проект',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Проекты',level:1,exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'ЖК Солнечный',exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Структура пока не создана'})).toBeVisible();
 await page.locator('.structure-form input[name=name]').fill('Корпус Север');await page.getByRole('button',{name:'Добавить в структуру'}).click();
 await expect(page.locator('.structure-block summary')).toContainText('Корпус Север');
 await page.locator('.structure-form select').first().selectOption('floor');await page.locator('select[name=buildingId]').selectOption({label:'Корпус Север'});await page.locator('input[name=level]').fill('5');await page.getByRole('button',{name:'Добавить в структуру'}).click();
 await expect(page.locator('.floor-card')).toContainText('5');
 await page.locator('nav').getByRole('button',{name:'Работы на объекте',exact:true}).click();await page.getByRole('button',{name:'Добавить замечание'}).click();
 await page.locator('input[name=title]').fill('Требуется исправить окно');await page.locator('textarea[name=description]').fill('Повреждён уплотнитель');await page.locator('select[name=floorId]').selectOption({index:1});await page.getByRole('button',{name:'Сохранить замечание'}).click();await expect(page.locator('.observation-content')).toContainText('Корпус Север');
 await page.locator('.observation-content select').selectOption('IN_PROGRESS');await expect(page.locator('.observation-content select')).toHaveValue('IN_PROGRESS');
 await page.locator('nav').getByRole('button',{name:'Задачи',exact:true}).click();await page.getByRole('button',{name:'Новая задача',exact:true}).click();
 await page.locator('input[name=title]').fill('Проверить окна');await page.locator('input[name=dueDate]').fill('2026-11-20');
 await page.getByRole('button',{name:'Создать задачу',exact:true}).click();await expect(page.getByRole('heading',{name:'Проверить окна',exact:true})).toBeVisible();
 await page.locator('nav').getByRole('button',{name:'Ежедневные отчёты',exact:true}).click();await page.locator('input[name=temperature]').fill('-12.5');await page.locator('input[name=labor]').fill('24');
 await page.getByRole('button',{name:'Сформировать и сохранить',exact:true}).click();await expect(page.locator('.report').last()).toContainText('-12.5°C');
 await page.locator('nav').getByRole('button',{name:'Центр управления ИИ',exact:true}).click();
 await page.locator('.chat-composer textarea').fill('Какие риски есть на проекте?');await page.locator('.chat-composer textarea').press('Enter');
 await expect(page.locator('.chat-message.assistant')).toBeVisible();
 const pages=['Главная','Проекты','Задачи','Ежедневные отчёты','Центр управления ИИ','Команда и компания','Работы на объекте','Обзор','Тендеры','Материалы и закупки'];
 for(const width of [375,768,1280,1920]){
  await page.setViewportSize({width,height:1000});
  for(const theme of ['light','dark']){
   const current=await page.locator('html').getAttribute('data-theme');
   if(current!==theme)await page.getByRole('button',{name:theme==='dark'?'Тёмная тема':'Светлая тема',exact:true}).click();
   for(const [index,name] of pages.entries()){
    await page.locator('nav').getByRole('button',{name,exact:true}).click();
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${name}, ${width}, ${theme}: horizontal overflow`).toBe(true);
    await page.screenshot({path:testInfo.outputPath(`${width}-${theme}-${index}.png`),fullPage:true});
   }
  }
 }
 await page.setViewportSize({width:1280,height:900});
 await page.locator('nav').getByRole('button',{name:'Команда и компания',exact:true}).click();
 const manage=page.getByRole('link',{name:'Участники и права доступа →'});
 await expect(manage).toBeVisible();const rect=await manage.boundingBox();expect(rect?.height).toBeGreaterThanOrEqual(44);
 await page.reload();await page.locator('nav').getByRole('button',{name:'Задачи',exact:true}).click();await expect(page.getByRole('heading',{name:'Проверить окна',exact:true})).toBeVisible();
});
