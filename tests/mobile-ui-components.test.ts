import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import {
  ActionUnitRepository,
  ActionUnit,
} from "../src/action-unit-repository.js";
import { MascotEngine } from "../src/mascot-engine.js";
import {
  DailyFeedPresenter,
  HybridCardPresenter,
} from "../src/daily-feed-presenter.js";

describe("Mobile Native UI ViewModels (Ticket 05 Extension)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;
  let mascotEngine: MascotEngine;
  let feedPresenter: DailyFeedPresenter;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
    mascotEngine = new MascotEngine(dbService);
    feedPresenter = new DailyFeedPresenter(repository, mascotEngine);
  });

  it("should calculate correct XP progress percentage for MascotHeader component", () => {
    mascotEngine.addXp(45);
    const header = feedPresenter.getHeaderViewModel();
    const xpMax = header.level * 100;
    const xpPercent = Math.min(100, Math.floor((header.xp / xpMax) * 100));
    expect(xpPercent).toBe(45);
  });

  it("should correctly format HybridProviderCard props for all providers", () => {
    const providers: Array<{
      provider: ActionUnit["provider"];
      expectedBadge: string;
      expectedColor: string;
    }> = [
      {
        provider: "google_calendar",
        expectedBadge: "Google Calendar",
        expectedColor: "#4285F4",
      },
      { provider: "trello", expectedBadge: "Trello", expectedColor: "#0079BF" },
      { provider: "notion", expectedBadge: "Notion", expectedColor: "#000000" },
      { provider: "steam", expectedBadge: "Steam", expectedColor: "#171A21" },
    ];

    providers.forEach(({ provider, expectedBadge, expectedColor }) => {
      const unit: ActionUnit = {
        id: `unit-${provider}`,
        provider,
        external_id: "ext-1",
        title: `Test ${provider}`,
        subtitle: "Subtitle",
        type: "task",
        due_time: "2026-09-23T18:00:00.000Z",
        status: "pending",
        created_at: "2026-09-23T12:00:00.000Z",
        updated_at: "2026-09-23T12:00:00.000Z",
      };

      const card = HybridCardPresenter.toViewModel(unit);
      expect(card.badgeText).toBe(expectedBadge);
      expect(card.brandColor).toBe(expectedColor);
    });
  });
});
