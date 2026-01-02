Repl

Repl is a web-based playground platform that provides isolated workspaces with automatic folder and file generation.
The application focuses on structured playground creation, backend-driven file system operations, and a scalable full-stack architecture.

Tech Stack

Next.js

TypeScript

Tailwind CSS

Node.js

Express.js

Prisma

Zod

PostgreSQL

Docker

Kubernetes

GitHub Actions

Argo CD

TurboRepo

Core Functionality

Automatic playground creation

Predefined folder and file generation

Backend-managed file system operations

Modular monorepo architecture

Shared packages for schemas and utilities

Folder Structure
apps/
 ├── web/
 │   ├── src/
 │   │   ├── app/            # Next.js app router
 │   │   ├── components/     # UI components
 │   │   ├── lib/            # Helpers and utilities
 │   │   └── styles/         # Global styles
 │   └── public/
 │
 ├── backend/
 │   ├── src/
 │   │   ├── controllers/    # API controllers
 │   │   ├── routes/         # API routes
 │   │   ├── services/       # Business logic
 │   │   ├── prisma/         # Prisma client & schema
 │   │   └── index.ts        # Server entry point
 │   └── prisma/
 │
packages/
 ├── zod/                    # Shared validation schemas
 └── utilities/              # Shared helper functions

Environment Variables

Environment variables are required in two locations.

Web (apps/web)

Create a file named:

.env


Add frontend-specific environment variables.
Do not commit actual values.

Backend (apps/backend)

Create a file named:

.env


This typically includes:

Database connection URL

Backend configuration values

⚠️ .env files should never be committed.

Running Locally
1️⃣ Clone the repository
git clone <repository-url>
cd <project-root>

2️⃣ Install dependencies
pnpm install

3️⃣ Start PostgreSQL using Docker

Ensure Docker is installed and running.

docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=repl \
  -p 5432:5432 \
  postgres:16-alpine


Update the backend .env file with the correct database connection string.

4️⃣ Run the Backend
cd apps/backend
pnpm run dev

5️⃣ Run the Web Application
cd apps/web
pnpm run dev

6️⃣ Open in Browser
http://localhost:3000

Application Manifests

All deployment and infrastructure-related manifests are maintained separately.

Repository:
https://github.com/anshulvyasa/git-ops

This repository includes:

Kubernetes manifests

GitHub Actions workflows

Argo CD application configurations

Notes

Frontend and backend run as separate services

PostgreSQL runs independently via Docker

Shared packages ensure consistency across services

Environment variables must remain local