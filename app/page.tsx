"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/page-transition";

const steps = [
  {
    title: "Alege brandul și modelul",
    description:
      "Selectează dintr-o bază extinsă de mărci și modele auto reale.",
  },
  {
    title: "Personalizează în detaliu",
    description:
      "Culori, jante, spoilere și accesorii — fiecare opțiune cu preț real.",
  },
  {
    title: "Salvează configurația",
    description:
      "Păstrează build-ul tău în cont și revino oricând pentru ajustări.",
  },
];

const testimonials = [
  {
    name: "Andrei M.",
    text: "Am configurat Golf-ul meu în câteva minute. Interfața este intuitivă și rapidă.",
  },
  {
    name: "Elena P.",
    text: "Prețul total se actualizează instant la fiecare modificare. Foarte transparent.",
  },
  {
    name: "Mihai D.",
    text: "Cea mai bună experiență de configurare auto online pe care am încercat-o.",
  },
  {
    name: "Ioana S.",
    text: "Design modern, totul în română și cu o gamă largă de modele de mașini.",
  },
];

const stats = [
  { value: "15+", label: "Branduri auto" },
  { value: "500+", label: "Modele disponibile" },
  { value: "20+", label: "Modificări premium" },
];

export default function HomePage() {
  return (
    <PageTransition>
      <section className="hero-grain relative overflow-hidden border-b border-[#2a2a2a] bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
          <motion.h1
            className="max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Construiește mașina{" "}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">
              visurilor tale
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-balance text-base text-[#888888] sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Alege dintr-o bază extinsă de modele auto, personalizează fiecare
            detaliu și vezi prețul calculat în timp real.
          </motion.p>
          <motion.div
            className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Link
              href="/configurator"
              className="w-full rounded-lg bg-[#00d4ff] px-6 py-3 text-center text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] sm:w-auto"
            >
              Începe configurarea
            </Link>
            <Link
              href="#cum-functioneaza"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-6 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:border-[#00d4ff]/40 card-hover sm:w-auto"
            >
              Cum funcționează
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-[#888888]">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="cum-functioneaza"
        className="border-b border-[#2a2a2a] bg-[#111111] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#00d4ff]">
              Proces
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Cum funcționează
            </h2>
            <p className="mt-4 text-[#888888]">
              Trei pași simpli până la configurația perfectă.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="relative flex flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-7 text-center card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 text-sm font-semibold text-[#00d4ff]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#888888]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#00d4ff]">
              Recenzii
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Ce spun utilizatorii
            </h2>
          </div>
          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.article
                key={t.name}
                className="flex flex-col rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 card-hover"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-sm leading-relaxed text-[#cccccc]">
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-5 text-sm font-medium text-white">
                  {t.name}
                </p>
                <span className="mt-1 text-xs uppercase tracking-wider text-[#888888]">
                  Utilizator verificat
                </span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#2a2a2a] bg-[#111111] py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Gata să-ți construiești mașina?
          </h2>
          <p className="mt-4 text-[#888888]">
            Începe acum și salvează configurația în contul tău pentru mai
            târziu.
          </p>
          <Link
            href="/configurator"
            className="mt-8 rounded-lg bg-[#00d4ff] px-8 py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)]"
          >
            Deschide configuratorul
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
