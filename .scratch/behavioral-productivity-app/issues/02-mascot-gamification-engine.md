# 02: Motor de Mascote, Gamificação e Streaks

**What to build:** A state machine and gamification engine that calculates user XP, level-up milestones, daily activity Streaks, and controls the emotional expressions/dialogues of the Mascot companion upon action completions.

**Blocked by:** 01: Setup do Repositório SQLite Local-First & Modelo ActionUnit

**Status:** completed

## Acceptance Criteria

- [x] `MascotEngine` state machine implemented with emotional states (`idle`, `happy`, `cheering`, `thinking`, `sleepy`).
- [x] Completing an ActionUnit adds +15 XP; leveling up occurs when total XP reaches `level * 100`.
- [x] Daily Streak counter increments when at least 1 ActionUnit is completed within the 24h local window.
- [x] Mascot state and user XP/Streak progress persist in SQLite database.
- [x] Unit tests pass verifying XP accumulation, level-up triggers, and streak increment calculations.
