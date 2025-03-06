import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic認証のユーザー名とパスワードを環境変数から取得
// 環境変数が設定されていない場合はデフォルト値を使用
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12password34';

// Basic認証のヘッダーを検証する関数
function verifyBasicAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  // Basic認証のヘッダーからユーザー名とパスワードを取得
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // ユーザー名とパスワードを検証
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// ミドルウェア関数
export function middleware(req: NextRequest) {
  // 管理画面のパスかどうかを確認
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Basic認証の検証
    if (!verifyBasicAuth(req)) {
      // 認証失敗時はBasic認証を要求するレスポンスを返す
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  // 認証成功時または管理画面以外のパスの場合は通常のレスポンスを返す
  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ['/admin/:path*'],
};
