/**
 * ═══════════════════════════════════════════════════════════
 * NBTT Gamification Engine
 * NothingButTheTRUTH — Shared game module
 * ═══════════════════════════════════════════════════════════
 *
 * Features:
 *   1. Personal-best high-score tracking  (localStorage)
 *   2. Cross-game achievements / badges
 *   3. Daily challenges with rotating games
 *
 * Usage in any game:
 *   <script src="../nbtt-gamification.js"></script>
 *   // or for deeper games: <script src="../../nbtt-gamification.js"></script>
 *
 *   // Save score after game ends:
 *   NBTT.saveScore('verse-hunt', { score: 450, accuracy: 85, streak: 7, level: 4 });
 *
 *   // Show the personal-best banner in the end screen:
 *   NBTT.showPersonalBest('verse-hunt', containerElement);
 *
 *   // Check & unlock achievements based on latest play:
 *   NBTT.checkAchievements('verse-hunt', { score: 450, accuracy: 85, streak: 7, level: 4 });
 *
 *   // Render achievement toast popups:
 *   (automatic — fires on unlock)
 *
 *   // Daily challenge:
 *   const challenge = NBTT.getDailyChallenge();
 *   // { game: 'verse-hunt', title: '...', goal: '...', target: 300, key: 'score' }
 */

