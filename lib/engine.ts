// =============================================================================
// SAVFLIX DECISION ENGINE v10
// Fixes: negative comparison bug, title count mismatch
// Adds: missing platform detection for shows not on user subscriptions
// =============================================================================

export type PlatformKey =
  | 'netflix' | 'hulu' | 'disney-plus' | 'hbo-max' | 'peacock'
  | 'paramount-plus' | 'apple-tv' | 'prime-video' | 'amc-plus'
  | 'starz' | 'discovery-plus' | 'crunchyroll' | 'mgm-plus';

export type ShowStatus = 'airing' | 'ended' | 'upcoming' | 'between-seasons';
export type ContentType = 'series' | 'movies' | 'reality' | 'everything';
export type Audience = 'solo' | 'partner' | 'family';
export type Priority = 'cheapest' | 'quality' | 'library';
export type Decision = 'keep' | 'keep-for-browsing' | 'cut' | 'binge-and-cancel' | 'free-elsewhere' | 'not-subscribed';

export interface ShowAnalysis {
  name: string; tmdbId?: number; status: ShowStatus; statusLabel: string;
  decision: Decision; reason: string; platformKey: PlatformKey | null;
  freeOn: FreePlatform | null; seasonCount?: number; nextEpisodeDate?: string;
  posterPath?: string | null; cancelDate?: string | null; cancelDateLabel?: string | null;
  seasonFinaleDate?: string | null;
  allPlatforms: { platformKey: PlatformKey; name: string; color: string; price: number }[];
  chosenReason?: string;
  missingPlatform?: { platformKey: PlatformKey; name: string; price: number } | null;
}

export interface PlatformGroup {
  platformKey: PlatformKey; name: string; color: string; price: number;
  decision: Decision; reason: string; shows: ShowAnalysis[];
  bingeEstimate?: string; logoPath?: string | null;
  cancelDate?: string | null; cancelDateLabel?: string | null; savingsOnCancel?: number;
}

export interface FreePlatform { id: number; name: string; }

export interface BrowsingRecommendation {
  name: string; platformKey: PlatformKey; price: number; color: string;
  reason: string; whyStatement: string; isCurrentSub: boolean;
  totalTitles: number; tvShows: number; movies: number; relevantCount: number;
}

export interface AnalysisResult {
  platformGroups: PlatformGroup[]; freeShows: ShowAnalysis[];
  missingPlatformShows: ShowAnalysis[];
  monthlySavings: number; yearlySavings: number;
  browsingPick: BrowsingRecommendation | null; scenario: Scenario;
  beforePrice: number; afterPrice: number;
}

export type Scenario = 'browse-only' | 'light-with-quiz' | 'light-no-quiz' | 'typical' | 'power';

export const PLATFORMS: Record<PlatformKey, { name: string; color: string; price: number }> = {
  netflix:          { name: 'Netflix',       color: '#E50914', price: 10.99 },
  hulu:             { name: 'Hulu',          color: '#1CE783', price: 9.99 },
  'disney-plus':    { name: 'Disney+',       color: '#113CCF', price: 9.99 },
  'hbo-max':        { name: 'HBO Max',       color: '#002BE7', price: 9.99 },
  peacock:          { name: 'Peacock',        color: '#FDB927', price: 7.99 },
  'paramount-plus': { name: 'Paramount+',    color: '#0064FF', price: 8.99 },
  'apple-tv':       { name: 'Apple TV+',     color: '#000000', price: 12.99 },
  'prime-video':    { name: 'Prime Video',    color: '#00A8E1', price: 8.99 },
  'amc-plus':       { name: 'AMC+',          color: '#1D1D1D', price: 8.99 },
  starz:            { name: 'Starz',          color: '#1A1A2E', price: 8.99 },
  'discovery-plus': { name: 'Discovery+',    color: '#0033A0', price: 5.99 },
  crunchyroll:      { name: 'Crunchyroll',   color: '#F47521', price: 9.99 },
  'mgm-plus':       { name: 'MGM+',          color: '#B8860B', price: 6.99 },
};

