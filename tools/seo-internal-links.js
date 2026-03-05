/**
 * seo-internal-links.js
 * ---------------------
 * Injects contextual internal links into every Study, Devotion, and Game page:
 *   1. Breadcrumb nav (Home > Studies > Page Title)
 *   2. "Continue Exploring" related-content section with topic-aware suggestions
 *   3. Mini site-wide footer with hub links
 *
 * Run:  node tools/seo-internal-links.js
 */

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://nothingbutthetruth.web.app';
const BRAND = 'NothingButTheTRUTH';

/* ──────────────────────────────────────────────
   CONTENT REGISTRY — every linkable page
   ────────────────────────────────────────────── */

const STUDIES = [
  { file: 'Studies/facts_or_fiction.html',                            title: 'Is the Bible Facts or Fiction?',          tags: ['bible','evidence','reliability'] },
  { file: 'Studies/history_of_christian_faith.html',                  title: 'History of the Christian Faith',           tags: ['history','church','faith'] },
  { file: 'Studies/exodus_sinai_law_of_love.html',                    title: 'Exodus to Sinai: The Law of Love',        tags: ['law','commandments','covenant','moses'] },
  { file: 'Studies/meaning_and_history_of_baptism.html',              title: 'Meaning & History of Baptism',             tags: ['baptism','salvation','symbol'] },
  { file: 'Studies/are_angels_real.html',                             title: 'Are Angels Real?',                         tags: ['angels','heaven','supernatural'] },
  { file: 'Studies/armor-expanded.html',                              title: 'The Armor of God',                         tags: ['armor','spiritual warfare','faith'] },
  { file: 'Studies/armor.html',                                       title: 'Armor of God Devotional',                  tags: ['armor','spiritual warfare','faith'] },
  { file: 'Studies/the_nature_of_sin_and_gods_law.html',              title: "The Nature of Sin and God's Law",          tags: ['sin','law','lucifer','fall'] },
  { file: 'Studies/christ_the_savior.html',                           title: 'Christ the Savior',                        tags: ['jesus','salvation','grace'] },
  { file: 'Studies/jesus_is_real.html',                               title: 'Jesus Is Real',                            tags: ['jesus','evidence','history'] },
  { file: 'Studies/the_childhood_of_jesus_christ.html',               title: 'The Childhood of Jesus Christ',            tags: ['jesus','childhood','gospel'] },
  { file: 'Studies/the_lamb_of_god.html',                             title: 'Jesus Christ: The Lamb of God',            tags: ['jesus','sacrifice','atonement'] },
  { file: 'Studies/the_lords_supper.html',                            title: "The Lord's Supper",                        tags: ['jesus','communion','sacrament'] },
  { file: 'Studies/the_word_made_flesh.html',                         title: 'God "The Word" Made Flesh',                tags: ['jesus','incarnation','john'] },
  { file: 'Studies/where_is_jesus_right_now.html',                    title: 'Where Is Jesus Right Now?',                tags: ['jesus','heaven','intercession'] },
  { file: 'Studies/satan_the_accuser_christ_the_defender.html',       title: 'Satan the Accuser, Christ the Defender',   tags: ['satan','jesus','judgment','salvation'] },
  { file: 'Studies/preparing_people_to_meet_God_pt_1.html',           title: 'Preparing People to Meet God – Part 1',    tags: ['prophecy','preparation','endtimes'] },
  { file: 'Studies/preparing_people_to_meet_God_pt_2.html',           title: 'Preparing People to Meet God – Part 2',    tags: ['prophecy','preparation','endtimes'] },
  { file: 'Studies/preparing_people_to_meet_God_pt_3.html',           title: 'Preparing People to Meet God – Part 3',    tags: ['prophecy','preparation','endtimes'] },
  { file: 'Studies/why_the_bible_is_expanded.html',                   title: "Is the Bible God's Word to Humanity?",     tags: ['bible','evidence','reliability'] },
  { file: "Studies/why_the_bible_is_God's_word.html",                 title: "Why the Bible is God's Word",              tags: ['bible','evidence','reliability'] },
  { file: 'Studies/God_has_a_purpose_each_time_He_communicates.html', title: 'God Has a Purpose Each Time He Communicates', tags: ['bible','purpose','communication'] },
  { file: 'Studies/a_tale_of_cities.html',                            title: 'A Tale of Cities (Study)',                 tags: ['prophecy','cities','history'] },
];

