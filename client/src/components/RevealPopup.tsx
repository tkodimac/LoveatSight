import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfettiBurst from "./ConfettiBurst";

interface RevealPopupProps {
  displayName: string;
  facePhotoUrl: string | null;
  onClose: () => void;
}

const springEnter = {
  type: "spring" as const,
  stiffness: 320,
  damping: 22,
  mass: 0.9,
};

const springBounce = {
  type: "spring" as const,
  stiffness: 400,
  damping: 18,
  mass: 0.8,
};

export default function RevealPopup({ displayName, facePhotoUrl, onClose }: RevealPopupProps) {
  const [phase, setPhase] = useState<"pulsing" | "revealing" | "revealed">("pulsing");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("revealing"), 800);
    const t2 = setTimeout(() => setPhase("revealed"), 1900);
    const t3 = setTimeout(() => onClose(), 5200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "oklch(0.04 0.01 270 / 0.92)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Canvas confetti burst — fires on revealed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ConfettiBurst active={phase === "revealed"} count={150} duration={4000} />
      </div>

      <motion.div
        className="flex flex-col items-center gap-6 px-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springEnter}
      >
        {/* Title */}
        <div>
          <h2
            className="text-3xl font-bold mb-1"
            style={{
              background: "linear-gradient(135deg, oklch(0.85 0.12 295), oklch(0.80 0.18 340))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            It's a match! 💙
          </h2>
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.p
                className="text-lg font-semibold text-foreground"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springBounce}
              >
                Found You!
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar reveal */}
        <div className="relative">
          {/* Outer glow ring — lub-dub box-shadow */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "-10px",
              background: "transparent",
              border: "2px solid oklch(0.60 0.22 290 / 0.5)",
            }}
            animate={
              phase === "revealed"
                ? { boxShadow: ["0 0 6px 1px oklch(0.60 0.25 295 / 0.25)", "0 0 32px 10px oklch(0.60 0.25 295 / 0.70)", "0 0 10px 2px oklch(0.60 0.25 295 / 0.30)", "0 0 22px 6px oklch(0.60 0.25 295 / 0.55)", "0 0 6px 1px oklch(0.60 0.25 295 / 0.25)"] }
                : { boxShadow: "0 0 12px 3px oklch(0.60 0.25 295 / 0.35)" }
            }
            transition={
              phase === "revealed"
                ? { duration: 1.5, repeat: Infinity, ease: [0.215, 0.61, 0.355, 1] }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          />

          <motion.div
            className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, oklch(0.25 0.08 285), oklch(0.18 0.05 280))",
              border: "3px solid oklch(0.60 0.22 290)",
            }}
            animate={{
              filter:
                phase === "pulsing"
                  ? "blur(20px) brightness(0.3)"
                  : phase === "revealing"
                  ? "blur(8px) brightness(0.6)"
                  : "blur(0px) brightness(1)",
              scale: phase === "revealed" ? 1.06 : 1,
            }}
            transition={
              phase === "revealed"
                ? { ...springBounce, filter: { duration: 0.9, ease: "easeOut" } }
                : { duration: 0.8, ease: "easeOut" }
            }
          >
            {facePhotoUrl ? (
              <img src={facePhotoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, oklch(0.45 0.20 285), oklch(0.35 0.15 280))" }}
                >
                  {displayName[0]?.toUpperCase() ?? "?"}
                </div>
              </div>
            )}
          </motion.div>

          {/* Pulsing silhouette overlay */}
          <AnimatePresence>
            {phase === "pulsing" && (
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
                  <circle cx="12" cy="8" r="4" fill="oklch(0.65 0.10 285)" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="oklch(0.65 0.10 285)" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Name */}
        <AnimatePresence>
          {phase === "revealed" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springEnter}
            >
              <p className="text-xl font-semibold text-foreground">{displayName}</p>
              <p className="text-sm text-muted-foreground mt-1">Say hello! 👋</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heartbeat hearts — lub-dub with glow */}
        <div className="flex gap-3">
          {[0, 1, 2].map(i => (
            <svg
              key={i}
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="animate-heartbeat-glow"
              style={{ animationDelay: `${i * 0.18}s` }}
            >
              <defs>
                <linearGradient id={`hg-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="oklch(0.72 0.20 340)" />
                  <stop offset="100%" stopColor="oklch(0.60 0.22 290)" />
                </linearGradient>
              </defs>
              <path
                d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
                fill={`url(#hg-${i})`}
                opacity={phase === "revealed" ? 1 : 0.45}
              />
            </svg>
          ))}
        </div>

        <AnimatePresence>
          {phase !== "revealed" && (
            <motion.p
              className="text-sm text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              exit={{ opacity: 0 }}
            >
              {phase === "pulsing" ? "Revealing…" : "Almost there…"}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {phase === "revealed" && (
            <motion.button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Continue to chat →
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
