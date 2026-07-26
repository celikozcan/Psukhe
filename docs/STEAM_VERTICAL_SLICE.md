# Steam Achievement Vertical Slice

This is Psukhe's first product path. It deliberately uses a narrow, user-authorised Steam import before any other platform or behavioural scoring system is added.

## Outcome

A person can securely link a Steam account, choose a limited set of eligible games, import achievement facts, and see a clear evidence view. The result is an evidence base for later interpretation—not a personality verdict, diagnosis, or comprehensive description of the person.

## Access decision

Use Steam OpenID to verify that the person controls the Steam account and obtain its SteamID. Use a Psukhe server-held standard Steam Web API key to request only the agreed public data. The key is never delivered to the browser or stored in source control.

Steam documents OpenID account linking and the SteamID claim format in its [authentication guidance](https://partner.steamgames.com/doc/features/auth). Its [Web API key guidance](https://partner.steamgames.com/doc/webapi_overview/auth) distinguishes standard user keys from publisher-only keys. This first slice does not require Psukhe to own any game's publisher key.

A private profile, private game details, unavailable achievements, or an API error is an availability limitation. It is never evidence that a person did not play, attempt, or value something.

## Import flow

1. The person reads a short consent screen describing the requested data and its limits.
2. They authenticate with Steam OpenID. Psukhe verifies the response and records the linked SteamID against their Psukhe account.
3. The server requests profile visibility and the owned-games list, then shows which games are eligible for import.
4. The person selects the games to include and starts an import.
5. For each selected game, the server requests the player's achievement status and the game's achievement schema.
6. Psukhe normalises the response, reports any partial or unavailable data, and shows an evidence view grouped by game.
7. The person can delete the import and disconnect the Steam account.

The user must make the game selection. The first version will not silently analyse an entire library.

## Source data

| Purpose | Steam interface | Minimum data used |
| --- | --- | --- |
| Verify display context and visibility | `ISteamUser/GetPlayerSummaries/v2` | SteamID, display name when available, profile visibility |
| Find eligible games | `IPlayerService/GetOwnedGames/v1` | app ID, game name when available, total playtime when available |
| Read achievement status | `ISteamUserStats/GetPlayerAchievements/v1` | app ID, achievement API name, unlocked flag, unlock time when supplied |
| Explain achievement meaning | `ISteamUserStats/GetSchemaForGame/v2` | achievement API name, display name, description, hidden flag |

Valve documents `GetOwnedGames` as returning games that are visible to the caller, and documents `GetPlayerAchievements` and `GetSchemaForGame` as requiring a SteamID/app ID and a user Web API key. See [IPlayerService](https://partner.steamgames.com/doc/webapi/IPlayerService?l=english), [ISteamUserStats](https://partner.steamgames.com/doc/webapi/ISteamUserStats?l=english), and [ISteamUser](https://partner.steamgames.com/doc/webapi/ISteamUser?l=english).

## Normalised achievement record

Every imported record retains: import ID; source; SteamID; app ID; achievement API name; Steam-provided name and description; hidden and unlocked status; supplied unlock time; observed-at time; source response version; and availability status.

An unlock time is optional. Missing timestamps, missing descriptions, and games without a usable schema remain explicit unknowns; they are not fabricated or inferred.

## First evidence experience

For each selected game, show:

- import status: complete, partial, unavailable, or failed;
- achievement count with a clear statement of what the source returned;
- individual achievements, their unlock state, unlock time when supplied, and Steam-provided text;
- a direct link from every future insight to the exact normalised records and interpretation rule that support it.

Before Psukhe displays behavioural language, this evidence screen must work on its own and let a person correct their understanding of the data.

## Explicit exclusions

This slice excludes Xbox, Blizzard, other platforms, gameplay telemetry, chat/social data, public sharing, cross-user comparison, machine-learning inference, and clinical or personality labels. It also excludes any use of Steam publisher-only APIs.

## Security and privacy requirements

- Verify the OpenID response server-side and protect the session against request forgery.
- Keep the Steam Web API key in server-side secret storage only.
- Request and retain only data required for the selected import.
- Record the source and time of each import so it can be explained or deleted.
- Provide a visible disconnect and deletion path before any public launch.
- Treat SteamIDs and profile data as personal data in the privacy design.

The precise retention period and legal/privacy notice remain decisions to make before public use. Until then, implementation should default to the smallest practical retention and avoid long-lived raw API payloads.

## Acceptance checks

The vertical slice is ready for implementation only when it can demonstrate all of the following:

1. A Steam account link is verified through Steam OpenID.
2. The server, not the browser, performs authenticated API requests.
3. A public eligible profile can import one or more user-selected games without exposing the API key.
4. A private or incomplete profile produces an understandable availability result rather than a behavioural conclusion.
5. Each displayed fact can be traced to its Steam source, import time, app ID, and achievement API name.
6. The person can disconnect and delete their imported data.

## Deferred decisions

We will decide together before broad implementation:

- the retention duration for normalised data and logs;
- the initial behavioural ontology and its review process;
- the exact consent wording and privacy notice;
- whether Steam imports are limited by an operational game cap, and how that cap is communicated.
