import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flame, X, Zap, ExternalLink, CheckCircle, Loader2 } from "lucide-react";

type Tier = "spark" | "flame";

interface PaywallPopupProps {
  matchId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaywallPopup({ onClose, onSuccess }: PaywallPopupProps) {
  const [selectedTier, setSelectedTier] = useState<Tier>("flame");

  const createCheckout = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: ({ url }) => {
      toast.success("Redirecting to secure checkout…");
      window.open(url, "_blank");
      // Close popup — user will return to /subscription/success after payment
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || "Could not start checkout. Please try again.");
    },
  });

  const handleCheckout = () => {
    createCheckout.mutate({
      tier: selectedTier,
      origin: window.location.origin,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "oklch(0.04 0.01 270 / 0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-[430px] animate-fade-in-up"
        style={{
          background: "oklch(0.11 0.04 280)",
          borderRadius: "24px 24px 0 0",
          border: "1px solid oklch(0.30 0.08 285 / 0.5)",
          boxShadow: "0 -8px 40px oklch(0.55 0.28 295 / 0.2)",
          maxHeight: "90dvh",
          overflowY: "auto",
        }}
      >
        {/* Header drag handle + close */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2">
          <div />
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: "oklch(0.30 0.08 285)" }} />
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 pb-8">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2 animate-heartbeat">💙</div>
            <h2 className="text-2xl font-bold">It's a match!</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Unlock the reveal to see who's waiting for you
            </p>
          </div>

          {/* Tier cards */}
          <div className="space-y-3 mb-6">
            {/* Spark */}
            <button
              onClick={() => setSelectedTier("spark")}
              className="w-full p-4 rounded-2xl text-left transition-all"
              style={{
                background: selectedTier === "spark"
                  ? "oklch(0.20 0.07 285)"
                  : "oklch(0.14 0.04 280)",
                border: `2px solid ${selectedTier === "spark" ? "oklch(0.55 0.22 290)" : "oklch(0.22 0.05 280)"}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, oklch(0.50 0.20 290), oklch(0.40 0.15 280))" }}>
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Spark</p>
                    <p className="text-xs text-muted-foreground">Perfect to get started</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">£2</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1">
                {["Unlimited knocks", "1 reveal/month", "Basic matching", "Chat access"].map(f => (
                  <div key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 flex-shrink-0" style={{ color: "oklch(0.60 0.22 290)" }} />
                    {f}
                  </div>
                ))}
              </div>
            </button>

            {/* Flame — highlighted */}
            <button
              onClick={() => setSelectedTier("flame")}
              className="w-full p-4 rounded-2xl text-left transition-all relative overflow-hidden"
              style={{
                background: selectedTier === "flame"
                  ? "linear-gradient(135deg, oklch(0.22 0.08 285), oklch(0.18 0.06 280))"
                  : "oklch(0.14 0.04 280)",
                border: `2px solid ${selectedTier === "flame" ? "oklch(0.60 0.25 295)" : "oklch(0.22 0.05 280)"}`,
                boxShadow: selectedTier === "flame" ? "0 0 20px oklch(0.55 0.28 295 / 0.25)" : "none",
              }}
            >
              <div className="absolute top-3 right-3">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.60 0.25 30))", color: "white" }}>
                  BEST VALUE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.55 0.20 30))" }}>
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Flame</p>
                    <p className="text-xs text-muted-foreground">Full premium experience</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">£5</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1">
                {["Unlimited reveals", "Premium matching", "Priority support", "All Spark features"].map(f => (
                  <div key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3 flex-shrink-0" style={{ color: "oklch(0.70 0.22 50)" }} />
                    {f}
                  </div>
                ))}
              </div>
            </button>
          </div>

          {/* Checkout button */}
          <Button
            onClick={handleCheckout}
            disabled={createCheckout.isPending}
            className="w-full h-14 text-base font-semibold rounded-2xl"
            style={{
              background: selectedTier === "flame"
                ? "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.55 0.20 30))"
                : "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
              border: "none",
            }}
          >
            {createCheckout.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : selectedTier === "flame" ? (
              <Flame className="mr-2 h-5 w-5" />
            ) : (
              <Zap className="mr-2 h-5 w-5" />
            )}
            {createCheckout.isPending
              ? "Opening checkout…"
              : `Pay with Stripe — £${selectedTier === "flame" ? "5" : "2"}/mo`}
            {!createCheckout.isPending && <ExternalLink className="ml-2 h-4 w-4 opacity-70" />}
          </Button>

          {/* Test card hint */}
          <div className="text-center mt-3 mb-1">
            <p className="text-xs text-muted-foreground">
              🧪 Test card: <span className="font-mono">4242 4242 4242 4242</span> · any future date · any CVV
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full text-sm text-muted-foreground py-3 hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
