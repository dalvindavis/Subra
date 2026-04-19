// =============================================================================
// SUBRA TMDB API ROUTE v4
// ID-based provider resolution, smart status mapping, free platform detection
// Season finale date for cancel dates, platform logo paths
// v4: Added ?logos=true endpoint for verified platform logo paths
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { PROVIDER_MAP, FREE_PROVIDER_MAP, FREE_PRIORITY } from '@/lib/engine';

const TMDB_KEY = process.env.TMDB_API_KEY || '3cbef81f947b81e0413f1ff7fdd0900c';
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function searchShows(query: string) {
  const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
  const data = await res.json();
  return (data.results || [])
    .filter((r: any) => r.media_type === 'tv' || r.media_type === 'movie')
    .slice(0, 8)
    .map((r: any) => ({
      id: r.id, name: r.name || r.title, mediaType: r.media_type,
      year: (r.first_air_date || r.release_date || '').slice(0, 4),
      poster: r.poster_path ? `https://image.tmdb.org/t/p/w92${r.poster_path}` : null,
      posterLarge: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : null,
      overview: r.overview?.slice(0, 120) || '',
    }));
}

async function getProviders(tmdbId: string, mediaType: string = 'tv') {
  const res = await fetch(`${TMDB_BASE}/${mediaType}/${tmdbId}/watch/providers?api_key=${TMDB_KEY}`);
  const data = await res.json();
  const us = data.results?.US || {};

  const flatrate = (us.flatrate || []).map((p: any) => ({
    id: p.provider_id, name: p.provider_name,
    logo: p.logo_path ? `https://image.tmdb.org/t/p/w45${p.logo_path}` : null,
    logoMd: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
  }));

  const free = (us.free || []).map((p: any) => ({
    id: p.provider_id, name: p.provider_name,
    logo: p.logo_path ? `https://image.tmdb.org/t/p/w45${p.logo_path}` : null,
    logoMd: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
  }));

  const ads = (us.ads || []).map((p: any) => ({
    id: p.provider_id, name: p.provider_name,
    logo: p.logo_path ? `https://image.tmdb.org/t/p/w45${p.logo_path}` : null,
    logoMd: p.logo_path ? `https://image.tmdb.org/t/p/w92${p.logo_path}` : null,
  }));

  const allFreeProviders = [...free, ...ads];
  const freeProviderIds = allFreeProviders.map((p: any) => p.id).filter((id: number) => FREE_PROVIDER_MAP[id]);
  const providerIds = flatrate.map((p: any) => p.id);
  const matchedPlatforms = providerIds
    .filter((id: number) => PROVIDER_MAP[id])
    .map((id: number) => ({
      id, platformKey: PROVIDER_MAP[id],
      logo: flatrate.find((f: any) => f.id === id)?.logo || null,
      logoMd: flatrate.find((f: any) => f.id === id)?.logoMd || null,
    }));

  let freeOn: { id: number; name: string; logo?: string | null } | null = null;
  for (const priorityId of FREE_PRIORITY) {
    if (freeProviderIds.includes(priorityId)) {
      const fp = allFreeProviders.find((p: any) => p.id === priorityId);
      freeOn = { id: priorityId, name: FREE_PROVIDER_MAP[priorityId], logo: fp?.logo || null };
      break;
    }
  }

  return {
    providerIds, freeProviderIds, matchedPlatforms, freeOn,
    raw: { flatrate, free: allFreeProviders.filter((p: any) => FREE_PROVIDER_MAP[p.id]), ads: [] },
    noFlatrate: flatrate.length === 0,
  };
}

