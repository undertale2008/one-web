import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { categories, plainTextOf, posts, seriesGroups, tags } from "../../content/posts";

type Result = {
  title: string;
  meta: string;
  href: string;
  snippet?: string;
};

/**
 * Local full-text search over the content this site ships with: article
 * bodies, series, categories and tags. Loading, empty and no-result states
 * included. The index is built from the same modules the pages render, so it
 * stays in sync without a separate build step.
 */

/** 取匹配位置前后的文字，做成一条高亮摘要。 */
function snippetFor(text: string, query: string, radius = 42) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return null;
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + query.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    setReady(false);
    const timer = window.setTimeout(() => {
      setReady(true);
      inputRef.current?.focus();
    }, 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  const index = useMemo<Result[]>(
    () => [
      ...posts.map((post) => ({
        title: post.title,
        meta: `文章 · ${post.date}`,
        href: `/posts/${post.slug}/`,
        snippet: `${post.excerpt} ${plainTextOf(post.slug)}`,
      })),
      ...seriesGroups.flatMap((group) =>
        group.items.map((item) => ({
          title: item.name,
          meta: `系列 · ${group.category}`,
          href: `/posts/${item.slug}/`,
        }))
      ),
      ...categories.map((category) => ({
        title: category.name,
        meta: `分类 · ${category.count} 篇`,
        href: `/archive/?category=${encodeURIComponent(category.name)}`,
      })),
      ...tags.map((tag) => ({
        title: tag.name,
        meta: `标签 · ${tag.count} 篇`,
        href: `/archive/?tag=${encodeURIComponent(tag.name)}`,
      })),
    ],
    []
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((item) =>
        `${item.title} ${item.meta} ${item.snippet ?? ""}`.toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((item) => ({
        ...item,
        snippet: item.snippet ? snippetFor(item.snippet, q) ?? undefined : undefined,
      }));
  }, [index, query]);

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <div
      id="search-panel"
      className={`float-panel search-panel fixed w-[calc(100%-2rem)] md:w-[30rem] left-1/2 -translate-x-1/2 shadow-xl rounded-2xl p-2 z-50 ${
        open ? "" : "float-panel-closed"
      }`}
      style={{ top: "5rem" }}
      role="dialog"
      aria-label="站内搜索"
      aria-hidden={!open}
    >
      <div className="flex relative transition-all items-center h-11 rounded-xl bg-black/[0.04] hover:bg-black/[0.06] focus-within:bg-black/[0.06] dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10">
        <Icon
          name="search"
          className="absolute left-3 text-lg text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "Enter" && results[0]) go(results[0].href);
          }}
          placeholder="搜索文章、系列、分类或标签"
          aria-label="搜索关键词"
          className="pl-10 pr-4 absolute inset-0 w-full text-sm bg-transparent outline-0 text-[var(--text-body)] placeholder:text-[var(--text-muted)]"
        />
      </div>

      {open && query.trim().length > 0 && (
        <div className="mt-2 max-h-[22rem] overflow-y-auto px-1 pb-1">
          {!ready ? (
            <ul className="grid gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((row) => (
                <li key={row} className="h-11 animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
              ))}
            </ul>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-[var(--text-muted)]">
              没有找到和「{query.trim()}」有关的内容，换个关键词试试。
            </p>
          ) : (
            <ul className="grid gap-1">
              {results.map((result) => (
                <li key={`${result.href}-${result.title}`}>
                  <button
                    type="button"
                    onClick={() => go(result.href)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-[var(--btn-plain-bg-hover)] active:scale-[0.99]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-[var(--text-strong)]">
                        <Highlight text={result.title} query={query.trim()} />
                      </span>
                      <span className="block text-xs text-[var(--text-muted)]">{result.meta}</span>
                      {result.snippet && (
                        <span className="search-result-snippet mt-1 block">
                          <Highlight text={result.snippet} query={query.trim()} />
                        </span>
                      )}
                    </span>
                    <Icon name="chevron-right" className="text-[var(--primary)]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
