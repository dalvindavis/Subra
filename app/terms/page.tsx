import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white px-6 py-16 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="mb-10">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22C55E] via-emerald-400 to-[#A855F7] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Sav<span className="bg-gradient-to-r from-[#22C55E] to-[#A855F7] bg-clip-text text-transparent">Flix</span>
          </span>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Terms of Service</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: April 23, 2026</p>

      <div className="space-y-8 text-white/70 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using SavFlix ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>2. Description of Service</h2>
          <p>SavFlix is a streaming subscription optimization tool that analyzes your streaming subscriptions and provides recommendations on which platforms to keep, cancel, or binge-watch before canceling. The Service uses data from TMDB and other sources to provide these recommendations.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>3. User Accounts</h2>
          <p>You may create an account using Google OAuth. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>4. Subscription Plans and Billing</h2>
          <p className="mb-2">SavFlix offers the following plans:</p>
          <ul className="list-disc list-inside space-y-1 text-white/60 mb-3">
            <li>Free — 3 scans per month, basic results</li>
            <li>Basic — $2.99/month, unlimited scans, full recommendations</li>
            <li>Lifetime — $39 one-time payment, full access forever</li>
          </ul>
          <p>Payments are processed by Stripe. Basic subscriptions renew monthly and can be canceled at any time through your profile page. Lifetime purchases are non-refundable after 7 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>5. Accuracy of Recommendations</h2>
          <p>SavFlix provides recommendations based on available data. Streaming platform availability, pricing, and content libraries change frequently. We do not guarantee the accuracy of any recommendations. Always verify platform availability before making subscription decisions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>6. Intellectual Property</h2>
          <p>All content, features, and functionality of SavFlix are owned by SavFlix and are protected by copyright and other intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>7. Limitation of Liability</h2>
          <p>SavFlix is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service, including but not limited to financial losses resulting from subscription decisions made based on our recommendations.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>8. Termination</h2>
          <p>We reserve the right to terminate or suspend your account at any time for violations of these terms. You may delete your account at any time by contacting support@savflix.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>9. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>10. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:support@savflix.com" className="text-[#22C55E] hover:text-[#86EFAC] transition-colors">support@savflix.com</a></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex gap-6">
        <Link href="/privacy" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</Link>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">Back to SavFlix</Link>
      </div>
    </main>
  );
}