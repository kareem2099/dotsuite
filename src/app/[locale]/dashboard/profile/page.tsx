"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import SocialLinks from "@/components/SocialLinks";
import LocationPicker from "@/components/LocationPicker";
import ProfileSkeleton from "@/components/skeletons/ProfileSkeleton";
import UserAvatar from "@/components/UserAvatar";
import { useToast } from "@/components/Toast";
import { useRef } from "react";
import { Camera, Loader2 } from "lucide-react";


export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const t = useTranslations("Profile");
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const [form, setForm] = useState({
    displayName: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    github: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          setForm({
            displayName: data.name ?? "",
            bio: data.bio ?? "",
            location: data.location ?? "",
            website: data.website ?? "",
            twitter: data.twitter ?? "",
            github: data.github ?? "",
          });
        });
    }
  }, [status, router]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to save profile");
        setIsSaving(false);
        return;
      }

      setIsEditing(false);
      toast.success(t("profileSaved"));

      await update({
        ...session,
        user: { ...session?.user, name: form.displayName },
      });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to upload avatar");
        return;
      }

      toast.success("Avatar updated successfully");
      
      // Update session with new image
      await update({
        ...session,
        user: { ...session?.user, image: data.imageUrl },
      });
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };


  if (status === "loading") {
    return <ProfileSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">
          {t("myProfile")}
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-(--card-border) rounded-lg text-sm hover:border-(--primary) hover:text-(--primary) transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t("editProfile")}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-(--card-border)ded-lg text-sm text-(--text-muted) hover:border-red-500 hover:text-red-400 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-(--background) font-semibold rounded-lg text-sm hover:bg-(--primary-hover) transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-(--background) border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {isSaving ? t("saving") : t("saveChanges")}
            </button>
          </div>
        )}
      </div>

      {/* Avatar + Basic Info */}
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <UserAvatar
              src={session?.user?.image}
              name={session?.user?.name}
              size="lg"
              className={isUploadingAvatar ? "opacity-50" : "group-hover:opacity-75 transition-opacity"}
            />
            
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
            <p className="text-(--text-muted) mt-1">{session?.user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs bg-(--primary)/10 text-(--primary) border border-(--primary)/20 rounded-full">
              {t("active")}
            </span>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl mb-6">
        <h3 className="text-lg font-semibold mb-6">{t("accountInfo")}</h3>
        <div className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-sm text-(--text-muted) mb-1">{t("displayName")}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm focus:border-(--primary) focus:outline-none transition-colors"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm">
                {form.displayName || "—"}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm text-(--text-muted) mb-1">{t("bio")}</label>
            {isEditing ? (
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder={t("bioPlaceholder")}
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm focus:border-(--primary) focus:outline-none transition-colors resize-none"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm min-h-20">
                {form.bio || <span className="text-(--text-muted)">{t("noBio")}</span>}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm text-(--text-muted) mb-1">{t("location")}</label>
            <LocationPicker
              value={form.location}
              isEditing={isEditing}
              onChange={(value) => setForm({ ...form, location: value })}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm text-(--text-muted) mb-1">{t("website")}</label>
            {isEditing ? (
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm focus:border-(--primary) focus:outline-none transition-colors"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm">
                {form.website ? (
                  <a href={form.website} target="_blank" className="text-(--primary) hover:underline">
                    {form.website}
                  </a>
                ) : (
                  <span className="text-(--text-muted)">{t("notSet")}</span>
                )}
              </div>
            )}
          </div>

          {/* Email - always readonly */}
          <div>
            <label className="block text-sm text-(--text-muted) mb-1">{t("email")}</label>
            <div className="w-full px-4 py-3 bg-(--background) border border-(--card-border) rounded-lg text-sm text-(--text-muted) flex items-center justify-between">
              {session?.user?.email}
              <span className="text-xs px-2 py-0.5 bg-(--card-border) rounded-full">{t("readOnly")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <SocialLinks
        twitter={form.twitter}
        github={form.github}
        isEditing={isEditing}
        onChange={(key, value) => setForm({ ...form, [key]: value })}
      />

      {/* Danger Zone */}
      <div className="p-8 bg-(--card-bg) border border-(--danger-border) rounded-xl">
        <h3 className="text-lg font-semibold mb-2 text-red-400">{t("dangerZone")}</h3>
        <p className="text-(--text-muted) text-sm mb-4">
          {t("dangerZoneDesc")}
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-(--danger-bg) transition-colors">
          {t("deleteAccount")}
        </button>
      </div>
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
