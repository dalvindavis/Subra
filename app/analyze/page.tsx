"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

let PLATFORM_LOGOS: Record<string, string> = {
  netflix:          'https://image.tmdb.org/t/p/w92/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg',
  hulu:             'https://image.tmdb.org/t/p/w92/giwM8XX4V2AQb9vsoN7yti82tKK.jpg',
  'disney-plus':    'https://image.tmdb.org/t/p/w92/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg',
  'hbo-max':        'https://image.tmdb.org/t/p/w92/aS2zvJWn9mwiCOeaaCkIh4wleZS.jpg',
  peacock:          'https://image.tmdb.org/t/p/w92/xTHltMrZPAJFLQ6qyCBjAnXSmZt.jpg',
  'paramount-plus': 'https://image.tmdb.org/t/p/w92/xbhHHa1YObwAn9IG6UvAsKPMF3Z.jpg',
  'apple-tv':       'https://image.tmdb.org/t/p/w92/6uhKBfmtzFqOcLousHwZuzcrScK.jpg',
  'prime-video':    'https://image.tmdb.org/t/p/w92/emthp39XA2YScoYL1p0sdbAH2WA.jpg',
  'amc-plus':       'https://image.tmdb.org/t/p/w92/xlonQMSmhtA2HHwK3JKF9ghx7M8.jpg',
  starz:            'https://image.tmdb.org/t/p/w92/eWp5LdR4p4Foyl1Ysb2UT3p3wiw.jpg',
  'discovery-plus': 'https://image.tmdb.org/t/p/w92/1w84RPTHBMFJ0NzgMJHGZD0alLb.jpg',
  crunchyroll:      'https://image.tmdb.org/t/p/w92/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg',
  'mgm-plus':       'https://image.tmdb.org/t/p/w92/2YOk2ST0zdUwbVbJIm1bh9O7cDn.jpg',
};

function getPlatformLogo(nameOrKey: string): string | null {
  if (PLATFORM_LOGOS[nameOrKey]) return PLATFORM_LOGOS[nameOrKey];
  const keyMap: Record<string, string> = { Netflix: 'netflix', Hulu: 'hulu', 'Disney+': 'disney-plus', 'HBO Max': 'hbo-max', Peacock: 'peacock', 'Paramount+': 'paramount-plus', 'Apple TV+': 'apple-tv', 'Prime Video': 'prime-video', 'AMC+': 'amc-plus', Starz: 'starz', 'Discovery+': 'discovery-plus', Crunchyroll: 'crunchyroll', 'MGM+': 'mgm-plus' };
  const key = keyMap[nameOrKey];
  if (key && PLATFORM_LOGOS[key]) return PLATFORM_LOGOS[key];
  return null;
}

const CANCEL_URLS: Record<string, { url: string; steps: string }> = {
  netflix: { url: 'https://www.netflix.com/cancelplan', steps: 'Go to netflix.com/cancelplan and click "Finish Cancellation"' },
  hulu: { url: 'https://secure.hulu.com/account', steps: 'Click "Cancel Your Subscription" under Your Subscription' },
  'disney-plus': { url: 'https://www.disneyplus.com/account', steps: 'Select your subscription, click "Cancel Subscription"' },
  'hbo-max': { url: 'https://www.max.com/account', steps: 'Select Subscription, click "Cancel Subscription"' },
  peacock: { url: 'https://www.peacocktv.com/account/plan', steps: 'Select your plan, click "Cancel Plan"' },
  'paramount-plus': { url: 'https://www.paramountplus.com/account/', steps: 'Click "Cancel Subscription" under Subscription & Billing' },
  'apple-tv': { url: 'https://support.apple.com/en-us/HT202039', steps: 'Settings > your name > Subscriptions > Apple TV+' },
  'prime-video': { url: 'https://www.amazon.com/gp/video/settings', steps: 'Amazon account > Prime membership > "End Membership"' },
  'amc-plus': { url: 'https://www.amcplus.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
  starz: { url: 'https://www.starz.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
  'discovery-plus': { url: 'https://www.discoveryplus.com/account', steps: 'Subscription > click "Cancel Subscription"' },
  crunchyroll: { url: 'https://www.crunchyroll.com/account/membership', steps: 'Account Settings > Premium Membership > "Cancel"' },
  'mgm-plus': { url: 'https://www.mgmplus.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
};

const SERVICES = [
  { name: "Netflix", price: 10.99 }, { name: "Hulu", price: 9.99 }, { name: "Disney+", price: 9.99 }, { name: "HBO Max", price: 9.99 },
  { name: "Apple TV+", price: 12.99 }, { name: "Peacock", price: 7.99 }, { name: "Paramount+", price: 8.99 }, { name: "Prime Video", price: 8.99 },
  { name: "AMC+", price: 8.99 }, { name: "Starz", price: 8.99 }, { name: "Discovery+", price: 5.99 }, { name: "Crunchyroll", price: 9.99 }, { name: "MGM+", price: 6.99 },
];

const BROWSE_OPTIONS = [{ id: "series", label: "Series & Dramas" }, { id: "movies", label: "Movies" }, { id: "reality", label: "Reality & Talk Shows" }, { id: "everything", label: "A bit of everything" }];
const VIEWER_OPTIONS = [{ id: "solo", label: "Just me" }, { id: "partner", label: "Me + partner" }, { id: "family", label: "Family with kids" }];
const PRIORITY_OPTIONS = [{ id: "cheapest", label: "Cheapest option" }, { id: "quality", label: "Best quality content" }, { id: "library", label: "Biggest library to browse" }];
const LOADING_MESSAGES = ["Checking platform availability...", "Analyzing show airing schedules...", "Finding free alternatives...", "Calculating optimal platform combo...", "Building your savings plan..."];

function SavingsCounter({ target, prefix = "$", duration = 2000 }: { target: number; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.3 }); if (ref.current) observer.observe(ref.current); return () => observer.disconnect(); }, []);
  useEffect(() => { if (!started) return; let start = 0; const step = target / (duration / 16); const timer = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(timer); } else setVal(start); }, 16); return () => clearInterval(timer); }, [started, target, duration]);
  return <span ref={ref}>{prefix}{val.toFixed(2)}</span>;
}

