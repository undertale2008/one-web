import { useMemo, useState } from "react";
import { Article, ChartLineUp, Clock, Database, Tag as TagIcon } from "@phosphor-icons/react";
import CountUp from "../components/bits/CountUp";
import { bangumiList } from "../data/site";
import { categories, plainTextOf, posts, seriesGroups, tags } from "../content/posts";

type MetricTab = "分类" | "标签" | "系列";
type CostTab = "字数" | "分钟";

const wordCountOf = (slug: string) => plainTextOf(slug).length;

export function StatsPage() {
  const [metricTab, setMetricTab] = useState<MetricTab>("分类");
  const [costTab, setCostTab] = useState<CostTab>("字数");

  const data = useMemo(() => {
    const ordered = [...posts].sort((a, b) => (a.date < b.date ? -1 : 1));
    const perPost = ordered.map((post) => ({
      ...post,
      words: wordCountOf(post.slug),
    }));
    const totalWords = perPost.reduce((sum, post) => sum + post.words, 0);
    const newest = perPost[perPost.length - 1];
    const oldest = perPost[0];
    const daysRunning = Math.max(
      1,
      Math.round(
        (Date.now() - new Date(`${oldest.date}T00:00:00`).getTime()) / 86_400_000
      )
    );
    const seriesCount = seriesGroups.reduce((sum, group) => sum + group.items.length, 0);
    return { perPost, totalWords, newest, oldest, daysRunning, seriesCount };
  }, []);

  const metricRows = useMemo(() => {
    if (metricTab === "分类") return categories.map((item) => ({ name: item.name, value: item.count }));
    if (metricTab === "标签") return tags.map((item) => ({ name: item.name, value: item.count }));
    return seriesGroups.flatMap((group) =>
      group.items.map((item) => ({ name: item.name, value: item.count }))
    );
  }, [metricTab]);

  const metricMax = Math.max(1, ...metricRows.map((row) => row.value));

  const costRows = useMemo(() => {
    const rows = [...data.perPost]
      .sort((a, b) =>
        costTab === "字数" ? b.words - a.words : b.readingMinutes - a.readingMinutes
      )
      .slice(0, 6);
    return rows.map((post) => ({
      name: post.title,
      value: costTab === "字数" ? post.words : post.readingMinutes,
    }));
  }, [costTab, data.perPost]);

  const costMax = Math.max(1, ...costRows.map((row) => row.value));
  const chartMax = Math.max(1, ...data.perPost.map((post) => post.words));

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="stats-page-shell">
          <section className="stats-garden" aria-labelledby="stats-title" data-stats-state="ready">
            <div className="stats-decoration stats-decoration-heart" aria-hidden="true">
              ♡
            </div>
            <div className="stats-decoration stats-decoration-star" aria-hidden="true">
              ✦
            </div>
            <div className="stats-decoration stats-decoration-note" aria-hidden="true">
              ♪
            </div>

            <header className="stats-header">
              <div>
                <div className="stats-eyebrow">
                  <ChartLineUp weight="bold" aria-hidden="true" />
                  <span>SITE DIARY</span>
                </div>
                <h1 id="stats-title">小站的账本</h1>
                <p>没有接入访问统计，这里记的是我自己能看到的那部分数字。</p>
              </div>
              <div id="stats-sync-status" className="stats-sync-status" aria-live="polite">
                本地统计 · 数据来自站内文件
              </div>
            </header>

            <div className="stats-cards" aria-label="本站内容概览">
              <article className="stats-card stats-card-pink">
                <div className="stats-card-icon">
                  <Article weight="bold" aria-hidden="true" />
                </div>
                <div className="stats-card-copy">
                  <strong>
                    <CountUp to={posts.length} duration={1.1} />
                  </strong>
                  <small>篇文章写在这里</small>
                </div>
              </article>

              <article className="stats-card stats-card-peach">
                <div className="stats-card-icon">
                  <Database weight="bold" aria-hidden="true" />
                </div>
                <div className="stats-card-copy">
                  <strong>
                    <CountUp to={data.totalWords} duration={1.4} separator="," />
                  </strong>
                  <small>字慢慢敲出来</small>
                </div>
              </article>

              <article className="stats-card stats-card-purple">
                <div className="stats-card-icon">
                  <TagIcon weight="bold" aria-hidden="true" />
                </div>
                <div className="stats-card-copy">
                  <strong>
                    <CountUp to={data.seriesCount} duration={1.1} />
                  </strong>
                  <small>个系列在连载</small>
                </div>
              </article>

              <article className="stats-card stats-card-blue">
                <div className="stats-card-icon">
                  <Clock weight="bold" aria-hidden="true" />
                </div>
                <div className="stats-card-copy">
                  <strong>
                    <CountUp to={bangumiList.length} duration={1.1} />
                  </strong>
                  <small>部番剧在记录</small>
                </div>
              </article>
            </div>

            <div className="stats-story-grid">
              <section className="stats-chart-panel" aria-labelledby="stats-chart-title">
                <div className="stats-section-heading">
                  <div>
                    <h2 id="stats-chart-title">写作足迹</h2>
                  </div>
                  <div className="stats-chart-legend">每篇的字数 · 按时间排列</div>
                </div>

                <div className="stats-chart" aria-label="每篇文章字数柱状图">
                  {data.perPost.map((post) => (
                    <div className="stats-chart-column" key={post.slug}>
                      <span
                        className="stats-chart-bar"
                        style={{ height: `${Math.round((post.words / chartMax) * 100)}%` }}
                        title={`${post.title} · ${post.words} 字`}
                      />
                      <small>{post.date.slice(5)}</small>
                    </div>
                  ))}
                </div>

                <div className="stats-chart-footer">
                  从 {data.oldest.date} 的第一篇，到 {data.newest.date} 的这一篇。
                </div>
              </section>

              <aside className="stats-note-panel">
                <div className="stats-note-tape" aria-hidden="true" />
                <h2>小站手账</h2>
                <p className="stats-running-copy">
                  已经认真营业 <strong>{data.daysRunning}</strong> 天啦！
                </p>
                <div className="stats-content-list">
                  <div>
                    <strong>{posts.length}</strong>
                    <small>篇</small>
                  </div>
                  <div>
                    <strong>{data.totalWords.toLocaleString("zh-CN")}</strong>
                    <small>字</small>
                  </div>
                  <div>
                    <strong>{categories.length}</strong>
                    <small>个分类</small>
                  </div>
                  <div>
                    <strong>{tags.length}</strong>
                    <small>枚标签</small>
                  </div>
                </div>
                <div className="stats-note-bottom">
                  最近一次更新：{data.newest.date}
                </div>
              </aside>
            </div>

            <div className="stats-insights-grid">
              <section className="stats-insight-panel" aria-labelledby="stats-distribution-title">
                <div className="stats-section-heading stats-insight-heading">
                  <div>
                    <h2 id="stats-distribution-title">内容分布</h2>
                  </div>
                </div>

                <div className="stats-metric-tabs" role="tablist" aria-label="内容分布分类">
                  {(["分类", "标签", "系列"] as MetricTab[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={metricTab === item}
                      className={metricTab === item ? "is-active" : undefined}
                      onClick={() => setMetricTab(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="stats-metric-list" role="tabpanel">
                  {metricRows.map((row) => (
                    <div className="stats-metric-row" key={row.name}>
                      <span className="stats-metric-dot" aria-hidden="true" />
                      <span className="stats-metric-name">{row.name}</span>
                      <span className="stats-metric-value">
                        {row.value}
                        <span
                          className="stats-metric-bar"
                          style={{ width: `${Math.round((row.value / metricMax) * 100)}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="stats-insight-panel" aria-labelledby="stats-cost-title">
                <div className="stats-section-heading stats-insight-heading">
                  <div>
                    <h2 id="stats-cost-title">阅读成本</h2>
                  </div>
                </div>

                <div className="stats-metric-tabs" role="tablist" aria-label="阅读成本分类">
                  {(["字数", "分钟"] as CostTab[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={costTab === item}
                      className={costTab === item ? "is-active" : undefined}
                      onClick={() => setCostTab(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="stats-metric-list" role="tabpanel">
                  {costRows.map((row) => (
                    <div className="stats-metric-row" key={row.name}>
                      <span className="stats-metric-dot" aria-hidden="true" />
                      <span className="stats-metric-name">{row.name}</span>
                      <span className="stats-metric-value">
                        {row.value}
                        <span
                          className="stats-metric-bar"
                          style={{ width: `${Math.round((row.value / costMax) * 100)}%` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <footer className="stats-footer-note">
              <span aria-hidden="true">୨୧</span>
              这里只统计本站自己的内容，不收集访问者信息。
            </footer>
          </section>
        </div>
      </div>
    </main>
  );
}