const DEVOTIONS = [
  { file: 'Devotions/anchor_of_hope.html',                                    title: 'Anchor of Hope',                               tags: ['hope','faith','encouragement'] },
  { file: 'Devotions/a_tale_of_cities.html',                                  title: 'A Tale of Cities (Devotion)',                   tags: ['prophecy','cities','history'] },
  { file: 'Devotions/called_to_shine.html',                                   title: 'Called to Shine',                               tags: ['light','witness','faith'] },
  { file: 'Devotions/Do_it_for_God.html',                                     title: 'Faithful in All Things',                        tags: ['faithfulness','service','obedience'] },
  { file: 'Devotions/faith_under_fire.html',                                  title: 'Faith Under Fire',                              tags: ['faith','persecution','courage'] },
  { file: 'Devotions/final_invitation.html',                                  title: 'The Final Invitation',                          tags: ['salvation','endtimes','grace'] },
  { file: 'Devotions/hannahs_devotion.html',                                  title: "Hannah's Devotion",                             tags: ['prayer','faith','motherhood'] },
  { file: 'Devotions/importance_and_relevance_of_commandments.html',           title: 'Importance & Relevance of the Commandments',    tags: ['commandments','law','obedience'] },
  { file: 'Devotions/how_the_ten_commandments_connect_us_with_god.html',       title: 'How the Ten Commandments Connect Us with God',  tags: ['commandments','law','relationship'] },
  { file: 'Devotions/danger_of_not_keeping_the_commandments.html',             title: 'The Danger of Not Keeping the Commandments',    tags: ['commandments','law','warning'] },
  { file: 'Devotions/love_that_saves.html',                                   title: 'Love That Saves',                               tags: ['love','salvation','grace'] },
  { file: 'Devotions/Take_up_The_Cross.html',                                 title: 'Rise, Take Up Your Cross',                      tags: ['discipleship','sacrifice','jesus'] },
  { file: 'Devotions/the_mustard_seed.html',                                  title: 'The Mustard Seed',                              tags: ['faith','parable','growth'] },
  { file: 'Devotions/the_power_of_the_cross.html',                            title: 'The Power of the Cross',                        tags: ['cross','salvation','grace'] },
  { file: 'Devotions/unshackled_by_grace.html',                               title: 'Unshackled by Grace',                           tags: ['grace','freedom','salvation'] },
  { file: 'Devotions/walking_in_the_light.html',                              title: 'Walking in the Light',                          tags: ['light','holiness','faith'] },
];

const GAMES = [
  { file: 'games/verse-hunt-live/index.html',                   title: 'Verse Hunt',              tags: ['verses','speed'] },
  { file: 'games/Who-said-it/who-said/index.html',               title: 'Who Said It?',            tags: ['quotes','characters'] },
  { file: 'games/relay-race/index.html',                        title: 'Bible Relay Race',        tags: ['team','speed'] },
  { file: 'games/bible-bingo/BibleBingoScriptureSprint/index.html', title: 'Bible Bingo',             tags: ['team','verses'] },
  { file: 'games/Bible-taboo/index.html',                     title: 'Bible GridLock',          tags: ['puzzle','knowledge'] },
  { file: 'games/scripture-sprint/index.html',                      title: 'Scripture Sprint',        tags: ['verses','speed'] },
  { file: 'games/bible-timeline/index.html',                        title: 'Bible Timeline Master',   tags: ['history','order'] },
  { file: 'games/bible-connections/index.html',                     title: 'Bible Connections',       tags: ['puzzle','knowledge'] },
  { file: 'games/prophecy-match/index.html',                        title: 'Prophecy Fulfilled',      tags: ['prophecy','matching'] },
  { file: 'games/bible-memory-match/index.html',                    title: 'Bible Memory Match',      tags: ['memory','pairs'] },
  { file: 'games/bible-sequence/index.html',                        title: 'Bible Sequence Recall',   tags: ['memory','pattern'] },
  { file: 'games/walls-of-jericho/index.html',                      title: 'Walls of Jericho',        tags: ['action','history'] },
  { file: 'games/fruit-catcher/index.html',                         title: 'Fruit of the Spirit',     tags: ['action','spirit'] },
  { file: 'games/bible-word-search/index.html',                     title: 'Bible Word Search',       tags: ['puzzle','words'] },
  { file: 'games/ark-builder/index.html',                           title: 'Ark Builder',             tags: ['action','history'] },
];

