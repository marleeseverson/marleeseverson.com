/**
 * A small enemy-AI simulation: the Idle → Patrol → Chase → Attack state machine from the
 * Roblox Plate Game, ported to TypeScript and rendered as ink marks on the hero.
 * Pure logic + canvas drawing; no React in here so it can be unit-tested or reused.
 */
export type AgentState = 'idle' | 'patrol' | 'chase' | 'attack';

export const STATES: AgentState[] = ['idle', 'patrol', 'chase', 'attack'];

export interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  state: AgentState;
  /** Seconds remaining in the current state's timer (idle wait, attack windup/cooldown). */
  timer: number;
  /** Patrol waypoint. */
  tx: number;
  ty: number;
  /** Per-agent variation so the swarm doesn't move in lockstep. */
  speed: number;
  sight: number;
  /** 0..1 attack pulse used for drawing. */
  pulse: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Palette {
  ink: string;
  accent: string;
  muted: string;
}

const PATROL_SPEED = 26; // px/s
const CHASE_SPEED = 95;
const ATTACK_LUNGE = 260;
const ATTACK_RANGE = 34;
const LOSE_RANGE_FACTOR = 1.6;
const SEPARATION = 26;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class AgentField {
  agents: Agent[] = [];
  target = { x: 0, y: 0, active: false };
  /** Patrol waypoints avoid this rectangle (the headline), so the text stays readable. */
  keepOut: Rect | null = null;
  counts: Record<AgentState, number> = { idle: 0, patrol: 0, chase: 0, attack: 0 };
  private w = 1;
  private h = 1;

  constructor(count: number, w: number, h: number) {
    this.resize(w, h);
    for (let i = 0; i < count; i++) this.agents.push(this.spawn());
  }

  setCount(count: number) {
    while (this.agents.length < count) this.agents.push(this.spawn());
    this.agents.length = Math.min(this.agents.length, count);
  }

  resize(w: number, h: number) {
    this.w = Math.max(1, w);
    this.h = Math.max(1, h);
    for (const a of this.agents) {
      a.x = Math.min(a.x, this.w);
      a.y = Math.min(a.y, this.h);
    }
  }

  private spawn(): Agent {
    const p = this.randomPoint();
    const a: Agent = {
      x: p.x,
      y: p.y,
      vx: 0,
      vy: 0,
      heading: rand(0, Math.PI * 2),
      state: Math.random() < 0.5 ? 'idle' : 'patrol',
      timer: rand(0.5, 3),
      tx: p.x,
      ty: p.y,
      speed: rand(0.8, 1.25),
      sight: rand(150, 210),
      pulse: 0,
    };
    const wp = this.randomPoint();
    a.tx = wp.x;
    a.ty = wp.y;
    return a;
  }

  private randomPoint() {
    const margin = 24;
    for (let i = 0; i < 12; i++) {
      const x = rand(margin, this.w - margin);
      const y = rand(margin, this.h - margin);
      const k = this.keepOut;
      if (!k || x < k.x || x > k.x + k.w || y < k.y || y > k.y + k.h) return { x, y };
    }
    return { x: rand(margin, this.w - margin), y: rand(margin, this.h - margin) };
  }

  step(dt: number) {
    dt = Math.min(dt, 0.05);
    const t = this.target;
    const counts = { idle: 0, patrol: 0, chase: 0, attack: 0 };

    for (const a of this.agents) {
      const dx = t.x - a.x;
      const dy = t.y - a.y;
      const dist = Math.hypot(dx, dy);
      const sees = t.active && dist < a.sight;

      // ---- transitions ----
      switch (a.state) {
        case 'idle':
          a.timer -= dt;
          if (sees) this.enter(a, 'chase');
          else if (a.timer <= 0) {
            const wp = this.randomPoint();
            a.tx = wp.x;
            a.ty = wp.y;
            this.enter(a, 'patrol');
          }
          break;
        case 'patrol':
          if (sees) this.enter(a, 'chase');
          else if (Math.hypot(a.tx - a.x, a.ty - a.y) < 6) this.enter(a, 'idle');
          break;
        case 'chase':
          if (!t.active || dist > a.sight * LOSE_RANGE_FACTOR) this.enter(a, 'idle');
          else if (dist < ATTACK_RANGE) this.enter(a, 'attack');
          break;
        case 'attack':
          a.timer -= dt;
          if (a.timer <= 0) this.enter(a, sees ? 'chase' : 'idle');
          break;
      }

      // ---- behaviour ----
      let ax = 0;
      let ay = 0;
      if (a.state === 'patrol') {
        const px = a.tx - a.x;
        const py = a.ty - a.y;
        const d = Math.hypot(px, py) || 1;
        ax = (px / d) * PATROL_SPEED * a.speed;
        ay = (py / d) * PATROL_SPEED * a.speed;
      } else if (a.state === 'chase') {
        const d = dist || 1;
        ax = (dx / d) * CHASE_SPEED * a.speed;
        ay = (dy / d) * CHASE_SPEED * a.speed;
      } else if (a.state === 'attack') {
        // Short lunge toward the target, then a recoil while the timer runs down.
        const d = dist || 1;
        const lunge = a.timer > 0.45 ? ATTACK_LUNGE : -40;
        ax = (dx / d) * lunge;
        ay = (dy / d) * lunge;
        a.pulse = Math.max(a.pulse, a.timer > 0.45 ? 1 : 0);
      }

      // Separation so agents don't stack.
      for (const b of this.agents) {
        if (b === a) continue;
        const sx = a.x - b.x;
        const sy = a.y - b.y;
        const d = Math.hypot(sx, sy);
        if (d > 0 && d < SEPARATION) {
          ax += (sx / d) * (SEPARATION - d) * 4;
          ay += (sy / d) * (SEPARATION - d) * 4;
        }
      }

      // Smooth velocity, integrate, keep inside bounds.
      const k = a.state === 'attack' ? 0.5 : 0.12;
      a.vx += (ax - a.vx) * k;
      a.vy += (ay - a.vy) * k;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      if (a.x < 8) a.x = 8;
      if (a.x > this.w - 8) a.x = this.w - 8;
      if (a.y < 8) a.y = 8;
      if (a.y > this.h - 8) a.y = this.h - 8;

      const sp = Math.hypot(a.vx, a.vy);
      if (sp > 2) {
        const target = Math.atan2(a.vy, a.vx);
        let diff = target - a.heading;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        a.heading += diff * Math.min(1, dt * 10);
      }
      a.pulse = Math.max(0, a.pulse - dt * 2.2);
      counts[a.state]++;
    }
    this.counts = counts;
  }

  private enter(a: Agent, next: AgentState) {
    a.state = next;
    if (next === 'idle') a.timer = rand(0.8, 3.2);
    if (next === 'attack') a.timer = 0.75;
  }

  /** Draws the field. `ctx` should already be scaled for device pixel ratio. */
  render(ctx: CanvasRenderingContext2D, palette: Palette, showLabels: boolean) {
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.lineWidth = 1.2;
    ctx.lineJoin = 'round';
    ctx.font = '500 10px "JetBrains Mono Variable", ui-monospace, monospace';
    ctx.textBaseline = 'middle';

    const t = this.target;

    for (const a of this.agents) {
      const hot = a.state === 'chase' || a.state === 'attack';

      // Line of sight to the target while chasing.
      if (hot && t.active) {
        ctx.strokeStyle = palette.accent;
        ctx.globalAlpha = 0.18;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(t.x, t.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Patrol waypoint tick.
      if (a.state === 'patrol') {
        ctx.strokeStyle = palette.muted;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(a.tx - 3, a.ty);
        ctx.lineTo(a.tx + 3, a.ty);
        ctx.moveTo(a.tx, a.ty - 3);
        ctx.lineTo(a.tx, a.ty + 3);
        ctx.stroke();
      }

      // The agent: a triangle pointing along its heading.
      const s = 7;
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.heading);
      ctx.beginPath();
      ctx.moveTo(s * 1.3, 0);
      ctx.lineTo(-s, s * 0.8);
      ctx.lineTo(-s * 0.55, 0);
      ctx.lineTo(-s, -s * 0.8);
      ctx.closePath();
      ctx.globalAlpha = hot ? 0.95 : 0.6;
      if (hot) {
        ctx.fillStyle = palette.accent;
        ctx.fill();
      } else {
        ctx.strokeStyle = palette.ink;
        ctx.stroke();
      }
      ctx.restore();

      // Attack pulse ring.
      if (a.pulse > 0) {
        ctx.strokeStyle = palette.accent;
        ctx.globalAlpha = a.pulse * 0.7;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 10 + (1 - a.pulse) * 22, 0, Math.PI * 2);
        ctx.stroke();
      }

      // State label.
      if (showLabels) {
        ctx.globalAlpha = hot ? 0.9 : 0.5;
        ctx.fillStyle = hot ? palette.accent : palette.muted;
        ctx.fillText(a.state.toUpperCase(), a.x + 12, a.y + 1);
      }
    }

    // The target (cursor) as a small reticle.
    if (t.active) {
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(t.x - 14, t.y);
      ctx.lineTo(t.x - 11, t.y);
      ctx.moveTo(t.x + 11, t.y);
      ctx.lineTo(t.x + 14, t.y);
      ctx.moveTo(t.x, t.y - 14);
      ctx.lineTo(t.x, t.y - 11);
      ctx.moveTo(t.x, t.y + 11);
      ctx.lineTo(t.x, t.y + 14);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
