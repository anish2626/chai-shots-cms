# ☕ Chai Shots CMS

A **role-based Content Management System (CMS)** for managing educational programs and lessons, built with **NestJS, Prisma, PostgreSQL, React, and Docker**.  
The system supports **Admin, Editor, and Viewer roles**, secure authentication, scheduled publishing via a worker service, and a public catalog API.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Roles supported:
  - **Admin** – full access
  - **Editor** – content access
  - **Viewer** – read-only access
- Secure password hashing using **bcrypt**

### 📚 Content Management
- Programs → Terms → Lessons hierarchy
- Draft, scheduled, published, archived states
- Multi-language content support
- Program & lesson assets

### ⏱ Background Worker
- Dedicated **worker service**
- Cron-based scheduled publishing of lessons
- Runs independently from the API

### 🌐 APIs
- Auth API – login and JWT issuance
- CMS API – role-protected endpoints
- Catalog API – public read-only access

### 🐳 Dockerized Setup
- Multi-service Docker Compose
- Services:
  - API (NestJS)
  - Worker (NestJS)
  - Web (React)
  - PostgreSQL

---

## 🧱 Tech Stack

| Layer | Technology |
|-----|-----------|
| Backend | NestJS (TypeScript) |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | JWT + Passport |
| Frontend | React (Vite) |
| Background Jobs | NestJS Scheduler |
| Containerization | Docker & Docker Compose |

---

## 📂 Project Structure

```
chai-shots-cms/
├── apps/
│   ├── api/
│   ├── worker/
│   └── web/
├── prisma/
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env.docker` file:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/chaishots
JWT_SECRET=supersecretkey
```

---

## ▶️ Running the Project

```
docker compose up -d
```

Health check:
```
http://localhost:3000/health
```

---

## 🌱 Database Seeding

```
docker exec -it chaishots-api npx prisma db seed
```

### Seeded Users

| Role | Email | Password |
|----|------|---------|
| Admin | admin@cms.com | password123 |
| Editor | editor@cms.com | password123 |
| Viewer | viewer@cms.com | password123 |

---

## 🔑 Authentication

```
POST /auth/login
```

Request:
```
{
  "email": "admin@cms.com",
  "password": "password123"
}
```

---

## 🔒 Role-Protected Endpoints

| Endpoint | Role |
|-------|------|
| /cms/admin-only | Admin |
| /cms/editor | Admin, Editor |
| /cms/viewer | All |

---

## 🌍 Public Catalog API

- /catalog/programs
- /catalog/programs/:id
- /catalog/lessons/:id

---

## ⏲ Worker Service

- Automatically publishes scheduled lessons
- Uses NestJS Scheduler
- Runs as a separate container

---

## 📌 Design Decisions

- Separate worker service for scalability
- Guard-level RBAC enforcement
- Docker-first deployment
- Type-safe Prisma ORM

---

## 👤 Author

**Anish Kumar Maganti**  
GitHub: https://github.com/anish2626
