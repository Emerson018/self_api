import { ActionUnit, ActionUnitRepository } from "./action-unit-repository.js";

export interface RawSteamAchievement {
  apiname: string;
  name: string;
  gameName: string;
  unlocked: boolean;
  unlockTime: string | null;
}

export class SteamAdapter {
  constructor(private repository: ActionUnitRepository) {}

  public normalizeAchievements(
    rawAchievements: RawSteamAchievement[]
  ): ActionUnit[] {
    const now = new Date().toISOString();
    return rawAchievements.map((ach) => ({
      id: `steam-${ach.apiname}`,
      provider: "steam",
      external_id: ach.apiname,
      title: ach.name,
      subtitle: `Game: ${ach.gameName}`,
      type: "leisure",
      due_time: ach.unlockTime || now,
      status: ach.unlocked ? "completed" : "pending",
      created_at: ach.unlockTime || now,
      updated_at: now,
    }));
  }

  public async syncAchievements(
    rawAchievements: RawSteamAchievement[]
  ): Promise<void> {
    const normalized = this.normalizeAchievements(rawAchievements);
    for (const unit of normalized) {
      this.repository.deleteActionUnit(unit.id);
      this.repository.insertActionUnit(unit);
    }
  }
}
