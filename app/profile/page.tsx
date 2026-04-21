'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [user,    setUser]    = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(data);
      setLoading(false);
    })();
  }, [router]);

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  const handleManageBilling = async () => {
    try {
      const res  = await fetch('/api/create-portal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: user.id }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('Something went wrong. Please try again.'); }
  };

  if (loading) return (
    <main className="min-h-screen bg-[#07070B] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#A855F7]/20 border-t-[#A855F7] rounded-full animate-spin" />
    </main>
  );

  const planLabel = profile?.plan === 'lifetime' ? 'Lifetime' : profile?.plan === 'basic' ? 'Basic' : 'Free';
  const planColor = profile?.plan === 'lifetime' ? 'text-[#86EFAC] border-[#22C55E]/30 bg-[#22C55E]/10' : profile?.plan === 'basic' ? 'text-[#C084FC] border-[#A855F7]/30 bg-[#A855F7]/10' : 'text-white/40 border-white/10 bg-white/5';

  return (
    <main className="min-h-screen bg-[#07070B] text-white" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.08),transparent_40%)]" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] via-emerald-400 to-[#A855F7]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Sav<span className="bg-gradient-to-r from-[#22C55E] to-[#A855F7] bg-clip-text text-transparent">Flix</span>
            </span>
          </Link>
          <Link href="/dashboard" className="text-xs text-white/30 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors">← Dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold text-white mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Profile</h1>

        {/* Account */}
        <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-6 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-5">Account</h2>
          <div className="flex items-center gap-4 mb-5">
            {user?.user_metadata?.avatar_url
              ? <img src={user.user_metadata.avatar_url} alt="avatar" className="w-14 h-14 rounded-full" />
              : <div className="w-14 h-14 rounded-full bg-[#A855F7]/20 flex items-center justify-center text-xl">👤</div>
            }
            <div>
              <div className="text-white font-semibold">{user?.user_metadata?.full_name || 'User'}</div>
              <div className="text-white/40 text-sm">{user?.email}</div>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-[16px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <span className="text-sm text-white/50">Current plan</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${planColor}`}>{planLabel}</span>
          </div>
        </div>

        {/* Billing */}
        <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-6 mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-5">Billing</h2>
          {profile?.plan === 'free' ? (
            <div>
              <p className="text-white/40 text-sm mb-4">You're on the free plan. Upgrade to unlock unlimited scans and full recommendations.</p>
              <div className="flex flex-col gap-2">
                <Link href="/pricing"
                  className="block rounded-[16px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02] transition-all">
                  View Pricing Plans
                </Link>
              </div>
            </div>
          ) : profile?.plan === 'lifetime' ? (
            <div className="rounded-[16px] border border-[#22C55E]/20 bg-[#22C55E]/5 px-4 py-3">
              <p className="text-sm text-[#86EFAC] font-medium">Lifetime access — no recurring charges</p>
              <p className="text-xs text-white/30 mt-1">You paid once. You're set forever.</p>
            </div>
          ) : (
            <div>
              <div className="rounded-[16px] border border-[#A855F7]/20 bg-[#A855F7]/5 px-4 py-3 mb-4">
                <p className="text-sm text-[#C084FC] font-medium">Basic plan — $2.99/mo</p>
                <p className="text-xs text-white/30 mt-1">Renews monthly. Cancel anytime.</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={handleManageBilling}
                  className="block rounded-[16px] border border-white/15 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all">
                  Manage Billing
                </button>
                <Link href="/pricing"
                  className="block rounded-[16px] border border-[#22C55E]/25 bg-[#22C55E]/5 px-4 py-3 text-center text-sm font-semibold text-[#86EFAC] hover:bg-[#22C55E]/10 transition-all">
                  Upgrade to Lifetime — $39
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="rounded-[24px] border border-rose-500/15 bg-rose-500/[0.03] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400/60 mb-5">Account Actions</h2>
          <div className="space-y-2">
            <button onClick={handleSignOut}
              className="w-full rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-white/50 hover:bg-white/[0.06] hover:text-white transition-all">
              Sign out
            </button>
            <button
              className="w-full rounded-[16px] border border-rose-500/20 bg-rose-500/[0.04] px-4 py-3 text-left text-sm text-rose-400/60 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
              onClick={() => { if (confirm('Are you sure you want to delete your account? This cannot be undone.')) { alert('Please contact support@savflix.com to delete your account.'); } }}>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}