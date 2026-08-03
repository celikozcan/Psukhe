# Psukhe Games and Achievements

This folder contains a small Steam metadata importer for the Games_and_Achivements workflow. It collects game details and achievement schema information from Steam APIs and prepares JSON/CSV exports that can be used in the wider project.

## What it does

- accepts Steam App IDs and a Steam Web API key
- fetches Steam game metadata from the Steam Store API
- fetches Steam achievement schemas from the Steam Web API
- writes a JSON export and optional CSV with achievements

## Local setup

```powershell
cd Games_and_Achivements
npm install
npm run build
```

## Quick start

```powershell
cd Games_and_Achivements
fetch-game-schema.cmd 440
```

This reads the API key from SteamApi.txt and writes:

- games.json
- achievements.csv

You can also fetch multiple apps at once:

```powershell
fetch-game-schema.cmd 440 570 570
```

Or supply App IDs from a file:

```powershell
node dist/index.js --app-ids-file appids.txt --output games.json --output-csv achievements.csv
```

## CLI options

- --app-id repeated to fetch multiple games
- --app-ids-file path to a newline-separated list of App IDs
- --api-key Steam Web API key
- --api-key-file optional path for the API key
- --output JSON database export path
- --output-csv CSV path for achievements
- --concurrency number of parallel fetches (default 4)
- --help show usage

## Notes

This tool is separate from steam-ingestion, which focuses on user-owned Steam profile data. Games_and_Achivements is intended for game and achievement metadata labeling.
