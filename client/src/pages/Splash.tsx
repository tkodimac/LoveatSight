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
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              background: `radial-gradient(circle, oklch(0.55 0.28 295), transparent)`,
              top: `${10 + i * 12}%`,
              left: `${5 + i * 15}%`,
              animation: `pulse-glow ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center gap-8 animate-fade-in-up z-10">
        {/* Pulsing heart */}
        <div className="animate-heartbeat animate-pulse-glow-heart">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                <stop offset="100%" stopColor="oklch(0.60 0.22 290)" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
              fill="url(#heartGrad)"
            />
          </svg>
        </div>

        {/* Logo text */}
        <div className="text-center">
          <h1
            className="text-5xl font-light tracking-widest text-glow"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: "linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.80 0.18 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.15em",
            }}
          >
            love at sight
          </h1>
          <p className="text-muted-foreground text-sm mt-3 tracking-[0.3em] uppercase font-light">
            find your mystery
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "oklch(0.60 0.22 290)",
                animation: `pulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
