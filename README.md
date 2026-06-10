<<<<<<< HEAD
# Suarabumi (Tunas / Daurin)

Monorepo on **E:\Projects\Suarabumi** — team React frontend + **Express.js** backend.

Cloned from: https://github.com/DanceeWABIA/Suarabumi.git

## Quick start

```powershell
cd E:\Projects\Suarabumi
npm install
cd backend; npm install; cd ..
npm run setup:backend
npm run dev:all
```

**Important:** Always use `npm run dev:all` (starts API **then** frontend).  
If you only run `npm run dev`, login/API will show **502 Bad Gateway**.

### Fix 502 Bad Gateway

1. Stop all old terminals (Ctrl+C).
2. Run `npm run dev:all` again.
3. Wait until you see `Suarabumi API running at http://127.0.0.1:3001` **before** using the app.
4. Open **http://localhost:5173** (not port 3001).
5. If proxy still fails, uncomment `VITE_API_URL` in `.env.development` and restart.

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| Express API | http://localhost:3001 |

Vite proxies `/api` → backend. Open the **frontend** URL in the browser, not port 3001.

## Demo login

- Email: `putra.wijaya@email.com`
- Password: `password123`

## Structure

```
backend/     Express.js + Prisma (MySQL 8)
src/         React (Vite) pages
```

See [BACKEND.md](./BACKEND.md) for API endpoints.
