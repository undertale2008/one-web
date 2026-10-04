import { Link } from "react-router-dom";
import { Compass } from "@phosphor-icons/react";

export function NotFoundPage() {
  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="article-map max-w-3xl mx-auto">
          <header className="map-hero onload-animation">
            <div className="map-stickers" aria-hidden="true">
              <span>✦</span>
              <span>♡</span>
            </div>
            <p>
              <Compass weight="bold" aria-hidden="true" /> 404
            </p>
            <h1>
              这一页还没写 <span>(￣▽￣)</span>
            </h1>
            <div className="map-subtitle">链接可能已经搬家，或者从来就不存在。</div>
            <div className="map-counts">
              <Link to="/" className="underline decoration-dashed underline-offset-4">
                回主页
              </Link>
              <i />
              <Link to="/series/" className="underline decoration-dashed underline-offset-4">
                去文章地图
              </Link>
            </div>
          </header>
        </div>
      </div>
    </main>
  );
}
