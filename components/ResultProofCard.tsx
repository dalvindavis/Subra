type ResultProofCardProps = {
    yearlySavings?: string;
    keep?: string;
    cut?: string;
    freeAlternative?: string;
    bingePlan?: string;
  };
  
  export default function ResultProofCard({
    yearlySavings = "$611.40/year saved",
    keep = "Hulu",
    cut = "Netflix, Disney+, Apple TV+, HBO Max, MGM+",
    freeAlternative = "Sanctuary available free on Tubi",
    bingePlan = "Keep for this month. Cancel after season ends.",
  }: ResultProofCardProps) {
    return (
      <div id="proof" className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-[#22C55E]/10 to-[#A855F7]/20 blur-2xl" />
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0D0F14] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/30 mb-2">Example result</p>
              <h2 className="text-3xl font-bold text-[#22C55E]" style={{ fontFamily: 'var(--font-heading)' }}>{yearlySavings}</h2>
            </div>
            <div className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#86EFAC]">
              Live savings logic
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-emerald-500/20 bg-emerald-500/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">What to keep</p>
              <p className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{keep}</p>
              <p className="mt-1 text-sm text-white/50">Best value for the shows you selected.</p>
            </div>
            <div className="rounded-[20px] border border-rose-500/20 bg-rose-500/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-300 mb-2">What to cut</p>
              <p className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{cut}</p>
              <p className="mt-1 text-sm text-white/50">Paying for overlap and titles you're not watching.</p>
            </div>
            <div className="rounded-[20px] border border-amber-400/20 bg-amber-400/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">Free alternative found</p>
              <p className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{freeAlternative}</p>
              <p className="mt-1 text-sm text-white/50">Available free with ads — no subscription needed.</p>
            </div>
            <div className="rounded-[20px] border border-[#A855F7]/20 bg-[#A855F7]/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-2">Binge-and-cancel plan</p>
              <p className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{bingePlan}</p>
              <p className="mt-1 text-sm text-white/50">Never pay between seasons again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }