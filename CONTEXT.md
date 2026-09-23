# Domain Context: Behavioral UX Universal Productivity App

This document defines the core domain concepts, vocabulary, architecture principles, and integration models for the Behavioral UX Universal Productivity App.

## 1. Domain Glossaries & Core Concepts

- **Action Unit (`ActionUnit`)**: The unified internal representation of any item fetched from external APIs (Google Calendar, Trello, Notion, Steam). Every item is normalized into a standard structure containing `id`, `provider`, `title`, `type` (`task` | `event` | `streak` | `metric`), `due_time`, and a `micro_action` handler.
- **Hybrid Provider Card**: Visual UI card that presents an `ActionUnit` with the distinct brand identity and visual cues of its source platform (e.g. Steam game art, Google Agenda calendar badge, Trello board tag) while maintaining a standardized 1-click completion gesture (swipe or tap).
- **Daily Feed**: The main, single-column focal view of the mobile application. Displays a curated, low-friction list of the user's top priorities for the current day to eliminate cognitive overload.
- **Mascote Companion**: Gamified pro-active AI assistant embedded at the top of the Daily Feed. Provides empathetic focus guidance, tracks daily activity streaks, award XP points, and levels up as the user completes micro-actions.
- **Streak & Micro-Rewards**: Behavioral gamification system inspired by Duolingo. Completing daily micro-actions maintains the user's daily streak count and triggers instant haptic/visual feedback.
- **OAuth Bridge Serverless**: Lightweight cloud proxy service (Cloudflare Workers / Supabase) that orchestrates 1-click OAuth authentication with external providers without exposing client secrets or requiring user API keys.
- **Local-First Database**: Embedded SQLite database on the mobile device (via Drizzle ORM / WatermelonDB) providing instant app launch, offline read/write capabilities, and asynchronous background syncing.

## 2. System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 React Native (Expo App)                 │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │    Daily Feed    │  │  Mascote Companion Engine   │  │
│  │ (Hybrid Cards)   │  │    (XP / Streak System)    │  │
│  └────────┬─────────┘  └──────────────┬──────────────┘  │
│           │                           │                 │
│  ┌────────┴───────────────────────────┴──────────────┐  │
│  │             SQLite Local Database                 │  │
│  │           (Local-First Persistence)               │  │
│  └────────────────────────┬──────────────────────────┘  │
└───────────────────────────┼─────────────────────────────┘
                            │ Background Async Sync
┌───────────────────────────▼─────────────────────────────┐
│               OAuth Bridge Serverless Layer             │
│            (Cloudflare Workers / Supabase)              │
└─────┬──────────────────┬──────────────────┬─────────────┘
      │ OAuth            │ OAuth            │ OAuth
┌─────▼──────┐    ┌──────▼─────┐    ┌───────▼─────┐
│ Google Cal │    │ Trello/Not │    │  Steam API  │
└────────────┘    └────────────┘    └─────────────┘
```

## 3. Supported MVP Connectors (v1.0)

1. **Google Calendar**: Synchronizes upcoming meetings, events, and time-block reminders.
2. **Trello / Notion**: Synchronizes pending tasks, board items, and project checklists.
3. **Steam API**: Synchronizes gaming achievements, playtime statistics, and leisure rewards.
