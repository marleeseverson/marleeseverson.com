import { useRef, useState } from 'react';
import { profile, resumeHref } from '@/data/profile';
import { useReveal } from '@/lib/motion';
import { ArrowUpRight, Doc, Mail } from './Icons';
import s from './Contact.module.css';

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (permissions / insecure context): the mailto link still works.
    }
  };

  const links = [
    { label: 'GitHub', href: profile.links.github, handle: 'marleeseverson' },
    { label: 'itch.io', href: profile.links.itch, handle: 'catlovermax13' },
    { label: 'LinkedIn', href: profile.links.linkedin, handle: 'marlee-severson' },
  ];

  return (
    <section id="contact" ref={root} className={`section ${s.contact}`} data-section-label="Contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="section-head">
          <span className="index">07</span>
          <h2 id="contact-heading">Let’s talk</h2>
          <p className="lede">
            Recruiting for a summer 2027 game programming internship, or want to talk about a boss fight? Email is
            fastest.
          </p>
        </div>

        <a href={`mailto:${profile.email}`} className={s.email} data-reveal>
          <span className={s.emailText}>{profile.email}</span>
          <span className={s.emailIcon} aria-hidden="true">
            <Mail />
          </span>
        </a>

        <div className={s.actions} data-reveal>
          <button type="button" className="button" onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy email'}
          </button>
          <a className="button ghost" href={resumeHref} target="_blank" rel="noopener">
            <Doc /> Resume
          </a>
        </div>

        <ul className={s.links}>
          {links.map((l) => (
            <li key={l.href} data-reveal-group="links">
              <a href={l.href} target="_blank" rel="noopener" className={s.link}>
                <span className={`mono ${s.linkLabel}`}>{l.label}</span>
                <span className={s.linkHandle}>{l.handle}</span>
                <span className={s.linkArrow} aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