export const PROVIDER_MAP: Record<number, PlatformKey> = {
  8: 'netflix', 1796: 'netflix', 175: 'netflix',
  15: 'hulu', 337: 'disney-plus', 1899: 'hbo-max',
  386: 'peacock', 387: 'peacock', 2303: 'paramount-plus', 2616: 'paramount-plus',
  350: 'apple-tv', 9: 'prime-video', 119: 'prime-video',
  526: 'amc-plus', 43: 'starz', 520: 'discovery-plus',
  283: 'crunchyroll', 34: 'mgm-plus',
};

export const FREE_PROVIDER_MAP: Record<number, string> = {
  73: 'Tubi', 300: 'Pluto TV', 207: 'Roku Channel', 457: 'Plex',
};
export const FREE_PRIORITY: number[] = [73, 300, 207, 457];

interface LibraryCounts {
  tvShows: number; movies: number; total: number;
  dramaTV: number; dramaMovies: number; realityTV: number;
  familyTV: number; highlyRatedTV: number; highlyRatedMovies: number;
}

const LIBRARY_COUNTS: Record<PlatformKey, LibraryCounts> = {
  'prime-video':    { tvShows: 4563, movies: 22017, total: 26580, dramaTV: 1468, dramaMovies: 8161, realityTV: 560,  familyTV: 305, highlyRatedTV: 261, highlyRatedMovies: 194 },
  netflix:          { tvShows: 3325, movies: 4536,  total: 7861,  dramaTV: 1587, dramaMovies: 1755, realityTV: 364,  familyTV: 260, highlyRatedTV: 544, highlyRatedMovies: 199 },
  'hbo-max':        { tvShows: 1762, movies: 2067,  total: 3829,  dramaTV: 317,  dramaMovies: 672,  realityTV: 597,  familyTV: 33,  highlyRatedTV: 142, highlyRatedMovies: 211 },
  hulu:             { tvShows: 1820, movies: 1252,  total: 3072,  dramaTV: 608,  dramaMovies: 445,  realityTV: 377,  familyTV: 37,  highlyRatedTV: 304, highlyRatedMovies: 54 },
  'mgm-plus':       { tvShows: 54,   movies: 2379,  total: 2433,  dramaTV: 21,   dramaMovies: 997,  realityTV: 1,    familyTV: 0,   highlyRatedTV: 8,   highlyRatedMovies: 41 },
  'disney-plus':    { tvShows: 872,  movies: 1532,  total: 2404,  dramaTV: 142,  dramaMovies: 209,  realityTV: 153,  familyTV: 169, highlyRatedTV: 106, highlyRatedMovies: 113 },
  peacock:          { tvShows: 1124, movies: 1034,  total: 2158,  dramaTV: 365,  dramaMovies: 399,  realityTV: 211,  familyTV: 29,  highlyRatedTV: 131, highlyRatedMovies: 42 },
  crunchyroll:      { tvShows: 1798, movies: 258,   total: 2056,  dramaTV: 504,  dramaMovies: 75,   realityTV: 2,    familyTV: 43,  highlyRatedTV: 308, highlyRatedMovies: 34 },
  'discovery-plus': { tvShows: 1751, movies: 283,   total: 2034,  dramaTV: 73,   dramaMovies: 6,    realityTV: 906,  familyTV: 0,   highlyRatedTV: 12,  highlyRatedMovies: 0 },
  'paramount-plus': { tvShows: 674,  movies: 970,   total: 1644,  dramaTV: 176,  dramaMovies: 249,  realityTV: 110,  familyTV: 68,  highlyRatedTV: 109, highlyRatedMovies: 47 },
  'amc-plus':       { tvShows: 267,  movies: 1283,  total: 1550,  dramaTV: 126,  dramaMovies: 439,  realityTV: 13,   familyTV: 0,   highlyRatedTV: 23,  highlyRatedMovies: 25 },
  starz:            { tvShows: 51,   movies: 551,   total: 602,   dramaTV: 33,   dramaMovies: 191,  realityTV: 1,    familyTV: 0,   highlyRatedTV: 12,  highlyRatedMovies: 7 },
  'apple-tv':       { tvShows: 211,  movies: 102,   total: 313,   dramaTV: 94,   dramaMovies: 31,   realityTV: 5,    familyTV: 33,  highlyRatedTV: 37,  highlyRatedMovies: 19 },
};

