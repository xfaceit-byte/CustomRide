"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/page-transition";

const steps = [
  {
    icon: "🚗",
    title: "Alege mașina",
    description:
      "Selectează din catalogul nostru modelul care ți se potrivește.",
  },
  {
    icon: "✨",
    title: "Personalizează",
    description:
      "Culori, jante, spoilere și accesorii — totul într-un singur loc.",
  },
  {
    icon: "💾",
    title: "Salvează configurația",
    description:
      "Păstrează build-ul tău în cont și revino oricând vrei.",
  },
];

const testimonials = [
  {
    name: "Andrei M.",
    text: "Am configurat Golf-ul meu în câteva minute. Interfața e superbă!",
    rating: 5,
  },
  {
    name: "Elena P.",
    text: "Prețul total se actualizează instant. Foarte transparent.",
    rating: 5,
  },
  {
    name: "Mihai D.",
    text: "Cea mai bună experiență de tuning online pe care am încercat-o.",
    rating: 5,
  },
  {
    name: "Ioana S.",
    text: "Design modern, totul în română. Recomand cu încredere!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <PageTransition>
      <section className="hero-grain relative overflow-hidden border-b border-[#2a2a2a] bg-gradient-to-b from-[#111111] to-[#0a0a0a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,0.08),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
          <motion.h1
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Construiește mașina{" "}
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#0066ff] bg-clip-text text-transparent">
              visurilor tale
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 max-w-xl text-lg text-[#888888]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Configuratorul premium pentru modificări auto. Alege modelul,
            personalizează fiecare detaliu și vezi prețul în timp real.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/configurator"
              className="rounded-lg bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#0a0a0a] transition-all duration-300 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)]"
            >
              Începe configurarea
            </Link>
            <Link
              href="/#cum-functioneaza"
              className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-[#00d4ff]/40 card-hover"
            >
              Cum funcționează
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        id="cum-functioneaza"
        className="border-b border-[#2a2a2a] bg-[#111111] py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Cum funcționează
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-[#888888]">
            Trei pași simpli până la configurația perfectă
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 text-center card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-4xl">{step.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-[#888888]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Ce spun utilizatorii
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <motion.article
                key={t.name}
                className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 card-hover"
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <p className="text-[#00d4ff]">
                  {"★".repeat(t.rating)}
                </p>
                <p className="mt-3 text-sm text-[#888888]">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-sm font-medium text-white">{t.name}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
