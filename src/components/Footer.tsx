import { profile } from '@/data/profile';
import s from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={s.footer}>
      <div className={`container ${s.inner}`}>
        <p className="mono">
          © {year} {profile.name}
        </p>
        <p className={`mono ${s.colophon}`}>
          Built with React, TypeScript and GSAP. The agents up top are a four-state machine: idle, patrol, chase, attack.
        </p>
        <a href="#top" className="arrow-link">
          Back to top
        </a>
      </div>
    </footer>
  );
}
