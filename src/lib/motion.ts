import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const REDUCED = '(prefers-reduced-motion: reduce)';

/** True when the visitor asked for reduced motion. Static on first render, updates on change. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(REDUCED).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(REDUCED);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Reveals every `[data-reveal]` descendant of `scope` as it scrolls into view.
 * Elements sharing a `data-reveal-group` stagger together. No-op under reduced motion:
 * the elements are simply visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || reduced) return;
    const ctx = gsap.context(() => {
      const singles = root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal-group])');
      singles.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        );
      });
      const groups = new Map<string, HTMLElement[]>();
      root.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((el) => {
        const key = el.dataset.revealGroup ?? '';
        groups.set(key, [...(groups.get(key) ?? []), el]);
      });
      groups.forEach((els) => {
        gsap.fromTo(
          els,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: els[0], start: 'top 88%', once: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
}
