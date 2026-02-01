# MediStore Backend (Express + Prisma + Better Auth)

## Tech
- Express (TypeScript, ESM)
- Prisma + Postgres (Neon)
- Better Auth (email + password)

## Setup
1. Install deps
```bash
npm install
```

2. Create `.env` (copy from `.env.example`) and set **DATABASE_URL** + auth secrets.

3. Generate Prisma client + run migrations
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed admin (optional)
```bash
npm run seed:admin
```

5. Run dev server
```bash
npm run dev
```

Server: `http://localhost:4000`

## Auth
- Better Auth handler is mounted at: `.../api/auth/*`
- Assignment-friendly wrapper endpoints are under: `/api/v1/auth`

### Wrapper endpoints
- `POST /api/v1/auth/register` { name, email, password, role?: CUSTOMER|SELLER }
- `POST /api/v1/auth/login` { email, password }
- `GET /api/v1/auth/me` (uses session cookies)

## Core Endpoints (Assignment)
### Categories
- `GET /api/v1/categories`
- `POST /api/v1/categories` (ADMIN)
- `PATCH /api/v1/categories/:id` (ADMIN)
- `DELETE /api/v1/categories/:id` (ADMIN)

### Medicines
- `GET /api/v1/medicines?search=&categoryId=&manufacturer=&minPrice=&maxPrice=`
- `GET /api/v1/medicines/:id`
- `POST /api/v1/medicines` (SELLER/ADMIN)
- `PUT /api/v1/medicines/:id` (SELLER/ADMIN)
- `DELETE /api/v1/medicines/:id` (SELLER/ADMIN)

### Orders
- `POST /api/v1/orders` (CUSTOMER)
- `GET /api/v1/orders` (CUSTOMER: own orders, SELLER: relevant orders, ADMIN: all)
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id` (SELLER/ADMIN) update status

### Reviews
- `GET /api/v1/reviews?medicineId=...`
- `POST /api/v1/reviews` (CUSTOMER)

### Seller
- `POST /api/v1/seller/medicines` / `PUT` / `DELETE`
- `GET /api/v1/seller/orders`
- `PATCH /api/v1/seller/orders/:id`

### Admin
- `GET /api/v1/admin/users`
- `PATCH /api/v1/admin/users/:id` { isBanned: boolean }
- `GET /api/v1/admin/medicines`
- `GET /api/v1/admin/orders`
