import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import { MascotEngine, MascotState } from "../src/mascot-engine.js";

describe("MascotEngine & Gamification (Ticket 02)", () => {
  let dbService: DatabaseService;
  let mascotEngine: MascotEngine;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    mascotEngine = new MascotEngine(dbService);
  });

  it("should initialize with default level 1, 0 XP, 0 Streak, and idle emotion", () => {
    const state: MascotState = mascotEngine.getState();
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.emotion).toBe("idle");
  });

  it("should add +15 XP on completed action and level up when reaching level * 100 XP", () => {
    // Add 95 XP (level 1 requires 100 XP)
    let state = mascotEngine.addXp(95);
    expect(state.level).toBe(1);
    expect(state.xp).toBe(95);
    expect(state.emotion).toBe("happy");

    // Add +15 XP -> total 110 XP -> level up to level 2 (xp resets/carries over or level calculated)
    state = mascotEngine.addXp(15);
    expect(state.level).toBe(2);
    expect(state.xp).toBe(110);
    expect(state.emotion).toBe("cheering");
  });

  it("should increment streak when completing an action on a new day", () => {
    const today = "2026-09-23";
    let state = mascotEngine.recordDailyActivity(today);
    expect(state.streak).toBe(1);
    expect(state.last_active_date).toBe(today);

    // Activity on the same day should not double increment streak
    state = mascotEngine.recordDailyActivity(today);
    expect(state.streak).toBe(1);

    // Activity on consecutive day should increment streak to 2
    const nextDay = "2026-09-24";
    state = mascotEngine.recordDailyActivity(nextDay);
    expect(state.streak).toBe(2);
    expect(state.last_active_date).toBe(nextDay);
  });

  it("should reset streak if a day is missed", () => {
    const day1 = "2026-09-20";
    mascotEngine.recordDailyActivity(day1);

    // Day missed (skipped 2026-09-21) -> activity on 2026-09-22 resets streak to 1
    const day3 = "2026-09-22";
    const state = mascotEngine.recordDailyActivity(day3);
    expect(state.streak).toBe(1);
  });
});
