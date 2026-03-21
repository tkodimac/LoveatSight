import { useEffect, useState } from "react";

interface RevealPopupProps {
  displayName: string;
  facePhotoUrl: string | null;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  "oklch(0.72 0.20 340)",
  "oklch(0.60 0.22 290)",
  "oklch(0.78 0.15 75)",
  "oklch(0.75 0.18 295)",
  "oklch(0.80 0.18 340)",
  "oklch(0.65 0.22 50)",
];

function ConfettiPiece({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = `${5 + (index * 7.3) % 90}%`;
  const delay = `${(index * 0.08) % 1.5}s`;
  const duration = `${1.5 + (index * 0.1) % 1}s`;
  const size = `${6 + (index * 3) % 8}px`;
  const shape = index % 3 === 0 ? "50%" : index % 3 === 1 ? "2px" : "0%";

  return (
    <div
      className="absolute top-0 pointer-events-none animate-confetti"
      style={{
        left,
        width: size,
        height: size,
        background: color,
        borderRadius: shape,
        animationDelay: delay,
        animationDuration: duration,
        opacity: 0,
      }}
    />
  );
}

export default function RevealPopup({ displayName, facePhotoUrl, onClose }: RevealPopupProps) {
  const [phase, setPhase] = useState<"pulsing" | "revealing" | "revealed">("pulsing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("revealing"), 800);
    const t2 = setTimeout(() => setPhase("revealed"), 1800);
    const t3 = setTimeout(() => onClose(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0.04 0.01 270 / 0.92)", backdropFilter: "blur(12px)" }}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {phase === "revealed" && Array.from({ length: 30 }, (_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 px-8 text-center animate-fade-in-up">
        {/* Title */}
        <div>
          <h2 className="text-3xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.80 0.18 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            It's a match! 💙
          </h2>
          {phase === "revealed" && (
            <p className="text-lg font-semibold text-foreground animate-fade-in-up">
              Found You!
            </p>
          )}
        </div>

        {/* Avatar reveal */}
        <div className="relative">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{
              margin: "-8px",
              background: "transparent",
              border: "2px solid oklch(0.60 0.22 290 / 0.5)",
            }}
          />

          <div
            className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center transition-all duration-1000"
            style={{
              background: "linear-gradient(135deg, oklch(0.25 0.08 285), oklch(0.18 0.05 280))",
              border: "3px solid oklch(0.60 0.22 290)",
              filter: phase === "pulsing"
                ? "blur(20px) brightness(0.3)"
                : phase === "revealing"
                ? "blur(8px) brightness(0.6)"
                : "blur(0) brightness(1)",
              transform: phase === "revealed" ? "scale(1.05)" : "scale(1)",
            }}
          >
            {facePhotoUrl ? (
              <img
                src={facePhotoUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, oklch(0.45 0.20 285), oklch(0.35 0.15 280))" }}
                >
                  {displayName[0]?.toUpperCase() ?? "?"}
                </div>
              </div>
            )}
          </div>

          {/* Pulsing silhouette overlay */}
          {phase === "pulsing" && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center animate-silhouette">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
                <circle cx="12" cy="8" r="4" fill="oklch(0.65 0.10 285)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="oklch(0.65 0.10 285)" />
              </svg>
            </div>
          )}
        </div>

        {/* Name */}
        {phase === "revealed" && (
          <div className="animate-fade-in-up">
            <p className="text-xl font-semibold text-foreground">{displayName}</p>
            <p className="text-sm text-muted-foreground mt-1">Say hello! 👋</p>
          </div>
        )}

        {/* Heartbeat hearts */}
        <div className="flex gap-3">
          {[0, 1, 2].map(i => (
            <svg
              key={i}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-heartbeat"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <defs>
                <linearGradient id={`hg-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                  <stop offset="100%" stopColor="oklch(0.60 0.22 290)" />
                </linearGradient>
              </defs>
              <path
                d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
                fill={`url(#hg-${i})`}
                opacity={phase === "revealed" ? 1 : 0.4}
              />
            </svg>
          ))}
        </div>

        {phase !== "revealed" && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {phase === "pulsing" ? "Revealing..." : "Almost there..."}
          </p>
        )}

        {phase === "revealed" && (
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue to chat →
          </button>
        )}
      </div>
    </div>
  );
}
