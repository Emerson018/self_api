import { DatabaseService } from "./database.js";

export interface ActionUnit {
  id: string;
  provider: "google_calendar" | "trello" | "notion" | "steam";
  external_id: string;
  title: string;
  subtitle: string | null;
  type: "task" | "event" | "streak" | "leisure";
  due_time: string | null;
  status: "pending" | "completed" | "dismissed";
  created_at: string;
  updated_at: string;
}

export class ActionUnitRepository {
  constructor(private dbService: DatabaseService) {}

  public insertActionUnit(unit: ActionUnit): void {
    const db = this.dbService.getDb();
    const stmt = db.prepare(`
      INSERT INTO action_units (id, provider, external_id, title, subtitle, type, due_time, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      unit.id,
      unit.provider,
      unit.external_id,
      unit.title,
      unit.subtitle,
      unit.type,
      unit.due_time,
      unit.status,
      unit.created_at,
      unit.updated_at
    );
  }

  public getActionUnitsByDate(dateStr: string): ActionUnit[] {
    const db = this.dbService.getDb();
    const stmt = db.prepare(`
      SELECT * FROM action_units
      WHERE due_time LIKE ?
      ORDER BY due_time ASC
    `);
    const rows = stmt.all(`${dateStr}%`) as any[];
    return rows.map((row) => ({
      id: row.id,
      provider: row.provider,
      external_id: row.external_id,
      title: row.title,
      subtitle: row.subtitle,
      type: row.type,
      due_time: row.due_time,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));
  }

  public updateActionUnitStatus(
    id: string,
    status: "pending" | "completed" | "dismissed"
  ): void {
    const db = this.dbService.getDb();
    const updatedAt = new Date().toISOString();
    const stmt = db.prepare(`
      UPDATE action_units
      SET status = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(status, updatedAt, id);
  }

  public deleteActionUnit(id: string): void {
    const db = this.dbService.getDb();
    const stmt = db.prepare(`
      DELETE FROM action_units WHERE id = ?
    `);
    stmt.run(id);
  }
}
