import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Flame, X, Zap, CreditCard, Lock, CheckCircle } from "lucide-react";

type Tier = "spark" | "flame";

interface PaywallPopupProps {
  matchId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaywallPopup({ matchId, onClose, onSuccess }: PaywallPopupProps) {
  const [selectedTier, setSelectedTier] = useState<Tier>("flame");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<"select" | "checkout" | "success">("select");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const activateSub = trpc.subscription.activate.useMutation({
    onSuccess: () => {
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    },
    onError: () => {
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    },
  });

  const handleCheckout = () => {
    setStep("checkout");
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvv || !cardName) {
      toast.error("Please fill in all card details");
      return;
    }
    setProcessing(true);
    // Simulate Stripe test payment processing
    await new Promise(r => setTimeout(r, 1500));
    const sessionId = `test_${Date.now()}_${selectedTier}`;
    activateSub.mutate({ tier: selectedTier, sessionId });
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
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
        {/* Close button */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2">
          <div />
          <div className="w-10 h-1 rounded-full mx-auto" style={{ background: "oklch(0.30 0.08 285)" }} />
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {step === "select" && (
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

            <Button
              onClick={handleCheckout}
              className="w-full h-14 text-base font-semibold rounded-2xl"
              style={{
                background: selectedTier === "flame"
                  ? "linear-gradient(135deg, oklch(0.65 0.22 50), oklch(0.55 0.20 30))"
                  : "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              {selectedTier === "flame" ? <Flame className="mr-2 h-5 w-5" /> : <Zap className="mr-2 h-5 w-5" />}
              Get {selectedTier === "flame" ? "Flame" : "Spark"} — £{selectedTier === "flame" ? "5" : "2"}/mo
            </Button>

            <button
              onClick={onClose}
              className="w-full text-sm text-muted-foreground py-3 hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>
        )}

        {step === "checkout" && (
          <div className="px-6 pb-8">
            <div className="text-center mb-6">
              <CreditCard className="h-10 w-10 mx-auto mb-3" style={{ color: "oklch(0.60 0.22 290)" }} />
              <h2 className="text-xl font-bold">Payment Details</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedTier === "flame" ? "Flame Plan — £5/month" : "Spark Plan — £2/month"}
              </p>
              <div className="inline-flex items-center gap-1 mt-2 text-xs px-3 py-1 rounded-full"
                style={{ background: "oklch(0.55 0.25 295 / 0.15)", color: "oklch(0.70 0.15 295)" }}>
                <Lock className="h-3 w-3" />
                Test mode — use 4242 4242 4242 4242
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-mono"
                  style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Expiry</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-mono"
                    style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-mono"
                    style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={processing || activateSub.isPending}
              className="w-full h-14 text-base font-semibold rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              {processing || activateSub.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay £{selectedTier === "flame" ? "5" : "2"} securely
                </>
              )}
            </Button>

            <button
              onClick={() => setStep("select")}
              className="w-full text-sm text-muted-foreground py-3 hover:text-foreground transition-colors"
            >
              ← Back
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="px-6 pb-10 text-center">
            <div className="text-5xl mb-4 animate-heartbeat">💜</div>
            <CheckCircle className="h-12 w-12 mx-auto mb-3" style={{ color: "oklch(0.60 0.22 290)" }} />
            <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
            <p className="text-muted-foreground text-sm">
              {selectedTier === "flame" ? "Flame" : "Spark"} subscription activated. Time to reveal!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