const ALL_CONTENT = [...STUDIES, ...DEVOTIONS, ...GAMES];

/* ──────────────────────────────────────────────
   TOPIC-AWARE RELATED CONTENT FINDER
   ────────────────────────────────────────────── */

function relevanceScore(pageA, pageB) {
  const shared = pageA.tags.filter(t => pageB.tags.includes(t)).length;
  return shared;
}

/**
 * Return related content for a given page.
 * Picks top related items from the same section + cross-section picks.
 */
function getRelated(page, samePool, crossPool, crossPool2) {
  // Score & sort same-section items (exclude self)
  const sameScored = samePool
    .filter(p => p.file !== page.file)
    .map(p => ({ ...p, score: relevanceScore(page, p) }))
    .sort((a, b) => b.score - a.score);

  // Score & sort cross-section items
  const crossScored = crossPool
    .map(p => ({ ...p, score: relevanceScore(page, p) }))
    .sort((a, b) => b.score - a.score);

  const cross2Scored = crossPool2
    .map(p => ({ ...p, score: relevanceScore(page, p) }))
    .sort((a, b) => b.score - a.score);

  return {
    same:   sameScored.slice(0, 3),
    cross:  crossScored.slice(0, 2),
    cross2: cross2Scored.slice(0, 1),
  };
}

/* ──────────────────────────────────────────────
   RELATIVE PATH HELPER
   ────────────────────────────────────────────── */

function relPath(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, toFile).replace(/\\/g, '/');
  // URL-encode special chars in path segments
  rel = rel.split('/').map(seg => encodeURIComponent(seg)).join('/');
  return rel;
}

/* ──────────────────────────────────────────────
   SECTION LABELS
   ────────────────────────────────────────────── */

function sectionOf(file) {
  if (file.startsWith('Studies/'))   return 'study';
  if (file.startsWith('Devotions/')) return 'devotion';
  if (file.startsWith('games/'))     return 'game';
  return 'page';
}

function sectionLabel(section) {
  const map = { study: 'Studies', devotion: 'Devotions', game: 'Games' };
  return map[section] || 'Pages';
}

function sectionHub(section) {
  const map = { study: 'all-studies.html', devotion: 'vod.html', game: 'all-games.html' };
  return map[section] || 'index.html';
}

function sectionIcon(section) {
  const map = { study: 'fas fa-book-open', devotion: 'fas fa-dove', game: 'fas fa-gamepad' };
  return map[section] || 'fas fa-link';
}

/* ──────────────────────────────────────────────
   BUILD THE INJECTED HTML BLOCKS
   ────────────────────────────────────────────── */

function buildBreadcrumb(page) {
  const section = sectionOf(page.file);
  const hubFile = sectionHub(section);
  const homeRel = relPath(page.file, 'index.html');
  const hubRel  = relPath(page.file, hubFile);
  const label   = sectionLabel(section);

  return `
<!-- ===== SEO BREADCRUMB NAV ===== -->
<nav class="nbtt-breadcrumb" aria-label="Breadcrumb" style="
  padding:12px 20px;margin:0;font-size:0.85rem;font-family:'Poppins',sans-serif;
  background:rgba(10,10,26,0.85);border-bottom:1px solid rgba(168,85,247,0.15);
  color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:6px;flex-wrap:wrap;
">
  <a href="${homeRel}" style="color:#a855f7;text-decoration:none;font-weight:600;">Home</a>
  <span style="color:rgba(255,255,255,0.3);">›</span>
  <a href="${hubRel}" style="color:#a855f7;text-decoration:none;font-weight:600;">${label}</a>
  <span style="color:rgba(255,255,255,0.3);">›</span>
  <span style="color:rgba(255,255,255,0.7);">${page.title}</span>
</nav>`;
}

