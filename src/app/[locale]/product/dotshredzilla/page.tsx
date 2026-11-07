import MobileProduct, { mobileProductMetadata } from "@/components/mobile/MobileProduct";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  return mobileProductMetadata("dotshredzilla", (await params).locale);
}

export default async function Page({ params }: Props) {
  return <MobileProduct appId="dotshredzilla" locale={(await params).locale} />;
}
