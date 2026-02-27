"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import SocialLinks from "./SocialLinks";

export default function ContactInfo() {
  const t = useTranslations("Contact");
  const params = useParams();
  const locale = (params.locale as string) || "en";

  return (
    <div className="space-y-6">
      {/* Company Info */}
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
        <h3 className="text-xl font-semibold mb-6">{t("companyInfo")}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t("address")}</h4>
              <p className="text-(--text-muted) text-sm">dotsuite, Developer Tools</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{t("emailUs")}</h4>
              <a href="mailto:kareem209907@gmail.com" className="text-[#10b981] hover:underline text-sm">
                kareem209907@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
        <h3 className="text-xl font-semibold mb-6">{t("followUs")}</h3>
        <SocialLinks />
      </div>

      {/* FAQ */}
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
        <h3 className="text-xl font-semibold mb-4">{t("faq")}</h3>
        <p className="text-(--text-muted) mb-4">{t("faqDesc")}</p>
        <Link
          href={`/${locale}/faq`}
          className="inline-flex items-center gap-2 text-[#10b981] hover:underline"
        >
          {t("viewFaq")}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}