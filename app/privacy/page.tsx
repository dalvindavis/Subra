import Link from 'next/link';

export default function PrivacyPage() {
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

      <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Privacy Policy</h1>
      <p className="text-white/40 text-sm mb-10">Last updated: April 23, 2026</p>

      <div className="space-y-8 text-white/70 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>1. Information We Collect</h2>
          <p className="mb-2">We collect the following information when you use SavFlix:</p>
          <ul className="list-disc list-inside space-y-1 text-white/60">
            <li>Email address and name (via Google sign-in)</li>
            <li>Streaming subscriptions you enter during analysis</li>
            <li>Shows you add during analysis</li>
            <li>Scan history and savings results</li>
            <li>Payment information (processed and stored by Stripe — we never see your card details)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1 text-white/60">
            <li>To provide and improve the SavFlix service</li>
            <li>To save your scan history and show your savings dashboard</li>
            <li>To send cancel date reminders (paid plans only)</li>
            <li>To process payments and manage your subscription</li>
            <li>To communicate with you about your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>3. Data Storage</h2>
          <p>Your data is stored securely using Supabase (PostgreSQL). We use industry-standard encryption for data in transit and at rest. We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>4. Third-Party Services</h2>
          <p className="mb-2">We use the following third-party services:</p>
          <ul className="list-disc list-inside space-y-1 text-white/60">
            <li><strong className="text-white/80">Stripe</strong> — Payment processing. Subject to Stripe's privacy policy.</li>
            <li><strong className="text-white/80">Supabase</strong> — Database and authentication infrastructure.</li>
            <li><strong className="text-white/80">TMDB</strong> — Streaming platform and show data. No personal data is shared with TMDB.</li>
            <li><strong className="text-white/80">Google</strong> — OAuth sign-in. Subject to Google's privacy policy.</li>
            <li><strong className="text-white/80">Vercel</strong> — Hosting infrastructure.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>5. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days. Scan history may be retained in anonymized form for analytics purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>6. Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 text-white/60">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your data</li>
          </ul>
          <p className="mt-2">To exercise these rights, contact us at support@savflix.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>7. Cookies</h2>
          <p>SavFlix uses essential cookies for authentication and session management. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>8. Children's Privacy</h2>
          <p>SavFlix is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>9. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or a notice on the site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>10. Contact</h2>
          <p>For privacy questions or data requests, contact us at <a href="mailto:support@savflix.com" className="text-[#22C55E] hover:text-[#86EFAC] transition-colors">support@savflix.com</a></p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-white/[0.06] flex gap-6">
        <Link href="/terms" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</Link>
        <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">Back to SavFlix</Link>
      </div>
    </main>
  );
}