function buildRelatedSection(page, related) {
  const section  = sectionOf(page.file);
  const hubFile  = sectionHub(section);
  const hubRel   = relPath(page.file, hubFile);
  const homeRel  = relPath(page.file, 'index.html');
  const label    = sectionLabel(section);

  // Cross section labels
  const crossSection = section === 'study' ? 'devotion' : (section === 'devotion' ? 'study' : 'study');
  const crossLabel   = sectionLabel(crossSection);
  const crossIcon    = sectionIcon(crossSection);

  let cards = '';

  // Same-section cards
  if (related.same.length) {
    const icon = sectionIcon(section);
    related.same.forEach(r => {
      const href = relPath(page.file, r.file);
      cards += `
      <a href="${href}" class="nbtt-related-card" style="
        display:block;padding:14px 18px;background:rgba(168,85,247,0.08);
        border:1px solid rgba(168,85,247,0.2);border-radius:10px;
        text-decoration:none;color:#ddd;transition:all 0.3s ease;
      ">
        <span style="color:#a855f7;margin-right:6px;"><i class="${icon}"></i></span>
        <strong style="color:#e0d0ff;">${r.title}</strong>
      </a>`;
    });
  }

  // Cross-section cards
  if (related.cross.length) {
    related.cross.forEach(r => {
      const href = relPath(page.file, r.file);
      cards += `
      <a href="${href}" class="nbtt-related-card" style="
        display:block;padding:14px 18px;background:rgba(37,117,252,0.08);
        border:1px solid rgba(37,117,252,0.2);border-radius:10px;
        text-decoration:none;color:#ddd;transition:all 0.3s ease;
      ">
        <span style="color:#60a5fa;margin-right:6px;"><i class="${crossIcon}"></i></span>
        <strong style="color:#bfdbfe;">${r.title}</strong>
        <span style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-left:8px;">${crossLabel}</span>
      </a>`;
    });
  }

  // Game suggestion
  if (related.cross2.length && section !== 'game') {
    related.cross2.forEach(r => {
      const href = relPath(page.file, r.file);
      cards += `
      <a href="${href}" class="nbtt-related-card" style="
        display:block;padding:14px 18px;background:rgba(255,215,3,0.06);
        border:1px solid rgba(255,215,3,0.2);border-radius:10px;
        text-decoration:none;color:#ddd;transition:all 0.3s ease;
      ">
        <span style="color:#ffd803;margin-right:6px;"><i class="fas fa-gamepad"></i></span>
        <strong style="color:#fef3c7;">${r.title}</strong>
        <span style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-left:8px;">Game</span>
      </a>`;
    });
  }

  return `
<!-- ===== SEO RELATED CONTENT — INTERNAL LINKING ===== -->
<section class="nbtt-related-section" style="
  max-width:800px;margin:3rem auto 0;padding:2rem 1.5rem;
  background:rgba(10,10,26,0.9);border:1px solid rgba(168,85,247,0.15);
  border-radius:16px;font-family:'Poppins',sans-serif;
">
  <h2 style="
    color:#fff;font-size:1.4rem;text-align:center;margin:0 0 0.3rem;
    font-weight:700;letter-spacing:-0.02em;
  ">
    <i class="fas fa-compass" style="color:#a855f7;margin-right:8px;"></i>Continue Exploring
  </h2>
  <p style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.85rem;margin:0 0 1.5rem;">
    Dive deeper into God's Word with related content
  </p>
  <div style="display:grid;gap:10px;">
    ${cards}
  </div>
  <div style="display:flex;gap:12px;justify-content:center;margin-top:1.5rem;flex-wrap:wrap;">
    <a href="${hubRel}" style="
      display:inline-flex;align-items:center;gap:6px;padding:10px 22px;
      background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);
      border-radius:50px;color:#c084fc;text-decoration:none;font-weight:600;font-size:0.85rem;
      transition:all 0.3s ease;
    ">
      <i class="${sectionIcon(section)}"></i> All ${label}
    </a>
    <a href="${homeRel}" style="
      display:inline-flex;align-items:center;gap:6px;padding:10px 22px;
      background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
      border-radius:50px;color:#ccc;text-decoration:none;font-weight:600;font-size:0.85rem;
      transition:all 0.3s ease;
    ">
      <i class="fas fa-home"></i> Home
    </a>
  </div>
</section>`;
}

