import { useId } from 'react';
import s from './AwardStamp.module.css';

interface Props {
  /** Text that runs around the ring, e.g. "1ST OVERALL · MINI JAM 220 · ". Repeated to fill. */
  ring: string;
  /** Short lines for the centre. */
  center: string[];
  className?: string;
}

/** A circular "award stamp": ring text on an SVG textPath, rotated by the parent on scroll. */
export default function AwardStamp({ ring, center, className }: Props) {
  const id = useId();
  const pathId = `stamp-${id}`;
  const text = (ring + ring).slice(0, 96);
  return (
    <div className={`${s.stamp} ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={s.ring} data-stamp-ring>
        <defs>
          <path id={pathId} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <text className={s.ringText}>
          <textPath href={`#${pathId}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <div className={s.center}>
        {center.map((line, i) => (
          <span key={i} className={i === 0 ? s.centerBig : s.centerSmall}>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
