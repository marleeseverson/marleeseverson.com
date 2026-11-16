import { useRef } from 'react';
import { columns, concepts, rows } from '@/data/skills';
import { useReveal } from '@/lib/motion';
import s from './Skills.module.css';

/**
 * Skills as evidence: a matrix of language/tool × project, so every claim points at something
 * on this page. Concepts list where each one shows up.
 */
export default function Skills() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const groups = ['Languages', 'Tools'] as const;

  return (
    <section id="skills" ref={root} className="section" data-section-label="Skills" aria-labelledby="skills-heading">
      <div className="container">
        <div className="section-head">
          <span className="index">05</span>
          <h2 id="skills-heading">Skills, with receipts</h2>
          <p className="lede">
            Every language and tool below is marked with where I actually used it. No badge without a project behind
            it.
          </p>
        </div>

        <div className={s.layout}>
          <div className={s.matrixWrap} data-reveal>
            <table className={s.matrix}>
              <caption className="visually-hidden">Languages and tools by project where they were used</caption>
              <thead>
                <tr>
                  <th scope="col" className={s.cornerCell}>
                    <span className="visually-hidden">Skill</span>
                  </th>
                  {columns.map((c) => (
                    <th key={c.id} scope="col" className={`mono ${s.colHead}`} title={c.label}>
                      <span className={s.colFull}>{c.label}</span>
                      <span className={s.colShort} aria-hidden="true">
                        {c.short}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g}>
                  <tr className={s.groupRow}>
                    <th scope="rowgroup" colSpan={columns.length + 1} className={`mono ${s.groupHead}`}>
                      {g}
                    </th>
                  </tr>
                  {rows
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <tr key={r.name} className={s.row}>
                        <th scope="row" className={s.rowHead}>
                          {r.name}
                        </th>
                        {columns.map((c) => {
                          const used = r.used.includes(c.id);
                          return (
                            <td key={c.id} className={s.cell} data-used={used || undefined}>
                              <span className={s.dot} aria-hidden="true" />
                              <span className="visually-hidden">{used ? `Used in ${c.label}` : ''}</span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>

          <div className={s.concepts}>
            <h3 className={`mono ${s.conceptsTitle}`} data-reveal>
              Concepts
            </h3>
            <ul className={s.conceptList}>
              {concepts.map((c) => (
                <li key={c.name} className={s.concept} data-reveal-group="concepts">
                  <span className={s.conceptName}>{c.name}</span>
                  <span className={`mono ${s.conceptWhere}`}>{c.where}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
