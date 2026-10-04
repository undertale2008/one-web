/**
 * Ports the component CSS of the reference site (Fuwari-derived theme) into
 * this project. Scoping hooks added by the source framework (`data-astro-cid-*`,
 * `.svelte-*`) are stripped so the rules apply to plain React markup.
 *
 * Source files are the stylesheets fetched from the reference site into the
 * local temp folder. Run: node scripts/port-legacy-css.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SRC_DIR = path.join(os.tmpdir(), "yaron-css");
const SOURCES = [
  "_page_.D49tu58p.css",
  "_page_.CRrdbEKD.css",
  "series.BGtI1P2z.css",
  "archive.B2nRPV2O.css",
  "about.XpWfwgtE.css",
  "_slug_.3qcFVFPf.css",
  "bangumi.JMO-0-BV.css",
  "stats.D1CvTnVr.css",
  "travel.ByOxR08Z.css",
  "dev.TWFmqYzI.css",
  "collection.BtVSqbb-.css",
  "studios.BSaKnz-U.css",
];
const OUT = path.join(process.cwd(), "src", "styles", "legacy.css");

/**
 * Utility-looking classes come from Tailwind and are re-created by the app's
 * own markup, so they are not treated as component hooks.
 */
const UTILITY_RE =
  /^(text|bg|flex|grid|h|w|p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap|rounded|border|divide|space|absolute|relative|fixed|sticky|static|hidden|block|inline|items|justify|self|order|transition|duration|delay|ease|opacity|z|col|row|max|min|overflow|pointer|backdrop|shadow|font|leading|tracking|whitespace|line|group|hover|focus|active|dark|md|lg|sm|xl|2xl|left|right|top|bottom|inset|shrink|grow|tabular|translate|scale|rotate|object|aspect|cursor|outline|animate|invisible|isolate|no|prose|isolate|first|last|odd|even|via|from|to|sr|not|aria|data|print|selection|placeholder|caret|accent|filter|blur|saturate|brightness|contrast|grayscale|invert|sepia|will|content|list|align|break|columns|float|clear|resize|appearance|scroll|snap|touch|select|fill|stroke)/;

/** 参考站页面里实际用到的类名，用来兜住手写清单漏掉的组件。 */
function collectReferenceClasses() {
  const files = [
    path.join(os.tmpdir(), "yaron-home.html"),
    ...["archive", "about", "post", "bangumi", "stats", "travel", "dev", "collection", "studios"].map(
      (name) => path.join(os.tmpdir(), "yaron-pages", `${name}.html`)
    ),
  ];

  const names = new Set();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/class="([^"]+)"/g)) {
      for (const raw of match[1].split(/\s+/)) {
        if (!/^[a-z][a-z0-9-]{2,}$/.test(raw)) continue;
        if (UTILITY_RE.test(raw)) continue;
        names.add(raw);
      }
    }
  }
  return names;
}

/**
 * 一些规则挂在 ID 上（导航栏那条滚动后出现的整条玻璃框就是
 * `#navbar-container:before`），所以 ID 也要照参考站页面里出现的原样保留。
 */
function collectReferenceIds() {
  const files = [
    path.join(os.tmpdir(), "yaron-home.html"),
    ...["archive", "about", "post", "bangumi", "stats", "travel", "dev", "collection", "studios"].map(
      (name) => path.join(os.tmpdir(), "yaron-pages", `${name}.html`)
    ),
  ];

  const ids = new Set();
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, "utf8");
    for (const match of html.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  }
  return [...ids].map((id) => `#${id}`);
}

