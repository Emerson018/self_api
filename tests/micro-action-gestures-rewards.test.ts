import { describe, it, expect, beforeEach, vi } from "vitest";
import { DatabaseService } from "../src/database.js";
import {
  ActionUnitRepository,
  ActionUnit,
} from "../src/action-unit-repository.js";
import { MascotEngine } from "../src/mascot-engine.js";
import {
  MicroActionHandler,
  HapticFeedbackService,
  CelebrationOverlayEngine,
} from "../src/micro-action-handler.js";

describe("Micro-Action 1-Click Gestures & Micro-Rewards (Ticket 06)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;
  let mascotEngine: MascotEngine;
  let hapticService: HapticFeedbackService;
  let celebrationEngine: CelebrationOverlayEngine;
  let microActionHandler: MicroActionHandler;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
    mascotEngine = new MascotEngine(dbService);
    hapticService = new HapticFeedbackService();
    celebrationEngine = new CelebrationOverlayEngine();

    microActionHandler = new MicroActionHandler(
      repository,
      mascotEngine,
      hapticService,
      celebrationEngine
    );
  });

  it("should execute 1-click completion: update SQLite, award +15 XP, trigger haptics and streak", async () => {
    const unit: ActionUnit = {
      id: "unit-micro-1",
      provider: "trello",
      external_id: "tr-999",
      title: "Deploy Production Build",
      subtitle: "Board: Releases",
      type: "task",
      due_time: "2026-09-23T18:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T12:00:00.000Z",
      updated_at: "2026-09-23T12:00:00.000Z",
    };
    repository.insertActionUnit(unit);

    const hapticSpy = vi.spyOn(hapticService, "triggerCompletionHaptic");

    const result = await microActionHandler.completeActionUnit(
      "unit-micro-1",
      "2026-09-23"
    );

    expect(result.success).toBe(true);
    expect(result.updatedStatus).toBe("completed");
    expect(result.mascotState.xp).toBe(15);
    expect(result.mascotState.streak).toBe(1);
    expect(hapticSpy).toHaveBeenCalledWith("light");

    // Verify database record updated
    const updatedUnits = repository.getActionUnitsByDate("2026-09-23");
    expect(updatedUnits[0].status).toBe("completed");
  });

  it("should trigger celebratory overlay when XP addition causes a level up", async () => {
    // Pre-seed XP to 90 (level 1 requires 100 XP)
    mascotEngine.addXp(90);

    const unit: ActionUnit = {
      id: "unit-level-up",
      provider: "google_calendar",
      external_id: "g-777",
      title: "Sprint Demo",
      subtitle: "Google Calendar Event",
      type: "event",
      due_time: "2026-09-23T19:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T12:00:00.000Z",
      updated_at: "2026-09-23T12:00:00.000Z",
    };
    repository.insertActionUnit(unit);

    const celebrationSpy = vi.spyOn(celebrationEngine, "triggerLevelUpOverlay");

    const result = await microActionHandler.completeActionUnit(
      "unit-level-up",
      "2026-09-23"
    );

    expect(result.leveledUp).toBe(true);
    expect(result.mascotState.level).toBe(2);
    expect(celebrationSpy).toHaveBeenCalledWith(2);
  });
});
