import { useRef } from 'react';
import { small } from '@/data/projects';
import { profile } from '@/data/profile';
import { useReveal } from '@/lib/motion';
import { ArrowUpRight } from './Icons';
import s from './SmallProjects.module.css';

/** The jam log: smaller finished games, listed like entries in a changelog. */
export default function SmallProjects() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section ref={root} className={`section ${s.section}`} data-section-label="Jam log" aria-labelledby="jam-heading">
      <div className="container">
        <div className={s.head} data-reveal>
          <h2 id="jam-heading" className={s.title}>
            Jam log
          </h2>
          <p className={s.lede}>
            Smaller games, all finished and playable. Shipping under a deadline is a skill; these are the reps.
          </p>
        </div>
        <ol className={s.list}>
          {small.map((p, i) => (
            <li key={p.title} data-reveal-group="jam">
              <a href={p.href} target="_blank" rel="noopener" className={s.row}>
                <span className={`mono ${s.no}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.name}>{p.title}</span>
                <span className={`mono ${s.context}`}>{p.context}</span>
                <span className={s.note}>{p.note}</span>
                <span className={s.arrow} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </li>
          ))}
        </ol>
        <p className={s.more} data-reveal>
          <a className="arrow-link" href={profile.links.itch} target="_blank" rel="noopener">
            Everything on itch.io <ArrowUpRight />
          </a>
        </p>
      </div>
    </section>
  );
}