async function getShowStatus(tmdbId: string, mediaType: string = 'tv') {
  if (mediaType !== 'tv') {
    return { tmdbStatus: 'ended', seasonCount: 1, nextEpisodeDate: null, lastAirDate: null, nextEpisodeInfo: null, seasonFinaleDate: null, totalEpisodesInSeason: null, lastEpisodeDate: null };
  }

  const res = await fetch(`${TMDB_BASE}/tv/${tmdbId}?api_key=${TMDB_KEY}&language=en-US`);
  const data = await res.json();
  const nextEpisodeDate = data.next_episode_to_air?.air_date || null;
  const lastEpisodeDate = data.last_episode_to_air?.air_date || null;
  const seasonCount = data.number_of_seasons || 0;

  let seasonFinaleDate: string | null = null;
  let totalEpisodesInSeason: number | null = null;

  const isAiring = (data.status === 'Returning Series' || data.status === 'In Production') && nextEpisodeDate;

  if (isAiring && seasonCount > 0) {
    try {
      const seasonRes = await fetch(`${TMDB_BASE}/tv/${tmdbId}/season/${seasonCount}?api_key=${TMDB_KEY}&language=en-US`);
      const seasonData = await seasonRes.json();
      if (seasonData.episodes && seasonData.episodes.length > 0) {
        totalEpisodesInSeason = seasonData.episodes.length;
        const episodes = seasonData.episodes.filter((ep: any) => ep.air_date).sort((a: any, b: any) => new Date(b.air_date).getTime() - new Date(a.air_date).getTime());
        if (episodes.length > 0) seasonFinaleDate = episodes[0].air_date;
      }
    } catch (err) {
      console.error(`Failed to fetch season ${seasonCount} for show ${tmdbId}:`, err);
    }
  }

  return {
    tmdbStatus: data.status || 'Unknown', seasonCount, nextEpisodeDate,
    lastAirDate: data.last_air_date || null,
    nextEpisodeInfo: data.next_episode_to_air
      ? { name: data.next_episode_to_air.name, season: data.next_episode_to_air.season_number, episode: data.next_episode_to_air.episode_number, airDate: data.next_episode_to_air.air_date }
      : null,
    seasonFinaleDate, totalEpisodesInSeason, lastEpisodeDate,
  };
}

async function enrichShow(tmdbId: string, mediaType: string = 'tv') {
  const [providers, status] = await Promise.all([getProviders(tmdbId, mediaType), getShowStatus(tmdbId, mediaType)]);
  return { tmdbId: parseInt(tmdbId), mediaType, ...providers, ...status };
}

// ---------------------------------------------------------------------------
// PLATFORM LOGOS — fetches verified logo paths for all 13 platforms from TMDB
// ---------------------------------------------------------------------------

async function getProviderLogos() {
  const res = await fetch(`${TMDB_BASE}/watch/providers/tv?api_key=${TMDB_KEY}&watch_region=US`);
  const data = await res.json();
  const TARGET_IDS: Record<number, string> = {
    8: 'netflix', 15: 'hulu', 337: 'disney-plus', 1899: 'hbo-max',
    386: 'peacock', 2303: 'paramount-plus', 350: 'apple-tv',
    9: 'prime-video', 526: 'amc-plus', 43: 'starz',
    520: 'discovery-plus', 283: 'crunchyroll', 34: 'mgm-plus',
  };
  const logos: Record<string, string> = {};
  for (const provider of (data.results || [])) {
    if (TARGET_IDS[provider.provider_id] && provider.logo_path) {
      logos[TARGET_IDS[provider.provider_id]] = `https://image.tmdb.org/t/p/w92${provider.logo_path}`;
    }
  }
  return logos;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  try {
    const query = searchParams.get('query');
    if (query) { const results = await searchShows(query); return NextResponse.json({ results }); }

    const enrichId = searchParams.get('enrich');
    if (enrichId) { const mediaType = searchParams.get('mediaType') || 'tv'; const data = await enrichShow(enrichId, mediaType); return NextResponse.json(data); }

    const providersId = searchParams.get('providers');
    if (providersId) { const mediaType = searchParams.get('mediaType') || 'tv'; const data = await getProviders(providersId, mediaType); return NextResponse.json(data); }

    const statusId = searchParams.get('status');
    if (statusId) { const mediaType = searchParams.get('mediaType') || 'tv'; const data = await getShowStatus(statusId, mediaType); return NextResponse.json(data); }

    const logosParam = searchParams.get('logos');
    if (logosParam) {
      const logos = await getProviderLogos();
      return NextResponse.json({ logos });
    }

    return NextResponse.json({ error: 'Missing query parameter. Use ?query=, ?enrich=, ?providers=, ?status=, or ?logos=true' }, { status: 400 });
  } catch (error: any) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: error.message || 'TMDB API error' }, { status: 500 });
  }
}