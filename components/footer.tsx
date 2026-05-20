import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="contact"
      className="mt-auto border-t border-[#2a2a2a] bg-[#111111] py-12"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-white">
              Custom<span className="text-[#00d4ff]">Ride</span>
            </p>
            <p className="mt-2 text-sm text-[#888888]">
              Configurează mașina visurilor tale. Modificări premium, preț
              transparent.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-white">Navigare</p>
            <ul className="space-y-2 text-sm text-[#888888]">
              <li>
                <Link
                  href="/configurator"
                  className="transition-colors duration-300 hover:text-[#00d4ff]"
                >
                  Configurator
                </Link>
              </li>
              <li>
                <Link
                  href="/#cum-functioneaza"
                  className="transition-colors duration-300 hover:text-[#00d4ff]"
                >
                  Despre
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors duration-300 hover:text-[#00d4ff]"
                >
                  Autentificare
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-white">Contact</p>
            <ul className="space-y-2 text-sm text-[#888888]">
              <li>contact@customride.ro</li>
              <li>+40 700 000 000</li>
              <li>Chișinău, Moldova</li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-[#2a2a2a] pt-6 text-center text-xs text-[#888888]">
          © {new Date().getFullYear()} CustomRide. Toate drepturile rezervate.
        </p>
      </div>
    </footer>
  );
}