function buildMiniFooter(page) {
  const homeRel     = relPath(page.file, 'index.html');
  const studiesRel  = relPath(page.file, 'all-studies.html');
  const devosRel    = relPath(page.file, 'vod.html');
  const gamesRel    = relPath(page.file, 'all-games.html');
  const videosRel   = relPath(page.file, 'all-videos.html');
  const aboutRel    = relPath(page.file, 'about-us.html');

  return `
<!-- ===== SEO SITE-WIDE MINI FOOTER ===== -->
<footer class="nbtt-mini-footer" style="
  max-width:800px;margin:1.5rem auto 2rem;padding:1.2rem 1.5rem;
  background:rgba(10,10,26,0.7);border-top:1px solid rgba(168,85,247,0.1);
  border-radius:12px;font-family:'Poppins',sans-serif;text-align:center;
">
  <nav aria-label="Site navigation" style="
    display:flex;justify-content:center;gap:18px;flex-wrap:wrap;margin-bottom:0.8rem;
  ">
    <a href="${homeRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-home"></i> Home</a>
    <a href="${studiesRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-book-open"></i> Studies</a>
    <a href="${devosRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-dove"></i> Devotions</a>
    <a href="${gamesRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-gamepad"></i> Games</a>
    <a href="${videosRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-video"></i> Videos</a>
    <a href="${aboutRel}" style="color:#a855f7;text-decoration:none;font-size:0.8rem;font-weight:600;"><i class="fas fa-info-circle"></i> About</a>
  </nav>
  <p style="color:rgba(255,255,255,0.35);font-size:0.7rem;margin:0;">
    &copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.
  </p>
</footer>`;
}

/* ──────────────────────────────────────────────
   HUB PAGE CROSS-LINKS (all-studies ↔ all-videos ↔ all-games ↔ vod)
   ────────────────────────────────────────────── */

function buildHubCrossLinks(pageFile) {
  const hubs = [
    { file: 'all-studies.html', label: 'Studies',   icon: 'fas fa-book-open' },
    { file: 'vod.html',         label: 'Devotions', icon: 'fas fa-dove' },
    { file: 'all-games.html',   label: 'Games',     icon: 'fas fa-gamepad' },
    { file: 'all-videos.html',  label: 'Videos',    icon: 'fas fa-video' },
  ].filter(h => !pageFile.endsWith(h.file));

  const links = hubs.map(h => {
    const href = relPath(pageFile, h.file);
    return `<a href="${href}" style="
      display:inline-flex;align-items:center;gap:8px;padding:12px 24px;
      background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);
      border-radius:50px;color:#c084fc;text-decoration:none;font-weight:600;font-size:0.9rem;
      transition:all 0.3s ease;
    "><i class="${h.icon}"></i> ${h.label}</a>`;
  }).join('\n    ');

  return `
<!-- ===== SEO HUB CROSS-LINKS ===== -->
<div class="nbtt-hub-crosslinks" style="
  text-align:center;padding:2rem 1rem;
  font-family:'Poppins',sans-serif;
">
  <p style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin:0 0 1rem;">
    Explore more from ${BRAND}
  </p>
  <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
    ${links}
  </div>
</div>`;
}

/* ──────────────────────────────────────────────
   BreadcrumbList JSON-LD (structured data)
   ────────────────────────────────────────────── */

function buildBreadcrumbJsonLd(page) {
  const section = sectionOf(page.file);
  const hubFile = sectionHub(section);
  const label   = sectionLabel(section);

  // Encode the file path for URL
  const pageUrl = BASE + '/' + page.file.split('/').map(s => encodeURIComponent(s)).join('/');
  const hubUrl  = BASE + '/' + hubFile;

  return `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"${BASE}/"},
  {"@type":"ListItem","position":2,"name":"${label}","item":"${hubUrl}"},
  {"@type":"ListItem","position":3,"name":"${page.title}","item":"${pageUrl}"}
]}
</script>`;
}