export function mapStatus(tmdbStatus: string, nextEpisodeDate?: string | null): ShowStatus {
  const s = (tmdbStatus || '').toLowerCase();
  if (s === 'ended' || s === 'canceled') return 'ended';
  if (s === 'planned') return 'upcoming';
  if (s === 'returning series' || s === 'in production') {
    if (!nextEpisodeDate) return 'between-seasons';
    const diffDays = (new Date(nextEpisodeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0) return 'between-seasons';
    if (diffDays <= 30) return 'airing';
    return 'upcoming';
  }
  return 'between-seasons';
}

export function getStatusLabel(status: ShowStatus): string {
  return { airing: 'Currently Airing', ended: 'Ended', upcoming: 'New Season Coming', 'between-seasons': 'Between Seasons' }[status];
}

export function getStatusColor(status: ShowStatus): string {
  return { airing: '#22C55E', ended: '#9CA3AF', upcoming: '#3B82F6', 'between-seasons': '#F59E0B' }[status];
}

export function calculateCancelDate(status: ShowStatus, seasonFinaleDate?: string | null): { cancelDate: string | null; cancelDateLabel: string | null } {
  if (status !== 'airing' || !seasonFinaleDate) return { cancelDate: null, cancelDateLabel: null };
  const finale = new Date(seasonFinaleDate);
  const cancelBy = new Date(finale);
  cancelBy.setDate(cancelBy.getDate() + 7);
  const month = cancelBy.toLocaleString('en-US', { month: 'short' });
  return { cancelDate: cancelBy.toISOString().split('T')[0], cancelDateLabel: `Cancel after ${month} ${cancelBy.getDate()}, ${cancelBy.getFullYear()}` };
}

export function resolveAllProviders(providerIds: number[], userPlatforms: PlatformKey[]): { platformKey: PlatformKey; name: string; color: string; price: number }[] {
  const seen = new Set<PlatformKey>();
  const results: { platformKey: PlatformKey; name: string; color: string; price: number }[] = [];
  for (const id of providerIds) {
    const key = PROVIDER_MAP[id];
    if (key && userPlatforms.includes(key) && !seen.has(key)) {
      seen.add(key);
      const p = PLATFORMS[key];
      results.push({ platformKey: key, name: p.name, color: p.color, price: p.price });
    }
  }
  return results;
}

// Resolve ALL providers regardless of user subscriptions (for missing platform detection)
export function resolveAllProvidersGlobal(providerIds: number[]): { platformKey: PlatformKey; name: string; color: string; price: number }[] {
  const seen = new Set<PlatformKey>();
  const results: { platformKey: PlatformKey; name: string; color: string; price: number }[] = [];
  for (const id of providerIds) {
    const key = PROVIDER_MAP[id];
    if (key && !seen.has(key)) {
      seen.add(key);
      const p = PLATFORMS[key];
      results.push({ platformKey: key, name: p.name, color: p.color, price: p.price });
    }
  }
  return results;
}

export function pickBestPlatform(
  allPlatforms: { platformKey: PlatformKey; name: string; color: string; price: number }[],
  platformsBeingKept?: Set<PlatformKey>,
): { chosen: PlatformKey | null; reason: string } {
  if (allPlatforms.length === 0) return { chosen: null, reason: '' };
  if (allPlatforms.length === 1) return { chosen: allPlatforms[0].platformKey, reason: '' };
  if (platformsBeingKept) {
    const keptOptions = allPlatforms.filter((p) => platformsBeingKept.has(p.platformKey));
    if (keptOptions.length > 0) {
      const best = keptOptions.sort((a, b) => a.price - b.price)[0];
      const others = allPlatforms.filter((p) => p.platformKey !== best.platformKey);
      return { chosen: best.platformKey, reason: `Already keeping ${best.name} — saves you from needing ${others.map((o) => o.name).join(' or ')}` };
    }
  }
  const sorted = [...allPlatforms].sort((a, b) => {
    if (a.price !== b.price) return a.price - b.price;
    return (LIBRARY_COUNTS[b.platformKey]?.total || 0) - (LIBRARY_COUNTS[a.platformKey]?.total || 0);
  });
  const best = sorted[0];
  const others = allPlatforms.filter((p) => p.platformKey !== best.platformKey);
  let reason = '';
  if (best.price < Math.min(...others.map((o) => o.price))) { reason = `Cheapest option at $${best.price}/mo`; }
  else { reason = `Best value with ${LIBRARY_COUNTS[best.platformKey]?.total.toLocaleString() || '?'} total titles at $${best.price}/mo`; }
  return { chosen: best.platformKey, reason };
}

export function resolveFreeProvider(freeProviderIds: number[]): FreePlatform | null {
  for (const id of FREE_PRIORITY) { if (freeProviderIds.includes(id)) return { id, name: FREE_PROVIDER_MAP[id] }; }
  return null;
}

export function detectScenario(showCount: number, platformCount: number, hasQuiz: boolean): Scenario {
  if (showCount === 0 && hasQuiz) return 'browse-only';
  if (showCount <= 2 && platformCount <= 1 && hasQuiz) return 'light-with-quiz';
  if (showCount <= 2 && platformCount <= 1 && !hasQuiz) return 'light-no-quiz';
  if (showCount >= 6 && platformCount >= 4) return 'power';
  return 'typical';
}

export function decideShow(status: ShowStatus, platformKey: PlatformKey | null, freeOn: FreePlatform | null): { decision: Decision; reason: string } {
  if (freeOn) return { decision: 'free-elsewhere', reason: `Available free with ads on ${freeOn.name}` };
  if (!platformKey) return { decision: 'not-subscribed', reason: 'Not on any of your current subscriptions' };
  switch (status) {
    case 'airing': return { decision: 'keep', reason: 'Currently airing new episodes' };
    case 'ended': return { decision: 'binge-and-cancel', reason: 'Series has ended — binge it and cancel when done' };
    case 'between-seasons': return { decision: 'binge-and-cancel', reason: 'Between seasons — catch up now, resubscribe when new episodes drop' };
    case 'upcoming': return { decision: 'binge-and-cancel', reason: 'New season coming — binge what\'s out now, cancel, resubscribe when it drops' };
    default: return { decision: 'keep', reason: 'Active content' };
  }
}

function decidePlatform(shows: ShowAnalysis[]): { decision: Decision; reason: string } {
  const relevantShows = shows.filter(s => s.decision !== 'not-subscribed');
  const hasAiring = relevantShows.some((s) => s.status === 'airing' && s.decision === 'keep');
  const allFree = relevantShows.every((s) => s.decision === 'free-elsewhere');
  const allBinge = relevantShows.every((s) => s.decision === 'binge-and-cancel' || s.decision === 'free-elsewhere');
  if (relevantShows.length === 0) return { decision: 'cut', reason: 'None of your selected shows are on this platform' };
  if (allFree) return { decision: 'cut', reason: 'All your shows on this platform are free elsewhere' };
  if (hasAiring) return { decision: 'keep', reason: 'You have shows currently airing here' };
  if (relevantShows.every((s) => s.status === 'ended')) return { decision: 'binge-and-cancel', reason: 'All your shows here have ended — binge and cancel' };
  if (allBinge) return { decision: 'binge-and-cancel', reason: 'Nothing currently airing — binge what you need and cancel' };
  return { decision: 'keep', reason: 'Active content worth keeping' };
}

function getPlatformCancelDate(shows: ShowAnalysis[]): { cancelDate: string | null; cancelDateLabel: string | null } {
  const dates = shows.filter((s) => s.cancelDate).map((s) => s.cancelDate!).sort();
  if (dates.length === 0) return { cancelDate: null, cancelDateLabel: null };
  const latest = dates[dates.length - 1];
  const d = new Date(latest);
  return { cancelDate: latest, cancelDateLabel: `Cancel after ${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}` };
}

function estimateBingeTime(shows: ShowAnalysis[]): string {
  const totalSeasons = shows.filter((s) => s.decision === 'binge-and-cancel' || s.decision === 'keep').reduce((sum, s) => sum + (s.seasonCount || 2), 0);
  const hrs = totalSeasons * 10;
  if (hrs <= 20) return '1-2 weeks'; if (hrs <= 50) return '3-4 weeks';
  if (hrs <= 100) return '1-2 months'; return '2+ months';
}

function getRelevantCount(pk: PlatformKey, content: ContentType, audience: Audience): number {
  const lib = LIBRARY_COUNTS[pk];
  let count = 0;
  switch (content) { case 'series': count = lib.dramaTV; break; case 'movies': count = lib.dramaMovies; break; case 'reality': count = lib.realityTV; break; case 'everything': count = lib.total; break; }
  if (audience === 'family') count += lib.familyTV * 3;
  return count;
}

function getQualityCount(pk: PlatformKey): number { const lib = LIBRARY_COUNTS[pk]; return lib.highlyRatedTV + lib.highlyRatedMovies; }

function scorePlatform(pk: PlatformKey, content: ContentType, audience: Audience, priority: Priority): number {
  switch (priority) {
    case 'library': return getRelevantCount(pk, content, audience);
    case 'quality': return getQualityCount(pk);
    case 'cheapest': return (getRelevantCount(pk, content, audience) / PLATFORMS[pk].price) * 10;
  }
}

function buildWhyStatement(pk: PlatformKey, content: ContentType, audience: Audience, priority: Priority, runnerUp: PlatformKey): string {
  const pName = PLATFORMS[pk].name;
  const lib = LIBRARY_COUNTS[pk];

  if (priority === 'quality') {
    const q = getQualityCount(pk);
    const rq = getQualityCount(runnerUp);
    const diff = q - rq;
    if (diff > 0) {
      return `${pName} has ${q.toLocaleString()} highly rated titles, which is ${diff.toLocaleString()} more than ${PLATFORMS[runnerUp].name}. For premium quality content, this is your strongest subscription.`;
    }
    return `${pName} has ${q.toLocaleString()} highly rated titles — the top pick for quality content based on your preferences.`;
  }

  if (priority === 'library') {
    const labels: Record<ContentType, string> = {
      series: 'drama/series titles', movies: 'movie titles',
      reality: 'reality/unscripted titles', everything: 'total titles'
    };
    const myCount = getRelevantCount(pk, content, audience);
    const runnerCount = getRelevantCount(runnerUp, content, audience);
    const diff = myCount - runnerCount;
    if (diff > 0) {
      return `${pName} has ${myCount.toLocaleString()} ${labels[content]}, which is ${diff.toLocaleString()} more than ${PLATFORMS[runnerUp].name}. For the biggest library to browse, this is your best option.`;
    }
    return `${pName} has ${myCount.toLocaleString()} ${labels[content]} — the top pick for browsing based on your preferences.`;
  }

  if (priority === 'cheapest') {
    const perDollar = Math.round(getRelevantCount(pk, content, audience) / PLATFORMS[pk].price);
    return `${pName} gives you ${perDollar} relevant titles per dollar at $${PLATFORMS[pk].price}/mo — the best value for your budget.`;
  }

  return `${pName} is the top pick based on your preferences.`;
}

export function getRecommendation(content: ContentType, audience: Audience, priority: Priority, userPlatforms: PlatformKey[]): BrowsingRecommendation {
  const allKeys = Object.keys(PLATFORMS) as PlatformKey[];
  const scored = allKeys.map((pk) => ({ pk, score: scorePlatform(pk, content, audience, priority), isCurrentSub: userPlatforms.includes(pk) })).sort((a, b) => b.score - a.score);
  const bestCurrent = scored.find((s) => s.isCurrentSub);
  let primary = scored[0];
  if (bestCurrent && scored.indexOf(bestCurrent) <= 2) primary = bestCurrent;
  const runnerUp = scored.find((s) => s.pk !== primary.pk) || scored[1];
  const lib = LIBRARY_COUNTS[primary.pk]; const p = PLATFORMS[primary.pk];
  return {
    name: p.name, platformKey: primary.pk, price: p.price, color: p.color,
    reason: buildReason(primary.pk, content, audience, priority, primary.isCurrentSub),
    whyStatement: buildWhyStatement(primary.pk, content, audience, priority, runnerUp.pk),
    isCurrentSub: primary.isCurrentSub, totalTitles: lib.total, tvShows: lib.tvShows,
    movies: lib.movies, relevantCount: getRelevantCount(primary.pk, content, audience),
  };
}

function buildReason(pk: PlatformKey, content: ContentType, audience: Audience, priority: Priority, isCurrentSub: boolean): string {
  const lib = LIBRARY_COUNTS[pk]; const sub = isCurrentSub ? ' — you already subscribe' : '';
  if (priority === 'library') { const labels: Record<ContentType, string> = { series: `${lib.dramaTV.toLocaleString()} drama/series titles included`, movies: `${lib.dramaMovies.toLocaleString()} drama/movie titles included`, reality: `${lib.realityTV.toLocaleString()} reality/unscripted titles included`, everything: `${lib.total.toLocaleString()} total titles (${lib.tvShows.toLocaleString()} TV + ${lib.movies.toLocaleString()} movies)` }; return labels[content] + sub; }
  if (priority === 'quality') return `${getQualityCount(pk)} highly rated titles (7.5+ rating, 100+ reviews)` + sub;
  if (priority === 'cheapest') { const relevant = getRelevantCount(pk, content, audience); return `${relevant.toLocaleString()} relevant titles at $${PLATFORMS[pk].price}/mo (${Math.round(relevant / PLATFORMS[pk].price)} per dollar)` + sub; }
  return `${lib.total.toLocaleString()} titles included` + sub;
}

export const CANCEL_URLS: Record<PlatformKey, { url: string; steps: string }> = {
  netflix:          { url: 'https://www.netflix.com/cancelplan', steps: 'Go to netflix.com/cancelplan and click "Finish Cancellation"' },
  hulu:             { url: 'https://secure.hulu.com/account', steps: 'Click "Cancel Your Subscription" under Your Subscription' },
  'disney-plus':    { url: 'https://www.disneyplus.com/account', steps: 'Select your subscription, click "Cancel Subscription"' },
  'hbo-max':        { url: 'https://www.max.com/account', steps: 'Select Subscription, click "Cancel Subscription"' },
  peacock:          { url: 'https://www.peacocktv.com/account/plan', steps: 'Select your plan, click "Cancel Plan"' },
  'paramount-plus': { url: 'https://www.paramountplus.com/account/', steps: 'Click "Cancel Subscription" under Subscription & Billing' },
  'apple-tv':       { url: 'https://support.apple.com/en-us/HT202039', steps: 'Settings > your name > Subscriptions > Apple TV+' },
  'prime-video':    { url: 'https://www.amazon.com/gp/video/settings', steps: 'Amazon account > Prime membership > "End Membership"' },
  'amc-plus':       { url: 'https://www.amcplus.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
  starz:            { url: 'https://www.starz.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
  'discovery-plus': { url: 'https://www.discoveryplus.com/account', steps: 'Subscription > click "Cancel Subscription"' },
  crunchyroll:      { url: 'https://www.crunchyroll.com/account/membership', steps: 'Account Settings > Premium Membership > "Cancel"' },
  'mgm-plus':       { url: 'https://www.mgmplus.com/account', steps: 'Go to Account, click "Cancel Subscription"' },
};

export function generateGoogleCalendarUrl(platformName: string, cancelDate: string, price: number, platformKey: PlatformKey): string {
  const cancelUrl = CANCEL_URLS[platformKey]?.url || '';
  const details = `Time to cancel ${platformName}! Save $${price}/mo ($${(price * 12).toFixed(2)}/yr). Cancel: ${cancelUrl}. Powered by SavFlix`;
  const d = new Date(cancelDate); const start = d.toISOString().split('T')[0].replace(/-/g, '');
  const end = new Date(d.getTime() + 86400000).toISOString().split('T')[0].replace(/-/g, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Cancel ${platformName} subscription`)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
}

export function generateICSContent(platformName: string, cancelDate: string, price: number, platformKey: PlatformKey): string {
  const d = new Date(cancelDate); const start = d.toISOString().split('T')[0].replace(/-/g, '');
  const end = new Date(d.getTime() + 86400000).toISOString().split('T')[0].replace(/-/g, '');
  const cancelUrl = CANCEL_URLS[platformKey]?.url || '';
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//SavFlix//EN','BEGIN:VEVENT',`DTSTART;VALUE=DATE:${start}`,`DTEND;VALUE=DATE:${end}`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z`,`SUMMARY:Cancel ${platformName} subscription`,`DESCRIPTION:Cancel ${platformName}! Save $${price}/mo. ${cancelUrl}`,'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY',`DESCRIPTION:Cancel ${platformName} tomorrow`,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
}

export interface ShowInput {
  name: string; tmdbId?: number; providerIds: number[]; freeProviderIds: number[];
  tmdbStatus: string; nextEpisodeDate?: string | null; seasonCount?: number;
  posterPath?: string | null; seasonFinaleDate?: string | null;
  totalEpisodesInSeason?: number | null; lastEpisodeDate?: string | null;
}

export interface Preferences { content: ContentType; audience: Audience; priority: Priority; }

export function analyzeSubscriptions(userPlatforms: PlatformKey[], shows: ShowInput[], preferences?: Preferences | null): AnalysisResult {
  const beforePrice = userPlatforms.reduce((sum, pk) => sum + PLATFORMS[pk].price, 0);
  const browsingPick = preferences ? getRecommendation(preferences.content, preferences.audience, preferences.priority, userPlatforms) : null;

  const platformsBeingKept = new Set<PlatformKey>();
  if (browsingPick?.isCurrentSub) platformsBeingKept.add(browsingPick.platformKey);

  for (const show of shows) {
    const status = mapStatus(show.tmdbStatus, show.nextEpisodeDate);
    const freeOn = resolveFreeProvider(show.freeProviderIds);
    if (status === 'airing' && !freeOn) {
      const allP = resolveAllProviders(show.providerIds, userPlatforms);
      if (allP.length === 1) { platformsBeingKept.add(allP[0].platformKey); }
    }
  }

  const analyzedShows: ShowAnalysis[] = shows.map((show) => {
    const status = mapStatus(show.tmdbStatus, show.nextEpisodeDate);
    const allPlatforms = resolveAllProviders(show.providerIds, userPlatforms);
    const allPlatformsGlobal = resolveAllProvidersGlobal(show.providerIds);
    const freeOn = resolveFreeProvider(show.freeProviderIds);
    let chosen: PlatformKey | null = null;
    let chosenReason: string = '';

    // Find the best missing platform (not in user's subscriptions)
    let missingPlatform: { platformKey: PlatformKey; name: string; price: number } | null = null;
    if (!freeOn && allPlatforms.length === 0 && allPlatformsGlobal.length > 0) {
      // Show is on platforms user doesn't have — find cheapest option
      const cheapest = allPlatformsGlobal.sort((a, b) => a.price - b.price)[0];
      missingPlatform = { platformKey: cheapest.platformKey, name: cheapest.name, price: cheapest.price };
    }

    if (!freeOn) {
      const pick = pickBestPlatform(allPlatforms, platformsBeingKept);
      chosen = pick.chosen; chosenReason = pick.reason;
    }
    const { decision, reason } = decideShow(status, chosen, freeOn);
    const { cancelDate, cancelDateLabel } = calculateCancelDate(status, show.seasonFinaleDate);
    return {
      name: show.name, tmdbId: show.tmdbId, status, statusLabel: getStatusLabel(status),
      decision, reason, platformKey: chosen, freeOn, seasonCount: show.seasonCount,
      nextEpisodeDate: show.nextEpisodeDate || undefined, posterPath: show.posterPath || null,
      cancelDate, cancelDateLabel, seasonFinaleDate: show.seasonFinaleDate || null,
      allPlatforms, chosenReason: allPlatforms.length > 1 && !freeOn ? chosenReason : undefined,
      missingPlatform,
    };
  });

  const platformMap = new Map<PlatformKey, ShowAnalysis[]>();
  for (const show of analyzedShows) {
    if (show.platformKey) { const e = platformMap.get(show.platformKey) || []; e.push(show); platformMap.set(show.platformKey, e); }
  }
  for (const pk of userPlatforms) { if (!platformMap.has(pk)) platformMap.set(pk, []); }

  const platformGroups: PlatformGroup[] = [];
  let monthlySavings = 0;

  for (const [pk, pkShows] of platformMap) {
    const platform = PLATFORMS[pk];
    let gd = pkShows.length === 0 ? { decision: 'cut' as Decision, reason: 'None of your selected shows are on this platform' } : decidePlatform(pkShows);
    if (browsingPick && browsingPick.isCurrentSub && browsingPick.platformKey === pk && (gd.decision === 'cut' || gd.decision === 'binge-and-cancel')) {
      gd = { decision: 'keep-for-browsing', reason: `Best platform for browsing based on your preferences — ${browsingPick.reason}` };
    }
    if (gd.decision === 'cut' || gd.decision === 'binge-and-cancel') monthlySavings += platform.price;
    const platformCancel = getPlatformCancelDate(pkShows);
    platformGroups.push({
      platformKey: pk, name: platform.name, color: platform.color, price: platform.price,
      decision: gd.decision, reason: gd.reason, shows: pkShows,
      bingeEstimate: gd.decision === 'binge-and-cancel' ? estimateBingeTime(pkShows) : undefined,
      cancelDate: platformCancel.cancelDate, cancelDateLabel: platformCancel.cancelDateLabel,
      savingsOnCancel: platformCancel.cancelDate ? platform.price : 0,
    });
  }

  const order: Record<Decision, number> = { keep: 0, 'keep-for-browsing': 1, 'binge-and-cancel': 2, 'free-elsewhere': 3, cut: 4, 'not-subscribed': 5 };
  platformGroups.sort((a, b) => order[a.decision] - order[b.decision]);
  const afterPrice = beforePrice - monthlySavings;

  const missingPlatformShows = analyzedShows.filter(s => s.decision === 'not-subscribed' && s.missingPlatform);

  return {
    platformGroups, freeShows: analyzedShows.filter((s) => s.freeOn !== null),
    missingPlatformShows,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    yearlySavings: Math.round(monthlySavings * 12 * 100) / 100,
    browsingPick, scenario: detectScenario(shows.length, new Set(analyzedShows.map((s) => s.platformKey).filter(Boolean)).size, !!preferences),
    beforePrice: Math.round(beforePrice * 100) / 100, afterPrice: Math.round(afterPrice * 100) / 100,
  };
}

export function formatAnalysisForAI(result: AnalysisResult): string {
  const lines: string[] = ['SUBSCRIPTION ANALYSIS RESULTS', `Savings: $${result.monthlySavings}/mo ($${result.yearlySavings}/yr)`, `Before: $${result.beforePrice}/mo → After: $${result.afterPrice}/mo`, ''];
  for (const g of result.platformGroups) {
    const emoji = { keep: '✅', 'keep-for-browsing': '📺', 'binge-and-cancel': '⏱️', cut: '✂️', 'free-elsewhere': '🆓', 'not-subscribed': '🔒' }[g.decision];
    lines.push(`${emoji} ${g.name} ($${g.price}/mo) — ${g.decision.toUpperCase()}`, `   ${g.reason}`);
    if (g.cancelDateLabel) lines.push(`   📅 ${g.cancelDateLabel}`);
    if (g.bingeEstimate) lines.push(`   Binge time: ${g.bingeEstimate}`);
    for (const s of g.shows) { let l = `   • ${s.name} [${s.statusLabel}] — ${s.reason}`; if (s.allPlatforms.length > 1) l += ` | Also on: ${s.allPlatforms.filter((p) => p.platformKey !== s.platformKey).map((p) => p.name).join(', ')}${s.chosenReason ? ` (${s.chosenReason})` : ''}`; lines.push(l); }
    lines.push('');
  }
  if (result.browsingPick) { const b = result.browsingPick; lines.push(`🎯 BROWSING: ${b.name} ($${b.price}/mo) ${b.isCurrentSub ? 'KEEP' : 'ADD'}`, `   ${b.whyStatement}`); }
  return lines.join('\n');
}