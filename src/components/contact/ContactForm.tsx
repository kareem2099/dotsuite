"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const t = useTranslations("Contact");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        const result = await response.json();
        setSubmitError(result.error || "Something went wrong");
      }
    } catch {
      setSubmitError("Failed to send message. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-(--success-bg) border border-(--success-border) rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-(--primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">{t("thankYou")}</h3>
        <p className="text-(--text-muted) mb-6">{t("responseTime")}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-(--primary) text-(--primary-text) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors"
        >
          {t("sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-(--card-bg) border border-(--card-border) rounded-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <div className="p-3 bg-(--danger-bg) border border-(--danger-border) rounded-lg text-(--danger) text-sm">
            {submitError}
          </div>
        )}

        {[
          { id: "name", type: "text", key: "name" },
          { id: "email", type: "email", key: "email" },
          { id: "subject", type: "text", key: "subject" },
        ].map(({ id, type, key }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-2">
              {t(key)}
            </label>
            <input
              type={type}
              id={id}
              {...register(id as keyof ContactFormData)}
              aria-describedby={errors[id as keyof ContactFormData] ? `${id}-error` : undefined}
              className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-(--primary) focus:outline-none transition-colors ${errors[id as keyof ContactFormData] ? "border-(--danger)" : "border-(--card-border)"
                }`}
              placeholder={t(`${key}Placeholder`)}
            />
            {errors[id as keyof ContactFormData] && (
              <p id={`${id}-error`} className="mt-1 text-sm text-(--danger)">
                {errors[id as keyof ContactFormData]?.message}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            {t("message")}
          </label>
          <textarea
            id="message"
            {...register("message")}
            aria-describedby={errors.message ? "message-error" : undefined}
            rows={5}
            className={`w-full px-4 py-3 bg-(--background) border rounded-lg focus:border-(--primary) focus:outline-none transition-colors resize-none ${errors.message ? "border-(--danger)" : "border-(--card-border)"
              }`}
            placeholder={t("messagePlaceholder")}
          />
          {errors.message && (
            <p id="message-error" className="mt-1 text-sm text-(--danger)">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-(--primary) text-(--primary-text) font-semibold rounded-lg hover:bg-(--primary-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-(--primary-text) border-t-transparent rounded-full animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("send")
          )}
        </button>
      </form>
    </div>
  );
}