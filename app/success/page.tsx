'use client';
import { Suspense } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function SuccessContent() {
  const [user,        setUser]        = useState<any>(null);
  const [plan,        setPlan]        = useState<string | null>(null);
  const [lastScanId,  setLastScanId]  = useState<string | null>(null);
  const [polling,     setPolling]     = useState(true);
  const searchParams  = useSearchParams();
  const urlPlan       = searchParams.get('plan') || 'basic';
  const isLifetime    = urlPlan === 'lifetime';
  const pollRef       = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) { setPolling(false); return; }

      // Get last scan
      const { data: scans } = await supabase
        .from('analyses')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (scans && scans.length > 0) setLastScanId(scans[0].id);

      // Poll for plan update
      let attempts = 0;
      pollRef.current = setInterval(async () => {
        attempts++;
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single();
        if (profile && profile.plan !== 'free') {
          setPlan(profile.plan);
          setPolling(false);
          if (pollRef.current) clearInterval(pollRef.current);
        }
        if (attempts >= 15) {
          setPolling(false);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      }, 2000);
    })();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const displayPlan = plan || urlPlan;
  const isLifetimeDisplay = displayPlan === 'lifetime';

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

      <div className={`rounded-[28px] border p-8 shadow-[0_0_80px_rgba(168,85,247,0.12)] ${isLifetimeDisplay ? 'border-amber-400/30 bg-gradient-to-b from-[#1A1200] to-[#0D0F14]' : 'border-[#22C55E]/25 bg-[#0D0F14]'}`}>

        {isLifetimeDisplay ? (
          <>
            <div className="text-5xl mb-4">👑</div>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 rounded-full px-4 py-1.5 mb-4">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Lifetime Member</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              You own SavFlix.<br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Forever.</span>
            </h1>
            <p className="text-white/50 text-sm mb-6">No renewals. No monthly bills. Full access to every feature, every update, for life.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome to SavFlix Basic.
            </h1>
            <p className="text-white/50 text-sm mb-6">Your Basic plan is active. Unlimited scans and full access to all savings features.</p>
          </>
        )}

        <div className={`rounded-[20px] p-5 mb-6 text-left ${isLifetimeDisplay ? 'bg-amber-400/5 border border-amber-400/15' : 'bg-white/[0.03]'}`}>
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4">
            {isLifetimeDisplay ? "What you own forever" : "What's included"}
          </p>
          <div className="space-y-2.5">
            {(isLifetimeDisplay ? [
              "Unlimited streaming scans — forever",
              "Full keep/cut recommendations",
              "AI-powered binge-and-cancel timing",
              "Cancel date reminders via email",
              "Free alternatives detection",
              "Monthly re-scans — automatic",
              "Every future feature we build",
              "No recurring fees — ever",
            ] : [
              "Unlimited streaming scans",
              "Full keep/cut recommendations",
              "Binge-and-cancel timing plans",
              "Cancel date reminders via email",
              "Free alternatives detection",
              "Monthly re-scans",
              "Cancel anytime from your account",
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-sm flex-shrink-0 ${isLifetimeDisplay ? 'text-amber-400' : 'text-[#22C55E]'}`}>✓</span>
                <span className="text-sm text-white/60">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan activation status */}
        {polling && user && (
          <div className="flex items-center justify-center gap-2 mb-4 text-white/40 text-sm">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            Activating your plan...
          </div>
        )}

        {!polling && plan && (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-2xl px-4 py-2.5 mb-4">
            <div className="text-[#22C55E] text-sm font-medium">✓ Plan activated — you're all set!</div>
          </div>
        )}

        {user ? (
          <div className="flex flex-col gap-3">
            {lastScanId && (
              <Link href="/analyze"
                className={`block rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] bg-gradient-to-r from-[#22C55E] to-[#A855F7] shadow-[0_12px_40px_rgba(168,85,247,0.24)]`}>
                Run a New Scan Now
              </Link>
            )}
            <Link href="/dashboard"
              className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-white/40 text-sm mb-2">Create your account to access your dashboard and save your results.</p>
            <Link href="/auth"
              className={`block rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] ${isLifetimeDisplay ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-[#22C55E] to-[#A855F7]'}`}>
              Create Your Account
            </Link>
            <Link href="/analyze"
              className="block rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Run a Scan Now
            </Link>
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
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.08),transparent_40%)]" />
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#22C55E]/20 border-t-[#22C55E] rounded-full animate-spin" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </main>
  );
}