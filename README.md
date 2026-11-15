# Trackify Backend

Backend API for the Trackify Flutter expense tracker.

## Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Helmet
- Morgan
- dotenv

No login/authentication is used.

## 1. Requirements

Install:

- Node.js 18+
- MongoDB Community Server (local) or MongoDB Atlas

## 2. Install

```bash
npm install
```

## 3. Environment

Copy `.env.example` to `.env`.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/trackify
NODE_ENV=development
```

## 4. Start MongoDB

For local MongoDB, make sure the MongoDB service is running.

## 5. Run server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server:

`http://localhost:5000`

Health:

`GET /api/health`

## API

### Expenses

- POST `/api/expenses`
- GET `/api/expenses`
- GET `/api/expenses/:id`
- PUT `/api/expenses/:id`
- DELETE `/api/expenses/:id`

Query examples:

`GET /api/expenses?search=food`

`GET /api/expenses?from=2026-09-01&to=2026-10-01`

`GET /api/expenses?category=CATEGORY_ID`

### Income

- POST `/api/incomes`
- GET `/api/incomes`
- GET `/api/incomes/:id`
- PUT `/api/incomes/:id`
- DELETE `/api/incomes/:id`

### Salary

- POST `/api/salaries`
- GET `/api/salaries`
- GET `/api/salaries/:id`
- PUT `/api/salaries/:id`
- DELETE `/api/salaries/:id`

Salary is stored per month/year, so one salary record represents the salary for a particular month.

### Categories

- POST `/api/categories`
- GET `/api/categories`
- GET `/api/categories/:id`
- PUT `/api/categories/:id`
- DELETE `/api/categories/:id`
- POST `/api/categories/seed/defaults`

Seed defaults once:

```bash
curl -X POST http://localhost:5000/api/categories/seed/defaults
```

### Notes

- POST `/api/notes`
- GET `/api/notes`
- GET `/api/notes/:id`
- PUT `/api/notes/:id`
- DELETE `/api/notes/:id`

Search:

`GET /api/notes?search=shopping`

Pinned:

`GET /api/notes?pinned=true`

### Reminders

- POST `/api/reminders`
- GET `/api/reminders`
- GET `/api/reminders/:id`
- PUT `/api/reminders/:id`
- DELETE `/api/reminders/:id`

The backend stores reminder data. Actual mobile notification scheduling will be handled by Flutter later.

### Reports

Monthly:

`GET /api/reports/monthly?year=2026&month=9`

Yearly:

`GET /api/reports/yearly?year=2026`

Monthly report returns:

- income
- salary
- expenses
- balance
- savings rate
- category breakdown
- daily expenses

Yearly report returns:

- total income
- total expenses
- balance
- savings rate
- salary total
- January-December monthly breakdown

## Example expense

```json
{
  "title": "Groceries",
  "amount": 1250,
  "category": "CATEGORY_ID",
  "date": "2026-09-12T10:30:00.000Z",
  "note": "Monthly groceries"
}
```

## Example salary

```json
{
  "amount": 60000,
  "month": 9,
  "year": 2026,
  "salaryDate": 5,
  "note": "September salary"
}
```

## Example reminder

```json
{
  "title": "Pay Electricity Bill",
  "description": "Electricity bill payment",
  "dateTime": "2026-09-15T10:00:00.000Z",
  "repeat": "monthly"
}
```

## Important

This backend intentionally has no authentication because Trackify is being designed as a personal single-user application. If cloud multi-device sync is added later, authentication can be introduced without changing the core CRUD structure.
