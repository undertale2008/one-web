import { useMemo, useState } from "react";
import { AirplaneTilt, House, MapPin, Star } from "@phosphor-icons/react";
import CountUp from "../components/bits/CountUp";
import { chinaMapViewBox, chinaProvinces, mapPlaces } from "../data/chinaMap";

type Place = {
  name: string;
  region: string;
  date: string;
  kind: "home" | "visited";
  note: string;
};

const places: Place[] = [
  {
    name: "杭州",
    region: "浙江",
    date: "常驻",
    kind: "home",
    note: "现在住的地方。春天沿着运河走，秋天去满觉陇看桂花。",
  },
  {
    name: "厦门",
    region: "福建",
    date: "2025-10",
    kind: "visited",
    note: "第一次一个人去看海，在巷子里吃到一碗记到现在的沙茶面。",
  },
  {
    name: "武功山",
    region: "江西",
    date: "2025-08",
    kind: "visited",
    note: "为了看日出云海爬了一夜，雾太大没看成，但山脊上的风很值。",
  },
  {
    name: "广州",
    region: "广东",
    date: "2025-07",
    kind: "visited",
    note: "出差顺路多留了一天，见了广州塔，也吃了两顿早茶。",
  },
  {
    name: "长沙",
    region: "湖南",
    date: "2025-02",
    kind: "visited",
    note: "回家过年。走出高铁站闻到的那股辣味，就是到家的信号。",
  },
];

const wishlist: { group: string; items: { name: string; note: string }[] }[] = [
  {
    group: "想去看海",
    items: [
      { name: "冲绳", note: "想租一辆车沿着海岸线开一整天。" },
      { name: "青岛", note: "听说秋天的海边人少，风大。" },
    ],
  },
  {
    group: "想去看雪",
    items: [
      { name: "北海道", note: "想在小樽运河边站一会儿。" },
      { name: "长白山", note: "目标是天池，看运气。" },
    ],
  },
  {
    group: "想去城市",
    items: [
      { name: "京都", note: "不是为了打卡，是想在没有人的小巷里走一次。" },
      { name: "重庆", note: "被朋友念了三年，说那里的夜景值得专门去一趟。" },
    ],
  },
];

