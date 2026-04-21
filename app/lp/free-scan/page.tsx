import Link from "next/link";
import HeroPaid from "@/components/HeroPaid";
import ResultProofCard from "@/components/ResultProofCard";
import CompareBlock from "@/components/CompareBlock";
import PricingTeaser from "@/components/PricingTeaser";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function FreeScanLandingPage() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_30%)]" />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#07070B]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E] via-emerald-400 to-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-heading)' }}>
              Sav<span className="bg-gradient-to-r from-[#22C55E] to-[#A855F7] bg-clip-text text-transparent">Flix</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/50 md:flex">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#proof" className="hover:text-white transition-colors">Results</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <Link href="/analyze"
            className="rounded-[14px] bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(168,85,247,0.24)] transition hover:scale-[1.02]">
            Run Free Scan
          </Link>
        </div>
      </header>

      {/* Hero */}
      <HeroPaid
        headline="Find wasted streaming money in under 60 seconds."
        subheadline="SavFlix shows which subscriptions to keep, cut, rotate, or replace with free alternatives — based on what you actually watch."
      />

      {/* Proof card */}
      <section className="pb-16">
        <ResultProofCard />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">How it works</p>
          <h3 className="text-3xl font-bold tracking-tight text-white md:text-4xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Three steps. Clear decisions. Real savings.
          </h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "01", title: "Choose your subscriptions", desc: "Select the streaming services you currently pay for. We support all 13 major platforms." },
            { step: "02", title: "Pick the shows you actually watch", desc: "SavFlix maps your viewing habits against platform overlap and free alternatives." },
            { step: "03", title: "Get your keep/cut plan", desc: "See exactly what to keep, what to cancel, and how much you save — monthly and yearly." },
          ].map((item) => (
            <div key={item.step} className="rounded-[24px] border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-xl">
              <div className="text-sm font-semibold text-[#C084FC] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>{item.step}</div>
              <h4 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
              <p className="text-sm leading-6 text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Compare */}
      <CompareBlock />

      {/* Pricing */}
      <PricingTeaser />

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-6">
        <div className="rounded-[32px] border border-white/[0.06] bg-gradient-to-r from-[#0E1320] to-[#130B22] p-8 md:p-12">
          <div className="max-w-2xl">
            <h4 className="text-3xl font-bold tracking-tight text-white md:text-4xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Stop paying for streaming you don't need.
            </h4>
            <p className="text-base leading-7 text-white/50 mb-8">
              Run your free scan, see the waste, and get a clearer streaming plan built around what you actually watch. No signup required.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/analyze"
                className="rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-4 text-center text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
                Run My Free Scan
              </Link>
              <a href="#proof"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-white/10 transition-all">
                See Example Results
              </a>
            </div>
          </div>
        </div>
      </section>

      <StickyMobileCTA />
    </main>
  );
}