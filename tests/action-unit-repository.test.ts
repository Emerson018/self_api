import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import {
  ActionUnitRepository,
  ActionUnit,
} from "../src/action-unit-repository.js";

describe("ActionUnitRepository (Seam 1)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;

  beforeEach(() => {
    // In-memory SQLite database for isolated tests
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
  });

  it("should insert and retrieve an ActionUnit by date", () => {
    const unit: ActionUnit = {
      id: "unit-123",
      provider: "google_calendar",
      external_id: "evt-99",
      title: "Sprint Planning Meeting",
      subtitle: "Google Calendar Event",
      type: "event",
      due_time: "2026-09-23T16:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T14:00:00.000Z",
      updated_at: "2026-09-23T14:00:00.000Z",
    };

    repository.insertActionUnit(unit);

    const units = repository.getActionUnitsByDate("2026-09-23");
    expect(units).toHaveLength(1);
    expect(units[0]).toEqual(unit);
  });

  it("should update ActionUnit status", () => {
    const unit: ActionUnit = {
      id: "unit-456",
      provider: "trello",
      external_id: "card-10",
      title: "Review PR #42",
      subtitle: "Trello Card",
      type: "task",
      due_time: "2026-09-23T18:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T14:00:00.000Z",
      updated_at: "2026-09-23T14:00:00.000Z",
    };

    repository.insertActionUnit(unit);
    repository.updateActionUnitStatus("unit-456", "completed");

    const units = repository.getActionUnitsByDate("2026-09-23");
    expect(units[0].status).toBe("completed");
  });

  it("should delete an ActionUnit", () => {
    const unit: ActionUnit = {
      id: "unit-789",
      provider: "steam",
      external_id: "ach-100",
      title: "Unlock CS2 Achievement",
      subtitle: "Steam Milestone",
      type: "leisure",
      due_time: "2026-09-23T20:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T14:00:00.000Z",
      updated_at: "2026-09-23T14:00:00.000Z",
    };

    repository.insertActionUnit(unit);
    expect(repository.getActionUnitsByDate("2026-09-23")).toHaveLength(1);

    repository.deleteActionUnit("unit-789");
    expect(repository.getActionUnitsByDate("2026-09-23")).toHaveLength(0);
  });
});
