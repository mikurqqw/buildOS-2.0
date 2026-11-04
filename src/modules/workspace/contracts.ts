import { z } from 'zod';
import { roles } from '@/lib/domain';

const text = z.string().trim().min(1).max(500);
const uuid = z.string().uuid();
const language = z.enum(['ru','kk','en']).default('ru');
const common = { language, projectId: uuid.or(z.literal('')).optional() };
const project = { ...common, projectId: uuid };
const command = <A extends string, T extends z.ZodRawShape>(action: A, fields: T) => z.object({
  action: z.literal(action), role: z.enum(roles), payload: z.object(fields).strict(),
}).strict();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => { const d = new Date(`${v}T00:00:00Z`); return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === v; }, 'Invalid calendar date');
export const commandSchema = z.discriminatedUnion('action', [
  command('newTender', { ...common, title: text, client: text,budget:z.string().regex(/^\d{1,12}(\.\d{1,2})?$/).default('8500000000'),durationMonths:z.string().regex(/^\d{1,3}$/).refine(v=>Number(v)>0&&Number(v)<=120).default('18'), document: z.string().max(255).optional() }),
  command('createTask',{...project,title:text,description:z.string().max(5000).optional(),dueDate:date,priority:z.enum(['LOW','MEDIUM','HIGH','CRITICAL']),assigneeId:uuid.or(z.literal('')).optional()}),
  command('analyze', { ...common, id: uuid }),
  command('convert', { ...common, id: uuid }),
  command('issue', { ...project, title: text, description: z.string().trim().min(1).max(5000), imageUrl: z.string().max(2_800_000).refine(v => !v || /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+=*$/.test(v), 'Use a raster image data URL').optional() }),
  command('task', { ...project, id: uuid, status: z.enum(['TODO','IN_PROGRESS','DONE']) }),
  command('report', { ...project, date, weather: text, temperature:z.string().regex(/^-?\d{1,2}(\.\d)?$/).refine(v=>Number(v)>=-60&&Number(v)<=60).optional(), labor: z.string().regex(/^\d{1,5}$/).refine(v => Number(v)<=10000, 'Workforce must be at most 10000'), notes: z.string().trim().max(5000).optional() }),
  command('purchase', { ...project, id: uuid }),
  command('invite', { ...common, name: text, email: z.string().trim().email().max(254).transform(v=>v.toLowerCase()), role: z.enum(roles) }),
  command('document', { ...project, name: z.string().trim().min(1).max(255).regex(/\.(pdf|docx|xlsx)$/i, 'Allowed: PDF, DOCX, XLSX') }),
]);
export type Command = z.infer<typeof commandSchema>;
export const workspaceQuery = z.object({ role: z.enum(roles).default('DIRECTOR') }).strict();
export const aiSchema = z.object({ role: z.enum(roles), question: z.string().trim().min(1).max(2000), projectId: uuid, language }).strict();
