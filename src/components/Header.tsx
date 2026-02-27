"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  const { status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const params = useParams();
  const locale = params.locale as string || "en";
  const tNav = useTranslations("Navigation");

  const navLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/product`, label: tNav("product") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/contact`, label: tNav("contact") },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--card-border)">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ─── Left Side: Nav Links ─── */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-(--text-muted) hover:text-(--primary) transition-colors duration-200 text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ─── Center: Logo ─── */}
          <Link
            href={`/${locale}`}
            className="text-2xl font-bold text-(--primary) absolute left-1/2 -translate-x-1/2"
          >
            dotsuite
          </Link>

          {/* ─── Right Side: Controls ─── */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />

            {status === "authenticated" ? (
              <>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-sm font-semibold text-(--primary) bg-(--primary)/10 border border-(--primary)/20 px-4 py-2 rounded-lg hover:bg-(--primary) hover:text-(--background) transition-all duration-300"
                >
                  {tNav("dashboard") || "Dashboard"}
                </Link>
                <UserMenu />
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 text-sm text-(--text-muted) hover:text-(--primary) transition-colors duration-200"
                >
                  {tNav("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-4 py-2 text-sm bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors duration-200"
                >
                  {tNav("register")}
                </Link>
              </>
            )}
          </div>

          {/* ─── Mobile Menu Button ─── */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-(--text-muted) hover:text-(--primary) transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </nav>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}