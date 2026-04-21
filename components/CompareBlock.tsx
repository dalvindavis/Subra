export default function CompareBlock() {
    return (
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-[#0D0F14] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400 mb-4">Without SavFlix</p>
            <ul className="space-y-3">
              {[
                "Paying for overlapping platforms",
                "Missing cancel dates between seasons",
                "Forgetting what shows are on each service",
                "Missing free alternatives like Tubi or Pluto TV",
                "Paying full price every month with no plan",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                  <span className="text-rose-500 mt-0.5 flex-shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[28px] border border-[#22C55E]/20 bg-[#22C55E]/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#86EFAC] mb-4">With SavFlix</p>
            <ul className="space-y-3">
              {[
                "Keep only the platforms you actually need",
                "Cut what you don't watch — immediately",
                "Rotate services at the right time",
                "Find free ways to watch when available",
                "Never pay between seasons again",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="text-[#22C55E] mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }