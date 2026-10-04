import { useMemo } from "react";
import { ArrowUpRight, Code, GithubLogo, TerminalWindow } from "@phosphor-icons/react";
import { site } from "../data/site";
import { posts } from "../content/posts";

const techGroups = [
  {
    title: "编程语言",
    items: [
      { name: "TypeScript", note: "日常使用", tone: "blue", mark: "TS" },
      { name: "JavaScript", note: "日常使用", tone: "coral", mark: "JS" },
      { name: "Python", note: "写过脚本", tone: "green", mark: "PY" },
      { name: "C", note: "学过基础", tone: "tea", mark: "C" },
    ],
  },
  {
    title: "前端",
    items: [
      { name: "React 19", note: "主力", tone: "blue", mark: "R" },
      { name: "Tailwind CSS v4", note: "主力", tone: "coral", mark: "TW" },
      { name: "Vite", note: "日常使用", tone: "purple", mark: "V" },
      { name: "Motion / GSAP", note: "做动效", tone: "pink", mark: "M" },
    ],
  },
  {
    title: "工程与部署",
    items: [
      { name: "Node.js", note: "日常使用", tone: "green", mark: "N" },
      { name: "pnpm", note: "包管理", tone: "tea", mark: "P" },
      { name: "Git", note: "日常使用", tone: "coral", mark: "G" },
      { name: "Cloudflare Pages", note: "部署站点", tone: "blue", mark: "CF" },
    ],
  },
  {
    title: "日常工具",
    items: [
      { name: "VS Code", note: "日常使用", tone: "blue", mark: "VS" },
      { name: "Figma", note: "画草稿", tone: "pink", mark: "F" },
      { name: "Obsidian", note: "记笔记", tone: "purple", mark: "OB" },
      { name: "PowerShell", note: "跑命令", tone: "tea", mark: "PS" },
    ],
  },
];

const projects = [
  {
    number: "01",
    icon: <Code weight="bold" aria-hidden="true" />,
    title: "这个站点本身",
    tags: ["React", "Tailwind v4", "Vite"],
    copy: "参考一个喜欢的博客，从零搭出来的个人站点：玻璃拟态导航、文章地图、时光轴、追番墙，主色锁 66ccff。",
  },
  {
    number: "02",
    icon: <TerminalWindow weight="bold" aria-hidden="true" />,
    title: "样式迁移脚本",
    tags: ["Node", "CSS", "PostCSS 解析"],
    copy: "把参考站的样式表剥掉框架作用域、重映射配色，再挑选出需要的规则生成本站的基础样式，改一次参考站就能重跑。",
  },
  {
    number: "03",
    icon: <GithubLogo weight="bold" aria-hidden="true" />,
    title: "追番数据整理",
    tags: ["TypeScript", "数据整理"],
    copy: "把散在各个 App 里的追番记录收进一份清单，顺手算出完成率、平均分和标准差，喂给追番小窝那一页。",
  },
];

/** 本地写作热力图：过去 53 周里哪天写过东西。 */
function useWritingHeatmap() {
  return useMemo(() => {
    const countsByDate = new Map<string, number>();
    posts.forEach((post) => {
      countsByDate.set(post.date, (countsByDate.get(post.date) ?? 0) + 1);
    });

    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - 53 * 7 + 1);

    const cells: { date: string; level: number }[] = [];
    for (let i = 0; i < 53 * 7; i += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      const count = countsByDate.get(key) ?? 0;
      cells.push({ date: key, level: Math.min(4, count * 2) });
    }

    const months: { label: string; column: number }[] = [];
    for (let week = 0; week < 53; week += 1) {
      const day = new Date(start);
      day.setDate(start.getDate() + week * 7);
      if (day.getDate() <= 7) {
        months.push({ label: `${day.getMonth() + 1}月`, column: week + 1 });
      }
    }

    return { cells, months, total: posts.length };
  }, []);
}

