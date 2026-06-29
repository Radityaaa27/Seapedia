# SEAPEDIA

Fullstack marketplace built for **COMPFEST 18 Software Engineering Academy**.

## Tech Stack

**Frontend:** React · Vite · TypeScript · TailwindCSS · shadcn/ui · React Router · Axios · TanStack Query

**Backend:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT · bcrypt · Zod

## Features

| Phase | Feature |
|---|---|
| Phase 1 | Auth (Register/Login/JWT), Multi-role system |
| Phase 2 | Store CRUD, Product CRUD, Public catalog |
| Phase 3 | Wallet, Top-up, Address, Cart, Checkout, Orders |
| Phase 4 | Vouchers, Promos, Seller Reports |
| Phase 5 | Driver Dashboard, Job management, Earnings |
| Phase 6 | Admin Dashboard, User management, Overdue orders |
| Phase 7 | Security (Rate limiting, XSS prevention, Sanitization) |

## Demo Accounts

All passwords: `Password123`

| Role | Email |
|---|---|
| Admin | admin@seapedia.com |
| Buyer | buyer@seapedia.com |
| Seller | seller@seapedia.com |
| Driver | driver@seapedia.com |

## Voucher Codes

| Code | Discount |
|---|---|
| `WELCOME10` | 10% off (min Rp 50.000) |
| `FLAT20K` | Rp 20.000 off (min Rp 100.000) |
| `COMPFEST18` | 18% off (max Rp 50.000) |

## Getting Started

### Backend
```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npm run seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Base URL
http://localhost:5000/api

## Architecture

backend/src/
├── controllers/   ← Handle HTTP req/res
├── services/      ← Business logic
├── repositories/  ← Database queries
├── middleware/    ← Auth, rate limit, sanitize
├── routes/        ← Route definitions
├── validators/    ← Zod schemas
├── utils/         ← Helpers
└── lib/           ← Prisma singleton
frontend/src/
├── pages/         ← Route pages
├── components/    ← Reusable UI
├── contexts/      ← Global state
├── hooks/         ← Custom hooks
├── services/      ← API calls
├── types/         ← TypeScript types
└── layouts/       ← Page layouts