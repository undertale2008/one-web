/**
 * 在构建期把 src/content/posts/*.md 解析成站点数据，通过 `virtual:posts`
 * 提供给前端。这样 markdown-it / gray-matter 只跑在 Node 侧，不会进浏览器包。
 *
 * 改动 md 文件时开发服务器会整页刷新，写文章能立刻看到效果。
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import type { Plugin } from "vite";

const POSTS_DIR = "src/content/posts";
export const VIRTUAL_POSTS_ID = "virtual:posts";
const RESOLVED_ID = "\0" + VIRTUAL_POSTS_ID;

const md = new MarkdownIt({ html: true, linkify: true });

export function anchorId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Block = { kind: "h2"; text: string; id: string } | { kind: "html"; html: string };

function toIsoDate(value: unknown): string {
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value ?? "").slice(0, 10);
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item));
  if (typeof value === "string" && value.trim()) {
    return value
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function toBlocks(markdown: string): Block[] {
  const env = {};
  const tokens = md.parse(markdown, env);
  const blocks: Block[] = [];
  const isOpen = (type: string) => type.endsWith("_open");
  const isClose = (type: string) => type.endsWith("_close");

  let index = 0;
  while (index < tokens.length) {
    const token = tokens[index];

    if (token.type === "heading_open" && token.tag === "h2") {
      const text = tokens[index + 1]?.content?.trim() ?? "";
      if (text) blocks.push({ kind: "h2", text, id: anchorId(text) });
      while (index < tokens.length && tokens[index].type !== "heading_close") index += 1;
      index += 1;
      continue;
    }

    const start = index;
    if (isOpen(token.type)) {
      let depth = 1;
      index += 1;
      while (index < tokens.length && depth > 0) {
        const current = tokens[index];
        if (isOpen(current.type)) depth += 1;
        else if (isClose(current.type)) depth -= 1;
        index += 1;
      }
    } else {
      index += 1;
    }

    const html = md.renderer.render(tokens.slice(start, index), md.options, env);
    if (html.trim()) blocks.push({ kind: "html", html });
  }

  return blocks;
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function estimateMinutes(text: string) {
  const cjk = (text.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (text.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round((cjk + words * 1.6) / 350));
}

export function buildPostData(root: string) {
  const dir = path.join(root, POSTS_DIR);
  if (!fs.existsSync(dir)) {
    return { posts: [], postBodies: {}, postText: {}, categories: [], tags: [], seriesGroups: [] };
  }

  const entries = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const blocks = toBlocks(content);
      const text = blocks
        .map((block) => (block.kind === "h2" ? block.text : stripTags(block.html)))
        .join(" ");
      const firstHtml = blocks.find((block) => block.kind === "html");
      const firstParagraph = stripTags(firstHtml && firstHtml.kind === "html" ? firstHtml.html : "");

      return {
        draft: Boolean(data.draft),
        blocks,
        text,
        post: {
          title: String(data.title ?? slug),
          slug,
          excerpt: String(data.excerpt ?? data.description ?? firstParagraph).slice(0, 120),
          date: toIsoDate(data.published ?? data.date),
          category: String(data.category ?? "随笔"),
          tags: toTags(data.tags),
          readingMinutes: Number(data.readingMinutes ?? 0) || estimateMinutes(text),
          cover: String(data.image ?? data.cover ?? "/images/covers/notice.jpg"),
          ...(data.series ? { series: String(data.series) } : {}),
          ...(data.description ? { description: String(data.description) } : {}),
          ...(data.pinned ? { pinned: true } : {}),
        },
      };
    })
    .filter((entry) => !entry.draft);

  const posts = entries
    .map((entry) => entry.post)
    .sort((a, b) => {
      if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });

  const postBodies = Object.fromEntries(entries.map((entry) => [entry.post.slug, entry.blocks]));
  const postText = Object.fromEntries(entries.map((entry) => [entry.post.slug, entry.text]));

  const categories = [...new Set(posts.map((post) => post.category))]
    .map((name) => ({ name, count: posts.filter((post) => post.category === name).length }))
    .sort((a, b) => b.count - a.count);

  const tagOrder: string[] = [];
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagOrder.includes(tag)) tagOrder.push(tag);
    });
  });
  const tags = tagOrder.map((name) => ({
    name,
    count: posts.filter((post) => post.tags.includes(name)).length,
  }));

  const groups = new Map<string, { name: string; slug: string; count: number }[]>();
  [...posts]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .forEach((post) => {
      if (!post.series) return;
      const items = groups.get(post.category) ?? [];
      const existing = items.find((item) => item.name === post.series);
      if (existing) existing.count += 1;
      else items.push({ name: post.series, slug: post.slug, count: 1 });
      groups.set(post.category, items);
    });
  const seriesGroups = [...groups.entries()].map(([category, items]) => ({ category, items }));

  return { posts, postBodies, postText, categories, tags, seriesGroups };
}

export function postsPlugin(): Plugin {
  let root = process.cwd();

  return {
    name: "site-posts",
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === VIRTUAL_POSTS_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const data = buildPostData(root);
      return [
        `export const posts = ${JSON.stringify(data.posts)};`,
        `export const postBodies = ${JSON.stringify(data.postBodies)};`,
        `export const postText = ${JSON.stringify(data.postText)};`,
        `export const categories = ${JSON.stringify(data.categories)};`,
        `export const tags = ${JSON.stringify(data.tags)};`,
        `export const seriesGroups = ${JSON.stringify(data.seriesGroups)};`,
      ].join("\n");
    },
    handleHotUpdate({ file, server }) {
      if (!file.replace(/\\/g, "/").includes(POSTS_DIR)) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
      server.ws.send({ type: "full-reload" });
    },
  };
}
