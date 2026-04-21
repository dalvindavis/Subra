import Link from "next/link";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const features = [
  { label: "Free scans per month",         free: "3",      basic: "Unlimited", lifetime: "Unlimited" },
  { label: "Keep/cut recommendations",     free: "✓",      basic: "✓",         lifetime: "✓"         },
  { label: "Savings breakdown",            free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Binge-and-cancel timing",      free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Free alternatives detection",  free: "✓",      basic: "✓",         lifetime: "✓"         },
  { label: "Cancel date reminders",        free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Monthly re-scans",             free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Savings dashboard",            free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Platform movement alerts",     free: "✕",      basic: "✓",         lifetime: "✓"         },
  { label: "Priority support",             free: "✕",      basic: "✕",         lifetime: "✓"         },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_40%)]" />

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
          <Link href="/analyze"
            className="rounded-[14px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.24)] transition hover:scale-[1.02]">
            Run Free Scan
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:px-6 md:pt-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">Pricing</p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Choose the plan that keeps more money in your pocket.
          </h1>
          <p className="text-white/50 text-base leading-7">
            Most users save more in their first scan than SavFlix costs in months. Start free, upgrade when you're ready.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {/* Free */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white/60 mb-3">Free</p>
            <p className="text-5xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$0</p>
            <p className="text-xs text-white/30 mb-6">Forever free — no card required</p>
            <p className="text-sm text-white/50 mb-8 leading-6">See your streaming waste. Run up to 3 free scans per month with basic keep/cut recommendations.</p>
            <Link href="/analyze"
              className="block w-full rounded-[16px] border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all">
              Start Free
            </Link>
          </div>

          {/* Basic */}
          <div className="rounded-[28px] border border-[#A855F7]/40 bg-[#A855F7]/10 p-6 shadow-[0_20px_60px_rgba(168,85,247,0.18)] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex rounded-full border border-[#A855F7]/40 bg-[#A855F7]/20 px-3 py-1 text-xs font-semibold text-[#C084FC]">
              Most popular
            </div>
            <p className="text-sm font-semibold text-white/80 mb-3 mt-2">Basic</p>
            <p className="text-5xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$2.99<span className="text-lg font-medium text-white/40">/mo</span></p>
            <p className="text-xs text-white/30 mb-6">or $24/yr — save 33%</p>
            <p className="text-sm text-white/60 mb-8 leading-6">Full savings breakdown, binge-and-cancel timing, cancel date reminders, and monthly re-scans to keep your plan optimized.</p>
            <Link href="/analyze"
              className="block w-full rounded-[16px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
              Get Basic
            </Link>
          </div>

          {/* Lifetime */}
          <div className="rounded-[28px] border border-[#22C55E]/20 bg-[#22C55E]/5 p-6">
            <div className="inline-flex rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#86EFAC] mb-3">
              Best value
            </div>
            <p className="text-sm font-semibold text-white/80 mb-3">Lifetime</p>
            <p className="text-5xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$39</p>
            <p className="text-xs text-white/30 mb-6">One-time payment — forever access</p>
            <p className="text-sm text-white/60 mb-8 leading-6">Everything in Basic, forever. No recurring fees. Pay once and never think about it again.</p>
            <Link href="/analyze"
              className="block w-full rounded-[16px] border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-center text-sm font-semibold text-[#86EFAC] hover:bg-[#22C55E]/20 hover:scale-[1.02] transition-all">
              Get Lifetime
            </Link>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="rounded-[28px] border border-white/[0.06] bg-[#0D0F14] overflow-hidden mb-16">
          <div className="grid grid-cols-4 border-b border-white/[0.06]">
            <div className="p-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Feature</div>
            <div className="p-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Free</div>
            <div className="p-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#C084FC]">Basic</div>
            <div className="p-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#86EFAC]">Lifetime</div>
          </div>
          {features.map((feature, i) => (
            <div key={i} className={`grid grid-cols-4 border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
              <div className="p-4 text-sm text-white/60">{feature.label}</div>
              <div className={`p-4 text-center text-sm ${feature.free === '✕' ? 'text-white/20' : 'text-white/60'}`}>{feature.free}</div>
              <div className={`p-4 text-center text-sm font-medium ${feature.basic === '✕' ? 'text-white/20' : 'text-[#C084FC]'}`}>{feature.basic}</div>
              <div className={`p-4 text-center text-sm font-medium ${feature.lifetime === '✕' ? 'text-white/20' : 'text-[#86EFAC]'}`}>{feature.lifetime}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-[32px] border border-white/[0.06] bg-gradient-to-r from-[#0E1320] to-[#130B22] p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Start with a free scan</h3>
          <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">No signup required. See exactly what you're wasting on streaming in under 60 seconds.</p>
          <Link href="/analyze"
            className="inline-block rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
            Run My Free Scan
          </Link>
        </div>
      </section>

      <StickyMobileCTA />
    </main>
  );
}