import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle, Flame, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriptionSuccess() {
  const [, navigate] = useLocation();
  const [activated, setActivated] = useState(false);
  const [tier, setTier] = useState<"spark" | "flame" | null>(null);
  const utils = trpc.useUtils();

  const activate = trpc.subscription.activate.useMutation({
    onSuccess: () => {
      setActivated(true);
      utils.user.getProfile.invalidate();
      utils.subscription.getStatus.invalidate();
    },
    onError: (err) => {
      // If already activated (e.g. webhook already did it), still show success
      console.warn("[SubscriptionSuccess] activate error:", err.message);
      setActivated(true);
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const tierParam = params.get("tier") as "spark" | "flame" | null;

    if (!sessionId || !tierParam) {
      navigate("/home");
      return;
    }

    setTier(tierParam);

    // Activate via tRPC (webhook may have already done this — activate is idempotent)
    activate.mutate({ tier: tierParam, sessionId });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activated) {
      toast.success(`${tier === "flame" ? "Flame 🔥" : "Spark ⚡"} subscription activated!`);
      const timer = setTimeout(() => navigate("/home"), 3000);
      return () => clearTimeout(timer);
    }
  }, [activated, tier, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(180deg, oklch(0.08 0.04 280) 0%, oklch(0.04 0.02 270) 100%)" }}
    >
      <div className="text-center max-w-sm w-full animate-fade-in-up">
        {!activated ? (
          <>
            <Loader2 className="h-16 w-16 mx-auto mb-6 animate-spin" style={{ color: "oklch(0.60 0.22 290)" }} />
            <h1 className="text-2xl font-bold mb-2">Activating your plan…</h1>
            <p className="text-muted-foreground text-sm">Just a moment while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="mb-6">
              {tier === "flame" ? (
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center animate-heartbeat"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.55 0.20 30))" }}>
                  <Flame className="h-12 w-12 text-white" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center animate-heartbeat"
                  style={{ background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))" }}>
                  <Zap className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6" style={{ color: "oklch(0.65 0.22 145)" }} />
              <h1 className="text-2xl font-bold">
                {tier === "flame" ? "Flame activated! 🔥" : "Spark activated! ⚡"}
              </h1>
            </div>

            <p className="text-muted-foreground text-sm mb-2">
              {tier === "flame"
                ? "You now have unlimited reveals and all premium features."
                : "You now have unlimited knocks and 1 reveal per month."}
            </p>
            <p className="text-xs text-muted-foreground mb-8">Redirecting you back to the app…</p>

            <Button
              onClick={() => navigate("/home")}
              className="w-full h-12 rounded-2xl font-semibold"
              style={{
                background: tier === "flame"
                  ? "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.55 0.20 30))"
                  : "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              Go to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
