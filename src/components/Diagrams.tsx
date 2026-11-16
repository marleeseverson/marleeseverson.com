import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/lib/motion';
import s from './Diagrams.module.css';

const FSM_STATES = ['Idle', 'Patrol', 'Chase', 'Attack'] as const;
/**
 * Edges of the pipeline. Forward edges between neighbours are straight; everything else arcs
 * above (forward skips) or below (returns) so no two labels share a lane.
 */
const FSM_EDGES: { from: number; to: number; label: string; lane: 'straight' | 'above' | 'below'; depth?: number }[] = [
  { from: 0, to: 1, label: 'timer up', lane: 'straight' },
  { from: 1, to: 2, label: 'sees player', lane: 'straight' },
  { from: 2, to: 3, label: 'in range', lane: 'straight' },
  { from: 0, to: 2, label: 'player in sight', lane: 'above', depth: 78 },
  { from: 1, to: 0, label: 'waypoint reached', lane: 'below', depth: 56 },
  { from: 3, to: 2, label: 'cooldown', lane: 'below', depth: 56 },
  { from: 2, to: 0, label: 'target lost', lane: 'below', depth: 108 },
];

/**
 * The enemy state machine, drawn as a graph. The active state steps along a representative path
 * (Idle → Patrol → Chase → Attack → Chase → Idle) so the diagram reads as a loop, not a table.
 */
