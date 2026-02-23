"use client";

import { useState } from "react";

interface Props {
  value: string;
  isEditing: boolean;
  onChange: (location: string) => void;
  placeholder?: string;
}

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function LocationPicker({ value, isEditing, onChange, placeholder }: Props) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState("");

  const handleDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "";
          const country = data.address?.country || "";
          onChange(city && country ? `${city}, ${country}` : country || city);
        } catch {
          setError("Could not fetch location name");
        }
        setIsDetecting(false);
      },
      (err) => {
        setIsDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location access denied");
        } else {
          setError("Could not get your location");
        }
      }
    );
  };

  return (
    <div>
      {isEditing ? (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder ?? "e.g. Cairo, Egypt"}
              className="flex-1 px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm focus:border-[#10b981] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleDetect}
              disabled={isDetecting}
              title="Detect my location"
              className="px-4 py-3 border border-(--card-border) rounded-lg hover:border-[#10b981] hover:text-[#10b981] transition-colors disabled:opacity-50"
            >
              {isDetecting ? (
                <div className="w-4 h-4 border-2 border-(--text-muted) border-t-transparent rounded-full animate-spin" />
              ) : (
                <LocationIcon />
              )}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400 mt-1">{error}</p>
          )}
        </>
      ) : (
        <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm">
          {value ? (
            <span className="flex items-center gap-2 text-(--text-muted)">
              <LocationIcon />
              <span className="text-(--foreground)">{value}</span>
            </span>
          ) : (
            <span className="text-(--text-muted)">Not set</span>
          )}
        </div>
      )}
    </div>
  );
}