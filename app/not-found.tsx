import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#07070B] text-white flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.10),transparent_40%)]" />
      <div className="text-center max-w-md">
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

        <div className="text-6xl font-bold text-white/10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>404</div>
        <h1 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Page not found</h1>
        <p className="text-white/40 text-sm mb-8">The page you're looking for doesn't exist or has moved.</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/"
            className="rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#A855F7] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.24)] hover:scale-[1.02] transition-all">
            Go Home
          </Link>
          <Link href="/analyze"
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all">
            Run Free Scan
          </Link>
        </div>
      </div>
    </main>
  );
}