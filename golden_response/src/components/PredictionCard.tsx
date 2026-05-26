import type { Tables } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Droplets, Leaf, ShieldCheck, Sprout, AlertTriangle } from "lucide-react";

type P = Tables<"predictions">;

const sevClass = (s: string | null) =>
  s === "severe"
    ? "bg-destructive text-destructive-foreground"
    : s === "moderate"
      ? "bg-warning text-warning-foreground"
      : s === "mild"
        ? "bg-secondary text-secondary-foreground"
        : "bg-primary text-primary-foreground";

export function PredictionCard({ p }: { p: P }) {
  const conf = Number(p.confidence);
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[280px_1fr]">
        <div className="relative aspect-square md:aspect-auto bg-muted">
          <img src={p.image_url} alt={p.disease_name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        </div>
        <div>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.crop_type}</div>
                <CardTitle className="text-xl">{p.disease_name}</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.is_healthy ? (
                  <Badge className="bg-success text-success-foreground"><ShieldCheck className="mr-1 h-3 w-3" />Healthy</Badge>
                ) : (
                  <Badge className={sevClass(p.severity)}>
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    {p.severity ?? "detected"}
                  </Badge>
                )}
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence</span><span className="font-medium text-foreground">{conf.toFixed(0)}%</span>
              </div>
              <Progress value={conf} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {p.symptoms && <Row icon={<Activity className="h-4 w-4" />} label="Symptoms" text={p.symptoms} />}
            {p.treatment && <Row icon={<Sprout className="h-4 w-4" />} label="Treatment" text={p.treatment} />}
            {p.fertilizer && <Row icon={<Leaf className="h-4 w-4" />} label="Fertilizer" text={p.fertilizer} />}
            {p.prevention && <Row icon={<ShieldCheck className="h-4 w-4" />} label="Prevention" text={p.prevention} />}
            {p.irrigation && <Row icon={<Droplets className="h-4 w-4" />} label="Irrigation" text={p.irrigation} />}
            {p.notes && <p className="mt-1 rounded-md bg-muted p-3 text-xs italic text-muted-foreground">{p.notes}</p>}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function Row({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-secondary text-secondary-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <p className="text-foreground/90">{text}</p>
      </div>
    </div>
  );
}
