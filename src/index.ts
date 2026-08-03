import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { fetchGameSchemas, fetchGameDetails } from "./steam/api.js";
import { buildAchievementCsv } from "./steam/export.js";
import type { SteamGameSchema } from "./steam/types.js";

interface CliOptions {
  apiKey?: string;
  apiKeyFile?: string;
  appIds: number[];
  appIdsFile?: string;
  output?: string;
  outputCsv?: string;
  concurrency: number;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    appIds: [],
    concurrency: 4,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    const next = argv[i + 1];

    switch (value) {
      case "--api-key":
      case "-k":
        if (next) {
          options.apiKey = next;
          i += 1;
        }
        break;
      case "--api-key-file":
      case "-f":
        if (next) {
          options.apiKeyFile = next;
          i += 1;
        }
        break;
      case "--app-id":
      case "-a":
        if (next) {
          options.appIds.push(Number(next));
          i += 1;
        }
        break;
      case "--app-ids-file":
      case "-A":
        if (next) {
          options.appIdsFile = next;
          i += 1;
        }
        break;
      case "--output":
      case "-o":
        if (next) {
          options.output = next;
          i += 1;
        }
        break;
      case "--output-csv":
      case "-c":
        if (next) {
          options.outputCsv = next;
          i += 1;
        }
        break;
      case "--concurrency":
      case "-n":
        if (next) {
          options.concurrency = Number(next);
          i += 1;
        }
        break;
      case "--help":
      case "-h":
        printHelpAndExit();
        break;
    }
  }

  return options;
}

function resolveApiKey(options: CliOptions, baseDir: string): string | null {
  if (options.apiKey) {
    return options.apiKey;
  }

  const apiKeyFile = options.apiKeyFile ?? path.resolve(baseDir, "SteamApi.txt");
  if (!fs.existsSync(apiKeyFile)) {
    return null;
  }

  const content = fs.readFileSync(apiKeyFile, "utf8").trim();
  return content || null;
}

function readAppIdsFromFile(filePath: string): number[] {
  const contents = fs.readFileSync(filePath, "utf8");
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(Number)
    .filter((id) => Number.isFinite(id) && id > 0);
}

function printHelpAndExit(): void {
  console.log(`Usage: node dist/index.js [options]

Options:
  --api-key, -k         Steam Web API key
  --api-key-file, -f    Path to Steam API key file (default: SteamApi.txt)
  --app-id, -a          Steam App ID to fetch (repeatable)
  --app-ids-file, -A    Path to newline-separated App IDs file
  --output, -o          Output JSON file path
  --output-csv, -c      Output achievements CSV file path
  --concurrency, -n     Number of concurrent requests (default 4)
  --help, -h            Show this help message
`);
  process.exit(0);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const currentFile = fileURLToPath(import.meta.url);
  const projectRoot = path.dirname(currentFile);

  const apiKey = resolveApiKey(options, projectRoot);
  if (!apiKey) {
    throw new Error("Missing Steam API key. Provide --api-key or create SteamApi.txt with the key.");
  }

  const appIds = [...options.appIds];
  if (options.appIdsFile) {
    const fileIds = readAppIdsFromFile(path.resolve(options.appIdsFile));
    appIds.push(...fileIds);
  }

  if (appIds.length === 0) {
    throw new Error("No app IDs provided. Use --app-id or --app-ids-file.");
  }

  console.log(`Fetching metadata for ${appIds.length} Steam app(s)...`);
  const games = await fetchGameSchemas(appIds, apiKey, options.concurrency);

  const output = {
    generatedAt: new Date().toISOString(),
    appCount: games.length,
    games,
  };

  if (options.output) {
    fs.writeFileSync(path.resolve(options.output), JSON.stringify(output, null, 2), "utf8");
    console.log(`Wrote JSON database export to ${options.output}`);
  }

  if (options.outputCsv) {
    fs.writeFileSync(path.resolve(options.outputCsv), buildAchievementCsv(games), "utf8");
    console.log(`Wrote achievements CSV to ${options.outputCsv}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
