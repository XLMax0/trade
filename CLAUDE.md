# CLAUDE.md — AI Assistant Guide for `trade`

This file provides essential context for AI assistants (Claude, Copilot, etc.) working in this repository. Read it before making changes.

---

## Repository Overview

**Name:** trade
**Status:** New repository — no source code committed yet.
**Purpose:** *(To be defined — update this section once the project scope is established.)*

This repository was initialized without any initial source files. All conventions documented here represent sensible defaults to establish from the start. Update this file as the codebase grows.

---

## Repository Structure

*(Empty — populate this section once directories are created.)*

A recommended structure for a typical TypeScript/Node.js trading application:

```
trade/
├── CLAUDE.md              # This file
├── README.md              # Human-facing project documentation
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env.example           # Template for environment variables (never commit .env)
├── .gitignore             # Files excluded from version control
├── src/
│   ├── index.ts           # Application entry point
│   ├── config/            # Configuration loading and validation
│   ├── models/            # Data models and types
│   ├── services/          # Business logic and external integrations
│   ├── routes/            # HTTP route handlers (if applicable)
│   └── utils/             # Shared utility functions
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
└── scripts/               # Developer utility scripts
```

---

## Tech Stack

*(Unknown — update once dependencies are established.)*

Common choices for a trading application:

| Layer | Candidate |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express / Fastify |
| Database | PostgreSQL (via Prisma or Drizzle) |
| Message queue | Redis / Kafka |
| Testing | Vitest / Jest |
| Linting | ESLint + Prettier |

---

## Development Workflow

### First-time setup

```bash
# Clone and install dependencies (once package.json exists)
npm install        # or: pnpm install / yarn install

# Copy environment template and fill in values
cp .env.example .env
```

### Common commands

*(Update with real commands once package.json scripts are defined.)*

```bash
npm run dev        # Start development server with hot-reload
npm run build      # Compile TypeScript to JavaScript
npm run test       # Run test suite
npm run lint       # Lint source files
npm run typecheck  # Run TypeScript type checker without emitting files
```

### Branch strategy

- `main` — stable, production-ready code; direct pushes are blocked.
- `dev` — integration branch for completed features.
- Feature branches — name as `feat/<short-description>`.
- Fix branches — name as `fix/<issue-id>-<short-description>`.
- AI-generated branches — name as `claude/<session-id>` (auto-created by Claude Code sessions).

### Commit message format

Use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body]

[optional footer: references, breaking changes]
```

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`.

Examples:
```
feat(orders): add limit order placement endpoint
fix(auth): handle expired JWT tokens gracefully
docs: update CLAUDE.md with real project structure
```

---

## Key Conventions

### TypeScript

- Strict mode is enabled (`"strict": true` in tsconfig).
- Prefer `interface` for object shapes that may be extended; use `type` for unions, intersections, and aliases.
- Avoid `any` — use `unknown` when the type is truly dynamic.
- Export types explicitly alongside the code that uses them.
- Use `readonly` for data that should not be mutated after construction.

### Naming

| Entity | Convention | Example |
|---|---|---|
| Files | kebab-case | `order-service.ts` |
| Classes | PascalCase | `OrderService` |
| Functions / variables | camelCase | `placeOrder` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ORDER_SIZE` |
| Types / interfaces | PascalCase | `OrderRequest` |

### Error handling

- Never swallow errors silently (`catch (e) {}`).
- Use typed error classes derived from a common base (e.g., `AppError`).
- Propagate errors to the appropriate boundary; only log at the top level.
- Always handle promise rejections — no floating promises.

### Environment variables

- Never hard-code secrets or environment-specific values.
- All required variables must have entries in `.env.example` with descriptive comments.
- Validate and parse env vars at startup using a schema library (e.g., `zod`).
- Fail fast with a clear message if required vars are missing.

### Testing

- Unit tests live beside source files or under `tests/unit/`.
- Test filenames mirror source filenames: `order-service.ts` → `order-service.test.ts`.
- Aim for tests that assert behaviour, not implementation.
- Mock external I/O (databases, HTTP calls, exchanges) in unit tests; use real dependencies in integration tests.
- Tests must pass before any PR is merged.

---

## Security Considerations

This is a trading application. Security is critical:

1. **Never log sensitive data** — API keys, private keys, account credentials, or raw order details with PII must not appear in logs.
2. **Validate all external input** — exchange webhooks, user input, and API responses must be parsed and validated before use.
3. **Rate limit outbound requests** — avoid exchange bans by respecting API rate limits.
4. **Use environment variables for credentials** — no secrets in source code or git history.
5. **Audit dependencies regularly** — run `npm audit` and keep dependencies updated.
6. **Least privilege** — API keys should only have the permissions required for the application's function.

---

## AI Assistant Instructions

When working in this repository, Claude (or any AI assistant) should:

1. **Read this file first** before proposing changes.
2. **Follow the branch strategy** — develop on the branch specified in the task; never push directly to `main`.
3. **Match existing conventions** — coding style, naming, file organization.
4. **Prefer editing existing files** over creating new ones unless a new file is clearly required.
5. **Write tests** for non-trivial logic changes.
6. **Keep changes focused** — do not refactor, add comments, or improve unrelated code in the same PR.
7. **Update this file** when significant new modules, workflows, or conventions are introduced.
8. **Never commit** `.env`, secrets, private keys, or generated build artifacts.
9. **Ask before** making architectural decisions that affect many files — propose a plan and confirm before implementing.

---

## Updating This File

This file should be updated whenever:

- A new top-level module or service is added.
- The build/test/lint commands change.
- A new external dependency or integration is introduced.
- A team convention is formally agreed upon.

Keep it accurate — a stale CLAUDE.md is worse than none.
