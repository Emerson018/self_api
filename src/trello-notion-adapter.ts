import { ActionUnit, ActionUnitRepository } from "./action-unit-repository.js";

export interface RawTaskItem {
  id: string;
  provider: "trello" | "notion";
  name: string;
  boardName: string;
  due: string | null;
  closed: boolean;
}

export class TrelloNotionAdapter {
  constructor(private repository: ActionUnitRepository) {}

  public normalizeTasks(rawTasks: RawTaskItem[]): ActionUnit[] {
    const now = new Date().toISOString();
    return rawTasks.map((task) => ({
      id: `${task.provider}-${task.id}`,
      provider: task.provider,
      external_id: task.id,
      title: task.name,
      subtitle: `Board: ${task.boardName}`,
      type: "task",
      due_time: task.due,
      status: task.closed ? "completed" : "pending",
      created_at: now,
      updated_at: now,
    }));
  }

  public async syncTasks(rawTasks: RawTaskItem[]): Promise<void> {
    const normalized = this.normalizeTasks(rawTasks);
    for (const unit of normalized) {
      this.repository.deleteActionUnit(unit.id);
      this.repository.insertActionUnit(unit);
    }
  }

  public async markExternalTaskComplete(
    provider: "trello" | "notion",
    externalId: string
  ): Promise<boolean> {
    // Simulated asynchronous write-back to external API endpoint
    return true;
  }
}
