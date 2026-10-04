import { useCallback, useState } from "react";
import { Icon } from "./Icon";
import { SakuraCanvas } from "./SakuraCanvas";
import { footerLinks, hitokoto, site } from "../../data/site";

const iconMap: Record<string, "rss" | "sitemap" | "github"> = {
  rss: "rss",
  sitemap: "sitemap",
  github: "github",
};

export function Footer() {
  const [index, setIndex] = useState(0);
  const quote = hitokoto[index % hitokoto.length];

  const next = useCallback(() => {
    setIndex((current) => (current + 1) % hitokoto.length);
  }, []);

  return (
    <div className="footer col-span-2 onload-animation">
      <div className="footer-divider" aria-hidden="true">
        <span />
        <b>♫</b>
        <i>♡</i>
        <b>✦</b>
        <span />
      </div>

      <div className="footer-panel relative overflow-hidden transition mb-12">
        <SakuraCanvas />
        <span className="footer-tape" aria-hidden="true" />
        <span className="footer-doodle footer-doodle-left" aria-hidden="true">
          ୨୧
        </span>
        <span className="footer-doodle footer-doodle-right" aria-hidden="true">
          ♡
        </span>

        <div className="footer-heading relative z-10">
          <span aria-hidden="true">✦</span>
          <span>AFTER SCHOOL NOTE</span>
          <b>(˶ᵔ ᵕ ᵔ˶)</b>
        </div>

        <button
          type="button"
          className="footer-quote relative z-10"
          title="点击刷新一言"
          aria-label="点击换一句温柔的话"
          onClick={next}
        >
          <span className="footer-quote-icon" aria-hidden="true">
            ♡
          </span>
          <span className="footer-quote-copy">
            <span>
              「<span className="hitokoto-text">{quote.text}</span>」
            </span>
            <span className="hitokoto-author">{quote.author}</span>
          </span>
          <span className="footer-quote-refresh" aria-hidden="true">
            换一句 ↻
          </span>
        </button>

        <div className="footer-info relative z-10">
          <div className="footer-signature">
            <span className="footer-signature-mark" aria-hidden="true">
              ♪
            </span>
            <span>
              &copy; {new Date().getFullYear()} {site.author}
            </span>
            <span className="footer-signature-dot" aria-hidden="true" />
            <span>
              Made with <span className="footer-heart animate-pulse">♥</span> in {site.location}
            </span>
          </div>

          <nav className="footer-links" aria-label="页脚链接">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <Icon name={iconMap[link.icon] ?? "sitemap"} className="text-base" />
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-filing">
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" />
          </div>

          <div className="footer-powered">
            <span aria-hidden="true">୨୧</span>
            <span>
              Powered by <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">Vite</a> ×{" "}
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>
            </span>
            <span className="footer-powered-divider">·</span>
            <span>Design notes from {site.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
