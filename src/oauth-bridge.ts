export interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  provider: string;
}

export class OAuthBridgeService {
  public async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    // Simulated Serverless OAuth Bridge handshake
    return {
      access_token: `mock_access_token_${code}`,
      refresh_token: `mock_refresh_token_${code}`,
      expires_in: 3600,
      provider: "google_calendar",
    };
  }
}
