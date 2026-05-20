"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { formatLei } from "@/lib/format";

type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  basePrice: number;
  imageUrl: string | null;
};

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
  car: { brand: string; model: string };
  user?: UserInfo;
};

type Tab = "masini" | "modificari" | "configurari";

export function AdminPanel({
  initialCars,
  initialModifications,
  initialCategories,
  initialConfigurations,
}: {
  initialCars: Car[];
  initialModifications: Modification[];
  initialCategories: Category[];
  initialConfigurations: UserConfig[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("masini");
  const [cars, setCars] = useState(initialCars);
  const [modifications, setModifications] = useState(initialModifications);
  const [configurations] = useState(initialConfigurations);

  const [carForm, setCarForm] = useState({
    id: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    basePrice: 0,
    imageUrl: "",
  });

  const [modForm, setModForm] = useState({
    id: "",
    name: "",
    price: 0,
    description: "",
    categoryId: initialCategories[0]?.id ?? "",
  });

  const [error, setError] = useState("");

  function resetCarForm() {
    setCarForm({
      id: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      basePrice: 0,
      imageUrl: "",
    });
  }

  function resetModForm() {
    setModForm({
      id: "",
      name: "",
      price: 0,
      description: "",
      categoryId: initialCategories[0]?.id ?? "",
    });
  }

  async function saveCar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const method = carForm.id ? "PUT" : "POST";
    const url = carForm.id ? `/api/cars/${carForm.id}` : "/api/cars";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(carForm),
    });

    if (!res.ok) {
      setError("Eroare la salvarea mașinii.");
      return;
    }

    const saved = await res.json();
    if (carForm.id) {
      setCars((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    } else {
      setCars((prev) => [...prev, saved]);
    }
    resetCarForm();
    router.refresh();
  }

  async function deleteCar(id: string) {
    if (!confirm("Ștergi această mașină?")) return;
    const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCars((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    }
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
    { id: "masini", label: "Mașini" },
    { id: "modificari", label: "Modificări" },
    { id: "configurari", label: "Configurații utilizatori" },
  ];

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold text-white">Panou administrare</h1>
        <p className="mt-1 text-[#888888]">
          Gestionează mașinile, modificările și vizualizează configurațiile
        </p>

        <div className="mt-8 flex flex-wrap gap-2 border-b border-[#2a2a2a] pb-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-300 ${
                tab === t.id
                  ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                  : "text-[#888888] hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-[#ff4444]">{error}</p>}

        {tab === "masini" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <form
              onSubmit={saveCar}
              className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6"
            >
              <h2 className="font-semibold text-white">
                {carForm.id ? "Editează mașina" : "Adaugă mașină"}
              </h2>
              <div className="mt-4 space-y-3">
                <input
                  placeholder="Marcă (ex: BMW)"
                  required
                  value={carForm.brand}
                  onChange={(e) =>
                    setCarForm({ ...carForm, brand: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <input
                  placeholder="Model"
                  required
                  value={carForm.model}
                  onChange={(e) =>
                    setCarForm({ ...carForm, model: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="An"
                  required
                  value={carForm.year}
                  onChange={(e) =>
                    setCarForm({ ...carForm, year: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <input
                  type="number"
                  placeholder="Preț de bază (lei)"
                  required
                  value={carForm.basePrice || ""}
                  onChange={(e) =>
                    setCarForm({
                      ...carForm,
                      basePrice: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
                <input
                  placeholder="URL imagine (opțional)"
                  value={carForm.imageUrl}
                  onChange={(e) =>
                    setCarForm({ ...carForm, imageUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#00d4ff] px-4 py-2 text-sm font-semibold text-[#0a0a0a]"
                >
                  {carForm.id ? "Actualizează" : "Adaugă"}
                </button>
                {carForm.id && (
                  <button
                    type="button"
                    onClick={resetCarForm}
                    className="text-sm text-[#888888] hover:text-white"
                  >
                    Anulează
                  </button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#111111] text-[#888888]">
                  <tr>
                    <th className="p-3">Mașină</th>
                    <th className="p-3">An</th>
                    <th className="p-3">Preț</th>
                    <th className="p-3">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr key={car.id} className="border-t border-[#2a2a2a]">
                      <td className="p-3 text-white">
                        {car.brand} {car.model}
                      </td>
                      <td className="p-3 text-[#888888]">{car.year}</td>
                      <td className="p-3 text-[#ff4444]">
                        {formatLei(car.basePrice)}
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCarForm({
                              id: car.id,
                              brand: car.brand,
                              model: car.model,
                              year: car.year,
                              basePrice: car.basePrice,
                              imageUrl: car.imageUrl ?? "",
                            })
                          }
                          className="mr-2 text-[#00d4ff] hover:underline"
                        >
                          Editează
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCar(car.id)}
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

        {tab === "modificari" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
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
                  placeholder="Preț (lei)"
                  required
                  value={modForm.price || ""}
                  onChange={(e) =>
                    setModForm({ ...modForm, price: Number(e.target.value) })
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
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-[#00d4ff] px-4 py-2 text-sm font-semibold text-[#0a0a0a]"
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

            <div className="max-h-[480px] overflow-x-auto overflow-y-auto rounded-xl border border-[#2a2a2a]">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#111111] text-[#888888]">
                  <tr>
                    <th className="p-3">Nume</th>
                    <th className="p-3">Categorie</th>
                    <th className="p-3">Preț</th>
                    <th className="p-3">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {modifications.map((mod) => (
                    <tr key={mod.id} className="border-t border-[#2a2a2a]">
                      <td className="p-3 text-white">{mod.name}</td>
                      <td className="p-3 text-[#888888]">
                        {mod.category.name}
                      </td>
                      <td className="p-3 text-[#ff4444]">
                        {formatLei(mod.price)}
                      </td>
                      <td className="p-3 whitespace-nowrap">
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
                          className="mr-2 text-[#00d4ff] hover:underline"
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
                    <td colSpan={4} className="p-6 text-center text-[#888888]">
                      Nicio configurație salvată încă.
                    </td>
                  </tr>
                ) : (
                  configurations.map((config) => (
                    <tr key={config.id} className="border-t border-[#2a2a2a]">
                      <td className="p-3 text-white">
                        {config.user?.name ?? "—"}
                        <br />
                        <span className="text-xs text-[#888888]">
                          {config.user?.email}
                        </span>
                      </td>
                      <td className="p-3 text-[#888888]">
                        {config.car.brand} {config.car.model}
                      </td>
                      <td className="p-3 text-[#ff4444]">
                        {formatLei(config.totalPrice)}
                      </td>
                      <td className="p-3 text-[#888888]">
                        {new Date(config.createdAt).toLocaleDateString("ro-RO")}
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
