 <!-- docs/ONBOARDING.md -->

# Nihil Databases – Onboarding Guide

Welcome to the Nihil Databases repository! This guide will get you up and running, and provide an overview of our architecture and daily workflows.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Database Management](#database-management)
5. [Scripts & Workflows](#scripts--workflows)
6. [Testing](#testing)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [FAQ / Troubleshooting](#faq--troubleshooting)

---

## Architecture Overview

- **Microservices**: Each major feature (user, post, etc.) is isolated in its own package with its own database.
- **Monorepo**: Managed using [Nx](https://nx.dev/) workspaces and npm workspaces.
- **Database per Service**: Each service (e.g., user, post) manages its own database and Prisma schema.
- **Shared Code**: Common utilities, types, and enums live in the `shared` package.

---

## Project Structure

```
nihil\_databases/
├── user/           # User service (database, Prisma, seed, tests)
├── post/           # Post service (database, Prisma, seed, tests)
├── shared/         # Shared utilities, enums, types
├── docs/           # Architecture, ERDs, onboarding
├── .github/        # GitHub Actions workflows
├── package.json    # Root workspace config/scripts
├── nx.json         # Nx workspace config
└── ...
```

---

## Development Setup

1. **Clone the repo**

```sh
git clone https://github.com/Ange230700/nihil_databases.git
cd nihil_databases
```

2. **Install dependencies**

```sh
npm install
```

3. **Set up local databases**

   * You’ll need local MySQL instances for each service.
   * See `.env.sample` in each service for DB connection details.
   * Example (using default credentials):

```sh
mysql -u root -p -e "CREATE DATABASE nihil_user_dev;"
mysql -u root -p -e "CREATE DATABASE nihil_post_dev;"
```

4. **Copy `.env` files**

```sh
npm run copy-envs
# or manually: cp user/.env.sample user/.env; cp post/.env.sample post/.env
```

   * Update DB URLs if needed in each `.env` file.

5. **Generate Prisma clients & run migrations**

```sh
npm run build:all
npm run prisma:migrate:dev:all
```

---

## Database Management

* **Schema**: Defined in `prisma/schema.prisma` per service.
* **Client**: Generated with `prisma generate`.
* **Seeding**: Each service has a seed script (`prisma/seed.ts`).
  Run with:

```sh
npm run prisma:db:seed --workspace=user
npm run prisma:db:seed --workspace=post
```

---

> **Note on naming conventions**  
> Entity Relationship Diagrams (ERDs) in our docs use `snake_case` for clarity and visual consistency (e.g., `user_id`, `created_at`).  
> The actual database and Prisma schema definitions use `camelCase` (e.g., `userId`, `createdAt`).  
> **The Prisma schema is always the source of truth** — use it when working with code or writing queries.


---

## Scripts & Workflows

All scripts are available via root `package.json`. Some useful ones:

* **Build all**: `npm run build:all`
* **Lint all**: `npm run lint:all`
* **Test all**: `npm run test:all`
* **Clean all**: `npm run clean:all`
* **Generate all Prisma clients**: `npm run prisma:generate:all`

---

## Testing

* Uses [Jest](https://jestjs.io/) and [ts-jest](https://kulshekhar.github.io/ts-jest/).
* Tests live alongside code in each service.
* `npm run test:all` runs tests for all packages.

---

## CI/CD Pipeline

* **GitHub Actions**: Automated on every PR and push to `main`/`develop`.
* **Services**:

  * Sets up MySQL.
  * Runs builds, migrations, and tests on affected packages only.
  * Caches `node_modules` and Prisma artifacts for faster builds.
* See `.github/workflows/ci.yml` for details.

---

## FAQ & Troubleshooting

* **Build or lint errors?**
  Try `npm run clean:all && npm install && npm run build:all`.
* **Database errors?**
  Ensure your `.env` files are set and MySQL is running.
* **Test failures after schema changes?**
  Rerun migrations and regenerate Prisma clients.
* **Need to reset all DBs?**
  Each service has cleanup helpers. You can also drop DBs manually.
