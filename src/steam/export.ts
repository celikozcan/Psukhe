import type { SteamGameSchema } from "./types.js";

type AchievementCsvRow = {
  appId: number;
  gameName: string;
  apiname: string;
  name: string;
  description: string;
  hidden: boolean;
  icon: string;
  icongray: string;
};

function escapeCsv(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function buildAchievementCsv(games: SteamGameSchema[]): string {
  const rows: AchievementCsvRow[] = games.flatMap((game) =>
    game.achievements.map((achievement) => ({
      appId: game.appId,
      gameName: game.gameName,
      apiname: achievement.apiname,
      name: achievement.name,
      description: achievement.description,
      hidden: achievement.hidden,
      icon: achievement.icon,
      icongray: achievement.icongray,
    }))
  );

  const header = [
    "appId",
    "gameName",
    "apiname",
    "name",
    "description",
    "hidden",
    "icon",
    "icongray",
  ]
    .map(escapeCsv)
    .join(",");

  const body = rows
    .map((row) =>
      [
        String(row.appId),
        row.gameName,
        row.apiname,
        row.name,
        row.description,
        row.hidden ? "1" : "0",
        row.icon,
        row.icongray,
      ]
        .map(escapeCsv)
        .join(",")
    )
    .join("\n");

  return `${header}\n${body}`;
}
