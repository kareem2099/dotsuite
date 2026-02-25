import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Terms of <span className="text-(--primary)">Service</span>
        </h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-(--text-muted)">
              By accessing and using dotsuite, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-(--text-muted)">
              dotsuite provides developer tools and solutions including VS Code extensions, Next.js applications, and Python automation scripts. We reserve the right to modify or discontinue the service at any time.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-(--text-muted)">
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="text-(--text-muted)">
              All content, features, and functionality of dotsuite are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-(--text-muted)">
              dotsuite shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section className="bg-(--card-bg) border border-(--card-border) rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
            <p className="text-(--text-muted)">
              If you have any questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-(--primary) hover:text-(--primary-hover) transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
