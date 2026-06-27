"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import GlassCard from "@/components/GlassCard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <GlassCard className="w-full max-w-sm" strong>
        <h1 className="text-2xl font-semibold tracking-tight">Daily Debrief</h1>
        <p className="mt-1 text-sm text-muted">Sign in with a magic link.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Send magic link"}
          </button>
        </form>

        {status === "sent" && (
          <p className="mt-4 text-sm text-emerald-600">Check your inbox for the sign-in link.</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600">Something went wrong. Try again.</p>
        )}
      </GlassCard>
    </main>
  );
}
