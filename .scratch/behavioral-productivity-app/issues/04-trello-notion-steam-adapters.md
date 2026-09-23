# 04: Adaptadores Trello/Notion & Steam API

**What to build:** Provider adapters for Trello/Notion (task lists) and Steam API (recent achievements and leisure milestones), enabling 1-click connection and automatic conversion into normalized ActionUnits.

**Blocked by:** 03: Ponte OAuth Serverless & Adaptador Google Agenda

**Status:** completed

## Acceptance Criteria

- [x] Trello / Notion provider adapter fetches pending tasks and maps them to `ActionUnit` records (`provider: 'trello' | 'notion'`).
- [x] Steam API provider adapter fetches recent game achievements and playtime milestones (`provider: 'steam'`, `type: 'leisure'`).
- [x] Write-back handler permits marking a Trello/Notion task complete in external API asynchronously.
- [x] Unit tests pass for all provider adapters verifying schema transformation and error resilience.
