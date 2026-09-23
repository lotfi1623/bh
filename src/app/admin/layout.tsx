"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already authenticated in this session/browser
    const auth = localStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_authenticated", "true");
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Mot de passe incorrect.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // While loading authentication state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    );
  }

  // If not authenticated, render the custom login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md border border-white/8 bg-[#111111]/85 backdrop-blur-md p-8 rounded-xl shadow-2xl relative">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mb-4 bg-white/[0.02]">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-display text-2xl tracking-wide text-white font-semibold">
              Accès Administrateur
            </h1>
            <p className="text-muted text-xs mt-1.5 max-w-xs">
              Veuillez entrer le mot de passe pour accéder à cet espace.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-muted block">
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-white/10 bg-[#161616] px-4 py-3.5 text-sm text-white outline-none focus:border-white/40 transition-colors"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-medium text-center bg-red-500/10 border border-red-500/20 py-2 rounded">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-xs font-semibold tracking-[0.25em]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  Vérification...
                </span>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Render original pages (dashboard, products table, orders table, etc.) if logged in
  return <>{children}</>;
}
