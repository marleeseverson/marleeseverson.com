import { profile, resumeHref } from '@/data/profile';
import s from './Nav.module.css';

interface Props {
  /** Label of the section currently in view, maintained by App. */
  current: string;
}

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav({ current }: Props) {
  return (
    <header className={`${s.nav} themed`}>
      <a className={s.wordmark} href="#top">
        <svg viewBox="0 0 24 24" aria-hidden="true" className={s.mark}>
          <polygon points="12,4 20,19 4,19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="14" r="2" fill="var(--accent)" />
        </svg>
        <span>{profile.name}</span>
      </a>

      <p className={`mono ${s.current}`} aria-live="polite" aria-atomic="true">
        <span className={s.currentLabel}>{current}</span>
      </p>

      <nav aria-label="Primary" className={s.links}>
        {links.map((l) => (
          <a key={l.href} href={l.href} className={`mono ${s.link}`}>
            {l.label}
          </a>
        ))}
        <a href={resumeHref} className={`mono ${s.link} ${s.resume}`} target="_blank" rel="noopener">
          Resume
        </a>
      </nav>
    </header>
  );
}
