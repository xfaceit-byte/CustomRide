"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/page-transition";
import { PriceCounter } from "@/components/price-counter";
import { useConfiguratorStore } from "@/store/configurator-store";
import { formatPrice } from "@/lib/format";
import { computeCarPrice } from "@/lib/pricing";

type Brand = {
  slug: string;
  name: string;
  tier: "premium" | "standard" | "budget";
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

export type InitialConfig = {
  id: string;
  brandSlug: string;
  brandName: string;
  model: string;
  year: number;
  basePrice: number;
  modifications: Array<{
    id: string;
    name: string;
    price: number;
    categorySlug?: string;
  }>;
};

const tierLabels: Record<Brand["tier"], string> = {
  premium: "Premium",
  standard: "Standard",
  budget: "Accesibil",
};

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;
const YEARS = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i,
);

export function ConfiguratorClient({
  brands,
  categories,
  initialConfig,
}: {
  brands: Brand[];
  categories: Category[];
  initialConfig?: InitialConfig | null;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    step,
    brandSlug,
    brandName,
    model,
    year,
    basePrice,
    selectedModifications,
    selectBrand,
    selectModel,
    selectYear,
    toggleModification,
    setStep,
    getTotalPrice,
    reset,
    loadFromConfiguration,
  } = useConfiguratorStore();

  const [editId, setEditId] = useState<string | null>(
    initialConfig?.id ?? null,
  );
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [modelsByBrand, setModelsByBrand] = useState<
    Record<string, string[]>
  >({});
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelsError, setModelsError] = useState("");
  const [activeTab, setActiveTab] = useState(categories[0]?.slug ?? "culori");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const fetchControllerRef = useRef<AbortController | null>(null);
  const hasInitializedRef = useRef(false);

  const totalPrice = getTotalPrice();
  const activeCategory = categories.find((c) => c.slug === activeTab);
  const selectedTier = brands.find((b) => b.slug === brandSlug)?.tier;
  const models = useMemo(
    () => (brandSlug ? (modelsByBrand[brandSlug] ?? []) : []),
    [brandSlug, modelsByBrand],
  );

  const loadModels = useCallback(
    async (slug: string) => {
      if (modelsByBrand[slug]) return;
      fetchControllerRef.current?.abort();
      const controller = new AbortController();
      fetchControllerRef.current = controller;
      setLoadingModels(true);
      setModelsError("");
      try {
        const res = await fetch(
          `/api/cars/models?brand=${encodeURIComponent(slug)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Eroare server");
        const data: { models: string[] } = await res.json();
        setModelsByBrand((prev) => ({ ...prev, [slug]: data.models }));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setModelsError("Nu am putut încărca modelele pentru acest brand.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingModels(false);
      }
    },
    [modelsByBrand],
  );

  function handleSelectBrand(b: Brand) {
    selectBrand(b.slug, b.name);
    void loadModels(b.slug);
  }

  useEffect(() => {
    if (hasInitializedRef.current || !initialConfig) return;
    hasInitializedRef.current = true;
    loadFromConfiguration({
      brandSlug: initialConfig.brandSlug,
      brandName: initialConfig.brandName,
      model: initialConfig.model,
      year: initialConfig.year,
      basePrice: initialConfig.basePrice,
      modifications: initialConfig.modifications
        .filter((m): m is typeof m & { categorySlug: string } =>
          Boolean(m.categorySlug),
        )
        .map((m) => ({
          id: m.id,
          name: m.name,
          price: m.price,
          categorySlug: m.categorySlug,
        })),
    });
    void loadModels(initialConfig.brandSlug);
  }, [initialConfig, loadFromConfiguration, loadModels]);

  const filteredBrands = useMemo(() => {
    const q = brandFilter.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((b) => b.name.toLowerCase().includes(q));
  }, [brands, brandFilter]);

  const filteredModels = useMemo(() => {
    const q = modelFilter.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.toLowerCase().includes(q));
  }, [models, modelFilter]);

  const stepLabels = ["Brand", "Model", "An", "Modificări"];

  async function handleSave() {
    if (!session) {
      router.push("/login?callbackUrl=/configurator");
      return;
    }
    if (!brandName || !model || !year) return;

    setSaving(true);
    setMessage("");

    const url = editId
      ? `/api/configurations/${editId}`
      : "/api/configurations";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        carBrand: brandName,
        carModel: model,
        carYear: year,
        carBasePrice: basePrice,
        modifications: Object.values(selectedModifications),
        totalPrice,
      }),
    });

    setSaving(false);

    if (res.ok) {
      setMessage(
        editId
          ? "Configurația a fost actualizată."
          : "Configurația a fost salvată cu succes.",
      );
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Eroare la salvare.");
    }
  }

  function handleReset() {
    setEditId(null);
    hasInitializedRef.current = true;
    reset();
    router.replace("/configurator");
  }

  function goBack() {
    if (step === 1) return;
    setStep((step - 1) as 1 | 2 | 3 | 4);
  }

  return (
    <PageTransition>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#00d4ff]">
            {editId ? "Editare configurație" : "Configurator"}
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            {editId ? "Modifică build-ul tău" : "Construiește mașina ta"}
          </h1>
          <p className="mt-2 text-sm text-[#888888]">
            {editId
              ? "Schimbă orice opțiune și salvează din nou."
              : "Alege brandul, modelul, anul și adaugă modificările dorite."}
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between gap-2 sm:gap-4">
          {stepLabels.map((label, i) => {
            const n = (i + 1) as 1 | 2 | 3 | 4;
            const active = step === n;
            const done = step > n;
            const reachable =
              n === 1 ||
              (n === 2 && brandSlug) ||
              (n === 3 && model) ||
              (n === 4 && year);
            return (
              <button
                key={label}
                type="button"
                onClick={() => reachable && setStep(n)}
                disabled={!reachable}
                className={`flex flex-1 flex-col items-center gap-2 ${
                  reachable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all sm:h-9 sm:w-9 ${
                    active
                      ? "border-[#00d4ff] bg-[#00d4ff]/15 text-[#00d4ff] shadow-[0_0_16px_rgba(0,212,255,0.35)]"
                      : done
                        ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]"
                        : "border-[#2a2a2a] bg-[#1a1a1a] text-[#888888]"
                  }`}
                >
                  {n}
                </span>
                <span
                  className={`hidden text-xs sm:block ${
                    active ? "text-white" : "text-[#888888]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="text-sm text-[#888888] transition-colors hover:text-[#00d4ff] disabled:pointer-events-none disabled:opacity-40"
          >
            ← Înapoi
          </button>
          {(brandName || model || year) && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-[#888888] transition-colors hover:text-[#ff4444]"
            >
              {editId ? "Renunță la editare" : "Resetează"}
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section
                  key="brand"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <SearchInput
                    value={brandFilter}
                    onChange={setBrandFilter}
                    placeholder="Caută brand (BMW, Audi, Toyota...)"
                  />
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {filteredBrands.map((b) => {
                      const isSelected = brandSlug === b.slug;
                      return (
                        <button
                          key={b.slug}
                          type="button"
                          onClick={() => handleSelectBrand(b)}
                          className={`flex aspect-square flex-col items-center justify-center rounded-xl border p-4 text-center transition-all duration-300 ${
                            isSelected
                              ? "gradient-border border-transparent shadow-[0_0_24px_rgba(0,212,255,0.25)]"
                              : "border-[#2a2a2a] bg-[#1a1a1a] card-hover"
                          }`}
                        >
                          <span className="text-base font-semibold text-white sm:text-lg">
                            {b.name}
                          </span>
                          <span className="mt-2 rounded-full border border-[#2a2a2a] bg-[#111111] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#888888]">
                            {tierLabels[b.tier]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {filteredBrands.length === 0 && (
                    <p className="mt-8 text-center text-sm text-[#888888]">
                      Niciun brand găsit pentru &ldquo;{brandFilter}&rdquo;.
                    </p>
                  )}
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="model"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-lg font-semibold text-white">
                      Modele {brandName}
                    </h2>
                    <span className="text-xs text-[#888888]">
                      {filteredModels.length} disponibile
                    </span>
                  </div>
                  <div className="mt-4">
                    <SearchInput
                      value={modelFilter}
                      onChange={setModelFilter}
                      placeholder="Caută model..."
                    />
                  </div>

                  {loadingModels && (
                    <div className="mt-10 flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2a2a2a] border-t-[#00d4ff]" />
                    </div>
                  )}

                  {modelsError && (
                    <p className="mt-6 text-center text-sm text-[#ff4444]">
                      {modelsError}
                    </p>
                  )}

                  {!loadingModels && !modelsError && (
                    <div className="scroll-area mt-6 grid max-h-[480px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredModels.map((m) => {
                        const isSelected = model === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => selectModel(m)}
                            className={`rounded-lg border px-4 py-3 text-left text-sm transition-all duration-300 ${
                              isSelected
                                ? "gradient-border border-transparent text-white"
                                : "border-[#2a2a2a] bg-[#1a1a1a] text-[#cccccc] hover:border-[#00d4ff]/40 hover:text-white"
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                      {filteredModels.length === 0 && (
                        <p className="col-span-full py-10 text-center text-sm text-[#888888]">
                          Niciun model găsit.
                        </p>
                      )}
                    </div>
                  )}
                </motion.section>
              )}

              {step === 3 && (
                <motion.section
                  key="year"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-lg font-semibold text-white">
                    {brandName} {model}
                  </h2>
                  <p className="mt-1 text-sm text-[#888888]">
                    Alege anul de fabricație. Prețul de bază se ajustează în
                    funcție de vechime.
                  </p>
                  <div className="scroll-area mt-6 grid max-h-[420px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6">
                    {YEARS.map((y) => {
                      const isSelected = year === y;
                      const price =
                        selectedTier && brandSlug && model
                          ? computeCarPrice(brandSlug, model, y, selectedTier)
                          : 0;
                      return (
                        <button
                          key={y}
                          type="button"
                          onClick={() => selectYear(y, price)}
                          className={`flex flex-col items-center rounded-lg border px-3 py-3 transition-all duration-300 ${
                            isSelected
                              ? "gradient-border border-transparent shadow-[0_0_18px_rgba(0,212,255,0.25)]"
                              : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#00d4ff]/40"
                          }`}
                        >
                          <span className="font-semibold text-white">{y}</span>
                          <span className="mt-0.5 text-[10px] text-[#888888]">
                            {formatPrice(price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.section>
              )}

              {step === 4 && (
                <motion.section
                  key="mods"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-lg font-semibold text-white">
                    Modificări pentru {brandName} {model} {year}
                  </h2>
                  <p className="mt-1 text-sm text-[#888888]">
                    Alege câte o opțiune pentru fiecare categorie.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-3">
                    {categories.map((cat) => {
                      const isActive = activeTab === cat.slug;
                      const hasSelection =
                        !!selectedModifications[cat.slug];
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => setActiveTab(cat.slug)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-300 ${
                            isActive
                              ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]"
                              : "border-transparent text-[#888888] hover:text-white"
                          }`}
                        >
                          {cat.name}
                          {hasSelection && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
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
                            <div className="min-w-0">
                              <p className="truncate font-medium text-white">
                                {mod.name}
                              </p>
                              {mod.description && (
                                <p className="mt-1 line-clamp-2 text-xs text-[#888888]">
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
                                : `+${formatPrice(mod.price)}`}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <aside>
            <div className="sticky top-24 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 sm:p-6">
              <p className="text-xs uppercase tracking-wider text-[#888888]">
                Preț total estimat
              </p>
              <p className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                <PriceCounter value={totalPrice} />
              </p>

              <div className="mt-5 space-y-3 border-t border-[#2a2a2a] pt-4 text-sm">
                <Row
                  label="Brand"
                  value={brandName ?? "Neselectat"}
                  muted={!brandName}
                />
                <Row
                  label="Model"
                  value={model ?? "Neselectat"}
                  muted={!model}
                />
                <Row
                  label="An"
                  value={year ? String(year) : "Neselectat"}
                  muted={!year}
                />
                <Row
                  label="Preț bază"
                  value={basePrice ? formatPrice(basePrice) : "—"}
                  muted={!basePrice}
                />
              </div>

              {Object.values(selectedModifications).length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t border-[#2a2a2a] pt-4 text-xs">
                  {Object.values(selectedModifications).map((m) => (
                    <li
                      key={m.id}
                      className="flex justify-between gap-3 text-[#cccccc]"
                    >
                      <span className="truncate">{m.name}</span>
                      <span className="shrink-0 text-[#ff4444]">
                        +{formatPrice(m.price)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {step === 4 && (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !year}
                    className="mt-6 w-full rounded-lg bg-[#00d4ff] py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] disabled:opacity-50"
                  >
                    {saving
                      ? "Se salvează..."
                      : !session
                        ? "Autentifică-te pentru salvare"
                        : editId
                          ? "Salvează modificările"
                          : "Salvează configurația"}
                  </button>
                  {!session && (
                    <p className="mt-3 text-center text-xs text-[#888888]">
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
                        intră în cont
                      </Link>
                    </p>
                  )}
                  {message && (
                    <p className="mt-3 text-center text-xs text-[#00d4ff]">
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

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-wider text-[#888888]">
        {label}
      </span>
      <span
        className={`truncate text-sm ${muted ? "text-[#666666]" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder:text-[#666666] transition-all duration-300"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-white"
        >
          Anulează
        </button>
      )}
    </div>
  );
}
