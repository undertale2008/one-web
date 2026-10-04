/**
 * 新建一篇文章：node scripts/new-post.mjs "文章标题"
 * 会在 src/content/posts/ 下生成一个带 frontmatter 的 Markdown 文件。
 * 也支持直接给英文文件名：node scripts/new-post.mjs my-new-post
 */
import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

const input = process.argv.slice(2).join(" ").trim();
if (!input) {
  console.error('用法: pnpm new-post "文章标题"');
  process.exit(1);
}

/** 中文标题保留原样，英文标题转成短横线连接的 slug。 */
function toSlug(value) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `post-${Date.now()}`;
}

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
  now.getDate()
).padStart(2, "0")}`;

const slug = toSlug(input);
const title = /[\u4e00-\u9fa5]/.test(input) ? input.trim() : input.trim();
const file = path.join(POSTS_DIR, `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`已存在同名文件: ${path.relative(process.cwd(), file)}`);
  process.exit(1);
}

fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: "${title}"
published: ${today}
description: ""
excerpt: ""
image: "/images/covers/notice.jpg"
tags: []
category: "随笔"
series: ""
pinned: false
draft: true
---

## 第一节

在这里开始写正文。draft 为 true 时这篇文章不会出现在网站上，
写完之后把 frontmatter 里的 draft 改成 false 就会发布。
`,
  "utf8"
);

console.log(`已创建: ${path.relative(process.cwd(), file)}`);
console.log("写完后把 frontmatter 里的 draft 改成 false，再执行 pnpm build 或 git push 即可发布。");
