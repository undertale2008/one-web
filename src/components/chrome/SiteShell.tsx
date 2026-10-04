import { useEffect } from "react";
import type { ReactNode } from "react";
import ClickSpark from "../bits/ClickSpark";
import { BackgroundLayer } from "./BackgroundLayer";
import { MouseNoteTrail } from "./MouseNoteTrail";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ReadingProgress } from "./ReadingProgress";
import { BackToTop } from "./BackToTop";
import { ThemeSwitch } from "./ThemeSwitch";
import { useResolvedTheme } from "../../lib/settings";

export function SiteShell({ children, above }: { children: ReactNode; above?: ReactNode }) {
  const theme = useResolvedTheme();

  /**
   * 首屏导航栏淡入：与参考站一致，延迟 40ms 再等两帧才移除 navbar-loading；
   * 如果是刷新，则跳过入场动画，避免整页元素重播一遍。
   */
  useEffect(() => {
    const root = document.documentElement;
    const reveal = () => {
      window.setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => root.classList.remove("navbar-loading"));
        });
      }, 40);
    };

    if (window.__isPageReload) {
      document
        .querySelectorAll(".onload-animation")
        .forEach((element) => element.classList.add("skip-enter-animation"));
      root.classList.remove("navbar-loading");
      return;
    }

    reveal();
  }, []);

  return (
    <ClickSpark
      sparkColor={theme === "dark" ? "#8fd8ff" : "#2f9fdd"}
      sparkSize={9}
      sparkRadius={18}
      sparkCount={8}
      duration={420}
    >
      <BackgroundLayer />
      <MouseNoteTrail />
      <ReadingProgress />
      <ThemeSwitch />
      <Navbar />

      <div className="relative w-full pt-[6.5rem]">
        <div id="top-full-width-wrapper" className="transition-swup-fade">
          {above}
        </div>
        <div className="relative max-w-[var(--page-width)] mx-auto pointer-events-auto">
          <div
            id="main-grid"
            className="transition duration-700 w-full left-0 right-0 grid grid-cols-[17.5rem_auto] grid-rows-[auto_1fr_auto] lg:grid-rows-[auto] mx-auto gap-4 px-0 md:px-4 mt-20 lg:mt-0"
          >
            {children}
            <Footer />
          </div>
        </div>
      </div>

      <BackToTop />
      {/* 过渡期间撑住页面高度，避免滚动位置跳变（参考站同款） */}
      <div id="page-height-extend" className="hidden h-[300vh]" aria-hidden="true" />
    </ClickSpark>
  );
}
