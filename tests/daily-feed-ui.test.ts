import { describe, it, expect, beforeEach } from "vitest";
import { DatabaseService } from "../src/database.js";
import {
  ActionUnitRepository,
  ActionUnit,
} from "../src/action-unit-repository.js";
import { MascotEngine } from "../src/mascot-engine.js";
import {
  DailyFeedPresenter,
  HybridCardPresenter,
} from "../src/daily-feed-presenter.js";

describe("Daily Feed UI & Hybrid Cards Presenter (Ticket 05)", () => {
  let dbService: DatabaseService;
  let repository: ActionUnitRepository;
  let mascotEngine: MascotEngine;
  let feedPresenter: DailyFeedPresenter;

  beforeEach(() => {
    dbService = new DatabaseService(":memory:");
    dbService.initSchema();
    repository = new ActionUnitRepository(dbService);
    mascotEngine = new MascotEngine(dbService);
    feedPresenter = new DailyFeedPresenter(repository, mascotEngine);
  });

  it("should format header with mascot state, level, XP, and streak", () => {
    mascotEngine.addXp(30);
    mascotEngine.recordDailyActivity("2026-09-23");

    const header = feedPresenter.getHeaderViewModel();
    expect(header.level).toBe(1);
    expect(header.xp).toBe(30);
    expect(header.streak).toBe(1);
    expect(header.emotion).toBe("happy");
    expect(header.greetingText).toBeDefined();
  });

  it("should map ActionUnits to HybridCardViewModel with provider brand tokens", () => {
    const unit: ActionUnit = {
      id: "gcal-1",
      provider: "google_calendar",
      external_id: "evt-1",
      title: "Design Review",
      subtitle: "Google Calendar Event",
      type: "event",
      due_time: "2026-09-23T16:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T12:00:00.000Z",
      updated_at: "2026-09-23T12:00:00.000Z",
    };

    const cardVM = HybridCardPresenter.toViewModel(unit);
    expect(cardVM.brandColor).toBe("#4285F4"); // Google Blue
    expect(cardVM.badgeText).toBe("Google Calendar");
    expect(cardVM.formattedTime).toBe("16:00");
  });

  it("should render empty state encouragement message when no pending items exist", () => {
    const viewState = feedPresenter.getFeedViewState("2026-09-23");
    expect(viewState.isEmpty).toBe(true);
    expect(viewState.emptyStateMessage).toContain("Tudo limpo por aqui");
  });

  it("should return pending items formatted into hybrid card view models", () => {
    const unit: ActionUnit = {
      id: "tr-1",
      provider: "trello",
      external_id: "card-1",
      title: "Finish UI Layout",
      subtitle: "Board: Product",
      type: "task",
      due_time: "2026-09-23T18:00:00.000Z",
      status: "pending",
      created_at: "2026-09-23T12:00:00.000Z",
      updated_at: "2026-09-23T12:00:00.000Z",
    };
    repository.insertActionUnit(unit);

    const viewState = feedPresenter.getFeedViewState("2026-09-23");
    expect(viewState.isEmpty).toBe(false);
    expect(viewState.cards).toHaveLength(1);
    expect(viewState.cards[0].brandColor).toBe("#0079BF"); // Trello Blue
  });
});
