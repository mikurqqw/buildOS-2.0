import { randomUUID, randomInt } from 'node:crypto';
import { db } from '@/server/db';
import { AppError } from '@/server/http/errors';

// Each visitor gets a separate tenant; never grant public access to existing users.
export async function createDemoUser() {
  return db().$transaction(async tx => {
    const key = `demo:${new Date().toISOString().slice(0, 10)}`;
    const quota = await tx.loginAttempt.upsert({
      where: { key }, create: { key, count: 1, windowStart: new Date() },
      update: { count: { increment: 1 } },
    });
    if (quota.count > 100) throw new AppError(429, 'RATE_LIMITED', 'Demo limit reached. Please retry tomorrow.');
    const company = await tx.company.create({ data: {
      name: 'BuildOS · Демо', bin: `98${randomInt(0, 10000000000).toString().padStart(10, '0')}`,
    } });
    const user = await tx.user.create({ data: {
      companyId: company.id, name: 'Демо-пользователь',
      email: `${randomUUID()}@demo.invalid`, role: 'DIRECTOR',
    } });
    const tender = await tx.tender.create({ data: {
      companyId: company.id, title: 'Alatau Residence', clientName: 'Alatau Development',
      estimatedBudget: '8500000000', durationMonths: 18, status: 'WON',
      aiTenderScore: 78, aiMarginPercent: 14,
    } });
    const project = await tx.project.create({ data: {
      companyId: company.id, tenderId: tender.id, name: 'Alatau Residence',
      budget: '8500000000', status: 'ACTIVE', progress: 12,
      startDate: new Date(), endDate: new Date(Date.now() + 548 * 86400000),
    } });
    const building = await tx.building.create({ data: {
      companyId: company.id, projectId: project.id, name: 'Блок А',
    } });
    for (const level of [1, 2]) await tx.floor.create({ data: {
      companyId: company.id, projectId: project.id, buildingId: building.id, level,
    } });
    await tx.task.create({ data: {
      companyId: company.id, projectId: project.id, assigneeId: user.id,
      title: 'Проверить армирование в блоке А', priority: 'HIGH',
      dueDate: new Date(Date.now() + 86400000),
    } });
    return user;
  });
}
