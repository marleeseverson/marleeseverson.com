import { useEffect, useRef } from 'react';
import { AgentField, STATES, type Rect } from '@/sim/agents';
import { useReducedMotion } from '@/lib/motion';

interface Props {
  /** Element whose bounding box patrol routes should avoid (the headline). */
  avoidRef: React.RefObject<HTMLElement | null>;
  /** Receives live state counts ~5×/s for the readout. */
  onCounts?: (counts: Record<string, number>) => void;
  className?: string;
}

function readPalette(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return {
    ink: cs.getPropertyValue('--fg').trim() || '#141311',
    accent: cs.getPropertyValue('--accent').trim() || '#d9481c',
    muted: cs.getPropertyValue('--muted').trim() || '#605b54',
  };
}

/**
 * Full-bleed canvas running the agent state machine. Pauses when off-screen or when the tab is hidden.
 * Under reduced motion it renders a single static frame and never animates.
 */
export default function AgentCanvas({ avoidRef, onCounts, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement ?? canvas;
    let w = 0;
    let h = 0;
    let dpr = 1;
    const field = new AgentField(0, 1, 1);
    const palette = readPalette(document.documentElement);

    const countFor = (width: number) => (width < 640 ? 7 : width < 1100 ? 11 : 16);

    const measure = () => {
      const r = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      field.resize(w, h);
      const avoid = avoidRef.current;
      if (avoid) {
        const a = avoid.getBoundingClientRect();
        const pad = 24;
        const rect: Rect = { x: a.left - r.left - pad, y: a.top - r.top - pad, w: a.width + pad * 2, h: a.height + pad * 2 };
        field.keepOut = rect;
      }
      field.setCount(countFor(w));
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    // Pointer tracking (mouse + touch). Coordinates are relative to the canvas.
    const setTarget = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect();
      field.target.x = clientX - r.left;
      field.target.y = clientY - r.top;
      field.target.active = true;
    };
    const onMove = (e: PointerEvent) => setTarget(e.clientX, e.clientY);
    const onLeave = () => {
      field.target.active = false;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setTarget(t.clientX, t.clientY);
    };
    parent.addEventListener('pointermove', onMove, { passive: true });
    parent.addEventListener('pointerleave', onLeave);
    parent.addEventListener('touchmove', onTouch, { passive: true });
    parent.addEventListener('touchend', onLeave);

    const showLabels = w >= 640;

    if (reduced) {
      // One static frame: agents in their spawn poses.
      field.step(0);
      field.render(ctx, palette, showLabels);
      onCounts?.(field.counts);
      return () => {
        ro.disconnect();
        parent.removeEventListener('pointermove', onMove);
        parent.removeEventListener('pointerleave', onLeave);
        parent.removeEventListener('touchmove', onTouch);
        parent.removeEventListener('touchend', onLeave);
      };
    }

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let countTimer = 0;

    const frame = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      field.step(dt);
      field.render(ctx, palette, w >= 640);
      countTimer += dt;
      if (countTimer > 0.2) {
        countTimer = 0;
        onCounts?.(field.counts);
      }
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!visible) return;
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => cancelAnimationFrame(raf);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(parent);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', onVisibility);
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      parent.removeEventListener('touchmove', onTouch);
      parent.removeEventListener('touchend', onLeave);
    };
  }, [avoidRef, onCounts, reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" data-states={STATES.join(',')} />;
}
