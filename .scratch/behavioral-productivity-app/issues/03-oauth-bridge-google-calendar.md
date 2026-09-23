# 03: Ponte OAuth Serverless & Adaptador Google Agenda

**What to build:** A 1-click OAuth bridge service and Google Calendar adapter that authenticates the user, fetches upcoming calendar events, and converts raw JSON payloads into normalized ActionUnits stored in local SQLite.

**Blocked by:** 01: Setup do Repositório SQLite Local-First & Modelo ActionUnit

**Status:** completed

## Acceptance Criteria

- [x] OAuth Bridge endpoint handles Google OAuth 2.0 handshake and stores tokens securely on mobile device via Expo SecureStore.
- [x] Google Calendar adapter fetches user events and normalizes them into ActionUnit schema (`provider: 'google_calendar'`).
- [x] Synchronization loop executes in background and updates local SQLite idempotently without creating duplicate records.
- [x] Unit tests pass using HTTP mocks verifying payload normalization and token refresh handling.
