import type {Language} from '@/lib/i18n';
export const copy=(language:Language,ru:string,kk:string,en:string)=>({ru,kk,en}[language]);
export function description(page:string,l:Language){
 const descriptions:Record<string,[string,string,string]>={
 Materials:['Запрашивайте материалы, согласовывайте закупки и отмечайте поставки.','Материал сұрап, сатып алуды мақұлдап, жеткізілімді белгілеңіз.','Request materials, approve purchases and track delivery.'],
 Home:['Выберите, с чего начать работу.','Жұмысты неден бастау керегін таңдаңыз.','Choose where to start.'],
 Overview:['Главные показатели и то, что требует внимания.','Негізгі көрсеткіштер мен маңызды мәселелер.','Key numbers and what needs attention.'],
 Tenders:['Собирайте заявки и оценивайте новые возможности.','Тендерлерді жинап, мүмкіндіктерді бағалаңыз.','Manage bids and evaluate opportunities.'],
 Projects:['Объекты, блоки, этажи и документы в одном месте.','Нысандар, блоктар, қабаттар және құжаттар бір жерде.','Sites, blocks, floors and documents in one place.'],
 'Site operations':['Фиксируйте дефекты и передавайте их ответственным.','Ақауларды тіркеп, жауаптыларға жіберіңіз.','Capture site issues and assign responsibility.'],
 Tasks:['Планируйте работу команды и следите за сроками.','Команда жұмысын жоспарлап, мерзімдерді бақылаңыз.','Plan team work and track deadlines.'],
 'Daily reports':['Записывайте погоду, состав бригады и итоги дня.','Ауа райын, жұмысшыларды және күн қорытындысын жазыңыз.','Record weather, workforce and daily progress.'],
 'AI Command Center':['Обсуждайте проект с помощником и проверяйте риски.','Көмекшімен жобаны талқылап, тәуекелдерді тексеріңіз.','Discuss your project and review risks.'],
 'Team & company':['Ваша компания, сотрудники и права доступа.','Компанияңыз, қызметкерлер және қолжетімділік.','Your company, people and permissions.'],
 };
 const row=descriptions[page];return row?row[l==='ru'?0:l==='kk'?1:2]:'';
}
