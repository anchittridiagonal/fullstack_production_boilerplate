# Fullstack Production Boilerplate

A production-ready full-stack web application built with **Next.js** (App Router), **Node.js + Express**, and **MongoDB**.

---

## Tech Stack

### Frontend
- Next.js 14 (App Router) + React 18
- TypeScript
- Tailwind CSS (dark/light mode)
- Zustand (state management)
- React Hook Form + Zod (form validation)
- Axios (HTTP client)
- JWT-based authentication

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose ODM
- JWT (access + refresh token)
- RBAC (Admin / User roles)
- Swagger / OpenAPI documentation
- Winston logging
- Helmet, CORS, Rate Limiting
- Multer (file uploads)
- Nodemailer (email)
- Joi / Zod validation

### DevOps
- Docker + Docker Compose
- ESLint + Prettier
- Husky + lint-staged
- Jest + Supertest (backend)
- React Testing Library (frontend)

---

## Project Structure

```
.
├── backend/                  # Express API
│   ├── src/
│   │   ├── api/v1/           # Versioned REST modules
│   │   │   ├── auth/
│   │   │   └── users/
│   │   ├── config/           # DB, Swagger, app config
│   │   ├── middleware/       # Auth, RBAC, error, validate, upload
│   │   ├── models/           # Mongoose schemas
│   │   ├── seeds/            # DB seeders
│   │   ├── types/            # Shared TypeScript types
│   │   ├── utils/            # Logger, response, email, jwt, pagination
│   │   ├── app.ts            # Express app factory
│   │   └── server.ts         # Entry point
│   ├── tests/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                 # Next.js app
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   │   ├── (auth)/       # Login, Register, Forgot/Reset Password
│   │   │   └── (dashboard)/  # Admin & User panels
│   │   ├── components/
│   │   │   ├── ui/           # Button, Input, Card, Modal, Table…
│   │   │   ├── forms/        # LoginForm, RegisterForm…
│   │   │   └── layout/       # Navbar, Sidebar, Footer
│   │   ├── hooks/            # useAuth, useToast, useDebounce
│   │   ├── lib/              # axios instance, auth helpers
│   │   ├── services/         # API service layer
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # Shared TypeScript types
│   │   └── utils/
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Docker)
- Docker & Docker Compose (optional)

---

### Option A — Docker Compose (recommended)

```bash
# 1. Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Start all services
docker compose up --build
```

Services:
| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000        |
| Backend   | http://localhost:5000        |
| Swagger   | http://localhost:5000/api-docs|
| MongoDB   | mongodb://localhost:27017    |

---

### Option B — Local Development

#### Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in values
npm run dev                 # ts-node-dev hot reload
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # fill in values
npm run dev
```

---

### Seed the Database

```bash
cd backend
npm run seed
```

Creates default **Admin** and **User** accounts:

| Role  | Email               | Password    |
|-------|---------------------|-------------|
| Admin | admin@example.com   | Admin@1234  |
| User  | user@example.com    | User@1234   |

---

## API Documentation

Swagger UI is available at **http://localhost:5000/api-docs** when the backend is running.

---

## Authentication Flow

```
POST /api/v1/auth/register       Register new user
POST /api/v1/auth/login          Login → access + refresh tokens
POST /api/v1/auth/refresh-token  Rotate refresh token
POST /api/v1/auth/logout         Invalidate refresh token
POST /api/v1/auth/forgot-password  Send reset email
POST /api/v1/auth/reset-password   Reset with token
```

---

## API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error response:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all required variables.

---

## Testing

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

---

## RBAC Roles

| Permission               | User | Admin |
|--------------------------|------|-------|
| View own profile         | ✓    | ✓     |
| Edit own profile         | ✓    | ✓     |
| View all users           | ✗    | ✓     |
| Manage users             | ✗    | ✓     |
| Access admin dashboard   | ✗    | ✓     |

---

## License

MIT
