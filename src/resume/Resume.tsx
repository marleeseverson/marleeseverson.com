import { profile } from '@/data/profile';
import { featured, sheets } from '@/data/projects';
import { concepts, rows } from '@/data/skills';
import s from './Resume.module.css';

/**
 * Print-ready resume generated from the same data as the site. "Print / Save as PDF" uses the
 * browser's print dialog; the page is laid out for US Letter with print styles in Resume.module.css.
 */
export default function Resume() {
  const languages = rows.filter((r) => r.group === 'Languages').map((r) => r.name);
  const tools = rows.filter((r) => r.group === 'Tools').map((r) => r.name);
  const strip = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '');

  return (
    <main className={s.page}>
      <div className={s.toolbar}>
        <a href="/" className="arrow-link">
          ← Back to site
        </a>
        <button type="button" className="button" onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      <article className={s.sheet}>
        <header className={s.head}>
          <div>
            <h1 className={s.name}>{profile.name}</h1>
            <p className={s.role}>Game programmer · Computer Science student</p>
          </div>
          <ul className={`mono ${s.contact}`}>
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.site}>{strip(profile.site)}</a>
            </li>
            <li>
              <a href={profile.links.github}>{strip(profile.links.github)}</a>
            </li>
            <li>
              <a href={profile.links.itch}>{strip(profile.links.itch)}</a>
            </li>
            <li>
              <a href={profile.links.linkedin}>{strip(profile.links.linkedin)}</a>
            </li>
            <li>{profile.location}</li>
          </ul>
        </header>

        <section className={s.block}>
          <h2 className={`mono ${s.blockTitle}`}>Summary</h2>
          <p>
            Computer Science student focused on game programming: gameplay systems, boss and enemy AI, and client-server
            architecture in Unity (C#) and Roblox (roblox-ts). Shipped two award-winning games and several complete jam
            titles. Seeking a {profile.seeking.toLowerCase()}.
          </p>
        </section>

        <section className={s.block}>
          <h2 className={`mono ${s.blockTitle}`}>Education</h2>
          <div className={s.row}>
            <div>
              <strong>{profile.education.school}</strong> — {profile.education.degree}
            </div>
            <span className={s.right}>Expected {profile.education.graduation}</span>
          </div>
        </section>

        <section className={s.block}>
          <h2 className={`mono ${s.blockTitle}`}>Selected projects</h2>
          {featured.map((p) => (
            <div key={p.slug} className={s.project}>
              <div className={s.row}>
                <div>
                  <strong>{p.title}</strong> — {p.meta.map((m) => m.value).join(', ')}
                </div>
                <span className={s.right}>{p.award.headline}</span>
              </div>
              <ul className={s.bullets}>
                <li>{p.summary}</li>
                {p.contributions.slice(0, 3).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          ))}
          {sheets.map((p) => (
            <div key={p.slug} className={s.project}>
              <div className={s.row}>
                <div>
                  <strong>{p.title}</strong> — {p.stack.join(', ')}
                </div>
                <span className={s.right}>{p.stats[0].value} {p.stats[0].label}</span>
              </div>
              <ul className={s.bullets}>
                {p.systems.map((sys) => (
                  <li key={sys.title}>
                    {sys.title}: {sys.body}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className={s.block}>
          <h2 className={`mono ${s.blockTitle}`}>Experience</h2>
          {profile.experience.map((e) => (
            <div key={e.title} className={s.project}>
              <div className={s.row}>
                <div>
                  <strong>{e.title}</strong> — {e.org}
                </div>
              </div>
              <ul className={s.bullets}>
                <li>{e.summary}</li>
              </ul>
            </div>
          ))}
        </section>

        <section className={`${s.block} ${s.skills}`}>
          <h2 className={`mono ${s.blockTitle}`}>Skills</h2>
          <div className={s.skillRow}>
            <span className={`mono ${s.skillLabel}`}>Languages</span>
            <span>{languages.join(' · ')}</span>
          </div>
          <div className={s.skillRow}>
            <span className={`mono ${s.skillLabel}`}>Tools</span>
            <span>{tools.join(' · ')}</span>
          </div>
          <div className={s.skillRow}>
            <span className={`mono ${s.skillLabel}`}>Concepts</span>
            <span>{concepts.map((c) => c.name).join(' · ')}</span>
          </div>
        </section>
      </article>
    </main>
  );
}
