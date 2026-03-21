import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, EyeOff, Heart, Lock, Mail, User } from "lucide-react";

type Mode = "landing" | "login" | "register";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (isLoading || !user) return;
    if (!user.ageVerified) navigate("/age-gate");
    else if (!user.faceVerified) navigate("/face-verify");
    else if (!user.displayName) navigate("/profile-setup");
    else navigate("/home");
  }, [user, isLoading, navigate]);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Welcome back! 💜");
    },
    onError: (e) => toast.error(e.message),
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Account created! 💜");
    },
    onError: (e) => {
      if (e.message.includes("already registered")) {
        toast.error("Email already registered — try logging in instead");
        setMode("login");
      } else {
        toast.error(e.message);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === "login") {
      loginMutation.mutate({ email: email.trim(), password });
    } else {
      registerMutation.mutate({
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  // ── Landing view ──────────────────────────────────────────────────────────
  if (mode === "landing") {
    return (
      <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="animate-heartbeat">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="hg-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                    <stop offset="100%" stopColor="oklch(0.60 0.22 290)" />
                  </linearGradient>
                </defs>
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" fill="url(#hg-login)" />
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

          {/* CTAs */}
          <div className="w-full space-y-3">
            <Button
              onClick={() => setMode("register")}
              className="w-full h-14 text-base font-semibold rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Create Account
            </Button>

            <Button
              onClick={() => setMode("login")}
              variant="outline"
              className="w-full h-12 text-sm font-medium rounded-2xl"
              style={{
                background: "oklch(0.14 0.04 280)",
                border: "1px solid oklch(0.28 0.07 285)",
                color: "oklch(0.85 0.05 285)",
              }}
            >
              Sign In
            </Button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.05 280)" }} />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.05 280)" }} />
            </div>

            <Button
              onClick={() => { window.location.href = getLoginUrl(); }}
              variant="outline"
              className="w-full h-12 text-sm font-medium rounded-2xl"
              style={{
                background: "oklch(0.12 0.03 280)",
                border: "1px solid oklch(0.25 0.06 280)",
                color: "oklch(0.75 0.05 285)",
              }}
            >
              Continue with Manus
            </Button>

            <p className="text-center text-xs text-muted-foreground px-4 pt-1">
              By continuing, you agree to our Terms of Service. Must be 18+.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Login / Register form ──────────────────────────────────────────────────
  return (
    <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

      {/* Back button */}
      <div className="px-4 pt-5">
        <button
          onClick={() => setMode("landing")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Icon */}
        <div className="mb-6 animate-pulse-glow rounded-full p-4"
          style={{ background: "oklch(0.18 0.06 285 / 0.8)" }}>
          {mode === "login" ? (
            <Lock className="h-8 w-8" style={{ color: "oklch(0.72 0.20 340)" }} />
          ) : (
            <Heart className="h-8 w-8" style={{ color: "oklch(0.72 0.20 340)" }} />
          )}
        </div>

        <h1 className="text-2xl font-semibold text-center mb-1">
          {mode === "login" ? "Welcome back" : "Join Love at Sight"}
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          {mode === "login" ? "Sign in to continue" : "Create your free account"}
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
          {/* Display name (register only) */}
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Display name (optional)"
                maxLength={30}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === "register" ? "Password (min 6 chars)" : "Password"}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!email.trim() || !password.trim() || isPending}
            className="w-full h-12 text-sm font-semibold rounded-2xl mt-2"
            style={{
              background: email.trim() && password.trim()
                ? "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))"
                : "oklch(0.18 0.04 280)",
              border: "none",
            }}
          >
            {isPending
              ? "Please wait..."
              : mode === "login" ? "Sign In 💜" : "Create Account 💜"}
          </Button>
        </form>

        {/* Switch mode */}
        <p className="text-sm text-muted-foreground mt-6">
          {mode === "login" ? (
            <>Don't have an account?{" "}
              <button onClick={() => setMode("register")} className="font-medium hover:text-foreground transition-colors"
                style={{ color: "oklch(0.70 0.15 295)" }}>
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{" "}
              <button onClick={() => setMode("login")} className="font-medium hover:text-foreground transition-colors"
                style={{ color: "oklch(0.70 0.15 295)" }}>
                Sign in
              </button>
            </>
          )}
        </p>

        {/* Divider + Manus OAuth */}
        <div className="w-full max-w-xs mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.05 280)" }} />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.05 280)" }} />
          </div>
          <Button
            onClick={() => { window.location.href = getLoginUrl(); }}
            variant="outline"
            className="w-full h-11 text-xs font-medium rounded-2xl"
            style={{
              background: "oklch(0.12 0.03 280)",
              border: "1px solid oklch(0.25 0.06 280)",
              color: "oklch(0.65 0.05 285)",
            }}
          >
            Continue with Manus
          </Button>
        </div>

        {/* Test accounts hint */}
        {mode === "login" && (
          <div className="w-full max-w-xs mt-6 p-3 rounded-xl"
            style={{ background: "oklch(0.55 0.25 295 / 0.08)", border: "1px solid oklch(0.55 0.25 295 / 0.2)" }}>
            <p className="text-xs text-center mb-2" style={{ color: "oklch(0.65 0.12 295)" }}>
              🧪 Test accounts
            </p>
            <div className="space-y-1">
              {[
                { name: "Aria", email: "aria@test.com" },
                { name: "Sam", email: "sam@test.com" },
                { name: "Jordan", email: "jordan@test.com" },
              ].map(acc => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword("password123"); }}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
                  style={{ color: "oklch(0.75 0.08 285)" }}
                >
                  <span className="font-medium">{acc.name}</span>
                  <span className="text-muted-foreground ml-2">{acc.email} / password123</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
