"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { PageTransition } from "@/components/page-transition";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email sau parolă incorectă.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Autentificare</h1>
            <p className="mt-2 text-sm text-[#888888]">
              Intră în cont pentru a salva configurațiile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-[#ff4444]">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#00d4ff] py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] disabled:opacity-50"
            >
              {loading ? "Se autentifică..." : "Intră în cont"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#888888]">
            Nu ai cont?{" "}
            <Link
              href="/register"
              className="text-[#00d4ff] transition-colors hover:underline"
            >
              Înregistrează-te
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
