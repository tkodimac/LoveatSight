import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, Calendar } from "lucide-react";

export default function AgeGate() {
  const [, navigate] = useLocation();
  const [birthDate, setBirthDate] = useState("");
  const [showError, setShowError] = useState(false);
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const completeAgeGate = trpc.user.completeAgeGate.useMutation({
    onSuccess: () => {
      navigate("/face-verify");
    },
    onError: () => {
      setShowError(true);
    },
  });

  useEffect(() => {
    if (isLoading || !user) return;
    if (!user.ageVerified) return; // stay on this page
    if (!user.faceVerified) {
      navigate("/face-verify");
    } else if (!user.displayName) {
      navigate("/profile-setup");
    } else {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleContinue = () => {
    if (!birthDate) {
      toast.error("Please enter your date of birth");
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age < 18) {
      setShowError(true);
      return;
    }

    completeAgeGate.mutate({ birthDate, age });
  };

  return (
    <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Icon */}
        <div className="mb-8 animate-pulse-glow rounded-full p-4"
          style={{ background: "oklch(0.18 0.06 285 / 0.8)" }}>
          <Calendar className="h-10 w-10" style={{ color: "oklch(0.72 0.20 340)" }} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-2">How old are you?</h1>
        <p className="text-muted-foreground text-center text-sm mb-10">
          Confirm 18+ for safety
        </p>

        {/* Date input */}
        <div className="w-full max-w-xs space-y-4">
          <div className="glass-card-bright p-1 rounded-2xl">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => { setBirthDate(e.target.value); setShowError(false); }}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
              className="w-full bg-transparent px-4 py-4 text-foreground text-center text-lg rounded-2xl outline-none focus:ring-2 focus:ring-primary/50"
              style={{ colorScheme: "dark" }}
            />
          </div>

          <Button
            onClick={handleContinue}
            disabled={!birthDate || completeAgeGate.isPending}
            className="w-full h-14 text-base font-semibold rounded-2xl"
            style={{
              background: birthDate
                ? "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))"
                : "oklch(0.18 0.04 280)",
              border: "none",
            }}
          >
            {completeAgeGate.isPending ? "Verifying..." : "Continue"}
          </Button>
        </div>

        {/* Error popup */}
        {showError && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-6"
            style={{ background: "oklch(0.04 0.01 270 / 0.85)" }}>
            <div className="glass-card-bright p-6 rounded-3xl max-w-xs w-full text-center animate-fade-in-up glow-purple">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" style={{ color: "oklch(0.65 0.22 25)" }} />
              <h2 className="text-xl font-semibold mb-2">Age Restricted</h2>
              <p className="text-muted-foreground text-sm mb-6">
                You must be 18 or older to use Love at Sight.
              </p>
              <Button
                onClick={() => setShowError(false)}
                className="w-full rounded-xl"
                style={{
                  background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                  border: "none",
                }}
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Progress dots */}
      <div className="flex justify-center pb-8 gap-2">
        <div className="w-6 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.30 0.08 285)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.30 0.08 285)" }} />
      </div>
    </div>
  );
}
