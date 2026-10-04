import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react";
import { bangumiList } from "../data/site";

type Studio = {
  name: string;
  original: string;
  monogram: string;
  accent: string;
  charm: string;
  impression: string;
  story: string;
  traits: string[];
  works: string[];
};

const studios: Studio[] = [
  {
    name: "京都动画",
    original: "KYOTO ANIMATION",
    monogram: "京",
    accent: "#e978a6",
    charm: "放学后",
    impression: "把日常里的目光、停顿与告别，画得比奇迹更加动人。",
    story:
      "我喜欢京都动画，因为它总能发现日常里那些小小的可爱。《轻音少女》的放学后、《紫罗兰永恒花园》的一封封信，看起来都是普通生活，却总能让我笑着笑着就安静下来。",
    traits: ["细腻演出", "日常温度", "人物情绪"],
    works: ["轻音少女", "紫罗兰永恒花园"],
  },
  {
    name: "CoMix Wave Films",
    original: "COMIx WAVE FILMS",
    monogram: "CW",
    accent: "#6fb2e0",
    charm: "云与光",
    impression: "把天空画成主角，让人相信风景本身也能讲故事。",
    story:
      "新海诚的片子我最先记住的从来不是剧情，而是光。《你的名字。》里黄昏的那几分钟、《天气之子》里落不完的雨，都是那种会让人想在电影院多坐一会儿的画面。",
    traits: ["光影质感", "天空构图", "剧场版"],
    works: ["你的名字。", "天气之子"],
  },
  {
    name: "A-1 Pictures",
    original: "A-1 PICTURES",
    monogram: "A1",
    accent: "#8a7fd0",
    charm: "心跳",
    impression: "把恋爱里的犹豫和小算盘，拍得又好笑又诚实。",
    story:
      "《辉夜大小姐想让我告白》让我笑到拍桌子，又会在某个瞬间突然被戳到。《四月是你的谎言》则是另一种极端，看完之后很久不敢再听那首曲子。",
    traits: ["恋爱喜剧", "演出节奏", "音乐题材"],
    works: ["辉夜大小姐想让我告白", "四月是你的谎言"],
  },
  {
    name: "CloverWorks",
    original: "CLOVERWORKS",
    monogram: "CW",
    accent: "#4fb8ad",
    charm: "练琴房",
    impression: "把社恐和热爱一起放在同一个画面里，毫不违和。",
    story:
      "《孤独摇滚！》最厉害的地方是它既好笑又认真：那些夸张的内心戏和突然安静的演奏镜头放在一起，恰好就是一个人慢慢喜欢上什么的样子。",
    traits: ["青春", "音乐演出", "喜剧节奏"],
    works: ["孤独摇滚！"],
  },
  {
    name: "P.A.Works",
    original: "P.A.WORKS",
    monogram: "PA",
    accent: "#d99a3d",
    charm: "加班夜",
    impression: "愿意认真讲「工作」这件事，本身就很珍贵。",
    story:
      "《白箱》我还只看了一部分，但已经喜欢上它那种把幕后的手忙脚乱摊开给你看的方式。原来一部动画的背后，是这么多人的日常。",
    traits: ["职场", "群像", "细腻作画"],
    works: ["白箱"],
  },
];

const worksTotal = studios.reduce((sum, studio) => sum + studio.works.length, 0);

function scoreOf(title: string) {
  return bangumiList.find((entry) => entry.title === title)?.score ?? null;
}

export function StudiosPage() {
  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <header className="studios-hero">
          <div className="studios-hero-copy">
            <p className="studios-kicker">
              <span>WATCHED ONLY</span> 我的动画收藏册
            </p>
            <h1>动画会社</h1>
            <p className="studios-lead">
              有些会社的名字只在片头出现几秒，带来的故事却能喜欢好多年。于是我把它们和看过的动画一起，好好收藏在这里。
            </p>
            <div className="studios-summary" aria-label="页面收录统计">
              <div>
                <strong>{studios.length}</strong>
                <span>家制作会社</span>
              </div>
              <div>
                <strong>{worksTotal}</strong>
                <span>部看过的作品</span>
              </div>
            </div>
          </div>

          <span className="hero-ticket" aria-hidden="true">
            FILM
            <br />
            ARCHIVE
          </span>

          <div className="watched-note">
            <span aria-hidden="true">
              <CheckCircle weight="fill" />
            </span>
            <p>
              <strong>只收录我看完的番剧</strong>
              <small>作品来自「追番小窝」里标记为完结撒花的条目。</small>
              <Link to="/bangumi/">
                查看追番小窝 <b>→</b>
              </Link>
            </p>
          </div>
        </header>

        <div className="studio-list">
          {studios.map((studio, index) => {
            const scores = studio.works
              .map((work) => scoreOf(work))
              .filter((score): score is number => score !== null);
            const average = scores.length
              ? (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
              : "暂无";
            const best = scores.length ? Math.max(...scores).toFixed(1) : "暂无";

            return (
              <section
                className="studio-card"
                key={studio.name}
                style={{ ["--studio-accent" as string]: studio.accent }}
              >
                <div className="studio-intro">
                  <div className="studio-index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="studio-charm" aria-hidden="true">
                    <span>{studio.charm}</span>
                  </div>
                  <div className="studio-logo" aria-hidden="true">
                    <span className="studio-monogram">{studio.monogram}</span>
                  </div>
                  <div className="studio-identity">
                    <p className="studio-label">ANIMATION STUDIO</p>
                    <h2>{studio.name}</h2>
                    <p className="studio-original">{studio.original}</p>
                    <p className="studio-impression">{studio.impression}</p>
                  </div>
                </div>

                <div className="studio-story">
                  <span>我为什么喜欢它</span>
                  <p>{studio.story}</p>
                </div>

                <div className="studio-traits">
                  {studio.traits.map((trait) => (
                    <small key={trait}>{trait}</small>
                  ))}
                </div>

                <div className="studio-stats" aria-label={`${studio.name} 收藏数据`}>
                  <div>
                    <strong>{studio.works.length}</strong>
                    <span>作品入选</span>
                  </div>
                  <div>
                    <strong>{average}</strong>
                    <span>我的均分</span>
                  </div>
                  <div>
                    <strong>{best}</strong>
                    <span>最高评分</span>
                  </div>
                </div>

                <div className="studio-works">
                  <div className="works-heading">
                    <span>我喜欢的作品</span>
                    <small>MY PICKS</small>
                  </div>
                  <div className="works-grid">
                    {studio.works.map((work, workIndex) => (
                      <a
                        className="work-card"
                        key={work}
                        href={`https://bgm.tv/subject_search/${encodeURIComponent(work)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="work-cover">
                          <span className="work-cover-fallback">{work}</span>
                          {workIndex === 0 && <span className="favorite-ribbon">本命</span>}
                        </div>
                        <div className="work-info">
                          <strong>{work}</strong>
                          <div className="work-meta">
                            <span>{scoreOf(work) !== null ? `${scoreOf(work)} 分` : "未评分"}</span>
                            <ArrowUpRight weight="bold" aria-hidden="true" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
