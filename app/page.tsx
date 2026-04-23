"use client";
import { useState, useEffect, useRef } from "react";

const PLATFORMS = [
  { name: "Netflix",      key: "netflix",        logo: "https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg" },
  { name: "Hulu",         key: "hulu",           logo: "https://image.tmdb.org/t/p/w92/giwM8XX4V2AQb9vsoN7yti82tKK.jpg" },
  { name: "Disney+",      key: "disney-plus",    logo: "https://image.tmdb.org/t/p/w92/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg" },
  { name: "HBO Max",      key: "hbo-max",        logo: "https://image.tmdb.org/t/p/w92/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg" },
  { name: "Prime Video",  key: "prime-video",    logo: "https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2WA.jpg" },
  { name: "Apple TV+",    key: "apple-tv",       logo: "https://image.tmdb.org/t/p/w92/6uhKBfmtzFqOcLousHwZuzcrScK.jpg" },
  { name: "Peacock",      key: "peacock",        logo: "https://image.tmdb.org/t/p/w92/xTHltMrZPAJFLQ6qyCBjAnXSmZt.jpg" },
  { name: "Paramount+",   key: "paramount-plus", logo: "https://image.tmdb.org/t/p/w92/xbhHHa1YObwAn9IG6UvAsKPMF3Z.jpg" },
  { name: "Crunchyroll",  key: "crunchyroll",    logo: "https://image.tmdb.org/t/p/w92/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg" },
  { name: "AMC+",         key: "amc-plus",       logo: "https://image.tmdb.org/t/p/w92/xlonQMSmhtA2HHwK3JKF9ghx7M8.jpg" },
  { name: "Starz",        key: "starz",          logo: "https://image.tmdb.org/t/p/w92/eWp5LdR4p4Foyl1Ysb2UT3p3wiw.jpg" },
  { name: "Discovery+",   key: "discovery-plus", logo: "https://image.tmdb.org/t/p/w92/1w84RPTHBMFJ0NzgMJHGZD0alLb.jpg" },
  { name: "MGM+",         key: "mgm-plus",       logo: "https://image.tmdb.org/t/p/w92/2YOk2ST0zdUwbVbJIm1bh9O7cDn.jpg" },
];

