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
          {/* Logo */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-[#10b981]">
            dotsuite
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-(--text-muted) hover:text-[#10b981] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* User Menu or Login/Register */}
            {status === "authenticated" ? (
              <div className="flex items-center gap-4">
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-sm font-semibold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-4 py-2 rounded-lg hover:bg-[#10b981] hover:text-(--background) transition-all duration-300"
                >
                  {tNav("dashboard") || "Dashboard"}
                </Link>
                <UserMenu />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/login`}
                  className="px-4 py-2 text-(--text-muted) hover:text-[#10b981] transition-colors duration-200"
                >
                  {tNav("login")}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-4 py-2 bg-[#10b981] text-(--background) font-semibold rounded-lg hover:bg-[#059669] transition-colors duration-200"
                >
                  {tNav("register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button - Hidden on desktop */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 text-(--text-muted) hover:text-[#10b981] transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
