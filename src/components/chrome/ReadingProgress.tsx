import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/** Reading progress bar pinned to the top of the viewport. */
export function ReadingProgress() {
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useReducedMotion() ? scrollYProgress : useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  const opacity = useTransform(scrollY, [80, 160], [0, 1], { clamp: true });
  const pickX = useTransform(progress, (value) =>
    typeof window === "undefined" ? 0 : Math.max(0, value * window.innerWidth - 9)
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [complete, setComplete] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value > 0.995;
    setComplete((current) => (current === next ? current : next));
  });

  useEffect(() => {
    rootRef.current?.classList.toggle("is-complete", complete);
  }, [complete]);

  return (
    <div
      id="reading-progress-bar"
      ref={rootRef}
      role="progressbar"
      aria-label="页面阅读进度"
      aria-valuemin={0}
      aria-valuemax={100}
      className="reading-track fixed top-0 left-0 w-full z-[9999] pointer-events-none"
    >
      <motion.div className="h-full w-full" style={{ opacity }}>
        <div className="reading-track-bed" aria-hidden="true" />
        <div className="reading-track-beats" aria-hidden="true" />
        <motion.div
          id="reading-progress"
          className="reading-track-fill"
          style={{ scaleX: progress, transformOrigin: "left center", width: "100%" }}
        />
        <motion.span
          className="reading-track-pick"
          aria-hidden="true"
          style={{ x: pickX, left: 0, right: "auto" }}
        />
        <span className="reading-track-finish" aria-hidden="true">
          ♪
        </span>
      </motion.div>
    </div>
  );
}
