import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import { ActionUnitRepository } from "../src/action-unit-repository.js";
import {
  GoogleCalendarAdapter,
  RawGoogleEvent,
} from "../src/google-calendar-adapter.js";
import { OAuthBridgeService } from "../src/oauth-bridge.js";

describe("OAuth Bridge & Google Calendar Adapter (Ticket 03)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;
  let oauthBridge: OAuthBridgeService;
  let adapter: GoogleCalendarAdapter;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
    oauthBridge = new OAuthBridgeService();
    adapter = new GoogleCalendarAdapter(oauthBridge, repository);
  });

  it("should handle OAuth token handshake and return active status", async () => {
    const tokenData = await oauthBridge.exchangeCodeForToken("auth-code-123");
    expect(tokenData.access_token).toBeDefined();
    expect(tokenData.provider).toBe("google_calendar");
  });

  it("should normalize raw Google Calendar events into ActionUnits", () => {
    const rawEvents: RawGoogleEvent[] = [
      {
        id: "gcal-evt-1",
        summary: "Design System Review",
        description: "Review Nubank/Duolingo card styles",
        start: { dateTime: "2026-09-23T16:00:00.000Z" },
        updated: "2026-09-23T12:00:00.000Z",
        status: "confirmed",
      },
      {
        id: "gcal-evt-2",
        summary: "Team Standup",
        description: null,
        start: { dateTime: "2026-09-23T17:00:00.000Z" },
        updated: "2026-09-23T12:00:00.000Z",
        status: "confirmed",
      },
    ];

    const actionUnits = adapter.normalizeEvents(rawEvents);
    expect(actionUnits).toHaveLength(2);
    expect(actionUnits[0].provider).toBe("google_calendar");
    expect(actionUnits[0].type).toBe("event");
    expect(actionUnits[0].title).toBe("Design System Review");
    expect(actionUnits[0].due_time).toBe("2026-09-23T16:00:00.000Z");
  });

  it("should synchronize events into local SQLite database idempotently", async () => {
    const rawEvents: RawGoogleEvent[] = [
      {
        id: "gcal-evt-1",
        summary: "Design System Review",
        description: "Review Nubank/Duolingo card styles",
        start: { dateTime: "2026-09-23T16:00:00.000Z" },
        updated: "2026-09-23T12:00:00.000Z",
        status: "confirmed",
      },
    ];

    // First sync
    await adapter.syncEvents(rawEvents);
    let units = repository.getActionUnitsByDate("2026-09-23");
    expect(units).toHaveLength(1);

    // Second sync with same events (idempotent, no duplicates)
    await adapter.syncEvents(rawEvents);
    units = repository.getActionUnitsByDate("2026-09-23");
    expect(units).toHaveLength(1);
  });
});
