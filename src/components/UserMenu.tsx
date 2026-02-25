"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import UserAvatar from "@/components/UserAvatar";

interface UserMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function UserMenu({ isMobile = false, onClose }: UserMenuProps) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const locale = params.locale as string || "en";
  
  const tNav = useTranslations("Navigation");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLinkClick = () => {
    setDropdownOpen(false);
    onClose?.();
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    onClose?.();
    signOut({ callbackUrl: `/${locale}`, redirect: true });
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 focus:outline-none"
        aria-label="User menu"
      >
        <UserAvatar
          src={session.user?.image}
          name={session.user?.name}
          size="sm"
        />
        {!isMobile && (
          <svg
            className={`w-4 h-4 text-(--text-muted) transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {dropdownOpen && (
        <>
          {/* Dropdown */}
          <div className={`${isMobile ? "relative" : "absolute right-0"} mt-3 w-56 bg-(--card-bg) border border-(--card-border) rounded-xl shadow-xl z-20 overflow-hidden`}>
            {/* User Info */}
            <div className="px-4 py-3 border-b border-(--card-border)">
              <p className="text-sm font-semibold truncate">{session.user?.name}</p>
              <p className="text-xs text-(--text-muted) truncate">{session.user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href={`/${locale}/dashboard/profile`}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-muted) hover:text-(--foreground) hover:bg-(--card-border) transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {tNav("profile")}
              </Link>
              <Link
                href={`/${locale}/dashboard/settings`}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--text-muted) hover:text-(--foreground) hover:bg-(--card-border) transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {tNav("settings")}
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-(--card-border) py-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-(--card-border) transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {tNav("logout")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
