// Compatibility imports for the existing UI; domain contracts live in modules/shared.
export * from '@/modules/shared/types';
export { can } from '@/modules/company/permissions';
import type { State } from '@/modules/shared/types';
export const seed:State = {tenders:[],projects:[],tasks:[],issues:[],risks:[],reports:[],requests:[],documents:[],users:[]};
