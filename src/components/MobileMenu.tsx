"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import UserMenu from "@/components/UserMenu";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { status } = useSession();
  const params = useParams();
  const locale = params.locale as string || "en";
  const menuRef = useRef<HTMLDivElement>(null);
  
  const tNav = useTranslations("Navigation");

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { href: `/${locale}`, label: tNav("home") },
    { href: `/${locale}/product`, label: tNav("product") },
    { href: `/${locale}/about`, label: tNav("about") },
    { href: `/${locale}/contact`, label: tNav("contact") },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" />

      {/* Mobile Menu Panel */}
      <div
        ref={menuRef}
        className="fixed top-18.25 left-0 right-0 bottom-0 bg-(--background) z-50 lg:hidden overflow-y-auto"
      >
        <div className="flex flex-col p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="px-4 py-3 text-lg text-(--text-muted) hover:text-[#10b981] hover:bg-(--card-border) rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="my-4 border-t border-(--card-border)" />

          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-(--text-muted)">Theme</span>
            <ThemeToggle />
          </div>

          {/* Language Switcher */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-(--text-muted)">Language</span>
            <LanguageSwitcher />
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-(--card-border)" />

          {/* User Section */}
          {status === "authenticated" ? (
            <div className="flex flex-col gap-2">
              <UserMenu isMobile onClose={onClose} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href={`/${locale}/login`}
                onClick={onClose}
                className="w-full px-4 py-3 text-center text-(--text-muted) hover:text-[#10b981] border border-(--card-border) rounded-lg transition-colors"
              >
                {tNav("login")}
              </Link>
              <Link
                href={`/${locale}/register`}
                onClick={onClose}
                className="w-full px-4 py-3 text-center bg-[#10b981] text-(--background) font-semibold rounded-lg hover:bg-[#059669] transition-colors"
              >
                {tNav("register")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
