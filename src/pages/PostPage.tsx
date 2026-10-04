import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  Clock,
  FolderSimple,
  Tag as TagIcon,
  TextAlignLeft,
} from "@phosphor-icons/react";
import { site } from "../data/site";
import {
  outlineOf,
  plainTextOf,
  postBodies,
  posts,
  type Block,
} from "../content/posts";
import { NotFoundPage } from "./NotFoundPage";

const LICENSE = {
  name: "CC BY-NC-SA 4.0",
  href: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

/** 逐字显示的摘要，尊重 prefers-reduced-motion。 */
function TypedDescription({ text }: { text: string }) {
  const [shown, setShown] = useState(text);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setShown(text);
      return;
    }
    setShown("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setShown(text.slice(0, index));
      if (index >= text.length) window.clearInterval(timer);
    }, 45);
    return () => window.clearInterval(timer);
  }, [text, reduce]);

  return (
    <div className="description-content" data-description={text} aria-label={text}>
      <span aria-hidden="true">
        {shown}
        <span className="animate-pulse text-[var(--primary)]">|</span>
      </span>
    </div>
  );
}

function SeriesWidget({ slug }: { slug: string }) {
  const current = posts.find((post) => post.slug === slug);
  const siblings = current?.series
    ? posts.filter((post) => post.series === current.series).sort((a, b) => (a.date > b.date ? 1 : -1))
    : [];

  if (!current?.series || siblings.length === 0) return null;

  return (
    <div className="mb-8 onload-animation">
      <div className="pb-4 px-0">
        <div className="widget-heading font-bold transition text-lg text-neutral-900 dark:text-neutral-100 flex items-center gap-2.5 ml-4 mt-4 mb-3">
          <span className="widget-heading-icon">
            <TextAlignLeft weight="bold" />
          </span>
          系列 - {current.series}
        </div>
        <div className="px-4">
          <div className="flex flex-col gap-1">
            {siblings.map((post) => {
              const isCurrent = post.slug === slug;
              return (
                <Link
                  key={post.slug}
                  to={`/posts/${post.slug}/`}
                  aria-label={post.title}
                  aria-current={isCurrent ? "page" : undefined}
                  className="group btn-plain h-10 w-full rounded-lg hover:text-[initial]"
                >
                  <span className="w-[15%] md:w-[10%] relative dash-line h-full flex items-center">
                    <span
                      className={`transition-all mx-auto w-2 rounded-full z-50 ${
                        isCurrent
                          ? "h-6 bg-[var(--primary)]"
                          : "h-2 bg-[color-mix(in_srgb,var(--primary)_45%,var(--text-muted))] group-hover:h-6 group-hover:bg-[var(--primary)]"
                      }`}
                    />
                  </span>
                  <span
                    className={`w-[85%] text-left font-bold transition overflow-hidden text-ellipsis whitespace-nowrap ${
                      isCurrent
                        ? "text-[var(--primary)]"
                        : "text-black/75 dark:text-white/75 group-hover:text-[var(--primary)]"
                    }`}
                  >
                    {post.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  // 二级标题单独渲染，好挂锚点链接和目录；其余内容由 markdown-it 渲染好的
  // HTML 直接交给 .custom-md 的排版样式处理。
  if (block.kind === "html") {
    return (
      <div className="md-block" dangerouslySetInnerHTML={{ __html: block.html }} />
    );
  }

  return (
    <h2 id={block.id} className="scroll-mt-24">
      {block.text}
      <a className="anchor no-styling" href={`#${block.id}`} aria-label={`复制「${block.text}」的链接`}>
        #
      </a>
    </h2>
  );
}

function TableOfContents({ items }: { items: { id: string; text: string }[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<boolean[]>([]);

  /**
   * 与参考站一致：正在阅读的标题对应的目录项加 .visible（主色 + 加粗），
   * 左侧的指示条用 0.3s 过渡滑到这一段上；没有可见标题时整体隐藏。
   */
  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (headings.length === 0) return;

    activeRef.current = items.map(() => false);

    const linkAt = (index: number) =>
      listRef.current?.querySelector<HTMLAnchorElement>(`[data-toc-index="${index}"]`) ?? null;

    const update = () => {
      const active = activeRef.current;
      const indicator = indicatorRef.current;
      let cursor = active.length - 1;
      let first = active.length - 1;
      let last = -1;

      while (cursor >= 0 && !active[cursor]) {
        linkAt(cursor)?.classList.remove("visible");
        cursor -= 1;
      }
      while (cursor >= 0 && active[cursor]) {
        linkAt(cursor)?.classList.add("visible");
        first = Math.min(first, cursor);
        last = Math.max(last, cursor);
        cursor -= 1;
      }
      while (cursor >= 0) {
        linkAt(cursor)?.classList.remove("visible");
        cursor -= 1;
      }

      if (!indicator) return;
      if (first > last) {
        indicator.style.opacity = "0";
        return;
      }

      const parent = indicator.offsetParent as HTMLElement | null;
      const base = parent ? parent.getBoundingClientRect().top : 0;
      const startBox = linkAt(first)?.getBoundingClientRect();
      const endBox = linkAt(last)?.getBoundingClientRect();
      if (!startBox || !endBox) return;

      indicator.style.opacity = "1";
      indicator.style.top = `${startBox.top - base}px`;
      indicator.style.height = `${endBox.bottom - startBox.top}px`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = items.findIndex((item) => item.id === entry.target.id);
          if (index >= 0) activeRef.current[index] = entry.isIntersecting;
        });
        update();
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    update();
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const toc = (
    <div className="absolute top-0 left-0 w-full z-0 hidden 2xl:block pointer-events-none">
      <div className="relative max-w-[var(--page-width)] mx-auto">
        <nav
          className="hidden lg:block absolute top-0 -right-[var(--toc-width)] w-[var(--toc-width)] pointer-events-auto"
          aria-label="目录"
        >
          <div className="fixed top-14 w-[var(--toc-width)] h-[calc(100vh_-_20rem)] overflow-y-auto overflow-x-hidden hide-scrollbar">
            <div id="toc" className="w-full h-full transition-swup-fade">
              <div className="h-8 w-full" />
              <div className="group relative" ref={listRef}>
                {items.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    data-toc-index={index}
                    className="toc-link px-4 flex relative transition-colors w-full min-h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 py-1.5 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <div className="transition text-sm w-full leading-relaxed font-bold">
                      {item.text}
                    </div>
                  </a>
                ))}
                <div
                  ref={indicatorRef}
                  className="absolute left-0 w-1 rounded-full bg-[var(--primary)] transition-all duration-300"
                  style={{ top: 0, height: 0, opacity: 0 }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );

  // 目录挂在 body 上，避免被主网格与 overflow-hidden 裁掉。
  return createPortal(toc, document.body);
}

export function PostPage() {
  const { slug = "" } = useParams();
  const index = posts.findIndex((post) => post.slug === slug);
  const post = posts[index];
  const body = postBodies[slug];
  const wordCount = useMemo(() => plainTextOf(slug).length, [slug]);
  const outline = useMemo(() => outlineOf(slug), [slug]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (post) document.title = `${post.title} - ${site.title}`;
    return () => {
      document.title = site.title;
    };
  }, [post, slug]);

  if (!post || !body) return <NotFoundPage />;

  const newer = index > 0 ? posts[index - 1] : null;
  const older = index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <>
      <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
        <div id="content-wrapper" className="onload-animation article-content-wrapper">
          <div className="post-article-shell flex w-full card-base overflow-hidden relative mb-4">
            <div
              id="post-container"
              className="z-10 px-6 md:px-9 pt-6 pb-4 relative w-full max-w-4xl mx-auto"
            >
              <header className="post-journal-header">
                <div className="post-header-eyebrow onload-animation">
                  ✦ MY BLOG NOTE (˶ᵔ ᵕ ᵔ˶)
                </div>

                <div className="post-reading-stats flex flex-row text-black/30 dark:text-white/30 gap-3 mb-3 transition onload-animation">
                  <div className="flex flex-row items-center">
                    <div className="transition h-6 w-6 rounded-md bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 flex items-center justify-center mr-2">
                      <TextAlignLeft weight="bold" />
                    </div>
                    <div className="text-sm">{wordCount} 字</div>
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="transition h-6 w-6 rounded-md bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 flex items-center justify-center mr-2">
                      <Clock weight="bold" />
                    </div>
                    <div className="text-sm">{post.readingMinutes} 分钟</div>
                  </div>
                </div>

                <div className="relative onload-animation">
                  <h1
                    ref={headingRef}
                    className="post-title transition w-full block font-bold mb-3 text-3xl md:text-[2.25rem]/[2.75rem] text-black/90 dark:text-white/90 md:before:w-1 before:h-5 before:rounded-md before:bg-[var(--primary)] before:absolute before:top-[0.75rem] before:left-[-1.125rem]"
                  >
                    {post.title}
                  </h1>
                </div>

                <div className="onload-animation">
                  <div className="flex flex-wrap text-neutral-500 dark:text-neutral-400 items-center gap-4 mb-5">
                    <div className="flex items-center">
                      <span className="meta-icon">
                        <CalendarBlank weight="bold" />
                      </span>
                      <time className="text-sm font-medium" dateTime={post.date}>
                        {post.date}
                      </time>
                    </div>
                    <div className="flex items-center">
                      <span className="meta-icon">
                        <FolderSimple weight="bold" />
                      </span>
                      <Link
                        to={`/archive/?category=${encodeURIComponent(post.category)}`}
                        className="link-lg transition text-sm font-medium hover:text-[var(--primary)] whitespace-nowrap"
                      >
                        {post.category}
                      </Link>
                    </div>
                    <div className="items-center flex">
                      <span className="meta-icon">
                        <TagIcon weight="bold" />
                      </span>
                      <div className="flex flex-row flex-nowrap items-center">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tag} className="flex items-center">
                            {tagIndex > 0 && (
                              <span className="mx-1.5 text-sm text-[var(--meta-divider)]">/</span>
                            )}
                            <Link
                              to={`/archive/?tag=${encodeURIComponent(tag)}`}
                              className="link-lg transition text-sm font-medium hover:text-[var(--primary)] whitespace-nowrap"
                            >
                              {tag}
                            </Link>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="border-[var(--line-divider)] border-dashed border-b-[1px] mb-5" />
                </div>
              </header>

              {post.description && (
                <div className="article-description onload-animation">
                  <TypedDescription text={post.description} />
                </div>
              )}

              <SeriesWidget slug={slug} />

              <article className="prose dark:prose-invert prose-base max-w-none! custom-md mb-6 markdown-content onload-animation">
                {body.map((block, blockIndex) => (
                  <BlockView key={`${block.kind}-${blockIndex}`} block={block} />
                ))}
              </article>

              <div className="relative transition overflow-hidden bg-[var(--license-block-bg)] py-5 px-6 mb-6 rounded-xl onload-animation">
                <div className="transition font-bold text-black/75 dark:text-white/75">{post.title}</div>
                <a href={`/posts/${post.slug}/`} className="link text-[var(--primary)]">
                  /posts/{post.slug}/
                </a>
                <div className="flex flex-wrap gap-6 mt-2">
                  <div>
                    <div className="transition text-black/30 dark:text-white/30 text-sm">作者</div>
                    <div className="transition text-black/75 dark:text-white/75 line-clamp-2">
                      {site.author}
                    </div>
                  </div>
                  <div>
                    <div className="transition text-black/30 dark:text-white/30 text-sm">发布于</div>
                    <div className="transition text-black/75 dark:text-white/75 line-clamp-2">
                      {post.date}
                    </div>
                  </div>
                  <div>
                    <div className="transition text-black/30 dark:text-white/30 text-sm">许可协议</div>
                    <a
                      href={LICENSE.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link text-[var(--primary)] line-clamp-2"
                    >
                      {LICENSE.name}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between mb-4 gap-4 overflow-hidden w-full">
                {newer ? (
                  <Link
                    to={`/posts/${newer.slug}/`}
                    className="w-full font-bold overflow-hidden active:scale-95"
                    aria-label={`上一篇：${newer.title}`}
                  >
                    <span className="btn-card rounded-2xl w-full h-[3.75rem] max-w-full px-4 flex items-center justify-start! gap-4">
                      <ArrowLeft weight="bold" className="shrink-0 text-[var(--primary)]" />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-black/75 dark:text-white/75">
                        {newer.title}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <span className="w-full" />
                )}
                {older && (
                  <Link
                    to={`/posts/${older.slug}/`}
                    className="w-full font-bold overflow-hidden active:scale-95"
                    aria-label={`下一篇：${older.title}`}
                  >
                    <span className="btn-card rounded-2xl w-full h-[3.75rem] max-w-full px-4 flex items-center justify-end! gap-4">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-black/75 dark:text-white/75">
                        {older.title}
                      </span>
                      <ArrowRight weight="bold" className="shrink-0 text-[var(--primary)]" />
                    </span>
                  </Link>
                )}
              </div>

              <p className="post-reading-note text-center text-sm text-[var(--text-muted)] mb-2">
                ⌁ happy reading ♡
              </p>
            </div>
          </div>
        </div>
      </main>
      <TableOfContents items={outline} />
    </>
  );
}
