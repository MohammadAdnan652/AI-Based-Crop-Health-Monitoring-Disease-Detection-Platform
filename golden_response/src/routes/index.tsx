import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Brain, Camera, Leaf, Shield, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CropAI — Detect Plant Diseases in Seconds" },
      { name: "description", content: "AI-powered crop health monitoring. Upload a leaf photo and get instant disease diagnosis, treatment, and fertilizer guidance." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-hero-gradient">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Powered by Vision AI
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                Diagnose crop diseases in <span className="text-primary">seconds</span>.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Snap a leaf, get a science-backed diagnosis. CropAI identifies diseases across dozens of crops and gives you treatment, fertilizer, and irrigation guidance — instantly.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/auth"><Button size="lg" className="gap-2"><Camera className="h-4 w-4" />Start scanning</Button></Link>
                <Link to="/dashboard"><Button size="lg" variant="outline">View dashboard</Button></Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-success" />Private &amp; secure</span>
                <span className="flex items-center gap-1.5"><Activity className="h-4 w-4 text-success" />Real-time results</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
              <div className="relative rounded-2xl border bg-card p-6 shadow-xl">
                <MockReport />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">Built for real farms</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          From smallholder plots to commercial fields — fast, accurate, and works on any device.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 transition hover:shadow-md">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t bg-secondary/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Protect your harvest today</h2>
          <p className="mt-3 text-muted-foreground">Free to start. No credit card required.</p>
          <Link to="/auth"><Button size="lg" className="mt-6">Create free account</Button></Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CropAI</p>
          <p className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-primary" /> Smart agriculture for everyone</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: <Brain className="h-5 w-5" />, title: "Vision AI diagnosis", desc: "Deep learning vision model trained on plant pathology — identifies dozens of diseases with confidence scores." },
  { icon: <Sprout className="h-5 w-5" />, title: "Treatment & fertilizer", desc: "Actionable recommendations: pesticides, organic options, fertilizer mix, and irrigation tips." },
  { icon: <Activity className="h-5 w-5" />, title: "Health dashboard", desc: "Track every scan over time. Visualize disease distribution and confidence trends." },
  { icon: <Camera className="h-5 w-5" />, title: "Mobile-friendly", desc: "Snap from your phone in the field. Works on poor connections; images are compressed automatically." },
  { icon: <Shield className="h-5 w-5" />, title: "Secure & private", desc: "Your photos and farm data are tied to your account with row-level security." },
  { icon: <Leaf className="h-5 w-5" />, title: "Multi-crop support", desc: "Tomato, wheat, rice, maize, potato, grape, citrus and more — all in one platform." },
];

function MockReport() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Tomato</div>
          <div className="text-xl font-semibold">Early Blight</div>
        </div>
        <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-semibold text-warning-foreground">Moderate</span>
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-semibold">92%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[92%] rounded-full bg-primary" />
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="rounded-md bg-secondary p-3">
          <div className="text-xs font-semibold uppercase text-muted-foreground">Treatment</div>
          <p>Copper-based fungicide every 7–10 days. Remove infected lower leaves.</p>
        </div>
        <div className="rounded-md bg-secondary p-3">
          <div className="text-xs font-semibold uppercase text-muted-foreground">Irrigation</div>
          <p>Water at the base, avoid wetting leaves. Morning watering preferred.</p>
        </div>
      </div>
    </div>
  );
}
