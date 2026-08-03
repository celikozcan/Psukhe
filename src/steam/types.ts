export interface SteamAppDetails {
  appId: number;
  name: string;
  type: string;
  shortDescription: string;
  description?: string;
  developers: string[];
  publishers: string[];
  releaseDate: {
    comingSoon: boolean;
    date: string;
  };
  headerImage: string;
  categories: string[];
  genres: string[];
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
}

export interface SteamAchievementDefinition {
  apiname: string;
  name: string;
  description: string;
  hidden: boolean;
  icon: string;
  icongray: string;
  defaultValue: number | null;
}

export interface SteamGameSchema {
  appId: number;
  gameName: string;
  achievements: SteamAchievementDefinition[];
  achievementsCount: number;
  gameDetails?: SteamAppDetails;
}
