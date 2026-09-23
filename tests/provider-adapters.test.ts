import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import { ActionUnitRepository } from "../src/action-unit-repository.js";
import {
  TrelloNotionAdapter,
  RawTaskItem,
} from "../src/trello-notion-adapter.js";
import { SteamAdapter, RawSteamAchievement } from "../src/steam-adapter.js";

describe("Trello/Notion & Steam Adapters (Ticket 04)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;
  let trelloAdapter: TrelloNotionAdapter;
  let steamAdapter: SteamAdapter;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
    trelloAdapter = new TrelloNotionAdapter(repository);
    steamAdapter = new SteamAdapter(repository);
  });

  it("should normalize Trello and Notion raw tasks into ActionUnits", async () => {
    const rawTasks: RawTaskItem[] = [
      {
        id: "tr-101",
        provider: "trello",
        name: "Design Behavioral UX Wireframes",
        boardName: "Product Roadmap",
        due: "2026-09-23T18:00:00.000Z",
        closed: false,
      },
      {
        id: "no-202",
        provider: "notion",
        name: "Update API Documentation",
        boardName: "Tech Specs",
        due: "2026-09-24T10:00:00.000Z",
        closed: false,
      },
    ];

    const units = trelloAdapter.normalizeTasks(rawTasks);
    expect(units).toHaveLength(2);
    expect(units[0].provider).toBe("trello");
    expect(units[0].type).toBe("task");
    expect(units[0].subtitle).toBe("Board: Product Roadmap");
    expect(units[1].provider).toBe("notion");
  });

  it("should normalize Steam achievements into leisure ActionUnits", () => {
    const rawAchievements: RawSteamAchievement[] = [
      {
        apiname: "ACH_CS2_FIRST_WIN",
        name: "Premier Victory",
        gameName: "Counter-Strike 2",
        unlocked: true,
        unlockTime: "2026-09-23T15:00:00.000Z",
      },
    ];

    const units = steamAdapter.normalizeAchievements(rawAchievements);
    expect(units).toHaveLength(1);
    expect(units[0].provider).toBe("steam");
    expect(units[0].type).toBe("leisure");
    expect(units[0].subtitle).toBe("Game: Counter-Strike 2");
  });

  it("should perform write-back status update to external API asynchronously", async () => {
    const success = await trelloAdapter.markExternalTaskComplete(
      "trello",
      "tr-101"
    );
    expect(success).toBe(true);
  });
});
