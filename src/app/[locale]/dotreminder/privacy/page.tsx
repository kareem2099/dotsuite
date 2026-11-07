import AppPrivacy, { appPrivacyMetadata } from "@/components/privacy/AppPrivacy";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return appPrivacyMetadata("dotreminder", (await params).locale, "privacy");
}

export default async function Page({ params }: Props) {
  return <AppPrivacy app="dotreminder" locale={(await params).locale} document="privacy" />;
}
