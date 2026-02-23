import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Privacy <span className="text-[#10b981]">Policy</span>
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-(--text-muted)">
              We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This may include your name, email address, and any other information you choose to provide.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-(--text-muted)">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you about updates and new features, and to protect our rights and the rights of users.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-(--text-muted)">
              We do not share your personal information with third parties except as described in this policy. We may share information with service providers who assist us in operating our platform.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-(--text-muted)">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-(--text-muted)">
              You have the right to access, update, or delete your personal information at any time. You can manage your account settings or contact us for assistance.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-(--text-muted)">
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#10b981] hover:text-[#059669] transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
