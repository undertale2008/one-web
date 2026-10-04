/**
 * 一次性脚本：把原来写在 src/data/site.ts + src/data/postBodies.ts 里的文章
 * 导出成 src/content/posts/*.md（frontmatter + Markdown 正文）。
 *
 * 用法：node scripts/migrate-posts-to-markdown.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { transformWithEsbuild } from "vite";

const OUT_DIR = path.join(process.cwd(), "src", "content", "posts");

async function loadTs(relativePath) {
  const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
  const { code } = await transformWithEsbuild(source, relativePath, {
    loader: "ts",
    format: "esm",
  });
  return import(`data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`);
}

const yamlString = (value) => `"${String(value).replace(/"/g, '\\"')}"`;

/** 把区块数组还原成 Markdown 正文。 */
function blocksToMarkdown(blocks) {
  const parts = [];
  for (const block of blocks) {
    switch (block.kind) {
      case "h2":
        parts.push(`## ${block.text}`);
        break;
      case "p":
        parts.push(block.text);
        break;
      case "ul":
        parts.push(block.items.map((item) => `- ${item}`).join("\n"));
        break;
      case "quote":
        parts.push(`> ${block.text}${block.source ? `\n>\n> - ${block.source}` : ""}`);
        break;
      case "img":
        parts.push(`![${block.alt}](${block.src})`);
        break;
      default:
        break;
    }
  }
  return parts.join("\n\n") + "\n";
}

async function main() {
  const { posts } = await loadTs("src/data/site.ts");
  const { postBodies } = await loadTs("src/data/postBodies.ts");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let written = 0;
  for (const post of posts) {
    const body = postBodies[post.slug];
    if (!body) {
      console.warn(`跳过（没有正文）: ${post.slug}`);
      continue;
    }

    const frontmatter = [
      "---",
      `title: ${yamlString(post.title)}`,
      `published: ${post.date}`,
      `description: ${yamlString(post.description ?? post.excerpt)}`,
      `excerpt: ${yamlString(post.excerpt)}`,
      `image: ${yamlString(post.cover)}`,
      `tags: [${post.tags.map(yamlString).join(", ")}]`,
      `category: ${yamlString(post.category)}`,
      ...(post.series ? [`series: ${yamlString(post.series)}`] : []),
      ...(post.pinned ? ["pinned: true"] : []),
      `readingMinutes: ${post.readingMinutes}`,
      "draft: false",
      "---",
      "",
    ].join("\n");

    const file = path.join(OUT_DIR, `${post.slug}.md`);
    fs.writeFileSync(file, frontmatter + blocksToMarkdown(body), "utf8");
    written += 1;
  }
  console.log(`已写出 ${written} 篇 Markdown 到 ${OUT_DIR}`);
}

main();
