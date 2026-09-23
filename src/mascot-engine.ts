import { DatabaseService } from "./database.js";

export type MascotEmotion =
  "idle" | "happy" | "cheering" | "thinking" | "sleepy";

export interface MascotState {
  id: number;
  xp: number;
  level: number;
  streak: number;
  last_active_date: string | null;
  emotion: MascotEmotion;
}

export class MascotEngine {
  constructor(private dbService: DatabaseService) {}

  public getState(): MascotState {
    const db = this.dbService.getDb();
    const row = db
      .prepare("SELECT * FROM user_progress WHERE id = 1")
      .get() as any;
    return {
      id: Number(row.id),
      xp: Number(row.xp),
      level: Number(row.level),
      streak: Number(row.streak),
      last_active_date: row.last_active_date
        ? String(row.last_active_date)
        : null,
      emotion: row.emotion as MascotEmotion,
    };
  }

  public addXp(amount: number): MascotState {
    const currentState = this.getState();
    const newXp = currentState.xp + amount;

    let newLevel = currentState.level;
    let emotion: MascotEmotion = "happy";

    while (newXp >= newLevel * 100) {
      newLevel += 1;
      emotion = "cheering";
    }

    const db = this.dbService.getDb();
    db.prepare(
      `
      UPDATE user_progress
      SET xp = ?, level = ?, emotion = ?
      WHERE id = 1
    `
    ).run(newXp, newLevel, emotion);

    return this.getState();
  }

  public recordDailyActivity(dateStr: string): MascotState {
    const currentState = this.getState();
    let newStreak = currentState.streak;

    if (!currentState.last_active_date) {
      newStreak = 1;
    } else if (currentState.last_active_date === dateStr) {
      newStreak = currentState.streak;
    } else {
      const lastDate = new Date(currentState.last_active_date);
      const currentDate = new Date(dateStr);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const db = this.dbService.getDb();
    db.prepare(
      `
      UPDATE user_progress
      SET streak = ?, last_active_date = ?
      WHERE id = 1
    `
    ).run(newStreak, dateStr);

    return this.getState();
  }

  public setEmotion(emotion: MascotEmotion): MascotState {
    const db = this.dbService.getDb();
    db.prepare("UPDATE user_progress SET emotion = ? WHERE id = 1").run(
      emotion
    );
    return this.getState();
  }
}
