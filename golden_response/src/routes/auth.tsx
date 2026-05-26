import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Sign in — CropAI" }, { name: "description", content: "Sign in to scan crops and view your dashboard." }] }),
});

const emailSchema = z.string().trim().email("Invalid email").max(255);
const pwSchema = z.string().min(8, "At least 8 characters").max(128);
const nameSchema = z.string().trim().min(1, "Required").max(100);

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && user) navigate({ to: "/scan" }); }, [user, loading, navigate]);

  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const signIn = async () => {
    try {
      emailSchema.parse(email); pwSchema.parse(password);
    } catch (e) { if (e instanceof z.ZodError) return toast.error(e.issues[0].message); }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/scan" });
  };

  const signUp = async () => {
    try {
      nameSchema.parse(fullName); emailSchema.parse(email); pwSchema.parse(password);
    } catch (e) { if (e instanceof z.ZodError) return toast.error(e.issues[0].message); }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/scan` },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're in!");
    navigate({ to: "/scan" });
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground"><Leaf className="h-5 w-5" /></span>
          <span className="text-xl font-semibold tracking-tight">CropAI</span>
        </div>
        <div className="rounded-2xl border bg-card p-6 shadow-xl">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Sign up</TabsTrigger></TabsList>
            <TabsContent value="signin" className="space-y-4 pt-4">
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="farmer@example.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
              <Button className="w-full" onClick={signIn} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-4">
              <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Farmer" />
              <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="farmer@example.com" />
              <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
              <Button className="w-full" onClick={signUp} disabled={busy}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}</Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={type === "password" ? "current-password" : undefined} />
    </div>
  );
}
