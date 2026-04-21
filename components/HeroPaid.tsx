import Link from "next/link";

type HeroPaidProps = {
  headline: string;
  subheadline: string;
  primaryCta?: string;
  secondaryCta?: string;
};

export default function HeroPaid({
  headline,
  subheadline,
  primaryCta = "Run My Free Scan",
  secondaryCta = "See Example Results",
}: HeroPaidProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-16 md:px-6 md:pt-24">
      <div className="max-w-3xl">
        <div className="inline-flex items-center rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 px-3 py-1 text-xs font-medium text-[#C084FC] mb-5">
          Stop overpaying for streaming
        </div>
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          {headline}
        </h1>
        <p className="max-w-xl text-base leading-7 text-white/70 md:text-lg mb-8">
          {subheadline}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row mb-6">
          <Link href="/analyze"
            className="rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-4 text-center text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.28)] transition hover:scale-[1.02]">
            {primaryCta}
          </Link>
          <a href="#proof"
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-white/10">
            {secondaryCta}
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
          <span>No signup required</span>
          <span>•</span>
          <span>Takes less than 60 seconds</span>
          <span>•</span>
          <span>Most users save $30–$100/mo</span>
        </div>
      </div>
    </section>
  );
}