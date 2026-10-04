import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
import { CaretDown } from "@phosphor-icons/react";
import { Icon } from "../chrome/Icon";
import BlurText from "../bits/BlurText";
import { avatarMessages, heroQuotePlaceholder, heroQuotes, site } from "../../data/site";

/** 空转的旋转小装饰，挂在名字后面。 */
function HeroCharm() {
  return (
    <motion.span
      className="hero-title-charm inline-block"
      aria-hidden="true"
      animate={{ rotate: [0, 16, -8, 12, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
    >
      <Icon name="sparkle" weight="fill" className="inline text-[0.7em]" />
    </motion.span>
  );
}

/**
 * 头像：悬停时由 CSS 做倾斜缩放并浮出气泡；点击在几句话之间轮换，
 * 1.8 秒后自动收起。这里刻意不做跟随鼠标的位移，和参考站保持一致。
 */
function HeroAvatar() {
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<number | null>(null);
  const messageIndex = useRef(
    Math.max(
      0,
      avatarMessages.indexOf(site.avatarBubble)
    ) + 1
  );

  useEffect(
    () => () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    },
    []
  );

  const cycle = useCallback(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;

    bubble.textContent = avatarMessages[messageIndex.current % avatarMessages.length];
    messageIndex.current += 1;
    bubble.classList.remove("is-visible");
    requestAnimationFrame(() => bubble.classList.add("is-visible"));

    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => bubble.classList.remove("is-visible"), 1800);
  }, []);

  return (
    <div className="avatar-scene order-1 md:order-2 flex-shrink-0 flex items-center justify-center w-56 h-56 md:w-72 md:h-72 lg:w-[22rem] lg:h-[22rem]">
      <span className="avatar-tape" aria-hidden="true" />
      <span className="avatar-spark avatar-spark--one" aria-hidden="true">
        ✦
      </span>
      <span className="avatar-spark avatar-spark--two" aria-hidden="true">
        ♡
      </span>

      <button
        id="hero-avatar-button"
        className="avatar-photo"
        type="button"
        aria-label={`点一下${site.nickname}的头像`}
        onClick={cycle}
      >
        <span className="avatar-image-shell">
          <span className="block w-full h-full object-cover overflow-hidden relative">
            <img
              src={site.avatar}
              alt={`${site.nickname}的头像`}
              loading="eager"
              decoding="sync"
              width={512}
              height={512}
              className="w-full h-full object-cover"
            />
          </span>
        </span>
      </button>

      <span className="avatar-bubble" ref={bubbleRef} aria-live="polite">
        {site.avatarBubble}
      </span>
      <span className="avatar-caption" aria-hidden="true">
        {site.avatarCaption}
      </span>
    </div>
  );
}

/**
 * 每日台词：首屏先显示占位文案，随后随机取一条；点击按参考站的节奏重抽
 * （淡出 → 300ms 后换文本 → 0.5s 淡入）。
 */
function HeroQuote() {
  const textRef = useRef<HTMLSpanElement>(null);
  const authorRef = useRef<HTMLSpanElement>(null);

  const pick = useCallback((animate: boolean) => {
    const textEl = textRef.current;
    const authorEl = authorRef.current;
    if (!textEl) return;

    const next = heroQuotes[Math.floor(Math.random() * heroQuotes.length)];

    if (!animate) {
      textEl.textContent = next.text;
      if (authorEl) authorEl.textContent = `- 《${next.from}》`;
      return;
    }

    textEl.style.opacity = "0";
    if (authorEl) authorEl.style.opacity = "0";
    window.setTimeout(() => {
      textEl.textContent = next.text;
      if (authorEl) authorEl.textContent = `- 《${next.from}》`;
      textEl.style.transition = "opacity 0.5s";
      textEl.style.opacity = "1";
      if (authorEl) {
        authorEl.style.transition = "opacity 0.5s";
        authorEl.style.opacity = "0.7";
      }
    }, 300);
  }, []);

  // 首屏先显示占位文案，再按参考站的节奏淡出换成随机台词。
  // 文本只通过 DOM 写入，React 不持有这段内容，避免重渲染把它清掉。
  useLayoutEffect(() => {
    const textEl = textRef.current;
    if (textEl) textEl.textContent = heroQuotePlaceholder;
    const timer = window.setTimeout(() => pick(true), 0);
    return () => window.clearTimeout(timer);
  }, [pick]);

  return (
    <button
      type="button"
      className="hero-quote block text-black/60 dark:text-white/60 text-sm md:text-base font-serif font-medium tracking-wide cursor-pointer text-center"
      title="点击刷新台词"
      onClick={() => pick(true)}
      aria-label="点击换一句台词"
    >
      <span className="hero-quote-heart" aria-hidden="true">
        ♡
      </span>
      <span className="hero-quote-content">
        「
        <span className="quote-text" ref={textRef} />
        」
      </span>
      <span className="quote-author text-xs font-normal ml-2 opacity-70 hidden md:inline-block" ref={authorRef} />
    </button>
  );
}

