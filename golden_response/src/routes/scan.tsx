import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadAnalyzer } from "@/components/UploadAnalyzer";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
  head: () => ({ meta: [{ title: "Scan a crop — CropAI" }, { name: "description", content: "Upload a crop or leaf image for instant AI disease diagnosis." }] }),
});

function ScanPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth" }); }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Scan a crop</h1>
        <p className="mt-2 text-muted-foreground">Upload a clear photo of the leaf or affected area for best results.</p>
        <div className="mt-8">
          <UploadAnalyzer />
        </div>
      </main>
    </div>
  );
}
