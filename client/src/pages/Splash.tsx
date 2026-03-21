import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Splash() {
  const [, navigate] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        if (!user.ageVerified) {
          navigate("/age-gate");
        } else if (!user.faceVerified) {
          navigate("/face-verify");
        } else if (!user.displayName) {
          navigate("/profile-setup");
        } else {
          navigate("/home");
        }
      } else {
        navigate("/login");
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  return (
    <div className="app-container flex flex-col items-center justify-center min-h-dvh relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.30 0.12 285 / 0.4), transparent)",
        }}
      />

      {/* Outer pulse ring */}
      <div
        className="absolute w-64 h-64 rounded-full animate-ping"
        style={{
          background: "transparent",
          border: "1px solid oklch(0.55 0.22 295 / 0.15)",
          animationDuration: "2.5s",
        }}
      />
      <div
        className="absolute w-48 h-48 rounded-full animate-ping"
        style={{
          background: "transparent",
          border: "1px solid oklch(0.55 0.22 295 / 0.2)",
          animationDuration: "2s",
          animationDelay: "0.3s",
        }}
      />

      {/* Heart icon */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="animate-heartbeat">
          <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="splash-hg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                <stop offset="50%" stopColor="oklch(0.65 0.25 295)" />
                <stop offset="100%" stopColor="oklch(0.55 0.22 285)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
              fill="url(#splash-hg)"
              filter="url(#glow)"
            />
          </svg>
        </div>

        {/* App name */}
        <div className="text-center">
          <h1
            className="text-4xl font-light tracking-widest mb-2"
            style={{
              background: "linear-gradient(135deg, oklch(0.90 0.08 295), oklch(0.85 0.14 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            love at sight
          </h1>
          <p className="text-sm tracking-widest uppercase text-muted-foreground font-light">
            find your mystery
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: "oklch(0.60 0.22 290)",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
