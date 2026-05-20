"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const links = [
  { href: "/configurator", label: "Configurator" },
  { href: "/#cum-functioneaza", label: "Despre" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a]/80 bg-[#0a0a0a]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <motion.span
            className="text-xl font-bold tracking-tight text-white"
            whileHover={{ textShadow: "0 0 20px rgba(0, 212, 255, 0.6)" }}
            transition={{ duration: 0.3 }}
          >
            Custom<span className="text-[#00d4ff]">Ride</span>
          </motion.span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors duration-300 hover:text-[#00d4ff] ${
                  pathname === link.href
                    ? "text-[#00d4ff]"
                    : "text-[#888888]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {session?.user?.role === "ADMIN" && (
            <li>
              <Link
                href="/admin"
                className="text-sm text-[#888888] transition-colors duration-300 hover:text-[#00d4ff]"
              >
                Admin
              </Link>
            </li>
          )}
        </ul>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          {session ? (
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#1a1a1a] text-sm font-medium text-[#00d4ff] transition-all duration-300 hover:border-[#00d4ff]/50 hover:shadow-[0_0_16px_rgba(0,212,255,0.25)]"
                title={session.user?.name ?? "Cont"}
              >
                {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden text-xs text-[#888888] transition-colors hover:text-white sm:block"
              >
                Ieșire
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className="hidden text-sm text-[#888888] transition-colors hover:text-white sm:block"
              >
                Înregistrare
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-4 py-2 text-sm font-medium text-[#00d4ff] transition-all duration-300 hover:bg-[#00d4ff]/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Autentificare
              </Link>
            </div>
          )}
        </motion.div>
      </nav>
    </header>
  );
}
