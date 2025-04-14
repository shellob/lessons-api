
# Lessons API

REST API для получения списка занятий с возможностью фильтрации и пагинации.  
Проект реализован на Node.js с использованием Express и PostgreSQL.  
Подходит для работы с большим объёмом данных (миллионы записей).

---

## Стек

- Node.js 16+
- TypeScript
- Express.js
- PostgreSQL
- Knex
- Docker / Docker Compose
- Swagger (OpenAPI)
- Jest / Supertest 

---

## Установка и запуск

### 1. Клонирование

```bash
git clone https://github.com/shellob/lessons-api.git
cd lessons-api
```

### 2. Конфигурация

Создайте `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

### 3. Запуск с Docker

```bash
docker-compose up --build
```

API будет доступно по адресу: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api-docs`

---

## Эндпоинт `/lessons`

### Метод: `GET /lessons`

Фильтрует и возвращает занятия по заданным параметрам.  
Поддерживает пагинацию. Все параметры опциональны.

### Параметры запроса:

| Параметр         | Тип     | Описание |
|------------------|----------|----------|
| `date`           | string   | Одна или две даты `YYYY-MM-DD[,YYYY-MM-DD]` |
| `status`         | string   | `"0"` (не проведено) или `"1"` (проведено) |
| `teacherIds`     | string   | Список ID учителей через запятую |
| `studentsCount`  | string   | Одно число или два через запятую (диапазон) |
| `page`           | number   | Номер страницы, начиная с 1 |
| `lessonsPerPage` | number   | Количество занятий на странице (по умолчанию 5) |

### Пример:

```http
GET /lessons?date=2019-09-01,2019-09-10&status=1&teacherIds=1,2&studentsCount=2,5&page=1&lessonsPerPage=5
```

---

## Формат ответа

```json
[
  {
    "id": 1,
    "date": "2019-09-01",
    "title": "Математика",
    "status": 1,
    "visitCount": 3,
    "students": [
      { "id": 1, "name": "Иван", "visit": true }
    ],
    "teachers": [
      { "id": 2, "name": "Пётр" }
    ]
  }
]
```

---

## Ошибки

При невалидных параметрах возвращается статус 400:

```json
{
  "errors": [
    {
      "msg": "Status must be 0 or 1",
      "param": "status",
      "location": "query"
    }
  ]
}
```

---

## Тестирование (опционально)

В проекте предусмотрены интеграционные тесты (`Jest + Supertest`).  
Они покрывают основные кейсы API, включая успешные запросы и обработку ошибок.

> Тесты требуют активного подключения к базе данных и загруженных данных (`test.sql`).  
> Запуск тестов возможен только при соответствующей настройке окружения.

```bash
npm install
npm run test
```

---

## Примечания

- Дамп базы данных: `test.sql` (автоматически импортируется при запуске Docker)
- Swagger-документация: `http://localhost:3000/api-docs`
- Используемый Content-Type: `application/json`

