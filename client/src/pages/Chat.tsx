import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Heart, Send, AlertTriangle } from "lucide-react";
import PaywallPopup from "@/components/PaywallPopup";
import RevealPopup from "@/components/RevealPopup";

export default function Chat() {
  const { matchId: matchIdStr } = useParams<{ matchId: string }>();
  const matchId = parseInt(matchIdStr ?? "", 10);
  const isValidMatchId = !isNaN(matchId) && matchId > 0;
  const [, navigate] = useLocation();
  const [message, setMessage] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealData, setRevealData] = useState<{ displayName: string; facePhotoUrl: string | null } | null>(null);
  const [showPanic, setShowPanic] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.auth.me.useQuery();
  const { data: match, refetch: refetchMatch } = trpc.match.getMatch.useQuery(
    { matchId: isValidMatchId ? matchId : 0 },
    { enabled: isValidMatchId && !!user, refetchInterval: 5000 }
  );
  const { data: messages, refetch: refetchMessages } = trpc.message.getMessages.useQuery(
    { matchId: isValidMatchId ? matchId : 0 },
    { enabled: isValidMatchId && !!user, refetchInterval: 3000 }
  );

  // Guard: redirect if not authenticated or matchId is invalid
  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate("/login"); return; }
    if (!isValidMatchId) { navigate("/home"); return; }
  }, [user, isLoading, isValidMatchId, navigate]);

  const sendMutation = trpc.message.send.useMutation({
    onSuccess: (data) => {
      setMessage("");
      if (data.filtered) {
        toast.warning("Contact info removed — subscribe to share details 💜");
      }
      refetchMessages();
    },
    onError: () => toast.error("Failed to send message"),
  });

  const likeMutation = trpc.match.like.useMutation({
    onSuccess: (data) => {
      refetchMatch();
      if (data.mutual) {
        setShowPaywall(true);
      } else {
        toast.success("You liked them! 💜");
      }
    },
    onError: () => toast.error("Failed to like"),
  });

  const unlikeMutation = trpc.match.unlike.useMutation({
    onSuccess: () => refetchMatch(),
  });

  const revealMutation = trpc.match.reveal.useMutation({
    onSuccess: (data) => {
      setRevealData({
        displayName: data.otherUser.displayName,
        facePhotoUrl: data.otherUser.facePhotoUrl,
      });
      setShowReveal(true);
      refetchMatch();
    },
    onError: (err) => {
      if (err.message.includes("Subscription")) {
        setShowPaywall(true);
      } else {
        toast.error("Failed to reveal");
      }
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    sendMutation.mutate({ matchId, content: message.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLikeToggle = () => {
    if (!match) return;
    if (match.iLiked) {
      unlikeMutation.mutate({ matchId });
    } else {
      likeMutation.mutate({ matchId });
    }
  };

  const handleReveal = () => {
    revealMutation.mutate({ matchId });
  };

  const handlePanic = () => {
    setShowPanic(true);
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isValidMatchId) return null;

  const otherName = match?.otherUser.displayName ?? "Anonymous";
  const iLiked = match?.iLiked ?? false;
  const isMutual = match?.mutual ?? false;
  const iRevealed = match?.iRevealed ?? false;

  return (
    <div className="app-container flex flex-col min-h-dvh max-h-dvh overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ background: "oklch(0.10 0.03 280 / 0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid oklch(0.22 0.05 280)" }}>
        <button onClick={() => navigate("/home")} className="p-1.5 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden animate-silhouette"
            style={{ background: "linear-gradient(135deg, oklch(0.25 0.08 285), oklch(0.18 0.05 280))" }}>
            {iRevealed && match?.otherUser.facePhotoUrl ? (
              <img src={match.otherUser.facePhotoUrl} className="w-full h-full object-cover" alt={otherName} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
                <circle cx="12" cy="8" r="4" fill="oklch(0.65 0.10 285)" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="oklch(0.65 0.10 285)" />
              </svg>
            )}
          </div>
          {isMutual && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.60 0.22 290)" }}>
              <span className="text-[8px]">♥</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{otherName}</p>
          <p className="text-xs text-muted-foreground">
            {isMutual ? "💜 Mutual match" : "Connected"}
          </p>
        </div>

        {/* Reveal button if mutual */}
        {isMutual && !iRevealed && (
          <Button
            size="sm"
            onClick={handleReveal}
            disabled={revealMutation.isPending}
            className="h-8 px-3 text-xs rounded-xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
              border: "none",
            }}
          >
            Reveal 💜
          </Button>
        )}

        {/* Panic button */}
        <button
          onClick={handlePanic}
          className="h-8 px-3 text-xs rounded-xl font-semibold flex items-center gap-1"
          style={{ background: "oklch(0.45 0.20 25)", color: "white" }}
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          Panic
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {!messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-4xl mb-3 animate-heartbeat">💜</div>
            <p className="text-sm text-muted-foreground">Start the conversation!</p>
            <p className="text-xs text-muted-foreground mt-1">Say hello to {otherName}</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm"
                  style={{
                    background: isMe
                      ? "linear-gradient(135deg, oklch(0.50 0.22 290), oklch(0.42 0.18 280))"
                      : "oklch(0.16 0.04 280)",
                    color: "oklch(0.95 0.01 280)",
                    borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  }}
                >
                  {msg.filtered ? (
                    <span style={{ color: "oklch(0.65 0.15 290)", fontStyle: "italic" }}>
                      {msg.content}
                    </span>
                  ) : (
                    msg.content
                  )}
                  <div className={`text-[10px] mt-1 ${isMe ? "text-white/50" : "text-muted-foreground"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 px-4 py-3"
        style={{ background: "oklch(0.10 0.03 280 / 0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid oklch(0.22 0.05 280)" }}>
        {/* Mutual like hint */}
        {isMutual && !iRevealed && (
          <div className="mb-2 px-3 py-2 rounded-xl text-xs text-center"
            style={{ background: "oklch(0.55 0.25 295 / 0.15)", color: "oklch(0.75 0.15 295)" }}>
            💜 It's a mutual match! Tap "Reveal" to see each other
          </div>
        )}

        <div className="flex items-end gap-2">
          {/* Heart like button */}
          <button
            onClick={handleLikeToggle}
            disabled={likeMutation.isPending || unlikeMutation.isPending}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              background: iLiked ? "oklch(0.55 0.22 340 / 0.2)" : "oklch(0.16 0.04 280)",
              border: `1px solid ${iLiked ? "oklch(0.65 0.20 340)" : "oklch(0.25 0.06 280)"}`,
            }}
          >
            <Heart
              className="h-5 w-5 transition-all"
              style={{ color: iLiked ? "oklch(0.72 0.20 340)" : "oklch(0.55 0.10 285)" }}
              fill={iLiked ? "oklch(0.72 0.20 340)" : "none"}
            />
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2.5 rounded-2xl text-sm resize-none outline-none focus:ring-1 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
              style={{
                background: "oklch(0.14 0.04 280)",
                border: "1px solid oklch(0.25 0.06 280)",
                maxHeight: "120px",
                lineHeight: "1.5",
              }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || sendMutation.isPending}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-40"
            style={{
              background: message.trim()
                ? "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))"
                : "oklch(0.16 0.04 280)",
            }}
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Panic overlay */}
      {showPanic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "oklch(0.04 0.01 270 / 0.95)" }}>
          <div className="text-center animate-fade-in-up">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4" style={{ color: "oklch(0.65 0.22 25)" }} />
            <p className="text-lg font-semibold">Leaving safely...</p>
          </div>
        </div>
      )}

      {/* Paywall popup */}
      {showPaywall && (
        <PaywallPopup
          matchId={matchId}
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            utils.user.getProfile.invalidate();
            setTimeout(() => {
              revealMutation.mutate({ matchId });
            }, 500);
          }}
        />
      )}

      {/* Reveal popup */}
      {showReveal && revealData && (
        <RevealPopup
          displayName={revealData.displayName}
          facePhotoUrl={revealData.facePhotoUrl}
          onClose={() => setShowReveal(false)}
        />
      )}
    </div>
  );
}
