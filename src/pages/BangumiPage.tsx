import { useMemo, useState } from "react";
import { Star } from "@phosphor-icons/react";
import CountUp from "../components/bits/CountUp";
import { bangumiList, statusLabels, type WatchStatus } from "../data/site";

type Tab = "all" | WatchStatus;

export function BangumiPage() {
  const [tab, setTab] = useState<Tab>("all");

  const counts = useMemo(() => {
    const map = new Map<WatchStatus, number>();
    bangumiList.forEach((entry) => map.set(entry.status, (map.get(entry.status) ?? 0) + 1));
    return map;
  }, []);

  const scored = useMemo(
    () => bangumiList.filter((entry) => entry.score !== null) as (typeof bangumiList[number] & { score: number })[],
    []
  );

  const stats = useMemo(() => {
    const total = bangumiList.length;
    const completed = counts.get(2) ?? 0;
    const rate = total === 0 ? 0 : (completed / total) * 100;
    const average = scored.length
      ? scored.reduce((sum, entry) => sum + entry.score, 0) / scored.length
      : 0;
    const deviation = scored.length
      ? Math.sqrt(
          scored.reduce((sum, entry) => sum + (entry.score - average) ** 2, 0) / scored.length
        )
      : 0;
    const episodes = bangumiList.reduce((sum, entry) => sum + entry.episodes, 0);
    return { total, completed, rate, average, deviation, episodes, scoredCount: scored.length };
  }, [counts, scored]);

  const visible = useMemo(
    () => (tab === "all" ? bangumiList : bangumiList.filter((entry) => entry.status === tab)),
    [tab]
  );

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "全部", count: stats.total },
    ...[5, 4, 3, 2, 1].map((status) => ({
      id: status as WatchStatus,
      label: statusLabels[status as WatchStatus].tab,
      count: counts.get(status as WatchStatus) ?? 0,
    })),
  ];

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="bangumi-page">
          <div className="bangumi-sticker-field" aria-hidden="true">
            <span>✦</span>
            <span>♡</span>
            <span>₊˚⊹</span>
          </div>

          <header className="bangumi-hero">
            <div className="bangumi-hero-copy">
              <p className="bangumi-eyebrow">今日也在快乐追番</p>
              <h1>我的追番小窝</h1>
              <p className="bangumi-subtitle">
                看过的、正在追的、准备看的，统统收进来！下一部会遇见怎样的故事呢？(｡•̀ᴗ-)✧
              </p>
              <div className="bangumi-energy" aria-label="追番状态">
                <span>
                  在追 <b>{counts.get(3) ?? 0}</b> 部
                </span>
                <span>
                  看完 <b>{stats.completed}</b> 部
                </span>
                <span>
                  平均 <b>{stats.average.toFixed(2)}</b> 分
                </span>
              </div>
            </div>
          </header>

          <section className="bangumi-insights" aria-label="追番数据">
            <div className="bangumi-insights-heading">
              <div>
                <strong>追番数据</strong>
              </div>
              <small>来自本地收藏清单</small>
            </div>
            <div className="bangumi-insights-content">
              <div className="bangumi-metrics">
                <div className="bangumi-metric metric-collection">
                  <strong>
                    <CountUp to={stats.total} duration={1.1} />
                  </strong>
                  <span>收藏总数</span>
                </div>
                <div className="bangumi-metric metric-completed">
                  <strong>
                    <CountUp to={stats.completed} duration={1.1} />
                  </strong>
                  <span>已看完</span>
                </div>
                <div className="bangumi-metric metric-rate">
                  <strong>
                    <CountUp to={Number(stats.rate.toFixed(1))} duration={1.1} />%
                  </strong>
                  <span>完成率</span>
                </div>
                <div className="bangumi-metric metric-average">
                  <strong>{stats.average.toFixed(2)}</strong>
                  <span>平均分</span>
                </div>
                <div className="bangumi-metric metric-deviation">
                  <strong>{stats.deviation.toFixed(2)}</strong>
                  <span>标准差</span>
                </div>
                <div className="bangumi-metric metric-count">
                  <strong>
                    <CountUp to={stats.episodes} duration={1.2} />
                  </strong>
                  <span>总集数</span>
                </div>
              </div>
            </div>
          </section>

          <nav className="bangumi-tabs" aria-label="按观看状态筛选">
            {tabs.map((item) => (
              <button
                key={String(item.id)}
                type="button"
                aria-pressed={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`tab-btn bangumi-tab ${tab === item.id ? "is-active" : "bangumi-tab-inactive"}`}
              >
                {item.label} <span>{item.count}</span>
              </button>
            ))}
          </nav>

          <section className="bangumi-grid" id="bangumi-grid" aria-label="番剧收藏列表">
            {visible.map((entry) => {
              const status = statusLabels[entry.status];
              return (
                <article className="bangumi-item" key={entry.title} data-type={entry.status}>
                  <a
                    href={`https://bgm.tv/subject_search/${encodeURIComponent(entry.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`在 Bangumi 搜索 ${entry.title}`}
                  >
                    <div className="bangumi-poster">
                      {/* 没有正式封面，用标题排版成海报占位 */}
                      <div className="bangumi-image-fallback" style={{ display: "grid" }}>
                        <span>{entry.title}</span>
                      </div>
                      <span className={`bangumi-status bangumi-status-${entry.status}`}>
                        <span aria-hidden="true">{status.glyph}</span>
                        {status.label}
                      </span>
                    </div>
                    <div className="bangumi-card-info">
                      <h2>{entry.title}</h2>
                      <div className="bangumi-tags" aria-label="番剧标签">
                        {entry.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <div className="bangumi-card-meta">
                        <span>
                          {entry.year} · 共 {entry.episodes} 集
                        </span>
                        {entry.score !== null && (
                          <span className="bangumi-score" aria-label={`评分 ${entry.score}`}>
                            <Star weight="fill" aria-hidden="true" /> {entry.score}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                </article>
              );
            })}
          </section>

          {visible.length === 0 && (
            <p className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
              这个分类下还没有记录，去别的标签看看吧。
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