export function Hero() {
  const scrollToContent = useCallback(() => {
    const grid = document.getElementById("main-grid");
    if (!grid) return;
    const y = grid.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[calc(100dvh-6.5rem)] flex flex-col items-center justify-center"
    >
      <div className="hero-doodles" aria-hidden="true">
        <span className="hero-doodle hero-doodle--note">♫</span>
        <span className="hero-doodle hero-doodle--spark">✦</span>
        <span className="hero-doodle hero-doodle--ribbon">୨୧</span>
        <span className="hero-doodle hero-doodle--heart">♡</span>
      </div>

      <div className="hero-main-content w-full max-w-[var(--page-width)] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 z-10">
        <div className="hero-copy order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left flex-1 w-full md:w-auto mt-6 md:mt-0">
          <div className="hero-copy-intro">
            <div className="hero-kicker" aria-hidden="true">
              <span className="hero-kicker-note">♫</span>
              <span>{site.heroKicker}</span>
              <span className="hero-kicker-heart">୨୧</span>
            </div>

            {/* 单行标题只在 xl 以上成立：更窄的桌面宽度下强制不换行会把头像挤出视口 */}
            <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black/80 dark:text-white/90 leading-tight xl:whitespace-nowrap">
              {site.heroTitlePrefix}{" "}
              <span className="whitespace-nowrap">
                <span className="hero-name-mark text-[var(--primary)]">{site.nickname}</span>
                <HeroCharm />
              </span>
            </h1>

            <BlurText
              text={site.heroQuote}
              delay={90}
              animateBy="words"
              direction="top"
              className="hero-bio text-xl md:text-2xl text-black/70 dark:text-white/70 font-medium leading-relaxed"
            />

            <div className="hero-tags" aria-label="生活关键词">
              {site.heroTags.map((tag, index) => (
                <span className="hero-tag" key={tag}>
                  <span aria-hidden="true">{["♡", "♫", "✦"][index % 3]}</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-socials flex flex-wrap justify-center md:justify-start gap-4">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className={`social-hero-link ${social.kind}-link w-10 h-10 rounded-full backdrop-blur-md border border-white/40 dark:border-white/10 flex items-center justify-center hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm`}
              >
                <Icon
                  name={social.kind as Parameters<typeof Icon>[0]["name"]}
                  className="text-[1.15rem]"
                />
              </a>
            ))}
          </div>
        </div>

        <HeroAvatar />
      </div>

      <div
        className="hero-bottom absolute bottom-8 left-0 w-full flex flex-col items-center justify-center space-y-3 z-10 onload-animation"
        style={{ animationDelay: "300ms" }}
      >
        <HeroQuote />
        <button
          id="scroll-down-btn"
          type="button"
          className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors animate-bounce p-2 mt-2"
          aria-label="Scroll down"
          onClick={scrollToContent}
        >
          <CaretDown weight="bold" className="text-4xl" />
        </button>
      </div>
    </section>
  );
}
