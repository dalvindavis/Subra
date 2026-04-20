// =============================================================================
// SAVFLIX ANALYZE API ROUTE v4
// Adds: scan limit enforcement, analysis saving to Supabase
// =============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  analyzeSubscriptions,
  type PlatformKey,
  type ShowInput,
  type Preferences,
  type ContentType,
  type Audience,
  type Priority,
} from '@/lib/engine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

const FREE_SCAN_LIMIT = 3;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { services, shows, preferences, userId } = body;

    // Check scan limit for free users
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, scan_count, scan_reset_date')
        .eq('id', userId)
        .single();

      if (profile && profile.plan === 'free') {
        // Reset count monthly
        const resetDate = new Date(profile.scan_reset_date);
        const now = new Date();
        if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
          await supabase
            .from('profiles')
            .update({ scan_count: 0, scan_reset_date: now.toISOString().split('T')[0] })
            .eq('id', userId);
          profile.scan_count = 0;
        }

        if (profile.scan_count >= FREE_SCAN_LIMIT) {
          return NextResponse.json(
            { error: 'scan_limit_reached', scansUsed: profile.scan_count, limit: FREE_SCAN_LIMIT },
            { status: 403 }
          );
        }
      }
    }

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

    const responseData = {
      platformGroups: analysis.platformGroups, freeShows: analysis.freeShows,
      monthlySavings: analysis.monthlySavings, yearlySavings: analysis.yearlySavings,
      browsingPick: analysis.browsingPick, scenario: analysis.scenario,
      beforePrice: analysis.beforePrice, afterPrice: analysis.afterPrice,
    };

    // Save analysis and increment scan count
    if (userId) {
      await Promise.all([
        supabase.from('analyses').insert({
          user_id: userId,
          subscriptions: services,
          shows: shows,
          preferences: preferences,
          results: responseData,
          monthly_savings: analysis.monthlySavings,
          yearly_savings: analysis.yearlySavings,
        }),
        supabase.rpc('increment_scan_count', { user_id_input: userId }),
      ]);
    }

    return NextResponse.json({ result: '', analysis: responseData });
  } catch (error: any) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}