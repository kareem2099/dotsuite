import type { Metadata } from "next";
import AppTermsPage, { appTermsMetadata } from "@/components/terms/AppTermsPage";
import { dotShredzillaTerms } from "@/lib/dotshredzilla-terms";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return appTermsMetadata(dotShredzillaTerms, (await params).locale);
}

export default async function DotShredzillaTermsPage({ params }: Props) {
  return <AppTermsPage app={dotShredzillaTerms} locale={(await params).locale} />;
}
