import {
  categories as rawCategories,
  postBodies as rawBodies,
  postText,
  posts as rawPosts,
  seriesGroups as rawSeriesGroups,
  tags as rawTags,
} from "virtual:posts";

/**
 * 文章数据来自 `src/content/posts/*.md`，由构建期的 `virtual:posts`
 * （scripts/vite-plugin-posts.ts）解析好注入，浏览器包里不含 Markdown 解析器。
 */

export type Block =
  | { kind: "h2"; text: string; id: string }
  | { kind: "html"; html: string };

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  cover: string;
  series?: string;
  description?: string;
  pinned?: boolean;
};

export type SeriesGroup = {
  category: string;
  items: { name: string; slug: string; count: number }[];
};

export type Taxonomy = { name: string; count: number };

export const posts = rawPosts as Post[];
export const postBodies = rawBodies as Record<string, Block[]>;
export const categories = rawCategories as Taxonomy[];
export const tags = rawTags as Taxonomy[];
export const seriesGroups = rawSeriesGroups as SeriesGroup[];

/** 标题转锚点，和目录、正文里的 `#` 链接保持一致。 */
export function anchorId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** 正文的纯文本，用于字数统计与站内搜索。 */
export function plainTextOf(slug: string) {
  return (postText as Record<string, string>)[slug] ?? "";
}

/** 目录：按正文里 `##` 出现的顺序。 */
export function outlineOf(slug: string) {
  return (postBodies[slug] ?? [])
    .filter((block): block is Extract<Block, { kind: "h2" }> => block.kind === "h2")
    .map((block) => ({ id: block.id, text: block.text }));
}
