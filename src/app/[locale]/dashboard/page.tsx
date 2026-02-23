"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  useEffect(() => {
    router.replace(`/${locale}/`);
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}