// Class families that make up the visual language we reproduce.
const KEEP = [
  /**
   * 由脚本在运行时切换的状态类（静态 HTML 里看不到）：滚动后的导航栏、
   * 页面切换、抽屉开合、日历里的今天 / 有文章等。
   */
  "is-",
  "has-",
  "skip-enter-animation",
  "navbar-pill",
  "nav-bg-blur",
  "nav-link-item",
  "nav-indicator",
  "nav-dropdown",
  "nav-menu",
  "float-panel",
  "card-base",
  "btn-plain",
  "scale-animation",
  "btn-regular",
  "theme-choice",
  "palette-",
  "search-",
  "scheme-switch",
  "k-on-palette-bg",
  "palette-blob",
  "reading-track",
  "back-to-top",
  "onload-animation",
  "transition-swup-fade",
  "mobile-nav",
  "hide-scrollbar",
  "link-lg",
  "collapse-wrapper",
  "footer-",
  "hitokoto",
  "sakura-canvas",
  "widget-card",
  "widget-heading",
  "calendar-",
  "site-stats-icon",
  "site-content-stat",
  "post-card",
  "post-list",
  "sticker-",
  "pagination-item",
  "article-map",
  "map-",
  "section-heading",
  "section-icon",
  "series-",
  "category-list",
  "category-icon",
  "tag-cloud",
  "tag-icon",
  "hero-doodle",
  "hero-tag",
  "hero-",
  "avatar-",
  "social-hero-link",
  "post-card",
  "post-meta",
  "meta-",
  "toggle-",
  "chip-",
  "quote-",
  "banner-",
  // archive (时光轴)
  "archive-",
  "overview-",
  "year-",
  "timeline-entry",
  "entry-",
  "progress-",
  // about
  "about-",
  "note-pin",
  "interest-",
  "english-copy",
  // post detail
  "post-article",
  "post-journal",
  "post-title",
  "post-reading",
  "post-header",
  "post-cover",
  "description-",
  "dash-line",
  "license-",
  "article-content",
  "markdown-content",
  "custom-md",
  "toc-",
  "anchor",
  "btn-card",
  "no-styling",
  "prose",
  // bangumi / stats
  "bangumi-",
  "stats-",
  "tab-btn",
  "is-active",
  "metric-",
  "collapse-wrapper",
  "license-container",
  "typed-text",
  "typing-cursor",
  "untyped-text",
  // about page interest modifiers
  "football",
  "games",
  "anime",
  "music",
  "dream-note",
  "hello-note",
  "diary-doodle",
  // travel / dev / collection / studios pages
  "travel-",
  "marker-",
  "province-",
  "china-map",
  "cloud-",
  "south-sea-note",
  "overseas",
  "visited",
  "dev-",
  "project-",
  "tech-",
  "tone-",
  "contribution-",
  "github-calendar",
  "github-profile",
  "collection-",
  "cabinet-",
  "collection",
  "mini-",
  "hero-visual",
  "studios-",
  "studio-",
  "work-",
  "works-",
  "watched-note",
  "favorite-ribbon",
  "article-ribbon",
  "hero-ticket",
  "mouse-note",
];

/**
 * A few reference rules hang off IDs rather than classes (the note-trail
 * container and its reduced-motion / coarse-pointer fallback), so they need
 * their own allowlist.
 */
const KEEP_ID = [...new Set(["#mouse-note-trail", ...collectReferenceIds()])];

const KEEP_RE = new RegExp(
  `(?:\\.(?:${[...new Set([...KEEP, ...collectReferenceClasses()])]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})[a-z0-9-]*|${KEEP_ID.join("|")})`,
  "i"
);
const KEYFRAME_KEEP = /palette-blob|map-twinkle|footer-|reading-|back-to-top|sticker|onload|hitokoto|calendar|post-card|hero-|nav|mobile-nav|scale|float|card|shine|aurora|star-movement|mouse-note/;

/**
 * The reference theme is built on a warm cream/tea base. This project keeps
 * its structure but re-keys the neutrals to a cool family around the #66ccff
 * accent, so warm hex values are remapped here (alpha suffixes are preserved).
 */
const COLOR_REMAP = {
  "#765044": "#2f4d63",
  "#775045": "#2f4d63",
  "#744d43": "#2f4d63",
  "#735048": "#2f4d63",
  "#704d43": "#2f4d63",
  "#644a43": "#2b4152",
  "#432e2a": "#1f3342",
  "#885f56": "#3b6076",
  "#8d675f": "#3b6076",
  "#895c57": "#3b6076",
  "#a96871": "#2f6d96",
  "#fff9ef": "#f2f9ff",
  "#fff3e3": "#e8f4fd",
  "#fffaf7": "#f8fcff",
  "#fff4f2": "#f4fafe",
  "#fff8f0": "#f7fbff",
  "#fff8ed": "#f6fbff",
  "#fffbf5": "#f8fcff",
};

/**
 * The reference theme was authored against Tailwind v3 helpers, where these
 * custom properties always existed. Rather than defining them globally (which
 * would sit outside Tailwind v4's cascade layers and therefore *beat* the
 * utilities, neutralising every `shadow-*` / `backdrop-*` utility), each read
 * gets an inline fallback.
 */
const TW_FALLBACKS = {
  "--tw-shadow": "0 0 #0000",
  "--tw-shadow-colored": "0 0 #0000",
  "--tw-ring-offset-shadow": "0 0 #0000",
  "--tw-ring-shadow": "0 0 #0000",
  "--tw-ring-color": "rgb(59 130 246 / 0.5)",
  "--tw-ring-offset-width": "0px",
  "--tw-ring-offset-color": "#fff",
  "--tw-translate-x": "0",
  "--tw-translate-y": "0",
  "--tw-rotate": "0",
  "--tw-skew-x": "0",
  "--tw-skew-y": "0",
  "--tw-scale-x": "1",
  "--tw-scale-y": "1",
  "--tw-backdrop-blur": "",
  "--tw-backdrop-brightness": "",
  "--tw-backdrop-contrast": "",
  "--tw-backdrop-grayscale": "",
  "--tw-backdrop-hue-rotate": "",
  "--tw-backdrop-invert": "",
  "--tw-backdrop-opacity": "",
  "--tw-backdrop-saturate": "",
  "--tw-backdrop-sepia": "",
};

