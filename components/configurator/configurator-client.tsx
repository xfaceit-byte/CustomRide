"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/page-transition";
import { PriceCounter } from "@/components/price-counter";
import { useConfiguratorStore } from "@/store/configurator-store";
import { formatLei } from "@/lib/format";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  imageUrl: string | null;
};

type Modification = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  modifications: Modification[];
};

const categoryIcons: Record<string, string> = {
  culori: "🎨",
  jante: "⭕",
  spoilere: "🏎️",
  accesorii: "🔧",
};

export function ConfiguratorClient({
  cars,
  categories,
}: {
  cars: Car[];
  categories: Category[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(categories[0]?.slug ?? "culori");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const {
    step,
    selectedCarId,
    selectedCarLabel,
    selectedModifications,
    selectCar,
    toggleModification,
    getTotalPrice,
    setStep,
  } = useConfiguratorStore();

  const totalPrice = getTotalPrice();
  const activeCategory = categories.find((c) => c.slug === activeTab);

  async function handleSave() {
    if (!session) {
      router.push("/login?callbackUrl=/configurator");
      return;
    }
    if (!selectedCarId) return;

    setSaving(true);
    setMessage("");

    const res = await fetch("/api/configurations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carId: selectedCarId,
        modifications: Object.values(selectedModifications),
        totalPrice,
      }),
    });

    setSaving(false);

    if (res.ok) {
      setMessage("Configurația a fost salvată cu succes!");
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Eroare la salvare.");
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-4">
          <button
            type="button"
            onClick={() => (step === 2 ? setStep(1) : null)}
            className={`text-sm transition-colors duration-300 ${
              step === 2
                ? "text-[#888888] hover:text-[#00d4ff]"
                : "pointer-events-none opacity-40"
            }`}
          >
            ← Înapoi la mașini
          </button>
          <div className="flex gap-2 text-sm">
            <span
              className={
                step === 1 ? "text-[#00d4ff]" : "text-[#888888]"
              }
            >
              1. Mașină
            </span>
            <span className="text-[#2a2a2a]">/</span>
            <span
              className={
                step === 2 ? "text-[#00d4ff]" : "text-[#888888]"
              }
            >
              2. Modificări
            </span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
          <div>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold text-white">
                    Selectează mașina
                  </h1>
                  <p className="mt-2 text-[#888888]">
                    Alege modelul de bază pentru configurația ta
                  </p>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cars.map((car) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() =>
                          selectCar(
                            car.id,
                            car.basePrice,
                            `${car.brand} ${car.model}`,
                          )
                        }
                        className={`group overflow-hidden rounded-xl border text-left transition-all duration-300 card-hover ${
                          selectedCarId === car.id
                            ? "gradient-border border-transparent"
                            : "border-[#2a2a2a] bg-[#1a1a1a]"
                        }`}
                      >
                        <div className="relative aspect-[16/10] bg-[#111111]">
                          {car.imageUrl ? (
                            <Image
                              src={car.imageUrl}
                              alt={`${car.brand} ${car.model}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-4xl">
                              🚗
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-[#00d4ff]">{car.brand}</p>
                          <p className="font-semibold text-white">
                            {car.model}
                          </p>
                          <p className="text-xs text-[#888888]">{car.year}</p>
                          <p className="mt-2 text-sm font-medium text-[#ff4444]">
                            de la {formatLei(car.basePrice)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold text-white">
                    Modificări — {selectedCarLabel}
                  </h1>
                  <p className="mt-2 text-[#888888]">
                    Alege câte o opțiune per categorie (opțional)
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => setActiveTab(cat.slug)}
                        className={`rounded-lg px-4 py-2 text-sm transition-all duration-300 ${
                          activeTab === cat.slug
                            ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                            : "text-[#888888] hover:text-white border border-transparent"
                        }`}
                      >
                        {categoryIcons[cat.slug] ?? "•"} {cat.name}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {activeCategory?.modifications.map((mod) => {
                      const isSelected =
                        selectedModifications[activeCategory.slug]?.id ===
                        mod.id;
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() =>
                            toggleModification({
                              id: mod.id,
                              name: mod.name,
                              price: mod.price,
                              categorySlug: activeCategory.slug,
                            })
                          }
                          className={`rounded-xl border p-4 text-left transition-all duration-300 ${
                            isSelected
                              ? "gradient-border border-transparent shadow-[0_0_24px_rgba(0,212,255,0.2)]"
                              : "border-[#2a2a2a] bg-[#1a1a1a] card-hover"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-white">
                                {mod.name}
                              </p>
                              {mod.description && (
                                <p className="mt-1 text-xs text-[#888888]">
                                  {mod.description}
                                </p>
                              )}
                            </div>
                            <p
                              className={`shrink-0 text-sm font-semibold ${
                                mod.price === 0
                                  ? "text-[#00d4ff]"
                                  : "text-[#ff4444]"
                              }`}
                            >
                              {mod.price === 0
                                ? "Inclus"
                                : `+${formatLei(mod.price)}`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="mt-8 lg:mt-0">
            <div className="sticky top-24 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
              <p className="text-sm text-[#888888]">Preț total estimat</p>
              <p className="mt-2 text-3xl font-bold text-white">
                <PriceCounter value={totalPrice} />
              </p>
              {selectedCarLabel && (
                <p className="mt-2 text-xs text-[#888888]">
                  {selectedCarLabel}
                </p>
              )}
              {Object.values(selectedModifications).length > 0 && (
                <ul className="mt-4 space-y-1 border-t border-[#2a2a2a] pt-4">
                  {Object.values(selectedModifications).map((m) => (
                    <li
                      key={m.id}
                      className="flex justify-between text-xs text-[#888888]"
                    >
                      <span>{m.name}</span>
                      <span className="text-[#ff4444]">
                        +{formatLei(m.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {step === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !selectedCarId}
                    className="mt-6 w-full rounded-lg bg-[#00d4ff] py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] disabled:opacity-50"
                  >
                    {saving
                      ? "Se salvează..."
                      : session
                        ? "Salvează configurația"
                        : "Autentifică-te pentru salvare"}
                  </button>
                  {!session && (
                    <p className="mt-2 text-center text-xs text-[#888888]">
                      <Link
                        href="/register"
                        className="text-[#00d4ff] hover:underline"
                      >
                        Creează cont
                      </Link>{" "}
                      sau{" "}
                      <Link
                        href="/login?callbackUrl=/configurator"
                        className="text-[#00d4ff] hover:underline"
                      >
                        autentifică-te
                      </Link>
                    </p>
                  )}
                  {message && (
                    <p className="mt-2 text-center text-xs text-[#00d4ff]">
                      {message}
                    </p>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
