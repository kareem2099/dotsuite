import type { Metadata } from "next";
import AppTermsPage, { appTermsMetadata } from "@/components/terms/AppTermsPage";
import { dotReminderTerms } from "@/lib/dotreminder-terms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return appTermsMetadata(dotReminderTerms, (await params).locale);
}

export default async function DotReminderTermsPage({ params }: Props) {
  return <AppTermsPage app={dotReminderTerms} locale={(await params).locale} />;
}
