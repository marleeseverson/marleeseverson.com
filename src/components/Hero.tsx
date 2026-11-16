import { useCallback, useLayoutEffect, useRef } from 'react';
import AgentCanvas from './AgentCanvas';
import { ArrowDown, ArrowRight } from './Icons';
import { profile } from '@/data/profile';
import { featured } from '@/data/projects';
import { gsap, useReducedMotion } from '@/lib/motion';
import s from './Hero.module.css';

const STATE_ORDER = ['idle', 'patrol', 'chase', 'attack'] as const;

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const countRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const reduced = useReducedMotion();

  // Live counts are written straight into the DOM: no React re-render 5×/s.
  const onCounts = useCallback((counts: Record<string, number>) => {
    for (const key of STATE_ORDER) {
      const el = countRefs.current[key];
      if (el) el.textContent = String(counts[key] ?? 0).padStart(2, '0');
    }
  }, []);

  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-in]',
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.1 },
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="top" ref={root} className={s.hero} data-section-label="Intro">
      <AgentCanvas avoidRef={headline} onCounts={onCounts} className={s.canvas} />

      <div className={`container ${s.inner}`}>
        <p className={`mono ${s.overline}`} data-hero-in>
          {profile.name} · {profile.role} · {profile.education.school.replace('University of Wisconsin', 'UW')} CS{' '}
          {profile.education.graduationShort}
        </p>

        <h1 ref={headline} className={s.headline} data-hero-in>
          {profile.tagline}
        </h1>

        <p className={s.intro} data-hero-in>
          {profile.intro}
        </p>

        <div className={s.ctas} data-hero-in>
          <a className="button" href="#work">
            See the work <ArrowDown />
          </a>
          <a className="arrow-link" href="#contact">
            Get in touch <ArrowRight />
          </a>
        </div>

        <div className={s.foot}>
          <ol className={s.tickets} aria-label="Featured projects" data-hero-in>
            {featured.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className={`${s.ticket} themed`}>
                  <span className={`mono ${s.ticketIndex}`}>{p.index}</span>
                  <span className={s.ticketTitle}>{p.title}</span>
                  <span className={`mono ${s.ticketAward}`}>{p.award.headline}</span>
                </a>
              </li>
            ))}
          </ol>

          <div className={`mono ${s.readout}`} data-hero-in>
            <p className={s.readoutTitle}>
              <span className={s.dot} aria-hidden="true" /> Live · enemy AI state machine
            </p>
            <p className={s.counts} aria-hidden="true">
              {STATE_ORDER.map((st) => (
                <span key={st} className={s.count}>
                  {st}{' '}
                  <span
                    ref={(el) => {
                      countRefs.current[st] = el;
                    }}
                  >
                    00
                  </span>
                </span>
              ))}
            </p>
            <p className={s.hint}>
              The Idle → Patrol → Chase → Attack enemies from my Roblox game, ported to TypeScript.{' '}
              <span className={s.hintPointer}>Move your cursor.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
