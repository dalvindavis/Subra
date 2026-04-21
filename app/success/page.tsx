'use client';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function SuccessContent() {
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    })();
  }, []);

  const isLifetime = plan === 'lifetime';

  return (
    <div className="w-full max-w-lg text-center">
      <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#22C55E] via-emerald-400 to-[#A855F7] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Sav<span className="bg-gradient-to-r from-[#22C55E] to-[#A855F7] bg-clip-text text-transparent">Flix</span>
        </span>
      </Link>

      <div className="rounded-[28px] border border-[#22C55E]/25 bg-[#0D0F14] p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)]">
        <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {isLifetime ? "You're set for life." : "Welcome to SavFlix Basic."}
        </h1>
        <p className="text-white/50 text-sm mb-6">
          {isLifetime
            ? "Your Lifetime plan is active. You now have unlimited scans and full access forever."
            : "Your Basic plan is active. You now have unlimited scans and full access to all savings features."}
        </p>

        <div className="bg-white/[0.03] rounded-[20px] p-5 mb-6 text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">What's included</p>
          <div className="space-y-2.5">
            {[
              "Unlimited streaming scans",
              "Full keep/cut recommendations",
              "Binge-and-cancel timing plans",
              "Cancel date reminders via email",
              "Free alternatives detection",
              "Monthly re-scans to catch price changes",
              isLifetime ? "Lifetime access — no recurring fees" : "Cancel anytime from your account",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#22C55E] text-sm flex-shrink-0">✓</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {user ? (
          <div className="flex flex-col gap-3">
            <Link href="/dashboard"
              className="block rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
              Go to Dashboard
            </Link>
            <Link href="/analyze"
              className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Run Another Scan
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-white/40 text-sm mb-4">Create your account to access your dashboard and save your scans.</p>
            <div className="flex flex-col gap-3">
              <Link href="/auth"
                className="block rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
                Create Your Account
              </Link>
              <Link href="/analyze"
                className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                Run Another Scan
              </Link>
            </div>
          </div>
        )}
      </div>

      <p className="text-white/20 text-xs mt-6">
        Questions? Email us at support@savflix.com
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_40%)]" />
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin" />
          <div className="text-white/30 text-sm">Loading...</div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}