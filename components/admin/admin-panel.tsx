"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { formatPrice } from "@/lib/format";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Modification = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  categoryId: string;
  category: Category;
};

type UserInfo = { name: string; email: string };

type UserConfig = {
  id: string;
  totalPrice: number;
  createdAt: string;
  modifications: unknown;
  carBrand: string;
  carModel: string;
  carYear: number;
  user?: UserInfo;
};

type Tab = "modificari" | "configurari";

export function AdminPanel({
  initialModifications,
  initialCategories,
  initialConfigurations,
}: {
  initialModifications: Modification[];
  initialCategories: Category[];
  initialConfigurations: UserConfig[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("modificari");
  const [modifications, setModifications] = useState(initialModifications);
  const [configurations] = useState(initialConfigurations);
  const [error, setError] = useState("");

  const [modForm, setModForm] = useState({
    id: "",
    name: "",
    price: 0,
    description: "",
    categoryId: initialCategories[0]?.id ?? "",
  });

  function resetModForm() {
    setModForm({
      id: "",
      name: "",
      price: 0,
      description: "",
      categoryId: initialCategories[0]?.id ?? "",
    });
  }

  async function saveModification(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const method = modForm.id ? "PUT" : "POST";
    const url = modForm.id
      ? `/api/modifications/${modForm.id}`
      : "/api/modifications";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modForm),
    });

    if (!res.ok) {
      setError("Eroare la salvarea modificării.");
      return;
    }

    const saved = await res.json();
    if (modForm.id) {
      setModifications((prev) =>
        prev.map((m) => (m.id === saved.id ? saved : m)),
      );
    } else {
      setModifications((prev) => [...prev, saved]);
    }
    resetModForm();
    router.refresh();
  }

  async function deleteModification(id: string) {
    if (!confirm("Ștergi această modificare?")) return;
    const res = await fetch(`/api/modifications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setModifications((prev) => prev.filter((m) => m.id !== id));
      router.refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "modificari", label: "Modificări" },
    { id: "configurari", label: "Configurații utilizatori" },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#00d4ff]">
            Administrare
          </p>
          <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Panou administrare
          </h1>
          <p className="mt-2 text-sm text-[#888888]">
            Gestionează modificările și vizualizează configurațiile salvate.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-md gap-2 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-3 py-2 text-sm transition-all duration-300 ${
                tab === t.id
                  ? "bg-[#00d4ff]/15 text-[#00d4ff]"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-[#ff4444]">{error}</p>
        )}

        {tab === "modificari" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[360px_1fr]">
            <form
              onSubmit={saveModification}
              className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6"
            >
              <h2 className="font-semibold text-white">
                {modForm.id ? "Editează modificarea" : "Adaugă modificare"}
              </h2>
              <div className="mt-4 space-y-3">
                <input
                  placeholder="Nume"
                  required
                  value={modForm.name}
                  onChange={(e) =>
                    setModForm({ ...modForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Preț (€)"
                  required
                  value={modForm.price || ""}
                  onChange={(e) =>
                    setModForm({
                      ...modForm,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <select
                  value={modForm.categoryId}
                  onChange={(e) =>
                    setModForm({ ...modForm, categoryId: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                >
                  {initialCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Descriere (opțional)"
                  value={modForm.description}
                  onChange={(e) =>
                    setModForm({ ...modForm, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#00d4ff] px-4 py-2 text-sm font-semibold text-[#0a0a0a] transition-all hover:shadow-[0_0_18px_rgba(0,212,255,0.35)]"
                >
                  {modForm.id ? "Actualizează" : "Adaugă"}
                </button>
                {modForm.id && (
                  <button
                    type="button"
                    onClick={resetModForm}
                    className="text-sm text-[#888888] hover:text-white"
                  >
                    Anulează
                  </button>
                )}
              </div>
            </form>

            <div className="scroll-area max-h-[600px] overflow-x-auto overflow-y-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#111111] text-[#888888]">
                  <tr>
                    <th className="p-3">Nume</th>
                    <th className="p-3">Categorie</th>
                    <th className="p-3">Preț</th>
                    <th className="p-3 text-right">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {modifications.map((mod) => (
                    <tr
                      key={mod.id}
                      className="border-t border-[#2a2a2a] transition-colors hover:bg-[#1a1a1a]"
                    >
                      <td className="p-3 text-white">{mod.name}</td>
                      <td className="p-3 text-[#888888]">
                        {mod.category.name}
                      </td>
                      <td className="p-3 text-[#ff4444]">
                        {formatPrice(mod.price)}
                      </td>
                      <td className="whitespace-nowrap p-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setModForm({
                              id: mod.id,
                              name: mod.name,
                              price: mod.price,
                              description: mod.description ?? "",
                              categoryId: mod.categoryId,
                            })
                          }
                          className="mr-3 text-[#00d4ff] hover:underline"
                        >
                          Editează
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteModification(mod.id)}
                          className="text-[#ff4444] hover:underline"
                        >
                          Șterge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "configurari" && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-[#2a2a2a]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111111] text-[#888888]">
                <tr>
                  <th className="p-3">Utilizator</th>
                  <th className="p-3">Mașină</th>
                  <th className="p-3">Preț total</th>
                  <th className="p-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {configurations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-[#888888]"
                    >
                      Nicio configurație salvată încă.
                    </td>
                  </tr>
                ) : (
                  configurations.map((config) => (
                    <tr
                      key={config.id}
                      className="border-t border-[#2a2a2a] transition-colors hover:bg-[#1a1a1a]"
                    >
                      <td className="p-3 text-white">
                        {config.user?.name ?? "—"}
                        <br />
                        <span className="text-xs text-[#888888]">
                          {config.user?.email}
                        </span>
                      </td>
                      <td className="p-3 text-[#cccccc]">
                        {config.carBrand} {config.carModel}{" "}
                        <span className="text-[#888888]">
                          ({config.carYear})
                        </span>
                      </td>
                      <td className="p-3 text-[#ff4444]">
                        {formatPrice(config.totalPrice)}
                      </td>
                      <td className="p-3 text-[#888888]">
                        {new Date(config.createdAt).toLocaleDateString(
                          "ro-RO",
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
