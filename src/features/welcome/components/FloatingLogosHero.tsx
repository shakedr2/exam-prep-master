import { useEffect, useRef } from "react";
import { FLOATER_CONFIG, LOGO_SVGS } from "../data/logos";

/**
 * Parallax floating logo backdrop for the Logic Flow landing hero.
 *
 * Each logo tile is absolutely placed, then an rAF loop applies a
 * gentle sinusoidal float + mouse-tracked tilt + scroll-driven depth.
 * Honors prefers-reduced-motion by locking tiles to their rest position.
 */
export function FloatingLogosHero({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement>;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tiles = Array.from(
      stage.querySelectorAll<HTMLDivElement>("[data-floater]"),
    );

    if (reduce) {
      tiles.forEach((el, i) => {
        const cfg = FLOATER_CONFIG[i];
        el.style.transform = `translateZ(${cfg.depth}px) rotateZ(${cfg.rot}deg)`;
      });
      return;
    }

    let scrollY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let rafId = 0;

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    const onMouseMove = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width - 0.5;
      mouseY = (e.clientY - r.top) / r.height - 0.5;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("mousemove", onMouseMove);

    const tick = (t: number) => {
      const time = t * 0.001;
      const scrollProg = Math.min(1, scrollY / Math.max(1, container.offsetHeight));
      tiles.forEach((el, i) => {
        const cfg = FLOATER_CONFIG[i];
        const phase = cfg.delay * Math.PI;
        const floatY = Math.sin((time / cfg.speed) * Math.PI * 2 + phase) * 14;
        const floatX = Math.cos((time / (cfg.speed * 1.3)) * Math.PI * 2 + phase) * 8;
        const tiltZ = cfg.rot + Math.sin((time / cfg.speed) * Math.PI * 2 + phase) * 3;
        const z = cfg.depth + scrollProg * 600;
        const parallaxY = scrollProg * -80 * (cfg.depth / -260);
        const mShiftX = mouseX * -18 * (Math.abs(cfg.depth) / 260);
        const mShiftY = mouseY * -18 * (Math.abs(cfg.depth) / 260);
        el.style.transform = `translate3d(${floatX + mShiftX}px, ${floatY + parallaxY + mShiftY}px, ${z}px) rotateX(${mouseY * 10}deg) rotateY(${-mouseX * 10}deg) rotateZ(${tiltZ}deg)`;
        el.style.opacity = z > 200 ? String(Math.max(0, 1 - (z - 200) / 400)) : "1";
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, [containerRef]);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="lf-floater-stage"
    >
      {FLOATER_CONFIG.map((cfg, i) => (
        <div
          key={i}
          data-floater
          className="lf-floater"
          style={{
            left: `${cfg.x}%`,
            top: `${cfg.y}%`,
            width: cfg.size,
            height: cfg.size,
            marginLeft: -(cfg.size / 2),
            marginTop: -(cfg.size / 2),
          }}
        >
          <div
            className="lf-logo-card"
            dangerouslySetInnerHTML={{ __html: LOGO_SVGS[cfg.key] }}
          />
        </div>
      ))}
    </div>
  );
}
