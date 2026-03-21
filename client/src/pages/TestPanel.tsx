import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, ChevronRight, FlaskConical, Heart, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

type Step = { label: string; done: boolean; action?: string };

export default function TestPanel() {
  const [, navigate] = useLocation();
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const { data: myMatches, refetch: refetchMatches } = trpc.match.getMyMatches.useQuery(undefined, { enabled: !!user });
  const utils = trpc.useUtils();

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate("/login");
  }, [user, isLoading, navigate]);

  const likeMutation = trpc.match.like.useMutation({
    onSuccess: (data) => {
      if (data.mutual) {
        toast.success("💜 It's a mutual match! Paywall should appear in chat.");
      } else {
        toast.success("Liked! Now the other side needs to like back.");
      }
      refetchMatches();
      utils.match.getMyMatches.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const activateSub = trpc.subscription.activate.useMutation({
    onSuccess: () => {
      toast.success("✅ Subscription activated — you can now reveal!");
      utils.user.getProfile.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading || !user) return null;

  const ariaMatch = myMatches?.find(m => m.otherUser.displayName === "Aria");
  const samMatch = myMatches?.find(m => m.otherUser.displayName === "Sam");
  const jordanMatch = myMatches?.find(m => m.otherUser.displayName === "Jordan");
  const { data: profile } = trpc.user.getProfile.useQuery();

  const scenarios: Array<{
    title: string;
    subtitle: string;
    color: string;
    steps: Step[];
    cta?: { label: string; onClick: () => void; disabled?: boolean };
    chatMatchId?: number;
  }> = [
    {
      title: "Scenario A — Mutual Like + Reveal",
      subtitle: "Aria has already liked you back. Test the full reveal flow.",
      color: "oklch(0.55 0.25 295)",
      steps: [
        { label: "Match exists with Aria", done: !!ariaMatch },
        { label: "Both sides liked (mutual)", done: ariaMatch?.status === "mutual" },
        { label: "Subscription active (needed to reveal)", done: profile?.tier !== "free" },
        { label: "Reveal unlocked", done: ariaMatch?.iRevealed ?? false },
      ],
      cta: ariaMatch?.status === "mutual" && profile?.tier === "free"
        ? {
            label: "Activate Flame subscription (test)",
            onClick: () => activateSub.mutate({ tier: "flame", sessionId: `test_${Date.now()}` }),
            disabled: activateSub.isPending,
          }
        : undefined,
      chatMatchId: ariaMatch?.matchId,
    },
    {
      title: "Scenario B — Like triggers Mutual",
      subtitle: "Sam already liked you. Tap the ❤️ in chat to trigger mutual match + paywall.",
      color: "oklch(0.65 0.22 50)",
      steps: [
        { label: "Match exists with Sam", done: !!samMatch },
        { label: "Sam has liked you (user1Liked=true)", done: (samMatch?.user1Liked ?? false) },
        { label: "You haven't liked Sam yet", done: !(samMatch?.user2Liked ?? false) },
        { label: "Tap ❤️ in chat → mutual fires", done: samMatch?.status === "mutual" },
      ],
      chatMatchId: samMatch?.matchId,
    },
    {
      title: "Scenario C — Fresh Chat",
      subtitle: "Jordan knocked on you. Chat is empty — test sending messages and the filter.",
      color: "oklch(0.60 0.22 290)",
      steps: [
        { label: "Match exists with Jordan", done: !!jordanMatch },
        { label: "Chat is accessible", done: !!jordanMatch?.matchId },
        { label: "Try sending: 'call me on 07700 900123'", done: false, action: "Send a phone number — it should be filtered" },
        { label: "Try sending: 'email me at test@test.com'", done: false, action: "Send an email — it should be filtered" },
      ],
      chatMatchId: jordanMatch?.matchId,
    },
  ];

  return (
    <div className="app-container flex flex-col min-h-dvh overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ background: "oklch(0.06 0.02 280 / 0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid oklch(0.20 0.05 280)" }}>
        <button onClick={() => navigate("/home")} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" style={{ color: "oklch(0.65 0.22 295)" }} />
          <h1 className="font-semibold text-foreground">Test Panel</h1>
        </div>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: "oklch(0.55 0.25 295 / 0.2)", color: "oklch(0.70 0.15 295)" }}>
          Dev Only
        </span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Account status */}
        <div className="glass-card-bright p-4 rounded-2xl">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Your Account</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.20 285), oklch(0.35 0.15 280))" }}>
              {(user.name ?? "?")[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">ID: {user.id} · Tier: <span style={{ color: "oklch(0.65 0.22 295)" }}>{profile?.tier ?? "free"}</span></p>
            </div>
          </div>
        </div>

        {/* Scenarios */}
        {scenarios.map((scenario, si) => (
          <div key={si} className="glass-card rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${scenario.color}30` }}>
            {/* Scenario header */}
            <div className="px-4 py-3" style={{ background: `${scenario.color}15` }}>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: scenario.color, color: "white" }}>
                  {String.fromCharCode(65 + si)}
                </div>
                <p className="font-semibold text-sm text-foreground">{scenario.title}</p>
              </div>
              <p className="text-xs text-muted-foreground ml-7">{scenario.subtitle}</p>
            </div>

            {/* Steps */}
            <div className="px-4 py-3 space-y-2">
              {scenario.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="flex-shrink-0 mt-0.5">
                    {step.done ? (
                      <CheckCircle className="h-4 w-4" style={{ color: "oklch(0.65 0.22 290)" }} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: "oklch(0.35 0.08 285)" }} />
                    )}
                  </div>
                  <div>
                    <p className={`text-xs ${step.done ? "text-foreground/60 line-through" : "text-foreground"}`}>
                      {step.label}
                    </p>
                    {step.action && !step.done && (
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.65 0.15 295)" }}>
                        → {step.action}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex flex-col gap-2">
              {scenario.cta && (
                <Button
                  size="sm"
                  onClick={scenario.cta.onClick}
                  disabled={scenario.cta.disabled}
                  className="w-full h-9 text-xs rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${scenario.color}, ${scenario.color}cc)`,
                    border: "none",
                  }}
                >
                  <Zap className="mr-1.5 h-3.5 w-3.5" />
                  {scenario.cta.label}
                </Button>
              )}
              {scenario.chatMatchId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/chat/${scenario.chatMatchId}`)}
                  className="w-full h-9 text-xs rounded-xl"
                  style={{
                    background: "oklch(0.14 0.04 280)",
                    border: `1px solid ${scenario.color}40`,
                    color: "oklch(0.85 0.05 285)",
                  }}
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  Open Chat (Match #{scenario.chatMatchId})
                  <ChevronRight className="ml-auto h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Filter test guide */}
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4" style={{ color: "oklch(0.72 0.20 340)" }} />
            <p className="font-semibold text-sm">Chat Filter Test Strings</p>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Copy and paste these into any chat. They should be replaced with <code className="text-xs px-1 py-0.5 rounded" style={{ background: "oklch(0.16 0.04 280)" }}>***** (subscribe)</code>
          </p>
          <div className="space-y-2">
            {[
              { label: "Phone number", value: "Call me on 07700 900123" },
              { label: "Email", value: "Email me at test@example.com" },
              { label: "Instagram handle", value: "Find me on instagram @myhandle" },
              { label: "URL", value: "Visit https://mywebsite.com" },
              { label: "WhatsApp", value: "Message me on whatsapp" },
              { label: "Intl phone", value: "Ring me +44 7700 900123" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-2 rounded-xl"
                style={{ background: "oklch(0.12 0.03 280)" }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xs text-foreground font-mono truncate">{item.value}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(item.value); toast.success("Copied!"); }}
                  className="text-xs px-2 py-1 rounded-lg flex-shrink-0"
                  style={{ background: "oklch(0.55 0.25 295 / 0.2)", color: "oklch(0.70 0.15 295)" }}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