/* ──────────────────────────────────────────────
   MARKER — prevent double-injection
   ────────────────────────────────────────────── */

const MARKER = '<!-- NBTT-INTERNAL-LINKS-INJECTED -->';

/* ──────────────────────────────────────────────
   INJECTION ENGINE
   ────────────────────────────────────────────── */

function injectContentPage(page, samePool, crossPool, gamePool) {
  const abs = path.join(ROOT, page.file);
  if (!fs.existsSync(abs)) {
    console.log(`  SKIP (missing): ${page.file}`);
    return false;
  }

  let html = fs.readFileSync(abs, 'utf8');

  // Already injected?
  if (html.includes(MARKER)) {
    console.log(`  SKIP (already linked): ${page.file}`);
    return false;
  }

  // Get related content
  const section = sectionOf(page.file);
  const related = getRelated(
    page,
    samePool,
    crossPool,
    gamePool
  );

  // Build blocks
  const breadcrumb     = buildBreadcrumb(page);
  const breadcrumbLd   = buildBreadcrumbJsonLd(page);
  const relatedSection = buildRelatedSection(page, related);
  const miniFooter     = buildMiniFooter(page);

  // --- Inject breadcrumb after <body...> ---
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch) {
    const idx = html.indexOf(bodyMatch[0]) + bodyMatch[0].length;
    html = html.slice(0, idx) + '\n' + MARKER + '\n' + breadcrumb + html.slice(idx);
  }

  // --- Inject BreadcrumbList JSON-LD into <head> ---
  const headClose = html.indexOf('</head>');
  if (headClose > -1) {
    html = html.slice(0, headClose) + breadcrumbLd + '\n' + html.slice(headClose);
  }

  // --- Inject related section + mini footer before </body> ---
  const bodyClose = html.lastIndexOf('</body>');
  if (bodyClose > -1) {
    html = html.slice(0, bodyClose) + relatedSection + '\n' + miniFooter + '\n' + html.slice(bodyClose);
  }

  fs.writeFileSync(abs, html, 'utf8');
  console.log(`  LINKED: ${page.file}`);
  return true;
}

function injectHubPage(pageFile) {
  const abs = path.join(ROOT, pageFile);
  if (!fs.existsSync(abs)) {
    console.log(`  SKIP (missing hub): ${pageFile}`);
    return false;
  }

  let html = fs.readFileSync(abs, 'utf8');

  if (html.includes('nbtt-hub-crosslinks')) {
    console.log(`  SKIP (already cross-linked): ${pageFile}`);
    return false;
  }

  const crossLinks = buildHubCrossLinks(pageFile);

  // Inject before </body>
  const bodyClose = html.lastIndexOf('</body>');
  if (bodyClose > -1) {
    html = html.slice(0, bodyClose) + crossLinks + '\n' + html.slice(bodyClose);
  }

  fs.writeFileSync(abs, html, 'utf8');
  console.log(`  HUB LINKED: ${pageFile}`);
  return true;
}

/* ──────────────────────────────────────────────
   MAIN
   ────────────────────────────────────────────── */

function main() {
  console.log('=== SEO Internal Link Authority Pass ===\n');

  let updated = 0;

  // --- Studies ---
  console.log('Studies:');
  STUDIES.forEach(page => {
    if (injectContentPage(page, STUDIES, DEVOTIONS, GAMES)) updated++;
  });

  // --- Devotions ---
  console.log('\nDevotions:');
  DEVOTIONS.forEach(page => {
    if (injectContentPage(page, DEVOTIONS, STUDIES, GAMES)) updated++;
  });

  // --- Games ---
  console.log('\nGames:');
  GAMES.forEach(page => {
    // Games get related games + studies, no devotion cross
    if (injectContentPage(page, GAMES, STUDIES, DEVOTIONS)) updated++;
  });

  // --- Hub pages ---
  console.log('\nHub cross-links:');
  ['all-studies.html', 'all-videos.html', 'all-games.html', 'vod.html'].forEach(hub => {
    if (injectHubPage(hub)) updated++;
  });

  console.log(`\n✔ Internal links injected into ${updated} pages.`);
}

main();
