# SEAPEDIA — Fullstack Multi-Role Marketplace

<div align="center">

![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.0+-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

*A production-style fullstack marketplace built for **COMPFEST 18 Software Engineering Academy**. Supports Buyer, Seller, Driver, and Admin roles in one unified platform — from product listing to wallet checkout to last-mile delivery tracking.*

[🚀 Live Demo](#) • [📖 API Docs](#-api-documentation) • [🛠️ Quick Start](#-quick-start) • [🔐 Security](#-security-notes)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Features](#-features)
- [Business Rules](#-business-rules)
- [API Documentation](#-api-documentation)
- [Demo Accounts](#-demo-accounts)
- [Security Notes](#-security-notes)
- [End-to-End Demo Guide](#-end-to-end-demo-guide)
- [Available Scripts](#-available-scripts)
- [Common Issues](#-common-issues)

---

## 🎯 About The Project

SEAPEDIA is a comprehensive, production-ready marketplace system that covers the entire e-commerce lifecycle across four distinct roles: **Buyer**, **Seller**, **Driver**, and **Admin**. Built with React + Express + Prisma + PostgreSQL, it demonstrates real-world patterns including wallet-based payments, delivery job matching, voucher discounts, overdue order handling, and security hardening.

### 🌟 Key Highlights

| Feature | Description |
|---------|-------------|
| 🔄 **Multi-Role** | One account, multiple roles — each with dedicated dashboard and permissions |
| 💰 **SeaWallet** | Built-in digital wallet with top-up, payment, refund, and driver earnings |
| 📦 **Full Order Flow** | Cart → Checkout → Seller Processing → Driver Pickup → Delivery → Confirmation |
| 🧾 **PPN 12%** | Indonesian tax applied automatically at checkout |
| 🚚 **3 Delivery Methods** | Instant, Next Day, Regular — each with different pricing and overdue SLA |
| 🎫 **Vouchers & Promos** | Percentage and fixed-amount discounts with usage limits |
| ⏰ **Overdue Handling** | Auto-refund and auto-return based on delivery method SLA |
| 🛡️ **Security** | Rate limiting, XSS sanitization, Zod validation, JWT auth, Helmet headers |

---

## 🔧 Prerequisites

| Software | Version | Notes |
|----------|---------|-------|
| **Node.js** | 18.0+ | LTS recommended |
| **npm** | 10.0+ | Included with Node.js |
| **PostgreSQL** | 15.0+ | Must be running locally |
| **Git** | 2.30+ | For cloning the repo |

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Radityaaa27/Seapedia.git
cd Seapedia
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your PostgreSQL credentials (see Environment Variables below)
```

Run database setup:

```bash
npx prisma generate
npx prisma migrate dev
node -r ts-node/register prisma/seed.ts
```

Start the backend:

```bash
npm run dev
# Server runs at http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
# App runs at http://localhost:5173
```

### 4. Verify

Visit `http://localhost:5173` and log in with any demo account below. The API health check is at `http://localhost:5000/api/health`.

---

## 🌍 Environment Variables

### Backend (`backend/.env`)

```env
# Database — update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/seapedia"

# JWT — use a long random string in production
JWT_SECRET="your-super-secret-key-change-in-production"
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **How to generate a secure JWT_SECRET:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | React 19 + Vite 7 | UI library and build tool |
| Language | TypeScript 5 | Type safety |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| UI Components | shadcn/ui (Nova preset) | Component system |
| Icons | Lucide React | Icon set |
| HTTP Client | Axios | API calls with interceptors |
| Routing | React Router v6 | Client-side routing |
| State | TanStack Query | Server state caching |
| Notifications | Sonner | Toast notifications |

### Backend

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Node.js 18 | JavaScript runtime |
| Framework | Express 4 | REST API server |
| Language | TypeScript 5 | Type safety |
| ORM | Prisma 7 | Database access (with `@prisma/adapter-pg`) |
| Database | PostgreSQL 15 | Primary data store |
| Auth | JWT + bcryptjs | Token-based authentication |
| Validation | Zod 4 | Request schema validation |
| Security | express-rate-limit, xss, helmet | Hardening |

---

## 🏗️ Architecture

### Folder Structure

```
Seapedia/
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── buyer/          # Cart, Checkout, Wallet, Orders, Addresses
│       │   ├── seller/         # Store, Products, Orders, Reports
│       │   ├── driver/         # Dashboard, Jobs
│       │   └── admin/          # Dashboard, Users, Vouchers, Overdue
│       ├── components/         # Reusable UI (ProductCard, Filters, etc.)
│       ├── contexts/           # AuthContext, CartContext
│       ├── hooks/              # useAuth, useCart
│       ├── services/           # API call wrappers (one file per domain)
│       ├── types/              # TypeScript interfaces
│       └── layouts/            # Navbar, Footer, MainLayout
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma       # Database schema (18 models)
    │   └── seed.ts             # Demo data
    └── src/
        ├── controllers/        # Request/response handlers (thin layer)
        ├── services/           # Business logic
        ├── repositories/       # Database queries (Prisma calls only here)
        ├── routes/             # Express routers
        ├── middleware/         # authenticate, requireRole, sanitize, rateLimiter
        ├── validators/         # Zod schemas + business rule constants
        ├── utils/              # ApiError, ApiResponse, jwt.util, logger
        └── lib/                # Prisma client singleton
```

### Layered Architecture

```
HTTP Request
    ↓
Express Middleware (helmet, cors, rateLimiter, sanitizeInput)
    ↓
Router → authenticate → requireRole
    ↓
Controller (validates with Zod, calls service)
    ↓
Service (business logic, orchestrates repositories)
    ↓
Repository (Prisma queries — only layer that touches DB)
    ↓
PostgreSQL
```

### Database Schema (simplified)

```
User ──┬── UserRole
       ├── Store ──── Product ──── ProductImage
       ├── Wallet ─── WalletTransaction
       ├── Cart ───── CartItem
       ├── Address
       ├── Order ─┬── OrderItem
       │          └── Delivery
       ├── Review
       └── Notification

Voucher ──── Order
Promo   ──── Order
```

---

## ✨ Features

### 🌐 Public Marketplace
- Browse product catalog with search, category filter, and pagination
- Product detail pages with images, reviews, and ratings
- Public store pages showing seller info and all their products
- Public application reviews (guests can submit without an account)

### 🔐 Authentication & Roles
- Register / Login with JWT tokens (7-day expiry)
- One account can hold multiple roles: Buyer, Seller, Driver, Admin
- Active role is stored in the JWT payload and enforced on every protected endpoint
- Role selection page after login directs users to the correct dashboard

### 🛍️ Buyer
- Manage saved delivery addresses (default address support)
- SeaWallet top-up with preset amounts (Rp 10.000 – Rp 10.000.000)
- Add items to cart, update quantities, view grouped by store
- Checkout with delivery method selection, voucher application, and price breakdown
- Order history with detail view and status timeline
- Cancel orders in PAID or PENDING_PAYMENT status (auto-refund to wallet)

### 🏪 Seller
- Create a store with unique name and slug (one store per seller)
- Full product CRUD: name, description, price, stock, weight, category, images
- Incoming orders dashboard with status filter tabs
- Process orders: Paid → Processing → Ready for Pickup
- Revenue report with monthly chart and top products

### 🚚 Driver
- Browse available delivery jobs (orders in READY_FOR_PICKUP status)
- Accept a job (only one active job at a time)
- Confirm pickup from seller (ASSIGNED → PICKED_UP)
- Complete delivery (PICKED_UP → DELIVERED) — wallet credited automatically
- Earnings history and wallet balance

### 👑 Admin
- Marketplace overview: total users, stores, products, orders, revenue
- User management: search, toggle active/inactive, assign roles
- Voucher management: create PERCENTAGE or FIXED vouchers with limits and expiry
- Promo management: create platform-wide banners with date ranges
- Overdue orders: view and force-refund stuck orders
- Simulate next day: trigger the auto-overdue check manually

---

## 📐 Business Rules

### 💳 Checkout Calculation

```
Subtotal      = Σ (product.price × quantity) for all items
Delivery Fee  = weight-based base + method surcharge (see table below)
Tax (PPN)     = Subtotal × 12%
Discount      = voucher value (PERCENTAGE or FIXED, capped by maxDiscount)
──────────────────────────────────────────────────────
Total         = Subtotal + Delivery Fee + Tax − Discount
```

Payment is deducted from SeaWallet at the moment of order creation. Insufficient balance blocks checkout.

**Single-store checkout**: Each order belongs to exactly one store. If a buyer has items from multiple stores, they must checkout per-store.

### 🚚 Delivery Methods & Fees

| Method | Base Formula | Surcharge | Example (500g) |
|--------|-------------|-----------|----------------|
| **REGULAR** | ⌈weight/100⌉ × Rp 1.000, min Rp 5.000 | None | Rp 5.000 |
| **NEXT_DAY** | Same base | +Rp 5.000 | Rp 10.000 |
| **INSTANT** | Same base | +Rp 15.000 | Rp 20.000 |

### ⏰ Overdue SLA (Simulate Next Day)

Orders that are not fulfilled within the deadline are automatically processed by the overdue check. An admin can trigger this manually via the Admin Dashboard → "Jalankan Auto Overdue Check" (or `POST /api/admin/simulate-next-day`).

| Delivery Method | Pre-Shipment Deadline | Post-Shipment Grace |
|-----------------|----------------------|---------------------|
| **INSTANT** | 1 day | +3 days |
| **NEXT_DAY** | 2 days | +3 days |
| **REGULAR** | 4 days | +3 days |

- **Pre-shipment overdue** (PAID / PROCESSING / READY_FOR_PICKUP): full refund to buyer wallet + stock restored
- **Post-shipment overdue** (ON_DELIVERY / DELIVERED, buyer never confirmed): treated as returned — refund to buyer wallet + stock restored

**To simulate overdue in demo:**
1. Place an order and choose **INSTANT** delivery method
2. Go to Admin Dashboard → Overdue Orders
3. Click "Jalankan Auto Overdue Check"
4. The system treats 1+ day as overdue and processes the refund

### 🎫 Voucher & Discount Rules

- Vouchers are single-use per checkout (one voucher per order)
- `PERCENTAGE` type: `discount = subtotal × (value/100)`, capped at `maxDiscount` if set
- `FIXED` type: flat amount deducted from subtotal
- `minOrderAmount`: voucher is rejected if subtotal is below this threshold
- `usageLimit`: voucher becomes invalid after reaching the limit
- `expiresAt`: voucher rejected if current time is past expiry
- Discount cannot make the total negative (discount is capped at total)

### 🚗 Driver Earning Rule

- Driver earns the **delivery fee** of the order upon completing delivery
- The fee is credited to the driver's SeaWallet as a `EARNING` transaction
- Fee amount is recorded at order creation time and does not change
- Earnings are viewable in the Driver Dashboard and wallet transaction history

### 🔒 Session & Token Behavior

- JWT tokens expire after **7 days** (configurable via `JWT_EXPIRES_IN`)
- Tokens are stateless — logout clears the token client-side only
- The active role is encoded in the token; switching role issues a **new token**
- All protected endpoints verify the token AND the active role on every request
- A 401 response from any endpoint causes the frontend to clear the token and redirect to login

---

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require: `Authorization: Bearer <token>`

All responses follow the format:
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "meta": { "total": 100, "page": 1, "totalPages": 5 }
}
```

---

### 🔑 Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new account | Public |
| `POST` | `/auth/login` | Login, returns JWT | Public |
| `GET` | `/auth/me` | Get current user profile | ✅ |

**Register body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@example.com",
  "password": "Password123",
  "phone": "08123456789"
}
```

**Login body:**
```json
{ "email": "buyer@seapedia.com", "password": "Password123" }
```

---

### 👤 Roles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/roles` | Get all roles for current user | ✅ |
| `POST` | `/roles/switch` | Switch active role, returns new JWT | ✅ |
| `POST` | `/roles/add` | Add a role to current account | ✅ |

**Switch role body:** `{ "role": "SELLER" }`

---

### 🏪 Stores

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/stores/:slug` | Get store by slug (public) | Public |
| `POST` | `/stores` | Create a store | ✅ |
| `GET` | `/stores/my/store` | Get my store | SELLER |
| `PUT` | `/stores/my/store` | Update my store | SELLER |

---

### 📦 Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/products` | Product list with filters | Public |
| `GET` | `/products/:storeSlug/:productSlug` | Product detail | Public |
| `POST` | `/products` | Create product | SELLER |
| `PUT` | `/products/:id` | Update product | SELLER |
| `DELETE` | `/products/:id` | Soft-delete product | SELLER |

**Query params for GET /products:**
```
?page=1&limit=20&search=keyboard&categoryId=xxx&minPrice=50000&maxPrice=500000&sortBy=price&sortOrder=asc
```

---

### 📁 Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories` | List all categories | Public |
| `POST` | `/categories` | Create category | ADMIN |

---

### 🛒 Cart

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/cart` | Get my cart | ✅ |
| `POST` | `/cart/items` | Add item to cart | ✅ |
| `PUT` | `/cart/items/:itemId` | Update item quantity | ✅ |
| `DELETE` | `/cart/items/:itemId` | Remove item | ✅ |
| `DELETE` | `/cart` | Clear entire cart | ✅ |

**Add item body:** `{ "productId": "xxx", "quantity": 2 }`

---

### 📋 Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/orders` | Create order from cart | BUYER |
| `GET` | `/orders` | My order history | BUYER |
| `GET` | `/orders/:id` | Order detail | BUYER or SELLER |
| `PATCH` | `/orders/:id/cancel` | Cancel order (auto-refund) | BUYER |
| `GET` | `/orders/seller/orders` | Incoming seller orders | SELLER |
| `PATCH` | `/orders/:id/process` | PAID → PROCESSING | SELLER |
| `PATCH` | `/orders/:id/ready` | PROCESSING → READY_FOR_PICKUP | SELLER |

**Create order body:**
```json
{
  "addressId": "clxxx",
  "storeId": "clyyy",
  "deliveryMethod": "REGULAR",
  "items": [
    { "cartItemId": "clzzz", "productId": "clwww", "quantity": 1 }
  ],
  "voucherId": "clvvv",
  "notes": "Please pack carefully"
}
```

---

### 💰 Wallet

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/wallet` | Get balance | ✅ |
| `POST` | `/wallet/topup` | Top up wallet | ✅ |
| `GET` | `/wallet/transactions` | Transaction history | ✅ |

**Top-up body:** `{ "amount": 100000 }` (min 10.000, max 10.000.000)

---

### 📍 Addresses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/addresses` | List all my addresses | ✅ |
| `POST` | `/addresses` | Create address | ✅ |
| `PUT` | `/addresses/:id` | Update address | ✅ |
| `DELETE` | `/addresses/:id` | Delete address | ✅ |
| `PATCH` | `/addresses/:id/default` | Set as default | ✅ |

---

### 🎫 Vouchers & Promos

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/vouchers/active` | Active vouchers for buyers | ✅ |
| `POST` | `/vouchers/validate` | Validate voucher code | ✅ |
| `GET` | `/vouchers/promos/active` | Active promos | Public |

**Validate body:** `{ "code": "WELCOME10", "orderAmount": 150000 }`

---

### 🚚 Driver

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/driver/jobs/available` | Available delivery jobs | DRIVER |
| `GET` | `/driver/jobs/my` | My accepted/completed jobs | DRIVER |
| `POST` | `/driver/jobs/:id/accept` | Accept a job | DRIVER |
| `PATCH` | `/driver/jobs/:id/pickup` | Confirm pickup | DRIVER |
| `PATCH` | `/driver/jobs/:id/complete` | Complete delivery (credits wallet) | DRIVER |
| `GET` | `/driver/earnings` | Earnings summary | DRIVER |

---

### ⭐ Reviews (Application Reviews)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/reviews` | Submit app review (guest or user) | Optional |
| `GET` | `/reviews` | Get all published reviews | Public |

**Submit review body:**
```json
{
  "rating": 5,
  "comment": "Great marketplace!",
  "name": "Anonymous User"
}
```
> Reviews are public and do not require purchase history. XSS is sanitized before storage.

---

### 📊 Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/reports/seller` | Seller revenue and top products | SELLER |

---

### 👑 Admin

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/admin/overview` | Marketplace stats | ADMIN |
| `GET` | `/admin/users` | List users (search + paginate) | ADMIN |
| `PATCH` | `/admin/users/:id/toggle` | Toggle user active/inactive | ADMIN |
| `POST` | `/admin/users/:id/roles` | Assign role to user | ADMIN |
| `GET` | `/admin/orders/overdue` | Get overdue orders | ADMIN |
| `PATCH` | `/admin/orders/:id/force-cancel` | Force refund an order | ADMIN |
| `POST` | `/admin/simulate-next-day` | Trigger auto overdue check | ADMIN |
| `GET` | `/admin/vouchers` | All vouchers | ADMIN |
| `POST` | `/admin/vouchers` | Create voucher | ADMIN |
| `PATCH` | `/admin/vouchers/:id/toggle` | Toggle voucher active | ADMIN |
| `GET` | `/admin/promos` | All promos | ADMIN |
| `POST` | `/admin/promos` | Create promo | ADMIN |
| `PATCH` | `/admin/promos/:id/toggle` | Toggle promo active | ADMIN |
| `POST` | `/admin/orders/run-overdue-check` | Run overdue check now | ADMIN |

**Create voucher body:**
```json
{
  "code": "SAVE20",
  "type": "PERCENTAGE",
  "value": 20,
  "minOrderAmount": 100000,
  "maxDiscount": 50000,
  "usageLimit": 100,
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**How to create an Admin account:**

Option A — Use the seeded admin account:
```
email: admin@seapedia.com
password: Password123
```

Option B — Assign admin role via Prisma Studio:
```bash
npx prisma studio
# Go to UserRole table → Add row with role=ADMIN for your userId
```

Option C — Via API (requires existing admin token):
```bash
POST /api/admin/users/:userId/roles
{ "role": "ADMIN" }
```

---

## 👤 Demo Accounts

All accounts use password: **`Password123`**

| Role | Email | Wallet | Notes |
|------|-------|--------|-------|
| 👑 **Admin** | admin@seapedia.com | Rp 0 | Full admin access |
| 🛍️ **Buyer** | buyer@seapedia.com | Rp 500.000 | Has a saved address |
| 🏪 **Seller** | seller@seapedia.com | Rp 250.000 | Has "Siti Electronics" store with 5 products |
| 🚚 **Driver** | driver@seapedia.com | Rp 150.000 | Ready to accept delivery jobs |

### Pre-seeded Voucher Codes

| Code | Type | Value | Minimum | Cap | Expiry |
|------|------|-------|---------|-----|--------|
| `WELCOME10` | PERCENTAGE | 10% | Rp 50.000 | Rp 25.000 | 30 days |
| `FLAT20K` | FIXED | Rp 20.000 | Rp 100.000 | — | Never |
| `COMPFEST18` | PERCENTAGE | 18% | — | Rp 50.000 | 7 days |

---

## 🔐 Security Notes

### 1. SQL Injection Prevention

SEAPEDIA uses **Prisma ORM** exclusively for all database access. Prisma uses parameterized queries internally — raw SQL is never constructed from user input. Even search queries use Prisma's `contains` filter which is properly escaped.

**Test case:** Input `'; DROP TABLE users; --` into the search box or any form field — the string is treated as a literal search term, not executed as SQL.

### 2. XSS Prevention

All incoming request bodies pass through the `sanitizeInput` middleware (using the `xss` library) before reaching any controller. This recursively strips HTML tags and script injection from strings.

```ts
// middleware/sanitize.ts
import xss from "xss";
// Runs on every POST/PUT/PATCH request body
app.use(sanitizeInput);
```

Public review comments are sanitized at write time (before DB storage) AND React's JSX rendering escapes output at read time, providing double-layer protection.

**Test case:** Submit `<script>alert('xss')</script>` as a review comment — it will be stored and displayed as plain text, never executed.

### 3. Input Validation

Every endpoint validates its request body using **Zod schemas** before any business logic runs. Required fields, types, ranges, and format constraints are all enforced:

- Email format validation
- Phone number min/max length
- Password complexity (min 8 chars, 1 uppercase, 1 number)
- Rating range: 1–5
- Price/stock minimum values
- Quantity minimum: 1
- Discount value limits

Invalid input returns a `400 Bad Request` with a specific error message.

### 4. Rate Limiting

| Limiter | Endpoints | Limit |
|---------|-----------|-------|
| `generalLimiter` | All `/api/*` | 100 req / 15 min per IP |
| `authLimiter` | `/api/auth/login`, `/api/auth/register` | 10 req / 15 min per IP |
| `topUpLimiter` | `/api/wallet/topup` | 20 req / hour per IP |

Exceeding a limit returns `429 Too Many Requests`.

### 5. Authentication & Session Security

- Passwords are hashed with **bcrypt** (12 salt rounds) — never stored in plaintext
- JWT tokens are signed with `HS256` and expire after 7 days
- Tokens are verified on every protected request — the server never trusts client-side role claims
- Logout clears the token client-side; no server-side session state exists
- The `activeRole` in the JWT is checked by `requireRole` middleware — even if a user switches roles in the UI, the backend validates the token's role on every call

### 6. Role-Based Access Control (RBAC)

The backend enforces two layers of access control:

1. **`authenticate` middleware**: Verifies JWT, rejects expired or tampered tokens
2. **`requireRole(...roles)` middleware**: Checks `req.user.activeRole` against the allowed roles for each endpoint

Frontend route protection (`ProtectedRoute`, `RoleRoute`) is a UX convenience only — the backend enforces the real rules. A user cannot access seller endpoints by manually navigating to a seller URL.

### 7. HTTP Security Headers

Helmet.js sets secure HTTP headers on every response:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HSTS)
- `Content-Security-Policy`

### 8. CORS

Only the configured `FRONTEND_URL` is allowed as an origin. All other origins receive a CORS rejection.

---

## 🎮 End-to-End Demo Guide

Follow this flow to demonstrate all roles in one session:

### Step 1 — Guest & Public Access
1. Open `http://localhost:5173` without logging in
2. Browse the product catalog at `/products`
3. Click a product to see its detail page
4. Submit an application review (no login required)

### Step 2 — Buyer Flow
1. Login as `buyer@seapedia.com` / `Password123`
2. Go to `/wallet` → Top Up Rp 500.000
3. Add "Mechanical Keyboard TKL" to cart
4. Go to `/addresses` → add a delivery address
5. Go to `/cart` → Proceed to Checkout
6. Select delivery method, apply `WELCOME10` voucher, place order
7. Check `/orders` — order shows as **Paid**

### Step 3 — Seller Flow
1. Login as `seller@seapedia.com` / `Password123`
2. Seller dashboard shows Siti Electronics store
3. Go to `/seller/orders` — see the buyer's order as **Paid**
4. Click **Proses Order** → status becomes **Processing**
5. Click **Tandai Siap — Minta Driver** → status becomes **Ready for Pickup**

### Step 4 — Driver Flow
1. Login as `driver@seapedia.com` / `Password123`
2. Go to `/driver/jobs` → Available Jobs tab
3. See the order from Step 3 — click **Ambil Job**
4. Status becomes **Assigned** — click **Konfirmasi Pickup**
5. Status becomes **Picked Up** — click **Selesai Antar**
6. Order becomes **Delivered** — check driver wallet for earnings credit

### Step 5 — Admin Flow
1. Login as `admin@seapedia.com` / `Password123`
2. Go to `/admin/dashboard` — see marketplace stats
3. Go to `/admin/users` — search, toggle, assign roles
4. Go to `/admin/vouchers` — create a new voucher
5. Go to `/admin/orders/overdue` — click **Jalankan Auto Overdue Check**
6. Any orders past their SLA deadline are auto-refunded

### Step 6 — Security Demo
1. In the search bar, enter `<script>alert(1)</script>` — no alert fires
2. In login form, enter `' OR '1'='1` as email — returns validation error
3. Try accessing `/admin/dashboard` while logged in as a buyer — redirected
4. Try calling `POST /api/orders` with a SELLER token — returns 403

---

## 📜 Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npx prisma studio` | Open visual database browser |
| `npx prisma migrate dev` | Apply schema changes |
| `npx prisma generate` | Regenerate Prisma client |
| `node -r ts-node/register prisma/seed.ts` | Seed demo data |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🐛 Common Issues

### `DATABASE_URL` error on migrate
Make sure PostgreSQL is running and the database exists:
```bash
createdb seapedia
# or create it in pgAdmin
```

### Prisma v7 constructor error
Prisma v7 requires a driver adapter. Ensure `@prisma/adapter-pg` is installed and `lib/prisma.ts` uses `new PrismaClient({ adapter })`.

### Seed fails with `Cannot find module`
Run from the backend root:
```bash
node -r ts-node/register prisma/seed.ts
```

### TypeScript errors after pulling
```bash
cd backend && npx prisma generate
# Then restart TS Server in VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Port already in use
Change `PORT` in `backend/.env` to any free port and update `VITE_API_URL` in `frontend/.env` to match.

---

## 📦 Development Roadmap

- [x] Phase 0 — Project Setup & Database Schema
- [x] Phase 1 — Auth, Multi-Role System, UI Foundation
- [x] Phase 2 — Store Management & Product CRUD
- [x] Phase 3 — Wallet, Cart, Addresses, Checkout & Orders
- [x] Phase 4 — Vouchers, Promos & Seller Reports
- [x] Phase 5 — Driver Dashboard & Delivery Flow
- [x] Phase 6 — Admin Dashboard & Marketplace Management
- [x] Phase 7 — Security Hardening, Seed Data & Documentation
- [ ] Phase 8 — Deployment

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Built with ❤️ by [Radityaaa27](https://github.com/Radityaaa27)**

*COMPFEST 18 Software Engineering Academy — Fullstack Marketplace Challenge*

[⬆ Back to Top](#seapedia--fullstack-multi-role-marketplace)

</div>