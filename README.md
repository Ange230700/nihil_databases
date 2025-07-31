<!-- README.md -->

Welcome aboard 🚀

---

## High-Level Architecture

- **Service-per-Database**: Each core domain (user, post, etc.) runs as its own service, each with its own database and isolated Prisma schema.
- **Monorepo Management**: Powered by Nx and npm workspaces for scalable, maintainable development.
- **Shared Utilities**: Types, enums, and utilities are centralized in the `shared` package for consistency across services.
- **Automated CI/CD**: GitHub Actions runs builds, migrations, and tests for only changed services to keep feedback fast.
- **Development Workflow**: Common scripts exist at the root for building, testing, and maintaining all services in one command.

See [docs/ONBOARDING.md](./docs/ONBOARDING.md) for full onboarding and architecture details.