/** `var(--tw-shadow)` -> `var(--tw-shadow, 0 0 #0000)` (never double-apply). */
function addCompatFallbacks(css) {
  return css.replace(/var\((--tw-[a-z-]+)(\s*)\)/g, (match, name) => {
    if (!(name in TW_FALLBACKS)) return match;
    return `var(${name}, ${TW_FALLBACKS[name]})`;
  });
}

function remapColors(css) {
  let output = css;
  for (const [from, to] of Object.entries(COLOR_REMAP)) {
    output = output.split(from).join(to);
    output = output.split(from.toUpperCase()).join(to);
  }
  return output;
}

const clamp255 = (value) => Math.max(0, Math.min(255, Math.round(value)));

/** 把暖棕色平移到同一明度的冷色调，红降、蓝升，绿基本保持。 */
function shiftWarmToCool(hex) {
  const raw = hex.slice(1);
  const full = raw.length <= 4 ? raw.slice(0, 3).split("").map((c) => c + c).join("") + (raw.length === 4 ? raw[3] + raw[3] : "") : raw;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return hex;
  // 只处理偏暖的颜色（红明显高于蓝），冷色原样保留
  if (r - b <= 15) return hex;
  const next = "#" + [clamp255(r - 22), clamp255(g + 2), clamp255(b + 16)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
  return next + full.slice(6);
}

/** 阴影里的暖棕阴影统一换成冷色，避免蓝调站点里出现褐色投影。 */
function coolShadowTints(css) {
  return css.replace(/box-shadow:[^;}]+/g, (declaration) =>
    declaration.replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => shiftWarmToCool(hex))
  );
}

function readSource(name) {
  const file = path.join(SRC_DIR, name);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing source stylesheet: ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

/** Split a stylesheet into top-level blocks, keeping nested at-rules intact. */
function topLevelBlocks(css) {
  const blocks = [];
  let depth = 0;
  let start = 0;
  let inString = null;
  let inComment = false;

  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    const next = css[i + 1];

    if (inComment) {
      if (char === "*" && next === "/") {
        inComment = false;
        i += 1;
      }
      continue;
    }
    if (inString) {
      if (char === "\\") i += 1;
      else if (char === inString) inString = null;
      continue;
    }
    if (char === "/" && next === "*") {
      inComment = true;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      inString = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        blocks.push(css.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
  return blocks.filter(Boolean);
}

/** Rewrite framework-specific selector noise into plain class selectors. */
function cleanSelector(selector) {
  return selector
    .replace(/\[data-astro-cid-[a-z0-9]+(?:="[^"]*")?\]/gi, "")
    .replace(/:where\(\.svelte-[a-z0-9]+\)/gi, "")
    .replace(/\.svelte-[a-z0-9]+/gi, "")
    .replace(/\[data-astro-cid-[a-z0-9]+\]/gi, "")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapBlocks(block, transform) {
  if (block.startsWith("@media") || block.startsWith("@supports")) {
    const open = block.indexOf("{");
    const header = block.slice(0, open + 1);
    const body = block.slice(open + 1, block.lastIndexOf("}"));
    const inner = topLevelBlocks(body)
      .map((child) => mapBlocks(child, transform))
      .filter(Boolean)
      .join("");
    return inner ? `${header}${inner}}` : "";
  }
  if (block.startsWith("@keyframes")) {
    return KEYFRAME_KEEP.test(block) ? block : "";
  }
  if (block.startsWith("@")) return "";

  const open = block.indexOf("{");
  if (open < 0) return "";
  const selector = block.slice(0, open);
  const body = block.slice(open);
  if (!KEEP_RE.test(selector)) return "";

  const cleaned = selector
    .split(",")
    .map((part) => cleanSelector(part))
    .filter((part) => part && part !== ">")
    .join(", ");

  if (!cleaned) return "";
  return `${cleaned}${addCompatFallbacks(coolShadowTints(remapColors(body)))}`;
}

function main() {
  const blocks = SOURCES.flatMap((name) => topLevelBlocks(readSource(name)));
  const seen = new Set();
  const rules = [];

  for (const block of blocks) {
    const mapped = mapBlocks(block, cleanSelector);
    if (!mapped || seen.has(mapped)) continue;
    seen.add(mapped);
    rules.push(mapped);
  }

  const header = `/*\n * Ported component styles.\n * Source: stylesheets of the reference site (Fuwari-derived theme), framework\n * scoping removed. Generated by scripts/port-legacy-css.mjs - do not edit by hand.\n */\n\n`;
  const css = header + rules.join("\n") + "\n";
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, css, "utf8");
  console.log(`Wrote ${rules.length} rules to ${OUT} (${(css.length / 1024).toFixed(1)} KB)`);
}

main();
