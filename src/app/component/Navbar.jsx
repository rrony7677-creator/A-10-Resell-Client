"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient, signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
  const syncPendingRole = async () => {
    const pendingRole = sessionStorage.getItem("pendingRole");
    if (pendingRole && user && user.role !== pendingRole) {
      await authClient.updateUser({ role: pendingRole });
      sessionStorage.removeItem("pendingRole");
      window.location.reload(); // নতুন role সহ session রিফ্রেশ করার জন্য
    }
  };
  if (user) syncPendingRole();
}, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const dashboardHref = user
    ? user.role === "admin"
      ? "/dashboard/admin"
      : user.role === "seller"
      ? "/dashboard/seller"
      : "/dashboard/buyer"
    : "/auth/signup";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl shadow-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
            R
          </div>
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            ResellHub
          </h2>
        </Link>

        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300
                  ${isActive(item.href) ? "bg-blue-600 text-white shadow-md" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center lg:flex">
          <button className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white" aria-label="Theme">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          </button>

          <div className="mx-5 h-6 w-px bg-white/20" />

          {user ? (
            <>
              <span className="mr-4 text-sm text-gray-300">Hi! {user.name}</span>
              <Button onClick={handleSignOut} variant="ghost" className="text-gray-300 hover:text-white">
                Sign Out
              </Button>
              <Link
                href={dashboardHref}
                className="ml-4 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4 text-sm font-medium text-gray-300 hover:text-white">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden" aria-label="Toggle Menu">
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {menuOpen && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1 p-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm transition
                    ${isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 p-4 space-y-3">
            {user ? (
              <>
                <p className="text-sm text-gray-300">Hi! {user.name}</p>
                <Link href={dashboardHref} className="block w-full text-center rounded-lg bg-blue-600 py-3 text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="block w-full text-center rounded-lg border border-zinc-700 py-3 text-sm text-gray-300">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block rounded-lg py-3 text-gray-300 hover:text-white" onClick={() => setMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/signup" className="block w-full text-center rounded-lg bg-blue-600 py-3 text-sm font-medium text-white" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}