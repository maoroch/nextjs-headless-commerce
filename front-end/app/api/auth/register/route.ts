import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const WP = process.env.WORDPRESS_URL ?? 'http://localhost:8080';
const WC_KEY = process.env.WC_CONSUMER_KEY ?? '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET ?? '';

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json();

  try {
    // 1. Создаём покупателя через WooCommerce API
    const regRes = await fetch(
      `${WP}/wp-json/wc/v3/customers?consumer_key=${WC_KEY}&consumer_secret=${WC_SECRET}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          username: email,
        }),
        cache: 'no-store',
      }
    );

    const regData = await regRes.json();

    if (!regRes.ok) {
      return NextResponse.json(
        { error: regData.message ?? 'Registration failed' },
        { status: 400 }
      );
    }

    // 2. Автологин — получаем JWT
    const tokenRes = await fetch(`${WP}/wp-json/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      cache: 'no-store',
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      // Аккаунт создан но автологин не сработал
      return NextResponse.json(
        { error: 'Account created! Please sign in.' },
        { status: 206 }
      );
    }

    const token: string = tokenData.token || tokenData.data?.token;

    // 3. Получаем профиль
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
        firstName: me.first_name ?? firstName,
        lastName: me.last_name ?? lastName,
        displayName: me.name ?? `${firstName} ${lastName}`,
      },
    });
  } catch (e) {
    console.error('Register error:', e);
    return NextResponse.json({ error: 'Connection error' }, { status: 500 });
  }
}