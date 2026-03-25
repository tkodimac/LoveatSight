import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MapPin, MessageCircle, Zap, Flame, Bell, FlaskConical, Lock } from "lucide-react";
import PaywallPopup from "@/components/PaywallPopup";
import KnockNotificationBar from "@/components/KnockNotificationBar";

type NearbyUser = {
  id: number;
  displayName: string;
  age: number | null;
  distance: number;
  tier: string;
  faceVerified: boolean;
  avatarUrl: null;
};

export default function Home() {
  const [, navigate] = useLocation();
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLon, setUserLon] = useState<number | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallMatchId, setPaywallMatchId] = useState<number | undefined>();
  const [knockedIds, setKnockedIds] = useState<Set<number>>(new Set());
  const [pendingKnockId, setPendingKnockId] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(true);

  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const { data: profile } = trpc.user.getProfile.useQuery(undefined, { enabled: !!user });
  const utils = trpc.useUtils();

  const nearbyQuery = trpc.user.getNearby.useQuery(
    { latitude: userLat ?? 0, longitude: userLon ?? 0 },
    { enabled: userLat !== null && userLon !== null && !!user }
  );

  const { data: myMatches } = trpc.match.getMyMatches.useQuery(undefined, { enabled: !!user });

  // Notifications — used for Bell badge (incoming knocks)
  const { data: myNotifications = [] } = trpc.notification.getMyNotifications.useQuery(
    undefined,
    { enabled: !!user, refetchInterval: 5000 }
  );
  const pendingKnockCount = myNotifications.filter((n: { status: string }) => n.status === "pending").length;

  // Sent knocks — used for Knock button state on nearby cards
  const { data: sentKnocksRaw } = trpc.notification.getMySentKnocks.useQuery(
    undefined,
    { enabled: !!user, refetchInterval: 5000 }
  );
  // sentKnocksRaw is Record<number, { status, expiresAt? }> keyed by receiverId
  type KnockStatus = "pending" | "accepted" | "rejected" | "busy" | "available";
  const knockStatusMap = new Map<number, KnockStatus>();
  const knockExpiresAtMap = new Map<number, number>(); // ms timestamp
  if (sentKnocksRaw) {
    for (const [receiverId, entry] of Object.entries(sentKnocksRaw)) {
      const e = entry as { status: KnockStatus; expiresAt?: number };
      knockStatusMap.set(Number(receiverId), e.status);
      if (e.expiresAt) knockExpiresAtMap.set(Number(receiverId), e.expiresAt);
    }
  }

  const updateLocation = trpc.user.updateLocation.useMutation();
  const knockMutation = trpc.match.knock.useMutation({
    onSuccess: (data, variables) => {
      setKnockedIds(prev => {
        const next = new Set(Array.from(prev));
        next.add(variables.targetUserId);
        return next;
      });
      setPendingKnockId(null);
      toast.success("Knock sent! 💜");
    },
    onError: (e) => {
      setPendingKnockId(null);
      toast.error(e.message ?? "Failed to send knock");
    },
  });

  // Guard: redirect if not authenticated or profile incomplete
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    if (!user.ageVerified) {
      navigate("/age-gate");
      return;
    }
    if (!user.faceVerified) {
      navigate("/face-verify");
      return;
    }
  }, [user, isLoading, navigate]);

  // Get geolocation once
  useEffect(() => {
    if (!user) return;
    if (!navigator.geolocation) {
      setUserLat(51.5074);
      setUserLon(-0.1278);
      updateLocation.mutate({ latitude: 51.5074, longitude: -0.1278, locationCity: "London" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLat(latitude);
        setUserLon(longitude);
        updateLocation.mutate({ latitude, longitude });
      },
      () => {
        setUserLat(51.5074);
        setUserLon(-0.1278);
        updateLocation.mutate({ latitude: 51.5074, longitude: -0.1278, locationCity: "London" });
      }
    );
  }, [!!user]);

  const handleKnock = (targetId: number) => {
    if (pendingKnockId !== null) return; // prevent double-fire
    setPendingKnockId(targetId);
    knockMutation.mutate({ targetUserId: targetId });
  };

  const handleSubscribe = () => {
    setPaywallMatchId(undefined);
    setShowPaywall(true);
  };

  const recentMatches = myMatches?.filter(m => m.status !== "knocked").slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.displayName ?? user?.name ?? "there";
  const tier = profile?.tier ?? "free";

  return (
    <div className="app-container flex flex-col min-h-dvh overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-2"
        style={{ background: "oklch(0.06 0.02 280 / 0.95)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-light tracking-widest"
            style={{
              background: "linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.80 0.18 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            love at sight
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/test-panel")}
              className="p-2 rounded-full"
              style={{ background: "oklch(0.55 0.25 295 / 0.15)", border: "1px solid oklch(0.55 0.25 295 / 0.3)" }}
              title="Test Panel"
            >
              <FlaskConical className="h-4 w-4" style={{ color: "oklch(0.65 0.22 295)" }} />
            </button>
            <button className="relative p-2 rounded-full" style={{ background: "oklch(0.16 0.04 280)" }}
              onClick={() => setExpanded(e => !e)}>
              <Bell className="h-5 w-5 text-muted-foreground" />
              {pendingKnockCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1"
                  style={{ background: "oklch(0.65 0.22 50)", color: "white", lineHeight: 1 }}
                >
                  {pendingKnockCount > 9 ? "9+" : pendingKnockCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Knock notifications bar */}
      <KnockNotificationBar />

      <div className="flex-1 px-4 pb-6 space-y-6 pt-2">
        {/* Welcome card */}
        <div className="glass-card-bright p-4 rounded-2xl animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold animate-pulse-glow"
              style={{ background: "linear-gradient(135deg, oklch(0.45 0.20 285), oklch(0.35 0.15 280))" }}>
              {displayName[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-foreground truncate">{displayName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {userLat && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{profile?.locationCity ?? "Nearby"}</span>
                </div>
              )}
              <span className={`badge-${tier}`}>
                {tier === "free" ? "Free" : tier === "spark" ? "✦ Spark" : "🔥 Flame"}
              </span>
            </div>
          </div>
        </div>

        {/* Nearby matches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Nearby Sparks</h2>
            <span className="text-xs text-muted-foreground">
              {nearbyQuery.data?.length ?? 0} nearby
            </span>
          </div>

          {nearbyQuery.isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card h-24 rounded-2xl animate-pulse"
                  style={{ background: "oklch(0.14 0.04 280)" }} />
              ))}
            </div>
          ) : nearbyQuery.data && nearbyQuery.data.length > 0 ? (
            <div className="space-y-3">
              {nearbyQuery.data.map((person: NearbyUser) => (
                <NearbyCard
                  key={person.id}
                  person={person}
                  knocked={knockedIds.has(person.id)}
                  knockStatus={knockStatusMap.get(person.id) ?? null}
                  knockExpiresAt={knockExpiresAtMap.get(person.id) ?? null}
                  matchId={myMatches?.find(m => m.otherUser.id === person.id)?.matchId ?? null}
                  onKnock={() => handleKnock(person.id)}
                  onChat={(matchId) => navigate(`/chat/${matchId}`)}
                  isPending={pendingKnockId === person.id}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center">
              <div className="text-3xl mb-2">💜</div>
              <p className="text-sm text-muted-foreground">
                No one nearby yet. Check back soon!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Location access helps us find matches near you
              </p>
            </div>
          )}
        </div>

        {/* Subscription section */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Upgrade Your Experience</h2>
          <div className="grid grid-cols-2 gap-3">
            {/* Spark card */}
            <button
              onClick={handleSubscribe}
              className="glass-card p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ border: "1px solid oklch(0.45 0.15 290 / 0.4)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" style={{ color: "oklch(0.70 0.18 290)" }} />
                <span className="font-semibold text-sm">Spark</span>
              </div>
              <p className="text-2xl font-bold mb-1">£2<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Unlimited knocks</li>
                <li>✓ 1 reveal/month</li>
              </ul>
            </button>

            {/* Flame card */}
            <button
              onClick={handleSubscribe}
              className="rounded-2xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, oklch(0.22 0.08 285), oklch(0.18 0.06 280))",
                border: "1px solid oklch(0.55 0.20 295 / 0.6)",
                boxShadow: "0 0 20px oklch(0.55 0.28 295 / 0.2)",
              }}
            >
              <div className="absolute top-2 right-2">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "oklch(0.65 0.22 50)", color: "white" }}>
                  BEST
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4" style={{ color: "oklch(0.70 0.22 50)" }} />
                <span className="font-semibold text-sm">Flame</span>
              </div>
              <p className="text-2xl font-bold mb-1">£5<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>✓ Unlimited reveals</li>
                <li>✓ Premium features</li>
              </ul>
            </button>
          </div>
        </div>

        {/* Recent messages */}
        {recentMatches.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3">Recent Connections</h2>
            <div className="space-y-2">
              {recentMatches.map((match) => (
                <button
                  key={match.matchId}
                  onClick={() => navigate(`/chat/${match.matchId}`)}
                  className="glass-card w-full p-3 rounded-2xl flex items-center gap-3 text-left hover:scale-[1.01] transition-all active:scale-[0.99]"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold animate-silhouette"
                    style={{ background: "linear-gradient(135deg, oklch(0.30 0.10 285), oklch(0.20 0.06 280))" }}>
                    {match.iRevealed && match.otherUser.facePhotoUrl ? (
                      <img src={match.otherUser.facePhotoUrl} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      <span style={{ color: "oklch(0.65 0.10 285)" }}>?</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{match.otherUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {match.status === "mutual" ? "💜 Mutual match!" : "Connected"}
                    </p>
                  </div>
                  <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Paywall popup */}
      {showPaywall && (
        <PaywallPopup
          matchId={paywallMatchId}
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            utils.user.getProfile.invalidate();
            toast.success("Subscription activated! 🎉");
          }}
        />
      )}
    </div>
  );
}

function useCooldownCountdown(cooldownUntil: Date | null): string | null {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!cooldownUntil) { setLabel(null); return; }
    const update = () => {
      const ms = new Date(cooldownUntil).getTime() - Date.now();
      if (ms <= 0) { setLabel(null); return; }
      const h = Math.floor(ms / (1000 * 60 * 60));
      const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      setLabel(h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    update();
    const id = setInterval(update, 30_000); // refresh every 30s
    return () => clearInterval(id);
  }, [cooldownUntil]);

  return label;
}

function NearbyCard({
  person,
  knocked,
  knockStatus,
  knockExpiresAt,
  matchId,
  onKnock,
  onChat,
  isPending,
}: {
  person: NearbyUser;
  knocked: boolean;
  knockStatus: "pending" | "accepted" | "rejected" | "busy" | "available" | null;
  knockExpiresAt: number | null; // ms timestamp for countdown
  matchId: number | null;
  onKnock: () => void;
  onChat: (matchId: number) => void;
  isPending: boolean;
}) {
  // Live countdown for Locked (6h) and Busy (15min) states
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);
  useEffect(() => {
    if (!knockExpiresAt) { setCountdownLabel(null); return; }
    const update = () => {
      const ms = knockExpiresAt - Date.now();
      if (ms <= 0) { setCountdownLabel(null); return; }
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      if (h > 0) setCountdownLabel(`${h}h ${m}m`);
      else if (m > 0) setCountdownLabel(`${m}m ${s}s`);
      else setCountdownLabel(`${s}s`);
    };
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, [knockExpiresAt]);

  const dist = person.distance < 1
    ? `${Math.round(person.distance * 1000)}m`
    : `${person.distance.toFixed(1)}km`;

  return (
    <motion.div
      className="glass-card p-4 rounded-2xl flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
    >
      {/* Blurred silhouette */}
      <div className="relative flex-shrink-0">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center animate-heartbeat-glow-box"
          style={{
            background: "linear-gradient(135deg, oklch(0.25 0.08 285), oklch(0.18 0.05 280))",
            border: "2px solid oklch(0.35 0.10 285 / 0.5)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
            <circle cx="12" cy="8" r="4" fill="oklch(0.65 0.10 285)" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="oklch(0.65 0.10 285)" />
          </svg>
        </div>
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ opacity: 0.4 }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">
          {person.displayName}
          {person.age && <span className="text-muted-foreground font-normal">, {person.age}</span>}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{dist} away</span>
        </div>
      </div>

      {/* Knock / Chat / Locked button */}
      {knockStatus === "accepted" && matchId ? (
        <Button
          size="sm"
          onClick={() => onChat(matchId)}
          className="rounded-xl h-9 px-4 text-xs font-semibold flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.50 0.22 145), oklch(0.42 0.18 145))",
            border: "none",
            color: "white",
          }}
        >
          <MessageCircle className="h-3.5 w-3.5 mr-1" />
          Chat
        </Button>
      ) : knockStatus === "rejected" ? (
        // Rejected → permanently locked until cooldown expires
        <Button
          size="sm"
          disabled
          className="rounded-xl h-9 px-4 text-xs font-semibold flex-shrink-0"
          style={{
            background: "oklch(0.18 0.04 280)",
            border: "1px solid oklch(0.30 0.06 280)",
            color: "oklch(0.45 0.08 285)",
          }}
        >
          <Lock className="h-3.5 w-3.5 mr-1" />
          {countdownLabel ? `Locked · ${countdownLabel}` : "Locked"}
        </Button>
      ) : knockStatus === "busy" ? (
        // Ignored → show Busy for 15 minutes, then resets
        <Button
          size="sm"
          disabled
          className="rounded-xl h-9 px-4 text-xs font-semibold flex-shrink-0"
          style={{
            background: "oklch(0.20 0.05 50)",
            border: "1px solid oklch(0.40 0.12 50 / 0.5)",
            color: "oklch(0.65 0.15 50)",
          }}
        >
          <span className="mr-1">⏳</span>
          {countdownLabel ? `Busy · ${countdownLabel}` : "Busy"}
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onKnock}
          disabled={knocked || isPending || knockStatus === "pending"}
          className="rounded-xl h-9 px-4 text-xs font-semibold flex-shrink-0"
          style={{
            background: knocked || knockStatus === "pending"
              ? "oklch(0.22 0.04 280)"
              : "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
            border: "none",
            color: knocked || knockStatus === "pending" ? "oklch(0.55 0.10 285)" : "white",
          }}
        >
          {isPending ? (
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              Sending
            </span>
          ) : knocked || knockStatus === "pending" ? "Knocked ✓" : "Knock 💜"}
        </Button>
      )}
    </motion.div>
  );
}
