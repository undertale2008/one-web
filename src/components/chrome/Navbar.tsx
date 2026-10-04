import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Icon } from "./Icon";
import { SearchPanel } from "./SearchPanel";
import { DisplaySettings } from "./DisplaySettings";
import { aboutItem, exploreItems, navItems, site } from "../../data/site";

function NavLink({
  href,
  label,
  icon,
  active,
  onHover,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  active: boolean;
  onHover?: (target: HTMLElement) => void;
  onNavigate?: () => void;
}) {
  return (
    <Link
      to={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      onMouseEnter={(event) => onHover?.(event.currentTarget)}
      className="nav-link-item relative z-10 group h-10 font-bold px-4 flex items-center justify-center active:scale-95 transition-all"
    >
      <span className="flex items-center text-black/75 dark:text-white/75 group-hover:text-[var(--primary)] transition-colors">
        <Icon name={icon} className="mr-1.5 text-[1.05rem]" aria-hidden="true" />
        {label}
      </span>
    </Link>
  );
}

export function Navbar() {
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [displayOpen, setDisplayOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 20;
    setScrolled((current) => (current === next ? current : next));
  });

  /**
   * 指示条是悬停驱动的：鼠标进入某一项时，按该项宽度的 75% 居中展开；
   * 离开导航容器就淡出。与参考站一致，直接改 style，不走 state。
   */
  const showIndicator = useCallback((target: HTMLElement) => {
    const container = menuRef.current;
    const indicator = indicatorRef.current;
    if (!container || !indicator) return;
    const link = target.getBoundingClientRect();
    const nav = container.getBoundingClientRect();
    const offset = link.left - nav.left;
    indicator.style.width = `${link.width * 0.75}px`;
    indicator.style.transform = `translateX(${offset + link.width * 0.125}px)`;
    indicator.style.opacity = "1";
  }, []);

  const hideIndicator = useCallback(() => {
    const indicator = indicatorRef.current;
    if (indicator) indicator.style.opacity = "0";
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setDisplayOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
      setDisplayOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <div
      id="top-row"
      className="z-50 pointer-events-none fixed w-full left-0 right-0 top-0 max-w-[var(--page-width)] px-0 md:px-4 mx-auto pt-4"
    >
      <div id="navbar-wrapper" className="pointer-events-auto">
        <div id="navbar" className="relative z-50">
          <div
            id="navbar-container"
            className={`w-full max-w-[var(--page-width)] h-14 mx-auto flex items-center justify-between pointer-events-none px-0 ${
              scrolled ? "is-scrolled" : ""
            }`}
          >
            <div className="navbar-pill pointer-events-auto h-14 flex items-center relative isolate rounded-full px-4">
              <div className="nav-bg-blur absolute inset-0 rounded-full bg-white/35 dark:bg-black/45 backdrop-blur-2xl border border-white/40 dark:border-white/10 z-[-1] transition-opacity duration-500" />
              <Link
                to="/"
                className="btn-plain scale-animation rounded-lg h-10 font-bold active:scale-95"
                aria-label={`${site.title} 首页`}
              >
                <span className="flex flex-row text-[var(--primary)] items-center text-base whitespace-nowrap">
                  <span className="w-8 h-8 rounded-full mr-2 overflow-hidden relative block">
                    <img
                      src={site.avatar}
                      alt=""
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </span>
                  {site.title}
                </span>
              </Link>
            </div>

            <div
              id="nav-menu-container"
              ref={menuRef}
              onMouseLeave={hideIndicator}
              className="navbar-pill pointer-events-auto h-14 hidden md:flex relative items-center rounded-full px-2"
            >
              <div className="nav-bg-blur absolute inset-0 rounded-full bg-white/35 dark:bg-black/45 backdrop-blur-2xl border border-white/40 dark:border-white/10 z-0 transition-opacity duration-500" />
              <div
                id="nav-indicator"
                ref={indicatorRef}
                className="absolute bottom-1 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent transition-all duration-300 opacity-0 pointer-events-none"
              />

              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon as Parameters<typeof Icon>[0]["name"]}
                  active={isActive(item.href)}
                  onHover={showIndicator}
                />
              ))}

              <div
                className="nav-dropdown relative z-10 h-10"
                onMouseEnter={(event) => {
                  const trigger = event.currentTarget.querySelector("button");
                  if (trigger) showIndicator(trigger);
                }}
              >
                <button
                  type="button"
                  className="nav-dropdown-trigger nav-link-item relative group h-10 cursor-pointer font-bold px-4 flex items-center justify-center transition-all"
                  aria-haspopup="true"
                >
                  <span className="flex items-center text-black/75 dark:text-white/75 group-hover:text-[var(--primary)] transition-colors">
                    <Icon name="explore" className="mr-1.5 text-[1.05rem]" aria-hidden="true" />
                    探索
                    <Icon name="chevron-down" className="ml-1 text-[0.9rem]" aria-hidden="true" />
                  </span>
                </button>
                <div
                  className="nav-dropdown-panel absolute right-0 top-[calc(100%+0.3rem)] w-44 rounded-xl p-1 opacity-0 invisible translate-y-[-0.3rem] pointer-events-none transition-all duration-200"
                  role="menu"
                >
                  <div className="nav-dropdown-decoration" aria-hidden="true">
                    ✦
                  </div>
                  {exploreItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="nav-dropdown-link group flex min-h-10 items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all"
                      role="menuitem"
                    >
                      <span className="nav-dropdown-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--primary)]">
                        <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} className="text-base" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.78rem] font-bold leading-none text-black/70 dark:text-white/75 group-hover:text-[var(--primary)] transition-colors">
                          {item.label}
                        </span>
                      </span>
                      <Icon name="chevron-right" className="text-sm text-[var(--primary)]" />
                    </Link>
                  ))}
                </div>
              </div>

              <NavLink
                href={aboutItem.href}
                label={aboutItem.label}
                icon={aboutItem.icon as Parameters<typeof Icon>[0]["name"]}
                active={isActive(aboutItem.href)}
                onHover={showIndicator}
              />
            </div>

            <div className="navbar-pill pointer-events-auto h-14 flex items-center relative isolate rounded-full px-2">
              <div className="nav-bg-blur absolute inset-0 rounded-full bg-white/35 dark:bg-black/45 backdrop-blur-2xl border border-white/40 dark:border-white/10 z-[-1] transition-opacity duration-500" />
              <button
                type="button"
                aria-label="搜索面板"
                aria-expanded={searchOpen}
                onClick={() => {
                  setSearchOpen((open) => !open);
                  setDisplayOpen(false);
                  setMenuOpen(false);
                }}
                className="btn-plain scale-animation rounded-lg w-10 h-10 active:scale-90"
              >
                <Icon name="search" className="text-[1.25rem]" />
              </button>
              <button
                type="button"
                aria-label="配色主题"
                title="配色主题"
                aria-expanded={displayOpen}
                onClick={() => {
                  setDisplayOpen((open) => !open);
                  setSearchOpen(false);
                  setMenuOpen(false);
                }}
                className="btn-plain scale-animation rounded-lg h-10 w-10 active:scale-90"
              >
                <Icon name="palette" className="text-[1.25rem]" />
              </button>
              <button
                type="button"
                aria-label="菜单"
                aria-expanded={menuOpen}
                onClick={() => {
                  setMenuOpen((open) => !open);
                  setSearchOpen(false);
                  setDisplayOpen(false);
                }}
                className="btn-plain scale-animation rounded-lg w-10 h-10 active:scale-90 md:hidden!"
              >
                <Icon name="menu" className="text-[1.25rem]" />
              </button>
            </div>
          </div>

          <div
            id="nav-menu-panel"
            className={`float-panel absolute transition-all right-4 px-2 py-2 pointer-events-auto shadow-xl ${
              menuOpen ? "" : "float-panel-closed"
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition"
              >
                <span className="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                  {item.label}
                </span>
                <Icon name="chevron-right" className="transition text-[1.25rem] text-[var(--primary)]" />
              </Link>
            ))}

            <details className="mobile-nav-group">
              <summary className="mobile-nav-summary">
                <span className="mobile-nav-summary-label">探索</span>
                <Icon name="chevron-down" className="mobile-nav-chevron" />
              </summary>
              <div className="mobile-nav-children">
                {exploreItems.map((item) => (
                  <Link key={item.href} to={item.href} className="mobile-nav-child group">
                    <span className="mobile-nav-child-copy">
                      <span>{item.label}</span>
                    </span>
                    <Icon name="chevron-right" className="mobile-nav-child-arrow" />
                  </Link>
                ))}
              </div>
            </details>

            <Link
              to={aboutItem.href}
              className="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)] transition"
            >
              <span className="transition text-black/75 dark:text-white/75 font-bold group-hover:text-[var(--primary)] group-active:text-[var(--primary)]">
                {aboutItem.label}
              </span>
              <Icon name="chevron-right" className="transition text-[1.25rem] text-[var(--primary)]" />
            </Link>
          </div>
        </div>
      </div>

      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <DisplaySettings open={displayOpen} />
    </div>
  );
}
