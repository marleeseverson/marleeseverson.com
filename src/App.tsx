import { useLayoutEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import FeaturedProject from './components/FeaturedProject';
import ProjectSheet from './components/ProjectSheet';
import SmallProjects from './components/SmallProjects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { featured, sheets } from './data/projects';
import { ScrollTrigger } from './lib/motion';

const THEME_COLORS: Record<string, string> = { paper: '#f4f0e8', hell: '#151416', cavern: '#140a28' };

export default function App() {
  const [current, setCurrent] = useState('Intro');

  // Section tracking: nav label + page palette. Featured projects carry data-theme-section and
  // "take over" the page colours while they are the dominant thing on screen.
  useLayoutEffect(() => {
    const html = document.documentElement;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const setTheme = (theme: string) => {
      html.dataset.theme = theme;
      if (meta) meta.content = THEME_COLORS[theme] ?? THEME_COLORS.paper;
    };

    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll<HTMLElement>('[data-section-label]').forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) setCurrent(el.dataset.sectionLabel ?? '');
          },
        }),
      );
    });
    document.querySelectorAll<HTMLElement>('[data-theme-section]').forEach((el) => {
      const theme = el.dataset.themeSection ?? 'paper';
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setTheme(theme),
          onEnterBack: () => setTheme(theme),
          onLeave: () => setTheme('paper'),
          onLeaveBack: () => setTheme('paper'),
        }),
      );
    });
    // Deep links (/#crystal-cavern): the browser's own hash jump happens before React renders the
    // anchor, so do it once here, then let ScrollTrigger recalculate positions.
    const hash = window.location.hash.slice(1);
    if (hash) {
      const target = document.getElementById(hash);
      if (target) {
        html.style.scrollBehavior = 'auto';
        target.scrollIntoView({ block: 'start' });
        html.style.scrollBehavior = '';
      }
    }
    ScrollTrigger.refresh();
    // Positions are measured with fallback fonts first; re-measure once the real fonts are in.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <a href="#work" className="visually-hidden">
        Skip to projects
      </a>
      <Nav current={current} />
      <main>
        <Hero />
        <div id="work">
          {featured.map((p) => (
            <FeaturedProject key={p.slug} project={p} />
          ))}
          <section className="section" data-section-label="More projects" aria-labelledby="more-heading">
            <div className="container">
              <div className="section-head">
                <span className="index">03–04</span>
                <h2 id="more-heading">More systems</h2>
                <p className="lede">
                  Two projects that show different kinds of depth: a dense solo boss fight, and a typed multiplayer
                  architecture outside of Unity.
                </p>
              </div>
              {sheets.map((p) => (
                <ProjectSheet key={p.slug} project={p} />
              ))}
            </div>
          </section>
          <SmallProjects />
        </div>
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
