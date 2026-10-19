import { type NextRequest, NextResponse } from 'next/server';

import {
  LineIdTokenVerificationError,
  verifyLineIdToken,
} from '../../../../../libs/line/verify-id-token';

export const dynamic = 'force-dynamic';

const LEFTOVER_CHANNEL_IDS = new Set(['2007835339']);
const PLACEHOLDER_SECRETS = new Set([
  'your_line_client_secret_here',
  'your_line_client_secret',
]);

function ownerChannelId(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || LEFTOVER_CHANNEL_IDS.has(trimmed)) return '';
  return trimmed;
}

function ownerSecret(value: string | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed || PLACEHOLDER_SECRETS.has(trimmed)) return '';
  return trimmed;
}

function lineOauthConfig() {
  return {
    clientId: ownerChannelId(process.env.NEXT_PUBLIC_LINE_CLIENT_ID),
    clientSecret: ownerSecret(process.env.LINE_CLIENT_SECRET),
    redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI?.trim() ?? '',
    tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
    profileEndpoint: 'https://api.line.me/v2/profile',
  };
}

export async function POST(request: NextRequest) {
  try {
    const LINE_OAUTH_CONFIG = lineOauthConfig();
    // 驗證環境變數
    if (
      !LINE_OAUTH_CONFIG.clientId ||
      !LINE_OAUTH_CONFIG.clientSecret ||
      !LINE_OAUTH_CONFIG.redirectUri
    ) {
      return NextResponse.json(
        {
          error: 'Missing environment variables',
          details:
            'Owner LINE Login channel is not configured (STOP-013). Do not use another organisation’s credentials.',
        },
        { status: 500 }
      );
    }

    // 解析請求體
    const { code, redirect_uri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Missing authorization code' },
        { status: 400 }
      );
    }

    const tokenRequestBody = new URLSearchParams();
    tokenRequestBody.set('grant_type', 'authorization_code');
    tokenRequestBody.set('code', code);
    tokenRequestBody.set(
      'redirect_uri',
      redirect_uri ?? LINE_OAUTH_CONFIG.redirectUri
    );
    tokenRequestBody.set('client_id', LINE_OAUTH_CONFIG.clientId);
    tokenRequestBody.set('client_secret', LINE_OAUTH_CONFIG.clientSecret);

    // 交換 authorization code 獲取 access token
    const tokenResponse = await fetch(LINE_OAUTH_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();

      // 嘗試解析錯誤響應
      let errorDetails = 'Unknown error';
      try {
        const errorData = JSON.parse(errorText);
        errorDetails =
          errorData.error_description ?? errorData.error ?? errorText;
      } catch {
        errorDetails = errorText;
      }

      return NextResponse.json(
        {
          error: 'Failed to exchange authorization code for token',
          status: tokenResponse.status,
          details: errorDetails,
        },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    // 使用 access token 獲取用戶資料
    const profileResponse = await fetch(LINE_OAUTH_CONFIG.profileEndpoint, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!profileResponse.ok) {
      const profileErrorText = await profileResponse.text();

      return NextResponse.json(
        {
          error: 'Failed to get user profile',
          status: profileResponse.status,
          details: profileErrorText,
        },
        { status: 400 }
      );
    }

    const profile = await profileResponse.json();

    if (typeof tokenData.id_token !== 'string' || !tokenData.id_token.trim()) {
      return NextResponse.json(
        { error: 'Missing ID token from LINE token endpoint' },
        { status: 401 }
      );
    }

    let decodedIdToken;
    try {
      decodedIdToken = await verifyLineIdToken({
        idToken: tokenData.id_token,
        clientId: LINE_OAUTH_CONFIG.clientId,
      });
    } catch (error) {
      if (error instanceof LineIdTokenVerificationError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.status }
        );
      }
      return NextResponse.json(
        { error: 'ID token verification failed' },
        { status: 401 }
      );
    }

    const lineId = decodedIdToken.sub;

    // 構建完整的用戶信息
    const userInfo = {
      profile,
      idToken: tokenData.id_token,
      accessToken: tokenData.access_token,
      decodedIdToken,
      lineId,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      refreshToken: tokenData.refresh_token,
    };

    return NextResponse.json(userInfo);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
