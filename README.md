# ⚖️ Nyaya — RERA Compliance Tool

Nyaya is an AI-powered RERA (Real Estate Regulatory Authority) compliance assistant for India. It helps real estate developers, legal teams, and homebuyers navigate state-specific RERA regulations using Claude AI.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📋 Compliance Checklist | Generate a state-specific RERA checklist for any project in seconds |
| 📄 Document Review | Upload sale agreements or brochures and get an instant compliance audit |
| 💬 RERA Expert Chat | Ask anything about RERA — penalties, escrow rules, timelines, allottee rights |

**States supported:** Maharashtra, Gujarat, Haryana, Karnataka, Delhi, Tamil Nadu, Rajasthan

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Tailwind CSS, Axios |
| Backend | Spring Boot 3.2, Java 17, WebFlux |
| Database | PostgreSQL 16 |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| DevOps | Docker, Docker Compose, Railway |

---

## 🚀 Quick Start (Local with Docker)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- A Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Clone and configure

```bash
git clone https://github.com/shriyashpatil/nyaya.git
cd nyaya
cp .env.example .env
```

Open `.env` and add your Claude API key:

```env
CLAUDE_API_KEY=sk-ant-api03-xxxxxxxxxxxx
```

### 2. Start all services

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Health Check | http://localhost:8080/actuator/health |

### 3. Stop services

```bash
docker-compose down          # stop containers
docker-compose down -v       # stop + delete DB data
```

---

## 🌐 Deploy on Railway

Railway is the recommended way to deploy Nyaya to production. Each service (backend, frontend, database) is deployed separately.

### Step 1 — Create a Railway project

1. Go to [railway.app](https://railway.app) and create a new **Empty Project**
2. You'll add three services to it: PostgreSQL, backend, and frontend

### Step 2 — Add PostgreSQL

1. Click **+ New** → **Database** → **Add PostgreSQL**
2. Railway provisions the DB and exposes connection variables automatically

### Step 3 — Deploy the Backend

1. Click **+ New** → **GitHub Repo** → select `nyaya`
2. Set **Root Directory** to `backend`
3. Railway will detect the `Dockerfile` and build automatically
4. Go to **Variables** tab and add:

| Variable | Value |
|---|---|
| `CLAUDE_API_KEY` | Your Anthropic API key |
| `DB_HOST` | `${{Postgres.PGHOST}}` |
| `DB_PORT` | `${{Postgres.PGPORT}}` |
| `DB_NAME` | `${{Postgres.PGDATABASE}}` |
| `DB_USER` | `${{Postgres.PGUSER}}` |
| `DB_PASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `FRONTEND_URL` | `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}` |

### Step 4 — Deploy the Frontend

1. Click **+ New** → **GitHub Repo** → select `nyaya`
2. Set **Root Directory** to `frontend`
3. Go to **Variables** tab and add:

| Variable | Value |
|---|---|
| `BACKEND_URL` | `https://${{backend.RAILWAY_PUBLIC_DOMAIN}}` |

### Step 5 — Seed the Database

After the backend is running, open the Railway **Postgres** service → **Data** tab → run:

```sql
-- Paste contents of database/seed_data.sql here
```

Or connect via psql:
```bash
psql "$DATABASE_URL" -f database/seed_data.sql
```

---

## 🗄️ Database Setup (Manual / Local)

```bash
psql -U postgres
CREATE DATABASE nyaya_db;
CREATE USER nyaya_user WITH PASSWORD 'nyaya_pass';
GRANT ALL PRIVILEGES ON DATABASE nyaya_db TO nyaya_user;
\c nyaya_db
GRANT ALL ON SCHEMA public TO nyaya_user;
\q

psql -U nyaya_user -d nyaya_db -f database/schema.sql
psql -U nyaya_user -d nyaya_db -f database/seed_data.sql
```

---

## 📡 API Reference

### `POST /api/checklist/generate`
Generate a RERA compliance checklist.

```json
// Request
{ "state": "Maharashtra", "projectType": "Residential", "location": "Mumbai" }

// Response
{ "status": "success", "state": "Maharashtra", "checklist": "## 1. Project Registration\n..." }
```

### `POST /api/documents/review`
Upload a document for compliance review (`multipart/form-data`).

```
file: <PDF, Word, or Image — max 10MB>
state: Maharashtra
```

```json
// Response
{ "status": "success", "severity": "HIGH", "violations": [...], "recommendations": [...] }
```

### `POST /api/chat/ask`
Ask a RERA compliance question.

```json
// Request
{ "question": "What is the escrow account requirement?", "state": "Maharashtra" }

// Response
{ "status": "success", "answer": "..." }
```

---

## 📁 Project Structure

```
nyaya/
├── backend/                        # Spring Boot 3 + Java 17
│   ├── Dockerfile
│   ├── railway.toml
│   ├── pom.xml
│   └── src/main/java/com/nyaya/
│       ├── controller/             # REST endpoints
│       ├── service/                # Business logic + Claude API
│       ├── entity/                 # JPA entities
│       ├── repository/             # Spring Data repos
│       └── dto/                    # Request/Response models
│
├── frontend/                       # React 18 + Tailwind CSS
│   ├── Dockerfile
│   ├── railway.toml
│   ├── nginx.conf.template
│   ├── docker-entrypoint.sh
│   └── src/
│       ├── pages/LandingPage.jsx
│       ├── components/
│       │   ├── ChecklistForm.jsx
│       │   ├── DocumentUpload.jsx
│       │   └── ChatBot.jsx
│       └── api/client.js
│
├── database/
│   ├── schema.sql
│   └── seed_data.sql               # 15 Maharashtra RERA rules
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

### Backend

| Variable | Required | Description |
|---|---|---|
| `CLAUDE_API_KEY` | ✅ | Anthropic API key |
| `DB_HOST` | ✅ | PostgreSQL host |
| `DB_PORT` | ✅ | PostgreSQL port |
| `DB_NAME` | ✅ | Database name |
| `DB_USER` | ✅ | Database user |
| `DB_PASSWORD` | ✅ | Database password |
| `FRONTEND_URL` | — | CORS allowed origin (default: `http://localhost:3000`) |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | ✅ on Railway | Backend service URL for nginx proxy |

---

## ⚠️ Disclaimer

Nyaya is an AI-powered tool for informational purposes only. It is **not a substitute for professional legal advice**. Always consult a qualified RERA lawyer for compliance decisions.

---

## 📄 License

MIT © Shriyash Patil
