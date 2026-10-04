# 知白的手账 (one web)

个人博客站点，视觉与结构参考 [yaronluo.com/series](https://yaronluo.com/series/) 做 1:1 复刻，
主色锁定为 `#66ccff`，个人资料部分为占位内容，可随时替换。

## 运行

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5173
pnpm build      # 产出 dist/
pnpm preview    # 预览构建产物 http://127.0.0.1:4173
pnpm new-post "文章标题"   # 新建一篇草稿文章
```

## 写文章

文章就是 `src/content/posts/` 下的 Markdown 文件，frontmatter 沿用常见 Fuwari 教程那一套：

```yaml
---
title: "文章标题"
published: 2026-10-04              # 发布时间
description: "文章开头的一句描述，显示在标题下方"
image: "/images/covers/xxx.jpg"    # 封面
tags: ["生活"]
category: "随笔"
draft: false                       # true 时不会出现在站点上
---
```

可选字段：`excerpt`（首页卡片摘要，缺省取正文第一段）、`series`（系列名）、
`pinned`（置顶）、`readingMinutes`（缺省按字数估算）。

流程：`pnpm new-post "标题"` 生成草稿 → 用任意 Markdown 编辑器写（推荐 Obsidian）→
`pnpm dev` 预览 → 把 `draft` 改成 `false` → `git add . && git commit -m "新文章" && git push`
→ Cloudflare Pages 自动构建上线。

新增文章**不需要改任何代码**：首页列表与分页、文章地图、时光轴、侧栏统计、站内搜索、
RSS、sitemap 都从同一份 Markdown 数据算出来。

## 设计读数（Design Read）

Reading this as: 个人博客/文章索引站，面向普通读者，走「玻璃拟态 + 手账」的可爱语言，
沿用参考站点的 Fuwari 派生设计系统，把色相替换成冷色 `#66ccff`。

- DESIGN_VARIANCE 6 / MOTION_INTENSITY 5 / VISUAL_DENSITY 4（复刻保留，不放大）
- 单一强调色：`#66ccff` 用于描边、图标、光晕、填充；小号强调文字使用同色相的深色
  `--primary-ink`，确保浅色底上的 WCAG AA 对比度
- 圆角体系统一：卡片 1rem - 1.75rem，交互元素胶囊形

## 目录结构

```
src/
  components/
    bits/       ReactBits 组件（ClickSpark / BlurText / CountUp / Magnet /
                SpotlightCard / FadeContent / AnimatedContent 等）
    chrome/     全站框架：导航、页脚、主题与配色切换、阅读进度、回到顶部、背景
    home/       首页：Hero、日历/分类/标签/统计侧栏、文章卡片
  data/
    site.ts      站点配置与其余内容（个人资料、导航、追番清单、配色主题、关于页文案）
  content/
    posts/       文章本体（*.md，frontmatter + Markdown 正文）
    posts.ts     前端读文章的入口（数据由构建期的 virtual:posts 注入）
  lib/          主题/配色持久化
  pages/        路由页面
  styles/
    theme.css     设计令牌（明暗双主题、#66ccff 品牌色）
    legacy.css    由 scripts/port-legacy-css.mjs 从参考站样式迁移而来，请勿手改
    overrides.css 针对本项目的覆盖与修正
scripts/
  port-legacy-css.mjs  重新生成 legacy.css（需要先把参考站 CSS 与页面 HTML 下载到系统临时目录）。
                       保留名单由参考站页面里实际用到的类名推导，避免漏掉只挂在某个类名上的
                       组件规则（例如 `.english-drawer summary`）
                       - ID 选择器（如 `#navbar-container:before`，滚动后出现的整条玻璃框）
                         与运行时状态类（`is-scrolled` / `is-changing` / `is-closing` …）同样保留
                       - Tailwind v3 兼容变量改为就地提供 fallback，不再在 `:root` 里定义，
                         否则会盖住 Tailwind v4 分层里的 `shadow-*` 工具类
                       - 阴影里的暖棕色统一平移到冷色，保持单一冷色相
  build-china-map.mjs  由 DataV 省级边界 GeoJSON 生成 src/data/chinaMap.ts
                       （投影 + Douglas-Peucker 简化，35 省约 45KB，含 5 个足迹点坐标）
  vite-plugin-posts.ts 构建期把 src/content/posts/*.md 解析成 virtual:posts
                       （Markdown 解析只在 Node 侧跑，不进浏览器包；改 md 触发整页热更新）
  vite-plugin-feeds.ts 生成 rss.xml / sitemap-index.xml / sitemap-0.xml / robots.txt
  new-post.mjs         新建草稿文章的脚手架（pnpm new-post "标题"）
  migrate-posts-to-markdown.mjs  一次性脚本：把最早写在 TS 里的文章导出成 Markdown
```

## 已实现

- 全站框架：玻璃胶囊导航（含「探索」下拉）、移动端菜单、站内搜索、配色主题面板、
  明/暗/跟随系统切换、阅读进度条、返回顶部、背景色块、页脚一言与花瓣动画
- 交互动效对齐参考站：鼠标移动时抛出的音符轨迹（触屏与 reduce-motion 下自动关闭）、
  导航栏悬停指示条与首屏淡入、路由切换的 0.2 秒淡出淡入（含过渡期高度占位）、
  主题面板悬停展开、Hero 台词随机轮换与点击重抽、弹跳下滑按钮
- 头像交互与参考站一致：悬停倾斜放大并浮出气泡、点击在四句台词间轮换（不跟随鼠标）
- `/series/` 文章地图：系列专题、分类目录、标签线索（与参考页 1:1）
- `/` 首页：Hero（头像、台词、社交链接）、侧栏部件（日历、分类、标签、站点统计）、文章卡片
- `/archive/` 时光轴：年度概览（文章数、跨年数、年度/当日进度条）、按年份分组的时间线，
  支持 `?category=` 与 `?tag=` 过滤
- `/posts/<slug>/` 文章页：阅读统计、标题条、元信息、逐字摘要、同系列导航、正文、目录（2xl 显示）、
  许可协议、上一篇/下一篇
- `/about/` 关于页：头像区、兴趣手账（每张卡带英文小标签 + 「⌁ 记录完毕！」）、
  DREAM WISHLIST / SAY HELLO 便签、可展开的 English profile（展开与收起都有动画）
- `/bangumi/` 追番小窝：数据指标卡、状态筛选标签、番剧卡片网格（暂无正式封面，用标题排版占位）
- `/stats/` 网站统计：内容概览卡、每篇字数柱状图、小站手账、内容分布与阅读成本面板
  （没有接入访问统计，全部数字来自站内文件，不收集访问者信息）
- `/dev/` 开发手账：技术栈卡片、项目卡、按更新日期生成的写作热力图
  （未接入 GitHub，格子标注为本地记录）
- `/collection/` 小小收藏馆：电影 / 番剧 / 音乐三格书架、分类筛选、收藏统计
- `/studios/` 动画会社：会社卡片（编号、手写标记、缩写徽章、印象句、故事、特征标签、数据）、
  作品网格（无正式封面，用标题排版占位；评分为最低分以上的真实数据）
- `/travel/` 旅行足迹：页头统计、图例、**省级足迹地图**（真实边界数据 + 去过省份高亮 + 城市标记）、
  足迹清单（可展开看备注）、想去清单、旅行手账
- 首页文章列表分页（每页 5 篇，`?page=` 可直达），使用参考站的分页组件样式
- 站内搜索为**全文检索**：索引文章正文，命中处高亮并给出上下文摘要
- 文章以 Markdown 维护：`pnpm new-post` 起草、`draft` 控制发布、分类/标签/系列数量
  全部从文章现算（不用手工维护）
- 构建期生成 `rss.xml`、`sitemap-index.xml`、`sitemap-0.xml`、`robots.txt`
  （由 `scripts/vite-plugin-feeds.ts` 从站内数据生成，开发服务器同样可访问）

## 待办

- 个人资料、文章内容、封面图均为占位素材（封面来自 picsum.photos，头像为 picsum id 338）
- 文章正文目前是结构化占位内容，真实写作时可替换 `postBodies.ts`
- 部署前把 `site.ts` 里的 `siteUrl` 换成自己的域名（RSS 与 sitemap 的绝对链接用它拼接）
