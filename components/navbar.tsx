"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "/configurator", label: "Configurator" },
  { href: "/#cum-functioneaza", label: "Despre" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#2a2a2a]/80 bg-[#0a0a0a]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="text-lg font-bold tracking-tight text-white transition-colors hover:text-[#00d4ff] sm:text-xl"
        >
          Custom<span className="text-[#00d4ff]">Ride</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors duration-300 hover:text-[#00d4ff] ${
                  pathname === link.href ? "text-[#00d4ff]" : "text-[#888888]"
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

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
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
                className="text-xs text-[#888888] transition-colors hover:text-white"
              >
                Ieșire
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-sm text-[#888888] transition-colors hover:text-white"
              >
                Înregistrare
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-4 py-2 text-sm font-medium text-[#00d4ff] transition-all duration-300 hover:bg-[#00d4ff]/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Autentificare
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-white md:hidden"
          aria-label="Meniu"
        >
          <span className="relative flex h-3 w-5 flex-col justify-between">
            <span
              className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                mobileOpen ? "translate-y-[5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-full bg-current transition-transform duration-300 ${
                mobileOpen ? "-translate-y-[5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#1a1a1a] hover:text-[#00d4ff]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {session?.user?.role === "ADMIN" && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#1a1a1a] hover:text-[#00d4ff]"
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li className="mt-2 border-t border-[#2a2a2a] pt-3">
                {session ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#1a1a1a] hover:text-[#00d4ff]"
                    >
                      Contul meu
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="rounded-lg px-3 py-2 text-left text-sm text-[#cccccc] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                    >
                      Ieșire din cont
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#1a1a1a] hover:text-white"
                    >
                      Înregistrare
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-[#00d4ff]/40 bg-[#00d4ff]/10 px-3 py-2 text-center text-sm font-medium text-[#00d4ff]"
                    >
                      Autentificare
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