export function DevPage() {
  const heatmap = useWritingHeatmap();

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="dev-page-shell">
          <section className="dev-journal" aria-labelledby="dev-journal-title">
            <div className="dev-decoration dev-decoration-code" aria-hidden="true">
              &lt;/&gt;
            </div>
            <div className="dev-decoration dev-decoration-star" aria-hidden="true">
              ✦
            </div>
            <div className="dev-decoration dev-decoration-heart" aria-hidden="true">
              ♡
            </div>

            <header className="dev-header">
              <div>
                <div className="dev-eyebrow">
                  <Code weight="bold" aria-hidden="true" />
                  <span>DEV JOURNAL</span>
                </div>
                <h1 id="dev-journal-title">把今天学会的，写进明天的作品里</h1>
                <p>从第一次运行成功，到慢慢做出真正属于自己的作品。</p>
              </div>
              <a
                className="github-profile"
                href="https://github.com/zhibai-notes"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubLogo weight="bold" aria-hidden="true" />
                <span>
                  <small>GITHUB</small>
                  <strong>@{site.handle}-notes</strong>
                </span>
                <ArrowUpRight weight="bold" aria-hidden="true" />
              </a>
            </header>

            <section className="dev-section" aria-labelledby="tech-stack-title">
              <div className="dev-section-heading">
                <div>
                  <h2 id="tech-stack-title">目前学过的技术与工具</h2>
                </div>
              </div>

              <div className="tech-grid">
                {techGroups.map((group) => (
                  <article className="tech-card" key={group.title}>
                    <div className="tech-card-heading">
                      <div className="tech-card-icon">
                        <Code weight="bold" aria-hidden="true" />
                      </div>
                      <h3>{group.title}</h3>
                    </div>
                    <div className="tech-list">
                      {group.items.map((item) => (
                        <div className="tech-item" key={item.name}>
                          <span className={`tech-mark tone-${item.tone}`}>{item.mark}</span>
                          <strong>{item.name}</strong>
                          <small>{item.note}</small>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dev-section" aria-labelledby="dev-projects-title">
              <div className="dev-section-heading">
                <div>
                  <h2 id="dev-projects-title">做过的东西</h2>
                </div>
              </div>

              <div className="project-grid">
                {projects.map((project) => (
                  <article className="project-card" key={project.number}>
                    <span className="project-number">{project.number}</span>
                    <div>
                      <div className="project-title-row">
                        <span className="project-icon">{project.icon}</span>
                        <h3>{project.title}</h3>
                      </div>
                      <div className="project-tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <p className="project-copy">{project.copy}</p>
                    </div>
                    <span className="project-arrow" aria-hidden="true">
                      <ArrowUpRight weight="bold" />
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="dev-section contribution-section" aria-labelledby="contribution-title">
              <div className="dev-section-heading contribution-heading">
                <span className="dev-section-kicker">写作记录</span>
                <h2 id="contribution-title">写字留下的小脚印</h2>
              </div>

              <div className="contribution-paper">
                <div className="contribution-count-line" aria-live="polite">
                  <strong>{heatmap.total}</strong>
                  <span>篇文章 · 存在本地的记录</span>
                </div>
                <p className="contribution-status">
                  这里没有接入 GitHub，格子对应的是本站的更新日期。
                </p>

                <div className="contribution-scroll" tabIndex={0} aria-label="过去一年的更新日历">
                  <div className="github-calendar">
                    <div className="contribution-months" aria-hidden="true">
                      {heatmap.months.map((month) => (
                        <span key={`${month.label}-${month.column}`} style={{ gridColumn: month.column }}>
                          {month.label}
                        </span>
                      ))}
                    </div>
                    <div className="github-calendar-body">
                      <div className="contribution-weekdays" aria-hidden="true">
                        <span style={{ gridRow: 2 }}>周一</span>
                        <span style={{ gridRow: 4 }}>周三</span>
                        <span style={{ gridRow: 6 }}>周五</span>
                      </div>
                      <div className="contribution-grid">
                        {heatmap.cells.map((cell) => (
                          <span
                            key={cell.date}
                            className="contribution-cell"
                            data-level={cell.level}
                            title={`${cell.date}${cell.level ? " · 有更新" : ""}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="contribution-footer">
                  <div className="contribution-legend" aria-label="图例">
                    <span>少</span>
                    {[0, 1, 2, 3, 4].map((level) => (
                      <i key={level} data-level={level} />
                    ))}
                    <span>多</span>
                  </div>
                </div>
              </div>
            </section>

            <p className="dev-footer-note">
              技术会过时，记下来的过程不会。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
