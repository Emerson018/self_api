import { ActionUnit, ActionUnitRepository } from "./action-unit-repository.js";
import { OAuthBridgeService } from "./oauth-bridge.js";

export interface RawGoogleEvent {
  id: string;
  summary: string;
  description: string | null;
  start: {
    dateTime?: string;
    date?: string;
  };
  updated: string;
  status: string;
}

export class GoogleCalendarAdapter {
  constructor(
    private oauthBridge: OAuthBridgeService,
    private repository: ActionUnitRepository
  ) {}

  public normalizeEvents(rawEvents: RawGoogleEvent[]): ActionUnit[] {
    const now = new Date().toISOString();
    return rawEvents.map((evt) => {
      const dueTime = evt.start.dateTime || evt.start.date || null;
      return {
        id: `gcal-${evt.id}`,
        provider: "google_calendar",
        external_id: evt.id,
        title: evt.summary,
        subtitle: evt.description || "Google Calendar Event",
        type: "event",
        due_time: dueTime,
        status: evt.status === "cancelled" ? "dismissed" : "pending",
        created_at: evt.updated || now,
        updated_at: now,
      };
    });
  }

  public async syncEvents(rawEvents: RawGoogleEvent[]): Promise<void> {
    const normalized = this.normalizeEvents(rawEvents);
    for (const unit of normalized) {
      // Idempotent upsert: delete existing before inserting
      this.repository.deleteActionUnit(unit.id);
      this.repository.insertActionUnit(unit);
    }
  }
}
