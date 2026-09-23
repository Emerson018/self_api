# 01: Setup do Repositório SQLite Local-First & Modelo ActionUnit

**What to build:** An embedded local-first SQLite database layer on mobile that persists, queries, and updates ActionUnits (tasks, events, leisure items) with zero-latency read/write access.

**Blocked by:** None (can start immediately)

**Status:** completed

## Acceptance Criteria

- [x] SQLite database initialized with schema migrations for the `action_units` table (`id`, `provider`, `external_id`, `title`, `subtitle`, `type`, `due_time`, `status`, `created_at`, `updated_at`).
- [x] ActionUnitRepository exposes CRUD methods: `insertActionUnit`, `getActionUnitsByDate`, `updateActionUnitStatus`, `deleteActionUnit`.
- [x] Unit tests pass using an in-memory SQLite instance verifying instant writes and reactive query updates.
