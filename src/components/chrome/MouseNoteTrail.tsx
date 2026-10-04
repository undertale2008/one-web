import { useEffect, useRef } from "react";

/**
 * 参考站的鼠标音符轨迹：光标移动时抛出 ♪ ♫ ♬，随机大小、时长、漂移与旋转。
 * 实现与参考站一致：直接操作 DOM（不走 React state），距离 28px、节流 45ms，
 * 同时最多 14 个；触屏与 prefers-reduced-motion 下由 CSS 直接隐藏。
 */
const NOTES = ["♪", "♫", "♬"];
const MIN_DISTANCE = 28;
const MIN_INTERVAL = 45;
const MAX_ACTIVE = 14;

export function MouseNoteTrail() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    if (!trail) return;

    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    const active: HTMLSpanElement[] = [];
    let lastX = Number.NaN;
    let lastY = Number.NaN;
    let lastCreatedAt = 0;

    const removeNote = (note: HTMLSpanElement) => {
      const index = active.indexOf(note);
      if (index >= 0) active.splice(index, 1);
      note.remove();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      const now = performance.now();
      const distance = Number.isNaN(lastX)
        ? Number.POSITIVE_INFINITY
        : Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < MIN_DISTANCE || now - lastCreatedAt < MIN_INTERVAL) return;

      lastX = event.clientX;
      lastY = event.clientY;
      lastCreatedAt = now;

      const note = document.createElement("span");
      note.className = "mouse-note";
      note.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
      note.style.left = `${event.clientX}px`;
      note.style.top = `${event.clientY}px`;
      note.style.setProperty("--note-size", `${0.82 + Math.random() * 0.42}rem`);
      note.style.setProperty("--note-duration", `${720 + Math.round(Math.random() * 220)}ms`);
      note.style.setProperty("--note-drift-x", `${Math.round((Math.random() - 0.5) * 38)}px`);
      note.style.setProperty("--note-drift-y", `${-38 - Math.round(Math.random() * 24)}px`);
      note.style.setProperty("--note-rotate-start", `${-18 + Math.round(Math.random() * 22)}deg`);
      note.style.setProperty("--note-rotate-end", `${4 + Math.round(Math.random() * 24)}deg`);

      active.push(note);
      trail.appendChild(note);
      note.addEventListener("animationend", () => removeNote(note), { once: true });

      if (active.length > MAX_ACTIVE) removeNote(active[0]);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      active.splice(0).forEach((note) => note.remove());
    };
  }, []);

  return <div id="mouse-note-trail" ref={trailRef} aria-hidden="true" />;
}