export function TravelPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const visitedProvinces = useMemo(
    () => new Set(mapPlaces.map((place) => place.province)),
    []
  );

  /** 五个点离得近，标签手动错开，避免叠在一起。 */
  const labelOffsets: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
    杭州: { dx: 12, dy: 4, anchor: "start" },
    厦门: { dx: 12, dy: 16, anchor: "start" },
    武功山: { dx: -12, dy: -6, anchor: "end" },
    广州: { dx: 12, dy: 16, anchor: "start" },
    长沙: { dx: -12, dy: 10, anchor: "end" },
  };

  const yearCount = useMemo(() => {
    const years = new Set(
      places.filter((place) => place.kind === "visited").map((place) => place.date.slice(0, 4))
    );
    return years.size;
  }, []);

  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="travel-page">
          <div className="travel-page-shell">
            <header className="travel-header">
              <p className="travel-eyebrow">
                <AirplaneTilt weight="bold" aria-hidden="true" /> TRAVEL FOOTPRINT
              </p>
              <h1>旅行足迹</h1>
              <p className="travel-summary">
                去过的地方不算多，但每一个都还记得当时的风和味道。
              </p>
              <div className="travel-count-pill">
                <MapPin weight="bold" aria-hidden="true" />
                <strong>
                  <CountUp to={places.length} duration={1.1} />
                </strong>
                个地方 · 跨越 {yearCount} 个年份
              </div>
            </header>

            <section className="travel-layout">
              <div className="travel-map-card">
                <div className="travel-map-toolbar">
                  <div className="travel-legend">
                    <span>
                      <i className="travel-legend-dot home" />家乡
                    </span>
                    <span>
                      <i className="travel-legend-dot visited" />去过
                    </span>
                    <span>
                      <i className="travel-legend-dot" />待点亮
                    </span>
                  </div>
                  <span className="travel-map-caption">省级足迹地图</span>
                </div>

                <div className="travel-map-stage">
                  <div className="travel-map-cloud cloud-one" aria-hidden="true" />
                  <div className="travel-map-cloud cloud-two" aria-hidden="true" />
                  <svg
                    className="china-map"
                    viewBox={chinaMapViewBox}
                    role="img"
                    aria-label="中国省级行政区旅行足迹地图"
                  >
                    <g className="province-layer">
                      {chinaProvinces.map((province) => (
                        <path
                          key={province.name}
                          d={province.d}
                          className={`province-shape ${
                            visitedProvinces.has(province.name) ? "is-visited" : ""
                          }`}
                        >
                          <title>{province.name}</title>
                        </path>
                      ))}
                    </g>
                    <g className="map-marker-layer">
                      {mapPlaces.map((place) => (
                        <g
                          key={place.name}
                          className={`map-marker ${place.kind === "home" ? "is-home" : ""}`}
                        >
                          <circle className="map-marker-ripple" cx={place.x} cy={place.y} r={9} />
                          <circle className="map-marker-dot" cx={place.x} cy={place.y} r={4.6} />
                          <text
                            className="map-marker-label"
                            x={place.x + (labelOffsets[place.name]?.dx ?? 10)}
                            y={place.y + (labelOffsets[place.name]?.dy ?? 4)}
                            textAnchor={labelOffsets[place.name]?.anchor ?? "start"}
                          >
                            {place.name}
                          </text>
                        </g>
                      ))}
                    </g>
                  </svg>
                </div>

                <div className="travel-footer-note">
                  <Star weight="fill" aria-hidden="true" />
                  去过 {visitedProvinces.size} 个省份，点亮的格子就是走过的地方。
                </div>
              </div>

              <aside className="travel-place-scroll-shell">
                <div className="travel-place-list" role="list">
                  {places.map((place, index) => {
                    const open = expanded === place.name;
                    return (
                      <button
                        type="button"
                        role="listitem"
                        key={place.name}
                        className={`travel-place-item ${place.kind === "home" ? "is-home" : ""}`}
                        aria-expanded={open}
                        onClick={() => setExpanded(open ? null : place.name)}
                      >
                        <span className="travel-place-index">{String(index + 1).padStart(2, "0")}</span>
                        <span>
                          <strong>
                            {place.kind === "home" && (
                              <House weight="bold" aria-hidden="true" />
                            )}
                            {place.name}
                          </strong>
                          <small>
                            {place.region} · {place.date}
                          </small>
                        </span>
                        {open && <span className="travel-place-note">{place.note}</span>}
                      </button>
                    );
                  })}
                </div>
              </aside>
            </section>

            <section className="travel-wishlist">
              <div className="travel-wishlist-heading">
                <Star weight="fill" aria-hidden="true" />
                <div>
                  <strong>还想去的地方</strong>
                  <small>先记下来，慢慢去</small>
                </div>
              </div>

              <div className="travel-wishlist-groups">
                {wishlist.map((group) => (
                  <article className="travel-wishlist-group" key={group.group}>
                    <h2>{group.group}</h2>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.name}>
                          <span className="travel-wishlist-label">{item.name}</span>
                          <span className="travel-wishlist-note">{item.note}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="travel-journal">
              <span className="travel-journal-tape" aria-hidden="true" />
              <h2>旅行手账</h2>
              <p>
                每次出门都会带同一个本子，回来之后把车票、门票和几句当时的想法贴进去。
                写得最潦草的往往是最好玩的那几天，回来之后再补，反而记得更清楚。
              </p>
              <span className="travel-sticker travel-sticker-plane" aria-hidden="true">
                ✈
              </span>
              <span className="travel-sticker travel-sticker-star" aria-hidden="true">
                ✦
              </span>
              <span className="travel-sticker travel-sticker-heart" aria-hidden="true">
                ♡
              </span>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
