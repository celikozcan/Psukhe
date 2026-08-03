import type { SteamAppDetails, SteamGameSchema, SteamAchievementDefinition } from "./types.js";

const STEAM_WEB_API = "https://api.steampowered.com";
const STEAM_STORE_API = "https://store.steampowered.com/api/appdetails";

function buildUrl(base: string, params: Record<string, string | number>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchGameDetails(appId: number): Promise<SteamAppDetails> {
  const url = buildUrl(STEAM_STORE_API, {
    appids: appId,
    cc: "us",
    l: "english",
  });

  const data = await fetchJson<Record<string, { success: boolean; data: any }>>(url);
  const result = data[String(appId)];

  if (!result || !result.success) {
    throw new Error(`Steam store API did not return details for app ${appId}`);
  }

  const details = result.data;
  return {
    appId,
    name: details.name || "",
    type: details.type || "",
    shortDescription: details.short_description || "",
    description: details.about_the_game || details.detailed_description || "",
    developers: Array.isArray(details.developers) ? details.developers : [],
    publishers: Array.isArray(details.publishers) ? details.publishers : [],
    releaseDate: {
      comingSoon: details.release_date?.coming_soon ?? false,
      date: details.release_date?.date ?? "",
    },
    headerImage: details.header_image || "",
    categories: Array.isArray(details.categories) ? details.categories.map((item: any) => item.description ?? "") : [],
    genres: Array.isArray(details.genres) ? details.genres.map((item: any) => item.description ?? "") : [],
    platforms: {
      windows: details.platforms?.windows ?? false,
      mac: details.platforms?.mac ?? false,
      linux: details.platforms?.linux ?? false,
    },
  };
}

export async function fetchAchievementSchema(appId: number, apiKey: string): Promise<SteamAchievementDefinition[]> {
  const url = buildUrl(`${STEAM_WEB_API}/ISteamUserStats/GetSchemaForGame/v2/`, {
    key: apiKey,
    appid: appId,
    l: "english",
  });

  const data = await fetchJson<{ game?: { gameName: string; availableGameStats?: { achievements?: Array<any> } } }>(url);
  const achievements = data.game?.availableGameStats?.achievements ?? [];

  return achievements.map((item) => ({
    apiname: item.apiname ?? "",
    name: item.displayName ?? item.name ?? "",
    description: item.description ?? "",
    hidden: Boolean(item.hidden),
    icon: item.icon ?? "",
    icongray: item.icongray ?? "",
    defaultValue: item.defaultValue ?? null,
  }));
}

export async function fetchGameSchema(appId: number, apiKey: string): Promise<SteamGameSchema> {
  const [details, achievements] = await Promise.all([
    fetchGameDetails(appId).catch(() => undefined),
    fetchAchievementSchema(appId, apiKey).catch(() => []),
  ]);

  return {
    appId,
    gameName: details?.name ?? String(appId),
    achievements,
    achievementsCount: achievements.length,
    gameDetails: details,
  };
}

export async function fetchGameSchemas(appIds: number[], apiKey: string, concurrency = 4): Promise<SteamGameSchema[]> {
  const results: SteamGameSchema[] = [];

  for (let i = 0; i < appIds.length; i += concurrency) {
    const batch = appIds.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async (appId) => {
        try {
          return await fetchGameSchema(appId, apiKey);
        } catch {
          return {
            appId,
            gameName: String(appId),
            achievements: [],
            achievementsCount: 0,
          };
        }
      })
    );
    results.push(...batchResults);
  }

  return results;
}
