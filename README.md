<!-- README.md -->

# Nihil Databases Monorepo

<!-- ![Nihil Logo](link-to-logo.png) -->

The **Nihil Databases Monorepo** is the foundation of the [Nihil platform](https://github.com/Ange230700/nihil_databases).  
It manages **service-specific database packages** (User, Post) with isolated schemas, seeding logic, Prisma clients, and shared utilities.

Each service is implemented as a **versioned npm package** (`nihildbuser`, `nihildbpost`, `nihildbshared`) that can be published independently and consumed by other Nihil services.

---

## Table of Contents
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Workspace Commands](#workspace-commands)
- [Services](#services)
  - [User Database](#user-database)
  - [Post Database](#post-database)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Architecture

This repo is managed with **Nx** and structured as a **multi-package monorepo**:

```

.
├── user/       # User Database Service (nihildbuser)
├── post/       # Post Database Service (nihildbpost)
├── shared/     # Shared utils (nihildbshared)
├── docs/       # ERDs, design notes
├── docker-compose.dev.yml
├── package.json
├── nx.json
└── .github/workflows/ci.yml

````

* Each service has its **own database**, Prisma schema, migrations, and seeding logic.  
* The `shared` package provides **reusable helpers** (e.g. `deleteSafely`, `runSeed`).  
* CI/CD runs tests and migrations in isolated MySQL containers.  
* Submodules allow each service to evolve independently while staying in sync.

---

## Tech Stack

- **Language**: TypeScript (ESM, strict mode)  
- **ORM**: [Prisma](https://www.prisma.io/)  
- **Databases**: MySQL 8.x (separate per service)  
- **Tooling**: Nx, Husky, Commitlint, Lint-staged, Prettier  
- **Security**: [argon2](https://www.npmjs.com/package/argon2) for password hashing  
- **Testing**: Jest + ts-jest + isolated DB resets  
- **Containerization**: Docker + docker-compose  
- **CI/CD**: GitHub Actions with MySQL caching for fast test runs  

---

## Getting Started

### Prerequisites
- Node.js (>= 20.x)  
- MySQL (>= 8.x) or Docker  
- NPM (>= 11.x)

### Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Ange230700/nihil_databases.git
cd nihil_databases
npm install
npm run copy-envs
````

This creates `.env` files for both `user` and `post` services from their `.env.sample`.

### Start Dev Databases

```bash
npm run db:up
```

This spins up two MySQL containers (`mysql-user`, `mysql-post`) via `docker-compose.dev.yml`.

---

## Workspace Commands

Global scripts in `package.json` let you manage all services:

| Command                        | Description                                |
| ------------------------------ | ------------------------------------------ |
| `npm run build:all`            | Build all packages                         |
| `npm run test:all`             | Run all tests                              |
| `npm run lint:all`             | Run eslint across all workspaces           |
| `npm run clean:all`            | Remove build + cache artifacts             |
| `npm run publish:all:packages` | Publish all packages to npm                |
| `npm run prisma:generate:all`  | Regenerate Prisma clients for all services |
| `npm run prisma:db:push:all`   | Apply schemas for User + Post DBs          |
| `npm run prisma:db:seed:all`   | Seed both services                         |
| `npm run test:all:with-db`     | Bring up DB containers, run all tests      |

---

## Services

### User Database

Package: [`nihildbuser`](./user)
Schema manages **users** and their **profiles** (1:1 relationship).

ERD:

```mermaid
erDiagram
    user {
        UUID id PK
        STRING username
        STRING email
        STRING password_hash
        STRING display_name
        STRING avatar_url
        DATETIME created_at
        DATETIME updated_at
    }
    userprofile {
        UUID id PK
        UUID user_id FK
        STRING bio
        STRING location
        DATE birthdate
        STRING website
        DATETIME updated_at
    }
    user ||--o| userprofile : "has"
```

---

### Post Database

Package: [`nihildbpost`](./post)
Schema manages **posts** with self-references for shares/retweets.

ERD:

```mermaid
erDiagram
    post {
        UUID id PK
        UUID user_id FK
        TEXT content
        STRING media_url
        DATETIME created_at
        DATETIME updated_at
        BOOLEAN is_deleted
        UUID original_post_id FK "for shares/retweets"
    }
    post }|..|| user : "posted by"
    post ||--|{ post : "shares"
```

---

## Testing

Run all tests (with fresh DBs):

```bash
npm run test:all:with-db
```

Highlights:

* Jest with Prisma transaction rollbacks for isolation
* Seeds run before tests, data is rolled back after
* CI uses GitHub Actions with MySQL cache for speed

---

## Deployment

### Docker (per service)

Each service includes a Dockerfile (multi-stage build). Example:

```bash
docker build -t nihil-user-db ./user
docker run --env-file user/.env nihil-user-db
```

The container auto-applies schema and seeds data at startup.

### CI/CD

* GitHub Actions workflow: `.github/workflows/ci.yml`
* Runs lint, build, push schema, and test jobs for **affected services only**
* Caches MySQL datadir between runs for faster migrations

---

## Environment Variables

Each service has its own `.env.sample`.

### User

```env
USER_DATABASE_URL="mysql://root:root@localhost:3309/nihil_user_dev"
NODE_ENV=dev
```

### Post

```env
POST_DATABASE_URL="mysql://root:root@localhost:3310/nihil_post_dev"
NODE_ENV=dev
```

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a branch (`git checkout -b feat/my-feature`)
3. Commit (`git commit -m "✨ add my feature"`)
4. Push (`git push origin feat/my-feature`)
5. Create a Pull Request

Pre-push hooks ensure submodules are in sync and tests pass.

---

## License

MIT License

---

## Contact

**Ange KOUAKOU**
[GitHub](https://github.com/Ange230700) • [Email](mailto:kouakouangeericstephane@gmail.com)
