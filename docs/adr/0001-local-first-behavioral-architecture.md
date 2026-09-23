# ADR 0001: Local-First Behavioral UX Architecture

- **Status**: Approved
- **Date**: 2026-09-23
- **Deciders**: Engineering Team & User

## Context & Problem Statement

Users face high friction and cognitive fatigue when managing tasks across multiple productivity tools (Google Calendar, Trello, Notion, Steam). Existing aggregators suffer from bloated dashboards, complex API setup requirements, and sluggish network-dependent load times.

We need an architecture that delivers a zero-friction, 1-click user experience with instant mobile responsiveness, offline access, and a habit-forming behavioral UX inspired by Duolingo and Nubank.

## Decision Drivers

- **Zero-Friction Onboarding**: Users must connect services with 1-click OAuth without entering API keys.
- **Cognitive Load Reduction**: Interface must focus on a single Daily Feed with micro-actions rather than dense dashboards.
- **Instant Responsiveness**: App must load instantly and operate offline without blocking spinners.
- **Engagement & Retention**: Gamification (Mascot, Streaks, Micro-rewards) to sustain long-term usage.

## Considered Options

1. **Option 1**: Web App (PWA) with server-side proxy rendering.
2. **Option 2**: Mobile-First (React Native/Expo) + SQLite Local-First + OAuth Bridge Serverless + Gamified Companion.
3. **Option 3**: Traditional Backend Monolith with polling workers.

## Decision Outcome

Chosen **Option 2**: Mobile-First (React Native/Expo) with a Local-First SQLite Database and OAuth Bridge Serverless.

### Architectural Blueprint:

- **Mobile Client**: React Native with Expo Router, NativeWind, and SQLite (Drizzle ORM / WatermelonDB) for local-first data storage.
- **OAuth Bridge**: Cloudflare Workers / Supabase Serverless layer to handle OAuth handshakes securely.
- **Behavioral UX**: Daily Feed displaying Hybrid Provider Cards + Gamified Mascote Companion with XP/Streak progression.
- **MVP Connectors**: Google Calendar, Notion/Trello, Steam API.

## Positive Consequences

- **Instant Performance**: Reading and completing tasks occurs in local SQLite with 0ms UI latency.
- **Offline First**: Full functionality without active internet connection.
- **High Engagement**: Duolingo-style streak mechanics and companion guidance drive daily habit formation.
- **Low Setup Friction**: Standard OAuth browser flow handles all service connections.

## Negative Consequences & Mitigation

- **Sync Complexity**: Conflict handling between local SQLite and remote APIs.
  - _Mitigation_: Optimistic local updates with background queue processing and idempotent write-backs.
