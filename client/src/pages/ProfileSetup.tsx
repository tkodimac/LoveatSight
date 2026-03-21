import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "lucide-react";

export default function ProfileSetup() {
  const [, navigate] = useLocation();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const { data: user, isLoading } = trpc.auth.me.useQuery();

  // Guard: redirect if not authenticated
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      navigate("/home");
    },
    onError: () => toast.error("Failed to save profile"),
  });

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleSave = () => {
    if (!displayName.trim()) {
      toast.error("Please enter a display name");
      return;
    }
    updateProfile.mutate({ displayName: displayName.trim(), bio: bio.trim() });
  };

  return (
    <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="mb-8 animate-pulse-glow rounded-full p-4"
          style={{ background: "oklch(0.18 0.06 285 / 0.8)" }}>
          <User className="h-10 w-10" style={{ color: "oklch(0.72 0.20 340)" }} />
        </div>

        <h1 className="text-3xl font-semibold text-center mb-2">Set up your profile</h1>
        <p className="text-muted-foreground text-center text-sm mb-10">
          How should others know you?
        </p>

        <div className="w-full max-w-xs space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="e.g. Alex, Mysterious One..."
              maxLength={30}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell a little about yourself..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground resize-none"
              style={{ background: "oklch(0.14 0.04 280)", border: "1px solid oklch(0.25 0.06 280)" }}
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!displayName.trim() || updateProfile.isPending}
            className="w-full h-14 text-base font-semibold rounded-2xl"
            style={{
              background: displayName.trim()
                ? "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))"
                : "oklch(0.18 0.04 280)",
              border: "none",
            }}
          >
            {updateProfile.isPending ? "Saving..." : "Let's go! 💜"}
          </Button>

          <button
            onClick={() => navigate("/home")}
            className="w-full text-sm text-muted-foreground py-2 hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      <div className="flex justify-center pb-8 gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
        <div className="w-6 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
      </div>
    </div>
  );
}
