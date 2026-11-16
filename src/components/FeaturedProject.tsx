import { useLayoutEffect, useRef } from 'react';
import type { FeaturedProject as Project } from '@/data/projects';
import { gsap, ScrollTrigger, useReducedMotion, useReveal } from '@/lib/motion';
import AwardStamp from './AwardStamp';
import { ArrowUpRight, Play } from './Icons';
import { MediaFigure, MediaGallery } from './Media';
import s from './FeaturedProject.module.css';

interface Props {
  project: Project;
}

const STAMP_CENTER: Record<string, string[]> = {
  'through-hell-for-you': ['SGX', 'Audience choice'],
  'crystal-cavern': ['1st', 'of 75 teams'],
};

export default function FeaturedProject({ project }: Props) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root);

  // Scroll-linked motion: the hero image drifts (parallax) and the award stamp rotates.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      const figure = el.querySelector<HTMLElement>('[data-parallax]');
      const img = figure?.querySelector<HTMLElement>('img');
      if (img && figure) {
        gsap.fromTo(
          img,
          { yPercent: -7 },
          {
            yPercent: 7,
            ease: 'none',
            scrollTrigger: { trigger: figure, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      }
      const ring = el.querySelector<HTMLElement>('[data-stamp-ring]');
      if (ring) {
        gsap.to(ring, {
          rotation: 240,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
      ScrollTrigger.refresh();
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const metaLine = project.meta.map((m) => m.value).join(' · ');

  return (
    <section
      id={project.slug}
      ref={root}
      className={`section ${s.feature}`}
      data-section-label={project.title}
      data-theme-section={project.theme}
      aria-labelledby={`${project.slug}-title`}
    >
      <div className="container">
        <header className={s.head}>
          <p className={`mono ${s.kicker}`} data-reveal>
            <span className={s.kickerIndex}>{project.index}</span> Featured project · {metaLine}
          </p>

          <h2 id={`${project.slug}-title`} className={s.title}>
            {project.titleLines.map((line, i) => (
              <span key={i} className={s.titleLine} data-reveal-group="title">
                {line}
              </span>
            ))}
          </h2>

          <div className={s.award} data-reveal>
            <AwardStamp ring={project.award.stamp} center={STAMP_CENTER[project.slug] ?? [project.award.headline]} />
            <div className={s.awardText}>
              <p className={s.awardHeadline}>{project.award.headline}</p>
              <p className={`mono ${s.awardDetail}`}>{project.award.detail}</p>
            </div>
          </div>
        </header>

        <div data-parallax data-reveal>
          <MediaFigure
            item={project.hero}
            figure={`${project.index}.1`}
            sizes="(min-width: 1400px) 1300px, 92vw"
            priority={project.index === '01'}
            className={s.heroFigure}
            imgClassName={s.heroImg}
          />
        </div>

        <div className={s.body}>
          <div className={s.col} data-reveal-group="body">
            <h3 className={`mono ${s.colTitle}`}>The game</h3>
            <p className={s.summary}>{project.summary}</p>
            {project.description.map((para, i) => (
              <p key={i} className={s.para}>
                {para}
              </p>
            ))}
          </div>

          <div className={s.col} data-reveal-group="body">
            <h3 className={`mono ${s.colTitle}`}>What I built</h3>
            <p className={s.role}>{project.role}</p>
            <ul className={s.list}>
              {project.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <div className={s.col} data-reveal-group="body">
            <h3 className={`mono ${s.colTitle}`}>Technical highlights</h3>
            <ol className={s.highlights}>
              {project.highlights.map((h, i) => (
                <li key={h.title}>
                  <span className={`mono ${s.highlightNo}`}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4 className={s.highlightTitle}>{h.title}</h4>
                    <p className={s.highlightBody}>{h.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={s.foot} data-reveal>
          <dl className={s.meta}>
            {project.meta.map((m) => (
              <div key={m.label} className={s.metaItem}>
                <dt className="mono">{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className={s.links}>
            {project.links.map((l, i) => (
              <a key={l.href} className={`button ${i > 0 ? 'ghost' : ''}`} href={l.href} target="_blank" rel="noopener">
                {i === 0 ? <Play /> : <ArrowUpRight />} {l.label}
              </a>
            ))}
          </div>
        </div>

        <MediaGallery items={project.gallery} prefix={project.index} />
      </div>
    </section>
  );
}
