const { buildPlayerPayload } = require('./builders/playerDataBuilder');
const { createHttpClient } = require('./utils/httpClient');

/**
 * Responsible for orchestrating player creation through the Gateway service.
 * Combines payload building, HTTP communication and light response mapping.
 */

class PlayerService {
  /**
   * @param {Object} options
   * @param {string} options.gatewayUrl Base URL for the Gateway service (e.g. https://gateway.test)
   * @param {Object} [options.httpClient] Custom HTTP client implementation
   * @param {number} [options.timeout] Timeout in milliseconds for the default HTTP client
   * @param {Object} [options.headers] Default headers applied to every request
   */
  constructor(options = {}) {
    const {
      gatewayUrl,
      httpClient,
      timeout,
      headers
    } = options;

    if (!gatewayUrl) {
      throw new Error('gatewayUrl is required to initialise PlayerService');
    }

    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
    this.httpClient = httpClient || createHttpClient({
      timeout,
      headers
    });
  }

  /**
   * Creates a new player via the Gateway service.
   *
   * @param {Object} options
   * @param {string} options.franchiseCode Franchise code to target (e.g. SWEDEN_COMEON)
   * @returns {Promise<Object>} Minimal player details required by consumers
   */
  async createPlayer(options = {}) {
    const { franchiseCode } = options;

    if (!franchiseCode) {
      throw new Error('franchiseCode is required');
    }

    const { payload, profile } = buildPlayerPayload({
      franchiseCode
    });

    const url = `${this.gatewayUrl}/player/`;

    const response = await this.httpClient.post(url, payload);
    const data = response.data || response;

    const result = {
      playerId: data.playerId,
      username: data.username,
      email: data.email,
      sessionId: data.sessionId,
      password: payload.password,
      firstName: data.firstName,
      lastName: data.lastName,
      personalNumber: data.personalNumber
    };
    return result;
  }
}

module.exports = PlayerService;

