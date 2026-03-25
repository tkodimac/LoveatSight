import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle" | "star";
  alpha: number;
  decay: number;
  gravity: number;
}

const COLORS = [
  // Purple family
  "oklch(0.65 0.28 295)",
  "oklch(0.55 0.30 290)",
  "oklch(0.72 0.22 300)",
  "oklch(0.50 0.32 285)",
  // Violet / pink
  "oklch(0.70 0.22 320)",
  "oklch(0.75 0.20 340)",
  "oklch(0.65 0.25 310)",
  // White / silver
  "oklch(0.95 0.02 280)",
  "oklch(0.90 0.04 290)",
  "oklch(0.85 0.06 295)",
  // Bright accent
  "oklch(0.80 0.18 295)",
];

function createParticle(cx: number, cy: number): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = 4 + Math.random() * 10;
  return {
    x: cx,
    y: cy,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (3 + Math.random() * 4), // upward bias
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 4 + Math.random() * 7,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.25,
    shape: (["rect", "rect", "circle", "star"] as const)[Math.floor(Math.random() * 4)],
    alpha: 1,
    decay: 0.012 + Math.random() * 0.010,
    gravity: 0.18 + Math.random() * 0.12,
  };
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  const spikes = 5;
  const inner = r * 0.45;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i * Math.PI) / spikes - Math.PI / 2;
    const radius = i % 2 === 0 ? r : inner;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
    else ctx.lineTo(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
  }
  ctx.closePath();
  ctx.fill();
}

interface ConfettiBurstProps {
  /** Whether to fire the burst. Set to true to trigger. */
  active: boolean;
  /** Number of particles (default 120) */
  count?: number;
  /** Duration in ms before canvas unmounts (default 3500) */
  duration?: number;
}

export default function ConfettiBurst({ active, count = 120, duration = 3500 }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Burst from center
    const cx = W / 2;
    const cy = H * 0.45;

    const particles: Particle[] = Array.from({ length: count }, () => createParticle(cx, cy));

    let running = true;

    function tick() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, W, H);

      let alive = 0;
      for (const p of particles) {
        if (p.alpha <= 0) continue;
        alive++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          drawStar(ctx, 0, 0, p.size / 2);
        } else {
          // rect (ribbon)
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      }

      if (alive > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    const timeout = setTimeout(() => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    }, duration);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(timeout);
    };
  }, [active, count, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ zIndex: 10 }}
    />
  );
}
