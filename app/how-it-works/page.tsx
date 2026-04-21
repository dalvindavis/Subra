import Link from "next/link";
import ResultProofCard from "@/components/ResultProofCard";
import CompareBlock from "@/components/CompareBlock";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function HowItWorksPage() {
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

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 md:px-6 md:pt-24">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">How it works</p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            How SavFlix works
          </h1>
          <p className="text-white/50 text-base leading-7 max-w-2xl">
            SavFlix analyzes your streaming subscriptions against what you actually watch and builds a smarter, cheaper plan — including free alternatives and binge-and-cancel timing.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Choose your subscriptions",
              desc: "Select the streaming services you currently pay for. We support Netflix, Hulu, Disney+, HBO Max, Apple TV+, Peacock, Paramount+, Prime Video, AMC+, Starz, Discovery+, Crunchyroll, and MGM+.",
              color: "text-[#C084FC]",
              border: "border-[#A855F7]/20",
              bg: "bg-[#A855F7]/5",
            },
            {
              step: "02",
              title: "Pick the shows you watch",
              desc: "Search for any TV show. SavFlix uses live data to find which platforms each show is on, whether it's currently airing, when the season ends, and if it's available free with ads.",
              color: "text-[#86EFAC]",
              border: "border-[#22C55E]/20",
              bg: "bg-[#22C55E]/5",
            },
            {
              step: "03",
              title: "Get your savings plan",
              desc: "SavFlix builds a complete plan: what to keep, what to cut immediately, what to binge and cancel, and which shows you can watch free. Includes exact dates and annual savings.",
              color: "text-amber-300",
              border: "border-amber-500/20",
              bg: "bg-amber-500/5",
            },
          ].map((item) => (
            <div key={item.step} className={`rounded-[24px] border ${item.border} ${item.bg} p-6`}>
              <div className={`text-sm font-semibold mb-4 ${item.color}`} style={{ fontFamily: 'var(--font-heading)' }}>{item.step}</div>
              <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              <p className="text-sm leading-6 text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">What SavFlix detects</p>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Four types of streaming waste</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: "✂️", title: "Platform overlap", desc: "You're paying for the same content on two different services. SavFlix finds the cheaper or better option and tells you which to cut." },
            { icon: "🆓", title: "Free alternatives", desc: "Many shows are available free with ads on Tubi, Pluto TV, or Roku Channel. SavFlix checks these before telling you to keep a paid subscription." },
            { icon: "⏱️", title: "Binge-and-cancel timing", desc: "Instead of keeping a subscription year-round, SavFlix tells you when to subscribe, when to binge, and exactly when to cancel." },
            { icon: "📅", title: "Season-end waste", desc: "Most people forget to cancel after a season ends and pay for 3–4 months of nothing. SavFlix sends calendar reminders so you never overpay again." },
          ].map((item, i) => (
            <div key={i} className="rounded-[24px] border border-white/[0.06] bg-white/[0.03] p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              <p className="text-sm leading-6 text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 md:px-6 mb-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#C084FC] mb-3">Example result</p>
          <h2 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>This is what a real scan looks like</h2>
        </div>
        <ResultProofCard />
      </section>

      {/* Compare */}
      <CompareBlock />

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 pb-28 md:px-6">
        <div className="rounded-[32px] border border-white/[0.06] bg-gradient-to-r from-[#0E1320] to-[#130B22] p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Ready to find your wasted streaming money?
          </h3>
          <p className="text-white/50 text-base mb-8 max-w-xl mx-auto">
            Run your free scan in under 60 seconds. No signup required.
          </p>
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