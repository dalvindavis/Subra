'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const [user,    setUser]    = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [scans,   setScans]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth'); return; }
      setUser(user);

      const [{ data: profileData }, { data: scanData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('analyses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
      ]);

      setProfile(profileData);
      setScans(scanData || []);
      setLoading(false);
    })();
  }, [router]);

  const handleSignOut = async () => { await supabase.auth.signOut(); router.push('/'); };

  if (loading) return (
    <main className="min-h-screen bg-[#07070B] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#A855F7]/20 border-t-[#A855F7] rounded-full animate-spin" />
    </main>
  );

  const latestScan      = scans[0];
  const totalSavings    = scans.reduce((sum, s) => sum + (s.yearly_savings || 0), 0);
  const totalMonthlySaved = scans.reduce((sum, s) => sum + (s.monthly_savings || 0), 0);
  const platformsCut    = latestScan?.results?.platformGroups?.filter((g: any) => g.decision === 'cut').length || 0;
  const freeAlts        = latestScan?.results?.freeShows?.length || 0;

  const planLabel = profile?.plan === 'lifetime' ? 'Lifetime' : profile?.plan === 'basic' ? 'Basic' : 'Free';
  const planColor = profile?.plan === 'lifetime' ? 'text-[#86EFAC]' : profile?.plan === 'basic' ? 'text-[#C084FC]' : 'text-white/40';

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
          <div className="flex items-center gap-3">
            {user?.user_metadata?.avatar_url && <img src={user.user_metadata.avatar_url} alt="avatar" className="w-7 h-7 rounded-full" />}
            <span className="text-sm text-white/40 hidden sm:block">{user?.user_metadata?.full_name || user?.email}</span>
            <Link href="/profile" className="text-xs text-white/30 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors">Profile</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-white/40 text-sm">Here's your current streaming savings snapshot.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total yearly savings",      value: `$${totalSavings.toFixed(2)}`,        color: "text-[#22C55E]" },
            { label: "Platforms to cut",           value: platformsCut.toString(),               color: "text-rose-400"  },
            { label: "Free alternatives found",    value: freeAlts.toString(),                   color: "text-amber-400" },
            { label: "Scans completed",            value: scans.length.toString(),               color: "text-[#C084FC]" },
          ].map((stat, i) => (
            <div key={i} className="rounded-[20px] border border-white/[0.06] bg-[#0D0F14] p-5">
              <div className={`text-2xl font-bold mb-1 ${stat.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
              <div className="text-xs text-white/30">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Latest scan results */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Latest Scan Results</h2>
            {latestScan ? (
              <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-white/30 mb-1">{new Date(latestScan.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div className="text-xl font-bold text-[#22C55E]" style={{ fontFamily: 'var(--font-heading)' }}>${latestScan.yearly_savings?.toFixed(2)}/yr saved</div>
                  </div>
                  <Link href="/analyze" className="text-xs text-[#C084FC] hover:text-white border border-[#A855F7]/25 rounded-lg px-3 py-1.5 transition-colors">New Scan</Link>
                </div>

                {/* Platform groups from latest scan */}
                <div className="space-y-2">
                  {latestScan.results?.platformGroups?.slice(0, 5).map((group: any, i: number) => {
                    const colors: Record<string, string> = {
                      keep: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
                      'keep-for-browsing': 'border-blue-500/20 bg-blue-500/5 text-blue-400',
                      'binge-and-cancel': 'border-amber-500/20 bg-amber-500/5 text-amber-400',
                      cut: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
                    };
                    const labels: Record<string, string> = { keep: '✅ Keep', 'keep-for-browsing': '📺 Keep for Browsing', 'binge-and-cancel': '⏱️ Binge & Cancel', cut: '✂️ Cut' };
                    const cls = colors[group.decision] || colors.cut;
                    return (
                      <div key={i} className={`flex items-center justify-between rounded-xl border p-3 ${cls.split(' ').slice(0, 2).join(' ')}`}>
                        <span className="text-sm font-medium text-white">{group.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cls.split(' ').slice(2).join(' ')}`}>{labels[group.decision]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-8 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-white/40 text-sm mb-4">No scans yet. Run your first analysis to see your savings.</p>
                <Link href="/analyze"
                  className="inline-block rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-3 text-sm font-semibold text-white hover:scale-[1.02] transition-all">
                  Run First Scan
                </Link>
              </div>
            )}

            {/* Scan history */}
            {scans.length > 1 && (
              <div>
                <h3 className="text-sm font-semibold text-white/40 mb-3 uppercase tracking-[0.15em]">Scan History</h3>
                <div className="space-y-2">
                  {scans.slice(1).map((scan, i) => (
                    <div key={i} className="flex items-center justify-between rounded-[16px] border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                      <span className="text-xs text-white/30">{new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-sm font-medium text-[#22C55E]">${scan.yearly_savings?.toFixed(2)}/yr</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Plan card */}
            <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-5">
              <h3 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-[0.15em]">Your Plan</h3>
              <div className={`text-2xl font-bold mb-1 ${planColor}`} style={{ fontFamily: 'var(--font-heading)' }}>{planLabel}</div>
              {profile?.plan === 'free' && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-white/30">Upgrade to unlock unlimited scans and full recommendations.</p>
                  <Link href="/pricing"
                    className="block rounded-[14px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-2.5 text-center text-xs font-semibold text-white hover:scale-[1.02] transition-all">
                    Upgrade Now
                  </Link>
                </div>
              )}
              {profile?.plan === 'basic' && (
                <div className="mt-4">
                  <p className="text-xs text-white/30 mb-3">Upgrade to Lifetime and never pay again.</p>
                  <Link href="/pricing"
                    className="block rounded-[14px] border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-2.5 text-center text-xs font-semibold text-[#86EFAC] hover:bg-[#22C55E]/20 transition-all">
                    Get Lifetime — $39
                  </Link>
                </div>
              )}
              {profile?.plan === 'lifetime' && (
                <p className="text-xs text-white/30 mt-2">Full access forever. No renewals needed.</p>
              )}
            </div>

            {/* Quick actions */}
            <div className="rounded-[24px] border border-white/[0.06] bg-[#0D0F14] p-5">
              <h3 className="text-sm font-semibold text-white/40 mb-4 uppercase tracking-[0.15em]">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/analyze"
                  className="flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-all group">
                  <span className="text-lg">🔍</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Run New Scan</span>
                </Link>
                <Link href="/profile"
                  className="flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-all group">
                  <span className="text-lg">👤</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">View Profile</span>
                </Link>
                <Link href="/how-it-works"
                  className="flex items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-all group">
                  <span className="text-lg">📖</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">How It Works</span>
                </Link>
                <button onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-[14px] border border-white/[0.06] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-all group">
                  <span className="text-lg">👋</span>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}