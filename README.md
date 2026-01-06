# Repl

Repl is a web-based playground platform that provides isolated workspaces with automatic folder and file generation.  
The application focuses on structured playground creation, backend-driven file system operations, and a scalable full-stack architecture.

## Tech Stack

- Next.js  
- TypeScript  
- Tailwind CSS  
- Node.js  
- Express.js  
- Prisma  
- Zod  
- PostgreSQL  
- Docker  
- Kubernetes  
- GitHub Actions  
- Argo CD  
- TurboRepo  

## Core Functionality

- Automatic playground creation  
- Predefined folder and file generation  
- Backend-managed file system operations  
- Modular monorepo architecture  
- Shared packages for schemas and utilities  

## Folder Structure

```text
Repl/
├── apps/
│   ├── web/
│   │   ├── app/                # Next.js App Router
│   │   ├── axiosinstance/      # Axios configuration
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Frontend helpers
│   │   ├── providers/          # Context providers
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript types
│   │   ├── public/             # Static assets
│   │   ├── auth.ts
│   │   ├── middleware.ts
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   └── v1/          # API v1
│   │   │   │       ├── controllers/
│   │   │   │       ├── routes/
│   │   │   │       ├── middleware/
│   │   │   │       └── lib/
│   │   │   ├── types/
│   │   │   └── index.ts         # Server entry point
│   │   ├── dist/
│   │   └── output/
│
├── packages/
│   ├── db/
│   ├── utilities/
│   └── zod/
│
├── docker-files/
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
``` 
 
 ## Environment Variables

Environment variables are required in **three locations**.

### Web (`apps/web`)

Create a file named `.env` inside `apps/web`.

- Add frontend-specific environment variables
- Do not commit actual values

---

### Backend (`apps/backend`)

Create a file named `.env` inside `apps/backend`.

This typically includes:

- Backend configuration values
- API-related environment variables

---

### Database Package (`packages/db`)

Create a file named `.env` inside `packages/db`.

This typically includes:

- Database connection URL (`DATABASE_URL`)
- Prisma-related configuration

⚠️ `.env` files should never be committed.

## Running Locally
### 1. Clone the repository
``` bash
git clone <repository-url>
cd <project-root>
```

### 2.Install dependencies
```bash
pnpm install
```

### 3.Start PostgreSQL using Docker
Ensure Docker is installed and running.
```bash
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin \
  -e POSTGRES_DB=repl \
  -p 5432:5432 \
  postgres:16-alpine
```
##### Update the backend .env file with the correct database connection string e.g., 
```bash
DATABASE_URL=postgresql://postgres:admin@localhost:5432/repl).
```


### 4. Run the Backend
```bash
cd apps/backend
pnpm run dev
```

### 5. Run the Web Application
```bash
cd apps/web
pnpm run dev
```

### 6.Open in Browser
```bash
http://localhost:3000
```

## Application Manifests
All deployment and infrastructure-related manifests are maintained separately.
Repository:
``` bash
 https://github.com/anshulvyasa/git-ops
```
This repository includes:

Kubernetes manifests
GitHub Actions workflows
Argo CD application configurations

## Notes

- Frontend and backend run as separate services
- PostgreSQL runs independently via Docker
- Shared packages ensure consistency across services
- Environment variables must remain local




