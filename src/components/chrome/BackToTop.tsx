import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Icon } from "./Icon";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 600;
    setVisible((current) => (current === next ? current : next));
  });

  return (
    <div className="back-to-top-wrapper">
      <button
        id="back-to-top-btn"
        type="button"
        className={`back-to-top-btn ${visible ? "" : "hide"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="返回顶部"
        title="返回顶部"
      >
        <Icon name="arrow-up" className="back-to-top-icon" />
        <span className="back-to-top-label" aria-hidden="true">
          返回顶部
        </span>
      </button>
    </div>
  );
}
