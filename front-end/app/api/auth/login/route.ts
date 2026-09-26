import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const WP = process.env.WORDPRESS_URL ?? 'http://localhost:8080';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    // 1. Получаем JWT токен
    const tokenRes = await fetch(`${WP}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      cache: 'no-store',
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return NextResponse.json(
        { error: tokenData.message ?? 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token: string = tokenData.token || tokenData.data?.token;

    // 2. Получаем профиль пользователя
    const meRes = await fetch(`${WP}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const me = await meRes.json();

    return NextResponse.json({
      token,
      user: {
        id: me.id,
        email: me.email ?? email,
        firstName: me.first_name ?? '',
        lastName: me.last_name ?? '',
        displayName: me.name ?? email,
      },
    });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Connection error' }, { status: 500 });
  }
}