export type Language = 'ru' | 'kk' | 'en';
// English phrases are stable keys; user-entered content is never rewritten.
const rows = `Overview|Обзор|Шолу
Tenders|Тендеры|Тендерлер
Projects|Проекты|Жобалар
Site operations|Работы на объекте|Нысандағы жұмыстар
Tasks|Задачи|Тапсырмалар
Daily reports|Ежедневные отчёты|Күнделікті есептер
AI Command Center|Центр управления ИИ|ЖИ басқару орталығы
Team & company|Команда и компания|Команда және компания
DIRECTOR|Директор|Директор
PROJECT_MANAGER|Руководитель проекта|Жоба жетекшісі
FOREMAN|Прораб|Учаске бастығы
PTO|ПТО|ӨТБ
PROCUREMENT|Снабжение|Жабдықтау
ACCOUNTANT|Бухгалтер|Бухгалтер
NEW|Новый|Жаңа
ANALYSIS|Анализ|Талдау
WON|Выигран|Жеңіп алынды
PLANNING|Планирование|Жоспарлау
TODO|К выполнению|Орындалуы тиіс
IN_PROGRESS|В работе|Орындалуда
DONE|Выполнено|Орындалды
HIGH|Высокий|Жоғары
ASSIGNED|Назначено|Тағайындалды
CRITICAL|Критично|Сындарлы
WARNING|Предупреждение|Ескерту
INFO|Информация|Ақпарат
PENDING_APPROVAL|Ожидает согласования|Мақұлдауды күтуде
Active|Активен|Белсенді
Invited (demo)|Приглашён (демо)|Шақырылды (демо)
Loading BuildOS…|Загрузка BuildOS…|BuildOS жүктелуде…
THE OPERATING SYSTEM FOR CONSTRUCTION|ОПЕРАЦИОННАЯ СИСТЕМА ДЛЯ СТРОИТЕЛЬСТВА|ҚҰРЫЛЫСҚА АРНАЛҒАН ОПЕРАЦИЯЛЫҚ ЖҮЙЕ
Build with clarity.|Стройте с ясностью.|Айқындықпен салыңыз.
Lead with intelligence.|Управляйте с интеллектом.|Ақылмен басқарыңыз.
From the first tender to the last site inspection. Your people, projects and decisions, connected.|От первого тендера до финальной проверки. Люди, проекты и решения в одной системе.|Алғашқы тендерден соңғы тексеруге дейін. Адамдар, жобалар мен шешімдер бір жүйеде.
01 / Win smarter|01 / Выигрывайте тендеры|01 / Тендерлерді жеңіп алыңыз
02 / Deliver together|02 / Работайте вместе|02 / Бірге жұмыс істеңіз
03 / Stay ahead|03 / Будьте на шаг впереди|03 / Бір қадам алда болыңыз
INVESTOR DEMO WORKSPACE|ДЕМО ДЛЯ ИНВЕСТОРОВ|ИНВЕСТОРЛАРҒА АРНАЛҒАН ДЕМО
Welcome to BuildOS|Добро пожаловать в BuildOS|BuildOS жүйесіне қош келдіңіз
Create your workspace|Создайте рабочее пространство|Жұмыс кеңістігін жасаңыз
Explore the complete construction lifecycle.|Весь цикл строительства в одной системе.|Құрылыстың толық циклі бір жүйеде.
Company name|Название компании|Компания атауы
Work email|Рабочая почта|Жұмыс поштасы
Password|Пароль|Құпиясөз
Demo role|Роль в демо|Демодағы рөл
Enter workspace|Войти|Кіру
Create a demo organization|Создать демо-компанию|Демо компания құру
Back to login|Вернуться ко входу|Кіруге оралу
Demo access only. No real authentication or invitations. Data stays in this browser.|Демо-доступ без настоящей авторизации и приглашений. Данные остаются в браузере.|Нақты авторизациясыз және шақырусыз демо кіру. Деректер браузерде сақталады.
Enterprise workspace|Рабочее пространство компании|Компанияның жұмыс кеңістігі
WORKSPACE|РАБОЧЕЕ ПРОСТРАНСТВО|ЖҰМЫС КЕҢІСТІГІ
SYSTEM ONLINE|СИСТЕМА ДОСТУПНА|ЖҮЙЕ ҚОЛЖЕТІМДІ
Your next decision,|Ваше следующее решение —|Келесі шешіміңіз —
backed by intelligence.|с поддержкой интеллекта.|зияткерлік қолдаумен.
Log out|Выйти|Шығу
Toggle sidebar|Свернуть меню|Мәзірді жинау
Workspace|Рабочее пространство|Жұмыс кеңістігі
● TENANT: DEMO|● КОМПАНИЯ: ДЕМО|● КОМПАНИЯ: ДЕМО
Role selector|Выбор роли|Рөлді таңдау
AI Assistant|ИИ-ассистент|ЖИ көмекшісі
BUILD GROUP / INTELLIGENCE WORKSPACE|BUILD GROUP / ИНТЕЛЛЕКТУАЛЬНОЕ ПРОСТРАНСТВО|BUILD GROUP / ЗИЯТКЕРЛІК КЕҢІСТІК
Your site, at a glance.|Ваш объект с первого взгляда.|Нысаныңыз бір қарағанда.
Keep every project moving.|Держите проекты в движении.|Жобаларды алға жылжытыңыз.
Every project. One clear picture.|Все проекты. Единая картина.|Барлық жобалар. Біртұтас көрініс.
Good morning, Alex. Here’s what’s happening across your operations.|Доброе утро, Алекс. Вот что происходит на ваших объектах.|Қайырлы таң, Алекс. Нысандарыңыздағы жағдаймен танысыңыз.
Connected workflows. Informed decisions. Better construction.|Связанные процессы. Взвешенные решения. Качественное строительство.|Байланысты үдерістер. Негізді шешімдер. Сапалы құрылыс.
Project context|Выбор проекта|Жобаны таңдау
Dismiss|Закрыть|Жабу
BUILDOS INTELLIGENCE|ИНТЕЛЛЕКТ BUILDOS|BUILDOS ЗИЯТКЕРЛІГІ
A procurement gap needs your attention.|Нехватка материалов требует внимания.|Материал тапшылығы назар аударуды қажет етеді.
Your next great project starts here.|Ваш следующий проект начинается здесь.|Келесі жобаңыз осы жерден басталады.
Block A façade materials could impact the schedule. Review the recommendation.|Материалы фасада блока А могут повлиять на сроки. Проверьте рекомендацию.|А блогының қасбет материалдары мерзімге әсер етуі мүмкін. Ұсынысты қараңыз.
Ingest a tender and follow its journey from AI analysis to site delivery.|Добавьте тендер и пройдите путь от ИИ-анализа до работ на объекте.|Тендерді қосып, ЖИ талдауынан нысандағы жұмысқа дейінгі жолдан өтіңіз.
Review insights|Посмотреть рекомендации|Ұсыныстарды қарау
Start investor demo|Начать демо|Демоны бастау
Active projects|Активные проекты|Белсенді жобалар
Connected project workspace|Единое пространство проектов|Біртұтас жоба кеңістігі
Contract portfolio|Портфель контрактов|Келісімшарттар портфелі
Total project budget|Общий бюджет проектов|Жобалардың жалпы бюджеті
Open site issues|Открытые дефекты|Ашық ақаулар
Requires site review|Требуют проверки на объекте|Нысанда тексеруді қажет етеді
Pending AI actions|Ожидающие действия ИИ|Күтілген ЖИ әрекеттері
Human approval required|Требуется согласование|Мақұлдау қажет
Restricted|Доступ ограничен|Қолжетімділік шектеулі
Project portfolio|Портфель проектов|Жобалар портфелі
View all|Посмотреть все|Барлығын қарау
Almaty, Kazakhstan · Residential|Алматы, Казахстан · Жилой комплекс|Алматы, Қазақстан · Тұрғын үй кешені
A clean foundation|Начните с чистого листа|Жаңа бастама
Convert your first tender to bring the portfolio to life.|Преобразуйте первый тендер в проект.|Алғашқы тендерді жобаға айналдырыңыз.
Portfolio health|Состояние портфеля|Портфель жағдайы
Review required|Требуется проверка|Тексеру қажет
Ready to build|Готовы к строительству|Құрылысқа дайын
Attention center|Требует внимания|Назар аударуды қажет етеді
LIVE DEMO|ДЕМО|ДЕМО
Review recommendation|Проверить рекомендацию|Ұсынысты тексеру
All clear for now|Пока всё спокойно|Әзірге бәрі қалыпты
AI alerts appear as your project context grows.|ИИ-уведомления появятся по мере наполнения проекта.|Жоба деректері толыққан сайын ЖИ ескертулері пайда болады.
Your connected construction lifecycle|Единый цикл строительства|Біртұтас құрылыс циклі
INVESTOR WALKTHROUGH|СЦЕНАРИЙ ДЛЯ ИНВЕСТОРА|ИНВЕСТОРҒА АРНАЛҒАН СЦЕНАРИЙ
Ingest tender|Добавить тендер|Тендерді қосу
Analyze with AI|Проанализировать с ИИ|ЖИ арқылы талдау
Convert to project|Создать проект|Жоба құру
Log a site issue|Зафиксировать дефект|Ақауды тіркеу
Approve AI action|Рассмотреть действие ИИ|ЖИ әрекетін қарау
tenders in your pipeline|тендеров в воронке|тендер тізбекте
New tender|Новый тендер|Жаңа тендер
18 months ·|18 месяцев ·|18 ай ·
Demo specification|Демо-спецификация|Демо сипаттама
Tender score|Оценка тендера|Тендер бағасы
Projected margin|Прогноз маржи|Болжамды маржа
MOCK AI ANALYSIS|ДЕМОНСТРАЦИЯ ИИ-АНАЛИЗА|ЖИ ТАЛДАУЫНЫҢ ДЕМОСЫ
Analyze tender|Проанализировать тендер|Тендерді талдау
Mark WON → Convert to project|Отметить победу → Создать проект|Жеңісті белгілеу → Жоба құру
✓ Connected to project|✓ Связан с проектом|✓ Жобамен байланыстырылды
No tenders yet|Тендеров пока нет|Тендерлер әзірге жоқ
Project budget|Бюджет проекта|Жоба бюджеті
Status|Статус|Мәртебе
Created from won tender|Создан из выигранного тендера|Жеңіп алынған тендерден құрылды
Spatial breakdown|Структура объекта|Нысан құрылымы
└ Floor|└ Этаж|└ Қабат
Zone|Зона|Аймақ
Block A|Блок А|А блогы
East|Восток|Шығыс
West|Запад|Батыс
Project documents|Документы проекта|Жоба құжаттары
Upload PDF, DOCX or XLSX|Загрузить PDF, DOCX или XLSX|PDF, DOCX немесе XLSX жүктеу
Mock ingestion: filename and version only.|Демо: сохраняются только имя и версия файла.|Демо: тек файл атауы мен нұсқасы сақталады.
No project selected|Проект не выбран|Жоба таңдалмаған
Analyze a tender and convert it to a project.|Проанализируйте тендер и создайте проект.|Тендерді талдап, жоба құрыңыз.
Block A · Field workspace|Блок А · Рабочее место на объекте|А блогы · Нысандағы жұмыс кеңістігі
Log site issue|Зафиксировать дефект|Ақауды тіркеу
Site issue evidence|Фото дефекта|Ақау фотосы
· AI classification mock|· Демо ИИ-классификации|· ЖИ жіктеуінің демосы
Capture it. Resolve it.|Зафиксируйте. Устраните.|Тіркеңіз. Жойыңыз.
Log reinforcement mesh evidence and let the demo AI suggest classification.|Добавьте фото арматурной сетки и проверьте предложенную ИИ классификацию.|Арматура торының фотосын қосып, ЖИ ұсынған жіктеуді тексеріңіз.
Due|Срок|Мерзім
Daily site report|Ежедневный отчёт по объекту|Нысан бойынша күнделікті есеп
Date|Дата|Күн
Weather|Погода|Ауа райы
Clear, 18°C|Ясно, 18°C|Ашық, 18°C
Rain|Дождь|Жаңбыр
Snow|Снег|Қар
Labor count|Количество рабочих|Жұмысшылар саны
Delay notes|Причины задержек|Кідіріс себептері
Work completed, constraints and next steps|Выполненные работы, ограничения и следующие шаги|Орындалған жұмыс, шектеулер және келесі қадамдар
Generate & save report|Сформировать и сохранить|Қалыптастыру және сақтау
Report history|История отчётов|Есептер тарихы
HUMAN IN THE LOOP|РЕШЕНИЕ ПРИНИМАЕТ ЧЕЛОВЕК|ШЕШІМДІ АДАМ ҚАБЫЛДАЙДЫ
Intelligence that keeps you in control.|Интеллект под вашим контролем.|Зияткерлік сіздің бақылауыңызда.
Mock recommendations are reviewed by your team. Purchase requests require approval.|Демо-рекомендации проверяет команда. Заявки на закупку требуют согласования.|Демо ұсыныстарды команда тексереді. Сатып алу өтінімдерін мақұлдау қажет.
Ask BuildOS|Спросить BuildOS|BuildOS жүйесінен сұрау
Recommendation:|Рекомендация:|Ұсыныс:
Request generated · Pending approval|Заявка создана · Ожидает согласования|Өтінім құрылды · Мақұлдауды күтуде
Generate purchase request|Создать заявку на закупку|Сатып алу өтінімін құру
Organization|Организация|Ұйым
Tenant ID: demo-build-group · Isolated browser demo|Компания: demo-build-group · Демо в браузере|Компания: demo-build-group · Браузердегі демо
People & permissions|Участники и права доступа|Қатысушылар және қолжетімділік құқықтары
Invite user|Пригласить участника|Қатысушыны шақыру
Construction, connected.|Строительство в одной системе.|Құрылыс бір жүйеде.
Demo workspace · Browser-local persistence · Mock AI|Демо · Данные в браузере · Имитация ИИ|Демо · Деректер браузерде · ЖИ имитациясы
BuildOS Assistant|Ассистент BuildOS|BuildOS көмекшісі
Close assistant|Закрыть ассистента|Көмекшіні жабу
· DEMO CONTEXT|· ДЕМО-КОНТЕКСТ|· ДЕМО КОНТЕКСТ
A clearer view of what’s next.|Понимайте, что делать дальше.|Келесі әрекетті айқын көріңіз.
Ask about your project, site issues and schedule risks.|Спросите о проекте, дефектах и рисках срыва сроков.|Жоба, ақаулар және мерзім тәуекелдері туралы сұраңыз.
Ask assistant|Спросить ассистента|Көмекшіден сұрау
Mock AI · Financial Q&A restricted by selected demo role.|Демо ИИ · Финансовые ответы зависят от выбранной роли.|Демо ЖИ · Қаржылық жауаптар таңдалған рөлге байланысты.
Invite team member|Пригласить в команду|Командаға шақыру
Close modal|Закрыть окно|Терезені жабу
Tender title|Название тендера|Тендер атауы
Client|Заказчик|Тапсырыс беруші
Demo budget|Демо-бюджет|Демо бюджет
18 months|18 месяцев|18 ай
Planned duration|Плановый срок|Жоспарлы мерзім
Upload tender specification|Загрузить спецификацию тендера|Тендер сипаттамасын жүктеу
Mock ingestion records the filename. A demo specification is used if no file is selected.|Сохраняется имя файла. Без файла используется демо-спецификация.|Файл атауы сақталады. Файлсыз демо сипаттама қолданылады.
Photo attached|Фото добавлено|Фото қосылды
Upload / capture site photo|Загрузить или сделать фото|Фото жүктеу немесе түсіру
AI AUTO-CLASSIFICATION · MOCK|ИИ-КЛАССИФИКАЦИЯ · ДЕМО|ЖИ ЖІКТЕУІ · ДЕМО
Suggested title|Предложенное название|Ұсынылған атау
Notes|Примечания|Ескертпелер
HIGH priority · Structural · Daniyar S., site engineer|Высокий приоритет · Конструкции · Данияр С., инженер|Жоғары басымдық · Конструкциялар · Данияр С., инженер
Name|Имя|Аты
Email|Почта|Пошта
Role|Роль|Рөл
Demo invitation record only; no email is sent.|Демо-запись приглашения; письмо не отправляется.|Шақырудың демо жазбасы; хат жіберілмейді.
Saving…|Сохранение…|Сақталуда…
Create tender|Создать тендер|Тендер құру
Save issue|Сохранить дефект|Ақауды сақтау
Create invitation|Создать приглашение|Шақыру құру
Open tenders|Открыть тендеры|Тендерлерді ашу
What are the main risks delaying Block A?|Какие основные риски задерживают блок А?|А блогын кешіктіретін негізгі тәуекелдер қандай?
Project created with Block A, two floors and an AI risk alert.|Создан проект с блоком А, двумя этажами и ИИ-уведомлением.|А блогы, екі қабаты және ЖИ ескертуі бар жоба құрылды.
Purchase request created. Human approval is pending.|Заявка создана. Ожидается согласование.|Өтінім құрылды. Мақұлдау күтілуде.
Saved to this browser’s demo workspace.|Сохранено в демо-пространстве этого браузера.|Осы браузердің демо кеңістігінде сақталды.
Local demo data could not be restored.|Не удалось восстановить локальные данные.|Жергілікті деректерді қалпына келтіру мүмкін болмады.
Request failed|Не удалось выполнить запрос|Сұрау орындалмады
Assistant is unavailable. Please retry.|Ассистент недоступен. Попробуйте ещё раз.|Көмекші қолжетімсіз. Қайта көріңіз.
Use an image under 2 MB for browser-local storage.|Для хранения в браузере используйте фото до 2 МБ.|Браузерде сақтау үшін 2 МБ-тан кіші фото қолданыңыз.
Your role cannot perform this action|У вашей роли нет прав на это действие|Рөліңізде бұл әрекетке құқық жоқ
Select a project first|Сначала выберите проект|Алдымен жобаны таңдаңыз
Analyze tender first|Сначала проанализируйте тендер|Алдымен тендерді талдаңыз
Façade procurement gap|Не заказаны материалы фасада|Қасбет материалдарына тапсырыс берілмеген
Façade materials have not been requested for Block A.|Для блока А не запрошены материалы фасада.|А блогы үшін қасбет материалдары сұралмаған.
7-day schedule slip predicted (demo estimate).|Прогноз задержки: 7 дней (демо-оценка).|Кідіріс болжамы: 7 күн (демо баға).
Generate a purchase request for façade materials.|Создайте заявку на закупку материалов фасада.|Қасбет материалдарын сатып алу өтінімін жасаңыз.
Façade materials · Block A|Материалы фасада · Блок А|Қасбет материалдары · А блогы
Request façade materials for Block A|Запросить материалы фасада для блока А|А блогына қасбет материалдарын сұрау
Procurement team|Отдел снабжения|Жабдықтау бөлімі
Structural / reinforcement|Конструкции / армирование|Конструкциялар / арматура
Rebar Spacing Non-Compliance on Floor 2, Block A|Нарушение шага арматуры, этаж 2, блок А|Арматура аралығының сәйкессіздігі, 2-қабат, А блогы
Uninstalled reinforcement mesh. Verify spacing against approved drawings.|Арматурная сетка не установлена. Проверьте шаг по утверждённым чертежам.|Арматура торы орнатылмаған. Аралықты бекітілген сызбалармен тексеріңіз.
Daniyar S. · Site engineer|Данияр С. · Инженер объекта|Данияр С. · Нысан инженері
Short 11-month completion clause conflicts with the 18-month plan|Условие завершения за 11 месяцев противоречит плану на 18 месяцев|11 айда аяқтау шарты 18 айлық жоспарға қайшы
High reliance on imported rebar|Высокая зависимость от импортной арматуры|Импорттық арматураға жоғары тәуелділік
Strict failure penalties: legal review required|Строгие штрафы за нарушение: требуется юридическая проверка|Қатаң айыппұлдар: заңгерлік тексеру қажет
Theme|Тема|Тақырып
Light theme|Светлая тема|Ашық тақырып
Dark theme|Тёмная тема|Қараңғы тақырып
Language|Язык|Тіл
Home|Главная|Басты бет
LOW|Низкий|Төмен
MEDIUM|Средний|Орташа
Clear|Ясно|Ашық
OPEN|Открыто|Ашық
READY_FOR_REVIEW|На проверке|Тексеруде
RESOLVED|Исправлено|Түзетілді
CLOSED|Закрыто|Жабық
Saved to PostgreSQL.|Сохранено в PostgreSQL.|PostgreSQL базасында сақталды.
Demo access only. Data is saved to PostgreSQL. Authentication is stage 2.|Демо-доступ. Данные сохраняются в PostgreSQL. Авторизация — на втором этапе.|Демо кіру. Деректер PostgreSQL базасында сақталады. Авторизация — екінші кезеңде.
Demo workspace · PostgreSQL persistence · Mock AI|Демо · Данные в PostgreSQL · Имитация ИИ|Демо · Деректер PostgreSQL базасында · ЖИ имитациясы
Tenant: Build Group · PostgreSQL demo|Компания: Build Group · Демо PostgreSQL|Компания: Build Group · PostgreSQL демосы
Use an image under 2 MB.|Используйте фото размером до 2 МБ.|2 МБ-тан кіші фото қолданыңыз.
Unassigned|Не назначен|Тағайындалмаған
Retry|Повторить|Қайталау
Invalid request.|Некорректный запрос.|Қате сұрау.
An unexpected server error occurred.|Произошла ошибка сервера.|Сервер қатесі орын алды.
Database configuration is missing or invalid. Follow docs/SETUP_RU.md.|Настройки базы отсутствуют или неверны. Следуйте инструкции docs/SETUP_RU.md.|База баптаулары жоқ немесе қате. docs/SETUP_RU.md нұсқаулығын қараңыз.
PostgreSQL is unavailable. Check the connection and migrations.|PostgreSQL недоступен. Проверьте подключение и миграции.|PostgreSQL қолжетімсіз. Байланыс пен миграцияларды тексеріңіз.
Apply database migrations before using the application.|Перед работой примените миграции базы данных.|Жұмысты бастамас бұрын база миграцияларын қолданыңыз.
Demo access is disabled. Authentication will be implemented in stage 2.|Демо-доступ отключён. Авторизация будет добавлена на втором этапе.|Демо кіру өшірілген. Авторизация екінші кезеңде қосылады.
Data changed concurrently. Reload and retry.|Данные изменились. Обновите страницу и повторите.|Деректер өзгерді. Бетті жаңартып, қайталаңыз.
Invalid server response.|Некорректный ответ сервера.|Сервер жауабы қате.
Director access required.|Доступ разрешён только директору.|Тек директорға қолжетімді.
You cannot change your own role.|Нельзя изменить собственную роль.|Өз рөліңізді өзгертуге болмайды.
This email is already a company member.|Сотрудник с этой почтой уже состоит в компании.|Бұл поштадағы қызметкер компанияға тіркелген.
Invitation is invalid or expired.|Приглашение недействительно или срок истёк.|Шақыру жарамсыз немесе мерзімі өткен.
Authentication required.|Войдите в аккаунт для продолжения.|Жалғастыру үшін аккаунтқа кіріңіз.
Invalid credentials.|Неверная почта, БИН или пароль.|Пошта, БСН немесе құпиясөз қате.
Too many attempts. Retry in 15 minutes.|Слишком много попыток. Повторите через 15 минут.|Әрекет тым көп. 15 минуттан кейін қайталаңыз.`;
export const dictionary: Record<string, [string, string]> = Object.fromEntries(rows.split('\n').map(row => {const [key,ru,kk]=row.split('|');return [key,[ru,kk]];}));
export function translate(text:string,language:Language):string {return language==='en'?text:(dictionary[text]?.[language==='ru'?0:1]??text);}
export function reportText(report:{text:string;date?:string;weather?:string;labor?:string;notes?:string;author?:string},language:Language):string {
 if(!report.date)return report.text;
 const t=(s:string)=>translate(s,language);
 const notes=report.notes||(language==='ru'?'Задержек нет':language==='kk'?'Кідіріс жоқ':'No delays reported');
 const [condition,temperature]=(report.weather||'').split(' · ');
 const weather=t(condition)+(temperature?` · ${temperature}`:'');
 return `${t('Daily site report')} · ${report.date}. ${t('Weather')}: ${weather}. ${t('Labor count')}: ${report.labor}. ${t('Delay notes')}: ${notes}. ${t('Role')}: ${t(report.author||'')}.`;
}
