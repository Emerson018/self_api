import http from "node:http";
import { DatabaseService } from "../src/database.js";
import { ActionUnitRepository } from "../src/action-unit-repository.js";
import { MascotEngine } from "../src/mascot-engine.js";
import { DailyFeedPresenter } from "../src/daily-feed-presenter.js";
import {
  MicroActionHandler,
  HapticFeedbackService,
  CelebrationOverlayEngine,
} from "../src/micro-action-handler.js";
import { GoogleCalendarAdapter } from "../src/google-calendar-adapter.js";
import { TrelloNotionAdapter } from "../src/trello-notion-adapter.js";
import { SteamAdapter } from "../src/steam-adapter.js";
import { OAuthBridgeService } from "../src/oauth-bridge.js";

// 1. Initialize Database & Services
const dbService = new DatabaseService(":memory:");
dbService.initSchema();

const repository = new ActionUnitRepository(dbService);
const mascotEngine = new MascotEngine(dbService);
const feedPresenter = new DailyFeedPresenter(repository, mascotEngine);
const hapticService = new HapticFeedbackService();
const celebrationEngine = new CelebrationOverlayEngine();
const microActionHandler = new MicroActionHandler(
  repository,
  mascotEngine,
  hapticService,
  celebrationEngine
);

const oauthBridge = new OAuthBridgeService();
const gcalAdapter = new GoogleCalendarAdapter(oauthBridge, repository);
const trelloNotionAdapter = new TrelloNotionAdapter(repository);
const steamAdapter = new SteamAdapter(repository);

// 2. Seed Initial Demo Data
async function seedInitialData() {
  await gcalAdapter.syncEvents([
    {
      id: "gcal-101",
      summary: "Reunião de Alinhamento do Produto",
      description: "Review das métricas de Behavioral UX e roadmap",
      start: { dateTime: "2026-09-23T16:00:00.000Z" },
      updated: "2026-09-23T12:00:00.000Z",
      status: "confirmed",
    },
  ]);

  await trelloNotionAdapter.syncTasks([
    {
      id: "tr-201",
      provider: "trello",
      name: "Finalizar protótipo de 1-Clique do Daily Feed",
      boardName: "Roadmap Mobile",
      due: "2026-09-23T18:00:00.000Z",
      closed: false,
    },
    {
      id: "no-301",
      provider: "notion",
      name: "Revisar documentação dos adaptadores de API",
      boardName: "Tech Specs",
      due: "2026-09-23T20:00:00.000Z",
      closed: false,
    },
  ]);

  await steamAdapter.syncAchievements([
    {
      apiname: "ACH_CS2_FIRST_WIN",
      name: "Vitória no Premier CS2",
      gameName: "Counter-Strike 2",
      unlocked: false,
      unlockTime: null,
    },
  ]);
}

await seedInitialData();

