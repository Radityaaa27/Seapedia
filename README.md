# SEAPEDIA - Fullstack Marketplace Platform

<div align="center">

![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.0+-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0+-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

*A fullstack multi-role marketplace built for COMPFEST 18 Software Engineering Academy. Supports buyers, sellers, drivers, and admins in one unified platform — from product listing to wallet-based checkout to delivery tracking.*

[🚀 Live Demo](#) • [📖 Documentation](#documentation) • [🛠️ Setup Guide](#quick-start) • [🏗️ Architecture](#architecture)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Demo Accounts](#demo-accounts)
- [Available Scripts](#available-scripts)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About The Project

SEAPEDIA is a comprehensive, production-style fullstack marketplace inspired by Tokopedia and Shopee. It supports four distinct roles in one account system — Buyer, Seller, Driver, and Admin — each with their own dashboard and permissions. Built with React on the frontend and Express + Prisma on the backend, SEAPEDIA covers the entire e-commerce lifecycle: browsing, cart, checkout with tax and delivery fee calculation, order fulfillment, and last-mile delivery.

### 🌟 Key Highlights

- **🔄 Multi-Role System**: One account, multiple roles — switch between Buyer, Seller, Driver, and Admin instantly
- **🎨 Modern UI/UX**: Built with shadcn/ui and Lucide icons for a clean, Tokopedia-style storefront
- **🔐 Secure Authentication**: JWT-based auth with role-based route protection
- **💰 Wallet System**: Built-in wallet with top-up, payment, refund, and driver earnings
- **📦 Full Order Lifecycle**: From cart to checkout to delivery, with PPN tax and weight-based shipping fees
- **🧪 Type Safety**: Full TypeScript coverage on both frontend and backend
- **🛡️ Security Hardened**: Rate limiting, XSS sanitization, and Zod input validation

### 🎪 Core Modules

- **Marketplace** — Public product catalog, store pages, search and filters
- **Buyer** — Cart, addresses, wallet, checkout, order tracking, vouchers
- **Seller** — Store management, product CRUD, order processing, revenue reports
- **Driver** — Available delivery jobs, pickup/delivery flow, earnings tracking
- **Admin** — Marketplace overview, user management, voucher/promo control, overdue order handling

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download Link | Notes |
|----------|---------|---------------|-------|
| **Node.js** | 18.0+ | [Download](https://nodejs.org/) | LTS version recommended |
| **npm** | 10.0+ | Included with Node.js | Package manager |
| **PostgreSQL** | 15.0+ | [Download](https://www.postgresql.org/) | Primary database |
| **Git** | 2.30+ | [Download](https://git-scm.com/) | Version control |

### System Requirements

| Platform | Minimum Requirements |
|----------|---------------------|
| **Windows** | Windows 10+ |
| **macOS** | macOS 10.15+ |
| **Linux** | Ubuntu 18.04+ or equivalent |

### Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### Development Environment

- **Code Editor**: VS Code (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint
  - Prisma

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

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/seapedia"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Run database migration and seed:
```bash
npx prisma generate
npx prisma migrate dev
node -r ts-node/register prisma/seed.ts
```

Start backend server:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 4. Verify Installation

Open your browser and navigate to `http://localhost:5173`. You should see:

1. ✅ **Landing Page** with hero section and product categories
2. ✅ **Product Catalog** with search and category filters
3. ✅ **Login** with demo accounts (see below)
4. ✅ **Role Selector** to switch between Buyer, Seller, Driver, Admin
5. ✅ **Wallet** with top-up and transaction history
6. ✅ **Cart & Checkout** with PPN tax and delivery fee calculation

The app will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Prisma Studio**: `npx prisma studio` (database GUI)

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.0+ | UI library |
| **Language** | TypeScript | 5.0+ | Type safety |
| **Build Tool** | Vite | 7.0+ | Development & build |
| **Styling** | Tailwind CSS | 3.4+ | Utility-first CSS |
| **UI Library** | shadcn/ui | Latest | Component system (Nova preset) |
| **Icons** | Lucide React | Latest | Icon set |
| **State** | TanStack Query | 5.0+ | Server state management |
| **HTTP** | Axios | 1.0+ | API calls |
| **Routing** | React Router | 6.0+ | Client-side routing |
| **Toasts** | Sonner | Latest | Notifications |

### Backend

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Runtime** | Node.js | 18.0+ | JavaScript runtime |
| **Framework** | Express | 4.0+ | REST API |
| **Language** | TypeScript | 5.0+ | Type safety |
| **ORM** | Prisma | 7.0+ | Database ORM (driver adapters) |
| **Database** | PostgreSQL | 15.0+ | Primary database |
| **Auth** | JWT + bcryptjs | — | Authentication |
| **Validation** | Zod | 4.0+ | Schema validation |
| **Security** | express-rate-limit, xss | — | Rate limiting & sanitization |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart on file change |
| **ts-node** | TypeScript execution |
| **Prisma Studio** | Visual database browser |

---

## 🏗️ Architecture

### Project Structure

```
Seapedia/
├── 📁 frontend/                      # React application
│   ├── 📁 src/
│   │   ├── 📁 pages/                 # Route-level pages
│   │   │   ├── 📁 buyer/             # Cart, checkout, wallet, orders
│   │   │   ├── 📁 seller/            # Store, products, reports
│   │   │   ├── 📁 driver/            # Jobs, earnings
│   │   │   └── 📁 admin/             # Overview, users, vouchers
│   │   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 contexts/              # Auth & Cart global state
│   │   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📁 services/              # API call functions
│   │   ├── 📁 types/                 # TypeScript types
│   │   └── 📁 layouts/               # Navbar, Footer, MainLayout
│   └── 📄 package.json
│
├── 📁 backend/                       # Express application
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma          # Database models
│   │   └── 📄 seed.ts                # Demo data seeding
│   ├── 📁 src/
│   │   ├── 📁 controllers/           # Request handlers
│   │   ├── 📁 services/              # Business logic
│   │   ├── 📁 repositories/          # Database queries
│   │   ├── 📁 routes/                # API route definitions
│   │   ├── 📁 middleware/            # Auth, RBAC, rate limit, sanitize
│   │   ├── 📁 validators/            # Zod schemas
│   │   ├── 📁 utils/                 # Helpers (ApiError, ApiResponse, JWT)
│   │   └── 📁 lib/                   # Prisma client instance
│   └── 📄 package.json
│
├── 📄 .gitignore
└── 📄 README.md
```

### Database Schema

```
User ──┬── Store ── Product ── ProductImage
       ├── Wallet ── WalletTransaction
       ├── Cart ── CartItem
       ├── Address
       ├── Order ── OrderItem
       │            └── Delivery
       └── Review

Voucher / Promo ── Order
```

### Request Flow

```
React (Frontend)
    ↓  axios + JWT
Express (Backend)
    ↓  authenticate & requireRole middleware
Controllers → Services → Repositories
    ↓  Prisma ORM
PostgreSQL
```

---

## ✨ Features

### 🛍️ Marketplace
- Public product catalog with search, category, and price filters
- Product detail pages with reviews and ratings
- Store pages with seller info and product listings

### 🔄 Multi-Role System
- One account, multiple roles (Buyer, Seller, Driver, Admin)
- Instant role switching without re-login
- Role-based protected routes on both frontend and backend

### 💰 Wallet & Checkout
- Wallet top-up with preset and custom amounts
- Full transaction history (top-up, payment, refund, earning)
- Checkout with PPN tax (12%), weight-based delivery fee, and voucher discounts
- Single-store-per-order checkout flow

### 📦 Order Lifecycle
- Order status flow: Pending → Paid → Processing → Ready for Pickup → On Delivery → Delivered → Completed
- Buyer-side order cancellation with automatic refund and stock restoration
- Seller order processing dashboard

### 🚚 Driver Operations
- Browse and accept available delivery jobs
- Pickup confirmation and delivery completion flow
- Automatic wallet earnings credit on completed delivery

### 🎫 Vouchers & Promos
- Percentage or fixed-amount discount vouchers
- Usage limits and minimum order requirements
- Platform-wide promotional banners

### 👑 Admin Dashboard
- Marketplace-wide stats (users, orders, revenue)
- User management with role assignment and account toggling
- Voucher and promo creation/management
- Overdue order detection with force-refund capability

### 🔐 Security
- JWT authentication with bcrypt password hashing
- Rate limiting on auth and wallet top-up endpoints
- XSS input sanitization on all request bodies
- Zod schema validation across every endpoint
- Helmet security headers + strict CORS policy

---

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register new account | Public |
| `POST` | `/api/auth/login` | Login and get JWT token | Public |
| `GET` | `/api/auth/me` | Get current user profile | Authenticated |

### Roles

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/roles` | Get my roles | Authenticated |
| `POST` | `/api/roles/switch` | Switch active role | Authenticated |
| `POST` | `/api/roles/add` | Add a new role to account | Authenticated |

### Stores & Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/products` | Get product list with filters | Public |
| `GET` | `/api/products/:storeSlug/:productSlug` | Get product detail | Public |
| `POST` | `/api/stores` | Create a store | Authenticated |
| `POST` | `/api/products` | Create product | Seller |
| `PUT` | `/api/products/:id` | Update product | Seller |
| `DELETE` | `/api/products/:id` | Delete product | Seller |

### Cart & Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/cart` | Get my cart | Authenticated |
| `POST` | `/api/cart/items` | Add item to cart | Authenticated |
| `POST` | `/api/orders` | Create order from cart | Buyer |
| `GET` | `/api/orders` | Get my orders | Buyer |
| `PATCH` | `/api/orders/:id/cancel` | Cancel order | Buyer |
| `GET` | `/api/orders/seller/orders` | Get seller's incoming orders | Seller |

### Wallet

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/wallet` | Get wallet balance | Authenticated |
| `POST` | `/api/wallet/topup` | Top up wallet | Authenticated |
| `GET` | `/api/wallet/transactions` | Get transaction history | Authenticated |

### Driver

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/driver/jobs/available` | Get available delivery jobs | Driver |
| `POST` | `/api/driver/jobs/:id/accept` | Accept a job | Driver |
| `PATCH` | `/api/driver/jobs/:id/complete` | Complete delivery | Driver |
| `GET` | `/api/driver/earnings` | Get earnings summary | Driver |

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/api/admin/overview` | Marketplace stats | Admin |
| `GET` | `/api/admin/users` | List all users | Admin |
| `PATCH` | `/api/admin/users/:id/toggle` | Activate/deactivate user | Admin |
| `POST` | `/api/admin/vouchers` | Create voucher | Admin |

### Example Request

```typescript
// Login
const response = await axios.post('http://localhost:5000/api/auth/login', {
  email: 'buyer@seapedia.com',
  password: 'Password123'
})

// Get products (public)
const products = await axios.get('http://localhost:5000/api/products')

// Create order (with JWT token)
const order = await axios.post(
  'http://localhost:5000/api/orders',
  { addressId, storeId, items },
  { headers: { Authorization: `Bearer ${token}` } }
)
```

---

## 👤 Demo Accounts

All passwords: `Password123`

| Role | Email | Wallet Balance |
|------|-------|-----------------|
| 👑 Admin | admin@seapedia.com | Rp 0 |
| 🛍️ Buyer | buyer@seapedia.com | Rp 500.000 |
| 🏪 Seller | seller@seapedia.com | Rp 250.000 |
| 🚚 Driver | driver@seapedia.com | Rp 150.000 |

### Voucher Codes

| Code | Discount |
|------|----------|
| `WELCOME10` | 10% off (min Rp 50.000, max Rp 25.000) |
| `FLAT20K` | Rp 20.000 off (min Rp 100.000) |
| `COMPFEST18` | 18% off (max Rp 50.000, 7 days) |

---

## 📜 Available Scripts

### Frontend

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start development server | Daily development |
| `npm run build` | Build for production | Production deployment |
| `npm run preview` | Preview production build | Pre-deployment testing |
| `npm run lint` | Run ESLint | Code quality check |

### Backend

| Command | Description | Use Case |
|---------|-------------|----------|
| `npm run dev` | Start server with nodemon | Daily development |
| `npm run build` | Compile TypeScript | Production build |
| `npm start` | Run compiled JS | Production |
| `npx prisma studio` | Open database GUI | Database inspection |
| `npx prisma migrate dev` | Run migrations | Schema changes |
| `npx prisma generate` | Generate Prisma client | After schema changes |
| `node -r ts-node/register prisma/seed.ts` | Seed demo data | Initial setup |

---

## 📦 Development Roadmap

- [x] Phase 0 — Project Setup & Database Schema
- [x] Phase 1 — Authentication, Multi-Role System, UI Foundation
- [x] Phase 2 — Store Management & Product CRUD
- [x] Phase 3 — Wallet, Cart, Address, Checkout & Orders
- [x] Phase 4 — Vouchers, Promos & Seller Reports
- [x] Phase 5 — Driver Dashboard & Delivery Flow
- [x] Phase 6 — Admin Dashboard & Marketplace Management
- [x] Phase 7 — Security Hardening, Seed Data & Documentation
- [ ] Phase 8 — Deployment (Render + Neon + Vercel)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**:
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes**
4. **Run quality checks**:
```bash
npm run lint
npm run build
```
5. **Commit your changes**:
```bash
git commit -m 'feat: add amazing feature'
```
6. **Push to your branch**:
```bash
git push origin feature/amazing-feature
```
7. **Open a Pull Request**

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Description |
|--------|-------------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code style changes |
| `refactor:` | Code refactoring |
| `chore:` | Maintenance tasks |

---

## 📞 Support

### Common Issues

#### Migration Error
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```

#### Prisma v7 Client Constructor Error
Prisma v7 requires a driver adapter. Make sure `@prisma/adapter-pg` is installed and your Prisma client is initialized with `new PrismaClient({ adapter })`.

#### TypeScript Error
```
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

#### node_modules Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Radityaaa27](https://github.com/Radityaaa27)**

*A fullstack marketplace project built for COMPFEST 18 Software Engineering Academy.*

[⬆ Back to Top](#seapedia---fullstack-marketplace-platform)

</div>
```