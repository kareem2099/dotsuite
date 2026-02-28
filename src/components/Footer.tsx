"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const { data: session } = useSession();
  const { toast } = useToast();

  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    toast.success(t("subscribeSuccess"));
    setEmail("");
  };

  return (
    <footer className="border-t border-(--card-border) bg-(--background)">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`/${locale}`} className="text-2xl font-bold text-(--primary)">
              dotsuite
            </Link>
            <p className="mt-4 text-(--text-muted) text-sm">
              {t("brand")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-(--text-muted)">
              <li>
                <Link href={`/${locale}`} className="hover:text-(--primary) transition-colors">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/product`} className="hover:text-(--primary) transition-colors">
                  {tNav("product")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-(--primary) transition-colors">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-(--primary) transition-colors">
                  {tNav("contact")}
                </Link>
              </li>
              {!session && (
                <>
                  <li>
                    <Link href={`/${locale}/login`} className="hover:text-(--primary) transition-colors">
                      {tNav("login")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${locale}/register`} className="hover:text-(--primary) transition-colors">
                      {tNav("register")}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t("followUs")}</h4>
            <div className="flex flex-wrap gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/freerave/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@dotfreerave"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com/FreeRave2"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@DotFreeRave"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* Dev.to */}
              <a
                href="https://dev.to/freerave"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="Dev.to"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.882 18.275l-.476-1.549H4.48l.476 1.549a.949.949 0 0 1-.674.351l-2.204.308a.488.488 0 0 1-.45-.267.5.5 0 0 1 .27-.593l2.756-.386a.962.962 0 0 1 .823.18l.714.523 1.104-1.263-2.252-1.635a.961.961 0 0 1-.165-1.133.968.968 0 0 1 .752-.439l2.228.313.423-1.549H6.38l-.476-1.549a.949.949 0 0 1 .674-.351l2.204-.308a.488.488 0 0 1 .45.267.5.5 0 0 1-.27.593l-2.756.386a.962.962 0 0 1-.823-.18l-.714-.523-1.104 1.263 2.252 1.635a.961.961 0 0 1 .165 1.133.968.968 0 0 1-.752.439l-2.228-.313-.423 1.549h1.826l.476 1.548a.949.949 0 0 1-.674.351l-2.204.308a.488.488 0 0 1-.45-.267.5.5 0 0 1 .27-.593l2.756-.386a.962.962 0 0 1 .823.18l.714.523 1.104-1.263-2.252-1.635a.961.961 0 0 1-.165-1.133.968.968 0 0 1 .752-.439l2.228.313.423-1.549h-1.826z" />
                </svg>
              </a>
              {/* Medium */}
              <a
                href="https://medium.com/@freerave"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="Medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61582297589938"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/dotfreerave/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-(--card-border) rounded-lg hover:border-(--primary) hover:text-(--primary) transition-colors"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 className="font-semibold mb-4">{t("stayUpdated")}</h4>
            <p className="text-sm text-(--text-muted) mb-4">
              {t("subscribeDesc")}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
                className="w-full px-4 py-2 bg-(--card-bg) border border-(--card-border) rounded-lg text-sm focus:border-(--primary) focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-(--primary) text-(--background) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors text-sm"
              >
                {t("subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-(--card-border) text-center text-sm text-(--text-muted)">
          <p>{t("copyright")} {t("allRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}
