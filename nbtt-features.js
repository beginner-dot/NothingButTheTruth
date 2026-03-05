/* ═══════════════════════════════════════════════════════════
   nbtt-features.js — Dark/Light Toggle, Search, Bookmarks,
   Reading Progress Tracker
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const BRAND_TEXT = "NothingButTheTRUTH";
  const BRAND_SUFFIX_RE = /\s[—-]\sNothingButTheTruth|\s[—-]\sNothingButTheTRUTH/g;

  /* ──────────────────────────────────────────────────────────
     1. DARK / LIGHT MODE TOGGLE
     ────────────────────────────────────────────────────────── */
  const THEME_KEY = "nbtt_theme";

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(THEME_KEY);
      return value === "light" || value === "dark" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      // ignore storage failures (private mode / blocked storage)
    }
  }

  function applyTheme(theme) {
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.setAttribute("data-theme", theme);
    document.body.classList.toggle("light-mode", theme === "light");
    document.body.classList.toggle("dark-mode", theme !== "light");
    persistTheme(theme);
    const icon = document.querySelector("#themeToggleBtn i");
    if (icon) {
      icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
    }
    const label = document.querySelector("#themeToggleBtn .theme-label");
    if (label) label.textContent = theme === "light" ? "Dark" : "Light";
    setTimeout(function () {
      document.documentElement.classList.remove("theme-transitioning");
    }, 220);
  }

  function initThemeToggle() {
    const saved = getStoredTheme();
    const theme = saved || "dark";
    applyTheme(theme);

    const btn = document.getElementById("themeToggleBtn");
    if (btn) {
      btn.addEventListener("click", function () {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  }

  /* ──────────────────────────────────────────────────────────
     2. SEARCH BAR
     ────────────────────────────────────────────────────────── */
  const SEARCH_INDEX = [
    // Studies
    { title: "A Tale of Two Cities", url: "Studies/a_tale_of_cities.html", type: "Study", keywords: "tale cities babylon jerusalem revelation" },
    { title: "Are Angels Real?", url: "Studies/are_angels_real.html", type: "Study", keywords: "angels heaven supernatural beings" },
    { title: "Armor of God", url: "Studies/armor.html", type: "Study", keywords: "armor ephesians spiritual warfare protection" },
    { title: "Armor of God (Expanded)", url: "Studies/armor-expanded.html", type: "Study", keywords: "armor ephesians warfare detailed" },
    { title: "Christ the Savior", url: "Studies/christ_the_savior.html", type: "Study", keywords: "christ savior jesus salvation cross" },
    { title: "Exodus Sinai Law of Love", url: "Studies/exodus_sinai_law_of_love.html", type: "Study", keywords: "exodus sinai commandments law love moses" },
    { title: "Facts or Fiction", url: "Studies/facts_or_fiction.html", type: "Study", keywords: "facts fiction evidence proof bible" },
    { title: "God Has a Purpose Each Time He Communicates", url: "Studies/God_has_a_purpose_each_time_He_communicates.html", type: "Study", keywords: "communication purpose god speaks" },
    { title: "History of Christian Faith", url: "Studies/history_of_christian_faith.html", type: "Study", keywords: "history christian faith church" },
    { title: "Jesus Is Real", url: "Studies/jesus_is_real.html", type: "Study", keywords: "jesus real evidence historical proof" },
    { title: "Meaning & History of Baptism", url: "Studies/meaning_and_history_of_baptism.html", type: "Study", keywords: "baptism water history meaning" },
    { title: "Preparing People to Meet God (Part 1)", url: "Studies/preparing_people_to_meet_God_pt_1.html", type: "Study", keywords: "preparing meet god prophecy part one" },
    { title: "Preparing People to Meet God (Part 2)", url: "Studies/preparing_people_to_meet_God_pt_2.html", type: "Study", keywords: "preparing meet god prophecy part two" },
    { title: "Preparing People to Meet God (Part 3)", url: "Studies/preparing_people_to_meet_God_pt_3.html", type: "Study", keywords: "preparing meet god prophecy part three" },
    { title: "Satan the Accuser, Christ the Defender", url: "Studies/satan_the_accuser_christ_the_defender.html", type: "Study", keywords: "satan devil accuser christ defender judgment" },
    // Devotions
    { title: "A Tale of Cities (Devotion)", url: "Devotions/a_tale_of_cities.html", type: "Devotion", keywords: "cities devotion babylon jerusalem" },
    { title: "Anchor of Hope", url: "Devotions/anchor_of_hope.html", type: "Devotion", keywords: "anchor hope hebrews steadfast" },
    { title: "Called to Shine", url: "Devotions/called_to_shine.html", type: "Devotion", keywords: "called shine light world matthew" },
    { title: "Danger of Not Keeping the Commandments", url: "Devotions/danger_of_not_keeping_the_commandments.html", type: "Devotion", keywords: "commandments danger disobedience" },
    { title: "Do It for God", url: "Devotions/Do_it_for_God.html", type: "Devotion", keywords: "do it god service colossians" },
    { title: "Faith Under Fire", url: "Devotions/faith_under_fire.html", type: "Devotion", keywords: "faith fire trial testing" },
    { title: "Final Invitation", url: "Devotions/final_invitation.html", type: "Devotion", keywords: "invitation revelation come water life" },
    { title: "Hannah's Devotion", url: "Devotions/hannahs_devotion.html", type: "Devotion", keywords: "hannah prayer samuel mother" },
    { title: "How the Commandments Connect Us with God", url: "Devotions/how_the_ten_commandments_connect_us_with_god.html", type: "Devotion", keywords: "commandments connect god relationship" },
    { title: "Importance of Commandments", url: "Devotions/importance_and_relevance_of_commandments.html", type: "Devotion", keywords: "importance relevance commandments today" },
    { title: "Love That Saves", url: "Devotions/love_that_saves.html", type: "Devotion", keywords: "love saves john 3:16 redemption" },
    { title: "Take Up The Cross", url: "Devotions/Take_up_The_Cross.html", type: "Devotion", keywords: "cross deny self follow jesus" },
    { title: "The Mustard Seed", url: "Devotions/the_mustard_seed.html", type: "Devotion", keywords: "mustard seed faith small kingdom" },
    { title: "The Power of the Cross", url: "Devotions/the_power_of_the_cross.html", type: "Devotion", keywords: "power cross salvation atonement" },
    { title: "Unshackled by Grace", url: "Devotions/unshackled_by_grace.html", type: "Devotion", keywords: "unshackled grace freedom chains" },
    { title: "Walking in the Light", url: "Devotions/walking_in_the_light.html", type: "Devotion", keywords: "walking light john darkness" },
    // Pages
    { title: "All Studies", url: "all-studies.html", type: "Page", keywords: "studies list all browse" },
    { title: "All Games", url: "all-games.html", type: "Page", keywords: "games list all browse play" },
    { title: "All Videos", url: "all-videos.html", type: "Page", keywords: "videos list all watch" },
    { title: "MythBusters", url: "mythbusters.html", type: "Page", keywords: "myths busters facts fiction debunk" },
    { title: "The Ten Commandments", url: "the-ten-commandments.html", type: "Page", keywords: "ten commandments exodus 20 law" },
    { title: "About Us", url: "about-us.html", type: "Page", keywords: "about us team mission" },
    { title: "Video on Demand", url: "vod.html", type: "Page", keywords: "video demand vod watch stream" },
    // Games
    { title: "Ark Builder", url: "games/ark-builder/index.html", type: "Game", keywords: "ark builder noah flood animals" },
    { title: "Bible Bingo", url: "games/bible-bingo/index.html", type: "Game", keywords: "bible bingo trivia" },
    { title: "Bible Connections", url: "games/bible-connections/index.html", type: "Game", keywords: "connections groups categories puzzle" },
    { title: "Bible Memory Match", url: "games/bible-memory-match/index.html", type: "Game", keywords: "memory match cards pairs" },
    { title: "Bible Sequence", url: "games/bible-sequence/index.html", type: "Game", keywords: "sequence order timeline arrange" },
    { title: "Bible Taboo", url: "games/Bible-taboo/index.html", type: "Game", keywords: "taboo words clue forbidden" },
    { title: "Bible Timeline", url: "games/bible-timeline/index.html", type: "Game", keywords: "timeline chronological events history" },
    { title: "Bible Word Search", url: "games/bible-word-search/index.html", type: "Game", keywords: "word search grid find letters" },
    { title: "Fruit Catcher", url: "games/fruit-catcher/index.html", type: "Game", keywords: "fruit catcher spirit galatians" },
    { title: "Prophecy Match", url: "games/prophecy-match/index.html", type: "Game", keywords: "prophecy match old new testament fulfillment" },
    { title: "Relay Race", url: "games/relay-race/index.html", type: "Game", keywords: "relay race trivia speed quiz" },
    { title: "Scripture Sprint", url: "games/scripture-sprint/index.html", type: "Game", keywords: "scripture sprint typing speed verse" },
    { title: "Verse Hunt Live", url: "games/verse-hunt-live/index.html", type: "Game", keywords: "verse hunt find bible quiz" },
    { title: "Walls of Jericho", url: "games/walls-of-jericho/index.html", type: "Game", keywords: "walls jericho march trumpet" },
    { title: "Who Said It?", url: "games/Who-said-it/index.html", type: "Game", keywords: "who said it quotes bible characters" },
    { title: "Game Leaderboard", url: "games/leaderboard.html", type: "Game", keywords: "leaderboard scores achievements stats" },
  ];

  function initSearch() {
    const overlay = document.getElementById("searchOverlay");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const openBtns = document.querySelectorAll(".search-trigger");
    const closeBtn = document.getElementById("searchCloseBtn");
    if (!overlay || !input || !results) return;

    function openSearch() {
      overlay.classList.add("active");
      overlay.setAttribute("aria-hidden", "false");
      setTimeout(() => input.focus(), 100);
    }
    function closeSearch() {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
      input.value = "";
      results.innerHTML = "";
    }

    openBtns.forEach(function (btn) { btn.addEventListener("click", openSearch); });
    if (closeBtn) closeBtn.addEventListener("click", closeSearch);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
      if (e.key === "Escape" && overlay.classList.contains("active")) closeSearch();
    });

    const typeColors = {
      Study: { bg: "#a855f7", fg: "#ffffff" },
      Devotion: { bg: "#b45309", fg: "#ffffff" },
      Page: { bg: "#3b82f6", fg: "#ffffff" },
      Game: { bg: "#047857", fg: "#ffffff" }
    };

    input.addEventListener("input", function () {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { results.innerHTML = '<p class="search-hint">Type at least 2 characters…</p>'; return; }

      const matches = SEARCH_INDEX.filter(function (item) {
        return item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
      });

      if (matches.length === 0) {
        results.innerHTML = '<p class="search-no-results">No results for "' + q + '"</p>';
        return;
      }

      results.innerHTML = matches.slice(0, 12).map(function (m) {
        var badge = typeColors[m.type] || { bg: "#6b7280", fg: "#ffffff" };
        return '<a href="' + m.url + '" class="search-result-item">' +
          '<span class="search-result-type" style="background:' + badge.bg + ';color:' + badge.fg + '">' + m.type + '</span>' +
          '<span class="search-result-title">' + m.title + '</span>' +
          '</a>';
      }).join("");
    });
  }

  /* ──────────────────────────────────────────────────────────
     3. BOOKMARK SYSTEM
     ────────────────────────────────────────────────────────── */
  const BM_KEY = "nbtt_bookmarks";

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(BM_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBookmarks(arr) { localStorage.setItem(BM_KEY, JSON.stringify(arr)); }

  function addBookmark(title, url) {
    var bm = getBookmarks();
    if (bm.find(function (b) { return b.url === url; })) return false; // already bookmarked
    bm.unshift({ title: title, url: url, date: new Date().toISOString() });
    saveBookmarks(bm);
    return true;
  }
  function removeBookmark(url) {
    var bm = getBookmarks().filter(function (b) { return b.url !== url; });
    saveBookmarks(bm);
  }
  function isBookmarked(url) {
    return getBookmarks().some(function (b) { return b.url === url; });
  }

  function initBookmarks() {
    // Floating bookmark button on content pages (studies, devotions)
    var path = window.location.pathname;
    var isContent = path.includes("/Studies/") || path.includes("/Devotions/") || path.includes("/studies/") || path.includes("/devotions/");
    if (isContent) {
      var title = document.title.replace(BRAND_SUFFIX_RE, "").trim();
      var url = path;
      var btn = document.createElement("button");
      btn.className = "nbtt-bookmark-fab" + (isBookmarked(url) ? " bookmarked" : "");
      btn.setAttribute("aria-label", "Bookmark this page");
      btn.innerHTML = '<i class="fas fa-bookmark"></i>';
      btn.addEventListener("click", function () {
        if (isBookmarked(url)) {
          removeBookmark(url);
          btn.classList.remove("bookmarked");
        } else {
          addBookmark(title, url);
          btn.classList.add("bookmarked");
        }
        renderBookmarkPanel();
      });
      document.body.appendChild(btn);
    }

    // Sidebar bookmarks panel
    var sidebarLink = document.getElementById("sidebarMyVerses");
    if (sidebarLink) {
      sidebarLink.addEventListener("click", function (e) {
        e.preventDefault();
        toggleBookmarkPanel();
      });
    }
  }

  function toggleBookmarkPanel() {
    var existing = document.getElementById("nbttBookmarkPanel");
    if (existing) { existing.remove(); return; }

    var panel = document.createElement("div");
    panel.id = "nbttBookmarkPanel";
    panel.className = "nbtt-panel";
    panel.innerHTML = '<div class="nbtt-panel-header"><h3><i class="fas fa-bookmark"></i> My Bookmarks</h3><button class="nbtt-panel-close" aria-label="Close">&times;</button></div><div class="nbtt-panel-body" id="bmPanelBody"></div>';
    document.body.appendChild(panel);
    requestAnimationFrame(function () { panel.classList.add("open"); });

    panel.querySelector(".nbtt-panel-close").addEventListener("click", function () {
      panel.classList.remove("open");
      setTimeout(function () { panel.remove(); }, 300);
    });

    renderBookmarkPanel();
  }

  function renderBookmarkPanel() {
    var body = document.getElementById("bmPanelBody");
    if (!body) return;
    var bm = getBookmarks();
    if (bm.length === 0) {
      body.innerHTML = '<p class="nbtt-panel-empty">No bookmarks yet. Visit a study or devotion and tap the bookmark icon.</p>';
      return;
    }
    body.innerHTML = bm.map(function (b) {
      return '<div class="nbtt-bm-item"><a href="' + b.url + '">' + b.title + '</a><button class="nbtt-bm-remove" data-url="' + b.url + '" aria-label="Remove">&times;</button></div>';
    }).join("");
    body.querySelectorAll(".nbtt-bm-remove").forEach(function (btn) {
      btn.addEventListener("click", function () {
        removeBookmark(btn.dataset.url);
        renderBookmarkPanel();
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     4. READING PROGRESS TRACKER
     ────────────────────────────────────────────────────────── */
  const RP_KEY = "nbtt_reading_progress";

  function getReadingProgress() {
    try { return JSON.parse(localStorage.getItem(RP_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveReadingProgress(obj) { localStorage.setItem(RP_KEY, JSON.stringify(obj)); }

  function initReadingProgress() {
    var path = window.location.pathname;
    var isContent = path.includes("/Studies/") || path.includes("/Devotions/") || path.includes("/studies/") || path.includes("/devotions/");

    if (isContent) {
      // Track scroll progress on content pages
      var maxScroll = 0;
      function updateProgress() {
        var scrolled = window.scrollY;
        var total = document.documentElement.scrollHeight - window.innerHeight;
        if (total <= 0) return;
        var pct = Math.min(100, Math.round((scrolled / total) * 100));
        if (pct > maxScroll) {
          maxScroll = pct;
          var progress = getReadingProgress();
          progress[path] = { percent: maxScroll, title: document.title.replace(BRAND_SUFFIX_RE, "").trim(), lastRead: new Date().toISOString() };
          saveReadingProgress(progress);
        }
        // Update floating progress bar
        var bar = document.getElementById("nbttReadingBar");
        if (bar) bar.style.width = pct + "%";
      }

      // Create reading progress bar
      var bar = document.createElement("div");
      bar.className = "nbtt-reading-bar-track";
      bar.innerHTML = '<div class="nbtt-reading-bar-fill" id="nbttReadingBar"></div>';
      document.body.appendChild(bar);

      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }

    // Sidebar progress panel
    var progressLink = document.getElementById("sidebarMyProgress");
    if (progressLink) {
      progressLink.addEventListener("click", function (e) {
        e.preventDefault();
        toggleProgressPanel();
      });
    }
  }

  function toggleProgressPanel() {
    var existing = document.getElementById("nbttProgressPanel");
    if (existing) { existing.remove(); return; }

    var panel = document.createElement("div");
    panel.id = "nbttProgressPanel";
    panel.className = "nbtt-panel";
    panel.innerHTML = '<div class="nbtt-panel-header"><h3><i class="fas fa-chart-line"></i> Reading Progress</h3><button class="nbtt-panel-close" aria-label="Close">&times;</button></div><div class="nbtt-panel-body" id="rpPanelBody"></div>';
    document.body.appendChild(panel);
    requestAnimationFrame(function () { panel.classList.add("open"); });

    panel.querySelector(".nbtt-panel-close").addEventListener("click", function () {
      panel.classList.remove("open");
      setTimeout(function () { panel.remove(); }, 300);
    });

    renderProgressPanel();
  }

  function renderProgressPanel() {
    var body = document.getElementById("rpPanelBody");
    if (!body) return;
    var progress = getReadingProgress();
    var entries = Object.entries(progress).sort(function (a, b) {
      return new Date(b[1].lastRead) - new Date(a[1].lastRead);
    });

    if (entries.length === 0) {
      body.innerHTML = '<p class="nbtt-panel-empty">No reading progress yet. Start reading a study or devotion!</p>';
      return;
    }

    // Summary
    var total = entries.length;
    var completed = entries.filter(function (e) { return e[1].percent >= 90; }).length;
    var avgPct = Math.round(entries.reduce(function (sum, e) { return sum + e[1].percent; }, 0) / total);

    body.innerHTML =
      '<div class="nbtt-rp-summary">' +
        '<div class="nbtt-rp-stat"><span class="nbtt-rp-num">' + completed + '</span><span class="nbtt-rp-lbl">Completed</span></div>' +
        '<div class="nbtt-rp-stat"><span class="nbtt-rp-num">' + (total - completed) + '</span><span class="nbtt-rp-lbl">In Progress</span></div>' +
        '<div class="nbtt-rp-stat"><span class="nbtt-rp-num">' + avgPct + '%</span><span class="nbtt-rp-lbl">Avg Progress</span></div>' +
      '</div>' +
      entries.map(function (e) {
        var url = e[0], data = e[1];
        var pctColor = data.percent >= 90 ? "#10b981" : data.percent >= 50 ? "#f59e0b" : "#ef4444";
        return '<div class="nbtt-rp-item">' +
          '<a href="' + url + '">' + data.title + '</a>' +
          '<div class="nbtt-rp-bar-track"><div class="nbtt-rp-bar-fill" style="width:' + data.percent + '%;background:' + pctColor + '"></div></div>' +
          '<span class="nbtt-rp-pct">' + data.percent + '%</span>' +
        '</div>';
      }).join("");
  }

  /* ──────────────────────────────────────────────────────────
     INIT — on DOMContentLoaded
     ────────────────────────────────────────────────────────── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    document.querySelectorAll(".logo, .WebsiteName").forEach(function (el) {
      if ((el.textContent || "").trim() === "NothingButTheTruth") {
        el.textContent = BRAND_TEXT;
      }
    });
    initThemeToggle();
    initSearch();
    initBookmarks();
    initReadingProgress();
  }
})();
