import { Link } from "react-router-dom";
import { ArrowRight, BookOpenText, Tag, SquaresFour } from "@phosphor-icons/react";
import CountUp from "../components/bits/CountUp";
import FadeContent from "../components/bits/FadeContent";
import { categories, seriesGroups, tags } from "../content/posts";

export function SeriesPage() {
  const seriesCount = seriesGroups.reduce((total, group) => total + group.items.length, 0);

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="article-map max-w-5xl mx-auto">
          <header className="map-hero onload-animation">
            <div className="map-stickers" aria-hidden="true">
              <span>✦</span>
              <span>♡</span>
              <span>₊˚⊹</span>
            </div>
            <p>
              <BookOpenText weight="bold" aria-hidden="true" /> ARTICLE MAP
            </p>
            <h1>
              文章地图 <span>(｡•ᴗ•｡)♡</span>
            </h1>
            <div className="map-subtitle">沿着系列、分类和标签，找到想看的内容。</div>
            <div className="map-counts">
              <span>
                <strong>
                  <CountUp to={seriesCount} duration={1.2} />
                </strong>{" "}
                个系列
              </span>
              <i />
              <span>
                <strong>
                  <CountUp to={categories.length} duration={1.2} />
                </strong>{" "}
                个分类
              </span>
              <i />
              <span>
                <strong>
                  <CountUp to={tags.length} duration={1.2} />
                </strong>{" "}
                个标签
              </span>
            </div>
          </header>

          <section className="map-section series-section onload-animation" style={{ animationDelay: "80ms" }}>
            <div className="section-heading">
              <div className="section-icon series-icon">
                <BookOpenText weight="bold" aria-hidden="true" />
              </div>
              <div>
                <p>按专题慢慢读</p>
                <h2>系列专题</h2>
              </div>
              <span>连续的故事，要从第一篇开始看呀</span>
            </div>

            <div className="series-groups">
              {seriesGroups.map((group) => (
                <div className="series-group" key={group.category}>
                  <Link
                    className="series-category"
                    to={`/archive/?category=${encodeURIComponent(group.category)}`}
                  >
                    {group.category}
                  </Link>
                  <div className="series-links">
                    {group.items.map((item) => (
                      <Link
                        className="series-item"
                        key={item.slug}
                        to={`/posts/${item.slug}/`}
                        aria-label={item.name}
                      >
                        <span className="series-dot" />
                        <span className="series-name">{item.name}</span>
                        <small>{item.count} 篇</small>
                        <ArrowRight weight="bold" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="map-columns">
            <FadeContent
              blur
              duration={700}
              delay={120}
              threshold={0.15}
              className="map-section category-section"
            >
              <div className="section-heading compact">
                <div className="section-icon category-icon">
                  <SquaresFour weight="bold" aria-hidden="true" />
                </div>
                <div>
                  <p>按内容类型找</p>
                  <h2>分类目录</h2>
                </div>
              </div>
              <div className="category-list">
                {categories.map((category) => (
                  <Link key={category.name} to={`/archive/?category=${encodeURIComponent(category.name)}`}>
                    <span>{category.name}</span>
                    <strong>{category.count}</strong>
                  </Link>
                ))}
              </div>
            </FadeContent>

            <FadeContent
              blur
              duration={700}
              delay={200}
              threshold={0.15}
              className="map-section tag-section"
            >
              <div className="section-heading compact">
                <div className="section-icon tag-icon">
                  <Tag weight="bold" aria-hidden="true" />
                </div>
                <div>
                  <p>跟着关键词逛</p>
                  <h2>标签线索</h2>
                </div>
              </div>
              <div className="tag-cloud">
                {tags.map((tag) => (
                  <Link key={tag.name} to={`/archive/?tag=${encodeURIComponent(tag.name)}`}>
                    <span>#</span>
                    {tag.name}
                    <small>{tag.count}</small>
                  </Link>
                ))}
              </div>
            </FadeContent>
          </div>
        </div>
      </div>
    </main>
  );
}