export function StateMachineDiagram() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const path = [0, 1, 2, 3, 2, 0];
    let i = 0;
    let timer = 0;
    let running = false;
    const tick = () => {
      i = (i + 1) % path.length;
      setActive(path[i]);
      timer = window.setTimeout(tick, path[i] === 3 ? 700 : 1300);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        timer = window.setTimeout(tick, 900);
      } else if (!e.isIntersecting && running) {
        running = false;
        window.clearTimeout(timer);
      }
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduced]);

  // Node layout: a left-to-right pipeline; return transitions arc underneath.
  const Y = 128;
  const R = 30;
  const pos = [
    { x: 60, y: Y },
    { x: 200, y: Y },
    { x: 340, y: Y },
    { x: 480, y: Y },
  ];

  return (
    <figure className={s.diagram}>
      <svg ref={ref} viewBox="0 0 540 268" className={s.svg} role="img" aria-labelledby="fsm-title fsm-desc">
        <title id="fsm-title">Enemy AI state machine</title>
        <desc id="fsm-desc">
          Four states: Idle, Patrol, Chase, Attack. Idle goes to Patrol when a timer runs out and to Chase when the
          player is in sight. Patrol returns to Idle at its waypoint or goes to Chase on sight. Chase goes to Attack in
          range and back to Idle when the target is lost. Attack returns to Chase after a cooldown.
        </desc>
        <defs>
          <marker id="fsm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
        {FSM_EDGES.map((e) => {
          const a = pos[e.from];
          const b = pos[e.to];
          const hot = active === e.from;
          let d: string;
          let lx: number;
          let ly: number;
          if (e.lane === 'straight') {
            const sx = a.x + R + 4;
            const ex = b.x - R - 6;
            d = `M${sx},${Y} L${ex},${Y}`;
            lx = (sx + ex) / 2;
            ly = Y - 9;
          } else {
            // Leave/enter the circles at an angle so arcs don't pile up on the straight lane.
            const sign = e.lane === 'above' ? -1 : 1;
            const depth = e.depth ?? 60;
            const dir = Math.sign(b.x - a.x) || 1;
            const sx = a.x + dir * R * 0.55;
            const sy = Y + sign * R * 0.84;
            const ex = b.x - dir * R * 0.55;
            const ey = Y + sign * (R * 0.84 + 4);
            const cx = (sx + ex) / 2;
            const cy = Y + sign * (R + depth);
            d = `M${sx},${sy} Q${cx},${cy} ${ex},${ey}`;
            // Quadratic midpoint = 0.25·P0 + 0.5·P1 + 0.25·P2; label just outside it.
            lx = cx;
            ly = 0.25 * sy + 0.5 * cy + 0.25 * ey + sign * 11 + (sign < 0 ? 0 : 3);
          }
          return (
            <g key={`${e.from}-${e.to}`} className={hot ? s.edgeHot : s.edge}>
              <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#fsm-arrow)" />
              <text x={lx} y={ly} textAnchor="middle" className={s.edgeLabel}>
                {e.label}
              </text>
            </g>
          );
        })}
        {FSM_STATES.map((name, i) => (
          <g key={name} transform={`translate(${pos[i].x} ${pos[i].y})`} className={active === i ? s.nodeActive : s.node}>
            <circle r={R} fill="var(--surface)" stroke="currentColor" strokeWidth="1.4" />
            <text textAnchor="middle" dominantBaseline="middle" className={s.nodeLabel}>
              {name}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className={`mono ${s.caption}`}>
        Fig. 04.1 Enemy state machine. Transitions are explicit; enemy types tune sight range, speed and damage through
        configuration.
      </figcaption>
    </figure>
  );
}

/** Client/server architecture of the Plate Game: what runs where, and what crosses the wire. */
export function ArchitectureDiagram() {
  return (
    <figure className={s.diagram}>
      <svg viewBox="0 0 460 250" className={s.svg} role="img" aria-labelledby="arch-title arch-desc">
        <title id="arch-title">Client-server architecture</title>
        <desc id="arch-desc">
          The server owns the round loop, the plate events built on a BaseEvent class, the enemy AI and the inventory
          and tool systems. The client runs a React UI. Remotes and signals carry messages between them.
        </desc>
        <defs>
          <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Server */}
        <g className={s.box}>
          <rect x="10" y="14" width="250" height="222" rx="3" fill="var(--surface)" stroke="currentColor" strokeWidth="1.4" />
          <text x="24" y="36" className={s.boxTitle}>
            SERVER · authoritative
          </text>
          <g transform="translate(24 52)">
            <Block y={0} w={222} title="Round loop" sub="picks & runs an event per round" />
            <Block y={46} w={222} title="BaseEvent → 7 plate events" sub="shared lifecycle, per-event config" />
            <Block y={92} w={106} title="Enemy AI" sub="FSM · config types" />
            <Block y={92} x={116} w={106} title="Inventory & tools" sub="server-side" />
          </g>
        </g>

        {/* Client */}
        <g className={s.box}>
          <rect x="330" y="14" width="120" height="222" rx="3" fill="var(--surface)" stroke="currentColor" strokeWidth="1.4" />
          <text x="344" y="36" className={s.boxTitle}>
            CLIENT
          </text>
          <g transform="translate(344 52)">
            <Block y={0} w={92} title="React UI" sub="roblox-ts" />
            <Block y={46} w={92} title="Input" sub="player actions" />
            <Block y={92} w={92} title="Local FX" sub="feedback" />
          </g>
        </g>

        {/* Wire */}
        <g className={s.wire}>
          <path d="M262,90 L328,90" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arch-arrow)" />
          <text x="295" y="82" textAnchor="middle" className={s.wireLabel}>
            remotes
          </text>
          <path d="M328,140 L262,140" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arch-arrow)" />
          <text x="295" y="156" textAnchor="middle" className={s.wireLabel}>
            signals
          </text>
          <text x="295" y="118" textAnchor="middle" className={s.wireLabel}>
            typed messages
          </text>
        </g>
      </svg>
      <figcaption className={`mono ${s.caption}`}>
        Fig. 04.2 What runs where. Game rules and inventory stay on the server; the client renders and reports input.
      </figcaption>
    </figure>
  );
}

function Block({ x = 0, y, w, title, sub }: { x?: number; y: number; w: number; title: string; sub: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height="38" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <text x="8" y="16" className={s.blockTitle}>
        {title}
      </text>
      <text x="8" y="30" className={s.blockSub}>
        {sub}
      </text>
    </g>
  );
}
