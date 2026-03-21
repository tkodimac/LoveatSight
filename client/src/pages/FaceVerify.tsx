import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera, CheckCircle, Shield, Upload } from "lucide-react";

export default function FaceVerify() {
  const [, navigate] = useLocation();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: user, isLoading } = trpc.auth.me.useQuery();

  const completeFaceVerify = trpc.user.completeFaceVerify.useMutation({
    onSuccess: () => {
      navigate("/profile-setup");
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

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
    if (user.faceVerified) {
      if (!user.displayName) {
        navigate("/profile-setup");
      } else {
        navigate("/home");
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !user.ageVerified || user.faceVerified) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTakeSelfie = () => {
    fileRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setUploading(true);
    try {
      completeFaceVerify.mutate({ facePhotoUrl: undefined, skipped: false });
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    completeFaceVerify.mutate({ skipped: true });
  };

  return (
    <div className="app-container flex flex-col min-h-dvh relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, oklch(0.55 0.28 295), transparent)" }} />

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Icon / Preview */}
        <div className="mb-8 relative">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Selfie preview"
                className="w-32 h-32 rounded-full object-cover animate-pulse-glow"
                style={{ border: "3px solid oklch(0.60 0.22 290)" }}
              />
              <div className="absolute -bottom-1 -right-1 rounded-full p-1"
                style={{ background: "oklch(0.60 0.22 290)" }}>
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ background: "oklch(0.18 0.06 285 / 0.8)", border: "2px dashed oklch(0.40 0.12 285)" }}>
              <Camera className="h-12 w-12" style={{ color: "oklch(0.72 0.20 340)" }} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-center mb-2">Verify your face</h1>
        <p className="text-muted-foreground text-center text-sm mb-2">
          Take a quick selfie (private)
        </p>
        <div className="flex items-center gap-1.5 mb-10">
          <Shield className="h-3.5 w-3.5" style={{ color: "oklch(0.60 0.22 290)" }} />
          <span className="text-xs" style={{ color: "oklch(0.60 0.22 290)" }}>
            Your photo is private and never shared publicly
          </span>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileChange}
          />

          {!preview ? (
            <Button
              onClick={handleTakeSelfie}
              className="w-full h-14 text-base font-semibold rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Selfie
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={uploading || completeFaceVerify.isPending}
              className="w-full h-14 text-base font-semibold rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.55 0.25 295), oklch(0.45 0.20 280))",
                border: "none",
              }}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {uploading || completeFaceVerify.isPending ? "Verifying..." : "Confirm & Continue"}
            </Button>
          )}

          {preview && (
            <Button
              variant="ghost"
              onClick={handleTakeSelfie}
              className="w-full h-10 text-sm rounded-xl text-muted-foreground"
            >
              <Upload className="mr-2 h-4 w-4" />
              Retake Photo
            </Button>
          )}

          <button
            onClick={handleSkip}
            disabled={completeFaceVerify.isPending}
            className="w-full text-sm text-muted-foreground py-2 hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center pb-8 gap-2">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
        <div className="w-6 h-1.5 rounded-full" style={{ background: "oklch(0.60 0.22 290)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.30 0.08 285)" }} />
      </div>
    </div>
  );
}
