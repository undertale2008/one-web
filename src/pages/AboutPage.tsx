import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { aboutCopy, interests, site } from "../data/site";
import { Icon, type IconName } from "../components/chrome/Icon";

/**
 * 「英文自我介绍」抽屉：打开由 CSS 的 grid-template-rows 过渡完成，
 * 关闭时参考站会先加 is-closing 再收起。这里复刻同一套逻辑。
 */
function EnglishDrawer() {
  const drawerRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const summary = drawer.querySelector("summary");
    const wrap = drawer.querySelector<HTMLElement>(".english-copy-wrap");
    if (!summary || !wrap) return;

    const onClick = (event: MouseEvent) => {
      if (!drawer.open || drawer.classList.contains("is-closing")) return;
      event.preventDefault();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        drawer.open = false;
        return;
      }

      drawer.classList.add("is-closing");
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        drawer.open = false;
        drawer.classList.remove("is-closing");
      };
      const onTransitionEnd = (transition: TransitionEvent) => {
        if (transition.target !== wrap || transition.propertyName !== "grid-template-rows") return;
        wrap.removeEventListener("transitionend", onTransitionEnd);
        finish();
      };
      wrap.addEventListener("transitionend", onTransitionEnd);
      window.setTimeout(finish, 460);
    };

    summary.addEventListener("click", onClick);
    return () => summary.removeEventListener("click", onClick);
  }, []);

  return (
    <details className="english-drawer" ref={drawerRef}>
      <summary>
        <span>🌷</span>
        <div>
          <b>{aboutCopy.english.summaryTitle}</b>
          <small>{aboutCopy.english.summary}</small>
        </div>
        <i aria-hidden="true">⌄</i>
      </summary>

      <div className="english-copy-wrap">
        <div className="english-copy-clip">
          <div className="english-copy">
            <h2>{aboutCopy.english.title}</h2>
            {aboutCopy.english.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul>
              {aboutCopy.english.hobbies.map((hobby) => (
                <li key={hobby.label}>
                  <b>{hobby.label}</b> {hobby.text}
                </li>
              ))}
            </ul>
            <p>{aboutCopy.english.dream}</p>
            <p>{aboutCopy.english.closing}</p>
          </div>
        </div>
      </div>
    </details>
  );
}

export function AboutPage() {
  return (
    <main id="swup-container" className="transition-swup-fade col-span-2 overflow-hidden">
      <div id="content-wrapper" className="onload-animation">
        <div className="about-page">
          <section className="about-hero">
            <div className="about-avatar-wrap">
              <div className="about-avatar">
                <span className="block h-full w-full overflow-hidden relative">
                  <img
                    src={site.avatar}
                    alt={`${site.nickname} 的头像`}
                    loading="lazy"
                    decoding="async"
                    width={512}
                    height={512}
                    className="w-full h-full object-cover"
                  />
                </span>
              </div>
              <span className="about-spark about-spark-one" aria-hidden="true">
                ✦
              </span>
              <span className="about-spark about-spark-two" aria-hidden="true">
                ♡
              </span>
            </div>

            <div className="about-hero-copy">
              <p className="about-eyebrow">
                {aboutCopy.eyebrow} <b>₍ᐢ.ˬ.ᐢ₎</b>
              </p>
              <h1>
                你好呀，我是 <em>{site.nickname}</em>
              </h1>
              <p className="about-lead">
                {aboutCopy.lead}
                <br />
                {aboutCopy.leadSecond}
              </p>
              <div className="about-badges" aria-label="个人信息">
                {aboutCopy.badges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="about-diary">
            <header className="about-section-title">
              <div>
                <span>{aboutCopy.diaryKicker}</span>
                <h2>{aboutCopy.diaryTitle}</h2>
              </div>
              <p>{aboutCopy.diaryNote}</p>
            </header>

            <div className="interest-list">
              {interests.map((interest) => (
                <article className={`interest-row ${interest.kind}`} key={interest.title}>
                  <div className="interest-icon" aria-hidden="true">
                    <Icon name={interest.icon as IconName} />
                  </div>
                  <div>
                    <span>{interest.kicker}</span>
                    <h3>{interest.title}</h3>
                    <p>{interest.body}</p>
                  </div>
                  {interest.href ? (
                    <Link to={interest.href}>
                      {interest.hrefLabel} <b>›</b>
                    </Link>
                  ) : (
                    <small>{interest.tail}</small>
                  )}
                </article>
              ))}
            </div>

            <span className="diary-doodle" aria-hidden="true">
              {aboutCopy.diaryDoodle}
            </span>
          </section>

          <div className="about-notes">
            <section className="about-note dream-note">
              <span className="note-pin" aria-hidden="true">
                ♥
              </span>
              <p>{aboutCopy.dream.kicker}</p>
              <h2>{aboutCopy.dream.title}</h2>
              <div>
                {aboutCopy.dream.body.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < aboutCopy.dream.body.length - 1 && <br />}
                  </span>
                ))}
              </div>
            </section>

            <section className="about-note hello-note">
              <span className="note-pin" aria-hidden="true">
                ✦
              </span>
              <p>{aboutCopy.hello.kicker}</p>
              <h2>{aboutCopy.hello.title}</h2>
              <div>
                {aboutCopy.hello.body.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < aboutCopy.hello.body.length - 1 && <br />}
                  </span>
                ))}
              </div>
              <a href={aboutCopy.hello.href} target="_blank" rel="noopener noreferrer">
                {aboutCopy.hello.linkLabel} <span>→</span>
              </a>
            </section>
          </div>

          <EnglishDrawer />
        </div>
      </div>
    </main>
  );
}
