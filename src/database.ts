import { DatabaseSync } from "node:sqlite";

export class DatabaseService {
  private db: DatabaseSync;

  constructor(dbPath: string = ":memory:") {
    this.db = new DatabaseSync(dbPath);
  }

  public getDb(): DatabaseSync {
    return this.db;
  }

  public initSchema(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS action_units (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL,
        external_id TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        type TEXT NOT NULL,
        due_time TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_action_units_due_time ON action_units(due_time);
      CREATE INDEX IF NOT EXISTS idx_action_units_status ON action_units(status);

      CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        xp INTEGER NOT NULL DEFAULT 0,
        level INTEGER NOT NULL DEFAULT 1,
        streak INTEGER NOT NULL DEFAULT 0,
        last_active_date TEXT,
        emotion TEXT NOT NULL DEFAULT 'idle'
      );

      INSERT OR IGNORE INTO user_progress (id, xp, level, streak, last_active_date, emotion)
      VALUES (1, 0, 1, 0, NULL, 'idle');
    `);
  }
}
