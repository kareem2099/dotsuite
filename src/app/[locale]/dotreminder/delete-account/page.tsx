import AppPrivacy, { appPrivacyMetadata } from "@/components/privacy/AppPrivacy";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return appPrivacyMetadata("dotreminder", (await params).locale, "delete-account");
}

export default async function Page({ params }: Props) {
  return <AppPrivacy app="dotreminder" locale={(await params).locale} document="delete-account" />;
}
