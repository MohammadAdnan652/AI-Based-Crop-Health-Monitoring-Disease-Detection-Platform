import { useCallback, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { analyzeCrop } from "@/lib/analyze.functions";
import { PredictionCard } from "@/components/PredictionCard";
import type { Tables } from "@/integrations/supabase/types";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function UploadAnalyzer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const analyze = useServerFn(analyzeCrop);
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Tables<"predictions"> | null>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!ACCEPT.includes(file.type)) return toast.error("Use JPG, PNG, or WebP");
    if (file.size > MAX_BYTES) return toast.error("Image must be under 8MB");

    setResult(null);
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("crop-images").upload(path, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("crop-images").getPublicUrl(path);

      const res = await analyze({ data: { imageUrl: pub.publicUrl, imagePath: path } });
      setResult(res.prediction as Tables<"predictions">);
      qc.invalidateQueries({ queryKey: ["predictions"] });
      toast.success(`${res.prediction.disease_name} — ${Number(res.prediction.confidence).toFixed(0)}% confidence`);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }, [user, navigate, analyze, qc]);

  return (
    <div className="space-y-6">
      <Card
        className="relative grid place-items-center border-2 border-dashed p-10 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      >
        <input
          ref={inputRef} type="file" accept={ACCEPT.join(",")} className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {preview ? (
          <div className="w-full max-w-sm">
            <img src={preview} alt="preview" className="mx-auto max-h-72 rounded-lg object-contain" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <ImagePlus className="h-7 w-7" />
            </div>
            <div>
              <p className="font-medium">Drop a crop or leaf photo</p>
              <p className="text-sm text-muted-foreground">JPG, PNG, WebP · up to 8MB</p>
            </div>
          </div>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing…</> : <><Upload className="mr-2 h-4 w-4" />Choose image</>}
          </Button>
          {preview && !busy && (
            <Button variant="outline" onClick={() => { setPreview(null); setResult(null); }}>Reset</Button>
          )}
        </div>
      </Card>

      {result && <PredictionCard p={result} />}
    </div>
  );
}
