import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AlertTriangle, CheckCircle2, Camera, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/PredictionCard";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — CropAI" }, { name: "description", content: "Your crop health history, disease trends, and recommendations." }] }),
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  const { data: predictions, isLoading } = useQuery({
    queryKey: ["predictions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return (data ?? []) as Tables<"predictions">[];
    },
  });

  const stats = useMemo(() => {
    const list = predictions ?? [];
    const total = list.length;
    const healthy = list.filter((p) => p.is_healthy).length;
    const severe = list.filter((p) => p.severity === "severe").length;
    const avgConf = total ? list.reduce((s, p) => s + Number(p.confidence), 0) / total : 0;
    return { total, healthy, severe, avgConf };
  }, [predictions]);

  const diseaseChart = useMemo(() => {
    const counts = new Map<string, number>();
    (predictions ?? []).filter((p) => !p.is_healthy).forEach((p) => counts.set(p.disease_name, (counts.get(p.disease_name) ?? 0) + 1));
    return Array.from(counts, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [predictions]);

  const healthPie = useMemo(() => ([
    { name: "Healthy", value: stats.healthy },
    { name: "Diseased", value: stats.total - stats.healthy },
  ]), [stats]);

  const COLORS = ["var(--color-chart-1)", "var(--color-chart-3)", "var(--color-chart-2)", "var(--color-chart-4)", "var(--color-chart-5)", "var(--color-primary)"];
  const severeAlerts = (predictions ?? []).filter((p) => p.severity === "severe").slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Farm dashboard</h1>
            <p className="text-muted-foreground">All your scans, diagnoses, and recommendations in one place.</p>
          </div>
          <Link to="/scan"><Button><Camera className="mr-2 h-4 w-4" />New scan</Button></Link>
        </div>

        {severeAlerts.length > 0 && (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 font-semibold text-destructive"><AlertTriangle className="h-4 w-4" />Severe disease alerts</div>
            <ul className="mt-2 grid gap-1 text-sm">
              {severeAlerts.map((p) => (
                <li key={p.id}>• <strong>{p.disease_name}</strong> on {p.crop_type} — {Number(p.confidence).toFixed(0)}% confidence</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total scans" value={stats.total} icon={<Camera className="h-4 w-4" />} />
          <StatCard label="Healthy" value={stats.healthy} icon={<CheckCircle2 className="h-4 w-4 text-success" />} />
          <StatCard label="Severe cases" value={stats.severe} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
          <StatCard label="Avg confidence" value={`${stats.avgConf.toFixed(0)}%`} icon={<TrendingUp className="h-4 w-4" />} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Top diseases detected</CardTitle></CardHeader>
            <CardContent className="h-72">
              {diseaseChart.length === 0 ? <Empty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseChart}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Healthy vs diseased</CardTitle></CardHeader>
            <CardContent className="h-72">
              {stats.total === 0 ? <Empty /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={healthPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                      {healthPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <h2 className="mt-10 text-2xl font-bold tracking-tight">Recent scans</h2>
        <div className="mt-4 grid gap-4">
          {isLoading && <p className="text-muted-foreground">Loading…</p>}
          {!isLoading && (predictions ?? []).length === 0 && (
            <Card><CardContent className="grid place-items-center gap-3 py-12 text-center">
              <p className="text-muted-foreground">No scans yet.</p>
              <Link to="/scan"><Button><Camera className="mr-2 h-4 w-4" />Run your first scan</Button></Link>
            </CardContent></Card>
          )}
          {(predictions ?? []).slice(0, 10).map((p) => <PredictionCard key={p.id} p={p} />)}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-5">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
        </div>
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">{icon}</div>
      </CardContent>
    </Card>
  );
}

function Empty() {
  return <div className="grid h-full place-items-center text-sm text-muted-foreground">No data yet — run a scan to see insights.</div>;
}
