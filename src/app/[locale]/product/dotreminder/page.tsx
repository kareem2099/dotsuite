import MobileProduct, { mobileProductMetadata } from "@/components/mobile/MobileProduct";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return mobileProductMetadata("dotreminder", (await params).locale);
}

export default async function Page({ params }: Props) {
  return <MobileProduct appId="dotreminder" locale={(await params).locale} />;
}
