import { ActionUnitRepository } from "./action-unit-repository.js";
import { MascotEngine, MascotState } from "./mascot-engine.js";

export class HapticFeedbackService {
  public triggerCompletionHaptic(
    type: "light" | "medium" | "heavy" = "light"
  ): void {
    // Interface wrapper for Expo Haptics / Native Haptic feedback
  }
}

export class CelebrationOverlayEngine {
  public triggerLevelUpOverlay(newLevel: number): void {
    // Triggers Lottie confetti celebration animation overlay in UI
  }
}

export interface MicroActionResult {
  success: boolean;
  updatedStatus: string;
  mascotState: MascotState;
  leveledUp: boolean;
}

export class MicroActionHandler {
  constructor(
    private repository: ActionUnitRepository,
    private mascotEngine: MascotEngine,
    private hapticService: HapticFeedbackService,
    private celebrationEngine: CelebrationOverlayEngine
  ) {}

  public async completeActionUnit(
    id: string,
    dateStr: string
  ): Promise<MicroActionResult> {
    const previousState = this.mascotEngine.getState();

    // 1. Update SQLite status to completed
    this.repository.updateActionUnitStatus(id, "completed");

    // 2. Trigger instant haptic feedback
    this.hapticService.triggerCompletionHaptic("light");

    // 3. Dispatch XP (+15 XP) and record daily activity
    const updatedStateAfterXp = this.mascotEngine.addXp(15);
    const finalMascotState = this.mascotEngine.recordDailyActivity(dateStr);

    const leveledUp = finalMascotState.level > previousState.level;

    // 4. Trigger celebration overlay if leveled up
    if (leveledUp) {
      this.celebrationEngine.triggerLevelUpOverlay(finalMascotState.level);
    }

    return {
      success: true,
      updatedStatus: "completed",
      mascotState: finalMascotState,
      leveledUp,
    };
  }
}
