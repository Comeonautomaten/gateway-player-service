# Gateway Player Service

Framework utilities for creating test players through the Gateway service.

## Installation

```bash
npm install @comeonautomaten/gateway-player-service
```

For local development you can clone the repository and install dependencies:

```bash
npm install
```

You can keep environment-specific variables (e.g. `GATEWAY_URL`) in a `.env` file when consuming this module; the repository's `.gitignore` already excludes it from source control.

## Supported Franchises (POC)

- `SWEDEN_COMEON` (license `gga`)
- `POLAND_PZBUK` (license `plga`)
- `CANADA_ONTARIO_COMEON` (license `gga`)

## Testing

The repository ships with a smoke test based on `nock`:

```bash
npm test
```

## Call Flow

`index.js` → `PlayerService#createPlayer` → `buildPlayerPayload` → (`getFranchiseConfig` → `getLicenseDefaults` → `generatePlayerProfile`) → `httpClient.post` → result

## Gateway URL

The service does not hardcode any endpoint. Pass your environment-specific Gateway URL when constructing the service:

```js
const PlayerService = require('@comeonautomaten/gateway-player-service');

const service = new PlayerService({
  gatewayUrl: process.env.GATEWAY_URL
});

const player = await service.createPlayer({
  franchiseCode: 'SWEDEN_COMEON'
});
```
