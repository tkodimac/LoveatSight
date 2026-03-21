import { useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();

  // If already logged in, redirect
  if (user) {
    if (!user.ageVerified) {
      navigate("/age-gate");
    } else if (!user.faceVerified) {
      navigate("/face-verify");
    } else {
      navigate("/home");
    }
    return null;
  }

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="animate-heartbeat">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="hg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                  <stop offset="100%" stopColor="oklch(0.60 0.22 290)" />
                </linearGradient>
              </defs>
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="url(#hg2)" />
            </svg>
          </div>
          <h1 className="text-3xl font-light tracking-widest"
            style={{
              background: "linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.80 0.18 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            love at sight
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase font-light">
            find your mystery
          </p>
        </div>

        {/* Feature highlights */}
        <div className="w-full space-y-3 mb-10">
          {[
            { icon: "👤", text: "Anonymous matching — faces hidden until mutual like" },
            { icon: "📍", text: "Discover people nearby, in real time" },
            { icon: "💜", text: "Premium reveals — unlock the mystery" },
          ].map((item, i) => (
            <div key={i} className="glass-card flex items-center gap-3 px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm text-foreground/80">{item.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="w-full space-y-3">
          <Button
            onClick={handleLogin}
            className="w-full h-14 text-base font-semibold rounded-2xl glow-purple"
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
              border: "none",
            }}
          >
            <Heart className="mr-2 h-5 w-5" />
            Sign in / Create Account
          </Button>
          <p className="text-center text-xs text-muted-foreground px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy. Must be 18+.
          </p>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="flex justify-center pb-8 gap-1">
        {[...Array(3)].map((_, i) => (
          <Sparkles key={i} className="h-3 w-3 text-muted-foreground/30" />
        ))}
      </div>
    </div>
  );
}
