import { useRef } from 'react';
import { profile } from '@/data/profile';
import { useReveal } from '@/lib/motion';
import s from './About.module.css';

export default function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  return (
    <section id="about" ref={root} className="section" data-section-label="About" aria-labelledby="about-heading">
      <div className="container">
        <div className="section-head">
          <span className="index">06</span>
          <h2 id="about-heading">About</h2>
        </div>

        <div className={s.grid}>
          <div className={s.prose}>
            {profile.about.map((p, i) => (
              <p key={i} className={i === 0 ? s.lead : s.para} data-reveal>
                {p}
              </p>
            ))}
          </div>

          <dl className={s.facts}>
            <div className={s.fact} data-reveal-group="facts">
              <dt className="mono">Education</dt>
              <dd>
                <strong>{profile.education.degree}</strong>
                <br />
                {profile.education.school}
                <br />
                <span className="muted">Expected {profile.education.graduation}</span>
              </dd>
            </div>
            <div className={s.fact} data-reveal-group="facts">
              <dt className="mono">Experience</dt>
              <dd>
                {profile.experience.map((e) => (
                  <span key={e.title}>
                    <strong>{e.title}</strong>, {e.org}
                    <br />
                    <span className="muted">{e.summary}</span>
                  </span>
                ))}
              </dd>
            </div>
            <div className={s.fact} data-reveal-group="facts">
              <dt className="mono">Looking for</dt>
              <dd>
                <strong>{profile.seeking}</strong>
                <br />
                <span className="muted">Gameplay, systems, tools, or engine work. Remote or relocation.</span>
              </dd>
            </div>
            <div className={s.fact} data-reveal-group="facts">
              <dt className="mono">Based in</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
