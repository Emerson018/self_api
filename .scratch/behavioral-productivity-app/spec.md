# Spec: App de Produtividade Comportamental de 1-Clique

Status: ready-for-agent

## Problem Statement

Users face high cognitive fatigue and friction when attempting to manage their daily routine across fragmented platforms (Google Calendar, Trello/Notion, Steam). Traditional productivity tools require manual API key configurations, present overwhelming multi-column dashboards, and lack engaging behavioral mechanics that motivate daily habit formation.

## Solution

A mobile-first productivity application with a Behavioral UX (inspired by Duolingo and Nubank). It unifies personal productivity and leisure APIs into a single-column Daily Feed using 1-click OAuth connectors. A proactive gamified Mascot companion guides the user, tracks daily Streaks, awards XP micro-rewards, and reduces cognitive load by presenting the single next best action.

## User Stories

1. As a busy user, I want to connect my Google Calendar account with 1-click OAuth, so that my upcoming events appear automatically in my Daily Feed without manual configuration.
2. As a user tracking tasks, I want to connect my Trello or Notion account via 1-click OAuth, so that my pending tasks are imported as actionable items.
3. As a gamer, I want to connect my Steam account, so that my game achievements and leisure milestones are recognized as rewards in my daily routine.
4. As a mobile user, I want to view a single-column Daily Feed on app launch, so that I am not overwhelmed by dense multi-board dashboards.
5. As a user completing a task, I want to perform a 1-click swipe or tap gesture, so that the item is instantly marked complete without opening multi-step dialogs.
6. As a user maintaining daily habits, I want an active Streak counter displayed at the top of the screen, so that I am motivated to return every day.
7. As a user finishing my daily priorities, I want the Mascot companion to celebrate my progress with haptic feedback and XP micro-rewards, so that I feel immediate positive reinforcement.
8. As an offline user, I want full read and write access to my cached Daily Feed items, so that network dropouts do not interrupt my productivity.
9. As a user viewing different providers, I want each item card to display recognizable brand cues (Google, Trello, Steam) while adhering to a uniform action gesture, so that I easily distinguish data sources.
10. As a user managing my day, I want the Mascot companion to pro-actively suggest the next highest-priority action, so that I don't waste time deciding what to work on next.
11. As a user who missed a day, I want a streak freeze / grace period mechanism, so that I don't feel demotivated and abandon the app after a single missed day.
12. As a user configuring services, I want to disconnect or reconnect any provider with a single toggle in settings, so that I retain full control over my data integrations.

## Implementation Decisions

- **Architecture Strategy**: Mobile-First client built with React Native (Expo Router, TypeScript) and a Serverless OAuth Bridge (Cloudflare Workers / Supabase) for zero-friction provider authentication.
- **Local-First Data Model**: Embedded SQLite database (via Drizzle ORM / WatermelonDB) acting as the single source of truth for all client reads and writes.
- **Unified Action Unit Schema (`ActionUnit`)**:
  - `id`: string (UUID)
  - `provider`: `'google_calendar' | 'trello' | 'notion' | 'steam'`
  - `external_id`: string
  - `title`: string
  - `subtitle`: string | null
  - `type`: `'task' | 'event' | 'streak' | 'leisure'`
  - `due_time`: ISO string | null
  - `status`: `'pending' | 'completed' | 'dismissed'`
  - `created_at`: ISO string
  - `updated_at`: ISO string
- **Mascot & Gamification Engine (`MascotEngine`)**:
  - State machine handling Mascot emotions: `'idle' | 'happy' | 'cheering' | 'thinking' | 'sleepy'`.
  - Leveling formula: `XP_for_level(L) = L * 100`. Completing an `ActionUnit` awards +15 XP.
  - Streak tracking: Daily evaluation at local midnight. Streak increments if >= 1 ActionUnit completed during the 24h window.
- **Hybrid Provider Card Rendering**:
  - Reusable card component wrapping provider-specific styling (badges, brand colors, icon sets).
  - Common gesture wrapper using `react-native-reanimated` and `react-native-gesture-handler` for swipe-to-complete.

## Testing Decisions

- **Testing Philosophy**: Tests must exercise external module boundaries and public interfaces rather than private internal implementation details.
- **Testing Seam 1: Local SQLite & ActionUnit Repository (`ActionUnitRepository`)**
  - Verify CRUD operations, status updates, filtering by status/date, and offline transaction rollback using an in-memory SQLite database (`better-sqlite3` / mock SQLite).
- **Testing Seam 2: Serverless OAuth Bridge & Provider Adapters (`ProviderAdapter`)**
  - Verify payload translation from raw provider JSON responses to valid `ActionUnit` schemas, handling authorization errors, token expiration, and missing fields.
- **Testing Seam 3: Mascot State Engine & Gamification (`MascotEngine`)**
  - Verify XP accumulation, level-up state triggers, Streak increment/reset calculations, and Mascot dialogue generation.
- **Testing Seam 4: Daily Feed UI Integration (`DailyFeedScreen`)**
  - React Native Testing Library tests verifying list rendering, swipe-to-complete gesture dispatches, and empty state Mascot messaging.

## Out of Scope

- Desktop or Web PWA builds (v1.0 is strictly Mobile-First iOS/Android).
- Custom user-created OAuth API key input (all connections use the managed Serverless OAuth Bridge).
- Complex multi-user team collaboration or shared boards in v1.0.
- Paid subscription billing / paywalls (v1.0 is completely open for initial users).

## Further Notes

- Seed templates and initial assets for the Mascot companion will use vector SVG illustrations with Lottie animation support.
- All provider tokens stored locally on the device must be encrypted using `Expo SecureStore`.
