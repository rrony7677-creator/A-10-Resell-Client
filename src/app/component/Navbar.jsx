"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  console.log("User:", user);

  const handleSignOut = async () => {
    await signOut();
  };

  // Example of using session hook to conditionally render auth state in navbar (not implemented here)

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl shadow-lg">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-md">
            R
          </div>

          <h2 className="text-xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            ResellHub
          </h2>
        </Link>

        {/* Desktop Menu */}

        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300
                  ${
                    item.label === "Home"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Side */}

        <div className="hidden items-center lg:flex">
          {/* Theme Button */}

          <button
            className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            aria-label="Theme"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M21 12.79A9 9 0 1111.21 3
                7 7 0 0021 12.79z"
              />
            </svg>
          </button>

          {/* Divider */}

          <div className="mx-5 h-6 w-px bg-white/20" />

          {user ? (
            <>
             Hi! {user.name}
            <Button 
            onClick={handleSignOut}
            variant="ghost" className="text-gray-300 hover:text-white">
              Sign Out
            </Button>
            </>
          ) : (
            <Link
              href="/login"
              className="mr-4 text-sm font-medium text-gray-300 hover:text-white"
            >
              Sign In
            </Link>
          )}

          <Link
            // as={Link}
            href="/auth/signup"
            color="primary"
            radius="sm"
            className="font-medium"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu */}

      {menuOpen && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-xl lg:hidden">
          <ul className="space-y-1 p-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm transition
                    ${
                      item.label === "Home"
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/login"
              className="block rounded-lg py-3 text-gray-300 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              // as={Link}
              href="/auth/signup"
              color="primary"
              className="mt-3 w-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
