import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, FunnelSimple } from "@phosphor-icons/react";
import CountUp from "../components/bits/CountUp";
import { posts } from "../content/posts";

const pad = (value: number) => String(value).padStart(2, "0");

export function ArchivePage() {
  const [params] = useSearchParams();
  const category = params.get("category");
  const tag = params.get("tag");

  const visible = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .filter((post) => {
          if (category && post.category !== category) return false;
          if (tag && !post.tags.includes(tag)) return false;
          return true;
        }),
    [category, tag]
  );

  const yearGroups = useMemo(() => {
    const groups = new Map<string, typeof visible>();
    visible.forEach((post) => {
      const year = post.date.slice(0, 4);
      groups.set(year, [...(groups.get(year) ?? []), post]);
    });
    return [...groups.entries()];
  }, [visible]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const dayOfYear =
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86_400_000) + 1;
  const isLeap = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const yearProgress = ((dayOfYear / (isLeap(currentYear) ? 366 : 365)) * 100).toFixed(4);
  const dayProgress = (
    ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) / 86_400) *
    100
  ).toFixed(4);

  const thisYearCount = posts.filter((post) => post.date.startsWith(String(currentYear))).length;
  const filterLabel = category ? `分类 · ${category}` : tag ? `标签 · ${tag}` : null;

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="archive-page max-w-5xl mx-auto">
          <section className="archive-overview" aria-label="时光轴概览">
            <div className="overview-glow" aria-hidden="true" />
            <div className="overview-stickers" aria-hidden="true">
              <span>♡</span>
              <span>✦</span>
              <span>₊˚⊹</span>
            </div>

            <div className="overview-heading">
              <div>
                <p>时光收藏夹</p>
                <h1>
                  写过的文章，都留在这里 <b>(｡•ᴗ•｡)♡</b>
                </h1>
                <span>翻一翻过去的故事，也看看那时的自己。</span>
              </div>
            </div>

            <div className="overview-metrics">
              <span>
                <strong>
                  <CountUp to={visible.length} duration={1.1} />
                </strong>{" "}
                篇文章
              </span>
              <i aria-hidden="true" />
              <span>
                跨越 <strong>{yearGroups.length}</strong> 个年份
              </span>
              <i aria-hidden="true" />
              <span>
                {currentYear} 年已更新 <strong>{thisYearCount}</strong> 篇
              </span>
              <i aria-hidden="true" />
              <span>
                今天是第 <strong>{dayOfYear}</strong> 天
              </span>
            </div>

            <div className="progress-list">
              <div className="progress-item">
                <div>
                  <span>今年的旅程</span>
                  <strong>{yearProgress}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${yearProgress}%` }} />
                </div>
              </div>
              <div className="progress-item">
                <div>
                  <span>今天的时光</span>
                  <strong>{dayProgress}%</strong>
                </div>
                <div className="progress-track progress-track-day">
                  <span style={{ width: `${dayProgress}%` }} />
                </div>
              </div>
            </div>
          </section>

          {filterLabel && (
            <div className="tag-cloud mb-6 px-1">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] px-3 py-1.5 text-xs text-[var(--primary-ink)]"
                aria-live="polite"
              >
                <FunnelSimple weight="bold" aria-hidden="true" />
                正在筛选 {filterLabel}
              </span>
              <Link to="/archive/">
                <span>#</span>
                清除筛选
              </Link>
            </div>
          )}

          {yearGroups.length === 0 ? (
            <section className="archive-year">
              <p className="px-2 py-12 text-center text-sm text-[var(--text-muted)]">
                这里暂时没有文章，换个分类或标签试试。
              </p>
            </section>
          ) : (
            yearGroups.map(([year, entries]) => (
              <section className="archive-year" key={year}>
                <header className="year-heading">
                  <div className="year-number">{year}</div>
                  <div className="year-marker">
                    <span />
                  </div>
                  <div className="year-summary">
                    <strong>{entries.length} 篇文章</strong>
                    {Number(year) === currentYear && <span>正在书写这一年</span>}
                  </div>
                </header>

                {entries.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/posts/${post.slug}/`}
                    aria-label={post.title}
                    className="timeline-entry"
                  >
                    <time dateTime={post.date}>
                      {pad(Number(post.date.slice(5, 7)))}-{pad(Number(post.date.slice(8, 10)))}
                    </time>
                    <div className="entry-marker">
                      <span />
                    </div>
                    <div className="entry-content">
                      <strong title={post.title}>{post.title}</strong>
                      <div className="entry-tags">
                        {post.tags.length ? post.tags.map((t) => `#${t}`).join(" ") : "未设置标签"}
                      </div>
                    </div>
                    <div className="entry-arrow" aria-hidden="true">
                      <ArrowRight weight="bold" />
                    </div>
                  </Link>
                ))}
              </section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
