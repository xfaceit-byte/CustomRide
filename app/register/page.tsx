"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { PageTransition } from "@/components/page-transition";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Eroare la înregistrare.");
      return;
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-8">
          <h1 className="text-2xl font-bold text-white">Înregistrare</h1>
          <p className="mt-2 text-sm text-[#888888]">
            Creează un cont nou pe CustomRide
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm text-[#888888]"
              >
                Nume complet
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-white transition-all duration-300"
                placeholder="Ion Popescu"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm text-[#888888]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-white transition-all duration-300"
                placeholder="nume@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm text-[#888888]"
              >
                Parolă
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-white transition-all duration-300"
                placeholder="Minim 6 caractere"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm text-[#888888]"
              >
                Confirmă parola
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-4 py-2.5 text-white transition-all duration-300"
              />
            </div>
            {error && <p className="text-sm text-[#ff4444]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00d4ff] py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] disabled:opacity-50"
            >
              {loading ? "Se creează contul..." : "Creează cont"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#888888]">
            Ai deja cont?{" "}
            <Link
              href="/login"
              className="text-[#00d4ff] transition-colors hover:underline"
            >
              Autentifică-te
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
