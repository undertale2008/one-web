import { useMemo, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

type Shelf = "movie" | "anime" | "music";

type Item = {
  category: Shelf;
  title: string;
  note: string;
  tags: string[];
  cover: string;
  href?: string;
  hrefLabel?: string;
};

const items: Item[] = [
  {
    category: "movie",
    title: "你的名字。",
    note: "重看过三次，每次都在同一个镜头停住。",
    tags: ["剧场版", "新海诚"],
    cover: "/images/collection/movie-1.jpg",
    href: "/posts/summer-wars/",
    hrefLabel: "写过观后感",
  },
  {
    category: "movie",
    title: "夏日大作战",
    note: "每年夏天都想再看一遍的那一部。",
    tags: ["剧场版", "家族"],
    cover: "/images/collection/movie-2.jpg",
    href: "/posts/summer-wars/",
    hrefLabel: "写过观后感",
  },
  {
    category: "anime",
    title: "轻音少女",
    note: "放学后茶会的每一集都舍不得快进。",
    tags: ["日常", "音乐"],
    cover: "/images/collection/anime-1.jpg",
    href: "/bangumi/",
    hrefLabel: "在追番墙",
  },
  {
    category: "anime",
    title: "夏目友人帐",
    note: "睡前看一集，第二天心情会好一点。",
    tags: ["治愈", "妖怪"],
    cover: "/images/collection/anime-2.jpg",
    href: "/posts/natsume/",
    hrefLabel: "写过观后感",
  },
  {
    category: "music",
    title: "小小恋歌",
    note: "通勤路上单曲循环过一整个春天。",
    tags: ["日文", "翻唱"],
    cover: "/images/collection/music-1.jpg",
  },
  {
    category: "music",
    title: "風になる",
    note: "骑车的时候听，会不自觉骑快一点。",
    tags: ["民谣", "轻快"],
    cover: "/images/collection/music-2.jpg",
  },
];

const shelves: {
  id: Shelf;
  icon: string;
  kicker: string;
  title: string;
  note: string;
  filterGlyph: string;
  filterLabel: string;
}[] = [
  {
    id: "movie",
    icon: "🎞",
    kicker: "CINEMA SHELF",
    title: "电影放映格",
    note: "嘘，喜欢的电影藏在这里 (˶ᵔ ᵕ ᵔ˶)",
    filterGlyph: "◉",
    filterLabel: "电影格",
  },
  {
    id: "anime",
    icon: "✦",
    kicker: "ANIME SHELF",
    title: "番剧收藏格",
    note: "看过的故事，都在这儿排好队",
    filterGlyph: "✦",
    filterLabel: "番剧格",
  },
  {
    id: "music",
    icon: "♫",
    kicker: "MUSIC SHELF",
    title: "音乐唱片格",
    note: "放一张唱片，慢慢转",
    filterGlyph: "♫",
    filterLabel: "音乐格",
  },
];

export function CollectionPage() {
  const [filter, setFilter] = useState<"all" | Shelf>("all");

  const counts = useMemo(() => {
    const map = new Map<Shelf, number>();
    items.forEach((item) => map.set(item.category, (map.get(item.category) ?? 0) + 1));
    return map;
  }, []);

  const visibleShelves = shelves.filter((shelf) => filter === "all" || shelf.id === filter);
  const visibleCount = items.filter((item) => filter === "all" || item.category === filter).length;

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="collection-page-shell">
          <section className="cabinet-hero">
            <span className="cabinet-hero-tape" aria-hidden="true" />
            <div className="cabinet-hero-copy">
              <div className="cabinet-eyebrow">
                <span aria-hidden="true">✦</span> MY LITTLE COLLECTION{" "}
                <span aria-hidden="true">♡</span>
              </div>
              <h1>小小收藏馆</h1>
              <p>把喜欢的作品与旋律，放进不会落灰的小格子里。</p>
              <div className="cabinet-summary" aria-label="收藏统计">
                <span>
                  <strong>{items.length}</strong> 件收藏
                </span>
                <span>
                  <strong>{counts.get("movie") ?? 0}</strong> 部电影
                </span>
                <span>
                  <strong>{counts.get("anime") ?? 0}</strong> 部番剧
                </span>
                <span>
                  <strong>{counts.get("music") ?? 0}</strong> 首音乐
                </span>
              </div>
            </div>

            <div className="cabinet-hero-visual" aria-hidden="true">
              <div className="mini-shelf">
                <span className="mini-book mini-book-one" />
                <span className="mini-book mini-book-two" />
                <span className="mini-book mini-book-three" />
                <span className="mini-record">♫</span>
                <span className="hero-visual-star">✦</span>
                <span className="hero-visual-heart">♡</span>
              </div>
            </div>
          </section>

          <nav className="cabinet-filters" aria-label="收藏分类">
            <button
              type="button"
              className={`cabinet-filter ${filter === "all" ? "is-active" : ""}`}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              <span aria-hidden="true">♡</span>全部收藏
            </button>
            {shelves.map((shelf) => (
              <button
                key={shelf.id}
                type="button"
                className={`cabinet-filter ${filter === shelf.id ? "is-active" : ""}`}
                aria-pressed={filter === shelf.id}
                onClick={() => setFilter(shelf.id)}
              >
                <span aria-hidden="true">{shelf.filterGlyph}</span>
                {shelf.filterLabel}
              </button>
            ))}
            <span className="cabinet-visible-count" aria-live="polite">
              {visibleCount} 件收藏
            </span>
          </nav>

          <section className="collection-showcase" aria-label="收藏内容">
            {visibleShelves.map((shelf) => (
              <section className="collection-shelf-group" key={shelf.id} data-collection-group={shelf.id}>
                <header className="collection-shelf-header">
                  <div className="collection-shelf-icon" aria-hidden="true">
                    {shelf.icon}
                  </div>
                  <div>
                    <span>{shelf.kicker}</span>
                    <h2>{shelf.title}</h2>
                    <p>{shelf.note}</p>
                  </div>
                </header>

                <div className="collection-grid">
                  {items
                    .filter((item) => item.category === shelf.id)
                    .map((item, index) => (
                      <article
                        className="collection-card"
                        key={item.title}
                        data-category={item.category}
                        style={{ ["--card-index" as string]: index }}
                      >
                        <span className="collection-card-tape" aria-hidden="true" />
                        <div className="collection-media">
                          <span className="collection-vinyl" aria-hidden="true" />
                          <div className="collection-cover">
                            <img src={item.cover} alt={`${item.title} 封面`} loading="lazy" decoding="async" />
                            <span className="collection-cover-shade" aria-hidden="true" />
                            <span className="collection-cover-sparkle" aria-hidden="true">
                              ✦
                            </span>
                          </div>
                        </div>
                        <div className="collection-card-copy">
                          <h3>{item.title}</h3>
                          <p className="collection-card-note">{item.note}</p>
                          <div className="collection-card-tags">
                            {item.tags.map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                          </div>
                          {item.href && (
                            <a className="collection-card-original" href={item.href}>
                              {item.hrefLabel}
                              <ArrowUpRight weight="bold" aria-hidden="true" />
                            </a>
                          )}
                        </div>
                        <span className="collection-card-doodle" aria-hidden="true">
                          ♡
                        </span>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </section>

          <section className="collection-next">
            <span className="collection-next-icon" aria-hidden="true">
              ♫
            </span>
            <p>收藏是把喜欢的时刻留在身边的一种方式，慢慢攒，不着急。</p>
            <span className="collection-next-sparkle" aria-hidden="true">
              ✦
            </span>
          </section>
        </div>
      </div>
    </main>
  );
}
