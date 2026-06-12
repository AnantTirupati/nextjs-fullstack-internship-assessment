# InternShip — Full-Stack Assessment Project

A production-ready full-stack application built with **Next.js 15**, **MongoDB**, **JWT Authentication**, **Role-Based Access Control**, and **Comprehensive API Documentation**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Seed Data](#-seed-data)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
- [Folder Structure](#-folder-structure)
- [Docker](#-docker)
- [Deployment](#-deployment)

---

## ✨ Features

### Authentication & Security
- JWT-based authentication with access & refresh tokens
- bcrypt password hashing (12 rounds)
- Role-based access control (user / admin)
- Rate limiting on auth endpoints
- Input validation with Zod
- Input sanitization against XSS

### Product Management
- Full CRUD operations
- Pagination with configurable page size
- Full-text search on title & description
- Sort by title, price, date, stock, category
- Filter by category, price range
- Admin-only create/update/delete

### Frontend
- Premium, responsive UI with Tailwind CSS
- Dark mode support
- Glassmorphism design elements
- Micro-animations and transitions
- Toast notifications
- Loading skeletons
- Form validation with React Hook Form + Zod

### API Documentation
- Swagger/OpenAPI 3.0 specification
- Postman collection with test scripts
- Auto-token management in Postman

---

## 🛠 Tech Stack

| Layer       | Technology                                    |
| ----------- | --------------------------------------------- |
| Framework   | Next.js 15 (App Router)                       |
| Language    | TypeScript 5                                  |
| Database    | MongoDB Atlas + Mongoose ODM                  |
| Auth        | JWT (jsonwebtoken) + bcryptjs                 |
| Validation  | Zod + React Hook Form                         |
| HTTP Client | Axios with interceptors                       |
| Styling     | Tailwind CSS 4                                |
| Docs        | Swagger/OpenAPI 3.0 + Postman                 |
| Logging     | Winston                                       |
| Container   | Docker + Docker Compose                       |
| Deploy      | Vercel                                        |

---

## 📦 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB Atlas** account (or local MongoDB instance)
- **Git**

---

## 🚀 Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd internship

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and secrets

# 4. Seed the database (creates admin user + sample products)
npm install -g dotenv-cli   # If not installed
npx tsx seed.ts

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

| Variable               | Description                          | Default                     |
| ---------------------- | ------------------------------------ | --------------------------- |
| `MONGODB_URI`          | MongoDB connection string            | —                           |
| `JWT_SECRET`           | Secret key for JWT signing           | —                           |
| `JWT_REFRESH_SECRET`   | Secret key for refresh tokens        | —                           |
| `JWT_EXPIRES_IN`       | Access token expiry                  | `1d`                        |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry               | `7d`                        |
| `NEXT_PUBLIC_API_URL`  | Public API base URL                  | `http://localhost:3000`     |
| `NODE_ENV`             | Environment                          | `development`               |
| `ADMIN_NAME`           | Seed admin name                      | `Admin User`                |
| `ADMIN_EMAIL`          | Seed admin email                     | `admin@example.com`         |
| `ADMIN_PASSWORD`       | Seed admin password                  | `Admin@123456`              |

---

## 💻 Running Locally

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

---

## 🌱 Seed Data

Run the seed script to create an admin user and sample products:

```bash
npx tsx seed.ts
```

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `Admin@123456`

---

## 📖 API Documentation

### Swagger/OpenAPI
- **JSON Spec**: [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Postman Collection
1. Import `docs/postman-collection.json` into Postman
2. Variables `baseUrl` and `token` are auto-configured
3. Run Login first — the token is auto-saved via test scripts

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint                    | Access  | Description          |
| ------ | --------------------------- | ------- | -------------------- |
| POST   | `/api/v1/auth/register`     | Public  | Register new user    |
| POST   | `/api/v1/auth/login`        | Public  | Login user           |
| GET    | `/api/v1/auth/profile`      | Auth    | Get current profile  |
| POST   | `/api/v1/auth/refresh`      | Public  | Refresh tokens       |

### Products

| Method | Endpoint                    | Access  | Description          |
| ------ | --------------------------- | ------- | -------------------- |
| GET    | `/api/v1/products`          | Auth    | List all products    |
| POST   | `/api/v1/products`          | Admin   | Create product       |
| GET    | `/api/v1/products/:id`      | Auth    | Get product by ID    |
| PUT    | `/api/v1/products/:id`      | Admin   | Update product       |
| DELETE | `/api/v1/products/:id`      | Admin   | Delete product       |

### Query Parameters (GET /api/v1/products)

| Param     | Type    | Default     | Description              |
| --------- | ------- | ----------- | ------------------------ |
| page      | number  | 1           | Page number              |
| limit     | number  | 10          | Items per page           |
| search    | string  | —           | Text search              |
| sort      | string  | createdAt   | Sort field               |
| order     | string  | desc        | Sort order (asc/desc)    |
| category  | string  | —           | Filter by category       |
| minPrice  | number  | —           | Minimum price filter     |
| maxPrice  | number  | —           | Maximum price filter     |

---

## 📁 Folder Structure

```
src/
├── app/                      # Next.js App Router
│   ├── api/v1/               # API routes (versioned)
│   │   ├── auth/             # Auth endpoints
│   │   ├── products/         # Product endpoints
│   │   └── docs/             # Swagger endpoint
│   ├── dashboard/            # Protected dashboard page
│   ├── login/                # Login page
│   ├── register/             # Register page
│   ├── products/             # Products pages
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles + design system
├── components/layout/        # Layout components (Navbar)
├── context/                  # React contexts (Auth, Toast)
├── hooks/                    # Custom hooks
├── lib/                      # Core libraries (db, auth, swagger)
├── middleware/               # Route middleware (auth, admin, validate)
├── models/                   # Mongoose models (User, Product)
├── services/                 # Business logic layer
├── types/                    # TypeScript type definitions
├── utils/                    # Utility functions
└── validators/               # Zod schemas
```

---

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Build only
docker build -t internship-app .

# Stop
docker-compose down
```

Services:
- **app**: Next.js application (port 3000)
- **mongo**: MongoDB 7 (port 27017)
- **redis**: Redis 7 (port 6379)

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository in Vercel dashboard
3. Add environment variables in Vercel settings
4. Deploy!

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

> **Note:** Set all environment variables in Vercel project settings.

---

## 📄 License

This project is part of an internship assessment.
