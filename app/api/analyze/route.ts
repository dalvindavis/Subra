// =============================================================================
// SUBRA ANALYZE API ROUTE v3
// No OpenAI — structured data pass-through only (instant results)
// Supports cancel dates, multi-platform transparency, poster/logo paths
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeSubscriptions,
  type PlatformKey,
  type ShowInput,
  type Preferences,
  type ContentType,
  type Audience,
  type Priority,
} from '@/lib/engine';

function mapPreferences(prefs: any): Preferences | null {
  if (!prefs || !prefs.content || !prefs.audience || !prefs.priority) return null;
  const contentMap: Record<string, ContentType> = { 'Series & Dramas': 'series', 'Movies': 'movies', 'Reality & Talk Shows': 'reality', 'A bit of everything': 'everything' };
  const audienceMap: Record<string, Audience> = { 'Just me': 'solo', 'Me + partner': 'partner', 'Family with kids': 'family' };
  const priorityMap: Record<string, Priority> = { 'Cheapest option': 'cheapest', 'Best quality content': 'quality', 'Biggest library to browse': 'library' };
  return {
    content: contentMap[prefs.content] || 'everything',
    audience: audienceMap[prefs.audience] || 'solo',
    priority: priorityMap[prefs.priority] || 'library',
  };
}

const SERVICE_TO_PLATFORM: Record<string, PlatformKey> = {
  'Netflix': 'netflix', 'Hulu': 'hulu', 'Disney+': 'disney-plus',
  'Max': 'hbo-max', 'HBO Max': 'hbo-max', 'HBO/Max': 'hbo-max',
  'Peacock': 'peacock', 'Paramount+': 'paramount-plus', 'Apple TV+': 'apple-tv',
  'Prime Video': 'prime-video', 'Amazon Prime Video': 'prime-video',
  'AMC+': 'amc-plus', 'Starz': 'starz', 'Discovery+': 'discovery-plus',
  'Crunchyroll': 'crunchyroll', 'MGM+': 'mgm-plus',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { services, shows, preferences } = body;
    const userPlatforms: PlatformKey[] = (services || []).map((s: any) => SERVICE_TO_PLATFORM[s.name] || SERVICE_TO_PLATFORM[s]).filter(Boolean);
    const showInputs: ShowInput[] = (shows || []).map((show: any) => ({
      name: show.name, tmdbId: show.tmdbId || show.id,
      providerIds: show.providerIds || [], freeProviderIds: show.freeProviderIds || [],
      tmdbStatus: show.tmdbStatus || show.status || 'Unknown',
      nextEpisodeDate: show.nextEpisodeDate || null, seasonCount: show.seasonCount || undefined,
      posterPath: show.posterPath || show.poster || null,
      seasonFinaleDate: show.seasonFinaleDate || null,
      totalEpisodesInSeason: show.totalEpisodesInSeason || null,
      lastEpisodeDate: show.lastEpisodeDate || null,
    }));
    const mappedPrefs = mapPreferences(preferences);
    const analysis = analyzeSubscriptions(userPlatforms, showInputs, mappedPrefs);
    return NextResponse.json({
      result: '',
      analysis: {
        platformGroups: analysis.platformGroups, freeShows: analysis.freeShows,
        monthlySavings: analysis.monthlySavings, yearlySavings: analysis.yearlySavings,
        browsingPick: analysis.browsingPick, scenario: analysis.scenario,
        beforePrice: analysis.beforePrice, afterPrice: analysis.afterPrice,
      },
    });
  } catch (error: any) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}