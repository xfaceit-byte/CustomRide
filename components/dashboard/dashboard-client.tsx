"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/page-transition";
import { formatLei } from "@/lib/format";

type ModificationItem = {
  id: string;
  name: string;
  price: number;
  categorySlug?: string;
};

type Configuration = {
  id: string;
  totalPrice: number;
  createdAt: string;
  modifications: ModificationItem[];
  car: {
    brand: string;
    model: string;
    year: number;
  };
};

export function DashboardClient({
  initialConfigs,
}: {
  initialConfigs: Configuration[];
}) {
  const router = useRouter();
  const [configs, setConfigs] = useState(initialConfigs);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Sigur vrei să ștergi această configurație?")) return;

    setDeletingId(id);
    const res = await fetch(`/api/configurations/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) {
      setConfigs((prev) => prev.filter((c) => c.id !== id));
    }
    router.refresh();
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Configurațiile mele
            </h1>
            <p className="mt-1 text-[#888888]">
              Toate build-urile salvate în contul tău
            </p>
          </div>
          <Link
            href="/configurator"
            className="rounded-lg bg-[#00d4ff] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.35)]"
          >
            Configurator nou
          </Link>
        </div>

        {configs.length === 0 ? (
          <div className="mt-16 rounded-xl border border-dashed border-[#2a2a2a] bg-[#1a1a1a] p-12 text-center">
            <p className="text-[#888888]">
              Nu ai încă nicio configurație salvată.
            </p>
            <Link
              href="/configurator"
              className="mt-4 inline-block text-[#00d4ff] hover:underline"
            >
              Creează prima configurație →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {configs.map((config, i) => {
              const mods = Array.isArray(config.modifications)
                ? config.modifications
                : [];
              return (
                <motion.article
                  key={config.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 card-hover"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {config.car.brand} {config.car.model}{" "}
                        <span className="text-sm font-normal text-[#888888]">
                          ({config.car.year})
                        </span>
                      </h2>
                      <p className="mt-1 text-xs text-[#888888]">
                        {new Date(config.createdAt).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-[#ff4444]">
                      {formatLei(config.totalPrice)}
                    </p>
                  </div>
                  {mods.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {mods.map((m) => (
                        <li
                          key={m.id}
                          className="rounded-full border border-[#2a2a2a] bg-[#111111] px-3 py-1 text-xs text-[#888888]"
                        >
                          {m.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(config.id)}
                    disabled={deletingId === config.id}
                    className="mt-4 text-sm text-[#ff4444] transition-colors hover:text-[#ff6666] disabled:opacity-50"
                  >
                    {deletingId === config.id
                      ? "Se șterge..."
                      : "Șterge configurația"}
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
