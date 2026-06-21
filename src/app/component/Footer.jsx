
import {
  Envelope,
  Handset,
  LogoFacebook,
  LogoLinkedin,
  LogoTelegram,
  MapPinMinus,
} from "@gravity-ui/icons";
// import { Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070B14] text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <section>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white font-bold">
                R
              </div>

              <h2 className="text-xl font-bold bg-linear-to-r from-blue-500 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                ResellHub
              </h2>
            </Link>

            <p className="mt-5 text-sm leading-7">
              The premier marketplace for buying and selling pre-owned products
              safely. Save money while giving quality products a second life.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Envelope size={16} />
                <span>support@resellhub.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Handset size={16} />
                <span>+880 1700-000000</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPinMinus size={16} />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              {[
                {
                  icon: LogoFacebook,
                  href: "#",
                },
                {
                  icon: LogoTelegram,
                  href: "#",
                },
                {
                  icon: LogoFacebook,
                  href: "#",
                },
                {
                  icon: LogoLinkedin,
                  href: "#",
                },
              ].map(({ icon: Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="rounded-lg border border-white/10 p-2 transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {["Home", "Products", "Categories", "About Us", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link href="/" className="transition hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </section>

          {/* Account */}
          <section>
            <h3 className="mb-5 text-lg font-semibold text-white">Account</h3>

            <ul className="space-y-3">
              {["Sign In", "Register", "Dashboard", "My Orders"].map((item) => (
                <li key={item}>
                  <Link href="/" className="transition hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Categories */}
          <section>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Categories
            </h3>

            <ul className="space-y-3">
              {[
                "Electronics",
                "Furniture",
                "Vehicles",
                "Fashion",
                "Mobile Phones",
              ].map((item) => (
                <li key={item}>
                  <Link href="/" className="transition hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 text-sm md:flex-row">
          <p>© {new Date().getFullYear()} ResellHub. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>

            <Link href="/cookies" className="hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
