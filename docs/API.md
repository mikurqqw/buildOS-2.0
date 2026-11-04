# API первого этапа

Все бизнес-эндпоинты используют серверную компанию из `DEMO_COMPANY_ID`. Клиент не может передать другую компанию. Требуется `DEMO_MODE=true`; это временный локальный режим, не авторизация.

## GET /api/health

Проверяет подключение и наличие таблицы Company. Возвращает:

```json
{"status":"ok","database":"postgresql","schema":"ready"}
```

## GET /api/workspace?role=DIRECTOR

Возвращает `{state, company, storage: "postgresql"}`. State содержит тендеры, проекты с иерархией, задачи, дефекты, AI-риски, отчёты, заявки, метаданные документов и пользователей. Значения Role совпадают с Prisma enum. Пароли и токены приглашений в ответ не попадают.

## POST /api/workspace/commands

Заголовок `Content-Type: application/json`. Тело:

```json
{
  "role": "DIRECTOR",
  "action": "newTender",
  "payload": {
    "title": "Residential Complex Alatau Residence",
    "client": "Alatau Development",
    "document": "alatau.pdf",
    "language": "ru"
  }
}
```

После записи возвращается обновлённое рабочее пространство. `/api/demo` — совместимый URL к тому же обработчику PostgreSQL; старое поле `state` не принимается.

| Action | Обязательные поля payload | Дополнительные поля |
|---|---|---|
| newTender | title, client | document |
| analyze | id тендера | — |
| convert | id тендера | — |
| issue | projectId, title, description | imageUrl |
| task | projectId, id задачи, status | — |
| report | projectId, date, weather, labor | notes |
| purchase | projectId, id риска | — |
| invite | name, email, role | — |
| document | projectId, name | — |

Для всех payload допустим `language`: ru/kk/en; по умолчанию ru. Для команд без обязательного проекта можно передать пустой `projectId`. Остальные идентификаторы должны быть UUID. Статусы задач: TODO, IN_PROGRESS, DONE. Число рабочих передаётся строкой с целым числом 0–10000. Дата — существующая календарная дата YYYY-MM-DD. Фото — PNG/JPEG/WebP/GIF data URL; SVG и внешние URL не принимаются. Допустимые расширения документов: PDF/DOCX/XLSX, сохраняются только метаданные.

## POST /api/ai

```json
{
  "role": "FOREMAN",
  "projectId": "UUID проекта",
  "question": "Какие риски задерживают блок А?",
  "language": "ru"
}
```

Возвращает `{answer, mocked: true}`. Счётчики и название проекта сервер читает из базы. Переданные клиентом счётчики или название проекта отклоняются.

## Ошибки

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": [{"path":"payload.title","message":"Required"}]
  },
  "requestId":"UUID"
}
```

`details` есть только у ошибок валидации. Успех и ошибки содержат заголовки `X-Request-Id` и `Cache-Control: no-store`.

| HTTP | Значение |
|---|---|
| 400 | некорректный JSON |
| 401 | демо-доступ отключён |
| 403 | нет прав на действие |
| 404 | запись отсутствует в текущей компании |
| 409 | конфликт, недопустимый переход или конкурентное изменение |
| 413 | превышен размер тела запроса |
| 415 | неверный Content-Type |
| 422 | ошибка валидации или внешней связи |
| 503 | не настроена/недоступна база или не применены миграции |
| 500 | непредвиденная ошибка без раскрытия внутренних данных |
