<!-- README.md -->

# Nihil Databases 🚀

> **Service-per-Database monorepo** for the Nihil platform.  
> Each core domain (user, post, etc.) runs as an independent service with its own database, Prisma schema, and seed logic.

---

## 📐 Architecture Overview

- **Service-per-Database** – Each service (e.g., `user`, `post`) owns its own database and Prisma schema.
- **Monorepo Management** – Managed with [Nx](https://nx.dev/) and npm workspaces for scalable, maintainable development.
- **Shared Utilities** – Common types, enums, and utilities live in [`shared/`](./shared) and are imported by services.
- **Automated CI/CD** – GitHub Actions builds, migrates, and tests only changed services.
- **Development Workflow** – Unified scripts at the root for building, testing, and maintaining all services in one command.

---

## 📂 Project Structure

```
nihil_databases/
├── user/           # User service (Prisma schema, seed, tests)
├── post/           # Post service (Prisma schema, seed, tests)
├── shared/         # Shared utilities, types, enums
├── docs/           # Architecture docs & ERDs
├── .github/        # CI/CD workflows
├── package.json    # Root workspace config/scripts
├── nx.json         # Nx workspace config
└── ...
```

---

## ⚡ Quickstart

### 1. Clone & Install

```sh
git clone https://github.com/Ange230700/nihil_databases.git
cd nihil_databases
npm install
```

### 2. Set Up Local Databases

Requires **MySQL 8+** running locally.

```sh
mysql -u root -p -e "CREATE DATABASE nihil_user_dev;"
mysql -u root -p -e "CREATE DATABASE nihil_post_dev;"
```

### 3. Copy `.env` Files

```sh
npm run copy-envs
# Then edit user/.env and post/.env to match your DB credentials
```

### 4. Generate Prisma Clients & Run Migrations

```sh
npm run prisma:generate:all
npm run prisma:migrate:dev:all
```

### 5. Seed Databases

```sh
npm run prisma:db:seed --workspace=user
npm run prisma:db:seed --workspace=post
```

### 6. Open Prisma Studio

```sh
npm run prisma:studio:user
npm run prisma:studio:post
```

---

## 🗄 Cross-Service Data

- **No cross-database foreign keys** – IDs are stored as plain strings when referencing another service’s entities (e.g., `post.userId`).
- **Validation happens in the API layer**, not the database.
- This ensures services remain **loosely coupled** and deployable independently.

---

## 🛠 Common Commands

From the repo root:

| Command | Description |
| --- | --- |
| `npm run build:all` | Build all packages |
| `npm run lint:all` | Lint all packages |
| `npm run test:all` | Run all tests |
| `npm run clean:all` | Clean all build outputs & node_modules |
| `npm run prisma:generate:all` | Generate Prisma clients for all services |
| `npm run prisma:migrate:dev:all` | Apply dev migrations for all services |
| `npm run prisma:migrate:deploy:all` | Apply prod migrations for all services |
| `npm run prisma:db:seed:all` | Seed all services |

Per service (e.g., `user`):

```sh
npm run prisma:db:seed --workspace=user
npm run prisma:migrate:dev --workspace=user
```

---

## 🧪 Testing

- **Test runner:** [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/)
- Tests are colocated with source files.
- **Isolated seeds:** `user` seeds run inside a transaction and roll back for test isolation.

Run all tests:

```sh
npm run test:all
```

Run tests for one service:

```sh
npm run test --workspace=user
```

---

## 🤖 CI/CD

GitHub Actions runs on every push/PR to `main` and `develop`:

1. Spins up MySQL service.
2. Installs dependencies with caching for `node_modules` and Prisma artifacts.
3. Creates test databases.
4. Runs **affected** lint, build, migration, and test tasks only for changed services.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## 📜 ERDs

ERDs are in [`docs/`](./docs) and service-specific `docs/` folders.

Example: **User Service**
```
user ||--o| userprofile : "has"
```

Example: **Post Service**
```
post }|..|| user : "posted by"
post ||--|{ post : "shares"
```

---

## 🆘 Troubleshooting

- **Build/lint errors**  
  ```sh
  npm run clean:all && npm install && npm run build:all
  ```

- **Database errors**  
  Check MySQL is running and `.env` DB URLs are correct.

- **Schema changes not reflected**  
  ```sh
  npm run prisma:migrate:dev:all
  ```

- **Need to wipe data**  
  Use cleanup scripts in each service’s `prisma/helpers`.

<!-- ---

## 📄 License

ISC © Ange KOUAKOU -->

---

## Submodules

This repository uses **Git submodules** for the `user`, `post`, and `shared` packages.

### Cloning with submodules
```bash
git clone git@github.com:Ange230700/nihil_databases.git
cd nihil_databases
git submodule update --init --recursive
```

### Pulling updates for main repo and submodules
```bash
git pull --recurse-submodules
git submodule update --recursive --remote
```

### Adding or updating a submodule
```bash
git submodule add <repo-url> <path>
git submodule update --init --recursive
```

> **Tip:** Each submodule has its own Git history and may have its own CI/CD pipeline.

### Nx + Submodules
When using Nx, note that `nx affected` will see a submodule change as a single SHA update, not per-file changes. This means **any change in a submodule counts the whole package as affected**. For precise builds/tests, run Nx commands inside each submodule’s repo. For integration checks, use `--all` targets from the root.
