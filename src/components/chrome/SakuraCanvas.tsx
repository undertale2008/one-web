import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Petal = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  spin: number;
  angle: number;
};

/** Light canvas petal drift used inside the footer panel. */
export function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let petals: Petal[] = [];
    let frame = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const count = Math.max(10, Math.round(width / 34));
      petals = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 3 + Math.random() * 4,
        speed: 0.22 + Math.random() * 0.5,
        drift: -0.25 + Math.random() * 0.5,
        spin: -0.02 + Math.random() * 0.04,
        angle: Math.random() * Math.PI,
      }));
    };

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect?.width ?? canvas.clientWidth;
      height = rect?.height ?? canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgb(102 204 255 / 0.5)";
      for (const petal of petals) {
        petal.y += petal.speed;
        petal.x += petal.drift;
        petal.angle += petal.spin;
        if (petal.y > height + 10) {
          petal.y = -10;
          petal.x = Math.random() * width;
        }
        if (petal.x < -10) petal.x = width + 10;
        if (petal.x > width + 10) petal.x = -10;

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size, petal.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    frame = window.requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduce]);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-45">
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
