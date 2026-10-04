import { Link } from "react-router-dom";
import { CalendarBlank, Clock, FolderSimple, Tag } from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react";
import SpotlightCard from "../bits/SpotlightCard";
import type { Post } from "../../content/posts";

export function PostCard({ post, index }: { post: Post; index: number }) {
  const coverWidth = "30%";

  const inner = (
    <>
      <Link to={`/posts/${post.slug}/`} className="absolute inset-0 z-0" aria-label={post.title} />

      <span className="post-card-sticker sticker-ribbon" aria-hidden="true">
        🎀
      </span>
      <span className="post-card-sticker sticker-sparkles" aria-hidden="true">
        ⋆｡˚
      </span>
      <span className="post-card-sticker sticker-note" aria-hidden="true">
        (˶ᵔ ᵕ ᵔ˶)
      </span>

      <div className="flex w-full flex-col md:flex-row">
        <div className="pl-6 md:pl-9 pr-6 md:pr-9 pt-6 md:pt-7 pb-6 relative z-10 w-full md:w-[calc(100%-var(--coverWidth))]">
          <Link
            to={`/posts/${post.slug}/`}
            className="post-card-title transition group w-full block font-bold mb-3 text-[1.3rem] md:text-[1.7rem] leading-snug text-black/85 dark:text-white/90 hover:text-[var(--primary)] active:text-[var(--title-active)] relative"
          >
            {post.title}
          </Link>

          <div className="flex flex-wrap text-neutral-500 dark:text-neutral-400 items-center gap-4 mb-4 relative z-10">
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
            <div className="items-center hidden md:flex">
              <span className="meta-icon">
                <Tag weight="bold" />
              </span>
              <div className="flex flex-row flex-nowrap items-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/archive/?tag=${encodeURIComponent(tag)}`}
                    className="link-lg transition text-sm font-medium hover:text-[var(--primary)] whitespace-nowrap"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <p className="transition text-[var(--text-muted)] mb-3.5 pr-4 line-clamp-2 md:line-clamp-1">
            {post.excerpt}
          </p>

          <div className="post-card-reading text-sm text-black/30 dark:text-white/30 flex gap-3 transition">
            <div>{post.excerpt.length} 字</div>
            <div>|</div>
            <div className="flex items-center gap-1">
              <Clock weight="bold" className="text-xs" />
              {post.readingMinutes} 分钟
            </div>
          </div>
        </div>

        <div className="relative hidden md:block md:w-[var(--coverWidth)] shrink-0 overflow-hidden">
          <img
            src={post.cover}
            alt=""
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/10 to-transparent" />
        </div>
      </div>
    </>
  );

  if (post.pinned) {
    return (
      <SpotlightCard
        spotlightColor="rgba(102, 204, 255, 0.22)"
        className="post-card card-base flex flex-col w-full rounded-[var(--radius-large)] overflow-hidden relative transition-all duration-300 is-pinned onload-animation"
      >
        {inner}
      </SpotlightCard>
    );
  }

  return (
    <article
      className="post-card card-base flex flex-col w-full rounded-[var(--radius-large)] overflow-hidden relative transition-all duration-300 onload-animation"
      style={{ animationDelay: `calc(var(--content-delay) + ${index * 60}ms)`, ["--coverWidth" as string]: coverWidth }}
    >
      {inner}
      <Link
        to={`/posts/${post.slug}/`}
        aria-label={`阅读 ${post.title}`}
        className="post-card-desktop-arrow hidden md:flex absolute bottom-4 right-4 z-20 h-9 w-9 items-center justify-center rounded-full text-[var(--primary)] transition hover:bg-[var(--btn-plain-bg-hover)]"
      >
        <ArrowRight weight="bold" />
      </Link>
    </article>
  );
}
