import { useRef } from 'react';
import type { SheetProject } from '@/data/projects';
import { useReveal } from '@/lib/motion';
import { ArchitectureDiagram, StateMachineDiagram } from './Diagrams';
import { ArrowUpRight, Play } from './Icons';
import { MediaFigure } from './Media';
import s from './ProjectSheet.module.css';

interface Props {
  project: SheetProject;
}

/** A "spec sheet" for a secondary project: stats, systems, media or diagrams, links. */
export default function ProjectSheet({ project }: Props) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const isPlate = project.slug === 'roblox-plate-game';

  return (
    <article id={project.slug} ref={root} className={s.sheet} aria-labelledby={`${project.slug}-title`}>
      <header className={s.head} data-reveal>
        <span className={`mono ${s.index}`}>{project.index}</span>
        <div>
          <h3 id={`${project.slug}-title`} className={s.title}>
            {project.title}
          </h3>
          <p className={`mono ${s.kicker}`}>{project.kicker}</p>
        </div>
        <ul className={s.stack} aria-label="Stack">
          {project.stack.map((t) => (
            <li key={t} className="mono">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <div className={s.grid}>
        <div className={s.visual} data-reveal>
          {isPlate ? (
            <div className={s.diagrams}>
              <StateMachineDiagram />
              <ArchitectureDiagram />
            </div>
          ) : (
            <div className={s.media} data-count={project.media.length}>
              {project.media.map((m, i) => (
                <MediaFigure
                  key={i}
                  item={m}
                  figure={`${project.index}.${i + 1}`}
                  sizes="(min-width: 1100px) 36vw, (min-width: 760px) 50vw, 92vw"
                />
              ))}
            </div>
          )}
        </div>

        <div className={s.text}>
          <p className={s.description} data-reveal>
            {project.description}
          </p>

          <dl className={s.stats} data-reveal>
            {project.stats.map((st) => (
              <div key={st.label} className={s.stat}>
                <dd className={s.statValue}>{st.value}</dd>
                <dt className={`mono ${s.statLabel}`}>{st.label}</dt>
              </div>
            ))}
          </dl>

          <ol className={s.systems}>
            {project.systems.map((sys, i) => (
              <li key={sys.title} className={s.system} data-reveal-group={`${project.slug}-systems`}>
                <span className={`mono ${s.systemNo}`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className={s.systemTitle}>{sys.title}</h4>
                  <p className={s.systemBody}>{sys.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className={s.demonstrates} data-reveal>
            <span className={`mono ${s.demoLabel}`}>Demonstrates</span> {project.demonstrates}
          </p>

          <div className={s.links} data-reveal>
            {project.links.map((l, i) => (
              <a key={l.href} className={`button ${i > 0 ? 'ghost' : ''}`} href={l.href} target="_blank" rel="noopener">
                {l.label.startsWith('Play') ? <Play /> : <ArrowUpRight />} {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
