# Suarabumi — Express.js Backend

Express API in `backend/` with **Prisma + MySQL 8**.

## Quick start (Docker MySQL)

```powershell
cd E:\Projects\Suarabumi\backend
npm install
npm run db:up          # starts MySQL on port 3306
npm run db:wait        # wait until MySQL is ready
npm run db:setup       # prisma db push + seed
npm run dev
```

From repo root (frontend + API):

```powershell
cd E:\Projects\Suarabumi
npm install
cd backend; npm install; cd ..
npm run setup:backend
npm run dev:all
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Express API | http://localhost:3001 |
| MySQL | `127.0.0.1:3306` (database: `suarabumi`) |

## Environment

Copy `backend/.env.example` → `backend/.env`:

```env
DATABASE_URL="mysql://suarabumi:suarabumi_dev@127.0.0.1:3306/suarabumi"
```

Docker credentials (default in `docker-compose.yml`):

| Variable | Value |
|----------|--------|
| User | `suarabumi` |
| Password | `suarabumi_dev` |
| Database | `suarabumi` |
| Root password | `root` |

## Demo login

- Email: `putra.wijaya@email.com`
- Password: `password123`

## Database commands

| Command | Description |
|---------|-------------|
| `npm run db:up` | Start MySQL container |
| `npm run db:down` | Stop MySQL container |
| `npm run db:push` | Apply schema to MySQL |
| `npm run db:seed` | Seed demo data |
| `npm run db:migrate` | Create/apply Prisma migrations (optional) |

## External MySQL (production / team server)

Set `DATABASE_URL` to your hosted MySQL connection string, then:

```powershell
npm run db:generate
npx prisma db push
npm run db:seed
```

See `backend/API.md` for full route list.
