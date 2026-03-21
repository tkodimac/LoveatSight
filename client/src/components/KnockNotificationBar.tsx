import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Bell, Check, X, Minus, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useLocation } from "wouter";

type Notification = {
  id: number;
  matchId: number;
  knockerId: number;
  status: "pending" | "accepted" | "rejected" | "ignored";
  rejectCount: number;
  cooldownUntil: Date | null;
  createdAt: Date;
  knocker: { displayName: string; age: number | null };
};

export default function KnockNotificationBar() {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = useState(true);
  // Track which notification is awaiting second reject confirmation
  const [confirmingRejectId, setConfirmingRejectId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data: notifications = [] } = trpc.notification.getMyNotifications.useQuery(undefined, {
    refetchInterval: 5000, // poll every 5s for new knocks
  });

  const acceptMutation = trpc.notification.accept.useMutation({
    onSuccess: (data) => {
      utils.notification.getMyNotifications.invalidate();
      utils.match.getMyMatches.invalidate();
      toast.success("Knock accepted! 💜 Say hello in chat.");
      navigate(`/chat/${data.matchId}`);
    },
    onError: () => toast.error("Failed to accept knock"),
  });

  const rejectMutation = trpc.notification.reject.useMutation({
    onSuccess: (data, variables) => {
      if (!data.confirmed) {
        // First press — show second confirmation inline
        setConfirmingRejectId(variables.notificationId);
        utils.notification.getMyNotifications.invalidate();
      } else {
        // Final rejection confirmed
        setConfirmingRejectId(null);
        utils.notification.getMyNotifications.invalidate();
        toast("Knock rejected. They can't knock again for 6 hours.", {
          icon: "🚫",
        });
      }
    },
    onError: () => toast.error("Failed to reject knock"),
  });

  const ignoreMutation = trpc.notification.ignore.useMutation({
    onSuccess: () => {
      utils.notification.getMyNotifications.invalidate();
      toast("Knock ignored.", { icon: "🔕" });
    },
    onError: () => toast.error("Failed to ignore knock"),
  });

  const clearMutation = trpc.notification.clear.useMutation({
    onSuccess: () => utils.notification.getMyNotifications.invalidate(),
  });

  const clearAllMutation = trpc.notification.clearAll.useMutation({
    onSuccess: () => utils.notification.getMyNotifications.invalidate(),
  });

  const pendingCount = notifications.filter(n => n.status === "pending").length;
  const totalVisible = notifications.length;

  if (totalVisible === 0) return null;

  return (
    <div
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.13 0.05 285 / 0.95)",
        border: "1px solid oklch(0.40 0.15 295 / 0.5)",
        boxShadow: "0 0 20px oklch(0.55 0.28 295 / 0.15)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ borderBottom: expanded ? "1px solid oklch(0.22 0.06 285 / 0.5)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="h-4 w-4" style={{ color: "oklch(0.72 0.20 340)" }} />
            {pendingCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "oklch(0.65 0.22 50)", color: "white" }}
              >
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-sm font-semibold text-foreground">
            Knocks
          </span>
          <span className="text-xs text-muted-foreground">
            ({totalVisible})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {totalVisible > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clearAllMutation.mutate(); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded-lg"
              style={{ background: "oklch(0.18 0.04 280)" }}
            >
              Clear all
            </button>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Notification list */}
      {expanded && (
        <div className="divide-y" style={{ borderColor: "oklch(0.18 0.05 280 / 0.5)" }}>
          {notifications.map((notif: Notification) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              isConfirmingReject={confirmingRejectId === notif.id}
              onAccept={() => acceptMutation.mutate({ notificationId: notif.id })}
              onReject={() => rejectMutation.mutate({ notificationId: notif.id })}
              onCancelReject={() => setConfirmingRejectId(null)}
              onIgnore={() => ignoreMutation.mutate({ notificationId: notif.id })}
              onClear={() => clearMutation.mutate({ notificationId: notif.id })}
              isAccepting={acceptMutation.isPending}
              isRejecting={rejectMutation.isPending}
              isIgnoring={ignoreMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notif,
  isConfirmingReject,
  onAccept,
  onReject,
  onCancelReject,
  onIgnore,
  onClear,
  isAccepting,
  isRejecting,
  isIgnoring,
}: {
  notif: Notification;
  isConfirmingReject: boolean;
  onAccept: () => void;
  onReject: () => void;
  onCancelReject: () => void;
  onIgnore: () => void;
  onClear: () => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isIgnoring: boolean;
}) {
  const timeAgo = formatTimeAgo(notif.createdAt);

  const statusColors: Record<string, string> = {
    pending: "oklch(0.72 0.20 340)",
    accepted: "oklch(0.65 0.18 145)",
    rejected: "oklch(0.65 0.22 25)",
    ignored: "oklch(0.50 0.05 285)",
  };

  const statusLabels: Record<string, string> = {
    pending: "💜 Knocked",
    accepted: "✓ Accepted",
    rejected: "✗ Rejected",
    ignored: "— Ignored",
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 animate-silhouette"
          style={{
            background: "linear-gradient(135deg, oklch(0.25 0.08 285), oklch(0.18 0.05 280))",
            border: "1.5px solid oklch(0.35 0.10 285 / 0.5)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
            <circle cx="12" cy="8" r="4" fill="oklch(0.65 0.10 285)" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="oklch(0.65 0.10 285)" />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground truncate">
              {notif.knocker.displayName}
              {notif.knocker.age && (
                <span className="font-normal text-muted-foreground">, {notif.knocker.age}</span>
              )}
            </p>
            <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-xs font-medium"
              style={{ color: statusColors[notif.status] }}
            >
              {statusLabels[notif.status]}
            </span>
            {notif.status === "rejected" && notif.cooldownUntil && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatCooldown(notif.cooldownUntil)}
              </span>
            )}
          </div>

          {/* Action buttons — only for pending */}
          {notif.status === "pending" && !isConfirmingReject && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={onAccept}
                disabled={isAccepting}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, oklch(0.50 0.22 145), oklch(0.42 0.18 145))",
                  color: "white",
                  border: "none",
                }}
              >
                <Check className="h-3 w-3" />
                Accept
              </button>

              <button
                onClick={onReject}
                disabled={isRejecting}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: "oklch(0.18 0.04 280)",
                  color: "oklch(0.65 0.22 25)",
                  border: "1px solid oklch(0.65 0.22 25 / 0.3)",
                }}
              >
                <X className="h-3 w-3" />
                Reject
              </button>

              <button
                onClick={onIgnore}
                disabled={isIgnoring}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                style={{
                  background: "oklch(0.16 0.04 280)",
                  color: "oklch(0.55 0.06 285)",
                  border: "1px solid oklch(0.25 0.05 280 / 0.5)",
                }}
              >
                <Minus className="h-3 w-3" />
                Ignore
              </button>
            </div>
          )}

          {/* Double-confirm reject prompt */}
          {notif.status === "pending" && isConfirmingReject && (
            <div
              className="mt-2 p-3 rounded-xl"
              style={{
                background: "oklch(0.65 0.22 25 / 0.08)",
                border: "1px solid oklch(0.65 0.22 25 / 0.3)",
              }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: "oklch(0.75 0.18 25)" }}>
                ⚠️ Are you sure? They won't be able to knock for 6 hours.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onReject}
                  disabled={isRejecting}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: "oklch(0.55 0.22 25)",
                    color: "white",
                    border: "none",
                  }}
                >
                  <X className="h-3 w-3" />
                  Yes, Reject
                </button>
                <button
                  onClick={onCancelReject}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95"
                  style={{
                    background: "oklch(0.16 0.04 280)",
                    color: "oklch(0.65 0.08 285)",
                    border: "1px solid oklch(0.25 0.05 280 / 0.5)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Clear button for resolved notifications */}
          {notif.status !== "pending" && (
            <button
              onClick={onClear}
              className="mt-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatCooldown(until: Date): string {
  const ms = new Date(until).getTime() - Date.now();
  if (ms <= 0) return "cooldown ended";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}m cooldown`;
  return `${minutes}m cooldown`;
}
