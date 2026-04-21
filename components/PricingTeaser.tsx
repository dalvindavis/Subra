import Link from "next/link";

export default function PricingTeaser() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">Pricing</p>
        <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Most users save more in one scan than SavFlix costs in months.
        </h3>
        <p className="text-white/50 text-sm">Start free. Upgrade when you're ready.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {/* Free */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm font-semibold text-white/70 mb-3">Free</p>
          <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$0</p>
          <p className="text-xs text-white/30 mb-4">Forever free</p>
          <p className="text-sm text-white/50 mb-6">See waste. Run up to 3 scans per month.</p>
          <Link href="/analyze"
            className="inline-block w-full rounded-[16px] border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all">
            Start Free
          </Link>
        </div>

        {/* Basic — highlighted */}
        <div className="rounded-[28px] border border-[#A855F7]/40 bg-[#A855F7]/10 p-6 shadow-[0_20px_60px_rgba(168,85,247,0.18)] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex rounded-full border border-[#A855F7]/40 bg-[#A855F7]/20 px-3 py-1 text-xs font-semibold text-[#C084FC]">
            Most popular
          </div>
          <p className="text-sm font-semibold text-white/80 mb-3 mt-2">Basic</p>
          <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$2.99<span className="text-base font-medium text-white/40">/mo</span></p>
          <p className="text-xs text-white/30 mb-4">or $24/yr — save 33%</p>
          <p className="text-sm text-white/60 mb-6">Unlock full keep/cut recommendations, savings breakdown, and cancel date reminders.</p>
          <Link href="/analyze"
            className="inline-block w-full rounded-[16px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
            Get Basic
          </Link>
        </div>

        {/* Lifetime */}
        <div className="rounded-[28px] border border-[#22C55E]/20 bg-[#22C55E]/5 p-6">
          <div className="inline-flex rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#86EFAC] mb-3">
            Best value
          </div>
          <p className="text-sm font-semibold text-white/80 mb-3">Lifetime</p>
          <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>$39</p>
          <p className="text-xs text-white/30 mb-4">One-time payment</p>
          <p className="text-sm text-white/60 mb-6">Full access forever. No monthly fees. Best for ongoing streaming savings.</p>
          <Link href="/analyze"
            className="inline-block w-full rounded-[16px] border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-center text-sm font-semibold text-[#86EFAC] hover:bg-[#22C55E]/20 hover:scale-[1.02] transition-all">
            Get Lifetime
          </Link>
        </div>
      </div>
    </section>
  );
}