const Icons = {
  route:    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="5" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 12h4m4 0h2" strokeLinecap="round" /></svg>),
  calendar: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" /></svg>),
  free:     (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>),
  binge:    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></svg>),
  browse:   (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /></svg>),
  data:     (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6"><path d="M18 20V10M12 20V4M6 20v-6" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

function Counter({ target, prefix = "", suffix = "", decimals = 0 }: { target: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);
  return <span ref={ref}>{prefix}{decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [platformLogos, setPlatformLogos] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/tmdb?logos=true');
        const data = await res.json();
        if (data.logos) setPlatformLogos(data.logos);
      } catch (e) {
        console.error('Failed to fetch logos:', e);
      }
    })();
  }, []);

  if (!mounted) return null;

  return (
    <main className="grain min-h-screen bg-[#07060b] text-white overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] left-[40%] w-[900px] h-[700px] bg-purple-600/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-[55%] left-[-15%] w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[130px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 via-emerald-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[17px] font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Sav<span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Flix</span>
          </span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-gray-500 hover:text-white transition-colors duration-300 hidden md:block">How It Works</a>
          <a href="#features" className="text-sm text-gray-500 hover:text-white transition-colors duration-300 hidden md:block">Features</a>
          <a href="#pricing" className="text-sm text-gray-500 hover:text-white transition-colors duration-300 hidden md:block">Pricing</a>
          <a href="/analyze" className="text-sm bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.08] px-5 py-2.5 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-20 md:pt-28 pb-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-purple-300 text-sm font-medium backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Analyzes 26,000+ titles across 13 platforms
        </div>
        <h1 className="text-[2.75rem] sm:text-5xl md:text-[4rem] lg:text-7xl font-bold leading-[1.08] tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          You're wasting money<br />on streaming.<br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            SavFlix finds it instantly.
          </span>
        </h1>
        <div className="mt-7 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Tell us your subscriptions and what you watch. We'll show you exactly which platforms to keep, which to cancel, and when.
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/analyze" className="group relative bg-gradient-to-r from-green-600 to-purple-600 px-9 py-4 rounded-2xl font-semibold text-white text-lg shadow-xl shadow-purple-600/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Scan My Subscriptions Free
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a href="#how-it-works" className="border border-white/[0.1] px-9 py-4 rounded-2xl font-medium text-gray-300 hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300 text-lg backdrop-blur-sm">
            See How It Works
          </a>
        </div>
      </section>

      {/* Platform logos */}
      <section className="relative z-10 px-6 pt-14 pb-6 max-w-4xl mx-auto">
        <div className="text-center text-gray-600 text-[11px] uppercase tracking-[0.25em] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          Works with your streaming platforms
        </div>
        <div className="flex justify-center items-center gap-3 md:gap-4 flex-wrap">
          {PLATFORMS.map((p, i) => {
            const logoUrl = platformLogos[p.key] || p.logo;
            return (
              <img key={p.name} src={logoUrl} alt={p.name} title={p.name}
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-cover opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            );
          })}
        </div>
      </section>

      {/* Product mockup */}
      <section className="relative z-10 px-6 py-12 max-w-4xl mx-auto">
        <div className="mockup-perspective">
          <div className="mockup-tilt">
            <div className="p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/30 via-white/[0.06] to-transparent shadow-2xl" style={{ boxShadow: 'var(--purple-glow)' }}>
              <div className="bg-[#0c0b12]/95 rounded-2xl p-5 md:p-8 backdrop-blur-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <div className="ml-4 flex-1 h-6 bg-white/[0.04] rounded-md flex items-center px-3">
                    <span className="text-[10px] text-gray-600">savflix.com/analyze</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-600/[0.12] to-indigo-500/[0.05] border border-purple-500/20 rounded-xl p-5 mb-5">
                  <div className="text-purple-300/80 text-xs font-medium mb-3 uppercase tracking-wider" style={{ fontFamily: 'var(--font-heading)' }}>Your Optimized Plan</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Prime Video", "HBO Max", "Apple TV+"].map((name) => (
                      <span key={name} className="px-3 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/[0.08] border border-white/[0.08]">{name}</span>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-gray-600 line-through text-sm">$78.92/mo</span>
                    <span className="text-3xl font-bold text-green-400" style={{ fontFamily: 'var(--font-heading)' }}>$31.97/mo</span>
                  </div>
                  <span className="text-gray-500 text-xs mt-2 block">
                    Save <span className="text-white/80 font-medium">$46.95/mo</span> — that is <span className="text-white/80 font-medium">$563.40</span> saved per year
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-green-500/25 bg-green-500/[0.04] rounded-xl p-4 hover:border-green-500/40 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Prime Video</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 font-medium">Keep</span>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-relaxed block">FROM airing — cancel Jun 28</span>
                    <span className="text-[10px] text-purple-400 mt-1 block">Routes here, saves $6.99/mo</span>
                  </div>
                  <div className="border border-yellow-500/25 bg-yellow-500/[0.04] rounded-xl p-4 hover:border-yellow-500/40 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Netflix</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 font-medium">Binge</span>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-relaxed block">Stranger Things ended</span>
                    <span className="text-[10px] text-yellow-400/80 mt-1 block">Binge 3-4 weeks, then cancel</span>
                  </div>
                  <div className="border border-red-500/25 bg-red-500/[0.04] rounded-xl p-4 hover:border-red-500/40 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>Hulu</span>
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 font-medium">Cut</span>
                    </div>
                    <span className="text-[11px] text-gray-500 leading-relaxed block">X-Files free on Pluto TV</span>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Watch free with ads instead</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
        <div className="shimmer-line mb-14" />
        <div className="grid grid-cols-3 gap-6 md:gap-12">
          {[
            { target: 26580, suffix: "", label: "Titles Analyzed", color: "text-white" },
            { target: 13, suffix: "", label: "Platforms Covered", color: "text-white" },
            { target: 47, prefix: "$", suffix: "/mo", label: "Avg. Savings Found", color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${s.color}`} style={{ fontFamily: 'var(--font-heading)' }}>
                <Counter target={s.target} prefix={s.prefix || ""} suffix={s.suffix} />
              </div>
              <div className="text-[11px] text-gray-600 mt-2 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="shimmer-line mt-14" />
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-purple-400/80 text-xs tracking-[0.25em] uppercase text-center font-medium" style={{ fontFamily: 'var(--font-heading)' }}>How It Works</div>
        <h2 className="text-3xl md:text-[2.75rem] font-bold text-center mt-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Find wasted money in<br className="hidden md:block" /> under 60 seconds
        </h2>
        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {[
            { num: "01", title: "Select Your Platforms", desc: "Pick which streaming services you currently pay for. We support all 13 major platforms with verified 2026 pricing." },
            { num: "02", title: "Add What You Watch", desc: "Search and add shows you're watching or plan to watch. We pull live data from TMDB to check availability and airing status." },
            { num: "03", title: "Get Your Savings Plan", desc: "Instantly see which platforms to keep, binge and cancel, or cut — with cancel dates, calendar reminders, and free alternatives." },
          ].map((step) => (
            <div key={step.num} className="group relative p-7 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/[0.05] transition-all duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-purple-500/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/[0.1] border border-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
                  {step.num}
                </div>
                <h3 className="font-bold text-lg text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                <span className="text-gray-400 text-sm leading-relaxed block">{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-purple-400/80 text-xs tracking-[0.25em] uppercase text-center font-medium" style={{ fontFamily: 'var(--font-heading)' }}>What SavFlix Does</div>
        <h2 className="text-3xl md:text-[2.75rem] font-bold text-center mt-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Every tool you need to<br className="hidden md:block" /> stop overpaying
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {[
            { icon: Icons.route,    title: "Smart Platform Routing",    desc: "If a show is on multiple platforms, SavFlix routes it to the one you're already keeping — so you don't pay for an extra subscription." },
            { icon: Icons.calendar, title: "Cancel Date Reminders",     desc: "Get the exact date to cancel after the season finale, with one-tap Google Calendar and Apple Calendar integration." },
            { icon: Icons.free,     title: "Free Alternative Detection", desc: "SavFlix checks if your shows are available free with ads on Tubi, Pluto TV, Roku Channel, or Plex — and tells you to cancel the paid version." },
            { icon: Icons.binge,    title: "Binge-and-Cancel Plans",    desc: "For ended or between-season shows, SavFlix builds a binge timeline with estimated watch time so you can subscribe, binge, and cancel." },
            { icon: Icons.browse,   title: "Browsing Recommendation",   desc: "Based on what you watch, who watches, and what matters to you — SavFlix picks the single best platform for casual browsing." },
            { icon: Icons.data,     title: "Real Data, Not Opinions",   desc: "Every recommendation is backed by verified TMDB data: 26,000+ titles, 13 platforms, real library counts, real airing dates." },
          ].map((f) => (
            <div key={f.title} className="group relative p-7 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent hover:border-purple-500/25 transition-all duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/[0.08] border border-purple-500/15 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500/[0.12] group-hover:border-purple-500/25 group-hover:text-purple-300 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg text-white mb-2 group-hover:text-purple-200 transition-colors duration-300" style={{ fontFamily: 'var(--font-heading)' }}>{f.title}</h3>
                <span className="text-gray-400 text-sm leading-relaxed block">{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-purple-400/80 text-xs tracking-[0.25em] uppercase text-center font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Pricing</div>
        <h2 className="text-3xl md:text-[2.75rem] font-bold text-center mt-4 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>Pays for itself in one scan</h2>
        <div className="text-gray-400 text-center mt-4 max-w-lg mx-auto text-sm">The average user saves $47/month. Even our cheapest plan costs less than a single streaming service.</div>
        <div className="mt-16 grid md:grid-cols-3 gap-5 items-start">
          <div className="p-7 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="text-sm text-gray-400 font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Free</div>
            <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>$0</span></div>
            <div className="text-xs text-gray-600 mt-1">Forever free</div>
            <div className="mt-7 space-y-3">
              {["Scan your subscriptions", "See your savings number", "3 scans per month"].map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="text-green-400/80 text-sm mt-0.5">✓</span>
                  <span className="text-gray-400 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <a href="/analyze" className="mt-9 block text-center border border-white/[0.1] px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-white/[0.05] hover:border-white/[0.2] transition-all duration-300">Start Free</a>
          </div>
          <div className="relative p-7 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-b from-purple-900/[0.15] to-transparent shadow-xl shadow-purple-900/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-green-600 to-purple-600 rounded-full text-xs font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>Most Popular</div>
            <div className="text-sm text-purple-300 font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Basic</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>$2.99</span>
              <span className="text-gray-400 text-sm">/mo</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">or $24/year (save 33%)</div>
            <div className="mt-7 space-y-3">
              {["Full detailed report", "Cancel date reminders", "Calendar integration", "Unlimited re-scans", "Free alternative alerts"].map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="text-green-400 text-sm mt-0.5">✓</span>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <a href="/analyze" className="mt-9 block text-center bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/20">Get Basic</a>
          </div>
          <div className="p-7 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-900/[0.08] to-transparent">
            <div className="text-sm text-amber-300 font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Lifetime</div>
            <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>$39</span></div>
            <div className="text-xs text-gray-600 mt-1">One-time payment</div>
            <div className="mt-7 space-y-3">
              {["Everything in Basic", "Full access forever", "All future features", "Priority support", "Limited time offer"].map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="text-amber-400 text-sm mt-0.5">✓</span>
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
            <a href="/analyze" className="mt-9 block text-center bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-600/15">Get Lifetime</a>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 py-24 max-w-4xl mx-auto">
        <div className="relative p-10 md:p-16 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/80 via-purple-600 to-purple-700 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] bg-white/[0.08] rounded-full blur-[80px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[200px] h-[200px] bg-green-400/[0.1] rounded-full blur-[60px]" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              You could be wasting<br />$30–$100 every month.
            </h2>
            <div className="mt-5 text-white/80 text-lg max-w-lg mx-auto leading-relaxed">
              SavFlix shows you exactly where — in under 60 seconds. No credit card. No signup. Just answers.
            </div>
            <a href="/analyze" className="mt-10 inline-block bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/20 transition-all duration-300" style={{ fontFamily: 'var(--font-heading)' }}>
              Scan My Subscriptions Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-10 max-w-5xl mx-auto border-t border-white/[0.04]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-400 to-purple-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Sav<span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Flix</span>
            </span>
          </div>
          <div className="text-[11px] text-gray-600 text-center">
            Powered by verified data from TMDB. 26,000+ titles across 13 streaming platforms.
          </div>
          <div className="flex gap-6">
            <a href="/terms" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">Terms</a>
            <a href="/privacy" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">Privacy</a>
            <a href="mailto:support@savflix.com" className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors duration-300">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}