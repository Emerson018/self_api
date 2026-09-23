import { ActionUnit, ActionUnitRepository } from "./action-unit-repository.js";
import { MascotEngine, MascotEmotion } from "./mascot-engine.js";

export interface HeaderViewModel {
  level: number;
  xp: number;
  streak: number;
  emotion: MascotEmotion;
  greetingText: string;
}

export interface HybridCardViewModel {
  id: string;
  provider: string;
  badgeText: string;
  brandColor: string;
  title: string;
  subtitle: string;
  type: string;
  formattedTime: string;
  status: string;
}

export interface FeedViewState {
  isEmpty: boolean;
  emptyStateMessage: string;
  cards: HybridCardViewModel[];
}

export class HybridCardPresenter {
  public static toViewModel(unit: ActionUnit): HybridCardViewModel {
    let brandColor = "#6200EE";
    let badgeText = "Geral";

    switch (unit.provider) {
      case "google_calendar":
        brandColor = "#4285F4"; // Google Blue
        badgeText = "Google Calendar";
        break;
      case "trello":
        brandColor = "#0079BF"; // Trello Blue
        badgeText = "Trello";
        break;
      case "notion":
        brandColor = "#000000"; // Notion Black
        badgeText = "Notion";
        break;
      case "steam":
        brandColor = "#171A21"; // Steam Dark
        badgeText = "Steam";
        break;
    }

    let formattedTime = "--:--";
    if (unit.due_time) {
      try {
        const date = new Date(unit.due_time);
        formattedTime = date.toISOString().substring(11, 16);
      } catch {
        formattedTime = unit.due_time;
      }
    }

    return {
      id: unit.id,
      provider: unit.provider,
      badgeText,
      brandColor,
      title: unit.title,
      subtitle: unit.subtitle || "",
      type: unit.type,
      formattedTime,
      status: unit.status,
    };
  }
}

export class DailyFeedPresenter {
  constructor(
    private repository: ActionUnitRepository,
    private mascotEngine: MascotEngine
  ) {}

  public getHeaderViewModel(): HeaderViewModel {
    const mascotState = this.mascotEngine.getState();
    let greetingText = "Bora focar nas metas de hoje!";

    if (mascotState.streak > 1) {
      greetingText = `Você está pegando fogo! ${mascotState.streak} dias seguidos! 🔥`;
    } else if (mascotState.emotion === "cheering") {
      greetingText = "Parabéns! Subiu de nível! 🎉";
    }

    return {
      level: mascotState.level,
      xp: mascotState.xp,
      streak: mascotState.streak,
      emotion: mascotState.emotion,
      greetingText,
    };
  }

  public getFeedViewState(dateStr: string): FeedViewState {
    const units = this.repository.getActionUnitsByDate(dateStr);
    const pendingUnits = units.filter((u) => u.status === "pending");

    if (pendingUnits.length === 0) {
      return {
        isEmpty: true,
        emptyStateMessage:
          "Tudo limpo por aqui! Você concluiu todas as ações prioritárias do dia! ✨",
        cards: [],
      };
    }

    const cards = pendingUnits.map((u) => HybridCardPresenter.toViewModel(u));
    return {
      isEmpty: false,
      emptyStateMessage: "",
      cards,
    };
  }
}