const NBTT = (() => {
  'use strict';

  /* ═══════════════════════════════════
     §1  CONSTANTS & STORAGE KEYS
     ═══════════════════════════════════ */
  const STORAGE_PREFIX = 'nbtt_';
  const SCORES_KEY     = STORAGE_PREFIX + 'scores';
  const BADGES_KEY     = STORAGE_PREFIX + 'badges';
  const STATS_KEY      = STORAGE_PREFIX + 'stats';
  const DAILY_KEY      = STORAGE_PREFIX + 'daily';

  /* ═══════════════════════════════════
     §2  GAME REGISTRY
     ═══════════════════════════════════ */
  const GAMES = {
    'ark-builder':       { name: 'Ark Builder',           icon: '🚢', scoreLabel: 'Score', url: 'games/ark-builder/index.html' },
    'bible-bingo':       { name: 'Bible Bingo',           icon: '📋', scoreLabel: 'Lines',  url: 'games/bible-bingo/BibleBingoScriptureSprint/index.html' },
    'bible-connections':  { name: 'Bible Connections',     icon: '🔗', scoreLabel: 'Lives Left', url: 'games/bible-connections/index.html' },
    'bible-memory-match': { name: 'Bible Memory Match',   icon: '🃏', scoreLabel: 'Moves (lower is better)', url: 'games/bible-memory-match/index.html', lowerIsBetter: true },
    'bible-sequence':     { name: 'Bible Sequence',       icon: '🧠', scoreLabel: 'Rounds', url: 'games/bible-sequence/index.html' },
    'bible-taboo':        { name: 'Bible Taboo',          icon: '🚫', scoreLabel: 'Score', url: 'games/Bible-taboo/index.html' },
    'bible-timeline':     { name: 'Bible Timeline',       icon: '⏳', scoreLabel: 'Score', url: 'games/bible-timeline/index.html' },
    'bible-word-search':  { name: 'Bible Word Search',    icon: '🔍', scoreLabel: 'Score', url: 'games/bible-word-search/index.html' },
    'fruit-catcher':      { name: 'Fruit Catcher',        icon: '🍇', scoreLabel: 'Score', url: 'games/fruit-catcher/index.html' },
    'prophecy-match':     { name: 'Prophecy Match',       icon: '📜', scoreLabel: 'Score', url: 'games/prophecy-match/index.html' },
    'relay-race':         { name: 'Relay Race',           icon: '🏃', scoreLabel: 'Correct', url: 'games/relay-race/index.html' },
    'scripture-sprint':   { name: 'Scripture Sprint',     icon: '📖', scoreLabel: 'Score', url: 'games/scripture-sprint/index.html' },
    'verse-hunt':         { name: 'Verse Hunt',           icon: '📖', scoreLabel: 'Score', url: 'games/verse-hunt-live/index.html' },
    'walls-of-jericho':   { name: 'Walls of Jericho',    icon: '🎺', scoreLabel: 'Score', url: 'games/walls-of-jericho/index.html' },
    'who-said-it':        { name: 'Who Said It?',         icon: '💬', scoreLabel: 'Score', url: 'games/Who-said-it/who-said/index.html' },
  };

  /* ═══════════════════════════════════
     §3  ACHIEVEMENTS DEFINITIONS
     ═══════════════════════════════════ */
  const ACHIEVEMENTS = [
    // ── Getting Started ──
    { id: 'first-game',        name: 'First Steps',         icon: '🌱', desc: 'Complete your first game',                   check: (s) => s.totalGamesPlayed >= 1 },
    { id: 'five-games',        name: 'Warm Up',             icon: '🔥', desc: 'Complete 5 games',                            check: (s) => s.totalGamesPlayed >= 5 },
    { id: 'twenty-five-games', name: 'Dedicated Player',    icon: '⭐', desc: 'Complete 25 games',                           check: (s) => s.totalGamesPlayed >= 25 },
    { id: 'hundred-games',     name: 'Century Club',        icon: '💯', desc: 'Complete 100 games',                          check: (s) => s.totalGamesPlayed >= 100 },

    // ── Variety ──
    { id: 'try-3-games',       name: 'Explorer',            icon: '🧭', desc: 'Play 3 different games',                      check: (s) => s.uniqueGamesPlayed >= 3 },
    { id: 'try-5-games',       name: 'Adventurer',          icon: '🗺️', desc: 'Play 5 different games',                      check: (s) => s.uniqueGamesPlayed >= 5 },
    { id: 'try-10-games',      name: 'Well-Rounded',        icon: '🌍', desc: 'Play 10 different games',                     check: (s) => s.uniqueGamesPlayed >= 10 },
    { id: 'try-all-games',     name: 'Completionist',       icon: '👑', desc: 'Play all 15 games',                           check: (s) => s.uniqueGamesPlayed >= 15 },

    // ── Accuracy ──
    { id: 'perfect-accuracy',  name: 'Flawless',            icon: '💎', desc: 'Get 100% accuracy in any game',               check: (s, g) => g.accuracy === 100 },
    { id: 'high-accuracy',     name: 'Sharp Mind',          icon: '🎯', desc: 'Get 90%+ accuracy 5 times',                   check: (s) => s.highAccuracyCount >= 5 },

    // ── Streaks ──
    { id: 'streak-5',          name: 'On Fire',             icon: '🔥', desc: 'Get a 5+ answer streak in any game',          check: (s, g) => (g.streak || 0) >= 5 },
    { id: 'streak-10',         name: 'Unstoppable',         icon: '⚡', desc: 'Get a 10+ answer streak',                     check: (s, g) => (g.streak || 0) >= 10 },

    // ── Score Milestones ──
    { id: 'score-500',         name: 'Rising Star',         icon: '🌟', desc: 'Score 500+ in a single game',                 check: (s, g) => (g.score || 0) >= 500 },
    { id: 'score-1000',        name: 'High Flyer',          icon: '🦅', desc: 'Score 1000+ in a single game',                check: (s, g) => (g.score || 0) >= 1000 },
    { id: 'score-2000',        name: 'Scripture Master',    icon: '📜', desc: 'Score 2000+ in a single game',                check: (s, g) => (g.score || 0) >= 2000 },

    // ── Personal Best ──
    { id: 'beat-pb',           name: 'Self-Improver',       icon: '📈', desc: 'Beat your personal best in any game',         check: (s, g) => g._beatPB === true },
    { id: 'beat-pb-5',         name: 'Always Improving',    icon: '🏆', desc: 'Beat your personal best 5 times',             check: (s) => s.pbBeats >= 5 },

    // ── Daily Challenge ──
    { id: 'daily-1',           name: 'Daily Devotion',      icon: '📅', desc: 'Complete 1 daily challenge',                  check: (s) => s.dailyChallengesCompleted >= 1 },
    { id: 'daily-7',           name: 'Weekly Warrior',      icon: '🗓️', desc: 'Complete 7 daily challenges',                 check: (s) => s.dailyChallengesCompleted >= 7 },
    { id: 'daily-30',          name: 'Monthly Champion',    icon: '🏅', desc: 'Complete 30 daily challenges',                check: (s) => s.dailyChallengesCompleted >= 30 },

    // ── Game-Specific ──
    { id: 'ark-full',          name: 'Noah\'s Faith',       icon: '🕊️', desc: 'Load 20+ items in Ark Builder',              check: (s, g, id) => id === 'ark-builder' && (g.itemsLoaded || 0) >= 20 },
    { id: 'sequence-10',       name: 'Memory Master',       icon: '🧠', desc: 'Reach round 10 in Bible Sequence',            check: (s, g, id) => id === 'bible-sequence' && (g.score || 0) >= 10 },
    { id: 'connections-perfect', name: 'Perfect Connection', icon: '🔗', desc: 'Solve Bible Connections with no mistakes',   check: (s, g, id) => id === 'bible-connections' && (g.livesLeft || 0) === 4 },
    { id: 'jericho-walls',     name: 'Walls Crumbled',      icon: '🎺', desc: 'Score 3000+ in Walls of Jericho',             check: (s, g, id) => id === 'walls-of-jericho' && (g.score || 0) >= 3000 },
    { id: 'word-search-all',   name: 'Word Hunter',         icon: '🔍', desc: 'Find all words in Bible Word Search',         check: (s, g, id) => id === 'bible-word-search' && g.allWordsFound === true },
  ];

  /* ═══════════════════════════════════
     §4  DAILY CHALLENGE POOL
     ═══════════════════════════════════ */
  const DAILY_CHALLENGES = [
    { game: 'verse-hunt',       title: 'Scripture Seeker',     goal: 'Score 300+ in Verse Hunt',         target: 300, key: 'score' },
    { game: 'scripture-sprint', title: 'Sprint Champion',      goal: 'Score 400+ in Scripture Sprint',   target: 400, key: 'score' },
    { game: 'bible-timeline',   title: 'History Buff',         goal: 'Score 500+ in Bible Timeline',     target: 500, key: 'score' },
    { game: 'fruit-catcher',    title: 'Spirit Catcher',       goal: 'Score 200+ in Fruit Catcher',      target: 200, key: 'score' },
    { game: 'walls-of-jericho', title: 'Jericho\'s Trumpet',   goal: 'Score 1500+ in Walls of Jericho',  target: 1500, key: 'score' },
    { game: 'bible-word-search', title: 'Word Detective',      goal: 'Find all words in Word Search',    target: 1,   key: 'allWordsFound' },
    { game: 'prophecy-match',   title: 'Prophecy Expert',      goal: 'Score 500+ in Prophecy Match',     target: 500, key: 'score' },
    { game: 'ark-builder',      title: 'Ark Architect',        goal: 'Score 200+ in Ark Builder',        target: 200, key: 'score' },
    { game: 'bible-sequence',   title: 'Memory Champion',      goal: 'Reach round 8+ in Sequence',       target: 8,   key: 'score' },
    { game: 'bible-connections', title: 'Connection Finder',    goal: 'Solve Connections with 3+ lives',  target: 3,   key: 'livesLeft' },
    { game: 'verse-hunt',       title: 'Streak Seeker',        goal: 'Get 5+ streak in Verse Hunt',      target: 5,   key: 'streak' },
    { game: 'scripture-sprint', title: 'Combo King',           goal: 'Get 4+ combo in Scripture Sprint',  target: 4,  key: 'streak' },
    { game: 'bible-timeline',   title: 'Perfect Round',        goal: 'Get a perfect round in Timeline',  target: 1,   key: 'perfectRounds' },
    { game: 'fruit-catcher',    title: 'Combo Catcher',        goal: 'Get 5+ combo in Fruit Catcher',    target: 5,   key: 'streak' },
  ];

  /* ═══════════════════════════════════
     §5  STORAGE HELPERS
     ═══════════════════════════════════ */
  function _get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* quota exceeded — fail silently */ }
  }

  /* ═══════════════════════════════════
     §6  SCORE TRACKING
     ═══════════════════════════════════ */
  function getScores() { return _get(SCORES_KEY, {}); }

  function getPersonalBest(gameId) {
    const scores = getScores();
    return scores[gameId] || null;
  }

  /**
   * Save a game result. Returns { isNewBest: bool, previousBest: object|null }
   * @param {string} gameId — game key from GAMES registry
   * @param {object} result — { score, accuracy, streak, level, ... } whatever the game tracks
   */
  function saveScore(gameId, result) {
    const scores = getScores();
    const prev   = scores[gameId] || null;
    const meta   = GAMES[gameId] || {};
    const lowerIsBetter = meta.lowerIsBetter || false;

    let isNewBest = false;
    if (!prev) {
      isNewBest = true;
    } else if (lowerIsBetter) {
      isNewBest = (result.score || 0) < (prev.score || Infinity);
    } else {
      isNewBest = (result.score || 0) > (prev.score || 0);
    }

    if (isNewBest) {
      scores[gameId] = { ...result, date: new Date().toISOString() };
      _set(SCORES_KEY, scores);
    }

    // Update global stats
    _updateStats(gameId, result, isNewBest);

    return { isNewBest, previousBest: prev };
  }

  /* ═══════════════════════════════════
     §7  GLOBAL STATS
     ═══════════════════════════════════ */
  function getStats() {
    return _get(STATS_KEY, {
      totalGamesPlayed: 0,
      uniqueGamesPlayed: 0,
      gamesPlayedSet: [],
      highAccuracyCount: 0,
      pbBeats: 0,
      dailyChallengesCompleted: 0,
    });
  }

  function _updateStats(gameId, result, beatPB) {
    const stats = getStats();
    stats.totalGamesPlayed = (stats.totalGamesPlayed || 0) + 1;

    if (!stats.gamesPlayedSet) stats.gamesPlayedSet = [];
    if (!stats.gamesPlayedSet.includes(gameId)) {
      stats.gamesPlayedSet.push(gameId);
    }
    stats.uniqueGamesPlayed = stats.gamesPlayedSet.length;

    if ((result.accuracy || 0) >= 90) {
      stats.highAccuracyCount = (stats.highAccuracyCount || 0) + 1;
    }

    if (beatPB) {
      stats.pbBeats = (stats.pbBeats || 0) + 1;
    }

    _set(STATS_KEY, stats);
  }

  /* ═══════════════════════════════════
     §8  ACHIEVEMENTS
     ═══════════════════════════════════ */
  function getUnlockedBadges() { return _get(BADGES_KEY, []); }

  /**
   * Check all achievements and return any newly unlocked.
   * @param {string} gameId
   * @param {object} gameResult — { score, accuracy, streak, ... }
   * @returns {Array} newly unlocked badge objects
   */
  function checkAchievements(gameId, gameResult) {
    const stats    = getStats();
    const unlocked = getUnlockedBadges();
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS) {
      if (unlocked.includes(ach.id)) continue;
      try {
        if (ach.check(stats, gameResult, gameId)) {
          unlocked.push(ach.id);
          newlyUnlocked.push(ach);
        }
      } catch { /* skip faulty check */ }
    }

    if (newlyUnlocked.length > 0) {
      _set(BADGES_KEY, unlocked);
      // Show toast notifications
      newlyUnlocked.forEach((ach, i) => {
        setTimeout(() => _showAchievementToast(ach), i * 1200);
      });
    }

    return newlyUnlocked;
  }

  /* ═══════════════════════════════════
     §9  DAILY CHALLENGES
     ═══════════════════════════════════ */
  function getDailyChallenge() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const idx = dayOfYear % DAILY_CHALLENGES.length;
    return { ...DAILY_CHALLENGES[idx], dateKey: today.toISOString().split('T')[0] };
  }

  function isDailyChallengeCompleted() {
    const daily = _get(DAILY_KEY, {});
    const challenge = getDailyChallenge();
    return daily[challenge.dateKey] === true;
  }

  function completeDailyChallenge() {
    const daily = _get(DAILY_KEY, {});
    const challenge = getDailyChallenge();
    if (!daily[challenge.dateKey]) {
      daily[challenge.dateKey] = true;
      _set(DAILY_KEY, daily);
      const stats = getStats();
      stats.dailyChallengesCompleted = (stats.dailyChallengesCompleted || 0) + 1;
      _set(STATS_KEY, stats);
    }
  }

  /**
   * Check if a game result satisfies today's daily challenge
   * @param {string} gameId
   * @param {object} result
   * @returns {boolean}
   */
  function checkDailyChallenge(gameId, result) {
    const challenge = getDailyChallenge();
    if (challenge.game !== gameId) return false;
    if (isDailyChallengeCompleted()) return false;
    const val = result[challenge.key] || 0;
    if (val >= challenge.target) {
      completeDailyChallenge();
      _showDailyChallengeToast(challenge);
      return true;
    }
    return false;
  }

  /* ═══════════════════════════════════
     §10  UI: PERSONAL BEST BANNER
     ═══════════════════════════════════ */
  /**
   * Inject a personal-best banner into the end screen.
   * @param {string} gameId
   * @param {HTMLElement} container — element to prepend the banner into
   * @param {object} currentResult — the result from the game just played
   */
  function showPersonalBest(gameId, container, currentResult) {
    if (!container) return;
    const scores = getScores();
    const pb     = scores[gameId];
    const meta   = GAMES[gameId] || {};

    // Remove any existing banner
    const existing = container.querySelector('.nbtt-pb-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.className = 'nbtt-pb-banner';

    if (currentResult && currentResult._beatPB) {
      banner.innerHTML = `
        <div class="nbtt-pb-new">
          <span class="nbtt-pb-icon">🏆</span>
          <div>
            <div class="nbtt-pb-title">NEW PERSONAL BEST!</div>
            <div class="nbtt-pb-score">${meta.scoreLabel || 'Score'}: ${currentResult.score}</div>
          </div>
        </div>`;
    } else if (pb) {
      banner.innerHTML = `
        <div class="nbtt-pb-existing">
          <span class="nbtt-pb-icon">📊</span>
          <div>
            <div class="nbtt-pb-title">Personal Best</div>
            <div class="nbtt-pb-score">${meta.scoreLabel || 'Score'}: ${pb.score}</div>
          </div>
        </div>`;
    }

    if (banner.innerHTML) {
      container.prepend(banner);
    }
  }

  /* ═══════════════════════════════════
     §11  UI: DAILY CHALLENGE BANNER
     ═══════════════════════════════════ */
  /**
   * Show a daily challenge banner at the top of a game page (before play starts).
   * @param {string} gameId — the current game's ID
   * @param {HTMLElement} container — element to prepend the banner into (optional, defaults to body)
   */
  function showDailyChallengeBanner(gameId, container) {
    const challenge = getDailyChallenge();
    if (challenge.game !== gameId) return;
    if (isDailyChallengeCompleted()) return;

    const target = container || document.body;
    const banner = document.createElement('div');
    banner.className = 'nbtt-daily-banner';
    banner.innerHTML = `
      <div class="nbtt-daily-inner">
        <span class="nbtt-daily-icon">📅</span>
        <div>
          <div class="nbtt-daily-title">Daily Challenge: ${challenge.title}</div>
          <div class="nbtt-daily-goal">${challenge.goal}</div>
        </div>
      </div>`;
    target.prepend(banner);
  }

  /* ═══════════════════════════════════
     §12  UI: ACHIEVEMENT TOAST
     ═══════════════════════════════════ */
  function _showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.className = 'nbtt-ach-toast';
    toast.innerHTML = `
      <div class="nbtt-ach-inner">
        <span class="nbtt-ach-icon">${ach.icon}</span>
        <div>
          <div class="nbtt-ach-label">Achievement Unlocked!</div>
          <div class="nbtt-ach-name">${ach.name}</div>
          <div class="nbtt-ach-desc">${ach.desc}</div>
        </div>
      </div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('nbtt-ach-show'));
    setTimeout(() => {
      toast.classList.remove('nbtt-ach-show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  function _showDailyChallengeToast(challenge) {
    const toast = document.createElement('div');
    toast.className = 'nbtt-ach-toast nbtt-daily-toast';
    toast.innerHTML = `
      <div class="nbtt-ach-inner">
        <span class="nbtt-ach-icon">📅</span>
        <div>
          <div class="nbtt-ach-label">Daily Challenge Complete!</div>
          <div class="nbtt-ach-name">${challenge.title}</div>
          <div class="nbtt-ach-desc">${challenge.goal}</div>
        </div>
      </div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('nbtt-ach-show'));
    setTimeout(() => {
      toast.classList.remove('nbtt-ach-show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ═══════════════════════════════════
     §13  UI: ACHIEVEMENTS PANEL
     ═══════════════════════════════════ */
  /**
   * Render a full achievements grid into a container.
   * Useful for an achievements page or modal.
   * @param {HTMLElement} container
   */
  function renderAchievementsPanel(container) {
    if (!container) return;
    const unlocked = getUnlockedBadges();
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'nbtt-ach-grid';

    for (const ach of ACHIEVEMENTS) {
      const is = unlocked.includes(ach.id);
      const card = document.createElement('div');
      card.className = 'nbtt-ach-card' + (is ? ' nbtt-ach-unlocked' : '');
      card.innerHTML = `
        <div class="nbtt-ach-card-icon">${is ? ach.icon : '🔒'}</div>
        <div class="nbtt-ach-card-name">${ach.name}</div>
        <div class="nbtt-ach-card-desc">${ach.desc}</div>`;
      grid.appendChild(card);
    }

    container.appendChild(grid);
  }

  /* ═══════════════════════════════════
     §14  INJECT GLOBAL STYLES
     ═══════════════════════════════════ */
  function _injectStyles() {
    if (document.getElementById('nbtt-gamification-css')) return;
    const style = document.createElement('style');
    style.id = 'nbtt-gamification-css';
    style.textContent = `
      /* ── Achievement Toast ── */
      .nbtt-ach-toast {
        position: fixed;
        top: 20px;
        right: -400px;
        z-index: 99999;
        background: linear-gradient(135deg, #1a1a3a, #12122a);
        border: 1px solid rgba(168,85,247,0.3);
        border-radius: 14px;
        padding: 16px 20px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.15);
        transition: right 0.4s cubic-bezier(.4,0,.2,1);
        max-width: 340px;
        font-family: 'Poppins', sans-serif;
      }
      .nbtt-ach-toast.nbtt-ach-show { right: 20px; }
      .nbtt-daily-toast { border-color: rgba(255,159,67,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(255,159,67,0.15); }
      .nbtt-ach-inner { display: flex; align-items: flex-start; gap: 12px; }
      .nbtt-ach-icon { font-size: 2rem; line-height: 1; flex-shrink: 0; }
      .nbtt-ach-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #a78bfa; margin-bottom: 2px; }
      .nbtt-daily-toast .nbtt-ach-label { color: #ff9f43; }
      .nbtt-ach-name { font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
      .nbtt-ach-desc { font-size: 0.78rem; color: rgba(255,255,255,0.5); line-height: 1.4; }

      /* ── Personal Best Banner ── */
      .nbtt-pb-banner { margin-bottom: 16px; animation: nbttPBPop 0.5s ease; }
      .nbtt-pb-new, .nbtt-pb-existing { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 12px; font-family: 'Poppins', sans-serif; }
      .nbtt-pb-new { background: linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,159,67,0.1)); border: 1px solid rgba(255,215,0,0.3); }
      .nbtt-pb-existing { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
      .nbtt-pb-icon { font-size: 1.8rem; flex-shrink: 0; }
      .nbtt-pb-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffd700; margin-bottom: 2px; }
      .nbtt-pb-existing .nbtt-pb-title { color: rgba(255,255,255,0.5); }
      .nbtt-pb-score { font-size: 1.1rem; font-weight: 700; color: #fff; }
      @keyframes nbttPBPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

      /* ── Daily Challenge Banner ── */
      .nbtt-daily-banner { margin: 0 0 12px; animation: nbttSlideDown 0.4s ease; }
      .nbtt-daily-inner { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-radius: 12px; background: linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,159,67,0.05)); border: 1px solid rgba(255,107,53,0.25); font-family: 'Poppins', sans-serif; }
      .nbtt-daily-icon { font-size: 1.6rem; flex-shrink: 0; }
      .nbtt-daily-title { font-size: 0.85rem; font-weight: 700; color: #ff9f43; }
      .nbtt-daily-goal { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
      @keyframes nbttSlideDown { 0% { transform: translateY(-20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

      /* ── Achievements Grid ── */
      .nbtt-ach-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
      .nbtt-ach-card { padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); text-align: center; opacity: 0.4; font-family: 'Poppins', sans-serif; transition: all 0.3s; }
      .nbtt-ach-card.nbtt-ach-unlocked { opacity: 1; border-color: rgba(168,85,247,0.25); background: rgba(168,85,247,0.06); }
      .nbtt-ach-card-icon { font-size: 2rem; margin-bottom: 6px; }
      .nbtt-ach-card-name { font-size: 0.82rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
      .nbtt-ach-card-desc { font-size: 0.7rem; color: rgba(255,255,255,0.4); line-height: 1.4; }
    `;
    document.head.appendChild(style);
  }

  // Inject styles on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _injectStyles);
  } else {
    _injectStyles();
  }

  /* ═══════════════════════════════════
     §15  PUBLIC API
     ═══════════════════════════════════ */
  return {
    // Core
    saveScore,
    getPersonalBest,
    getScores,
    getStats,

    // Achievements
    checkAchievements,
    getUnlockedBadges,
    renderAchievementsPanel,
    ACHIEVEMENTS,

    // Daily Challenges
    getDailyChallenge,
    isDailyChallengeCompleted,
    checkDailyChallenge,
    showDailyChallengeBanner,

    // UI
    showPersonalBest,

    // Registry
    GAMES,
  };
})();