function makeGoogleCalUrl(platformName: string, cancelDate: string, price: number, platformKey: string): string {
  const cancelUrl = CANCEL_URLS[platformKey]?.url || '';
  const details = `Time to cancel ${platformName}! The season has ended.\n\nYou will save $${price}/mo ($${(price * 12).toFixed(2)}/yr).\n\nCancel here: ${cancelUrl}\n\nPowered by SavFlix`;
  const d = new Date(cancelDate); const start = d.toISOString().split('T')[0].replace(/-/g, ''); const end = new Date(d.getTime() + 86400000).toISOString().split('T')[0].replace(/-/g, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Cancel ${platformName} subscription`)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
}

function downloadICS(platformName: string, cancelDate: string, price: number, platformKey: string) {
  const d = new Date(cancelDate); const start = d.toISOString().split('T')[0].replace(/-/g, ''); const end = new Date(d.getTime() + 86400000).toISOString().split('T')[0].replace(/-/g, '');
  const cancelUrl = CANCEL_URLS[platformKey]?.url || '';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SavFlix//EN', 'BEGIN:VEVENT', `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`, `SUMMARY:Cancel ${platformName} subscription`, `DESCRIPTION:Time to cancel ${platformName}! Save $${price}/mo. Cancel: ${cancelUrl}`, 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:Cancel ${platformName} tomorrow to save $${price}/mo`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `cancel-${platformKey}.ics`; a.click(); URL.revokeObjectURL(url);
}

function generateShareText(analysisData: any): string {
  if (!analysisData) return '';
  const { platformGroups, monthlySavings, yearlySavings, browsingPick } = analysisData;
  const keepGroups = platformGroups.filter((g: any) => g.decision === 'keep' || g.decision === 'keep-for-browsing');
  const cutGroups = platformGroups.filter((g: any) => g.decision === 'cut');
  let text = `I just optimized my streaming subscriptions with SavFlix!\n\n`;
  text += `Before: $${analysisData.beforePrice?.toFixed(2)}/mo\nAfter: $${analysisData.afterPrice?.toFixed(2)}/mo\nSaving: $${monthlySavings}/mo ($${yearlySavings}/yr)\n\n`;
  if (keepGroups.length > 0) text += `Keeping: ${keepGroups.map((g: any) => g.name).join(', ')}\n`;
  if (cutGroups.length > 0) text += `Cutting: ${cutGroups.map((g: any) => g.name).join(', ')}\n`;
  if (browsingPick) text += `\nBest for browsing: ${browsingPick.name} (${browsingPick.totalTitles?.toLocaleString()} titles)\n`;
  text += `\nTry it free: savflix.com`;
  return text;
}

export default function Analyze() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [showQuery, setShowQuery] = useState("");
  const [showResults, setShowResults] = useState<any[]>([]);
  const [myShows, setMyShows] = useState<any[]>([]);
  const [browseType, setBrowseType] = useState("");
  const [viewerType, setViewerType] = useState("");
  const [priority, setPriority] = useState("");
  const [result, setResult] = useState("");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [expandedCancel, setExpandedCancel] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [logoMap, setLogoMap] = useState<Record<string, string>>({});
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { (async () => { try { const res = await fetch('/api/tmdb?logos=true'); const data = await res.json(); if (data.logos) { Object.entries(data.logos).forEach(([key, url]) => { PLATFORM_LOGOS[key] = url as string; }); setLogoMap(data.logos); } } catch (e) { console.error('Failed to fetch platform logos:', e); } })(); }, []);
  useEffect(() => { if (!loading) { setLoadingMsg(0); return; } const timer = setInterval(() => { setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length); }, 1200); return () => clearInterval(timer); }, [loading]);
  useEffect(() => { if (showQuery.length < 2) { setShowResults([]); return; } const timer = setTimeout(async () => { const res = await fetch(`/api/tmdb?query=${encodeURIComponent(showQuery)}`); const data = await res.json(); setShowResults(data.results || []); }, 400); return () => clearTimeout(timer); }, [showQuery]);

  if (!mounted) return null;

  const allHabitsSelected = browseType !== "" && viewerType !== "" && priority !== "";
  const canAnalyze = selected.length > 0 && allHabitsSelected;
  const currentStep = selected.length === 0 ? 1 : (myShows.length === 0 ? 2 : 3);
  const stepLabel = currentStep === 1 ? 'Select platforms' : currentStep === 2 ? 'Add your shows' : 'Set preferences';
  const stepPercent = currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%';

  const toggleService = (name: string) => setSelected((prev) => prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]);

  const addShow = async (show: any) => {
    if (!myShows.find((s) => s.id === show.id)) {
      const res = await fetch(`/api/tmdb?enrich=${show.id}&mediaType=${show.mediaType || "tv"}`); const data = await res.json();
      setMyShows((prev) => [...prev, { ...show, providerIds: data.providerIds || [], freeProviderIds: data.freeProviderIds || [], freeOn: data.freeOn || null, matchedPlatforms: data.matchedPlatforms || [], tmdbStatus: data.tmdbStatus || "Unknown", nextEpisodeDate: data.nextEpisodeDate || null, seasonCount: data.seasonCount || 0, rawProviders: data.raw || null, posterPath: show.posterLarge || show.poster || null, seasonFinaleDate: data.seasonFinaleDate || null, totalEpisodesInSeason: data.totalEpisodesInSeason || null, lastEpisodeDate: data.lastEpisodeDate || null }]);
    }
    setShowQuery(""); setShowResults([]);
  };

  const removeShow = (id: number) => setMyShows((prev) => prev.filter((s) => s.id !== id));

  const PLATFORM_NAME_MAP: Record<string, string> = { netflix: "Netflix", hulu: "Hulu", "disney-plus": "Disney+", "hbo-max": "HBO Max", peacock: "Peacock", "paramount-plus": "Paramount+", "apple-tv": "Apple TV+", "prime-video": "Prime Video", "amc-plus": "AMC+", starz: "Starz", "discovery-plus": "Discovery+", crunchyroll: "Crunchyroll", "mgm-plus": "MGM+" };

  const getPlatformLabel = (show: any): { text: string; isFree: boolean } => {
    if (show.freeOn) return { text: `FREE w/ads on ${show.freeOn.name}`, isFree: true };
    if (show.matchedPlatforms?.length > 0) return { text: show.matchedPlatforms.map((p: any) => PLATFORM_NAME_MAP[p.platformKey] || p.platformKey).join(", "), isFree: false };
    return { text: "Platform unknown", isFree: false };
  };

  const getStatusLabel = (show: any): { text: string; color: string } => {
    const status = show.tmdbStatus || "Unknown";
    switch (status) {
      case "Returning Series": if (show.nextEpisodeDate) { const diff = (new Date(show.nextEpisodeDate).getTime() - Date.now()) / (1000*60*60*24); if (diff < 0) return { text: "Between Seasons", color: "text-amber-400" }; if (diff <= 30) return { text: "Currently Airing", color: "text-green-400" }; return { text: "New Season Coming", color: "text-blue-400" }; } return { text: "Between Seasons", color: "text-amber-400" };
      case "In Production": if (show.nextEpisodeDate) { const diff = (new Date(show.nextEpisodeDate).getTime() - Date.now()) / (1000*60*60*24); if (diff <= 30 && diff >= 0) return { text: "Currently Airing", color: "text-green-400" }; return { text: "New Season Coming", color: "text-blue-400" }; } return { text: "New Season Coming", color: "text-yellow-400" };
      case "Ended": return { text: "Ended", color: "text-gray-500" };
      case "Canceled": return { text: "Canceled", color: "text-red-400" };
      case "Planned": return { text: "Upcoming", color: "text-blue-400" };
      default: return { text: status, color: "text-gray-500" };
    }
  };

  const handleAnalyze = async () => {
    if (!canAnalyze) return; setLoading(true); setResult(""); setAnalysisData(null);
    const services = selected.map((name) => { const svc = SERVICES.find((s) => s.name === name); return { name, price: svc?.price || 0 }; });
    const shows = myShows.map((s) => ({ name: s.name, tmdbId: s.id, providerIds: s.providerIds || [], freeProviderIds: s.freeProviderIds || [], tmdbStatus: s.tmdbStatus || "Unknown", nextEpisodeDate: s.nextEpisodeDate || null, seasonCount: s.seasonCount || 0, posterPath: s.posterPath || s.poster || null, seasonFinaleDate: s.seasonFinaleDate || null, totalEpisodesInSeason: s.totalEpisodesInSeason || null, lastEpisodeDate: s.lastEpisodeDate || null }));
    const preferences = { content: browseType, audience: viewerType, priority };
    try { const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ services, shows, preferences }) }); const data = await res.json(); setResult(data.result || ""); setAnalysisData(data.analysis || null); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); } catch { setResult("Something went wrong. Please try again."); } finally { setLoading(false); }
  };

  const handleReset = () => { setSelected([]); setMyShows([]); setResult(""); setAnalysisData(null); setShowQuery(""); setBrowseType(""); setViewerType(""); setPriority(""); setExpandedCancel(null); setShareMessage(""); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleShare = async () => { const text = generateShareText(analysisData); if (navigator.share) { try { await navigator.share({ title: 'My SavFlix Results', text }); } catch {} } else { await navigator.clipboard.writeText(text); setShareMessage("Copied to clipboard!"); setTimeout(() => setShareMessage(""), 2000); } };

  const handleCheckout = async (plan: 'basic' | 'lifetime') => {
    setCheckoutLoading(plan);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const priceId = plan === 'basic'
        ? process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          plan,
          userId: user?.id || null,
          email: user?.email || null,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const totalMonthly = selected.reduce((sum, name) => { const svc = SERVICES.find((s) => s.name === name); return sum + (svc?.price || 0); }, 0);

  const PlatformIcon = ({ name, platformKey, color, size = 'sm' }: { name: string; platformKey?: string; color: string; size?: 'sm' | 'md' | 'lg' }) => {
    const logo = getPlatformLogo(name) || (platformKey ? getPlatformLogo(platformKey) : null);
    const sz = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-10 h-10' }[size];
    const dot = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' }[size];
    if (logo) return <img src={logo} alt={name} className={`${sz} rounded-lg object-cover flex-shrink-0`} />;
    return <div className={`${dot} rounded-full flex-shrink-0`} style={{ backgroundColor: color }} />;
  };

  const getShowActionLabel = (show: any): { text: string; color: string } | null => {
    if (show.decision === 'free-elsewhere' && show.freeOn) return { text: `Watch free on ${show.freeOn.name} instead`, color: 'text-emerald-400' };
    if (show.decision === 'binge-and-cancel' && (show.status === 'ended' || show.statusLabel === 'Ended')) return { text: 'Binge this — series has ended', color: 'text-yellow-400' };
    if (show.decision === 'binge-and-cancel' && show.status === 'between-seasons') return { text: 'Binge and catch up — between seasons', color: 'text-yellow-400' };
    if (show.decision === 'binge-and-cancel' && show.status === 'upcoming') return { text: 'Binge now — new season coming soon', color: 'text-blue-400' };
    return null;
  };

  const renderPremiumResults = () => {
    if (!analysisData) return null;
    const { platformGroups, freeShows, monthlySavings, yearlySavings, browsingPick, beforePrice, afterPrice } = analysisData;
    const keepGroups = platformGroups.filter((g: any) => g.decision === 'keep' || g.decision === 'keep-for-browsing');
    const bingeGroups = platformGroups.filter((g: any) => g.decision === 'binge-and-cancel');
    const cutGroups = platformGroups.filter((g: any) => g.decision === 'cut');
    const savingsPercent = beforePrice > 0 ? Math.round((monthlySavings / beforePrice) * 100) : 0;
    const decisionColors: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
      keep: { border: 'border-green-500/40', bg: 'bg-green-500/5', badge: 'bg-green-500/20', badgeText: 'text-green-400' },
      'keep-for-browsing': { border: 'border-blue-500/40', bg: 'bg-blue-500/5', badge: 'bg-blue-500/20', badgeText: 'text-blue-400' },
      'binge-and-cancel': { border: 'border-yellow-500/40', bg: 'bg-yellow-500/5', badge: 'bg-yellow-500/20', badgeText: 'text-yellow-400' },
      cut: { border: 'border-red-500/40', bg: 'bg-red-500/5', badge: 'bg-red-500/20', badgeText: 'text-red-400' }
    };
    const decisionLabels: Record<string, string> = { keep: '✅ Keep', 'keep-for-browsing': '📺 Keep for Browsing', 'binge-and-cancel': '⏱️ Binge & Cancel', cut: '✂️ Cut' };

    const renderPlatformCard = (group: any, index: number) => {
      const colors = decisionColors[group.decision] || decisionColors.cut;
      const cancelInfo = CANCEL_URLS[group.platformKey];
      const isExpanded = expandedCancel === group.platformKey;
      const bingeShows = group.shows.filter((s: any) => s.decision === 'binge-and-cancel' || s.status === 'ended' || s.status === 'between-seasons');
      const bingeShowsWithDates = bingeShows.filter((s: any) => s.cancelDate);
      let latestBingeCancelDate: string | null = null;
      let latestBingeCancelLabel: string | null = null;
      if (bingeShowsWithDates.length > 0) {
        latestBingeCancelDate = bingeShowsWithDates.reduce((latest: string, s: any) => s.cancelDate > latest ? s.cancelDate : latest, bingeShowsWithDates[0].cancelDate);
        const d = new Date(latestBingeCancelDate);
        latestBingeCancelLabel = `Binge all ${bingeShows.length} show${bingeShows.length > 1 ? 's' : ''}, then cancel after ${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;
      }
      const cutReason = group.decision === 'cut' && group.shows.length === 0 ? `You're paying $${group.price}/mo for zero shows you watch` : group.reason;

      return (
        <div key={group.platformKey} className={`border ${colors.border} ${colors.bg} rounded-xl p-5 mb-3 animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <PlatformIcon name={group.name} platformKey={group.platformKey} color={group.color} size="md" />
              <span className="font-semibold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{group.name}</span>
              <span className="text-gray-500 text-sm">${group.price}/mo</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${colors.badge} ${colors.badgeText}`}>{decisionLabels[group.decision]}</span>
          </div>
          <div className={`text-sm mb-2 ${group.decision === 'cut' && group.shows.length === 0 ? 'text-red-400 font-medium' : 'text-gray-400'}`}>{cutReason}</div>
          {group.cancelDateLabel && group.decision === 'keep' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-2">
              <div className="text-amber-400 text-sm font-medium">📅 {group.cancelDateLabel}</div>
              <div className="text-amber-400/70 text-xs mb-2">Save ${group.price}/mo (${(group.price * 12).toFixed(2)}/yr) after the season ends</div>
              <div className="flex gap-2 mt-1">
                <a href={makeGoogleCalUrl(group.name, group.cancelDate, group.price, group.platformKey)} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition inline-flex items-center gap-1">📆 Google Calendar</a>
                <button onClick={() => downloadICS(group.name, group.cancelDate, group.price, group.platformKey)} className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition inline-flex items-center gap-1">🍎 Apple Calendar</button>
              </div>
            </div>
          )}
          {group.decision === 'binge-and-cancel' && latestBingeCancelLabel && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 mb-2">
              <div className="text-yellow-400 text-sm font-medium">📅 {latestBingeCancelLabel}</div>
              <div className="text-yellow-400/70 text-xs mb-2">Save ${group.price}/mo (${(group.price * 12).toFixed(2)}/yr)</div>
              <div className="flex gap-2 mt-1">
                <a href={makeGoogleCalUrl(group.name, latestBingeCancelDate!, group.price, group.platformKey)} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition inline-flex items-center gap-1">📆 Google Calendar</a>
                <button onClick={() => downloadICS(group.name, latestBingeCancelDate!, group.price, group.platformKey)} className="text-xs px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition inline-flex items-center gap-1">🍎 Apple Calendar</button>
              </div>
            </div>
          )}
          {group.bingeEstimate && <div className="text-yellow-400/80 text-xs mb-2">Estimated binge time: {group.bingeEstimate}</div>}
          {group.decision === 'cut' && <div className="text-red-400/80 text-xs mb-2">Saves ${group.price}/mo (${(group.price * 12).toFixed(2)}/yr)</div>}
          {group.shows.length > 0 && (
            <div className="mt-3 space-y-2">
              {group.shows.map((show: any, i: number) => {
                const actionLabel = getShowActionLabel(show);
                return (
                  <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-2.5">
                    {show.posterPath && <img src={show.posterPath} alt={show.name} className="w-10 h-14 rounded object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap"><span className="text-sm font-medium text-white">{show.name}</span><span className="text-xs text-gray-500">({show.statusLabel})</span></div>
                      {actionLabel && <div className={`text-xs mt-0.5 ${actionLabel.color}`}>{show.decision === 'free-elsewhere' ? '🆓' : '⏱️'} {actionLabel.text}</div>}
                      {show.cancelDateLabel && <div className="text-xs text-amber-400 mt-0.5">📅 {show.cancelDateLabel}</div>}
                      {show.allPlatforms && show.allPlatforms.length > 1 && (<div className="text-xs text-gray-500 mt-1">Available on {show.allPlatforms.map((p: any) => p.name).join(", ")}{show.chosenReason && <span className="text-purple-400"> — {show.chosenReason}</span>}</div>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {(group.decision === 'cut' || group.decision === 'binge-and-cancel' || (group.decision === 'keep' && group.cancelDateLabel)) && cancelInfo && (
            <div className="mt-3 border-t border-white/5 pt-2">
              <button onClick={() => setExpandedCancel(isExpanded ? null : group.platformKey)} className="text-xs text-gray-500 hover:text-gray-300 transition flex items-center gap-1"><span>{isExpanded ? '▾' : '▸'}</span> How to cancel {group.name}</button>
              {isExpanded && (<div className="mt-2 bg-white/5 rounded-lg px-3 py-2"><div className="text-xs text-gray-400 mb-2">{cancelInfo.steps}</div><a href={cancelInfo.url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 transition underline">Go to {group.name} cancellation page →</a></div>)}
            </div>
          )}
        </div>
      );
    };

    const cutSavings = cutGroups.reduce((sum: number, g: any) => sum + g.price, 0);
    const roiMultiple = yearlySavings > 0 ? Math.round(yearlySavings / 35.88) : 0;
    const netSavings = yearlySavings > 35.88 ? (yearlySavings - 35.88).toFixed(2) : yearlySavings.toFixed(2);

    return (
      <div className="mt-4">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in-up" style={{ fontFamily: 'var(--font-heading)' }}>Your Results</h1>
        <div className="text-gray-400 text-sm mb-6 animate-fade-in-up delay-100">Based on {selected.length} subscriptions{myShows.length > 0 ? ` and ${myShows.length} shows` : ""}</div>
        <div className="glass border border-purple-500/25 rounded-2xl p-6 mb-8 animate-fade-in-scale delay-200" style={{ boxShadow: '0 0 60px rgba(147, 51, 234, 0.1)' }}>
          <div className="text-purple-300 text-sm font-medium mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Your Optimized Plan</div>
          {keepGroups.length > 0 && (<div className="flex flex-wrap gap-2 mb-4">{keepGroups.map((g: any) => (<span key={g.platformKey} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-white" style={{ backgroundColor: g.color + '33', border: `1px solid ${g.color}55` }}><PlatformIcon name={g.name} platformKey={g.platformKey} color={g.color} size="sm" />{g.name}</span>))}</div>)}
          <div className="flex items-baseline gap-3 mb-1">
            {beforePrice > 0 && <span className="text-gray-500 line-through text-lg">${beforePrice?.toFixed(2)}/mo</span>}
            {afterPrice !== undefined && (<span className="text-3xl font-bold text-green-400" style={{ fontFamily: 'var(--font-heading)' }}><SavingsCounter target={afterPrice} prefix="$" />/mo</span>)}
          </div>
          <div className="text-gray-400 text-sm">Save <span className="text-white font-semibold"><SavingsCounter target={monthlySavings} prefix="$" />/mo</span> — that is <span className="text-white font-semibold"><SavingsCounter target={yearlySavings} prefix="$" /></span> saved per year</div>
          {savingsPercent > 0 && (<div className="mt-3 text-purple-300 text-sm font-medium">⚡ Optimized plan reduces your spending by {savingsPercent}%</div>)}
        </div>

        {keepGroups.length > 0 && (<div className="mb-6"><h2 className="text-lg font-semibold mb-3 text-green-400" style={{ fontFamily: 'var(--font-heading)' }}>What to Keep</h2>{keepGroups.map((g: any, i: number) => renderPlatformCard(g, i))}</div>)}

        {browsingPick && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-blue-400" style={{ fontFamily: 'var(--font-heading)' }}>Best for Browsing</h2>
            <div className="border border-blue-500/30 bg-blue-500/5 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <PlatformIcon name={browsingPick.name} platformKey={browsingPick.platformKey} color={browsingPick.color} size="lg" />
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{browsingPick.name}</span>
                <span className="text-gray-400">${browsingPick.price}/mo</span>
                {browsingPick.isCurrentSub && <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">You subscribe</span>}
              </div>
              <div className="text-gray-300 text-sm mb-2">{browsingPick.reason}</div>
              {browsingPick.whyStatement && <div className="text-blue-300/80 text-sm mb-3 italic">{browsingPick.whyStatement}</div>}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{browsingPick.totalTitles?.toLocaleString()}</div><div className="text-xs text-gray-500">Total Titles</div></div>
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{browsingPick.tvShows?.toLocaleString()}</div><div className="text-xs text-gray-500">TV Shows</div></div>
                <div className="bg-white/5 rounded-lg p-3 text-center"><div className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{browsingPick.movies?.toLocaleString()}</div><div className="text-xs text-gray-500">Movies</div></div>
              </div>
              {browsingPick.isCurrentSub ? <div className="text-green-400 text-sm font-medium">Keep this subscription for the best browsing experience based on your preferences.</div> : <div className="text-blue-400 text-sm font-medium">Consider adding this subscription for the best browsing experience based on your preferences.</div>}
            </div>
          </div>
        )}

        {bingeGroups.length > 0 && (<div className="mb-6"><h2 className="text-lg font-semibold mb-3 text-yellow-400" style={{ fontFamily: 'var(--font-heading)' }}>Binge and Cancel</h2>{bingeGroups.map((g: any, i: number) => renderPlatformCard(g, i))}</div>)}
        {cutGroups.length > 0 && (<div className="mb-6"><h2 className="text-lg font-semibold mb-3 text-red-400" style={{ fontFamily: 'var(--font-heading)' }}>What to Cut</h2>{cutGroups.length > 1 && <div className="text-red-400/70 text-sm mb-3">Cutting {cutGroups.length} platforms saves you ${cutSavings.toFixed(2)}/mo</div>}{cutGroups.map((g: any, i: number) => renderPlatformCard(g, i))}</div>)}

        {freeShows.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-emerald-400" style={{ fontFamily: 'var(--font-heading)' }}>Free Alternatives</h2>
            <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-5">
              <div className="text-gray-400 text-sm mb-3">These shows are available for free with ads:</div>
              <div className="space-y-2">{freeShows.map((show: any, i: number) => (<div key={i} className="flex items-center gap-3">{show.posterPath && <img src={show.posterPath} alt={show.name} className="w-8 h-12 rounded object-cover" />}<span className="text-sm text-emerald-300">{show.name} <span className="text-emerald-500">on {show.freeOn?.name}</span></span></div>))}</div>
            </div>
          </div>
        )}

        {/* Upsell / Checkout Section */}
        <div className="mb-6 border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/10 p-6">
            <div className="text-xs text-purple-400 font-medium uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-heading)' }}>You are leaving money on the table</div>
            <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-heading)' }}>This just saved you <SavingsCounter target={yearlySavings} prefix="$" />/year.</div>
            <div className="text-gray-400 text-sm mb-1">SavFlix costs less than 1% of your savings.</div>
            <div className="text-gray-500 text-sm mb-4">But subscriptions change every month. Prices go up. Shows move platforms. Seasons end. Without monitoring, the average person loses 60% of their savings within 3 months.</div>
            <div className="bg-black/30 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">Your annual savings</span><span className="text-green-400 font-bold">${yearlySavings}</span></div>
              <div className="flex items-center justify-between mb-2"><span className="text-gray-400 text-sm">SavFlix Basic cost</span><span className="text-gray-300 font-medium">-$35.88/yr</span></div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between"><span className="text-white text-sm font-medium">You still save</span><span className="text-green-400 font-bold text-lg">${netSavings}/yr</span></div>
              <div className="text-xs text-gray-500 mt-2">That is a {roiMultiple}x return on a $2.99/mo investment</div>
            </div>
            <div className="text-gray-300 text-sm font-medium mb-3">What you get:</div>
            <div className="space-y-2 mb-5">
              <div className="flex items-start gap-2"><span className="text-green-400 text-sm mt-0.5">✓</span><span className="text-gray-300 text-sm">Automatic cancel date reminders — we email you 3 days before so you never pay for a month you do not need</span></div>
              <div className="flex items-start gap-2"><span className="text-green-400 text-sm mt-0.5">✓</span><span className="text-gray-300 text-sm">Resubscribe alerts — we tell you the day your favorite show comes back so you do not miss it</span></div>
              <div className="flex items-start gap-2"><span className="text-green-400 text-sm mt-0.5">✓</span><span className="text-gray-300 text-sm">Monthly re-scans — prices change, shows move, we catch it and update your plan automatically</span></div>
              <div className="flex items-start gap-2"><span className="text-green-400 text-sm mt-0.5">✓</span><span className="text-gray-300 text-sm">Savings dashboard — see your running total of money saved, month over month</span></div>
              <div className="flex items-start gap-2"><span className="text-green-400 text-sm mt-0.5">✓</span><span className="text-gray-300 text-sm">Free platform monitoring — we check weekly if your shows move to Tubi, Pluto TV, or Roku Channel</span></div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCheckout('basic')}
                disabled={checkoutLoading !== null}
                className="bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-purple-500 hover:scale-[1.02] transition-all shadow-lg shadow-purple-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkoutLoading === 'basic' ? 'Redirecting...' : 'Get SavFlix Basic — $2.99/mo'}
              </button>
              <button
                onClick={() => handleCheckout('lifetime')}
                disabled={checkoutLoading !== null}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold hover:from-amber-400 hover:to-orange-400 hover:scale-[1.02] transition-all shadow-lg shadow-amber-600/25 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkoutLoading === 'lifetime' ? 'Redirecting...' : '$39 Lifetime — Pay Once'}
              </button>
            </div>
            <div className="text-xs text-gray-600 mt-3">Cancel anytime. No commitment. Your savings pay for it {roiMultiple} times over.</div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-4 mb-6"><div className="text-xs text-gray-600 text-center">Analysis powered by verified data from 26,000+ titles across 13 streaming platforms. Library counts sourced from TMDB. Subscription-included titles only — no rentals.</div></div>

        <div className="flex flex-wrap gap-3 mt-2">
          <button onClick={handleShare} className="border border-purple-500/50 text-purple-400 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-purple-500/10 hover:scale-[1.02] transition-all inline-flex items-center gap-2">📤 Share Results</button>
          <button onClick={handleReset} className="border border-gray-700 text-gray-400 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 hover:scale-[1.02] transition-all">Run Another Analysis</button>
        </div>
        {shareMessage && <div className="text-green-400 text-xs mt-2">{shareMessage}</div>}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#07060b] text-white px-6 py-10 max-w-3xl mx-auto relative" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="fixed inset-0 pointer-events-none z-0"><div className="absolute top-[-20%] left-[50%] translate-x-[-50%] w-[700px] h-[500px] bg-purple-600/[0.06] rounded-full blur-[130px]" /></div>
      <div ref={topRef} className="relative z-10" />

      {/* Nav */}
      <div className="relative z-10 flex items-center justify-between mb-10">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 via-emerald-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow duration-300">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M4 12h4l3-7 4 14 3-7h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white/80 group-hover:text-white transition-colors duration-200" style={{ fontFamily: 'var(--font-heading)' }}>
            Sav<span className="bg-gradient-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">Flix</span>
          </span>
        </a>
        <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1.5">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 rotate-180"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" /></svg>
          Back to Home
        </a>
      </div>

      {!result && !analysisData && (
        <div className="relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-heading)' }}>Step {currentStep} of 3</span><span className="text-xs text-gray-600">{stepLabel}</span></div>
            <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden"><div className="h-1 bg-gradient-to-r from-green-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: stepPercent }} /></div>
          </div>
          <h1 className="text-3xl font-bold mb-2 animate-fade-in-up" style={{ fontFamily: 'var(--font-heading)' }}>Build Your Streaming Profile</h1>
          <div className="text-gray-400 text-sm mb-8 animate-fade-in-up delay-100">Select your subscriptions and tell us what you watch. We will find the smartest way to save.</div>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Your Subscriptions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            {SERVICES.map((svc, i) => (
              <button key={svc.name} onClick={() => toggleService(svc.name)} className={"p-4 rounded-xl border text-left transition-all duration-300 " + (selected.includes(svc.name) ? "border-purple-500 bg-purple-900/30 text-white shadow-lg shadow-purple-500/15 scale-[1.02]" : "border-gray-700/50 bg-white/[0.02] text-gray-400 hover:border-purple-400/50 hover:bg-white/[0.04] hover:scale-[1.02]")} style={{ animationDelay: `${i * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <PlatformIcon name={svc.name} color="#6B7280" size="md" />
                  <div>
                    <div className="font-medium text-sm">{svc.name}</div>
                    <div className="text-xs mt-0.5 text-gray-500">${svc.price}/mo</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {selected.length > 0 && <div className="text-sm text-gray-400 mb-8">Current total: <span className="text-white font-semibold">${totalMonthly.toFixed(2)}/mo</span></div>}

          <div className="border-t border-white/[0.04] my-8" />
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Shows You Watch</h2>
          <div className="text-gray-400 text-xs mb-4">This helps us find the cheapest platform combo and build your binge plan.</div>
          <div className="relative mb-4">
            <input type="text" placeholder="Search any show..." className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm focus:border-purple-500 focus:outline-none focus:bg-white/[0.05] transition-all" value={showQuery} onChange={(e) => setShowQuery(e.target.value)} />
            {showResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0c0b12] border border-white/[0.1] rounded-xl overflow-hidden z-10 shadow-2xl">
                {showResults.map((show) => (<button key={show.id} onClick={() => addShow(show)} className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.05] transition text-left">{show.poster && <img src={show.poster} alt="" className="w-8 h-12 rounded object-cover" />}<div><div className="text-sm font-medium">{show.name}</div><div className="text-xs text-gray-500">{show.year}</div></div></button>))}
              </div>
            )}
          </div>
          {myShows.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {myShows.map((show) => {
                const platform = getPlatformLabel(show); const status = getStatusLabel(show);
                return (
                  <span key={show.id} className={"inline-flex items-start gap-2 rounded-xl px-3 py-2 text-sm border transition-all duration-300 hover:scale-[1.02] " + (platform.isFree ? "bg-green-500/10 border-green-500/30" : "bg-purple-500/10 border-purple-500/30")}>
                    {show.poster && <img src={show.poster} alt="" className="w-6 h-9 rounded object-cover flex-shrink-0 mt-0.5" />}
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1"><span className="font-medium">{show.name}</span><button onClick={() => removeShow(show.id)} className="text-gray-400 hover:text-white ml-1 text-xs">&times;</button></span>
                      <span className={"text-xs " + (platform.isFree ? "text-green-400" : "text-gray-400")}>{platform.text}</span>
                      <span className={"text-xs " + status.color}>{status.text}</span>
                      {show.seasonFinaleDate && status.text === "Currently Airing" && (<span className="text-xs text-amber-400">Season ends ~{new Date(show.seasonFinaleDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                    </span>
                  </span>
                );
              })}
            </div>
          )}

          <div className="border-t border-white/[0.04] my-8" />
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Your Viewing Habits</h2>
          <div className="text-gray-400 text-xs mb-6">Answer all three questions so we can give you the best recommendation.</div>
          <div className="mb-6"><div className="text-sm text-gray-300 mb-3">What do you mostly watch?</div><div className="flex flex-wrap gap-2">{BROWSE_OPTIONS.map((opt) => (<button key={opt.id} onClick={() => setBrowseType(opt.label)} className={"px-4 py-2 rounded-full text-sm border transition-all duration-300 " + (browseType === opt.label ? "border-purple-500 bg-purple-500/10 text-white shadow-md shadow-purple-500/10" : "border-gray-700/50 text-gray-400 hover:border-gray-500 hover:scale-[1.02]")}>{opt.label}</button>))}</div></div>
          <div className="mb-6"><div className="text-sm text-gray-300 mb-3">Who usually watches?</div><div className="flex flex-wrap gap-2">{VIEWER_OPTIONS.map((opt) => (<button key={opt.id} onClick={() => setViewerType(opt.label)} className={"px-4 py-2 rounded-full text-sm border transition-all duration-300 " + (viewerType === opt.label ? "border-purple-500 bg-purple-500/10 text-white shadow-md shadow-purple-500/10" : "border-gray-700/50 text-gray-400 hover:border-gray-500 hover:scale-[1.02]")}>{opt.label}</button>))}</div></div>
          <div className="mb-8"><div className="text-sm text-gray-300 mb-3">What matters most to you?</div><div className="flex flex-wrap gap-2">{PRIORITY_OPTIONS.map((opt) => (<button key={opt.id} onClick={() => setPriority(opt.label)} className={"px-4 py-2 rounded-full text-sm border transition-all duration-300 " + (priority === opt.label ? "border-purple-500 bg-purple-500/10 text-white shadow-md shadow-purple-500/10" : "border-gray-700/50 text-gray-400 hover:border-gray-500 hover:scale-[1.02]")}>{opt.label}</button>))}</div></div>

          <button onClick={handleAnalyze} disabled={loading || !canAnalyze} className={"px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 w-full md:w-auto " + (canAnalyze ? "bg-gradient-to-r from-green-600 to-purple-600 text-white hover:from-green-500 hover:to-purple-500 hover:scale-[1.02] shadow-lg shadow-purple-600/20" : "bg-gray-700/50 text-gray-500 cursor-not-allowed")} style={{ fontFamily: 'var(--font-heading)' }}>
            {loading ? "Analyzing..." : !canAnalyze ? (selected.length === 0 ? "Select your subscriptions to start" : "Complete all viewing habits to analyze") : "Analyze My Subscriptions"}
          </button>
          <div className="text-center mt-3 text-xs text-gray-600">Takes less than 60 seconds · No signup required</div>
        </div>
      )}

      {loading && (
        <div className="relative z-10 mt-16 flex flex-col items-center gap-6">
          <div className="relative"><div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" /><div className="absolute inset-0 w-14 h-14 bg-purple-500/10 rounded-full blur-xl" /></div>
          <div className="text-center"><div className="text-white font-medium mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Analyzing your subscriptions</div><div className="text-purple-400 text-sm h-5 transition-all duration-300">{LOADING_MESSAGES[loadingMsg]}</div></div>
          <div className="flex gap-1.5 mt-2">{LOADING_MESSAGES.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === loadingMsg ? 'bg-purple-400 scale-125' : 'bg-gray-700'}`} />))}</div>
        </div>
      )}

      {analysisData && <div className="relative z-10">{renderPremiumResults()}</div>}
    </main>
  );
}