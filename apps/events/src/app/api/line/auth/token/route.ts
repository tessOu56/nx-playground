import { type NextRequest, NextResponse } from 'next/server';

// Configure for static export
export const dynamic = 'force-static';
export const revalidate = false;

// LINE OAuth 配置
const LINE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_LINE_CLIENT_ID!,
  clientSecret: process.env.LINE_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI!,
  tokenEndpoint: 'https://api.line.me/oauth2/v2.1/token',
  profileEndpoint: 'https://api.line.me/v2/profile',
};

// 驗證 JWT ID Token 的函數
function decodeIdToken(idToken: string) {
  try {
    // 簡單的 base64 解碼（實際生產環境應使用 JWT 庫驗證簽名）
    const payload = idToken.split('.')[1];
    if (!payload) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
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
            '請檢查 LINE_CLIENT_ID, LINE_CLIENT_SECRET, LINE_REDIRECT_URI 是否正確設置',
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

    // 準備 token 交換請求
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirect_uri || LINE_OAUTH_CONFIG.redirectUri,
      client_id: LINE_OAUTH_CONFIG.clientId,
      client_secret: LINE_OAUTH_CONFIG.clientSecret,
    });

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
          errorData.error_description || errorData.error || errorText;
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

    // 解析 ID token（如果有的話）
    const decodedIdToken = tokenData.id_token
      ? decodeIdToken(tokenData.id_token)
      : null;
    const lineId = decodedIdToken?.sub || profile.userId || null;

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
