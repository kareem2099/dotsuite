"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string || "en";
  const tNav = useTranslations("Navigation");

  const navLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/product`, label: tNav("product") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/contact`, label: tNav("contact") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-(--background)/90 backdrop-blur-sm border-b border-(--card-border)">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

          {/* ─── Left Side: Nav Links ─── */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-(--text-muted) hover:text-(--primary) transition-colors duration-200 text-sm whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ─── Center: Logo ─── */}
          <div className="flex flex-1 lg:flex-none justify-start lg:justify-center items-center">
            <Link
              href={`/${locale}`}
              className="text-2xl font-bold text-(--primary)"
            >
              dotsuite
            </Link>
          </div>

          {/* ─── Right Side: Controls ─── */}
          <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
            <form onSubmit={handleSearch} className="relative hidden xl:block mr-2">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tNav("search") || "Search..."}
                className="pl-9 pr-4 py-1.5 bg-(--card-bg) border border-(--card-border) rounded-full text-sm focus:border-(--primary) focus:outline-none transition-all duration-300 w-32 xl:w-48 focus:w-48 xl:focus:w-64"
              />
            </form>

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