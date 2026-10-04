/**
 * Emits rss.xml, sitemap-index.xml, sitemap-0.xml and robots.txt.
 *
 * The site content lives in a TypeScript module, so the plugin compiles that
 * module in-memory (through Vite's own esbuild transform, no extra dependency)
 * and generates the feeds from the same data the pages render.
 */
import fs from "node:fs";
import path from "node:path";
import { transformWithEsbuild, type Plugin } from "vite";
import matter from "gray-matter";

const SITE_MODULE = "src/data/site.ts";
const POSTS_DIR = "src/content/posts";

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  category: string;
};

type SiteData = {
  site: { title: string; description: string; siteUrl: string };
  posts: Post[];
};

const escapeXml = (value: unknown) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

async function loadSite(root: string): Promise<SiteData> {
  const source = fs.readFileSync(path.join(root, SITE_MODULE), "utf8");
  const { code } = await transformWithEsbuild(source, SITE_MODULE, {
    loader: "ts",
    format: "esm",
  });
  return (await import(
    `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`
  )) as SiteData;
}

/**
 * 文章现在写在 Markdown 里，所以这里直接读 frontmatter，
 * 不再依赖 src/data/site.ts 的导出（那个文件已经不含文章数据）。
 */
function readPosts(root: string): Post[] {
  const dir = path.join(root, POSTS_DIR);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const published = data.published ?? data.date;
      const date =
        published instanceof Date
          ? `${published.getFullYear()}-${String(published.getMonth() + 1).padStart(2, "0")}-${String(
              published.getDate()
            ).padStart(2, "0")}`
          : String(published ?? "").slice(0, 10);

      return {
        title: String(data.title ?? file.replace(/\.md$/, "")),
        slug: file.replace(/\.md$/, ""),
        excerpt: String(data.excerpt ?? data.description ?? ""),
        date,
        category: String(data.category ?? "随笔"),
        draft: Boolean(data.draft),
        pinned: Boolean(data.pinned),
      } as Post & { draft: boolean; pinned: boolean };
    })
    .filter((post) => !(post as Post & { draft: boolean }).draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

const join = (base: string, pathname: string) => `${base.replace(/\/$/, "")}${pathname}`;

function buildFiles({ site, posts }: SiteData) {
  const base = (site.siteUrl ?? "https://example.com").replace(/\/$/, "");
  const now = new Date().toUTCString();

  const staticPaths = ["/", "/series/", "/archive/", "/bangumi/", "/about/", "/stats/", "/dev/", "/collection/", "/studios/", "/travel/"];
  const postPaths = posts.map((post) => `/posts/${post.slug}/`);

  const rssItems = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (post: Post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(join(base, `/posts/${post.slug}/`))}</link>
      <guid isPermaLink="true">${escapeXml(join(base, `/posts/${post.slug}/`))}</guid>
      <pubDate>${new Date(`${post.date}T09:00:00+08:00`).toUTCString()}</pubDate>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(join(base, "/rss.xml"))}" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

  const urlEntries = [...staticPaths, ...postPaths]
    .map(
      (pathname) => `  <url>
    <loc>${escapeXml(join(base, pathname))}</loc>
    <changefreq>${pathname.startsWith("/posts/") ? "monthly" : "weekly"}</changefreq>
  </url>`
    )
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${escapeXml(join(base, "/sitemap-0.xml"))}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${join(base, "/sitemap-index.xml")}
`;

  return {
    "rss.xml": rss,
    "sitemap-0.xml": sitemap,
    "sitemap-index.xml": sitemapIndex,
    "robots.txt": robots,
  };
}

export function feedsPlugin(): Plugin {
  let files: Record<string, string> | null = null;
  let root = process.cwd();

  const generate = async () => {
    const data = await loadSite(root);
    files = buildFiles({ site: data.site, posts: readPosts(root) });
    return files;
  };

  return {
    name: "site-feeds",
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      await generate();
    },
    async configureServer(server) {
      await generate();
      server.middlewares.use((req, res, next) => {
        if (!req.url || !files) return next();
        const name = req.url.split("?")[0].replace(/^\//, "");
        const body = files[name];
        if (!body) return next();
        res.setHeader(
          "Content-Type",
          name.endsWith(".xml") ? "application/xml; charset=utf-8" : "text/plain; charset=utf-8"
        );
        res.end(body);
      });
    },
    async writeBundle(options: { dir?: string }) {
      const outDir = options.dir ?? path.join(root, "dist");
      if (!files) await generate();
      for (const [name, body] of Object.entries(files as Record<string, string>)) {
        fs.writeFileSync(path.join(outDir, name), body, "utf8");
      }
    },
  };
}
