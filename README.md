# Hirevia
Lightweight Applicant Tracking & Hiring Pipeline System

## Overview

A personal full-stack project built for learning and practicing real-world system design and backend development concepts.

Hirevia simulates a lightweight Applicant Tracking System (ATS) with two sides:
- **Public site** — applicants browse open jobs, submit applications, and track their status via a magic link (no login needed)
- **Admin dashboard** — HR admins manage job postings, review applications, and move candidates through the hiring pipeline

The main goal is to explore how production-style systems are designed and implemented, including JWT authentication, role-based permissions, database design, file storage, and email notifications.

> This project is not intended for production use. It is a hands-on study of building scalable backend systems with a modern full-stack architecture.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui |
| Backend | FastAPI + SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| Storage | Supabase Storage |
| Email | Resend |
| Deployment | Docker |

---

## Features

### Public
- Browse open job listings with filters (job type, salary range, urgent)
- View job details and apply with resume upload
- Track application status via magic link token (no login needed)

### Admin
- JWT authentication with role-based access (`head_admin` / `admin`)
- Dashboard with stats, upcoming interviews, and latest applications
- Full job management (create, update, archive, status pipeline)
- Application pipeline management (applied → screening → interview → offer / rejected)
- Resume upload to Supabase Storage
- Email notifications to applicants on status changes

---

## Design
The UX/UI was designed in Figma before development:
- Figma (UX/UI Design): https://www.figma.com/design/Vs4dScPyf4gPfoLXpg4Mkg/Hirevia-UX-UI?node-id=4604-13287&t=l5pH9GDputxae44F-1

---

## Assets & Image Policy

All placeholder images bundled by v0 during initial scaffolding (including `hero-team.jpg` and other stock photos) have been removed from this project to ensure safe use as a portfolio. The only remaining image assets are app icons generated as pure SVG/PNG geometry by v0, which carry no photo licensing concerns.

---

## Tools & AI Used

| Tool | Role |
|------|------|
| [Figma](https://figma.com) | UX/UI design and prototyping |
| [v0](https://v0.dev) | Initial frontend scaffolding and component generation |
| [Claude Code](https://claude.ai/code) | Frontend audit, fixing API connections from v0 to backend, and minor backend assistance |

---

## Getting Started

### Prerequisites
- Docker + Docker Compose
- Supabase account (free tier works)
- Resend account (free tier works)

---

### 1. Clone the repository
```bash
git clone https://github.com/PhakanunK/Hirevia.git
cd Hirevia
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `database-init/init.sql`
3. Go to **Storage** → create a new bucket named `resumes` → set to **Public**
4. Add a storage policy to allow public uploads:
```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT TO anon
WITH CHECK (bucket_id = 'resumes');
```
5. Go to **Settings → API** and note your **Project URL** and **anon public key**

### 3. Set up Resend
1. Create a free account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. For development, use `onboarding@resend.dev` as the from address (emails may go to spam)
4. For production, verify your own domain in Resend settings

### 4. Configure environment variables

**Backend** — copy the example file and fill in your values:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@db.your_project.supabase.co:5432/postgres

# JWT
SECRET_KEY=your_secret_key_here_make_it_long_and_random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Supabase Storage
SUPABASE_URL=https://your_project.supabase.co
SUPABASE_KEY=your_anon_public_key
SUPABASE_BUCKET=resumes

# Email
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev

# App
DEBUG=True
FRONTEND_URL=http://localhost:3000
PAGE_SIZE_CARD=6
PAGE_SIZE_TABLE=10
MAX_PAGE_SIZE=50
```

**Frontend** — copy the example file and fill in your values:
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Run with Docker
```bash
docker-compose up --build
```

The first run will automatically create a default head admin account:
- **Email:** `admin@hirevia.com`
- **Password:** `Admin123`

> ⚠️ Change the default password immediately after first login!

---

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

> API docs are only available when `DEBUG=True`

---

## Project Structure

```
hirevia/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── admin/          # JWT-protected admin routes
│   │   │   └── public/         # Public applicant routes
│   │   ├── core/               # Config, database, dependencies
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── repositories/       # Database queries
│   │   ├── schemas/            # Pydantic request/response models
│   │   ├── services/           # Business logic
│   │   └── utils/              # Security, storage, email helpers
│   ├── scripts/
│   │   └── seed_admin.py       # Creates initial head admin
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── (public)/           # Public applicant site
    │   └── admin/              # HR admin dashboard (JWT-guarded layout)
    ├── components/
    │   ├── admin/              # Smart components (jobs-table, users-table, job-form-fields)
    │   └── ui/                 # shadcn/ui primitives
    ├── contexts/               # AdminContext — current user shared across dashboard
    ├── hooks/                  # use-mobile, use-toast
    └── lib/
        ├── api.ts              # HTTP client (publicFetch, adminFetch)
        ├── actions/            # API call functions, one file per domain
        ├── models/             # TypeScript interfaces, one file per domain
        └── utils/              # constants.ts, format.utils.ts
```

---

## Architecture

### Backend

Strict layered architecture — each layer has one responsibility and communicates only with the layer below it:

```
Route → Service → Repository → Database
```

| Layer | Responsibility |
|-------|---------------|
| **Routes** | HTTP request/response, parameter parsing, exception-to-status-code mapping |
| **Services** | Business logic only — raises plain Python exceptions, no FastAPI imports |
| **Repositories** | Database queries only — accepts `dict`, no business logic |
| **Models** | SQLAlchemy ORM definitions, never exposed directly to the API |
| **Schemas** | Pydantic models for request validation and response serialization |

### Frontend

Strict layered architecture — pages never call the HTTP client directly:

```
Page / Component → Action → API Client → Backend
```

| Layer | Location | Responsibility |
|-------|----------|---------------|
| **Pages** | `app/` | UI rendering, local state, user interaction |
| **Actions** | `lib/actions/` | All API calls — one file per domain (`job`, `application`, `user`, `dashboard`, `public`) |
| **API client** | `lib/api.ts` | Low-level HTTP client (`publicFetch`, `adminFetch`), token management |
| **Models** | `lib/models/` | TypeScript interfaces split by domain (`job`, `application`, `user`, `dashboard`) |
| **Utils** | `lib/utils/` | Pure helpers — `constants.ts` for config/status maps, `format.utils.ts` for display formatting |

Shared UI state (current logged-in user) is provided via `contexts/admin-context.tsx` to all dashboard pages through the layout.

---

## Default Admin Account

On first startup, a head admin is automatically created:

| Field | Value |
|-------|-------|
| Email | `admin@hirevia.com` |
| Password | `Admin123` |
| Role | `head_admin` |

> ⚠️ Change this password after first login!