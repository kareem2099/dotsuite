"use client";

import Image from "next/image";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { container: "w-9 h-9", text: "text-sm", border: "border-2", px: "36px" },
  md: { container: "w-16 h-16", text: "text-xl", border: "border-2", px: "64px" },
  lg: { container: "w-20 h-20", text: "text-2xl", border: "border-4", px: "80px" },
};

export function UserAvatarSkeleton({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeConfig = sizes[size];
  return (
    <div className={`${sizeConfig.container} rounded-full bg-(--card-border) animate-pulse shrink-0`} />
  );
}

export default function UserAvatar({ src, name, size = "md", className = "" }: UserAvatarProps) {
  const sizeConfig = sizes[size];
  const initials = name?.charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-full ${sizeConfig.container} ${sizeConfig.border} border-(--primary) hover:border-(--primary-hover) transition-colors ${className}`}
      >
        <Image
          src={src}
          alt={name || "User avatar"}
          fill
          sizes={sizeConfig.px}
          referrerPolicy="no-referrer"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeConfig.container} shrink-0 rounded-full bg-(--primary) flex items-center justify-center text-(--background) font-bold ${sizeConfig.text} ${sizeConfig.border} border-(--primary) ${className}`}
    >
      {initials}
    </div>
  );
}

