import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Article,
  CalendarDots,
  ChartLineUp,
  Eye,
  FolderSimple,
  Tag,
  TextAlignLeft,
  Timer,
  Users,
} from "@phosphor-icons/react";
import { SiteCalendar } from "./SiteCalendar";
import { categories, plainTextOf, posts, tags } from "../../content/posts";

const totalWords = posts.reduce((sum, post) => sum + plainTextOf(post.slug).length, 0);

/** 站点开始运转的时间：取最早一篇文章的日期。 */
const startedAt = new Date(
  `${[...posts].sort((a, b) => (a.date < b.date ? -1 : 1))[0].date}T00:00:00`
);

/**
 * 「已运行」按秒跳动。为了避免每秒重渲染整块侧栏，这里直接改 DOM 文本。
 */
function useRunningClock() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const render = () => {
      const node = ref.current;
      if (!node) return;
      const seconds = Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000));
      const days = Math.floor(seconds / 86_400);
      const hours = Math.floor((seconds % 86_400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      node.textContent = `${days} 天 ${hours} 时 ${minutes} 分 ${seconds % 60} 秒`;
    };

    render();
    const timer = window.setInterval(render, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return ref;
}

/** 侧栏「站点统计」：能算的算真的，没有的明确写未接入。 */
function SiteStats() {
  const clockRef = useRunningClock();

  return (
    <div className="flex flex-col gap-3 px-1">
      <div className="flex items-start gap-2.5">
        <Timer weight="bold" className="site-stats-icon text-[var(--primary-ink)]" aria-hidden="true" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">已运行</span>
          <span ref={clockRef} className="text-sm font-bold tabular-nums text-neutral-700 dark:text-neutral-200" />
        </div>
      </div>

      {[
        { icon: <Eye weight="bold" />, label: "今日访问", value: "未接入" },
        { icon: <Users weight="bold" />, label: "总访客", value: "未接入" },
        { icon: <ChartLineUp weight="bold" />, label: "总访问", value: "未接入" },
      ].map((row) => (
        <div className="flex items-start gap-2.5" key={row.label}>
          <span className="site-stats-icon text-[var(--primary-ink)]" aria-hidden="true">
            {row.icon}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{row.label}</span>
            <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500">{row.value}</span>
          </div>
        </div>
      ))}

      {[
        { icon: <TextAlignLeft weight="bold" />, label: "文章字数", value: totalWords.toLocaleString("zh-CN") },
        { icon: <Article weight="bold" />, label: "文章数量", value: String(posts.length) },
        { icon: <FolderSimple weight="bold" />, label: "分类", value: String(categories.length) },
        { icon: <Tag weight="bold" />, label: "标签", value: String(tags.length) },
      ].map((row) => (
        <div className="flex items-start gap-2.5" key={row.label}>
          <span className="site-stats-icon text-[var(--primary-ink)]" aria-hidden="true">
            {row.icon}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{row.label}</span>
            <span className="text-sm font-bold tabular-nums text-neutral-700 dark:text-neutral-200">
              {row.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Widget({
  title,
  icon,
  delay,
  children,
  className = "",
}: {
  title: string;
  icon: React.ReactNode;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`pb-4 card-base widget-card onload-animation ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="widget-card-glass" aria-hidden="true" />
      <div className="widget-heading font-bold transition text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5 ml-4 mt-4 mb-3">
        <span className="widget-heading-icon">{icon}</span>
        {title}
      </div>
      <div className="collapse-wrapper px-4">{children}</div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div
      id="sidebar"
      className="mb-4 row-start-2 row-end-3 col-span-2 lg:row-start-1 lg:row-end-2 lg:col-span-1 lg:max-w-[17.5rem] onload-animation w-full"
    >
      <div id="sidebar-sticky" className="transition-all duration-700 flex flex-col w-full gap-4">
        <div id="sidebar-widgets" className="flex flex-col w-full gap-4 transition-swup-fade">
          <Widget title="日历" icon={<CalendarDots weight="bold" />} delay={150} className="calendar-card">
            <SiteCalendar />
          </Widget>

          <Widget title="分类" icon={<FolderSimple weight="bold" />} delay={200}>
            <div className="grid gap-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/archive/?category=${encodeURIComponent(category.name)}`}
                  aria-label={`查看「${category.name}」分类下的全部文章`}
                  className="flex h-10 w-full items-center justify-between rounded-lg pl-2 pr-2 text-neutral-700 transition-all hover:bg-[var(--btn-plain-bg-hover)] hover:pl-3 hover:text-[var(--primary)] active:bg-[var(--btn-plain-bg-active)] dark:text-neutral-300 dark:hover:text-[var(--primary)]"
                >
                  <span className="mr-2 truncate text-left">{category.name}</span>
                  <span className="flex h-7 min-w-[2rem] items-center justify-end px-2 text-sm font-medium text-black/30 dark:text-white/30">
                    {category.count}
                  </span>
                </Link>
              ))}
            </div>
          </Widget>

          <Widget title="标签" icon={<Tag weight="bold" />} delay={250}>
            <div className="flex flex-wrap gap-2 pb-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  to={`/archive/?tag=${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--primary)_14%,var(--glass-border))] bg-[color-mix(in_srgb,var(--glass-card)_72%,transparent)] px-3 py-1.5 text-xs transition hover:-translate-y-0.5 hover:text-[var(--primary)]"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </Widget>

          <Widget title="站点统计" icon={<ChartLineUp weight="bold" />} delay={300}>
            <SiteStats />
          </Widget>
        </div>
      </div>
    </div>
  );
}
