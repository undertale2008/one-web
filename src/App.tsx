import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SiteShell } from "./components/chrome/SiteShell";
import { Hero } from "./components/home/Hero";
import { HomePage } from "./pages/HomePage";
import { SeriesPage } from "./pages/SeriesPage";
import { ArchivePage } from "./pages/ArchivePage";
import { AboutPage } from "./pages/AboutPage";
import { BangumiPage } from "./pages/BangumiPage";
import { StatsPage } from "./pages/StatsPage";
import { DevPage } from "./pages/DevPage";
import { CollectionPage } from "./pages/CollectionPage";
import { StudiosPage } from "./pages/StudiosPage";
import { TravelPage } from "./pages/TravelPage";
import { PostPage } from "./pages/PostPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const FADE_MS = 200;

/** 路由表：首页把 Hero 作为网格上方的内容传进外壳。 */
function routeElements() {
  return (
    <>
      <Route
        path="/"
        element={
          <SiteShell above={<Hero />}>
            <HomePage />
          </SiteShell>
        }
      />
      <Route path="/series" element={<SiteShell><SeriesPage /></SiteShell>} />
      <Route path="/series/" element={<SiteShell><SeriesPage /></SiteShell>} />
      <Route path="/archive" element={<SiteShell><ArchivePage /></SiteShell>} />
      <Route path="/archive/" element={<SiteShell><ArchivePage /></SiteShell>} />
      <Route path="/about" element={<SiteShell><AboutPage /></SiteShell>} />
      <Route path="/about/" element={<SiteShell><AboutPage /></SiteShell>} />
      <Route path="/bangumi" element={<SiteShell><BangumiPage /></SiteShell>} />
      <Route path="/bangumi/" element={<SiteShell><BangumiPage /></SiteShell>} />
      <Route path="/stats" element={<SiteShell><StatsPage /></SiteShell>} />
      <Route path="/stats/" element={<SiteShell><StatsPage /></SiteShell>} />
      <Route path="/dev" element={<SiteShell><DevPage /></SiteShell>} />
      <Route path="/dev/" element={<SiteShell><DevPage /></SiteShell>} />
      <Route path="/collection" element={<SiteShell><CollectionPage /></SiteShell>} />
      <Route path="/collection/" element={<SiteShell><CollectionPage /></SiteShell>} />
      <Route path="/studios" element={<SiteShell><StudiosPage /></SiteShell>} />
      <Route path="/studios/" element={<SiteShell><StudiosPage /></SiteShell>} />
      <Route path="/travel" element={<SiteShell><TravelPage /></SiteShell>} />
      <Route path="/travel/" element={<SiteShell><TravelPage /></SiteShell>} />
      <Route path="/posts/:slug" element={<SiteShell><PostPage /></SiteShell>} />
      <Route path="/posts/:slug/" element={<SiteShell><PostPage /></SiteShell>} />
      <Route path="*" element={<SiteShell><NotFoundPage /></SiteShell>} />
    </>
  );
}

/**
 * 复刻参考站（Swup）的页面切换：离开时给 <html> 加 is-changing + is-animating，
 * 让带 .transition-swup-fade 的容器 0.2s 淡出；随后提交新路由、回到顶部，再淡入。
 * `Routes` 渲染的是「已提交」的 location，所以淡出期间看到的仍是旧页面。
 */
function AnimatedRoutes() {
  const location = useLocation();
  const [shown, setShown] = useState(location);

  useEffect(() => {
    if (location.key === shown.key) return;

    const root = document.documentElement;
    const spacer = document.getElementById("page-height-extend");

    root.classList.add("is-changing", "is-animating");
    spacer?.classList.remove("hidden");
    // 切换页面时不重播错落入场动画（参考站在 link:click 里同样这么做）。
    root.style.setProperty("--content-delay", "0ms");

    const swap = window.setTimeout(() => {
      setShown(location);
      window.scrollTo({ top: 0, behavior: "auto" });
      root.classList.remove("is-animating");
      root.style.removeProperty("--content-delay");
    }, FADE_MS);

    return () => window.clearTimeout(swap);
  }, [location, shown.key]);

  useEffect(() => {
    if (location.key === shown.key) {
      const settle = window.setTimeout(() => {
        document.documentElement.classList.remove("is-changing");
        document.getElementById("page-height-extend")?.classList.add("hidden");
      }, FADE_MS);
      return () => window.clearTimeout(settle);
    }
  }, [location.key, shown.key]);

  return <Routes location={shown}>{routeElements()}</Routes>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
