const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://nothingbutthetruth.web.app';
const DEFAULT_IMAGE = `${BASE_URL}/seo-default-image.jpg`;
const BRAND = 'NothingButTheTRUTH';

const SKIP_DIRS = new Set(['node_modules', '.git', 'tabby-cache', 'functions']);
const SKIP_FILES = new Set(['public/index.html']);

function walkHtml(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
      continue;
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.html')) continue;
    const rel = path.relative(ROOT, full).replaceAll('\\', '/');
    if (SKIP_FILES.has(rel)) continue;
    out.push({ full, rel });
  }
  return out;
}

function toCanonical(relPath) {
  if (relPath === 'index.html') return `${BASE_URL}/`;
  const encodedPath = relPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
  return `${BASE_URL}/${encodedPath}`;
}

function cleanText(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function stripTags(html) {
  return cleanText(html.replace(/<[^>]*>/g, ' '));
}

function escapeAttr(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function toTitleCase(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function trimAtWord(value, maxLen) {
  const text = cleanText(value);
  if (text.length <= maxLen) return text;
  const shortened = text.slice(0, maxLen - 3);
  const lastSpace = shortened.lastIndexOf(' ');
  if (lastSpace > 20) return `${shortened.slice(0, lastSpace)}...`;
  return `${shortened}...`;
}

function inferType(relPath) {
  const lower = relPath.toLowerCase();
  if (lower === 'index.html') return 'home';
  if (lower.startsWith('studies/')) return 'study';
  if (lower.startsWith('devotions/')) return 'devotion';
  if (lower.startsWith('games/')) return 'game';
  if (lower === 'all-studies.html' || lower === 'all-videos.html' || lower === 'all-games.html' || lower === 'vod.html') return 'hub';
  return 'page';
}

function ensureLang(html) {
  if (/<html[^>]*\blang=/i.test(html)) return html;
  return html.replace(/<html(\s|>)/i, '<html lang="en"$1');
}

function inferTitle(html, relPath) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (match) return cleanText(stripTags(match[1]));
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return `${cleanText(stripTags(h1[1]))} | ${BRAND}`;

  const base = relPath.replace('.html', '').split('/').pop() || 'Page';
  return `${toTitleCase(base)} | ${BRAND}`;
}

function buildDefaultTitle(relPath) {
  const lower = relPath.toLowerCase();
  const type = inferType(relPath);
  const base = relPath.replace('.html', '').split('/').pop() || 'Page';
  const baseTitle = toTitleCase(base);

  if (lower === 'about-us.html') return `About Us — Mission, Beliefs & Purpose | ${BRAND}`;
  if (lower === 'vod.html') return `All Devotions — Daily Faith Resources | ${BRAND}`;
  if (lower === 'all-studies.html') return `All Studies — Bible Study Library | ${BRAND}`;
  if (lower === 'all-videos.html') return `All Videos — Bible Video Library | ${BRAND}`;
  if (lower === 'all-games.html') return `All Games — Interactive Bible Games | ${BRAND}`;

  if (type === 'home') return `${BRAND} — Bible Studies, Devotions, Videos & Interactive Games`;
  if (type === 'hub') return `${baseTitle} | ${BRAND}`;
  if (type === 'game') return `${baseTitle} — Bible Game | ${BRAND}`;
  if (type === 'devotion') return `${baseTitle} — Devotional | ${BRAND}`;
  if (type === 'study') return `${baseTitle} — Bible Study | ${BRAND}`;
  return `${baseTitle} — Bible Faith Resource | ${BRAND}`;
}

function normalizeTitle(rawTitle, relPath) {
  let title = cleanText(rawTitle || '');
  const defaultTitle = buildDefaultTitle(relPath);

  if (!title || title.length < 35) {
    title = defaultTitle;
  }

  if (!title.toLowerCase().includes('nothingbutthetruth') && !title.toLowerCase().includes('nothingbutthetruth')) {
    title = `${title} | ${BRAND}`;
  }

  title = cleanText(title.replace(/\s*\|\s*\|\s*/g, ' | '));

  if (title.length > 60) {
    title = trimAtWord(title, 60);
  }

  if (title.length < 35) {
    title = trimAtWord(defaultTitle, 60);
  }

  return title;
}

function inferDescriptionFromContent(html, title, relPath) {
  const paragraphMatches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((match) => cleanText(stripTags(match[1])))
    .filter((text) => text.length >= 80);

  if (paragraphMatches.length) {
    return trimAtWord(paragraphMatches[0], 158);
  }

  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const heading = h1 ? cleanText(stripTags(h1[1])) : '';
  const type = inferType(relPath);

  if (type === 'home') {
    return 'Explore Bible studies, daily devotions, videos, and interactive faith resources on NothingButTheTRUTH.';
  }
  if (type === 'hub') {
    return trimAtWord(`${heading || title} — Explore this Bible resource collection on ${BRAND} with studies, devotionals, videos, and practical faith tools.`, 158);
  }
  if (type === 'game') {
    return trimAtWord(`${heading || title} — Play this Bible-based interactive game on ${BRAND} and strengthen Scripture knowledge in a fun way.`, 158);
  }
  if (type === 'devotion') {
    return trimAtWord(`${heading || title} — Read this Bible-centered devotional on ${BRAND} for practical spiritual growth and Christ-focused daily application.`, 158);
  }
  if (type === 'study') {
    return trimAtWord(`${heading || title} — Explore this in-depth Bible study on ${BRAND} with scripture analysis, theology, and practical life application.`, 158);
  }

  return trimAtWord(`${title} — Bible-centered content from ${BRAND} including studies, devotions, videos, and interactive faith resources.`, 158);
}

function normalizeDescription(html, relPath, title) {
  const existing = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const existingText = existing ? cleanText(existing[1]) : '';
  const hasLowQualityEllipsis = existingText.endsWith('...');

  if (existingText.length >= 110 && existingText.length <= 160 && !hasLowQualityEllipsis) {
    return existingText;
  }

  const generated = inferDescriptionFromContent(html, title, relPath);
  if (generated.length >= 110) return generated;

  const fallback = trimAtWord(`${title} — Bible-centered content from ${BRAND} including studies, devotions, videos, and interactive faith resources.`, 158);
  return fallback;
}

function upsertTitleTag(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return {
      html: html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(title)}</title>`),
      changed: true,
    };
  }

  if (/<\/head>/i.test(html)) {
    return {
      html: html.replace(/<\/head>/i, `  <title>${escapeAttr(title)}</title>\n</head>`),
      changed: true,
    };
  }

  return { html, changed: false };
}

function inferDescription(html, title, relPath) {
  return normalizeDescription(html, relPath, title);
}

function inferKeywords(relPath, title) {
  const section = inferType(relPath);
  const seed = [
    'Bible study',
    'Christian devotion',
    'Scripture',
    'NothingButTheTRUTH',
  ];

  if (section === 'study') seed.push('in-depth Bible study', 'Christian theology');
  if (section === 'devotion') seed.push('daily devotional', 'practical faith');
  if (section === 'game') seed.push('Bible game', 'interactive Scripture quiz');
  if (section === 'hub') seed.push('Bible resources', 'study collection', 'video library');
  if (relPath.toLowerCase().includes('command')) seed.push('Ten Commandments', 'Sabbath', 'law of God');

  const titleTerms = cleanText(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((term) => term.length > 3)
    .slice(0, 6);

  const merged = [...seed, ...titleTerms].map((term) => term.trim());
  return [...new Set(merged)].slice(0, 16).join(', ');
}

function upsertTag(html, matcher, tag) {
  if (matcher.test(html)) {
    return {
      html: html.replace(matcher, tag),
      changed: true,
    };
  }

  if (!/<\/head>/i.test(html)) {
    return { html, changed: false };
  }

  return {
    html: html.replace(/<\/head>/i, `${tag}\n</head>`),
    changed: true,
  };
}

function buildJsonLd(relPath, canonical, title, description) {
  const type = inferType(relPath);
  const slug = relPath.replace('.html', '');
  const pageType = type === 'study' ? 'Article' : type === 'devotion' ? 'Article' : 'WebPage';

  const graph = [
    {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': pageType,
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: title,
          description,
          inLanguage: 'en-US',
          isPartOf: {
            '@type': 'WebSite',
            name: BRAND,
            url: BASE_URL,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${BASE_URL}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: toTitleCase(slug.split('/').pop() || 'Page'),
              item: canonical,
            },
          ],
        },
      ],
    },
  ];

  return JSON.stringify(graph[0]);
}

function ensureHeadMeta(html, relPath) {
  const canonical = toCanonical(relPath);
  const rawTitle = inferTitle(html, relPath);
  const title = normalizeTitle(rawTitle, relPath);
  const description = inferDescription(html, title, relPath);
  const keywords = inferKeywords(relPath, title);
  const sectionType = inferType(relPath);
  const ogType = sectionType === 'study' || sectionType === 'devotion' ? 'article' : 'website';

  let changed = false;

  const titleResult = upsertTitleTag(html, title);
  html = titleResult.html;
  changed = changed || titleResult.changed;

  const tagSet = [
    {
      matcher: /<meta[^>]+name=["']viewport["'][^>]*>/i,
      tag: '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    },
    {
      matcher: /<meta[^>]+name=["']description["'][^>]*>/i,
      tag: `  <meta name="description" content="${escapeAttr(description)}">`,
    },
    {
      matcher: /<meta[^>]+name=["']keywords["'][^>]*>/i,
      tag: `  <meta name="keywords" content="${escapeAttr(keywords)}">`,
    },
    {
      matcher: /<meta[^>]+name=["']author["'][^>]*>/i,
      tag: `  <meta name="author" content="${BRAND}">`,
    },
    {
      matcher: /<meta[^>]+name=["']robots["'][^>]*>/i,
      tag: '  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    },
    {
      matcher: /<link[^>]+rel=["']canonical["'][^>]*>/i,
      tag: `  <link rel="canonical" href="${canonical}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:type["'][^>]*>/i,
      tag: `  <meta property="og:type" content="${ogType}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:site_name["'][^>]*>/i,
      tag: `  <meta property="og:site_name" content="${BRAND}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:locale["'][^>]*>/i,
      tag: '  <meta property="og:locale" content="en_US">',
    },
    {
      matcher: /<meta[^>]+property=["']og:title["'][^>]*>/i,
      tag: `  <meta property="og:title" content="${escapeAttr(title)}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:description["'][^>]*>/i,
      tag: `  <meta property="og:description" content="${escapeAttr(description)}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:url["'][^>]*>/i,
      tag: `  <meta property="og:url" content="${canonical}">`,
    },
    {
      matcher: /<meta[^>]+property=["']og:image["'][^>]*>/i,
      tag: `  <meta property="og:image" content="${DEFAULT_IMAGE}">`,
    },
    {
      matcher: /<meta[^>]+name=["']twitter:card["'][^>]*>/i,
      tag: '  <meta name="twitter:card" content="summary_large_image">',
    },
    {
      matcher: /<meta[^>]+name=["']twitter:title["'][^>]*>/i,
      tag: `  <meta name="twitter:title" content="${escapeAttr(title)}">`,
    },
    {
      matcher: /<meta[^>]+name=["']twitter:description["'][^>]*>/i,
      tag: `  <meta name="twitter:description" content="${escapeAttr(description)}">`,
    },
    {
      matcher: /<meta[^>]+name=["']twitter:image["'][^>]*>/i,
      tag: `  <meta name="twitter:image" content="${DEFAULT_IMAGE}">`,
    },
  ];

  for (const item of tagSet) {
    const result = upsertTag(html, item.matcher, item.tag);
    html = result.html;
    changed = changed || result.changed;
  }

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
    const jsonLd = buildJsonLd(relPath, canonical, title, description);
    const insertions = [
      '  <script type="application/ld+json">',
      `  ${jsonLd}`,
      '  </script>',
    ];

    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${insertions.join('\n')}\n</head>`);
      changed = true;
    }
  }

  return { html, changed, title, description };
}

function writeSeoImage() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="NothingButTheTRUTH">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="285" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">NothingButTheTRUTH</text>
  <text x="600" y="360" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#e2e8f0">Truth documented and delivered for the modern seeker</text>
</svg>`;
  fs.writeFileSync(path.join(ROOT, 'seo-default-image.jpg'), svg, 'utf8');
}

function writeSitemap(pages) {
  function getPriority(relPath) {
    const lower = relPath.toLowerCase();
    if (lower === 'index.html') return '1.0';
    if (lower === 'the-ten-commandments.html') return '0.98';
    if (lower === 'all-studies.html' || lower === 'all-videos.html') return '0.95';
    if (lower === 'vod.html') return '0.92';
    if (lower === 'all-games.html') return '0.88';
    if (lower === 'studies/exodus_sinai_law_of_love.html') return '0.90';
    if (lower.startsWith('studies/')) return '0.85';
    if (lower.startsWith('devotions/')) return '0.80';
    if (lower.startsWith('games/')) return '0.75';
    if (lower.startsWith('new_sections/')) return '0.80';
    return '0.70';
  }

  function getChangefreq(relPath) {
    const lower = relPath.toLowerCase();
    if (lower === 'index.html') return 'daily';
    if (lower === 'all-studies.html' || lower === 'all-videos.html' || lower === 'vod.html' || lower === 'the-ten-commandments.html') return 'daily';
    if (lower.startsWith('studies/') || lower.startsWith('devotions/') || lower.startsWith('games/')) return 'weekly';
    return 'monthly';
  }

  const urls = pages
    .map((p) => {
      const loc = toCanonical(p.rel);
      const stats = fs.statSync(p.full);
      const lastmod = stats.mtime.toISOString();
      const changefreq = getChangefreq(p.rel);
      const priority = getPriority(p.rel);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
}

function writeRobots() {
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');
}

function writeAuditReport(auditRows) {
  const summary = {
    scannedPages: auditRows.length,
    titleTooShort: auditRows.filter((row) => row.titleLength < 30).length,
    titleTooLong: auditRows.filter((row) => row.titleLength > 60).length,
    descriptionTooShort: auditRows.filter((row) => row.descriptionLength < 70).length,
    descriptionTooLong: auditRows.filter((row) => row.descriptionLength > 160).length,
    updatedAt: new Date().toISOString(),
  };

  const payload = {
    summary,
    pages: auditRows,
  };

  fs.writeFileSync(path.join(ROOT, 'seo-audit-report.json'), JSON.stringify(payload, null, 2), 'utf8');
}

function main() {
  const pages = walkHtml(ROOT);
  let changedCount = 0;
  const auditRows = [];

  for (const page of pages) {
    let html = fs.readFileSync(page.full, 'utf8');
    const original = html;

    html = ensureLang(html);
    const result = ensureHeadMeta(html, page.rel);
    html = result.html;

    const finalTitle = result.title || inferTitle(html, page.rel);
    const finalDescription = result.description || inferDescription(html, finalTitle);
    auditRows.push({
      path: page.rel,
      type: inferType(page.rel),
      titleLength: finalTitle.length,
      descriptionLength: finalDescription.length,
      canonical: toCanonical(page.rel),
    });

    if (html !== original) {
      fs.writeFileSync(page.full, html, 'utf8');
      changedCount += 1;
    }
  }

  writeSeoImage();
  writeSitemap(pages);
  writeRobots();
  writeAuditReport(auditRows);

  console.log(`Pages scanned: ${pages.length}`);
  console.log(`Pages updated: ${changedCount}`);
  console.log('Generated: robots.txt, sitemap.xml, seo-default-image.jpg, seo-audit-report.json');
}

main();