// 3. HTML Client Template with Mobile Frame and 3 UI Variants
const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App de Produtividade Comportamental - Visual Prototype</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0f172a; color: #f8fafc; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
    
    /* Device Frame */
    .device-container { width: 380px; height: 740px; background: #1e293b; border-radius: 40px; border: 8px solid #334155; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; position: relative; }
    .status-bar { height: 30px; background: rgba(0,0,0,0.2); display: flex; justify-content: space-between; align-items: center; padding: 0 20px; font-size: 12px; color: #94a3b8; }
    
    .screen-content { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
    
    /* Mascot Header */
    .mascot-header { background: #334155; border-radius: 20px; padding: 16px; display: flex; align-items: center; gap: 14px; position: relative; }
    .mascot-avatar { width: 56px; height: 56px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 4px 12px rgba(59,130,246,0.4); transition: transform 0.3s ease; }
    .mascot-info { flex: 1; }
    .mascot-level { font-size: 14px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; }
    .mascot-greeting { font-size: 13px; color: #e2e8f0; margin-top: 2px; }
    .streak-badge { background: #f59e0b; color: #000; font-weight: 800; font-size: 12px; padding: 4px 10px; border-radius: 12px; display: flex; align-items: center; gap: 4px; }
    
    .progress-bar-bg { width: 100%; height: 6px; background: #1e293b; border-radius: 3px; margin-top: 8px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #60a5fa); width: 0%; transition: width 0.4s ease; }

    /* Feed Items & Cards */
    .section-title { font-size: 14px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    .card-list { display: flex; flex-direction: column; gap: 12px; }
    
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px; position: relative; cursor: pointer; transition: transform 0.2s ease, background 0.2s ease; user-select: none; }
    .card:hover { transform: translateY(-2px); border-color: #475569; }
    .card:active { transform: scale(0.98); }
    
    .card-header { display: flex; justify-content: space-between; align-items: center; }
    .card-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; color: #fff; }
    .card-time { font-size: 12px; color: #94a3b8; font-weight: 600; }
    .card-title { font-size: 15px; font-weight: 600; color: #f8fafc; }
    .card-subtitle { font-size: 12px; color: #94a3b8; }
    .card-action-hint { font-size: 11px; color: #3b82f6; font-weight: 600; text-align: right; margin-top: 4px; }

    /* Empty State */
    .empty-state { text-align: center; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: #94a3b8; }
    .empty-icon { font-size: 48px; }

    /* Floating Switcher Toolbar */
    .switcher-bar { position: fixed; bottom: 20px; background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(10px); border: 1px solid #475569; border-radius: 30px; padding: 8px 16px; display: flex; align-items: center; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .btn-nav { background: #334155; border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-weight: bold; cursor: pointer; }
    .btn-nav:hover { background: #475569; }
    .variant-label { font-size: 13px; font-weight: 700; color: #60a5fa; }
    .btn-reset { background: #ef4444; border: none; color: #fff; padding: 6px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; cursor: pointer; }

    /* Confetti Overlay */
    .confetti { position: absolute; inset: 0; pointer-events: none; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.7); border-radius: 32px; flex-direction: column; gap: 12px; z-index: 100; }
    .confetti-text { font-size: 24px; font-weight: 900; color: #f59e0b; text-align: center; }

    /* Variant B (Duolingo Style Overrides) */
    body.variant-B .device-container { background: #58cc02; border-color: #46a302; }
    body.variant-B .screen-content { background: #ffffff; color: #3c3c3c; }
    body.variant-B .mascot-header { background: #e5e5e5; color: #3c3c3c; border: 2px solid #cecece; }
    body.variant-B .mascot-level { color: #58cc02; }
    body.variant-B .mascot-greeting { color: #4b4b4b; }
    body.variant-B .card { background: #ffffff; border: 2px solid #e5e5e5; border-bottom: 5px solid #e5e5e5; color: #3c3c3c; }
    body.variant-B .card-title { color: #3c3c3c; }

    /* Variant C (Compact Timeline Overrides) */
    body.variant-C .card { border-left: 4px solid #3b82f6; border-radius: 8px; padding: 10px 14px; }
  </style>
</head>
<body>
  <div class="device-container">
    <div class="status-bar">
      <span>09:41</span>
      <span>🔋 100%</span>
    </div>
    
    <div class="screen-content">
      <!-- Mascot Header -->
      <div class="mascot-header">
        <div class="mascot-avatar" id="mascotIcon">🦉</div>
        <div class="mascot-info">
          <div class="mascot-level" id="mascotLevel">Nível 1 (0/100 XP)</div>
          <div class="mascot-greeting" id="mascotGreeting">Carregando mascote...</div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" id="xpBarFill"></div>
          </div>
        </div>
        <div class="streak-badge" id="streakBadge">🔥 0</div>
      </div>

      <div class="section-title">Feed de Foco do Dia</div>

      <!-- Card List -->
      <div class="card-list" id="cardList"></div>

      <!-- Empty State -->
      <div class="empty-state" id="emptyState" style="display: none;">
        <div class="empty-icon">✨</div>
        <div style="font-weight: 700; color: #f8fafc;" id="emptyMsg">Tudo limpo!</div>
      </div>
    </div>

    <!-- Confetti Overlay -->
    <div class="confetti" id="confettiOverlay">
      <div style="font-size: 64px;">🎉</div>
      <div class="confetti-text">LEVEL UP!</div>
      <div style="font-size: 14px; color: #fff;" id="levelUpText">Você subiu para o Nível 2!</div>
    </div>
  </div>

  <!-- Floating Variant Switcher Toolbar -->
  <div class="switcher-bar">
    <button class="btn-nav" onclick="prevVariant()">&lt;</button>
    <div class="variant-label" id="variantLabel">Variante A (Estilo Nubank)</div>
    <button class="btn-nav" onclick="nextVariant()">&gt;</button>
    <button class="btn-reset" onclick="resetSeed()">Reset Dados</button>
  </div>

  <script>
    const variants = [
      { id: 'A', name: 'Variante A (Estilo Nubank - Minimalista Dark)' },
      { id: 'B', name: 'Variante B (Estilo Duolingo - Gamificado Bold)' },
      { id: 'C', name: 'Variante C (Timeline Compacta - Foco Rápido)' }
    ];
    let currentVariantIdx = 0;

    const mascotEmotions = {
      idle: '🦉',
      happy: '😃',
      cheering: '🎉',
      thinking: '🤔',
      sleepy: '😴'
    };

    function updateVariant() {
      const v = variants[currentVariantIdx];
      document.body.className = 'variant-' + v.id;
      document.getElementById('variantLabel').innerText = v.name;
    }

    function prevVariant() {
      currentVariantIdx = (currentVariantIdx - 1 + variants.length) % variants.length;
      updateVariant();
    }

    function nextVariant() {
      currentVariantIdx = (currentVariantIdx + 1) % variants.length;
      updateVariant();
    }

    async function loadFeed() {
      const res = await fetch('/api/feed');
      const data = await res.json();

      // Update Mascot Header
      const h = data.header;
      document.getElementById('mascotIcon').innerText = mascotEmotions[h.emotion] || '🦉';
      document.getElementById('mascotLevel').innerText = \`Nível \${h.level} (\${h.xp}/\${h.level * 100} XP)\`;
      document.getElementById('mascotGreeting').innerText = h.greetingText;
      document.getElementById('streakBadge').innerText = \`🔥 \${h.streak}\`;

      const xpPercent = Math.min(100, Math.floor((h.xp / (h.level * 100)) * 100));
      document.getElementById('xpBarFill').style.width = xpPercent + '%';

      // Update Feed Items
      const cardList = document.getElementById('cardList');
      const emptyState = document.getElementById('emptyState');
      cardList.innerHTML = '';

      if (data.feed.isEmpty) {
        emptyState.style.display = 'flex';
        document.getElementById('emptyMsg').innerText = data.feed.emptyStateMessage;
      } else {
        emptyState.style.display = 'none';
        data.feed.cards.forEach(card => {
          const cardEl = document.createElement('div');
          cardEl.className = 'card';
          cardEl.onclick = () => completeAction(card.id);
          cardEl.innerHTML = \`
            <div class="card-header">
              <span class="card-badge" style="background: \${card.brandColor}">\${card.badgeText}</span>
              <span class="card-time">\${card.formattedTime}</span>
            </div>
            <div class="card-title">\${card.title}</div>
            <div class="card-subtitle">\${card.subtitle}</div>
            <div class="card-action-hint">👉 Clique para concluir (+15 XP)</div>
          \`;
          cardList.appendChild(cardEl);
        });
      }
    }

    async function completeAction(id) {
      const res = await fetch('/api/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();

      if (result.leveledUp) {
        showLevelUp(result.mascotState.level);
      }

      await loadFeed();
    }

    function showLevelUp(level) {
      const overlay = document.getElementById('confettiOverlay');
      document.getElementById('levelUpText').innerText = \`Você alcançou o Nível \${level}! 🎉\`;
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 2500);
    }

    async function resetSeed() {
      await fetch('/api/seed', { method: 'POST' });
      await loadFeed();
    }

    updateVariant();
    loadFeed();
  </script>
</body>
</html>`;

// 4. HTTP Server
const PORT = 3000;
const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  if (url === "/" || url.startsWith("/?variant=")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(htmlContent);
    return;
  }

  if (url === "/api/feed" && req.method === "GET") {
    const header = feedPresenter.getHeaderViewModel();
    const feed = feedPresenter.getFeedViewState("2026-09-23");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ header, feed }));
    return;
  }

  if (url === "/api/complete" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const { id } = JSON.parse(body);
      const result = await microActionHandler.completeActionUnit(
        id,
        "2026-09-23"
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    });
    return;
  }

  if (url === "/api/seed" && req.method === "POST") {
    await seedInitialData();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🚀 Servidor Protótipo rodando em: http://localhost:${PORT}`);
});
